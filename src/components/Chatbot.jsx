import React, { useState } from 'react';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { type: 'bot', text: 'Hi there! How can I help you today?' },
  ]);
  const [input, setInput] = useState('');

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleSendMessage = () => {
    if (input.trim() === '') return;

    const userMessage = { type: 'user', text: input.trim() };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput('');

    // Dummy bot response logic
    setTimeout(() => {
      let botResponse = { type: 'bot', text: "I'm sorry, I don't understand that. Please try rephrasing." };
      const lowerCaseInput = input.toLowerCase();

      if (lowerCaseInput.includes('shipping')) {
        botResponse = { type: 'bot', text: 'Shipping usually takes 3-5 business days.' };
      } else if (lowerCaseInput.includes('return')) {
        botResponse = { type: 'bot', text: 'You can return items within 30 days of purchase.' };
      } else if (lowerCaseInput.includes('size')) {
        botResponse = { type: 'bot', text: 'Please refer to our size guide on each product page.' };
      } else if (lowerCaseInput.includes('hello') || lowerCaseInput.includes('hi')) {
        botResponse = { type: 'bot', text: 'Hello! How can I assist you?' };
      }

      setMessages((prevMessages) => [...prevMessages, botResponse]);
    }, 500);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOpen && (
        <button
          onClick={toggleChat}
          className="bg-blue-600 text-white rounded-full p-4 shadow-lg hover:bg-blue-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Open Chatbot"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg>
        </button>
      )}

      {isOpen && (
        <div className="bg-white rounded-lg shadow-xl w-80 h-96 flex flex-col">
          <div className="bg-blue-600 text-white p-4 rounded-t-lg flex justify-between items-center">
            <h3 className="font-semibold">Chat with us!</h3>
            <button onClick={toggleChat} className="text-white hover:text-gray-200 focus:outline-none">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
          </div>
          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[70%] p-2 rounded-lg ${msg.type === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 border-t flex">
            <input
              type="text"
              className="flex-1 border rounded-l-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <button
              onClick={handleSendMessage}
              className="bg-blue-600 text-white rounded-r-lg p-2 hover:bg-blue-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
