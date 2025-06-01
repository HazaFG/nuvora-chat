'use client';

import React, { JSX } from "react";
import { useEffect, useRef, useState } from 'react';

interface Message {
  id: number;
  text: string;
  fromUser?: boolean;
}

export default function ChatTemplate(): JSX.Element {
  //Recibimos un arreglo de Messages
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: 'Hola, ¿en qué puedo ayudarte?', fromUser: false },
  ]);

  //El input es el texto que va en el input del mensaje que enviaremos, y el set pues para actualizar el contenido de este
  const [input, setInput] = useState<string>('');

  //Esto guarda una referencia al ultimo div en la lista de mensajes
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const handleSend = (): void => {
    const trimmed = input.trim();
    //Si no esta vacio agrega el mensaje al arreglo del Messages con el id, el text(lo que esta en el input) y el from user indica que es un mensaaje del user
    if (trimmed !== '') {
      setMessages((prev) => [
        ...prev,
        { id: prev.length + 1, text: trimmed, fromUser: true },
      ]);
      //Limpiamos el input
      setInput('');
    }
  };

  //Enviar el mensaje con el enter
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') handleSend();
  };

  //Esto si me lo saque del chatgpt XD, es basicamente que si Messages cambia porque agregamos un mensaje, verifica si
  // messagesEndRef.current existe, un div al final de los mensajes
  // Si esto es asi, pues hace un scroll automatico xd

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <div className="h-[95vh] w-full flex flex-col bg-white text-black dark:bg-[#181818] rounded-lg dark:text-white">
      {/* Header */}
      <div className="p-4 text-lg font-semibold border-b border-gray-300 dark:border-gray-700">
        Sala General
      </div>

      {/* Área de mensajes */}
      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-2">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`max-w-xs p-2 rounded break-words ${msg.fromUser
              //Si el mensaje es del user se pone azul
              ? 'ml-auto bg-blue-500 dark:bg-blue-600 text-white'
              //Si el mensaje no es de un user se pone gris, esto hay que cambiarlo mas adelante
              : 'mr-auto bg-gray-200 dark:bg-gray-700 text-black dark:text-white'
              }`}
          >
            {msg.text}
          </div>
        ))}
        {/*Para el scroll pedorro*/}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-300 dark:border-gray-700 flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Escribe tu mensaje..."
          className="flex-1 p-2 rounded bg-gray-100 text-black dark:bg-[#2d2d2d] dark:text-white outline-none"
        />
        <button
          onClick={handleSend}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
        >
          Enviar
        </button>
      </div>
    </div>
  );
}

