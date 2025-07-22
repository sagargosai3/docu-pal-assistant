import DocumentUpload from '@/components/DocumentUpload';
import Header from "@/components/Header";

export default function Upload() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Upload Documents</h1>
          <p className="text-muted-foreground">
            Add new documents to your knowledge base. Select a category and upload your files.
          </p>
        </div>
        <DocumentUpload />
      </main>
    </div>
  );
}