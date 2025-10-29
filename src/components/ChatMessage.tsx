import React from 'react';
import { Bot, User, Code } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import type { Message } from '../../worker/types';
interface ChatMessageProps {
  message: Message;
  isStreaming?: boolean;
}
export function ChatMessage({ message, isStreaming = false }: ChatMessageProps) {
  const isUser = message.role === 'user';
  return (
    <div className={cn('flex items-start gap-4', isUser ? 'justify-end' : '')}>
      {!isUser && (
        <Avatar className="h-8 w-8 border">
          <AvatarFallback>
            <Bot className="h-5 w-5 text-muted-foreground" />
          </AvatarFallback>
        </Avatar>
      )}
      <div
        className={cn(
          'max-w-[80%] space-y-2 rounded-2xl px-4 py-3',
          isUser
            ? 'rounded-br-lg bg-primary text-primary-foreground'
            : 'rounded-bl-lg bg-muted'
        )}
      >
        <p className="whitespace-pre-wrap text-sm">
          {message.content}
          {isStreaming && <span className="animate-pulse">|</span>}
        </p>
        {message.toolCalls && message.toolCalls.length > 0 && (
           <div className="mt-2 space-y-2 border-t border-border/50 pt-2">
             <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Code className="h-4 w-4" />
                <span>Tool Calls</span>
             </div>
             <pre className="text-xs bg-background/50 p-2 rounded-md overflow-x-auto">
                <code>{JSON.stringify(message.toolCalls, null, 2)}</code>
             </pre>
           </div>
        )}
      </div>
      {isUser && (
        <Avatar className="h-8 w-8 border">
          <AvatarFallback>
            <User className="h-5 w-5 text-muted-foreground" />
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}