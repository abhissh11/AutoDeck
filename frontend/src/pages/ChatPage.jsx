import React, { useEffect } from "react";
import ChatSidebar from "../components/ChatSidebar";
import ChatWindow from "../components/ChatWindow";
import { useChat } from "../hooks/useChat";

export default function ChatPage() {
  const {
    userChats,
    loadChat,
    startNewChat,
    messages,
    prompt,
    setPrompt,
    handleSend,
    handleEdit,
    handleDownload,
    loading,
    inputRef,
  } = useChat();

  useEffect(() => {
    startNewChat();
  }, []);

  return (
    <div className="flex h-screen bg-[#0d0d0f] text-white">
      <ChatSidebar chats={userChats} onSelectChat={loadChat} onNewChat={startNewChat} />
      <ChatWindow
        messages={messages}
        prompt={prompt}
        setPrompt={setPrompt}
        loading={loading}
        handleSend={handleSend}
        handleEdit={handleEdit}
        handleDownload={handleDownload}
        inputRef={inputRef}
      />
    </div>
  );
}
