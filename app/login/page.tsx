import { LoginForm } from "@/app/login/login-form";
import { getMessages } from "@/lib/i18n";

export default function LoginPage() {
  const messages = getMessages();

  return (
    <main className="flex flex-1 flex-col items-center justify-center p-6">
      <LoginForm messages={messages.auth.login} />
    </main>
  );
}
