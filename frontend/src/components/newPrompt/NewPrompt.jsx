import './newPrompt.css'
import { useEffect, useRef, useState } from "react";
import Upload from "../upload/Upload";
import { IKImage } from "imagekitio-react";
import model from "../../lib/gemini";
import Markdown from "react-markdown";




function NewPrompt({data}) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [texting, setTexting] = useState(false);
  const [img, setImg] = useState({
    isLoading: false,
    error: "",
    dbData: {},
    aiData: {},
  });
  
  const chat = model.startChat({
    history: data?.history
      ? data.history
          .filter(({ role, parts }) => role && parts?.[0]?.text) // Filter valid entries.
          .map(({ role, parts }) => ({
            role,
            parts: [{ text: parts[0]?.text }],
          }))
      : [],
    generationConfig: {},
  });

  const endRef = useRef(null);
  const formRef = useRef(null);

  useEffect(() => {
    endRef.current.scrollIntoView({ behavior: "smooth" });
  }, [data,question, answer, img.dbData]);

 

  const newPrompt = async (question, answer, imgPath) => {
    try {
      const response = await fetch(`https://mern-gpt-1-wnnk.onrender.com/api/chats/${data._id}`, {
        method: "PUT",
        credentials: "include", // Only keep this once
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: question && question.length ? question : undefined, // Optional, cleaner check
          answer,
          img: img.dbData?.filePath || undefined,
        }),
      });
      if (response.ok){
          // Parse the response
            const resData = await response.json();
        
            
      }
  
      
      
       
    } catch (error) {
      console.error("Error in newPrompt:", error);
    }
  };
  
  const handleSubmit = async(e)=>{
    e.preventDefault();
    const text = e.target.text.value;
    if (!text) return;
    setQuestion(text);
    setAnswer(""); 
    try {
      const result = await chat.sendMessageStream(
        Object.entries(img.aiData).length>0 ? [img.aiData, text] : [text]
      );
      let accumulatedText = "";
      for await (const chunk of result.stream) {
          const chunkText =  await chunk.text(); // Make sure to await the chunk text extraction
          accumulatedText += chunkText;
          setAnswer((prev) => prev + chunkText); // Update the answer progressively
      }
      
      
      
       await newPrompt(text, accumulatedText, img.dbData?.filePath || null);
    } catch (err) {
      console.log(err);
    }
  }

  return(
    <>
    {/* ADD NEW CHAT */}
    {img.isLoading && <div className="">Loading...</div>}
    {img.dbData?.filePath && (
      <IKImage
        urlEndpoint={import.meta.env.VITE_IMAGE_KIT_ENDPOINT}
        path={img.dbData?.filePath}
        width="380"
        transformation={[{ width: 380 }]}
      />
    )}
    {question && <div className="message user">{question}</div>}
    {answer && (
      <div className="message">
        <Markdown>{answer}</Markdown>
      </div>
    )}
    <div className="endChat" ref={endRef}></div>
    <form className="newForm" onSubmit={handleSubmit} ref={formRef}>
      <Upload setImg={setImg} />
      <input id="file" type="file" multiple={false} hidden />
      <input type="text" name="text" placeholder="Ask anything..." onChange = {(e)=>setTexting(e.target.value.trim().length>0)}/>
      <button style={{ backgroundColor: texting ? "white" : "#605e68" }}>
        <img src="/arrow.png" alt="" />
      </button>
    </form>
  </>
  )
}

export default NewPrompt




