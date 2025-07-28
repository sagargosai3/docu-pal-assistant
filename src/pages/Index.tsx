
import ChatInterface from '@/components/ChatInterface';
import Header from "@/components/Header";

const Index = () => {
  console.log('Index component rendering...');
  // We'll use 'other-info' as a general category for the main page chat
  const pageCategory = "other-info"; 

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold mb-4">DocuPal Assistant</h1>
        <p className="text-muted-foreground mb-8">
          Welcome! Use the chat below to ask questions about your documents, or navigate to a specific section to upload new files.
        </p>
        <ChatInterface category={pageCategory} />
      </main>
    </div>
  );
};

export default Index;
