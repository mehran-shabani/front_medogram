import React from 'react';
import { ChatInterface } from '../components/features/ChatInterface';

export const ChatPage = () => {
  return (
    <div className="h-screen flex flex-col">
      {/* Page content takes full height minus header/footer */}
      <div className="flex-1 bg-gray-50">
        <div className="h-full max-w-7xl mx-auto bg-white shadow-soft">
          <ChatInterface />
        </div>
      </div>
    </div>
  );
};