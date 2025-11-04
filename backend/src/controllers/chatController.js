import Chat from "../models/Chat.js";


export const saveChat = async (req, res) => {
  try {
    const { chatId, messages } = req.body;
    const userId = req.user._id;

    let chat;
    if (chatId) {
      chat = await Chat.findOneAndUpdate(
        { _id: chatId, user: userId }, { messages, updatedAt: Date.now() }, { new: true }
      );
    } else {
      chat = await Chat.create({
        user: userId,
        title: messages[0]?.text?.slice(0, 40) || "New Chat",
        messages
      })
    }
    res.json({ success: true, chat });
  }
  catch (error) {
    console.error("Error saving chat:", error);
    res.status(500).json({ success: false, message: "Failed to save chat" });
  }
}

// Get All Chats for a User
export const getChats = async (req, res) => {
  try {
    const chats = await Chat.find({ user: req.user._id })
      .select("_id title createdAt")
      .sort({ updatedAt: -1 });
    res.json({ success: true, chats });
  } catch (err) {
    console.error("Error fetching chats:", error);
    res.status(500).json({ success: false, message: "Failed to load chats" });
  }
};

//  Get Single Chat by ID
export const getChatById = async (req, res) => {
  try {
    const chat = await Chat.findOne({ _id: req.params.id, user: req.user._id });
    if (!chat) return res.status(404).json({ success: false, message: "Chat not found" });
    res.json({ success: true, chat });
  } catch (err) {
    console.error(" Error fetching chat by ID:", error);
    res.status(500).json({ success: false, message: "Failed to load chat" });
  }
};