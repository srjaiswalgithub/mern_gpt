import './dashboardPage.css'
import { useNavigate } from "react-router-dom";

import { GoogleGenerativeAI } from '@google/generative-ai';
import {  useState } from 'react';
import { CiRedo } from "react-icons/ci";


function DashboardPage() {
  const navigate = useNavigate();
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [texting, setTexting] = useState(false);
  const fetching = async(question ,answer)=>{
    
    try{


      const response = await fetch(`https://mern-gpt-1-wnnk.onrender.com/api/chats`, {
        method: "POST",
        credentials: "include", // Only keep this once
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: question && question.length ? question : undefined, // Optional, cleaner check
          answer,
          
        }),
      });

      if (response.ok){
        
        const id = await response.json();
        
        setLoading(false);
        navigate(`/dashboard/chats/${id}`);
    }
      
  
    }catch(error){
      console.log(error);
    }
  }

  const handleSubmit = async(e)=>{
    e.preventDefault();
    const text = e.target.text.value.trim();
    if (!text) return;
    setQuestion(text);
    setTexting(false);
    setLoading(true);


  
    try{
      const genAI = new GoogleGenerativeAI(
        import.meta.env.VITE_GEMINI_PUBLIC_KEY
      );
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const result = await model.generateContentStream(text);
      
      
      let accumulatedText = "";

      for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        accumulatedText += chunkText; // Append chunk to accumulated text

        setAnswer((prev) => prev + chunkText); // Update answer state progressively
      }

      // Save the complete chat to the database
      await fetching(text, accumulatedText);
    }
    catch(error){
      console.log(error);
    }
          
        
    
    
  }

 
  return(
    <div className="dashboardPage">
      { loading?<CiRedo className="spinner" size={100}/>:(
      <>
      <div className="texts">
        <div className="logo">
          <img src="/logo.png" alt="" />
          <h1>MERNGPT</h1>
        </div>
        <div className="options">
          <div className="option">
            <img src="/chat.png" alt="" />
            <span>Create a New Chat</span>
          </div>
          <div className="option">
            <img src="/image.png" alt="" />
            <span>Analyze Images</span>
          </div>
          <div className="option">
            <img src="/code.png" alt="" />
            <span>Help me with my Code</span>
          </div>
        </div>
      </div>
      <div className="formContainer">
        <form onSubmit={handleSubmit} >
          <input type="text" name="text" placeholder="Ask me anything..." onChange = {(e)=>setTexting(e.target.value.trim().length>0)}/>
          <button  style={{ backgroundColor: texting ? "white" : "#605e68" }}>
            <img src="/arrow.png" alt="" / >
          </button>
          
        </form>
      </div>
      </>)}
    </div>
  )
  
}

export default DashboardPage





