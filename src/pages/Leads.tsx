import Header from "@/components/Header";
import DocumentUpload from '@/components/DocumentUpload';
import DocumentBrowser from '@/components/DocumentBrowser';

export default function Leads() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold mb-4">Leads</h1>
        <DocumentUpload category="other-info" />
        <div className="mt-8">
          <DocumentBrowser category="other-info" />
        </div>
      </main>
    </div>
  );
} 