import {
  ArrowRight,
  CloudDownload,
  Download,
  SquarePen,
  Sparkles,
} from "lucide-react";
import React, { useRef, useEffect, useState } from "react";

export default function ChatWindow({
  messages,
  prompt,
  setPrompt,
  loading,
  handleSend,
  handleEdit,
  handleDownload,
  inputRef,
}) {
  const endRef = useRef(null);
  const [userName, setUserName] = useState("");

  // Auto-scroll on new messages
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  //  Get user from localStorage
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.name) setUserName(user.name);
  }, []);

  //  Handle Enter key submission
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex-1 flex flex-col h-screen pt-16 bg-[#0d0d0f] text-gray-100">
      <div className="flex-1 overflow-y-auto px-6 py-10 max-w-3xl mx-auto w-full">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-400 text-center space-y-3">
            {userName && (
              <h2 className="text-3xl font-semibold bg-linear-to-r from-blue-400 to-violet-500 bg-clip-text text-transparent">
                Hi {userName}!
              </h2>
            )}
            <p className="text-lg font-medium text-gray-300">
              What are you working on today?
            </p>
            <p className="text-sm flex items-center gap-2 text-gray-400">
              Ask <span className="text-violet-500 font-semibold">AutoDeck</span>{" "}
              to generate or modify your slides
              <span className="text-violet-500">
                <Sparkles />
              </span>
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"
                  }`}
              >
                <div
                  className={`max-w-[80%] px-4 py-3 rounded-xl text-sm ${msg.sender === "user"
                    ? "bg-[#2b2b2b] text-gray-100"
                    : "bg-[#1a1a1a] border border-gray-800 text-gray-200"
                    }`}
                >
                  {/* Typing Animation */}
                  {msg.type === "loading" ? (
                    <div className="flex items-center space-x-2 text-gray-400">
                      <span>AutoDeck is generating</span>
                      <div className="flex items-center space-x-1">
                        <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                        <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                        <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" />
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="font-medium">{msg.text}</p>

                      {msg.slides?.slides && (
                        <div className="mt-2 space-y-3">
                          {msg.slides.slides.map((s, si) => (
                            <div
                              key={si}
                              className="bg-[#141414] border border-gray-800 rounded-md p-3"
                            >
                              <p className="font-semibold text-blue-400">
                                {s.title}
                              </p>
                              <ul className="list-disc list-inside text-gray-300 mt-1 text-xs">
                                {s.content.map((c, ci) => (
                                  <li key={ci}>{c}</li>
                                ))}
                              </ul>
                            </div>
                          ))}
                          <div className="flex gap-4 text-xs text-gray-400">
                            <button
                              onClick={() => handleDownload(msg.slides, "pptx")}
                              className="hover:text-blue-400 flex gap-1 items-center"
                            >
                              <CloudDownload size={14} /> PPT
                            </button>
                            <button
                              onClick={() => handleDownload(msg.slides, "pdf")}
                              className="hover:text-red-400 flex gap-1 items-center"
                            >
                              <Download size={14} /> PDF
                            </button>
                            <button
                              onClick={() => handleEdit(msg.slides)}
                              className="hover:text-green-400 flex gap-1 items-center"
                            >
                              <SquarePen size={14} /> Edit
                            </button>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            ))}
            <div ref={endRef} />
          </div>
        )}
      </div>

      {/* Input Section */}
      <div className="border-t border-gray-800 bg-[#0f0f10] px-4 py-4">
        <div className="max-w-3xl mx-auto flex items-center gap-3 w-full">
          {/*  Use textarea for multiline + Enter key support */}
          <textarea
            ref={inputRef}
            className="flex-1 resize-none bg-[#1a1a1a] border border-gray-800 rounded-lg px-4 py-3 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-600"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Ask AutoDeck to make or edit slides..."
            rows={1}
          />
          <button
            onClick={handleSend}
            disabled={loading}
            className="bg-[#2b2b2b] hover:bg-[#3b3b3b] cursor-pointer border border-gray-700 px-5 py-3 rounded-lg text-gray-200 font-medium transition-all"
          >
            {loading ? "..." : <ArrowRight size={20} />}
          </button>
        </div>
      </div>
    </div>
  );
}
