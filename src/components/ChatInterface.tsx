// src/components/ChatInterface.tsx
// This is the complete, updated file with real backend logic.

import { useState } from 'react';
import { Send, Bot, Loader2, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from "@/components/ui/use-toast";

// The API URL will be read from the environment variables
const API_URL = import.meta.env.VITE_API_BASE_URL || 'https://chatbot-api-service-454772545989.us-central1.run.app';

interface Message {
  type: 'question' | 'answer';
  content: string;
}

// Define the props interface to accept a category
interface ChatInterfaceProps {
  category: string;
}

export default function ChatInterface({ category }: ChatInterfaceProps) {
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { type: 'answer', content: "Hello! How can I help you today? Ask me anything about the documents in this category." }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleAsk = async () => {
    if (!question.trim()) return;

    const newQuestion: Message = { type: 'question', content: question };
    setMessages(prev => [...prev, newQuestion]);
    setQuestion('');
    setIsLoading(true);

    console.log('API URL:', API_URL);
    console.log('Sending request to:', `${API_URL}/ask`);

    try {
      // Real API call to the backend
      console.log('Making API call to:', `${API_URL}/ask`);
      const response = await fetch(`${API_URL}/ask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: newQuestion.content, category: category }),
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Response data:', data);
      const botAnswer: Message = { type: 'answer', content: data.answer || "Sorry, I couldn't get a response." };
      setMessages(prev => [...prev, botAnswer]);

    } catch (error: any) {
      console.error("Error asking question:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Could not connect to the AI assistant.",
      });
      const errorMessage: Message = { type: 'answer', content: "I'm having trouble connecting. Please try again later." };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full h-[70vh] flex flex-col bg-[#2c313a] border-border shadow-lg">
      <div className="p-4 border-b border-border"><h2 className="font-semibold text-lg">AI Support</h2></div>
      <CardContent className="flex-grow p-4 space-y-4 overflow-y-auto">
        {messages.map((message, index) => (
          <div key={index} className={`flex items-start gap-3 ${message.type === 'question' ? 'justify-end' : 'justify-start'}`}>
            {message.type === 'answer' && <Bot className="w-6 h-6 text-primary flex-shrink-0" />}
            <div className={`p-3 rounded-lg max-w-xl ${message.type === 'question' ? 'bg-primary text-primary-foreground' : 'bg-background'}`}>
              <p className="text-sm">{message.content}</p>
            </div>
            {message.type === 'question' && <User className="w-6 h-6 flex-shrink-0" />}
          </div>
        ))}
        {isLoading && <div className="flex items-center gap-3 text-muted-foreground"><Loader2 className="w-5 h-5 animate-spin" /><span>Thinking...</span></div>}
      </CardContent>
      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-2 mb-3">
          <Button variant="outline" size="sm" onClick={() => setQuestion("Summarize the key skills from the resumes")}>Summarize Skills</Button>
          <Button variant="outline" size="sm" onClick={() => setQuestion("What is the maintenance schedule?")}>Maintenance Schedule</Button>
          <Button variant="outline" size="sm" onClick={() => setQuestion("Find contact information")}>Find Contacts</Button>
        </div>
        <div className="flex items-center gap-2">
          <Input placeholder="Type your message..." value={question} onChange={(e) => setQuestion(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleAsk()} disabled={isLoading} className="bg-input" />
          <Button onClick={handleAsk} disabled={isLoading}><Send className="w-4 h-4" /></Button>
        </div>
      </div>
    </Card>
  );
}
