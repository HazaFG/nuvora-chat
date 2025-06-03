'use client';

import React, { JSX, useEffect, useRef, useState } from 'react';
import io, { Socket } from 'socket.io-client';

const websocketUrl = process.env.NEXT_PUBLIC_WEBSOCKET_URL || 'http://localhost:3000';

interface Message {
  id: number;
  text: string;
  fromUser: boolean; // Para diferenciar si es un mensaje enviado por este cliente o recibido
}

export default function ChatTemplate(): JSX.Element {
  // Referencia para mantener la instancia del socket a través de renders
  const socketRef = useRef<Socket | null>(null);

  // Estado para los mensajes, inicializamos vacío para que el backend los cargue
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>('');

  // Referencia para hacer scroll automático al final de los mensajes
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  // Estado para manejar errores de conexión
  const [errorConexion, setErrorConexion] = useState<string | null>(null);

  // Datos de autenticación 
  const [username] = useState('andrea'); // esto aun es fake xd
  const [token] = useState('123'); // dato para ser usado despues como id de user xd

  useEffect(() => {
    if (!websocketUrl) {
      setErrorConexion("URL del WebSocket no configurada en las variables de entorno.");
      return;
    }

    const newSocket = io(websocketUrl, {
      auth: {
        token: token,
        username: username,
        serverOffset: 0,
      },
    });

    socketRef.current = newSocket; // Guarda la instancia del socket en la referencia

    // Manejadores de eventos de Socket.IO
    newSocket.on('connect', () => {
      console.log('Conectado al servidor de sockets');
      setErrorConexion(null);
    });

    newSocket.on('disconnect', (reason) => {
      console.log('Desconectado del servidor de sockets:', reason);
      setErrorConexion(`Desconectado: ${reason}. Intentando reconectar...`);
    });

    newSocket.on('connect_error', (err) => {
      console.error('Error de conexión de socket:', err.message);
      setErrorConexion(`Error de conexión al chat: ${err.message}. Asegúrate de que el backend esté corriendo.`);
    });

    // Escucha el evento 'chat message' que viene del backend equis de
    newSocket.on('chat message', (msg: string, serverOffset: number) => {
      // El 'fromUser: false' indica que es un mensaje recibido de otro lado
      setMessages((prev) => [
        ...prev,
        { id: prev.length + 1, text: msg, fromUser: false },
      ]);

      // Actualiza el serverOffset en la autenticación del socket
      if (newSocket.auth) {
        newSocket.auth.serverOffset = serverOffset;
      }
    });

    // Función de limpieza para desconectar el socket cuando el componente se desmonte
    return () => {
      newSocket.disconnect();
    };
  }, [username, token]); // Las dependencias aseguran que el efecto se re-ejecute si username/token cambian

  // --- Lógica para Scroll Automático ---
  useEffect(() => {
    // Hace scroll al último mensaje cada vez que la lista de mensajes se actualiza
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSend = (): void => {
    const trimmed = input.trim();
    if (trimmed !== '') {
      // **Emite el mensaje al backend via Socket.IO**
      if (socketRef.current) {
        socketRef.current.emit('send message', trimmed);
      }

      // ¡¡¡IMPORTANTE!!!
      // Hemos ELIMINADO la línea que agregaba el mensaje localmente:
      // setMessages((prev) => [
      //   ...prev,
      //   { id: prev.length + 1, text: trimmed, fromUser: true },
      // ]);

      setInput('');
    }
  };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-header">Sala General</div>

      {errorConexion && (
        <div className="text-red-500 p-2 text-center">{errorConexion}</div>
      )}

      <div className="chat-messages">
        {messages.length === 0 && !errorConexion ? (
          <div className="p-2 text-gray-500 dark:text-gray-400">
            Cargando mensajes o inicia una conversación...
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`chat-message ${msg.fromUser ? 'chat-message-user' : 'chat-message-bot'}`}
            >
              {msg.text}
            </div>
          ))
        )}
        <div ref={messagesEndRef} /> {/* Punto de referencia para el scroll */}
      </div>

      <div className="chat-input">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Escribe tu mensaje..."
          className="chat-text-input"
          disabled={!!errorConexion} // Deshabilita el input si hay un error de conexión
        />
        <button
          onClick={handleSend}
          className="chat-send-button"
          disabled={!!errorConexion || input.trim() === ''} // Deshabilita si hay error o input vacío
        >
          Enviar
        </button>
      </div>
    </div>
  );
}
