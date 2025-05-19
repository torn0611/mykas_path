'use client';

import React, {
    useState,
    useRef,
    useEffect,
    ChangeEvent,
    KeyboardEvent,
  } from 'react';
  
  interface Message {
    sender: 'user' | 'assistant';
    text: string;
  }
  
  export default function ChatBox() {
    // --- state with explicit types ---
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState<string>('');
  
    const bottomRef = useRef<HTMLDivElement>(null);
  
    useEffect(() => {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);
  
    const sendMessage = async () => {
      if (!input.trim()) return;
  
      // typed user message
      const userMsg: Message = { sender: 'user', text: input };
      setMessages((prev: Message[]) => [...prev, userMsg]);
      setInput('');
  
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: input }),
      });
  
      if (!res.ok) {
        const errMsg: Message = {
          sender: 'assistant',
          text: 'Error: Unable to fetch response.',
        };
        setMessages((prev: Message[]) => [...prev, errMsg]);
        return;
      }
  
      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      let assistantText = '';
  
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        assistantText += decoder.decode(value);
        setMessages((prev: Message[]) => {
          const updated = [...prev];
          const last = updated[updated.length - 1];
          if (last?.sender === 'assistant') {
            last.text = assistantText;
          } else {
            updated.push({ sender: 'assistant', text: assistantText });
          }
          return updated;
        });
      }
    };
  
    // typed change & key handlers
    const onChange = (e: ChangeEvent<HTMLInputElement>) =>
      setInput(e.target.value);
  
    const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') sendMessage();
    };
  
    return (
      <div className="chat-box">
        <div className="messages">
          {messages.map((m, i) => (
            <div key={i} className={m.sender}>
              {m.text}
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
        <div className="input-area">
          <input
            type="text"
            value={input}
            onChange={onChange}
            onKeyDown={onKeyDown}
            placeholder="Ask me anything..."
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      </div>
    );
  }
  