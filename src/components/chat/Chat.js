// Import your avatar images
import userAvatar from './user.png'; // Adjust path if needed
import botAvatar from './robot.png'; // Adjust path if needed

import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'; 
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (input.trim() !== "") {
      const newMessage = { sender: 'user', text: input };

      try {
        const response = await fetch('./response1.md'); 
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const responseText = await response.text();

        const botMessage = {
          sender: 'bot',
          text: responseText, 
        };

        setMessages([...messages, newMessage, botMessage]);
      } catch (error) {
        console.error("Error fetching response:", error);
        const errorMessage = {
          sender: 'bot',
          text: "Sorry, there was an error fetching the response.",
        };
        setMessages([...messages, newMessage, errorMessage]);
      }

      setInput(""); 
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); 
      handleSend(); 
    } else if (e.key === 'Enter' && e.shiftKey) {
      e.preventDefault(); 
      setInput(input + "\n"); 
    }
  };

  const renderMarkdown = (text) => {
    return (
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            return !inline && match ? (
              <SyntaxHighlighter 
                style={oneDark} 
                language={match[1]} 
                PreTag="div" 
                {...props}
              >
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            ) : (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
          img({ node, ...props }) {
            return (
              <img
                {...props}
                style={{
                  maxWidth: '80%', 
                  height: 'auto',
                  borderRadius: '8px',
                  margin: '10px 0', 
                }}
                alt="avatar"
              />
            );
          }
        }}
        className="break-words text-justify"
      >
        {text}
      </ReactMarkdown>
    );
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100 items-center overflow-x-hidden">
      <div className="p-4 bg-gray-800 text-white text-center font-bold w-full" style={{ fontSize: 32 }}>
        Welcome to Chat Application
      </div>

      <div className="flex-1 p-4 w-full max-w-[80%] overflow-y-auto relative text-justify">
        <div className="flex flex-col space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.sender === 'user' ? (
                <div className="flex flex-col items-end">
                  <div className="flex items-start relative">
                    <div
                      className="px-3 py-2 rounded-lg max-w-[60%] bg-gray-500 text-white relative"
                      style={{
                        position: 'relative',
                      }}
                    >
                      <p className="break-words text-justify" style={{ fontSize: 18 }}>{message.text}</p>
                      <span
                        className="absolute top-1 left-full h-4 w-4 border-t bg-gray-500 border-l border-gray-500 rounded-bl-lg"
                        style={{
                          transform: 'translateX(-70%) rotate(45deg)',
                        }}
                      ></span>
                    </div>
                    <img src={userAvatar} alt="User Avatar" className="w-10 h-10 rounded-full ml-2" />
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-start">
                  <div className="flex items-start relative">
                    <img src={botAvatar} alt="Bot Avatar" className="w-10 h-10 rounded-full mr-2" />
                    <div
                      className="px-3 py-2 rounded-lg max-w-[60%] bg-gray-300 text-black relative"
                      style={{
                        position: 'relative',
                      }}
                    >
                      {renderMarkdown(message.text)}
                      <span
                        className="absolute top-1 right-full h-4 bg-gray-300 w-4 border-t border-r border-gray-300 rounded-tr-lg"
                        style={{
                          transform: 'translateX(70%) rotate(45deg)',
                          // backgroundColor: 'lightgray',
                        }}
                      ></span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef}></div>
        </div>
      </div>

      <div className="p-4 bg-white border-t border-gray-300 w-full max-w-[80%]">
        <div className="flex space-x-4">
          <textarea
            rows="1"
            placeholder="Type your message... (Shift+Enter for new line)"
            className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:border-gray-500 resize-none overflow-hidden break-words text-justify"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            style={{ height: `${Math.min(input.split('\n').length, 5) * 1.4}em`, fontSize: 18 }}
          />
          <button
            className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:text-black hover:bg-gray-400"
            onClick={handleSend}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
