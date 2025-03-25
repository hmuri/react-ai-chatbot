// ChatBotWithSpeech.jsx
import React, { useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { presentationSummary } from "./presentationSummary.js";
import useSpeechRecognition from "./useSpeechRecognition";
import useTextToSpeech from "./useTextToSpeech";
import LoadingLottie from "./LoadingLottie";
import MicIcon from "./MicIcon";
import StopIconImg from "./StopIcon.png";

const ChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { speak } = useTextToSpeech();

  const { isListening, startListening, stopListening } =
    useSpeechRecognition(setUserInput);

  const toggleListening = () => {
    isListening ? stopListening() : startListening();
  };

  const addBotMessage = (message) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      { sender: "bot", content: message },
    ]);
  };

  const handleInputChange = (event) => {
    setUserInput(event.target.value);
  };

  const handleSubmit = async () => {
    if (userInput.trim() === "" || isLoading) return;

    const newUserMessage = {
      role: "user",
      content: userInput,
    };

    const updatedMessages = [
      {
        role: "system",
        content: presentationSummary,
      },
      ...messages.map((m) => ({
        role: m.sender === "user" ? "user" : "assistant",
        content: m.content,
      })),
      newUserMessage,
    ];

    setMessages((prev) => [...prev, { sender: "user", content: userInput }]);
    setUserInput("");
    setIsLoading(true);

    try {
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-4",
          messages: updatedMessages,
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      const botResponse = response.data.choices[0].message.content;
      addBotMessage(botResponse);
      speak(botResponse);
    } catch (error) {
      console.error("API 요청 오류:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <ChatBotContainer>
        <ChatContainer>
          {messages.map((msg, index) => (
            <MessageContainer key={index} sender={msg.sender}>
              <Message sender={msg.sender}>{msg.content}</Message>
            </MessageContainer>
          ))}
          {isLoading && <LoadingLottie />}
        </ChatContainer>
        <InputArea>
          <Input
            value={userInput}
            onChange={handleInputChange}
            placeholder={isListening ? "듣는 중..." : "메시지를 입력하세요..."}
            disabled={isLoading}
          />
          <IconButton onClick={toggleListening}>
            {isListening ? (
              <img src={StopIconImg} alt="정지" width={28} height={28} />
            ) : (
              <MicIcon />
            )}
          </IconButton>
          <SendButton
            onClick={handleSubmit}
            disabled={isLoading || !userInput.trim()}
          >
            전송
          </SendButton>
        </InputArea>
      </ChatBotContainer>
    </Container>
  );
};

export default ChatBot;

// 💄 스타일 컴포넌트
const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 30px;
  background-color: #f4f4ff;
  height: 100vh;
`;

const ChatBotContainer = styled.div`
  width: 100%;
  max-width: 480px;
  height: 600px;
  background-color: #ffffff;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const ChatContainer = styled.div`
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  background-color: #f2f0ff;
`;

const MessageContainer = styled.div`
  display: flex;
  justify-content: ${({ sender }) =>
    sender === "user" ? "flex-end" : "flex-start"};
  margin-bottom: 10px;
`;

const Message = styled.div`
  background-color: ${({ sender }) =>
    sender === "user" ? "#7a64ff" : "#ffffff"};
  color: ${({ sender }) => (sender === "user" ? "white" : "black")};
  padding: 10px 14px;
  border-radius: 14px;
  max-width: 70%;
  font-size: 14px;
  line-height: 1.4;
`;

const InputArea = styled.div`
  display: flex;
  align-items: center;
  padding: 12px;
  background-color: #fff;
  border-top: 1px solid #ddd;
`;

const Input = styled.textarea`
  flex: 1;
  resize: none;
  border: 1px solid #ccc;
  border-radius: 12px;
  padding: 8px 12px;
  font-size: 14px;
  margin-right: 8px;
  height: 40px;
`;

const SendButton = styled.button`
  background-color: #7a64ff;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 12px;
  font-size: 14px;
  cursor: pointer;
  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const IconButton = styled.button`
  background: none;
  border: none;
  margin-right: 8px;
  cursor: pointer;
`;
