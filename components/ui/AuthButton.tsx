"use client";

import { signIn, signOut, useSession } from "next-auth/react";

const AuthButton = () => {
  const { data: session } = useSession();

  if (!session) {
    return (
      <>
        <button
          className="cursor-pointer py-2 px-4 rounded-xl bg-sky-500 text-white"
          onClick={() => signIn("google")}
        >
          Sign in with Google
        </button>
      </>
    );
  }
};

export default AuthButton;
