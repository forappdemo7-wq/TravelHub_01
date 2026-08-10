'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useDragControls } from 'framer-motion';
import { Send, X, Sparkles, ArrowRight, RotateCcw } from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext';
import { useChatbot } from '@/app/context/ChatbotContext';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: Date;
  richData?: {
    type?: string;
    title?: string;
    subtitle?: string;
    price?: string;
    meta?: string;
    url?: string;
    linkView?: string;
    cards?: any[];
  };
}

// Dynamic typewriter queries
const dynamicQueries = [
  { prefix: "What are the best ", highlight: "restaurants in Bali?" },
  { prefix: "Tell me about the ", highlight: "Alpine Luxury Express" },
  { prefix: "How do I book a ", highlight: "private cruise?" },
  { prefix: "What are your ", highlight: "opening hours?" },
  { prefix: "Can I get ", highlight: "vegan options?" },
  { prefix: "What is the ", highlight: "cancellation policy?" },
];

export default function Chatbot() {
  const { formatPrice } = useCurrency();
  const { isChatbotVisible } = useChatbot(); // ✅ Get visibility state

  // If chatbot is hidden via header dropdown, don't render anything
  if (!isChatbotVisible) return null;

  const [isOpen, setIsOpen] = useState(false);
  const dragControls = useDragControls();
  const isDragging = useRef(false);
  const [windowSize, setWindowSize] = useState({ width: 1200, height: 800 });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
      const handleResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight });
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  const [messages, setMessages] = useState<Message[]>([
    { id: 'welcome', role: 'assistant', text: "Hello! I'm your TravelHub concierge. Ask me about restaurants, tours, cruises, or destinations!", timestamp: new Date() }
  ]);
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Typewriter effect state
  const [textIndex, setTextIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [delay, setDelay] = useState(80);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 140)}px`;
    }
  }, [inputVal]);

  // Typewriter effect
  useEffect(() => {
    if (isOpen) return;
    const currentQuery = dynamicQueries[textIndex];
    const fullText = currentQuery.prefix + currentQuery.highlight;

    const handleType = () => {
      if (!isDeleting) {
        setSubIndex(prev => prev + 1);
        if (subIndex === fullText.length) {
          setDelay(3000);
          setIsDeleting(true);
        } else {
          setDelay(60);
        }
      } else {
        setSubIndex(prev => prev - 1);
        if (subIndex === 0) {
          setIsDeleting(false);
          setTextIndex(prev => (prev + 1) % dynamicQueries.length);
          setDelay(500);
        } else {
          setDelay(25);
        }
      }
    };
    const timer = setTimeout(handleType, delay);
    return () => clearTimeout(timer);
  }, [subIndex, isDeleting, textIndex, delay, isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const currentQuery = dynamicQueries[textIndex];
  const prefixLength = currentQuery.prefix.length;
  const typedString = (currentQuery.prefix + currentQuery.highlight).substring(0, subIndex);
  const prefixPart = typedString.substring(0, prefixLength);
  const highlightPart = typedString.substring(prefixLength);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isTyping) return;

    const userMsg: Message = { id: `msg-${Date.now()}`, role: 'user', text, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInputVal('');
    setIsTyping(true);
    setError(null);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: messages.map(m => ({ role: m.role, text: m.text }))
        })
      });

      const data = await res.json();
      const replyText = data.reply || "I'm sorry, I couldn't process that.";
      const richData = data.richData;

      const botMsg: Message = {
        id: `msg-${Date.now() + 1}`,
        role: 'assistant',
        text: replyText,
        timestamp: new Date(),
        richData
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      setError('Oops! Something went wrong. Please try again.');
      console.error(err);
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuickQuestion = (q: string) => sendMessage(q);
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(inputVal);
    }
  };

  // --- RENDER RICH CARD (with enhanced cancellation buttons) ---
  const renderRichCard = (data: any) => {
    if (!data) return null;

    // ---- Cancellation options as clickable cards with icons ----
    if (data.type === 'cancellation-option' && data.cards && data.cards.length > 0) {
      const actionConfigs: Record<string, { icon: string; gradient: string; border: string }> = {
        tours: { icon: '🏔️', gradient: 'from-blue-600 to-indigo-600', border: 'border-blue-400/30' },
        cruises: { icon: '🚢', gradient: 'from-cyan-600 to-teal-600', border: 'border-cyan-400/30' },
        restaurants: { icon: '🍽️', gradient: 'from-amber-600 to-orange-600', border: 'border-amber-400/30' },
      };

      return (
        <div className="mt-3 space-y-3">
          <p className="text-xs text-gray-300 font-medium">{data.subtitle}</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {data.cards.map((card: any, idx: number) => {
              const config = actionConfigs[card.action] || actionConfigs.tours;
              return (
                <button
                  key={idx}
                  onClick={() => sendMessage(`Cancellation policy for ${card.action}`)}
                  className={`group flex flex-col items-center justify-center p-3 rounded-xl bg-gradient-to-br ${config.gradient} text-white shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-200 border ${config.border} hover:brightness-110 active:scale-95 w-full`}
                >
                  <span className="text-2xl mb-1">{config.icon}</span>
                  <span className="font-bold text-sm leading-tight">{card.title}</span>
                  <span className="text-[10px] opacity-90 text-center">{card.subtitle}</span>
                  <span className="text-[9px] opacity-75 mt-0.5">{card.meta}</span>
                </button>
              );
            })}
          </div>
        </div>
      );
    }

    // ---- Multiple cards (tours, restaurants, etc.) ----
    if (data.cards && data.cards.length > 0) {
      return (
        <div className="flex flex-row gap-3 overflow-x-auto pb-2 mt-3">
          {data.cards.map((card: any, idx: number) => (
            <div key={idx} className="bg-[#191b26] border border-white/10 rounded-2xl p-4 min-w-[220px] flex-shrink-0">
              <h5 className="font-bold text-white text-sm">{card.title}</h5>
              <p className="text-xs text-gray-400">{card.subtitle}</p>
              <div className="flex justify-between mt-2">
                <span className="text-amber-400 text-sm font-mono">{card.price}</span>
                <span className="text-xs text-gray-500">{card.meta}</span>
              </div>
              <button
                onClick={() => window.location.href = card.url || '#'}
                className="mt-2 w-full bg-violet-600 hover:bg-violet-500 text-white text-xs py-1.5 rounded-xl transition"
              >
                Explore
              </button>
            </div>
          ))}
        </div>
      );
    }

    // ---- Single card ----
    return (
      <div className="bg-[#191b26] border border-white/10 rounded-2xl p-4 mt-3">
        <h5 className="font-bold text-white">{data.title}</h5>
        <p className="text-sm text-gray-300">{data.subtitle}</p>
        <div className="flex justify-between mt-2">
          <span className="text-amber-400 font-mono">{data.price}</span>
          <span className="text-xs text-gray-500">{data.meta}</span>
        </div>
        <button
          onClick={() => window.location.href = data.url || '#'}
          className="mt-2 w-full bg-violet-600 hover:bg-violet-500 text-white text-xs py-1.5 rounded-xl transition"
        >
          View Details
        </button>
      </div>
    );
  };

  // --- MAIN RENDER ---
  return (
    <motion.div
      drag
      dragMomentum={false}
      dragConstraints={{ left: -windowSize.width + (isOpen ? 460 : 430), right: 10, top: -windowSize.height + (isOpen ? 560 : 120), bottom: 10 }}
      dragElastic={0.1}
      onDragStart={() => isDragging.current = true}
      onDragEnd={() => setTimeout(() => isDragging.current = false, 120)}
      className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4 touch-none"
    >
      <AnimatePresence mode="wait">
        {isOpen ? (
          <motion.div
            key="chat-window"
            initial={{ opacity: 0, y: 40, scale: 0.90 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.92 }}
            transition={{ type: 'spring', damping: 24, stiffness: 210 }}
            className="w-[calc(100vw-48px)] sm:w-[430px] h-[520px] max-h-[calc(100vh-160px)] rounded-[28px] border border-white/10 bg-[#0c0e14]/95 backdrop-blur-3xl shadow-xl flex flex-col overflow-hidden text-slate-200"
          >
            {/* Header */}
            <div className="p-4 border-b border-white/5 bg-[#10121a]/85 flex items-center justify-between shrink-0 cursor-grab active:cursor-grabbing">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-violet-500 to-pink-500 p-[2px]">
                  <div className="w-full h-full rounded-full bg-[#0a0c10] flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-violet-400" />
                  </div>
                </div>
                <div>
                  <span className="font-extrabold text-xs tracking-widest text-slate-300">TRAVELHUB CONCIERGE</span>
                  <div className="text-[11px] font-bold text-white">AI Travel Butler</div>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setMessages([{ id: 'welcome', role: 'assistant', text: "Hello! I'm your TravelHub concierge. Ask me about restaurants, tours, cruises, or destinations!", timestamp: new Date() }])}
                  className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 flex items-center justify-center transition"
                  title="Clear conversation"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 flex items-center justify-center transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-white/5">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[85%] px-4 py-3 rounded-2xl ${
                      msg.role === 'user'
                        ? 'bg-gradient-to-r from-fuchsia-600 to-violet-600 text-white rounded-tr-none'
                        : 'bg-[#160b24] border border-fuchsia-500/20 text-slate-100 rounded-tl-none'
                    }`}
                  >
                    {msg.role === 'user' ? (
                      <div className="text-sm">{msg.text}</div>
                    ) : (
                      <div className="prose prose-invert prose-sm max-w-none">
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          components={{
                            p: ({ children }) => <p className="mb-2 last:mb-0 text-sm leading-relaxed">{children}</p>,
                            ul: ({ children }) => <ul className="list-disc pl-4 mb-2 space-y-1 text-sm">{children}</ul>,
                            ol: ({ children }) => <ol className="list-decimal pl-4 mb-2 space-y-1 text-sm">{children}</ol>,
                            li: ({ children }) => <li className="marker:text-violet-400">{children}</li>,
                            strong: ({ children }) => <strong className="font-bold text-violet-300">{children}</strong>,
                            a: ({ href, children }) => (
                              <a href={href} target="_blank" rel="noopener noreferrer" className="text-violet-400 hover:underline">
                                {children}
                              </a>
                            ),
                          }}
                        >
                          {msg.text}
                        </ReactMarkdown>
                      </div>
                    )}
                    {msg.richData && renderRichCard(msg.richData)}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-[#160b24] border border-fuchsia-500/20 text-slate-400 px-4 py-3 rounded-2xl rounded-tl-none text-sm flex items-center gap-2">
                    <span>Typing</span>
                    <span className="flex gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                    </span>
                  </div>
                </div>
              )}
              {error && <div className="text-rose-400 text-sm">{error}</div>}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick suggestions */}
            {messages.length === 1 && (
              <div className="px-5 py-3 border-t border-white/5 flex gap-2 overflow-x-auto shrink-0">
                {['🍽️ Best Restaurants', '🌴 Top Tours', '🚢 Luxury Cruises', '📅 Cancellation Policy'].map((label) => (
                  <button
                    key={label}
                    onClick={() => handleQuickQuestion(label)}
                    className="text-[10px] font-bold bg-[#1d112d]/80 hover:bg-fuchsia-600/20 border border-fuchsia-500/20 text-slate-200 px-4 py-2 rounded-full whitespace-nowrap transition"
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <form
              onSubmit={(e) => { e.preventDefault(); sendMessage(inputVal); }}
              className="p-4 border-t border-white/5 bg-[#0a0510]/95 flex gap-2 items-end shrink-0"
            >
              <textarea
                ref={textareaRef}
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask me anything..."
                rows={1}
                className="flex-1 text-sm py-2.5 px-4 bg-[#140b1f] border border-fuchsia-500/20 text-white rounded-2xl focus:outline-none focus:border-fuchsia-500/50 resize-none min-h-[44px] max-h-[140px]"
              />
              <button
                type="submit"
                disabled={!inputVal.trim()}
                className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-fuchsia-600 to-violet-600 hover:from-fuchsia-500 hover:to-violet-500 disabled:opacity-50 text-white flex items-center justify-center transition shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        ) : (
          // Floating pill
          <motion.button
            key="chat-pill"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => !isDragging.current && setIsOpen(true)}
            className="relative group flex items-center justify-between p-1.5 pl-6 pr-2 rounded-full border border-fuchsia-500/60 bg-gradient-to-r from-[#170024] via-[#330045] to-[#170024] text-white shadow-[0_0_35px_rgba(217,70,239,0.4)] hover:shadow-[0_0_45px_rgba(217,70,239,0.7)] transition-all duration-300 cursor-grab active:cursor-grabbing w-[calc(100vw-48px)] sm:w-[480px]"
          >
            <div className="flex-1 min-w-0 text-left">
              <span className="text-sm font-light">{prefixPart}</span>
              <span className="text-white font-normal">{highlightPart}</span>
              <span className="inline-block w-1 h-4 bg-fuchsia-500 ml-1 animate-pulse align-middle" />
            </div>
            <div className="w-11 h-11 rounded-full bg-white flex items-center justify-center shadow-lg shrink-0">
              <ArrowRight className="w-5 h-5 text-[#200330] stroke-[2.5]" />
            </div>
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  );
}