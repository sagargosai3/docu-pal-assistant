import ChatInterface from '@/components/ChatInterface';
import Navigation from '@/components/Navigation';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-hero">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Navigation />
        <ChatInterface />
      </div>
    </div>
  );
};

export default Index;
