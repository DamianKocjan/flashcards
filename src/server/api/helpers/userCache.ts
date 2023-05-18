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

/** Invalidates cache value by checking creation time of it.
 * If it's older than 10 minutes, it's considered invalid.
 * @param timestamp Timestamp of cache value creation
 * @returns Whether cache value is fresh
 */
function isFresh(timestamp: number) {
  return new Date().getTime() - timestamp < LIFETIME;
}

/** Parses json string and returns user object if it's fresh.
 * Freshness is determined by `isFresh` function.
 * @param json Json string to parse
 * @returns User object if it's fresh, null otherwise
 */
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

/** Sets user in cache */
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

/** Gets user from cache or Clerk if it's not in cache.
 * And then sets it in cache.
 * @param id User id
 * @returns User object
 */
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

/** Gets user from cache or Clerk if it's not in cache.
 * @param id User id
 * @returns User object
 */
export async function getUser(id: string) {
  // get user from cache
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
  // ids which are not in cache
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
