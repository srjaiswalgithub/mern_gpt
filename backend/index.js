import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import ImageKit from "imagekit";
import mongoose from "mongoose";
import Chat from "./models/chat.js";
import UserChats from "./models/userChats.js";
// import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";
import {  requireAuth } from "@clerk/express";
import path from "path";

const port = process.env.PORT || 3000;
const app = express();

app.use(
    cors({
      origin: process.env.FRONTEND_URL,
      credentials: true,
    })
  );
  
  app.use(express.json());

const connect = async () => {
try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("Connected to MongoDB");
} catch (err) {
    console.log(err);
}
};

const imagekit = new ImageKit({
    urlEndpoint: process.env.IMAGE_KIT_ENDPOINT,
    publicKey: process.env.IMAGE_KIT_PUBLIC_KEY,
    privateKey: process.env.IMAGE_KIT_PRIVATE_KEY,
});

app.get("/api/upload", (req, res) => {
    const result = imagekit.getAuthenticationParameters();
    res.send(result);
});


app.post("/api/chats", requireAuth(), async (req, res) => {
  const userId = req.auth.userId;
  const { question, answer } = req.body;
  
  // Ensure the request body contains valid inputs
  if (!question || !answer) {
    return res.status(400).json({ error: "Both 'text' and 'answer' are required." });
  }

  try {
    // Create a new chat with validated data
    const newChat = new Chat({
      userId: userId,
      history: [
        { role: "user", parts: [{ text: question }] },
        { role: "model", parts: [{ text: answer }] },
      ],
    });

    const savedChat = await newChat.save();
    // Check if the user's chats collection exists
    const userChats = await UserChats.findOne({ userId: userId });

    if (!userChats) {
      // Create a new UserChats document if it doesn't exist
      const newUserChats = new UserChats({
        userId: userId,
        chats: [
          {
            _id: savedChat._id,
            title: question.substring(0, 40),
          },
        ],
      });

      await newUserChats.save();

      return res.status(201).send(newChat._id);
    } else {
      // If the UserChats document exists, append the new chat
      await UserChats.updateOne(
        { userId: userId },
        {
          $push: {
            chats: {
              _id: savedChat._id,
              title: question.substring(0, 40),
            },
          },
        }
      );
      return res.status(201).send(newChat._id);
     
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Error creating chat!");
  }
});


app.get("/api/userchats", requireAuth(), async (req, res) => {
    const userId = req.auth.userId;
    try {
      const userChats = await UserChats.find({ userId });
      
      if(userChats.length===0){
        
        return res.status(200).json({
          success:true,
          userChats:[]
        })
      }
      
      res.status(200).json({
        success:true,
        userChats:userChats[0].chats
      })
    } catch (err) {
      console.log(err);
      res.status(500).send("Error fetching userchats!");
    }
  });

app.get("/api/chats/:id", requireAuth(), async (req, res) => {
const userId = req.auth.userId;
try {
    const chat = await Chat.findOne({ _id: req.params.id, userId });
    res.status(200).json({
      chat:chat,
      success:true
    })
} catch (err) {
    console.log(err);
    res.status(500).send("Error fetching chat!");
    
}
});

app.put("/api/chats/:id", requireAuth(), async (req, res) => {
    const userId = req.auth.userId;
    const { question, answer, img } = req.body;
    const newItems = [
      ...(question
        ? [{ role: "user", parts: [{ text: question }], ...(img && { img }) }]
        : []),
      { role: "model", parts: [{ text: answer }] },
    ];
  
    try {
      const updatedChat = await Chat.updateOne(
        { _id: req.params.id, userId },
        {
          $push: {
            history: {
              $each: newItems,
            },
          },
        }
      );
      
      res.status(200).json({
        updatedChat,
        success:true
      })
    } catch (err) {
      console.log(err);
      res.status(500).send("Error adding conversation!");
    }
});
  
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(401).send("Unauthenticated!");
});



const __dirname = path.resolve();


app.use(express.static(path.join(__dirname,"/frontend/dist")));
app.get("*",(req,res)=>{
  res.sendFile(path.resolve(__dirname,"frontend","dist","index.html"));
})


app.listen(port, () => {
    connect();
    console.log(`Server running on ${port}`);
});