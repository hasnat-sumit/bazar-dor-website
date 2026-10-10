
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import {
  Avatar,
  Description,
  Dropdown,
  Label,
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

  const userName = session.user.name || "User";
  const userEmail = session.user.email || "";

  const initials = userName
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <Dropdown>
      <Dropdown.Trigger>
        <button
          type="button"
          className="flex cursor-pointer items-center gap-2 rounded-xl p-1 hover:bg-gray-100"
        >
          <Avatar
            size="sm"
            className="bg-green-100 font-bold text-green-700"
          >
            {session.user.image ? (
              <Avatar.Image
                src={session.user.image}
                alt={userName}
              />
            ) : null}
            <Avatar.Fallback>{initials || "U"}</Avatar.Fallback>
          </Avatar>

          <div className="hidden text-left sm:block">
            <p className="text-xs font-semibold text-gray-800">
              {userName}
            </p>
            <p className="text-[10px] text-gray-500">
              {userEmail}
            </p>
          </div>
        </button>
      </Dropdown.Trigger>

      <Dropdown.Popover placement="bottom end">
        <Dropdown.Menu
          aria-label="User actions"
          onAction={(key) => {
            if (key === "logout") {
              void handleSignOut();
            }
          }}
        >
          <Dropdown.Item
            id="profile"
            textValue="Logged-in account"
            isDisabled
          >
            <Label>লগ ইন অ্যাকাউন্ট</Label>
            <Description>{userEmail}</Description>
          </Dropdown.Item>

          <Dropdown.Item
            id="logout"
            textValue="Sign out"
            variant="danger"
          >
            <Label>সাইন আউট</Label>
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown>
  );
};

export default AuthControls;
