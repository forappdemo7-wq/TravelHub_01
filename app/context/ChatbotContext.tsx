'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface ChatbotContextType {
  isChatbotVisible: boolean;
  toggleChatbot: () => void;
  setChatbotVisible: (visible: boolean) => void;
}

const ChatbotContext = createContext<ChatbotContextType | undefined>(undefined);

export function ChatbotProvider({ children }: { children: ReactNode }) {
  const [isChatbotVisible, setIsChatbotVisible] = useState(true);

  const toggleChatbot = () => setIsChatbotVisible(prev => !prev);
  const setChatbotVisible = (visible: boolean) => setIsChatbotVisible(visible);

  return (
    <ChatbotContext.Provider value={{ isChatbotVisible, toggleChatbot, setChatbotVisible }}>
      {children}
    </ChatbotContext.Provider>
  );
}

export function useChatbot() {
  const context = useContext(ChatbotContext);
  if (!context) throw new Error('useChatbot must be used within ChatbotProvider');
  return context;
}