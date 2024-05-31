"use client";

import { useEffect, useState } from "react";
import { socket } from "@/app/socket";
import { CardsChat } from "./Chat";
import { useSession } from "next-auth/react"

export default function SocketCtx({
  messages: initialMessages,
  email
}: {
  messages: any[],
  email: string
}) {
  const [isConnected, setIsConnected] = useState(false);
  const [transport, setTransport] = useState("N/A");

  const [messages, setMessages] = useState<
    {
      role: string;
      content: string;
    }[]
  >(initialMessages);

  useEffect(() => {
    if (socket.connected) {
      onConnect();
    }

    function onConnect() {
      setIsConnected(true);
      setTransport(socket.io.engine.transport.name);

      socket.io.engine.on("upgrade", (transport: any) => {
        setTransport(transport.name);
      });
    }

    function onDisconnect() {
      setIsConnected(false);
      setTransport("N/A");
    }

    function onMessage(message: any) {
      setMessages((messages) => [...messages, message]);
    }

    socket.on("connect", onConnect);
    socket.on("message", onMessage);
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.off("connect", onConnect);
      socket.off("message", onMessage);
      socket.off("disconnect", onDisconnect);
    };
  }, []);

  const sendMessage = (msg: string) => {
    // Send the message to the server
    socket.emit('message', {
      chatroomId: 1,
      content: msg,
      role: email
    })
  };

  console.log({ messages })

  return (
    <div>
      <p>Status: {isConnected ? "connected" : "disconnected"}</p>
      <p>Transport: {transport}</p>
      <div className="flex md:flex-row md:gap-x-4 flex-col gap-y-4 md:gap-y-0">
        <CardsChat email={email} sendMessage={sendMessage} messages={messages} />
      </div>
    </div>
  );
}