import { useState, useRef, useEffect } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../context/ConsumerContext";
import { apiUrl } from "../lib/constants";

export function useChat() {
  const [messages, setMessages] = useState([]);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [chatId, setChatId] = useState(null);
  const [userChats, setUserChats] = useState([]);
  const inputRef = useRef(null);
  const { token } = useAuth();

  const apiBase = apiUrl;

  // === Fetch User Chats on Login ===
  useEffect(() => {
    if (token) fetchChats();
  }, [token]);

  // Fetch All Chats for Current User
  const fetchChats = async () => {
    try {
      const res = await fetch(`${apiBase}/chats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setUserChats(data.chats);
    } catch {
      toast.error("Failed to load chats");
    }
  };

  //  Load Selected Chat
  const loadChat = async (id) => {
    try {
      const res = await fetch(`${apiBase}/chats/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setChatId(id);
        setMessages(data.chat.messages);
      }
    } catch {
      toast.error("Failed to open chat");
    }
  };

  //  Save Chat (create or update)
  const saveChat = async (updatedMessages) => {
    try {
      const res = await fetch(`${apiBase}/chats/save`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ chatId, messages: updatedMessages }),
      });
      const data = await res.json();
      if (data.success) {
        setChatId(data.chat._id);
        fetchChats(); // refresh sidebar after save
      }
    } catch (err) {
      console.error("Save chat error:", err);
    }
  };

  // === Handle Sending Prompt ===
  const handleSend = async () => {
    if (!prompt.trim()) return;

    const userMsg = { sender: "user", text: prompt };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setPrompt("");

    // Temporary AI typing bubble
    const tempId = Date.now();
    setMessages((prev) => [
      ...prev,
      { sender: "ai", id: tempId, type: "loading", text: "AutoDeck is generating..." },
    ]);
    setLoading(true);

    try {
      const res = await fetch(`${apiBase}/ai/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);

      const finalMessages = newMessages.concat({
        sender: "ai",
        text: "Here’s your presentation structure:",
        slides: data.slides,
      });

      setMessages(finalMessages);
      saveChat(finalMessages);
      toast.success("Slides generated successfully!");
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to generate slides");
    } finally {
      setLoading(false);
    }
  };

  // === Handle Editing Existing Slides ===
  const handleEdit = async (slides) => {
    const editPrompt = prompt.trim();
    if (!editPrompt) {
      toast.info("✏️ Type what you want to change, then click 'Edit Slides'.");
      inputRef.current?.focus();
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${apiBase}/ai/edit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ slides, prompt: editPrompt }),
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.message || "Failed to edit slides");

      const finalMessages = [
        ...messages,
        { sender: "ai", text: `Updated slides based on: "${editPrompt}"`, slides: data.slides },
      ];
      setMessages(finalMessages);
      saveChat(finalMessages);

      toast.success("Slides updated successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to edit slides");
    } finally {
      setLoading(false);
      setPrompt("");
    }
  };

  // === Handle Download (PPT or PDF) ===
  const handleDownload = async (slides, format) => {
    try {
      const res = await fetch(`${apiBase}/ai/${format}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ slides: slides.slides }),
      });

      if (!res.ok) throw new Error(`Failed to generate ${format.toUpperCase()}`);
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `slides_${Date.now()}.${format}`;
      document.body.appendChild(a);
      a.click();
      a.remove();

      toast.success(`${format.toUpperCase()} downloaded successfully!`);
    } catch (err) {
      console.error(err);
      toast.error(`Failed to download ${format.toUpperCase()}`);
    }
  };

  // === Start a New Chat ===
  const startNewChat = () => {
    if (messages.length > 0) saveChat(messages);
    setMessages([]);
    setChatId(null);
    setPrompt("");
  };

  return {
    messages,
    prompt,
    setPrompt,
    handleSend,
    handleEdit,
    handleDownload,
    userChats,
    loadChat,
    startNewChat,
    loading,
    inputRef,
  };
}
