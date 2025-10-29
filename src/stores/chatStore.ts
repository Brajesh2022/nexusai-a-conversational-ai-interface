import { create } from 'zustand';
import { chatService } from '@/lib/chat';
import type { SessionInfo, Message } from '../../worker/types';
interface ChatState {
  sessions: SessionInfo[];
  activeSessionId: string | null;
  messages: Message[];
  streamingMessage: string;
  isLoading: boolean;
  isSidebarOpen: boolean;
  isNewSession: boolean;
}
interface ChatActions {
  loadSessions: () => Promise<void>;
  loadMessages: (sessionId: string) => Promise<void>;
  sendMessage: (message: string) => Promise<void>;
  newSession: () => Promise<void>;
  switchSession: (sessionId: string) => Promise<void>;
  deleteSession: (sessionId: string) => Promise<void>;
  toggleSidebar: () => void;
  setSidebarOpen: (isOpen: boolean) => void;
}
export const useChatStore = create<ChatState & ChatActions>((set, get) => ({
  sessions: [],
  activeSessionId: null,
  messages: [],
  streamingMessage: '',
  isLoading: false,
  isSidebarOpen: window.innerWidth >= 1024, // Default open on desktop
  isNewSession: true,
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  setSidebarOpen: (isOpen: boolean) => set({ isSidebarOpen: isOpen }),
  loadSessions: async () => {
    const res = await chatService.listSessions();
    if (res.success && res.data) {
      set({ sessions: res.data });
    }
  },
  loadMessages: async (sessionId: string) => {
    set({ isLoading: true, messages: [], streamingMessage: '' });
    chatService.switchSession(sessionId);
    const res = await chatService.getMessages();
    if (res.success && res.data) {
      set({ messages: res.data.messages, isLoading: false, isNewSession: res.data.messages.length === 0 });
    } else {
      set({ isLoading: false });
    }
  },
  switchSession: async (sessionId: string) => {
    if (get().activeSessionId === sessionId) return;
    set({ activeSessionId: sessionId });
    await get().loadMessages(sessionId);
  },
  newSession: async () => {
    chatService.newSession();
    const newSessionId = chatService.getSessionId();
    set({
      activeSessionId: newSessionId,
      messages: [],
      streamingMessage: '',
      isNewSession: true,
    });
  },
  deleteSession: async (sessionId: string) => {
    const res = await chatService.deleteSession(sessionId);
    if (res.success) {
      const remainingSessions = get().sessions.filter(s => s.id !== sessionId);
      set({ sessions: remainingSessions });
      if (get().activeSessionId === sessionId) {
        if (remainingSessions.length > 0) {
          await get().switchSession(remainingSessions[0].id);
        } else {
          await get().newSession();
        }
      }
    }
  },
  sendMessage: async (message: string) => {
    if (get().isLoading) return;
    set({ isLoading: true, streamingMessage: '' });
    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: message,
      timestamp: Date.now(),
    };
    set(state => ({ messages: [...state.messages, userMessage] }));
    let currentSessionId = get().activeSessionId;
    // If it's the first message of a new session, create the session on the backend first.
    if (get().isNewSession && currentSessionId) {
      const res = await chatService.createSession(undefined, currentSessionId, message);
      if (res.success && res.data) {
        set({ isNewSession: false });
        // Refresh sessions to show the new one
        await get().loadSessions();
      } else {
        // Handle error case where session creation fails
        set({ isLoading: false });
        // Optionally show an error message to the user
        return;
      }
    }
    // Ensure we still have a valid session ID before proceeding
    currentSessionId = get().activeSessionId;
    if (!currentSessionId) {
        console.error("No active session ID to send message to.");
        set({ isLoading: false });
        return;
    }
    await chatService.sendMessage(message, undefined, (chunk) => {
      set(state => ({ streamingMessage: state.streamingMessage + chunk }));
    });
    // After streaming is complete, reload the messages to get the final assistant message with tool calls etc.
    await get().loadMessages(currentSessionId);
    set({ isLoading: false, streamingMessage: '' });
  },
}));