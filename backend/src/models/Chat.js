import mongoose from 'mongoose'

const messageSchema = new mongoose.Schema({
  sender: {
    type: String, enum: ["user", "ai"], required: true
  },
  text: String,
  slides: Object,
  type: { type: String, default: "message" },
},
  { timestamps: true })

const chatSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId, ref: "User", required: true
  },
  title: {
    type: String, default: "New Chat"
  },
  messages: [messageSchema],
}, { timestamps: true })

export default mongoose.model("Chat", chatSchema);