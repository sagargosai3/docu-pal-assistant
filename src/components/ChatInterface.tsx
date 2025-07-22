import { useState } from 'react';
import { Send, Bot, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

export default function ChatInterface() {
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState([
    { type: 'answer', content: "Hello! How can I help you today? You can ask me to add a machine, post a requirement, search for items, and more." }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const handleAsk = async () => {
    if (!question.trim()) return;
    const newQuestion = question;
    setMessages(prev => [...prev, { type: 'question', content: newQuestion }]);
    setQuestion('');
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setMessages(prev => [...prev, { type: 'answer', content: `Simulated response for: "${newQuestion}"` }]);
      setIsLoading(false);
    }, 1500);
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
          </div>
        ))}
        {isLoading && <div className="flex items-center gap-3 text-muted-foreground"><Loader2 className="w-5 h-5 animate-spin" /><span>Thinking...</span></div>}
      </CardContent>
      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-2 mb-3">
          <Button variant="outline" size="sm">Sell Machine</Button>
          <Button variant="outline" size="sm">Post Requirement</Button>
          <Button variant="outline" size="sm">Find a Job</Button>
        </div>
        <div className="flex items-center gap-2">
          <Input placeholder="Type your message..." value={question} onChange={(e) => setQuestion(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleAsk()} disabled={isLoading} className="bg-input" />
          <Button onClick={handleAsk} disabled={isLoading}><Send className="w-4 h-4" /></Button>
        </div>
      </div>
    </Card>
  );
}