import React, { useRef, useEffect, KeyboardEvent } from 'react';
import { SendHorizonal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useChatStore } from '@/stores/chatStore';
export function MessageInput() {
  const [input, setInput] = React.useState('');
  const sendMessage = useChatStore(s => s.sendMessage);
  const isLoading = useChatStore(s => s.isLoading);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [input]);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    sendMessage(input.trim());
    setInput('');
  };
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };
  return (
    <form onSubmit={handleSubmit} className="relative">
      <Textarea
        ref={textareaRef}
        rows={1}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Message NexusAI..."
        className="min-h-[48px] resize-none rounded-2xl border-border/40 bg-background/80 pr-16 shadow-sm backdrop-blur-sm"
        disabled={isLoading}
      />
      <Button
        type="submit"
        size="icon"
        className="absolute bottom-2 right-2 h-8 w-8 rounded-lg"
        disabled={!input.trim() || isLoading}
      >
        <SendHorizonal className="h-4 w-4" />
        <span className="sr-only">Send message</span>
      </Button>
    </form>
  );
}