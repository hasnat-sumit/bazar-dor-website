
"use client";

import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Avatar,
  Spinner,
} from "@heroui/react";

const AuthControls = () => {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const handleSignOut = async () => {
    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            router.push("/sign-in");
            router.refresh();
          },
        },
      });
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  if (isPending) {
    return (
      <div className="flex shrink-0 items-center justify-center p-2">
        <Spinner size="sm" color="success" />
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="flex shrink-0 items-center gap-2">
        <Link
          href="/sign-in"
          className="inline-flex min-h-9 items-center justify-center whitespace-nowrap rounded-xl bg-gray-100 px-3 text-xs font-medium text-gray-800 transition-colors hover:bg-gray-200 sm:px-4 sm:text-sm"
        >
          সাইন ইন
        </Link>

        <Link
          href="/sign-up"
          className="inline-flex min-h-9 items-center justify-center whitespace-nowrap rounded-xl bg-[#088743] px-3 text-xs font-medium text-white transition-colors hover:bg-green-800 sm:px-4 sm:text-sm"
        >
          সাইন আপ
        </Link>
      </div>
    );
  }

  return (
    <Dropdown placement="bottom-end">
      <DropdownTrigger>
        <button
          type="button"
          className="flex cursor-pointer items-center gap-2 rounded-xl p-1 hover:bg-gray-100"
        >
          <Avatar
            size="sm"
            src={session.user.image || undefined}
            name={session.user.name || "U"}
            className="bg-green-100 font-bold text-green-700"
          />

          <div className="hidden text-left sm:block">
            <p className="text-xs font-semibold text-gray-800">
              {session.user.name}
            </p>
            <p className="text-[10px] text-gray-500">
              {session.user.email}
            </p>
          </div>
        </button>
      </DropdownTrigger>

      <DropdownMenu aria-label="User Actions" variant="flat">
        <DropdownItem key="profile" isReadOnly>
          <div>
            <p className="text-xs font-semibold text-gray-500">
              লগ ইন অ্যাকাউন্ট
            </p>
            <p className="text-xs font-semibold">
              {session.user.email}
            </p>
          </div>
        </DropdownItem>

        <DropdownItem
          key="logout"
          color="danger"
          onPress={handleSignOut}
        >
          সাইন আউট
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};

export default AuthControls;
