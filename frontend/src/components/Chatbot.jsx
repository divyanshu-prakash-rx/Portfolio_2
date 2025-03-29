import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, Send, X, Minimize2, Maximize2, Info, Bot } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
            message: "Have questions about my portfolio? I'm here to help!",
            timestamp: Date.now()
          });
          
          sessionStorage.setItem('assistantNotificationShown', 'true');
        }
      }, 3000); 
      return () => clearTimeout(notificationTimer);
    }
  }, []); 

  const sendMessage = async () => {
    if (!userMessage.trim()) return;

    const userQuery = { role: "user", content: userMessage };
    setChatHistory([...chatHistory, userQuery]); 
    setIsLoading(true);
    setUserMessage("");

    try {
      const response = await fetch("http://127.0.0.1:5000/chatbot", {
      //  const response = await fetch("https://portfolio-backend-u1xt.onrender.com/chatbot", {
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
        { role: "bot", content: "Sorry, Busy server please try again after some time..." }
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
      <motion.div 
        key={index} 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={`flex mb-3 ${
          message.role === 'user' ? 'justify-end' : 'justify-start'
        }`}
      >
        <div 
          className={`max-w-[80%] p-3 rounded-xl text-sm shadow-md ${
            message.role === 'user' 
              ? 'bg-indigo-500 text-white' 
              : 'bg-gray-100 text-gray-800'
          }`}
        >
          {message.content}
        </div>
      </motion.div>
    ));
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Auto Notification */}
      <AnimatePresence>
        {autoNotification && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-20 right-0 w-72 bg-white shadow-2xl rounded-2xl p-5 border"
          >
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center">
                <Info className="mr-2 text-indigo-600" size={24} />
                <span className="font-bold text-gray-800">Assistant</span>
              </div>
              <button 
                onClick={closeAutoNotification}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>
            <p className="text-sm text-gray-600">{autoNotification.message}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chatbot Trigger Button */}
      {!isOpen && (
        <motion.button 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={toggleChat}
          className="bg-indigo-600 text-white p-4 rounded-full shadow-xl hover:bg-indigo-700 transition-all"
        >
          <MessageCircle size={24} />
        </motion.button>
      )}

      {/* Chatbot Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className={`
              w-80 md:w-96 lg:w-[420px] 
              bg-white rounded-2xl shadow-2xl border 
              fixed right-6 bottom-6
              ${isMinimized ? 'h-16 overflow-hidden' : 'h-[600px] flex flex-col'}
            `}
          >
            {/* Header */}
            <div className="bg-indigo-600 text-white p-4 rounded-t-2xl flex justify-between items-center">
              <div className="flex items-center">
                <Bot className="mr-2" size={24} />
                <h3 className="font-semibold text-lg">Portfolio Assistant</h3>
              </div>
              <div className="flex space-x-2">
                <button 
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="hover:bg-indigo-700 p-1 rounded"
                  aria-label={isMinimized ? "Maximize" : "Minimize"}
                >
                  {isMinimized ? <Maximize2 size={20} /> : <Minimize2 size={20} />}
                </button>
                <button 
                  onClick={toggleChat}
                  className="hover:bg-indigo-700 p-1 rounded"
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
                  placeholder="Ask me about the portfolio..."
                  className="flex-grow p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  disabled={isLoading}
                />
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={sendMessage}
                  disabled={isLoading || !userMessage.trim()}
                  className={`
                    bg-indigo-600 text-white p-3 rounded-lg 
                    ${(isLoading || !userMessage.trim()) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-indigo-700'}
                    transition-all duration-200
                  `}
                >
                  <Send size={20} />
                </motion.button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
