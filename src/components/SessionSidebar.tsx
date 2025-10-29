import React from 'react';
import { Plus, MessageSquare, Trash2, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { useChatStore } from '@/stores/chatStore';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
const SidebarContent = () => {
  const sessions = useChatStore(s => s.sessions);
  const activeSessionId = useChatStore(s => s.activeSessionId);
  const newSession = useChatStore(s => s.newSession);
  const switchSession = useChatStore(s => s.switchSession);
  const deleteSession = useChatStore(s => s.deleteSession);
  return (
    <>
      <div className="flex items-center justify-between p-4">
        <h2 className="text-lg font-semibold">History</h2>
        <Button variant="ghost" size="icon" onClick={newSession}>
          <Plus className="h-5 w-5" />
          <span className="sr-only">New Chat</span>
        </Button>
      </div>
      <ScrollArea className="flex-1 px-2">
        <div className="space-y-1">
          {sessions.map((session) => (
            <div key={session.id} className="group flex items-center">
              <Button
                variant={activeSessionId === session.id ? 'secondary' : 'ghost'}
                className="h-10 w-full justify-start truncate"
                onClick={() => switchSession(session.id)}
              >
                <MessageSquare className="mr-2 h-4 w-4 flex-shrink-0" />
                <span className="truncate">{session.title}</span>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 shrink-0 opacity-0 group-hover:opacity-100"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteSession(session.id);
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </ScrollArea>
      <div className="p-4 border-t">
        <p className="text-xs text-muted-foreground">Built with ❤️ at Cloudflare</p>
      </div>
    </>
  );
};
export function SessionSidebar() {
  const isMobile = useIsMobile();
  const isSidebarOpen = useChatStore(s => s.isSidebarOpen);
  const toggleSidebar = useChatStore(s => s.toggleSidebar);
  const setSidebarOpen = useChatStore(s => s.setSidebarOpen);
  if (isMobile) {
    return (
      <Sheet open={isSidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="absolute left-4 top-4 z-10">
            <PanelLeftOpen className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex w-[300px] flex-col p-0">
          <SheetHeader className="p-4">
            <SheetTitle>Chat History</SheetTitle>
          </SheetHeader>
          <SidebarContent />
        </SheetContent>
      </Sheet>
    );
  }
  return (
    <>
      <div
        className={cn(
          'flex h-full flex-col bg-muted/50 transition-all duration-300 ease-in-out',
          isSidebarOpen ? 'w-64' : 'w-0'
        )}
      >
        {isSidebarOpen && (
          <div className="flex h-full flex-col overflow-hidden">
            <SidebarContent />
          </div>
        )}
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleSidebar}
        className="absolute left-2 top-2 z-10"
      >
        {isSidebarOpen ? <PanelLeftClose className="h-5 w-5" /> : <PanelLeftOpen className="h-5 w-5" />}
      </Button>
    </>
  );
}