"use client";

import * as React from "react";
import { Send, Bot, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function SimpleChat() {
  const [messages, setMessages] = React.useState([
    { role: "assistant", content: "Hi! How can I help you today?" },
  ]);
  const [input, setInput] = React.useState("");
  const [isMinimized, setIsMinimized] = React.useState(false);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo(0, scrollRef.current.scrollHeight);
    }
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages((prev) => [...prev, { role: "user", content: input }]);
    setInput("");
    // Simulate a bot response
    setTimeout(() => {
      setMessages((prev) => [...prev, { role: "assistant", content: "I'm a simple UI demo! Hook me up to an API to get real answers." }]);
    }, 1000);
  };

  // When minimized, show only the floating button
  if (isMinimized) {
    return (
      <Button
        onClick={() => setIsMinimized(false)}
        className="rounded-full h-14 w-14 shadow-lg"
        size="icon"
      >
        <Bot size={24} />
      </Button>
    );
  }

  return (
    <div className="flex flex-col h-[500px] w-full max-w-md border rounded-2xl bg-background shadow-lg overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b bg-muted/50 flex items-center gap-3 justify-between">
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8 border">
            <AvatarFallback className="bg-primary text-primary-foreground"><Bot size={16} /></AvatarFallback>
          </Avatar>
          <span className="font-semibold text-sm">AI Assistant</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 hover:bg-destructive/20"
          onClick={() => setIsMinimized(true)}
        >
          <X size={16} />
        </Button>
      </div>

      {/* Message List */}
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-4">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${
                msg.role === "user" 
                ? "bg-primary text-primary-foreground rounded-tr-none" 
                : "bg-muted text-muted-foreground rounded-tl-none"
              }`}>
                {msg.content}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="p-4 border-t bg-background">
        <form 
          className="flex gap-2" 
          onSubmit={(e) => { e.preventDefault(); handleSend(); }}
        >
          <Input 
            placeholder="Write a message..." 
            value={input} 
            onChange={(e) => setInput(e.target.value)}
            className="rounded-full bg-muted border-none focus-visible:ring-1"
          />
          <Button size="icon" className="rounded-full shrink-0" disabled={!input.trim()}>
            <Send size={18} />
          </Button>
        </form>
      </div>
    </div>
  );
}
