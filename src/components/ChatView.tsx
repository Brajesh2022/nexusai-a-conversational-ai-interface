import React, { useEffect, useRef } from 'react';
import { Bot, Sparkles } from 'lucide-react';
import { useChatStore } from '@/stores/chatStore';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChatMessage } from './ChatMessage';
import { MessageInput } from './MessageInput';
import { Button } from './ui/button';
const WelcomeScreen = () => {
  const sendMessage = useChatStore(s => s.sendMessage);
  const examples = [
    "Explain quantum computing in simple terms",
    "What are the latest advancements in AI?",
    "Give me a recipe for a vegan lasagna",
    "Write a short story about a robot who discovers music",
  ];
  return (
    <div className="flex h-full flex-col items-center justify-center text-center">
      <div className="mb-4 rounded-full border bg-background p-4 shadow-sm">
        <Sparkles className="h-8 w-8 text-primary" />
      </div>
      <h1 className="text-4xl font-bold tracking-tight">NexusAI</h1>
      <p className="mt-2 text-lg text-muted-foreground">Your conversational AI assistant</p>
      <div className="mt-12 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:w-[600px]">
        {examples.map((text) => (
          <Button key={text} variant="outline" className="h-auto whitespace-normal text-left justify-start" onClick={() => sendMessage(text)}>
            {text}
          </Button>
        ))}
      </div>
    </div>
  );
};
export function ChatView() {
  const messages = useChatStore(s => s.messages);
  const streamingMessage = useChatStore(s => s.streamingMessage);
  const isLoading = useChatStore(s => s.isLoading);
  const isNewSession = useChatStore(s => s.isNewSession);
  const viewportRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (viewportRef.current) {
      viewportRef.current.scrollTo({
        top: viewportRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages, streamingMessage]);
  return (
    <div className="flex h-full flex-1 flex-col">
      <div className="flex-1 overflow-hidden">
        {isNewSession && messages.length === 0 ? (
          <WelcomeScreen />
        ) : (
          <ScrollArea className="h-full" viewportRef={viewportRef}>
            <div className="mx-auto max-w-4xl space-y-6 p-4 md:p-6">
              {messages.map((msg) => (
                <ChatMessage key={msg.id} message={msg} />
              ))}
              {streamingMessage && (
                <ChatMessage message={{ id: 'streaming', role: 'assistant', content: streamingMessage, timestamp: Date.now() }} isStreaming />
              )}
              {isLoading && !streamingMessage && (
                <div className="flex justify-start">
                  <div className="flex items-center space-x-2 rounded-2xl bg-muted px-4 py-3">
                    <Bot className="h-5 w-5 text-muted-foreground" />
                    <div className="flex items-center gap-1">
                      <span className="h-2 w-2 animate-pulse rounded-full bg-muted-foreground [animation-delay:-0.3s]" />
                      <span className="h-2 w-2 animate-pulse rounded-full bg-muted-foreground [animation-delay:-0.15s]" />
                      <span className="h-2 w-2 animate-pulse rounded-full bg-muted-foreground" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        )}
      </div>
      <div className="w-full border-t bg-background/80 backdrop-blur-sm">
        <div className="mx-auto max-w-4xl p-4">
          <MessageInput />
          <p className="mt-2 text-center text-xs text-muted-foreground">
            NexusAI may produce inaccurate information. There is a rate limit on AI requests across all users.
          </p>
        </div>
      </div>
    </div>
  );
}