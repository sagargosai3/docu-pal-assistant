import Header from "@/components/Header";

export default function Vacancies() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 max-w-4xl flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold mb-4">Vacancies</h1>
        <p className="text-lg text-muted-foreground">This page is under construction. Stay tuned for updates!</p>
      </main>
    </div>
  );
} 