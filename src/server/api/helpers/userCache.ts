import { clerkClient } from "@clerk/nextjs/server";

import { redis } from "~/server/redis";

type User = {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  profileImageUrl: string;
};

type JsonUser = {
  uname: string;
  fname: string;
  lname: string;
  pimg: string;
  ts: number;
};

const KEY = "u";

// 10 minutes
const LIFETIME = 60_000 * 10;

function isFresh(timestamp: number) {
  return new Date().getTime() - timestamp < LIFETIME;
}

function userFromJson(json: string) {
  try {
    const user = JSON.parse(json) as JsonUser;

    return isFresh(user.ts)
      ? {
          username: user.uname,
          firstName: user.fname,
          lastName: user.lname,
          profileImageUrl: user.pimg,
        }
      : null;
  } catch {
    return null;
  }
}

export async function setUser(id: string, user: User) {
  const json = JSON.stringify({
    uname: user.username,
    fname: user.firstName,
    lname: user.lastName,
    pimg: user.profileImageUrl,
    ts: new Date().getTime(),
  });

  await redis.set(`${KEY}:${id}`, json);
}

async function _getUser(id: string) {
  const user = await clerkClient.users.getUser(id);

  if (!user) return null;

  const userObj = {
    id,
    username: user.username ?? "",
    firstName: user.firstName ?? "",
    lastName: user.lastName ?? "",
    profileImageUrl: user.profileImageUrl,
  };

  await setUser(id, userObj);

  return userObj;
}

export async function getUser(id: string) {
  const userJson = await redis.get(`${KEY}:${id}`);

  if (!userJson) {
    return await _getUser(id);
  }

  const user = userFromJson(userJson);
  if (!user) {
    return await _getUser(id);
  }
  return Object.assign(user, { id });
}

export async function getUserList(ids: string[]) {
  const notFoundIds: string[] = [];

  const users: User[] = [];

  await Promise.all(
    ids.map(async (id) => {
      const userJson = await redis.get(`${KEY}:${id}`);

      if (!userJson) {
        notFoundIds.push(id);
        return;
      }

      const user = userFromJson(userJson);
      if (!user) {
        notFoundIds.push(id);
        return;
      }

      users.push(Object.assign(user, { id }));
    })
  );

  if (notFoundIds.length === 0) {
    return users;
  }

  const notFoundUsers = await clerkClient.users.getUserList({
    userId: notFoundIds,
  });

  await Promise.all(
    notFoundUsers.map(async (user) => {
      const userObj = {
        id: user.id,
        username: user.username ?? "",
        firstName: user.firstName ?? "",
        lastName: user.lastName ?? "",
        profileImageUrl: user.profileImageUrl,
      };

      users.push(userObj);
      await setUser(user.id, userObj);
    })
  );
  return users;
}
