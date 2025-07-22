import DocumentBrowser from '@/components/DocumentBrowser';
import Header from "@/components/Header";

export default function Documents() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Document Library</h1>
          <p className="text-muted-foreground">
            Browse, search, and manage your uploaded documents. Download or view any file from your knowledge base.
          </p>
        </div>
        <DocumentBrowser />
      </main>
    </div>
  );
}