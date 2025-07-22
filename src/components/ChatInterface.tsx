import { useState } from 'react';
import { FileText, Settings, FolderOpen, Send, Bot, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

type Category = 'resumes' | 'machine-details' | 'other-info' | null;
type ChatState = 'idle' | 'thinking' | 'answering';

const categories = [
  {
    id: 'resumes' as const,
    label: 'Resumes',
    icon: FileText,
    description: 'Personnel and candidate information'
  },
  {
    id: 'machine-details' as const,
    label: 'Machine Details',
    icon: Settings,
    description: 'Equipment specifications and manuals'
  },
  {
    id: 'other-info' as const,
    label: 'Other Info',
    icon: FolderOpen,
    description: 'General documents and files'
  }
];

const examplePrompts = [
  "Summarize the resume for Jane Doe.",
  "What are the safety warnings for the hydraulic press?",
  "Find the contact info in the 'Project Alpha' document."
];

export default function ChatInterface() {
  const [selectedCategory, setSelectedCategory] = useState<Category>(null);
  const [question, setQuestion] = useState('');
  const [chatState, setChatState] = useState<ChatState>('idle');
  const [messages, setMessages] = useState<Array<{type: 'question' | 'answer', content: string, sources?: string[]}>>([]);

  const handleAsk = async () => {
    if (!question.trim() || !selectedCategory) return;

    const newQuestion = question;
    setQuestion('');
    setChatState('thinking');
    
    setMessages(prev => [...prev, { type: 'question', content: newQuestion }]);

    // Simulate API call
    setTimeout(() => {
      setChatState('answering');
      setTimeout(() => {
        setMessages(prev => [...prev, { 
          type: 'answer', 
          content: "Here's what I found in your documents about that topic. This information comes from the selected category and provides the relevant details you requested.",
          sources: ['Resume_Jane_Doe.pdf (Page 1)', 'Safety_Manual.pdf (Page 5)']
        }]);
        setChatState('idle');
      }, 1000);
    }, 2000);
  };

  const handleExamplePrompt = (prompt: string) => {
    setQuestion(prompt);
  };

  return (
    <div className="space-y-8">
      {/* Main Greeting */}
      <div className="text-center animate-fade-in">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
          Your friendly assistant is ready to help.
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          I can find answers from your uploaded documents. Just choose a category and ask away!
        </p>
      </div>

        {/* Category Selection */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-foreground mb-4 text-center">
            First, where should I look for the answer?
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            {categories.map((category) => {
              const Icon = category.icon;
              const isSelected = selectedCategory === category.id;
              
              return (
                <Card
                  key={category.id}
                  className={`p-6 cursor-pointer transition-all duration-200 hover:shadow-card-hover border-2 ${
                    isSelected 
                      ? 'border-primary bg-secondary shadow-card-hover scale-105' 
                      : 'border-border bg-gradient-card hover:bg-card-hover'
                  }`}
                  onClick={() => setSelectedCategory(category.id)}
                >
                  <div className="text-center">
                    <Icon className={`w-8 h-8 mx-auto mb-3 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
                    <h3 className={`font-semibold mb-2 ${isSelected ? 'text-primary' : 'text-foreground'}`}>
                      {category.label}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {category.description}
                    </p>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Chat Area */}
        <Card className="p-6 mb-6 bg-gradient-card shadow-card">
          <div className="min-h-[300px] mb-6">
            {messages.length === 0 && chatState === 'idle' ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-12">
                <Bot className="w-16 h-16 text-primary mb-4 animate-bounce-soft" />
                <p className="text-lg text-muted-foreground">
                  Answers from your documents will appear here.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg animate-fade-in ${
                      message.type === 'question'
                        ? 'bg-primary text-primary-foreground ml-8'
                        : 'bg-secondary text-secondary-foreground mr-8'
                    }`}
                  >
                    <p>{message.content}</p>
                    {message.sources && (
                      <div className="mt-3 pt-3 border-t border-current/20">
                        <p className="text-sm opacity-80 flex items-center gap-2">
                          <FileText className="w-4 h-4" />
                          Sources: {message.sources.join(', ')}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
                
                {chatState === 'thinking' && (
                  <div className="flex items-center gap-3 text-muted-foreground p-4 bg-muted rounded-lg mr-8 animate-fade-in">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Searching your files...</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Ask something like... 'What's the maintenance schedule for Machine X?'"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAsk()}
                className="flex-1 bg-background"
                disabled={chatState !== 'idle'}
              />
              <Button 
                onClick={handleAsk}
                disabled={!question.trim() || !selectedCategory || chatState !== 'idle'}
                className="px-6 shadow-button"
              >
                <Send className="w-4 h-4 mr-2" />
                Ask
              </Button>
            </div>

            {/* Example Prompts */}
            {messages.length === 0 && (
              <div className="animate-fade-in">
                <p className="text-sm text-muted-foreground mb-3">Need an idea? Try one of these:</p>
                <div className="flex flex-wrap gap-2">
                  {examplePrompts.map((prompt, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => handleExamplePrompt(prompt)}
                      className="text-xs bg-background hover:bg-secondary"
                      disabled={chatState !== 'idle'}
                    >
                      "{prompt}"
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Card>
    </div>
  );
}