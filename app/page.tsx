import { Button } from "@/components/ui/button";
import { getMessages } from "@/lib/i18n";

export default function Home() {
  const messages = getMessages();

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4">
      <h1 className="text-3xl font-semibold tracking-tight">
        {messages.home.title}
      </h1>
      <Button>{messages.home.getStarted}</Button>
    </main>
  );
}
