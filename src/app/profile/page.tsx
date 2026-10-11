
"use client";

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function ProfilePage() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">(
    "success"
  );

  useEffect(() => {
    if (user) {
      setName(user.name ?? "");
    }
  }, [user?.id, user?.name]);

  useEffect(() => {
    if (!isPending && !user) {
      router.replace("/sign-in");
    }
  }, [isPending, user, router]);

  const handleUpdateName = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    setMessage("");

    const trimmedName = name.trim();

    if (!trimmedName) {
      setMessage("নাম লিখুন।");
      setMessageType("error");
      return;
    }

    if (trimmedName === user?.name) {
      setMessage("আপনার নামের কোনো পরিবর্তন হয়নি।");
      setMessageType("error");
      return;
    }

    setSaving(true);

    try {
      const { error } = await authClient.updateUser({
        name: trimmedName,
      });

      if (error) {
        setMessage("নাম আপডেট করা যায়নি। আবার চেষ্টা করুন।");
        setMessageType("error");
        return;
      }

      setName(trimmedName);
      setMessage("আপনার নাম সফলভাবে আপডেট হয়েছে।");
      setMessageType("success");
    } catch {
      setMessage("একটি সমস্যা হয়েছে। আবার চেষ্টা করুন।");
      setMessageType("error");
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = async () => {
    setSigningOut(true);
    setMessage("");

    try {
      const { error } = await authClient.signOut();

      if (error) {
        setMessage("সাইন আউট করা যায়নি। আবার চেষ্টা করুন।");
        setMessageType("error");
        setSigningOut(false);
        return;
      }

      router.replace("/sign-in");
      router.refresh();
    } catch {
      setMessage("একটি সমস্যা হয়েছে। আবার চেষ্টা করুন।");
      setMessageType("error");
      setSigningOut(false);
    }
  };

  if (isPending || !user) {
    return <main className="min-h-screen bg-[#f1f5f1]" />;
  }

  const initial = user.name?.trim().charAt(0).toUpperCase() || "U";

  return (
    <main className="min-h-screen bg-[#f1f5f1] px-4 py-7">
      <div className="mx-auto w-full max-w-[480px]">
        {/* Page heading */}
        <div className="mb-4">
          <h1 className="text-[22px] font-bold leading-tight text-[#202b24]">
            আমার প্রোফাইল
          </h1>

          <p className="mt-1 text-[11px] text-[#849087]">
            আপনার অ্যাকাউন্টের তথ্য এখানে দেখুন
          </p>
        </div>

        {/* Profile information card */}
        <section className="mb-[14px] flex items-center justify-between gap-3 rounded-xl border border-[#e3eae4] bg-[#fbfdfb] p-[14px]">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#e9eee9] text-lg font-semibold text-[#405448]">
              {user.image ? (
                <img
                  src={user.image}
                  alt="প্রোফাইল ছবি"
                  className="h-full w-full object-cover"
                />
              ) : (
                initial
              )}
            </div>

            <div className="min-w-0">
              <h2 className="truncate text-[13px] font-semibold text-[#29352d]">
                {user.name}
              </h2>

              <p className="truncate text-[11px] text-[#788179]">
                {user.email}
              </p>
            </div>
          </div>

          {/* Sign-out button in the original button position */}
          <button
            type="button"
            onClick={handleSignOut}
            disabled={signingOut}
            className="shrink-0 rounded-md border border-[#ff7777] px-2.5 py-1.5 text-[10px] font-medium text-[#f04444] transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {signingOut ? "সাইন আউট হচ্ছে..." : "↗ সাইন আউট"}
          </button>
        </section>

        {/* Editable information card */}
        <section className="rounded-xl border border-[#e3eae4] bg-[#fbfdfb] p-3">
          <h2 className="mb-5 text-[12px] font-semibold text-[#29352d]">
            তথ্য
          </h2>

          <form onSubmit={handleUpdateName}>
            <label
              htmlFor="profile-name"
              className="mb-1 block pl-3 text-[11px] text-[#39443c]"
            >
              নাম
            </label>

            <input
              ref={inputRef}
              id="profile-name"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="আপনার নাম লিখুন"
              maxLength={100}
              required
              className="mb-[9px] h-7 w-full rounded-md border border-[#e6ece7] bg-transparent px-3 text-xs text-[#29352d] outline-none transition focus:border-[#078743] focus:ring-1 focus:ring-[#078743]/20"
            />

            {message && (
              <p
                role="status"
                className={`mb-2 text-xs ${
                  messageType === "success"
                    ? "text-green-700"
                    : "text-red-600"
                }`}
              >
                {message}
              </p>
            )}

            <button
              type="submit"
              disabled={saving || signingOut}
              className="flex h-[26px] w-full items-center justify-center rounded-md bg-[#078743] text-[11px] font-medium text-white shadow-sm transition hover:bg-[#067238] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? "আপডেট হচ্ছে..." : "আপডেট"}
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
