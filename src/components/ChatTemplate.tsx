'use client';

import React, { JSX, useEffect, useRef, useState } from 'react';
import io, { Socket } from 'socket.io-client';
import MediaDisplay from './MediaDisplay';
import Cookies from 'js-cookie';
import Spinner from './Spinner';

const websocketUrl = process.env.NEXT_PUBLIC_WEBSOCKET_URL || 'http://localhost:3000';
const emojiApiKey = process.env.NEXT_PUBLIC_EMOJI_API_KEY;

interface Message {
  id: number;
  text: string;
  fromUser: boolean; // Para diferenciar si es un mensaje enviado por este cliente o recibido
  media: string;
  mimeType: string;
  timestamp?: string;
  user_id: number; //id del usuario
  name: string;
}

interface Emoji {
  character: string;
  unicodeName: string;
  group: string;
}

export default function ChatTemplate({ roomId }: string): JSX.Element {
  // Referencia para mantener la instancia del socket a través de renders
  const socketRef = useRef<Socket | null>(null);

  // Estado para los mensajes, inicializamos vacío para que el backend los cargue
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);

  // Referencia para hacer scroll automático al final de los mensajes
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  // Estado para manejar errores de conexión
  const [errorConexion, setErrorConexion] = useState<string | null>(null);

  // Datos de autenticación 
  // TOFIX: Guarda el nombre de usuario en una coookie para poder guardarlo aqui
  const username = Cookies.get('name');
  const [token] = useState('123'); // dato para ser usado despues como id de user xd
  const [currentUserData, setCurrentUserData] = useState<{ id: number; name: string; token: string } | null>(null);
  const [loadingUserData, setLoadingUserData] = useState(true);

  //estados para las fucniones de los emojis
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false); //selector
  const [emojis, setEmojis] = useState<Emoji[]>([]); //almacena
  const [groupedEmojis, setGroupedEmojis] = useState<{ [key: string]: Emoji[] }>({}); //agrupados por categorias
  const [emojiError, setEmojiError] = useState<string | null>(null); //errores

  const inputRef = useRef<HTMLInputElement | null>(null); //pos de selector

  //cargar los datos del usuario desde las cookies
  useEffect(() => {
    //este codigo se ejecuta solo en el cliente
    const userIdCookie = Cookies.get('userId');
    const userNameCookie = Cookies.get('name');
    const userTokenCookie = Cookies.get('token');

    if (userIdCookie && userNameCookie && userTokenCookie) {
      const parsedUserId = parseInt(userIdCookie, 10);
      if (!isNaN(parsedUserId)) {
        setCurrentUserData({
          id: parsedUserId,
          name: userNameCookie,
          token: userTokenCookie,
        });
      } else {
        setErrorConexion("ID de usuario no valido en la cookie.");
      }
    } else {
      setErrorConexion("No cookies. Vuelve a iniciar sesion.");
    }
    setLoadingUserData(false); //carga inicial de cookies ha terminado
  }, []);

  useEffect(() => {
    if (!websocketUrl) {
      setErrorConexion("URL del WebSocket no configurada en las variables de entorno.");
      return;
    }

    //espera a que los datos del usuario esten cargados y sean validos
    if (loadingUserData || !currentUserData) {
      console.log("Esperando datos de usuario o usuario no logueado...");
      setErrorConexion("Esperando datos de usuario. No se puede conectar al chat.");
      return;
    }

    //si current data existe se obtienen los datos
    const { id, name, token } = currentUserData;

    console.log("Conectando con userId:", id, "username:", name, "token:", token);

    const newSocket = io(websocketUrl, {
      auth: {
        token: token,
        username: username,
        userId: id,
        room_id: roomId,
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

      setMessages((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          text: msg,
          fromUser: (user_id === currentUserData.id),
          media: media,
          mime_type: mime_type,
          timestamp: timestamp,
          user_id: user_id,
          name: name
        },
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
  }, [loadingUserData, currentUserData]);

  // --- Lógica para Scroll Automático ---
  useEffect(() => {
    // Hace scroll al último mensaje cada vez que la lista de mensajes se actualiza
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  //cargar emojis por catrgorias
  const fetchEmojis = async () => {
    if (!emojiApiKey) {
      setEmojiError("No env");
      return;
    }

    setEmojiError(null);

    try {
      const response = await fetch(`https://emoji-api.com/emojis?access_key=${emojiApiKey}`);

      if (!response.ok) {
        throw new Error(`Error al cargar emojis: ${response.statusText}`);
      }

      const data: Emoji[] = await response.json();
      setEmojis(data);

      //agruparlos por su propiedad 'group'
      const grouped: { [key: string]: Emoji[] } = data.reduce((acc, emoji) => {

        const groupName = emoji.group || 'Sin Categoría';
        if (!acc[groupName]) {
          acc[groupName] = [];
        }
        acc[groupName].push(emoji);
        return acc;
      }, {} as { [key: string]: Emoji[] }); // Casteo inicial para TypeScript

      setGroupedEmojis(grouped);

    } catch (e: any) {
      console.error("Error fetching emojis:", e);
      setEmojiError(e.message || "No se pudieron cargar los emojis.");
    }
  };

  //manejador btn emoji
  const handleEmojiPicker = () => {
    setShowEmojiPicker(prev => !prev);
    //picker
    if (!showEmojiPicker && Object.keys(groupedEmojis).length === 0) {
      fetchEmojis();
    }
  };

  //manejador select emoji
  const handleSelectEmoji = (emojiCharacter: string) => {
    setInput(prev => prev + emojiCharacter); //a;ade emoji al input
    setShowEmojiPicker(false); //oculta selector
    inputRef.current?.focus(); //vuelve a enfocar el input
  };

  const handleSend = (): void => {
    const trimmed = input.trim();

    //asegurarse de que el socket está conectado y tenemos los datos del usuario
    if (!socketRef.current || !currentUserData || loadingUserData) {
      console.warn("No se puede enviar el mensaje: Socket no conectado, usuario no autenticado o cargando.");
      return;
    }

    const { id, name } = currentUserData; //ID y nombre del usuario actual

    const emitMessage = (mediaData: string | Uint8Array, mimeType: string) => {
      socketRef.current?.emit('send message', {
        media: mediaData,
        msg: trimmed,
        mime_type: mimeType,
        name: name,
        user_id: id
      });
    };

    if (file) {
      const reader = new FileReader();
      reader.onload = function() {
        const bytes = new Uint8Array(this.result as ArrayBuffer);
        const mediaType = file.type.split('/')[0];
        emitMessage(bytes, mediaType);
      };
      reader.readAsArrayBuffer(file);
    } else {
      emitMessage("", ""); // Para mensajes sin archivo
    }

    setInput('');
    setFile(null);
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

      <div className="chat-messages flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && !errorConexion ? (
          <div className="p-2 text-gray-500 dark:text-gray-400 text-center">
            {/* Cargando mensajes o inicia una conversación... */}
            <Spinner />
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-end gap-2 ${msg.user_id === currentUserData?.id
                ? 'justify-end' //mensajes a la derecha xd 
                : 'justify-start' // mensajes de la izquierda
                }`}
            >
              {/* esta es la foto de perfil para mensajes que no son tuyos */}
              {msg.user_id !== currentUserData?.id && (
                <img
                  src={msg.profile_picture || '/cloudWhite.png'}
                  alt="Perfil"
                  className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                />
              )}

              <div
                className={`flex flex-col p-3 rounded-lg max-w-[80%] md:max-w-[60%] lg:max-w-[50%] relative shadow-md ${msg.user_id === currentUserData?.id
                  ? 'bg-green-200 dark:bg-green-700 rounded-br-none self-end text-right'
                  : 'bg-white dark:bg-gray-700 rounded-bl-none self-start text-left'
                  }`}
              >
                <span
                  className={`font-bold text-sm mb-1 ${msg.user_id === currentUserData?.id
                    ? 'text-green-800 dark:text-green-200'
                    : 'text-blue-600 dark:text-blue-300'
                    }`}
                >
                  {msg.name}:
                </span>

                {/* MediaDisplay con tamaño fijo */}
                {msg.media && (
                  <div className="my-2">
                    <MediaDisplay
                      media={msg.media}
                      mimeType={msg.mime_type}
                      className="w-[500px] h-[500px] object-cover rounded-md flex-shrink-0"
                    />
                  </div>
                )}
                <p className="text-gray-800 dark:text-gray-100 break-words whitespace-pre-wrap">
                  {msg.text}
                </p>
                {msg.timestamp && (
                  <span
                    className={`text-xs mt-1 ${msg.user_id === currentUserData?.id
                      ? 'text-green-700 dark:text-green-300'
                      : 'text-gray-500 dark:text-gray-400'
                      } self-end`}
                  >
                    {formatTime(msg.timestamp)}
                  </span>
                )}
              </div>

              {/* Perfl foto para mensajes del usuario actual */}
              {msg.user_id === currentUserData?.id && (
                <img
                  src={currentUserData?.profile_picture || '/cloudWhite.png'}
                  alt="Perfil"
                  className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                />
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
          ref={inputRef}
        />
        <button
          onClick={handleSend}
          className="chat-send-button"
          disabled={!!errorConexion || (input.trim() === '' && !file)} //deshabilita si hay error o input vacio
        >
          Enviar
        </button>

        <button
          onClick={handleEmojiPicker}
          className="chat-emoji-button cursor-pointer"
          disabled={!!errorConexion}
        >
          Emoji
        </button>
      </div>

      {showEmojiPicker && (
        <div className="absolute bottom-54 right-20 bg-white border border-gray-300 rounded-lg shadow-xl overflow-y-auto overflow-x-hidden max-h-[30vh] max-w-[70vh] z-20">
          {emojiError && <div className="p-3 text-center text-red-500 bg-red-100 border-b border-red-200">{emojiError}</div>}

          {Object.keys(groupedEmojis).length > 0 ? (
            Object.keys(groupedEmojis).map((groupName) => (
              <div key={groupName} className="p-3 border-b border-gray-200 last:border-b-0">
                <h3 className="text-sm font-semibold text-gray-600 mb-2 capitalize">{groupName.replace(/-/g, ' ')}</h3> {/* Formatear nombre de grupo */}
                <div className="grid grid-cols-8 sm:grid-cols-10 md:grid-cols-12 lg:grid-cols-14 xl:grid-cols-16 gap-1"> {/* Grilla responsiva */}
                  {groupedEmojis[groupName]?.map((emoji) => (
                    <span
                      key={emoji.unicodeName}
                      className="text-2xl sm:text-3xl lg:text-4xl text-center cursor-pointer select-none p-1 rounded-md hover:bg-gray-100 transition-colors duration-150"
                      onClick={() => handleSelectEmoji(emoji.character)}
                      title={emoji.unicodeName}
                    >
                      {emoji.character}
                    </span>
                  ))}
                </div>
              </div>
            ))
          ) : (
            !emojiError && <div className="p-3 text-center text-gray-500">Cargando emojis...</div>
          )}
        </div>
      )}

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
