import { Menu, Transition } from "@headlessui/react";
import { DotsThreeVertical, Pencil, Trash } from "@phosphor-icons/react";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { Fragment, useCallback } from "react";

import { api } from "~/utils/api";

type Props = {
  id: string;
  userId: string;
  ownerId: string;
};

export const ManageSet: React.FC<Props> = ({ id, ownerId, userId }) => {
  const router = useRouter();
  const { mutateAsync } = api.flashcard.remove.useMutation({
    async onSuccess() {
      await router.push("/");
    },
  });
  const handleDelete = useCallback(async () => {
    await mutateAsync(id);
  }, [mutateAsync, id]);

  if (userId !== ownerId) return null;

  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="flex w-full justify-center rounded-3xl p-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 md:bg-blue-500 md:p-5 md:hover:bg-blue-400">
          <DotsThreeVertical
            className="h-8 w-8 text-blue-500 md:h-6 md:w-6 md:text-slate-50"
            aria-hidden="true"
          />
          <span className="sr-only">Manage set</span>
        </Menu.Button>
      </div>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="px-1 py-1">
            <Menu.Item>
              {({ active }) => (
                <Link
                  href={`/flashcardset/${id}/edit`}
                  className={`${
                    active ? "bg-blue-500 text-white" : "text-slate-950"
                  } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                >
                  <Pencil
                    className="mr-2 h-5 w-5"
                    aria-hidden="true"
                    weight={active ? "fill" : undefined}
                  />
                  Edit
                </Link>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <button
                  // eslint-disable-next-line @typescript-eslint/no-misused-promises
                  onClick={handleDelete}
                  className={`${
                    active ? "bg-blue-500 text-white" : "text-slate-950"
                  } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                >
                  <Trash
                    className="mr-2 h-5 w-5"
                    aria-hidden="true"
                    weight={active ? "fill" : undefined}
                  />
                  Delete
                </button>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};
