import { createFileRoute } from "@tanstack/react-router";
import { Loader } from "lucide-react";
import { useState } from "react";
import { useLogin } from "../../../domains/auth/api/mutations";

export const Route = createFileRoute("/_unprotected/login/")({
  component: RouteComponent,
});

function RouteComponent() {
  const {
    mutateAsync: login,
    status: loginStatus,
    error: loginError,
  } = useLogin();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="min-h-dvh w-dvw max-w-full relative flex items-center bg-gray-bg justify-center">
      <div className="flex items-center justify-center gap-2 absolute top-6 left-6">
        <Loader className="size-11 stroke-mainaccent" />
        <p className="text-3xl font-semibold">CentraLearn</p>
      </div>
      <div className="flex flex-col gap-12 items-center p-24 shadow-md bg-main-bg rounded-md">
        <p className="text-3xl font-semibold">Login</p>
        <form
          className="flex flex-col gap-5"
          onSubmit={async (e) => {
            e.preventDefault();
            await login({ email, password });
          }}
        >
          <input
            value={email}
            onChange={(e) => setEmail(e.currentTarget.value)}
            placeholder="Email"
            className="px-2 w-[340px] py-3 border-1 rounded-sm border-gray-600 focus:outline-black"
            type="text"
          />
          <input
            value={password}
            onChange={(e) => setPassword(e.currentTarget.value)}
            placeholder="Password"
            className="px-2 w-[340px] py-3 border-1 rounded-sm border-gray-600 focus:outline-black"
            type="text"
          />
          <button
            disabled={loginStatus === "pending"}
            className="flex hover:cursor-pointer disabled:hover:cursor-auto items-center disabled:bg-mainaccent-disabled justify-center gap-4 w-[340px] py-3 text-white rounded-md bg-mainaccent"
          >
            {loginStatus === "pending" ? (
              <Loader className="animate-spin" />
            ) : (
              <p>Login</p>
            )}
          </button>
          {loginStatus === "error" && <p>{loginError.message}</p>}
        </form>
      </div>
    </div>
  );
}
