import React, { useEffect, useState } from "react";
import ChatSidebar from "../components/ChatSidebar";
import ChatWindow from "../components/ChatWindow";
import { useChat } from "../hooks/useChat";
import Header from "../components/Header";

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


  const [isSidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    startNewChat();
  }, []);

  return (
    <div className="flex flex-col h-screen bg-[#0d0d0f] text-white overflow-hidden">
      {/*  Header with menu control */}
      <Header onMenuClick={() => setSidebarOpen((prev) => !prev)} />

      <div className="flex flex-1 relative">
        {/*  Sidebar (hidden on mobile, slides in on toggle) */}
        <div
          className={`fixed sm:static top-0 left-0 h-full bg-[#0d0d0f] border-r border-gray-800 transform transition-transform duration-300 z-40 w-72 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full sm:translate-x-0"
            }`}
        >
          <ChatSidebar
            chats={userChats}
            onSelectChat={(id) => {
              loadChat(id);
              setSidebarOpen(false);
            }}
            onNewChat={() => {
              startNewChat();
              setSidebarOpen(false);
            }}
          />
        </div>

        {/* Overlay for mobile when sidebar is open */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-30 sm:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/*  Chat Window */}
        <div className="flex-1 overflow-hidden">
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
      </div>
    </div>
  );

}
