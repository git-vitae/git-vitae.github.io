'use client';

import * as React from 'react';
import { Send, Bot, X, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import {
  webLLMService,
  type ChatMessage,
  type WebLLMStatus,
} from '@/lib/webllm';

export function SimpleChat() {
  const MAX_CONVERSATION_PAIRS = 5; // Keep last 5 user/assistant exchanges
  const [messages, setMessages] = React.useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: 'Hi! Ask me anything about GitVitae or this portfolio page.',
    },
  ]);
  const [input, setInput] = React.useState('');
  const [isMinimized, setIsMinimized] = React.useState(true); // Start minimized
  const [isLoading, setIsLoading] = React.useState(false);
  const [webLLMStatus, setWebLLMStatus] = React.useState<WebLLMStatus>({
    status: 'not_loaded',
  });
  const [pageContext, setPageContext] = React.useState<string>('');
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const messageCountRef = React.useRef(0);

  const resetConversation = () => {
    setMessages([
      {
        role: 'assistant',
        content: 'Hi! Ask me anything about GitVitae or this portfolio page.',
      },
    ]);
    messageCountRef.current = 0;
  };

  // Subscribe to WebLLM status updates
  React.useEffect(() => {
    const unsubscribe = webLLMService.onStatusChange(setWebLLMStatus);
    return unsubscribe;
  }, []);

  // Track current page context and keep it available for the model.
  React.useEffect(() => {
    const capturePageContext = () => {
      const title = document.title || '';
      const url = window.location.href;
      const route = window.location.hash || window.location.pathname;
      const pageText = Array.from(
        document.querySelectorAll(
          'main, article, section, .page-content, .page'
        )
      )
        .map((el) => el.textContent?.trim() ?? '')
        .filter(Boolean)
        .join('\n\n')
        .slice(0, 8000);

      setPageContext(
        `Title: ${title}\nURL: ${url}\nRoute: ${route}\n\nPage text:\n${pageText}`
      );
    };

    capturePageContext();
    window.addEventListener('hashchange', capturePageContext);
    return () => window.removeEventListener('hashchange', capturePageContext);
  }, []);

  // Auto-scroll to bottom when messages change
  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo(0, scrollRef.current.scrollHeight);
    }
  }, [messages]);

  // Start loading the model when the chat window is opened for the first time.
  React.useEffect(() => {
    if (!isMinimized && webLLMStatus.status === 'not_loaded') {
      webLLMService.initialize();
    }
  }, [isMinimized, webLLMStatus.status]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    messageCountRef.current += 1;

    try {
      // Initialize WebLLM if not ready
      if (webLLMStatus.status === 'not_loaded') {
        await webLLMService.initialize();
      }

      // Keep only the last MAX_CONVERSATION_PAIRS exchanges to save tokens
      // Always include the initial greeting
      const conversationForModel = messages.slice(
        Math.max(0, messages.length - MAX_CONVERSATION_PAIRS * 2)
      );

      // Add placeholder for AI response
      const aiMessageIndex = messages.length + 1;
      setMessages((prev) => [...prev, { role: 'assistant', content: '' }]);

      // Generate streaming response
      const allMessages = [...conversationForModel, userMessage];
      let accumulatedResponse = '';

      for await (const chunk of webLLMService.chat(allMessages, pageContext)) {
        accumulatedResponse += chunk;
        setMessages((prev) =>
          prev.map((msg, idx) =>
            idx === aiMessageIndex
              ? { ...msg, content: accumulatedResponse }
              : msg
          )
        );
      }

      // Reset conversation after 8 exchanges to prevent token buildup
      if (messageCountRef.current >= 8) {
        setTimeout(() => {
          resetConversation();
        }, 2000);
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `Sorry, I encountered an error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // When minimized, show only the floating button
  if (isMinimized) {
    return (
      <Button
        onClick={() => setIsMinimized(false)}
        className="h-14 w-14 rounded-full shadow-lg transition-transform hover:scale-105"
        size="icon"
      >
        <Bot className="!size-7" />
      </Button>
    );
  }

  return (
    <div className="bg-background flex h-[500px] min-h-0 w-full max-w-md flex-col overflow-hidden rounded-2xl border shadow-lg">
      {/* Header */}
      <div className="bg-muted/50 flex items-center justify-between gap-3 border-b p-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8 border">
            <AvatarFallback className="bg-primary text-primary-foreground">
              <Bot size={16} />
            </AvatarFallback>
          </Avatar>
          <span className="text-sm font-semibold">AI Assistant</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="hover:bg-destructive/20 h-6 w-6"
          onClick={() => setIsMinimized(true)}
        >
          <X size={16} />
        </Button>
      </div>

      {/* Loading/Status Area */}
      {webLLMStatus.status === 'loading' && (
        <div className="bg-muted/30 border-b p-4">
          <div className="mb-2 flex items-center gap-3">
            <Loader2 size={16} className="animate-spin" />
            <span className="text-sm font-medium">
              {webLLMStatus.progress === 0
                ? 'Initializing AI...'
                : webLLMStatus.progress && webLLMStatus.progress < 100
                  ? `Loading model: ${webLLMStatus.progress}%`
                  : 'Finalizing setup...'}
            </span>
          </div>
          {webLLMStatus.progress !== undefined && webLLMStatus.progress > 0 && (
            <Progress value={webLLMStatus.progress} className="h-2" />
          )}
        </div>
      )}

      {webLLMStatus.status === 'error' && (
        <div className="bg-destructive/10 border-b p-4">
          <div className="flex items-start gap-3">
            <X size={16} className="text-destructive mt-0.5" />
            <div>
              <p className="text-destructive text-sm font-medium">
                AI Unavailable
              </p>
              <p className="text-muted-foreground mt-1 text-xs">
                {webLLMStatus.error}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <div className="border-b border-amber-200 bg-amber-50 px-4 py-2 dark:border-amber-800/30 dark:bg-amber-900/20">
        <p className="text-xs text-amber-700 dark:text-amber-600">
          ⚠️ <span className="font-medium">Disclaimer:</span> AI-generated
          answers may contain errors. Please verify important information
          independently.
        </p>
      </div>

      {/* Message List */}
      <ScrollArea className="min-h-0 flex-1 p-4" viewportRef={scrollRef}>
        <div className="space-y-4">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${msg.role === 'user' ? 'bg-primary text-primary-foreground rounded-tr-none' : 'bg-muted text-muted-foreground rounded-tl-none'}`}
              >
                {msg.role === 'user' ? (
                  msg.content
                ) : (
                  <ReactMarkdown
                    components={{
                      p: ({ children }) => (
                        <p className="mb-2 last:mb-0">{children}</p>
                      ),
                      ul: ({ children }) => (
                        <ul className="mb-2 list-inside list-disc">
                          {children}
                        </ul>
                      ),
                      ol: ({ children }) => (
                        <ol className="mb-2 list-inside list-decimal">
                          {children}
                        </ol>
                      ),
                      li: ({ children }) => (
                        <li className="mb-1">{children}</li>
                      ),
                      strong: ({ children }) => (
                        <strong className="font-semibold">{children}</strong>
                      ),
                      em: ({ children }) => (
                        <em className="italic">{children}</em>
                      ),
                      code: ({ children }) => (
                        <code className="bg-muted/50 rounded px-1 py-0.5 font-mono text-xs">
                          {children}
                        </code>
                      ),
                    }}
                  >
                    {msg.content}
                  </ReactMarkdown>
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-muted text-muted-foreground max-w-[80%] rounded-2xl rounded-tl-none px-4 py-2 text-sm">
                <div className="flex items-center gap-2">
                  <Loader2 size={14} className="animate-spin" />
                  <span>Thinking...</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="bg-background border-t p-4">
        <form
          className="flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
        >
          <Input
            placeholder={
              webLLMStatus.status === 'error'
                ? 'AI unavailable...'
                : webLLMStatus.status === 'loading'
                  ? 'Loading AI model...'
                  : 'Write a message...'
            }
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="bg-muted rounded-full border-none focus-visible:ring-1"
            disabled={
              webLLMStatus.status === 'error' ||
              webLLMStatus.status === 'loading'
            }
          />
          <Button
            size="icon"
            className="shrink-0 rounded-full"
            disabled={
              !input.trim() ||
              isLoading ||
              webLLMStatus.status === 'error' ||
              webLLMStatus.status === 'loading'
            }
          >
            {isLoading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Send size={18} />
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
