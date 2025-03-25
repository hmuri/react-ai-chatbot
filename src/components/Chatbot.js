import React, { useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { presentationSummary } from "./presentationSummary";

const ChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");

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
    if (userInput.trim() === "") return;

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

    setMessages([...messages, { sender: "user", content: userInput }]);
    setUserInput("");

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

      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "bot", content: botResponse },
      ]);
    } catch (error) {
      console.error("API 요청 오류:", error);
    }
  };

  return (
    <Container>
      <ChatBotContainer>
        <ChatContainer>
          {messages?.map((msg, index) => (
            <MessageContainer key={index} sender={msg.sender}>
              <Message sender={msg.sender}>{msg.content}</Message>
            </MessageContainer>
          ))}
        </ChatContainer>
        <InputArea>
          <Input value={userInput} onChange={handleInputChange}></Input>
          <Button onClick={handleSubmit}>전송</Button>
        </InputArea>
      </ChatBotContainer>
    </Container>
  );
};

export default ChatBot;

const Container = styled.div`
  display: flex;
  margin: auto;
  flex-direction: row;
  position: relative;
  gap: 50px;
`;

const ChatBotContainer = styled.div`
  width: 400px;
  height: 600px;
  display: flex;
  margin: auto;
  border-radius: 5px;
  flex-direction: column;
  position: relative;
  background-color: #9bbbd4;
  overflow: auto;
`;

const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  overflow: auto;
  margin-bottom: 100px;
`;

const Message = styled.div`
  padding: 10px;
  margin: 5px;
  max-width: 70%;
  display: flex;
  border: none;
  border-radius: 10px;
  font-size: 14px;
  word-break: break-word; // 긴 텍스트가 있을 경우 줄바꿈
  ${({ sender }) =>
    sender === "user"
      ? `
    align-self: flex-end;
    background-color: yellow; 
    color: black;
  `
      : `
    align-self: flex-start;
    background-color: white; 
    color: black; 
  `}
`;

const InputArea = styled.div`
  margin-top: 20px;
  position: absolute;
  width: 100%;
  bottom: 0;
  margin: auto;
  height: 100px;
  background-color: white;
  display: flex;
`;

const Input = styled.textarea`
  display: flex;
  padding: 10px;
  margin-right: 10px;
  width: 70%;
  align-items: flex-start;
  border: none;
`;

const Button = styled.button`
  border: none;
  display: flex;
  background-color: #fef01b;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 30px;
  border-radius: 3px;
  margin-top: 10px;
  margin-left: 20px;
`;

const MessageContainer = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: ${({ sender }) =>
    sender === "user" ? "flex-end" : "flex-start"};
`;

const CleanupButton = styled.button`
  margin-left: 10px;
  width: 50px;
  height: 40px;
  padding: 5px 10px;
  border: 1px solid black;
  border-radius: 3px;
  cursor: pointer;
  &:hover {
    background-color: #e0e0e0;
  }
`;
