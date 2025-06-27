"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface Message {
  type: 'user' | 'ai';
  text: string;
}

const AssistantDrawer: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!query.trim()) return;

    const userMessage: Message = { type: 'user', text: query };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);
    setQuery('');

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/assistant/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });

      const data = await response.json();

      if (response.ok) {
        const aiMessage: Message = { type: 'ai', text: data.answer };
        setMessages((prev) => [...prev, aiMessage]);
      } else {
        const errorMessage: Message = { type: 'ai', text: `Error: ${data.error || 'Something went wrong'}` };
        setMessages((prev) => [...prev, errorMessage]);
      }
    } catch (error) {
      console.error('Error fetching AI response:', error);
      const errorMessage: Message = { type: 'ai', text: 'Network error or API is unreachable.' };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          className="fixed bottom-4 right-4 rounded-full p-4 shadow-lg"
          size="icon"
          onClick={() => setIsOpen(true)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-6 h-6"
          >
            <path
              fillRule="evenodd"
              d="M4.848 2.771A49.144 49.144 0 0 1 12 2.25c2.43 0 4.817.178 7.152.52 1.423.205 2.078.743 2.078 1.546 0 1.086-.872 2.015-1.936 2.201a40.974 40.974 0 0 0-3.653.353l-.027.004c-.3.062-.615.145-.94.248-.584.183-1.402.663-1.66 1.011-.19.25-.19.582 0 .832.257.348 1.076.828 1.66 1.012.325.102.64.186.94.248l.027.004c1.25.125 2.492.203 3.653.353 1.064.186 1.936 1.115 1.936 2.202 0 .803-.655 1.34-2.078 1.545A49.147 49.147 0 0 1 12 21.75c-2.43 0-4.817-.178-7.152-.52-1.423-.205-2.078-.743-2.078-1.546 0-1.086.872-2.015 1.936-2.201a40.974 40.974 0 0 0 3.653-.353l.027-.004c.3-.062.615-.145.94-.248.584-.183 1.402-.663 1.66-1.011.19-.25.19-.582 0-.832-.257-.348-1.076-.828-1.66-1.012-.325-.102-.64-.186-.94-.248l-.027-.004A49.144 49.144 0 0 1 4.848 2.771Z"
              clipRule="evenodd"
            />
          </svg>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] h-3/4 flex flex-col">
        <DialogHeader>
          <DialogTitle>AI Assistant</DialogTitle>
          <DialogDescription>
            Ask anything about the KDL Starter Kit.
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto p-4 border rounded-md mb-4">
          {messages.length === 0 && <p className="text-center text-gray-500">No conversation yet. Ask me anything!</p>}
          {messages.map((msg, index) => (
            <div key={index} className={`mb-2 ${msg.type === 'user' ? 'text-right' : 'text-left'}`}>
              <span
                className={`inline-block p-2 rounded-lg ${msg.type === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}
              >
                {msg.text}
              </span>
            </div>
          ))}
          {loading && (
            <div className="text-center">
              <p className="text-gray-500">Thinking...</p>
            </div>
          )}
        </div>
        <div className="flex items-center space-x-2 mt-auto">
          <Input
            placeholder="Type your query..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSubmit();
              }
            }}
            className="flex-1"
            disabled={loading}
          />
          <Button onClick={handleSubmit} disabled={loading}>
            Send
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AssistantDrawer; 