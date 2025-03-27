import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, Send, X, Minimize2, Maximize2, Info } from 'lucide-react';

export default function ChatbotComponent() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(true);
  const [userMessage, setUserMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [autoNotification, setAutoNotification] = useState(null);
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  useEffect(() => {
    const hasShownNotification = sessionStorage.getItem('assistantNotificationShown');

    if (!hasShownNotification) {
      const notificationTimer = setTimeout(() => {
        if (!isOpen) {
          setAutoNotification({
            message: "Have any questions about my portfolio? I'm here to help!",
            timestamp: Date.now()
          });
          
          sessionStorage.setItem('assistantNotificationShown', 'true');
        }
      }, 3000); 
      return () => clearTimeout(notificationTimer);
    }
  }, []); 

  // Function for handling message to chatbot
  const sendMessage = async () => {
    if (!userMessage.trim()) return;

    const userQuery = { role: "user", content: userMessage };
    setChatHistory([...chatHistory, userQuery]); 
    setIsLoading(true);
    setUserMessage("");

    try {
      const response = await fetch("https://portfolio-backend-u1xt.onrender.com/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await response.json();
      const botReply = { role: "bot", content: data.reply };

      setChatHistory((prevChat) => [...prevChat, botReply]);
    } catch (error) {
      console.error("Error:", error);
      setChatHistory((prevChat) => [
        ...prevChat, 
        { role: "bot", content: "Sorry, there was an error processing your message." }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setIsMinimized(false);
      setAutoNotification(null); 
    }
  };

  const closeAutoNotification = () => {
    setAutoNotification(null);
  };

  const renderChatMessages = () => {
    return chatHistory.map((message, index) => (
      <div 
        key={index} 
        className={`flex mb-3 ${
          message.role === 'user' ? 'justify-end' : 'justify-start'
        }`}
      >
        <div 
          className={`max-w-[80%] p-2.5 rounded-lg text-sm ${
            message.role === 'user' 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-200 text-gray-800'
          }`}
        >
          {message.content}
        </div>
      </div>
    ));
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Auto Notification */}
      {autoNotification && (
        <div className="absolute bottom-20 right-0 w-64 bg-white shadow-lg rounded-lg p-4 border animate-fade-in">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center">
              <Info className="mr-2 text-blue-600" size={20} />
              <span className="font-semibold text-gray-800">Assistant Notification</span>
            </div>
            <button 
              onClick={closeAutoNotification}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={16} />
            </button>
          </div>
          <p className="text-sm text-gray-600">{autoNotification.message}</p>
        </div>
      )}

      {/* Chatbot Trigger Button */}
      {!isOpen && (
        <button 
          onClick={toggleChat}
          className="bg-blue-600 text-white p-4 rounded-full shadow-xl hover:bg-blue-700 transition-all"
        >
          <MessageCircle size={24} />
        </button>
      )}

      {/* Chatbot Panel */}
      {isOpen && (
        <div 
          className={`
            w-80 md:w-96 lg:w-[420px] 
            bg-white rounded-xl shadow-2xl border 
            fixed right-6 bottom-6
            ${isMinimized ? 'h-16 overflow-hidden' : 'h-[600px] flex flex-col'}
          `}
        >
          {/* Header */}
          <div className="bg-blue-600 text-white p-4 rounded-t-xl flex justify-between items-center">
            <h3 className="font-semibold text-lg">Portfolio Assistant</h3>
            <div className="flex space-x-2">
              <button 
                onClick={() => setIsMinimized(!isMinimized)}
                className="hover:bg-blue-700 p-1 rounded"
                aria-label={isMinimized ? "Maximize" : "Minimize"}
              >
                {isMinimized ? <Maximize2 size={20} /> : <Minimize2 size={20} />}
              </button>
              <button 
                onClick={toggleChat}
                className="hover:bg-blue-700 p-1 rounded"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Chat Messages */}
          {!isMinimized && (
            <div className="flex-grow overflow-y-auto p-4 space-y-4">
              {renderChatMessages()}
              <div ref={chatEndRef} />
            </div>
          )}

          {/* Chat Input */}
          {!isMinimized && (
            <div className="p-4 border-t flex items-center space-x-2">
              <input 
                type="text"
                value={userMessage}
                onChange={(e) => setUserMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Type a message..."
                className="flex-grow p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isLoading}
              />
              <button 
                onClick={sendMessage}
                disabled={isLoading || !userMessage.trim()}
                className={`
                  bg-blue-600 text-white p-3 rounded-lg 
                  ${(isLoading || !userMessage.trim()) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}
                  transition-all duration-200
                `}
              >
                <Send size={20} />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}