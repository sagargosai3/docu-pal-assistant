import Header from "@/components/Header";
import DocumentUpload from '@/components/DocumentUpload';
import DocumentBrowser from '@/components/DocumentBrowser';

export default function MachineIntelligence() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold mb-4">Machine Intelligence</h1>
        <DocumentUpload category="machine-details" />
        <div className="mt-8">
          <DocumentBrowser category="machine-details" />
        </div>
      </main>
    </div>
  );
} 