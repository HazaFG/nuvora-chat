'use client';

import React, { JSX, useEffect, useRef, useState } from 'react';
import io, { Socket } from 'socket.io-client';
import { MediaComponent } from './MediaComponent';

const websocketUrl = process.env.NEXT_PUBLIC_WEBSOCKET_URL || 'http://localhost:3000';

interface Message {
  id: number;
  text: string;
  fromUser: boolean;
  mimeType?: string;
  media?: string;
}

export default function ChatTemplate(): JSX.Element {
  const socketRef = useRef<Socket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);
  const [errorConexion, setErrorConexion] = useState<string | null>(null);
  const [username] = useState('andrea');
  const [token] = useState('123');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const socket = io(websocketUrl, {
      auth: {
        token,
        username,
        serverOffset: 0,
      },
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('Conectado al servidor de sockets');
      setErrorConexion(null);
    });

    socket.on('disconnect', (reason) => {
      console.warn('Desconectado:', reason);
      setErrorConexion(`Desconectado: ${reason}. Intentando reconectar...`);
    });

    socket.on('connect_error', (err) => {
      console.error('Error de conexión:', err.message);
      setErrorConexion(`Error de conexión al chat: ${err.message}`);
    });

    socket.on('chat message', (msg_wrapper: any, serverOffset: number) => {
      const { msg, media, mime_type } = msg_wrapper;

      // Si el mensaje incluye datos de media que son un Buffer y un array de datos, significa que se envió un archivo.
      if (media?.type === 'Buffer' && Array.isArray(media.data)) {
        //Nuesto arraybuffer pedorro
        const uint8Array = new Uint8Array(media.data);

        //tipo de dato que se utiliza para almacenar y manipular datos binarios grandes, como imágenes, archivos de audio, videos, o cualquier otro tipo de archivo binario que no sea texto
        const blob = new Blob([uint8Array], { type: mime_type || 'application/octet-stream' });

        //API asincrónica que permite leer el contenido de archivos (objetos File) o blobs de datos de forma asíncrona
        const reader = new FileReader();
        reader.onload = () => {
          setMessages((prev) => [
            ...prev,
            {
              id: Date.now() + Math.random(),
              text: msg,
              fromUser: false,
              media: reader.result as string,
              mimeType: mime_type,
            },
          ]);
        };
        reader.readAsDataURL(blob);
      } else {
        // Solo texto
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + Math.random(),
            text: msg,
            fromUser: false,
            media: undefined,
            mimeType: mime_type,
          },
        ]);
      }

      if (socket.auth) {
        socket.auth.serverOffset = serverOffset;
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [username, token]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    const socket = socketRef.current;
    if (!socket) return;

    const trimmedInput = input.trim();

    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const arrayBuffer = reader.result as ArrayBuffer;
        const uint8Array = new Uint8Array(arrayBuffer);
        const mimeType = file.type;

        socket.emit('send message', {
          msg: trimmedInput || '',
          media: uint8Array,
          mime_type: mimeType,
        });

        const objectUrl = URL.createObjectURL(file);
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + Math.random(),
            text: trimmedInput || `Archivo: ${file.name}`,
            fromUser: true,
            media: objectUrl,
            mimeType,
          },
        ]);

        setInput('');
        setFile(null);
        fileInputRef.current!.value = '';
      };
      reader.readAsArrayBuffer(file);
    } else if (trimmedInput !== '') {
      socket.emit('send message', { msg: trimmedInput, media: '' });
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + Math.random(), text: trimmedInput, fromUser: true },
      ]);
      setInput('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      setFile(e.target.files[0]);
    } else {
      setFile(null);
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
          <div className="p-2 text-gray-500">Cargando mensajes...</div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`chat-message ${msg.fromUser ? 'chat-message-user' : 'chat-message-bot'}`}
            >
              <MediaComponent
                mimeType={msg.mimeType}
                media={msg.media}
                text={msg.text}
              />
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Escribe tu mensaje..."
          disabled={!!errorConexion}
          className="chat-text-input"
        />
        <button
          onClick={handleSend}
          disabled={!!errorConexion || (!input.trim() && !file)}
          className="chat-send-button"
        >
          Enviar
        </button>
      </div>
      <div className="chat-input">
        <input
          type="file"
          id="file-upload"
          onChange={handleFileChange}
          ref={fileInputRef}
          className="chat-file-input"
          disabled={!!errorConexion}
        />
        <label htmlFor="file-upload" className="custom-file-upload">
          {file ? file.name : 'Seleccionar Archivo'}
        </label>
      </div>
    </div>
  );
}

