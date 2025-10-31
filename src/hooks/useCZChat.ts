import { useContext } from 'react';
import { ChatContext } from '../context/ChatContext';

/**
 * Hook to access CZ Chat functionality
 * @returns Chat context with messages, send, and voice controls
 */
export const useCZChat = () => {
  const context = useContext(ChatContext);

  if (!context) {
    throw new Error('useCZChat must be used within a ChatProvider');
  }

  return context;
};

export default useCZChat;
