import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  PaperAirplaneIcon,
  UserCircleIcon,
  SparklesIcon,
  ClipboardDocumentIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import { Button } from '../ui/Button';
import { useAuth } from '../../contexts/AuthContext';
import { chatAPI } from '../../services/api';
import { toast } from 'react-toastify';
import { cn } from '../../utils/cn';

/**
 * Modern Chat Interface inspired by OpenAI ChatGPT
 */
export const ChatInterface = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSpecialMode, setIsSpecialMode] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const { token, isAuthenticated } = useAuth();

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;
    
    if (!isAuthenticated) {
      toast.error('لطفاً ابتدا وارد حساب کاربری خود شوید');
      return;
    }

    const userMessage = {
      id: Date.now(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = isSpecialMode 
        ? await chatAPI.sendCustomMessage(inputValue, {}, token)
        : await chatAPI.sendMessage(inputValue, token);

      const botMessage = {
        id: Date.now() + 1,
        text: response.data.bot_response || response.data.response || 'متأسفانه پاسخی دریافت نشد',
        sender: 'bot',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = {
        id: Date.now() + 1,
        text: 'متأسفانه خطایی رخ داد. لطفاً دوباره تلاش کنید.',
        sender: 'bot',
        timestamp: new Date(),
        isError: true,
      };
      setMessages(prev => [...prev, errorMessage]);
      toast.error('خطا در ارسال پیام');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('متن کپی شد');
    } catch {
      toast.error('خطا در کپی کردن متن');
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3 space-x-reverse">
          <div className="flex items-center justify-center w-8 h-8 bg-primary-600 rounded-lg">
            <SparklesIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">چت پزشکی</h2>
            <p className="text-sm text-gray-500">
              {isSpecialMode ? 'حالت پیشرفته' : 'حالت عادی'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 space-x-reverse">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsSpecialMode(!isSpecialMode)}
            className={cn(
              'text-xs',
              isSpecialMode && 'bg-primary-50 text-primary-700'
            )}
          >
            {isSpecialMode ? 'عادی' : 'پیشرفته'}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearChat}
            disabled={messages.length === 0}
          >
            <ArrowPathIcon className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mb-4">
              <SparklesIcon className="w-8 h-8 text-primary-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              چگونه می‌توانم به شما کمک کنم؟
            </h3>
            <p className="text-gray-500 max-w-md">
              سوال پزشکی خود را بپرسید تا بهترین پاسخ را دریافت کنید
            </p>
          </div>
        ) : (
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={cn(
                  'flex space-x-3 space-x-reverse',
                  message.sender === 'user' ? 'justify-end' : 'justify-start'
                )}
              >
                {message.sender === 'bot' && (
                  <div className="flex-shrink-0 w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                    <SparklesIcon className="w-4 h-4 text-white" />
                  </div>
                )}
                
                <div className={cn(
                  'max-w-xs lg:max-w-md xl:max-w-lg px-4 py-3 rounded-2xl text-sm leading-relaxed',
                  message.sender === 'user'
                    ? 'bg-primary-600 text-white rounded-br-sm'
                    : message.isError
                    ? 'bg-error-50 text-error-700 border border-error-200 rounded-bl-sm'
                    : 'bg-gray-100 text-gray-900 rounded-bl-sm'
                )}>
                  <div className="whitespace-pre-wrap">{message.text}</div>
                  
                  {message.sender === 'bot' && !message.isError && (
                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-200">
                      <span className="text-xs text-gray-500">
                        {message.timestamp.toLocaleTimeString('fa-IR', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(message.text)}
                        className="p-1 h-auto text-gray-400 hover:text-gray-600"
                      >
                        <ClipboardDocumentIcon className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>
                
                {message.sender === 'user' && (
                  <div className="flex-shrink-0 w-8 h-8 bg-gray-400 rounded-lg flex items-center justify-center">
                    <UserCircleIcon className="w-4 h-4 text-white" />
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        )}
        
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex space-x-3 space-x-reverse justify-start"
          >
            <div className="flex-shrink-0 w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <SparklesIcon className="w-4 h-4 text-white" />
            </div>
            <div className="bg-gray-100 px-4 py-3 rounded-2xl rounded-bl-sm">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </motion.div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-gray-200 p-4">
        <div className="flex items-end space-x-3 space-x-reverse">
          <div className="flex-1 min-w-0">
            <textarea
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="سوال خود را بپرسید..."
              className="w-full resize-none border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
              rows="1"
              style={{ minHeight: '44px', maxHeight: '120px' }}
              disabled={!isAuthenticated}
            />
          </div>
          <Button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading || !isAuthenticated}
            loading={isLoading}
            className="flex-shrink-0"
          >
            <PaperAirplaneIcon className="w-4 h-4" />
          </Button>
        </div>
        
        {!isAuthenticated && (
          <p className="text-sm text-gray-500 mt-2 text-center">
            برای استفاده از چت پزشکی، لطفاً وارد حساب کاربری خود شوید
          </p>
        )}
      </div>
    </div>
  );
};