import RegisterForm from "@/components/auth/RegisterForm";

export const metadata = {
  title: "Create Account | FinClears",
  description:
    "Create your FinClears account and register your business online.",
};

export default function RegisterPage() {
  return (
    <main className="min-h-screen bg-gray-50">

      <div className="container mx-auto flex min-h-screen items-center justify-center px-4 py-12">

        <RegisterForm />

      </div>

    </main>
  );
}