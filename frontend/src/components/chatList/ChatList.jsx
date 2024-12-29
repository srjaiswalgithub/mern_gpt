import './chatList.css'
import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from 'react';
import axios from 'axios';

function ChatList() {
   const [isPending,setIsPending] = useState(true);
   const [isError,setIsError] = useState(false);
   const [data,setData] = useState("");
   const params = useParams();
   const chatId = params.id;

  const userChats = async()=>{
    try{
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/userchats`,{withCredentials:true});
      if(res?.data?.success){
        setData(res?.data?.userChats);
        setIsPending(false);
        
      }
    }
    catch(error){
      setIsError(true);
      console.log(error);
    }
    
    
  }
   
  // Use useEffect to call userChats once after component mounts
  useEffect(() => {
    userChats();
  }, [chatId]); // Empty dependency array ensures it runs only once

  return (
    <div className="chatList">
      <span className="title">DASHBOARD</span>
      <Link to="/dashboard">Create a new Chat</Link>
      <Link to="/">Explore MERNGPT</Link>
      
      <hr />
      <span className="title">RECENT CHATS</span>
      <div className="list">
        {isPending
          ? "Loading..."
          : isError
          ? "Something went wrong!"
            
          : (data && data.length===0)?"no chats!":
          data && data?.map((chat) => (
              <Link to={`/dashboard/chats/${chat._id}`} key={chat._id}>
                {chat.title}
              </Link>
            ))}
      </div>
      <hr />
      <div className="upgrade">
        <img src="/logo.png" alt="" />
        <div className="texts">
          <span>Upgrade to MERNGPT Pro</span>
          <span>Get unlimited access to all features</span>
        </div>
      </div>
    </div>
  )
}

export default ChatList