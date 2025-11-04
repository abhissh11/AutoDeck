import User from "../models/User.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!email || !password || !name) {
      return res.status(400).json({ message: "All fields are required!" })
    }

    const emailNormalized = email.toLowerCase().trim()

    const existing = await User.findOne({ email: emailNormalized })
    if (existing) {
      return res.status(409).json("User already exist, Login instead!")
    }
    const hashed = await bcrypt.hash(password, 10);
    const user = new User({
      name,
      email: emailNormalized,
      password: hashed
    })

    await user.save();

    return res.status(201).json({ message: "Signup successful", user })

  } catch (error) {
    console.log('signup error', error)
    return res.status(500).json({ message: "Internal Server Error" })
  }
}

export const signin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Both fields are required" })
    }

    const emailNormalized = email.toLowerCase().trim();

    const user = await User.findOne({ email: emailNormalized }).select('+password')
    if (!user) {
      return res.status(401).json({ message: "User does not exist" });
    }
    const passw = await bcrypt.compare(password, user.password);
    if (!passw) {
      return res.status(401).json('Invalid password')
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "5d" })
    const { password: _, ...rest } = user.toObject();
    return res.status(200).json({ user: rest, token })


  } catch (error) {
    console.log('signin error', error)
    return res.status(500).json({ message: "Internal Server Error" })
  }
}