import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'bot', text: 'Hi! Ask me anything about this page.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setInput('');
    setLoading(true);


    const pageText = document.body.innerText || '';

    try {
      const resp = await fetch('http://localhost:8000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: userMessage,
          context: pageText
        })
      });

      const data = await resp.json();

      if (resp.ok) {
        setMessages(prev => [...prev, { role: 'bot', text: data.response }]);
      } else {
        setMessages(prev => [...prev, { role: 'bot', text: `Error: ${data.detail || 'Something went wrong'}` }]);
      }
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'bot', text: 'Sorry, I could not reach the server.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 p-4 bg-blue-600 text-white rounded-full shadow-xl hover:bg-blue-700 hover:scale-105 transition-all z-50 ${isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}
        aria-label="Open Chat"
      >
        <MessageCircle size={28} />
      </button>

      {/* Chat Window */}
      <div
        className={`fixed bottom-6 right-6 w-80 sm:w-96 bg-white border border-slate-200 rounded-2xl shadow-2xl flex flex-col z-50 transition-all duration-300 origin-bottom-right ${isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'}`}
        style={{ height: '500px', maxHeight: '80vh' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-blue-600 text-white rounded-t-2xl">
          <div className="flex items-center gap-2 font-bold">
            <Bot size={20} />
            <span>Page Assistant</span>
          </div>
          <button onClick={() => setIsOpen(false)} className="hover:bg-blue-700 p-1 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Message List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-2xl px-4 py-2 ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-tr-sm' : 'bg-white text-slate-800 border border-slate-200 rounded-tl-sm shadow-sm'}`}>
                {msg.text}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-white border border-slate-200 text-slate-500 rounded-2xl rounded-tl-sm px-4 py-2 shadow-sm flex gap-1 items-center">
                <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce"></span>
                <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '0.1s' }}></span>
                <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '0.2s' }}></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <form onSubmit={handleSubmit} className="p-3 border-t border-slate-100 bg-white rounded-b-2xl flex gap-2 items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about this page..."
            className="flex-1 px-4 py-2 bg-slate-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/50"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </>
  );
};

export default ChatWidget;
