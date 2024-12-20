"use client";

import { ChatWrapper } from "@/components/chatWrapper";
import { Message } from "ai";
import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

interface ChatbotPageProps {
  params: {
    url: string | string[] | undefined;
  };
}

function fullUrl({ url }: { url: string[] }) {
  const decodedParts = url.map((urlPart) => decodeURIComponent(urlPart));

  let joinedUrl = decodedParts.join("/");

  joinedUrl = "https://" + joinedUrl.slice(7);

  // Garante que o protocolo está correto
  if (!joinedUrl.startsWith("http://") && joinedUrl.startsWith("http:///")) {
    throw new Error(`Invalid URL format: ${joinedUrl}`);
  }

  return joinedUrl;
}

const ChatbotPage = ({ params }: ChatbotPageProps) => {
  const [initialMessages, setInitialMessages] = useState<Message[]>([]);
  const [reconstructUrl, setReconstructUrl] = useState<string>("");

  const sessionId = React.useMemo(
    () => (reconstructUrl + "--" + uuidv4()).replace(/\//g, ""),
    [reconstructUrl]
  );

  useEffect(() => {
    try {
      const url = fullUrl({ url: params.url as string[] });
      setReconstructUrl(url);

      generateIAResume(url);
    } catch (error) {
      console.error("Erro ao reconstruir a URL:", error);
    }
  }, [params.url]);

  useEffect(() => {
    //console.log(initialMessages)
  }, [initialMessages]);

  const generateIAResume = async (url: string) => {
    try {
      const response = await fetch("http://localhost:5000/api/resume", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erro no servidor: ${errorText}`);
      }

      const data = await response.text();
      setInitialMessages((prev: Message[]) => [
        ...prev,
        {
          content: data,
          role: "assistant",
          id: uuidv4(),
        },
      ]);
    } catch (error) {
      console.error("Erro ao gerar resumo:", error);
      setInitialMessages((prev: Message[]) => [
        ...prev,
        {
          content: "Erro ao processar sua mensagem. Tente novamente.",
          role: "error",
          id: uuidv4(),
        },
      ]);
    }
  };

  return (
    <ChatWrapper key={sessionId} sessionId={sessionId} initialMessages={initialMessages} />
  );
};

export default ChatbotPage;
