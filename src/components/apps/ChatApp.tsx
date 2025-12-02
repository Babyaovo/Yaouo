import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChatListPage } from '../pages/ChatListPage';
import { ChatPage } from '../pages/ChatPage';
import { ContactPickerPage } from '../pages/ContactPickerPage';
import { ChatSettingsPage } from '../pages/ChatSettingsPage';

interface ChatAppProps {
  appState: any;
  onUpdate: (updates: any) => void;
  onClose: () => void;
}

export function ChatApp({ appState, onUpdate, onClose }: ChatAppProps) {
  const [subPage, setSubPage] = useState<'list' | 'chat' | 'picker' | 'settings'>('list');
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);

  const openChat = (chatId: string) => {
    setCurrentChatId(chatId);
    setSubPage('chat');
  };

  const openContactPicker = () => {
    setSubPage('picker');
  };

  const openSettings = () => {
    setSubPage('settings');
  };

  const backToList = () => {
    setSubPage('list');
    setCurrentChatId(null);
  };

  const backToChat = () => {
    setSubPage('chat');
  };

  const handleContactSelect = (contactId: string) => {
    const contact = appState.contacts.find((c: any) => c.id === contactId);
    if (!contact) return;

    // 检查是否已有此联系人的聊天
    const existingChat = appState.chats.find((c: any) => c.contactId === contactId);
    if (existingChat) {
      openChat(existingChat.id);
      return;
    }

    // 创建新聊天
    const newChat = {
      id: Date.now().toString(),
      contactId: contact.id,
      charName: contact.charName,
      charAvatar: contact.charAvatar,
      messages: [],
      lastMessage: '',
      lastTime: Date.now(),
      wallpaper: '',
      settings: {
        contextRounds: 10,
        temperature: 0.8,
        coreMemory: '',
        memoryInterval: 10
      }
    };

    onUpdate({
      ...appState,
      chats: [...appState.chats, newChat]
    });
    
    setCurrentChatId(newChat.id);
    setSubPage('chat');
  };

  const handleNavigate = (page: string) => {
    if (page === 'ChatSettings') {
      openSettings();
    }
  };

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <AnimatePresence mode="wait">
        {subPage === 'list' && (
          <motion.div
            key="list"
            initial={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            style={{ position: 'absolute', width: '100%', height: '100%' }}
          >
            <ChatListPage
              appState={appState}
              onUpdate={onUpdate}
              onClose={onClose}
              onOpenChat={openChat}
              onOpenContactPicker={openContactPicker}
            />
          </motion.div>
        )}

        {subPage === 'chat' && (
          <motion.div
            key="chat"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.2 }}
            style={{ position: 'absolute', width: '100%', height: '100%' }}
          >
            <ChatPage
              appState={{ ...appState, currentChatId }}
              onUpdate={onUpdate}
              onClose={backToList}
              onNavigate={handleNavigate}
            />
          </motion.div>
        )}

        {subPage === 'settings' && (
          <motion.div
            key="settings"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.2 }}
            style={{ position: 'absolute', width: '100%', height: '100%' }}
          >
            <ChatSettingsPage
              appState={{ ...appState, currentChatId }}
              onUpdate={onUpdate}
              onClose={backToChat}
            />
          </motion.div>
        )}

        {subPage === 'picker' && (
          <motion.div
            key="picker"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.2 }}
            style={{ position: 'absolute', width: '100%', height: '100%' }}
          >
            <ContactPickerPage
              appState={appState}
              onClose={backToList}
              onSelect={handleContactSelect}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}