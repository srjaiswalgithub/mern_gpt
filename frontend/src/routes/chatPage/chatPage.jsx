import './chatPage.css'
import NewPrompt from "../../components/newPrompt/NewPrompt";
import { useParams } from "react-router-dom";
import Markdown from "react-markdown";
import { IKImage } from "imagekitio-react";
import axios from 'axios';
import { useEffect, useState } from 'react';

function ChatPage() {
  const params = useParams();
  const chatId = params.id;
  
  const [isPending,setIsPending] = useState(true);
  const [isError,setIsError] = useState(false);
  const [data,setData] = useState("");


  const AllChats = async()=>{
    const res = await axios.get(`https://mern-gpt-1-wnnk.onrender.com/api/chats/${chatId}`,{withCredentials:true});
    if(res?.data?.success){
      setData(res?.data?.chat);
      setIsPending(false);
    }
    else{
      setIsError(true);
    }
 }
 useEffect(() => {
  AllChats();
  }, [chatId]);

  

  return (
    <div className="chatPage">
      <div className="wrapper">
        <div className="chat">
          {isPending
            ? "Loading..."
            : isError
            ? "Something went wrong!"
            : data?.history?.map((message, i) => (
                <div key={i}>
                  {message.img && (
                    <IKImage
                      urlEndpoint={import.meta.env.VITE_IMAGE_KIT_ENDPOINT}
                      path={message.img}
                      height="300"
                      width="400"
                      transformation={[{ height: 300, width: 400 }]}
                      loading="lazy"
                      lqip={{ active: true, quality: 20 }}
                    />
                  )}
                  <div
                    className={message.role === "user" ? "message user" : "message"}
                  >
                    
                    <Markdown>{message.parts[0].text}</Markdown>
                  </div>
                </div>
              ))}

          {data && <NewPrompt data={data} />}
        </div>
      </div>
    </div>
  );
}

export default ChatPage;
