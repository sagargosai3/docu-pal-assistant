import Header from "@/components/Header";
import DocumentUpload from '@/components/DocumentUpload';
import DocumentBrowser from '@/components/DocumentBrowser';
import ChatInterface from '@/components/ChatInterface';

export default function Opportunities() {
  const pageCategory = "other-info";

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 max-w-4xl space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-4">Opportunities</h1>
          <DocumentUpload category={pageCategory} />
        </div>
        <ChatInterface category={pageCategory} />
        <div className="mt-8">
          <DocumentBrowser category={pageCategory} />
        </div>
      </main>
    </div>
  );
}