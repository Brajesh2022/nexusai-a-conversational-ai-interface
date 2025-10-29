import React, { useEffect, useState } from 'react';
import { useChatStore } from '@/stores/chatStore';
import { SessionSidebar } from '@/components/SessionSidebar';
import { ChatView } from '@/components/ChatView';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
export function HomePage() {
  const loadSessions = useChatStore(s => s.loadSessions);
  const sessions = useChatStore(s => s.sessions);
  const activeSessionId = useChatStore(s => s.activeSessionId);
  const switchSession = useChatStore(s => s.switchSession);
  const newSession = useChatStore(s => s.newSession);
  const isSidebarOpen = useChatStore(s => s.isSidebarOpen);
  const isMobile = useIsMobile();
  const [isInitialized, setIsInitialized] = useState(false);
  useEffect(() => {
    const initialize = async () => {
      await loadSessions();
      setIsInitialized(true);
    };
    initialize();
  }, [loadSessions]);
  useEffect(() => {
    if (isInitialized) {
      if (sessions.length > 0 && !activeSessionId) {
        // If there's no active session, switch to the most recent one.
        switchSession(sessions[0].id);
      } else if (sessions.length === 0 && !activeSessionId) {
        // If there are no sessions at all, create a new one.
        newSession();
      }
    }
  }, [isInitialized, sessions, activeSessionId, switchSession, newSession]);
  return (
    <div className="flex h-screen w-full overflow-hidden bg-background text-foreground">
      <SessionSidebar />
      <main
        className={cn(
          'relative flex h-full w-full flex-1 flex-col overflow-hidden transition-all duration-300 ease-in-out',
          isSidebarOpen && !isMobile ? 'pl-12' : 'pl-0'
        )}
      >
        <ChatView />
      </main>
    </div>
  );
}