import { LoginForm } from "@/components/login-form";
import { Logo } from "@/components/marca/logo";

export default function Page() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center bg-canvas p-6 md:p-10">
      <div className="w-full max-w-sm space-y-6">
        <div className="flex justify-center">
          <Logo tamano="lg" />
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
