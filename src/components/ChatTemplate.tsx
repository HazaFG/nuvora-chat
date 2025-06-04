'use client';

import React, { JSX, useEffect, useRef, useState } from 'react';
import io, { Socket } from 'socket.io-client';
import MediaDisplay from './MediaDisplay';
import Cookies from 'js-cookie';

const websocketUrl = process.env.NEXT_PUBLIC_WEBSOCKET_URL || 'http://localhost:3000';

interface Message {
  id: number;
  text: string;
  fromUser: boolean; // Para diferenciar si es un mensaje enviado por este cliente o recibido
  media: string;
  mimeType: string;
  timestamp?: string;
}

export default function ChatTemplate(): JSX.Element {
  // Referencia para mantener la instancia del socket a través de renders
  const userId = Cookies.get('userId');
  const socketRef = useRef<Socket | null>(null);

  // Estado para los mensajes, inicializamos vacío para que el backend los cargue
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>('');
  const [file, setFile] = useState<File | null>('');

  // Referencia para hacer scroll automático al final de los mensajes
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  // Estado para manejar errores de conexión
  const [errorConexion, setErrorConexion] = useState<string | null>(null);

  // Datos de autenticación 
  // TOFIX: Guarda el nombre de usuario en una coookie para poder guardarlo aqui
  const username = Cookies.get('name');
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
    newSocket.on('chat message', (msg_wrapper: any, serverOffset: number) => {
      const { msg, media, mime_type, user_id, name, timestamp } = msg_wrapper
      // El 'fromUser: false' indica que es un mensaje recibido de otro lado
      setMessages((prev) => [
        ...prev,
        { id: prev.length + 1,
           text: msg, 
           fromUser: false, 
           media: media, 
           mime_type: mime_type,
           timestamp:timestamp, 
           user_id: user_id, 
           name: name },
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
    if (trimmed !== '' || file) {
      // **Emite el mensaje al backend via Socket.IO**
      const reader = new FileReader();
      reader.onload = function() {
        const bytes = new Uint8Array(this.result);
        const mediaType = file.type.split('/')[0]
        socketRef.current.emit('send message', { media: bytes, msg: input, mime_type: mediaType, name: username, user_id: userId });
      };

      if (socketRef.current) {
        if (file) {
          reader.readAsArrayBuffer(file);
        } else {
          socketRef.current.emit('send message', { media: bytes, msg: trimmed, mime_type: mediaType, name: username, user_id: userId });
        }
      }

      setInput('');
    }
  };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (timestamp: string | undefined): string => {
    if (!timestamp) return '';

    const utcTimestampString = timestamp.endsWith('Z') ? timestamp : `${timestamp}Z`;
    
    const date = new Date(utcTimestampString); //ahora si lo interpreta como UTC
    
    const hours = date.getHours().toString().padStart(2, '0'); 
    const minutes = date.getMinutes().toString().padStart(2, '0'); 
    
    return `${hours}:${minutes}`;
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
              <span class="silent italic bold">
                {msg.name}:
              </span>

              <MediaDisplay media={msg.media} mimeType={msg.mime_type} />
                {msg.text}
                {msg.timestamp && (
                  <span className="message-time">
                    {formatTime(msg.timestamp)}
                  </span>
                )}
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
          disabled={!!errorConexion} // Deshabilita si hay error o input vacío
        >
          Enviar
        </button>
      </div>
      <div className='chat-input'>
        <input
          type="file"
          onChange={(e) => {
            if (e.target.files) {
              setFile(e.target.files[0])
            }
          }}
          onKeyDown={handleKeyDown}
          placeholder="Escribe tu mensaje..."
          className="chat-text-input"
          disabled={!!errorConexion} // Deshabilita el input si hay un error de conexión
        />
      </div>

    </div>
  );
}
