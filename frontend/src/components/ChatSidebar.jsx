import React from "react";
import { Plus, MessageSquare } from "lucide-react";

export default function ChatSidebar({ chats, onSelectChat, onNewChat }) {
  return (
    <div className="h-[90svh] pt-16 flex flex-col bg-[#0d0d0f] text-gray-200">
      <div className="p-4 border-b border-gray-800">
        <button
          onClick={onNewChat}
          className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#1a1a1a] hover:bg-[#232323] border border-gray-700 rounded-md text-sm transition-all"
        >
          <Plus size={16} /> New Chat
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-3">
        <h4 className="text-xs text-gray-500 uppercase tracking-wide mb-2">
          Your Chats
        </h4>
        {chats.length === 0 ? (
          <p className="text-gray-500 text-sm px-2">No chats yet</p>
        ) : (
          chats.map((chat) => (
            <div
              key={chat._id}
              onClick={() => onSelectChat(chat._id)}
              className="flex items-center gap-2 text-sm text-gray-300 hover:bg-[#1a1a1a] px-3 py-2 rounded-md cursor-pointer transition-all"
            >
              <MessageSquare size={14} />
              <span className="truncate">{chat.title}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
