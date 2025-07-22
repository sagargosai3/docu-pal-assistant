import DocumentUpload from '@/components/DocumentUpload';
import Navigation from '@/components/Navigation';

export default function Upload() {
  return (
    <div className="min-h-screen bg-gradient-hero">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Navigation />
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Upload Documents</h1>
          <p className="text-muted-foreground">
            Add new documents to your knowledge base. Select a category and upload your files.
          </p>
        </div>
        <DocumentUpload />
      </div>
    </div>
  );
}