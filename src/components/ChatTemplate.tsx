'use client';

import React, { JSX, useEffect, useRef, useState } from 'react';

interface Message {
  id: number;
  text: string;
  fromUser?: boolean;
}

export default function ChatTemplate(): JSX.Element {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: 'Hola, ¿en qué puedo ayudarte?', fromUser: false },
  ]);
  const [input, setInput] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const handleSend = (): void => {
    const trimmed = input.trim();
    if (trimmed !== '') {
      setMessages((prev) => [
        ...prev,
        { id: prev.length + 1, text: trimmed, fromUser: true },
      ]);
      setInput('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') handleSend();
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <div className="chat-container">
      <div className="chat-header">Sala General</div>

      <div className="chat-messages">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`chat-message ${msg.fromUser ? 'chat-message-user' : 'chat-message-bot'}`}
          >
            {msg.text}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Escribe tu mensaje..."
          className="chat-text-input"
        />
        <button onClick={handleSend} className="chat-send-button">
          Enviar
        </button>
      </div>
    </div>
  );
}

