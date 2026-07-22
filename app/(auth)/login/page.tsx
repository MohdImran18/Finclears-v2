"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import GuestGuard from "@/components/auth/GuestGuard";
import Input from "@/components/ui/Input";
import { Button } from "@/components/ui/button";

import { loginSchema } from "@/validators/auth";

import type { LoginRequest } from "@/types/auth";

import { useLogin } from "@/hooks/useAuth";
import { useAuthStore } from "@/store/auth";
import { ROUTES } from "@/constants/routes";

export default function LoginPage() {
  const router = useRouter();

  const loginStore = useAuthStore(
    (state) => state.login
  );

  const loginMutation = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginRequest>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(
    data: LoginRequest
  ) {
    console.log("LOGIN DATA:", data);

    try {
      const response =
        await loginMutation.mutateAsync(data);

      console.log(
        "LOGIN RESPONSE:",
        response
      );

      loginStore(
        response.data.token,
        response.data.user
      );

      console.log(
        "AUTH STORE:",
        useAuthStore.getState()
      );

      console.log(
        "LOCAL STORAGE:",
        localStorage.getItem("finclears-auth")
      );

      toast.success(
        "Login successful."
      );

      router.replace(
        ROUTES.DASHBOARD
      );

    } catch (error) {

      console.error(
        "LOGIN ERROR:",
        error
      );

      toast.error(
        "Invalid email or password."
      );
    }
  }

  return (
    <GuestGuard>
      <main className="flex min-h-screen items-center justify-center bg-slate-50">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full max-w-md rounded-xl bg-white p-8 shadow-xl space-y-5"
        >
          <h1 className="text-3xl font-bold">
            Login
          </h1>

          <Input
            label="Email"
            type="email"
            autoComplete="email"
            {...register("email")}
            error={errors.email?.message}
          />

          <Input
            label="Password"
            type="password"
            autoComplete="current-password"
            {...register("password")}
            error={errors.password?.message}
          />

          <Button
            type="submit"
            loading={loginMutation.isPending}
          >
            {loginMutation.isPending
              ? "Logging in..."
              : "Login"}
          </Button>
        </form>
      </main>
    </GuestGuard>
  );
}