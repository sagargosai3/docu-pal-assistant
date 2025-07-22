import DocumentBrowser from '@/components/DocumentBrowser';
import Navigation from '@/components/Navigation';

export default function Documents() {
  return (
    <div className="min-h-screen bg-gradient-hero">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <Navigation />
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Document Library</h1>
          <p className="text-muted-foreground">
            Browse, search, and manage your uploaded documents. Download or view any file from your knowledge base.
          </p>
        </div>
        <DocumentBrowser />
      </div>
    </div>
  );
}