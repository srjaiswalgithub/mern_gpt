import './homePage.css'
import { Link } from "react-router-dom";
import { TypeAnimation } from "react-type-animation";
import { useState } from "react";


function HomePage() {
  const [typingStatus, setTypingStatus] = useState("human1");

  return (
    <div className="homepage">
      
      <img src="/orbital.png" alt="" className="orbital" />
      <div className="left">
        <h1>MERNGPT</h1>
        <h2>Supercharge your creativity and productivity</h2>
        <h3>
        MERNGPT is here to simplify your challenges and amplify your success.
        </h3>
        <Link to="/dashboard">Get Started</Link>
      </div>
      <div className="right">
        <div className="imgContainer">
          <div className="bgContainer">
            <div className="bg"></div>
          </div>
          <img src="/bot.png" alt="" className="bot" />
          <div className="chat">
            <img
              src={
                typingStatus === "human1"
                  ? "/human1.jpeg"
                  : typingStatus === "human2"
                  ? "/human2.jpeg"
                  : "bot.png"
              }
              alt=""
            />
            <TypeAnimation
              sequence={[
                // Same substring at the start will only be typed out once, initially
                "Human:Hi there! Can you help me ?",
                2000,
                () => {
                  setTypingStatus("bot");
                },
                "Bot:Hello! I'm here to help.",
                2000,
                () => {
                  setTypingStatus("human2");
                },
                "Human2:I have a question, Can you help?",
                2000,
                () => {
                  setTypingStatus("bot");
                },
                "Bot:No worries, feel free to ask! ",
                2000,
                () => {
                  setTypingStatus("human1");
                },
              ]}
              wrapper="span"
              repeat={Infinity}
              cursor={true}
              omitDeletionAnimation={true}
            />
          </div>
        </div>
      </div>
      <div className="terms">
        <img src="/logo.png" alt="" />
        <div className="links">
          <Link to="/">Terms of Service</Link>
          <span>|</span>
          <Link to="/">Privacy Policy</Link>
        </div>
      </div>
    </div>
  )
}

export default HomePage