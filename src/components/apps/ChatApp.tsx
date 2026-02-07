import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChatListPage } from '../pages/ChatListPage';
import { ChatPage } from '../pages/ChatPage';
import { ContactPickerPage } from '../pages/ContactPickerPage';
import { ChatSettingsPage } from '../pages/ChatSettingsPage';
import { MomentsPage } from '../pages/MomentsPage';
import { MomentDetailPage } from '../pages/MomentDetailPage';
import { CreateMomentPage } from '../pages/CreateMomentPage';

interface ChatAppProps {
  appState: any;
  onUpdate: (updates: any) => void;
  onClose: () => void;
  onViewContact?: (contactId: string) => void;
}

export function ChatApp({ appState, onUpdate, onClose, onViewContact }: ChatAppProps) {
  const [activeTab, setActiveTab] = useState<'chat' | 'moments'>('chat');
  const [subPage, setSubPage] = useState<'list' | 'chat' | 'picker' | 'settings' | 'momentDetail' | 'createMoment'>('list');
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [currentMomentId, setCurrentMomentId] = useState<string | null>(null);

  useEffect(() => {
    if (appState.currentChatId) {
      setCurrentChatId(appState.currentChatId);
      setActiveTab('chat');
      setSubPage('chat');
    } else {
      setSubPage('list');
    }
  }, [appState.currentChatId]);

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

  const openMomentDetail = (momentId: string) => {
    setCurrentMomentId(momentId);
    setSubPage('momentDetail');
  };

  const openCreateMoment = () => {
    setSubPage('createMoment');
  };

  const backToList = () => {
    setSubPage('list');
    setCurrentChatId(null);
  };

  const backToChat = () => {
    setSubPage('chat');
  };

  const backToMoments = () => {
    setSubPage('list');
    setCurrentMomentId(null);
  };

  const handleContactSelect = (contactId: string) => {
    const contact = appState.contacts.find((c: any) => c.id === contactId);
    if (!contact) return;

    const existingChat = appState.chats.find((c: any) => c.contactId === contactId);
    if (existingChat) {
      openChat(existingChat.id);
      return;
    }

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
        memoryInterval: 10,
        showAIAvatar: true,
        showUserAvatar: true,
        headerDisplayMode: 'both',
        chatMode: 'message'
      }
    };

    onUpdate({
      chats: [...appState.chats, newChat]
    });
    
    openChat(newChat.id);
  };

  // 在子页面中不显示Tab栏
  const showTabBar = subPage === 'list' && (activeTab === 'chat' || activeTab === 'moments');

  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      background: appState.isNightMode ? 'var(--surface-dark)' : 'var(--surface-light)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* 主内容区 */}
      <div style={{ 
        flex: 1,
        overflow: 'hidden',
        position: 'relative'
      }}>
        <AnimatePresence mode="wait">
          {/* 聊天列表页面 */}
          {activeTab === 'chat' && subPage === 'list' && (
            <motion.div
              key="chat-list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              style={{ width: '100%', height: '100%' }}
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

          {/* 聊天页面 */}
          {activeTab === 'chat' && subPage === 'chat' && currentChatId && (
            <motion.div
              key="chat"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
              style={{ width: '100%', height: '100%' }}
            >
              <ChatPage
                key={`chat-${currentChatId}-${appState.chats.find((c: any) => c.id === currentChatId)?.settings?.showAIAvatar}-${appState.chats.find((c: any) => c.id === currentChatId)?.settings?.showUserAvatar}`}
                appState={appState}
                onUpdate={onUpdate}
                onClose={backToList}
                onNavigate={openSettings} // 修复：使用正确的prop名
                onViewContact={onViewContact}
                chatId={currentChatId}
              />
            </motion.div>
          )}

          {/* 联系人选择页面 */}
          {subPage === 'picker' && (
            <motion.div
              key="picker"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.25 }}
              style={{ width: '100%', height: '100%' }}
            >
              <ContactPickerPage
                appState={appState}
                onUpdate={onUpdate}
                onClose={backToList}
                onSelectContact={handleContactSelect}
              />
            </motion.div>
          )}

          {/* 聊天设置页面 */}
          {subPage === 'settings' && currentChatId && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
              style={{ width: '100%', height: '100%' }}
            >
              <ChatSettingsPage
                appState={appState}
                onUpdate={onUpdate}
                onClose={backToChat}
                chatId={currentChatId}
              />
            </motion.div>
          )}

          {/* 动态列表页面 */}
          {activeTab === 'moments' && subPage === 'list' && (
            <motion.div
              key="moments-list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              style={{ width: '100%', height: '100%' }}
            >
              <MomentsPage
                appState={appState}
                onUpdate={onUpdate}
                onClose={onClose}
                onOpenPost={openMomentDetail}
                onCreatePost={openCreateMoment}
              />
            </motion.div>
          )}

          {/* 动态详情页面 */}
          {subPage === 'momentDetail' && currentMomentId && (
            <motion.div
              key="moment-detail"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
              style={{ width: '100%', height: '100%' }}
            >
              <MomentDetailPage
                appState={appState}
                onUpdate={onUpdate}
                onClose={backToMoments}
                momentId={currentMomentId}
              />
            </motion.div>
          )}

          {/* 创建动态页面 */}
          {subPage === 'createMoment' && (
            <motion.div
              key="create-moment"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.25 }}
              style={{ width: '100%', height: '100%' }}
            >
              <CreateMomentPage
                appState={appState}
                onUpdate={onUpdate}
                onClose={backToMoments}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 微信风格的底部Tab栏 - 只在主列表页显示 */}
      {showTabBar && (
        <motion.div
          initial={{ y: 80 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          style={{
            height: 'calc(70px + env(safe-area-inset-bottom, 0px))',
            paddingBottom: 'env(safe-area-inset-bottom, 0px)',
            background: appState.isNightMode 
              ? 'rgba(20, 20, 20, 0.95)' 
              : 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(30px) saturate(180%)',
            WebkitBackdropFilter: 'blur(30px) saturate(180%)',
            borderTop: `0.5px solid ${appState.isNightMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)'}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-around',
            padding: '0 var(--space-8)',
            position: 'relative',
            zIndex: 100,
            boxShadow: appState.isNightMode 
              ? '0 -2px 20px rgba(0, 0, 0, 0.4)' 
              : '0 -2px 20px rgba(0, 0, 0, 0.03)'
          }}
        >
          {/* 聊天Tab */}
          <button
            onClick={() => {
              setActiveTab('chat');
              setSubPage('list');
            }}
            style={{
              flex: 1,
              height: '70px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 'var(--space-1)',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              transition: 'all var(--duration-fast) var(--ease-smooth)',
              position: 'relative'
            }}
          >
            <motion.div
              animate={{
                scale: activeTab === 'chat' ? 1 : 0.95,
                y: activeTab === 'chat' ? -1 : 0
              }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              style={{
                fontSize: '24px',
                color: activeTab === 'chat'
                  ? (appState.isNightMode ? '#FFFFFF' : '#1A1A1A')
                  : (appState.isNightMode ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.3)'),
                transition: 'color var(--duration-fast) var(--ease-smooth)',
                position: 'relative'
              }}
            >
              <i className="fas fa-comments"></i>
              {/* 未读角标 */}
              {appState.chats?.some((c: any) => c.unreadCount > 0) && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  style={{
                    position: 'absolute',
                    top: '-4px',
                    right: '-8px',
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: '#FF3B30',
                    border: `2px solid ${appState.isNightMode ? '#141414' : '#FFFFFF'}`
                  }}
                />
              )}
            </motion.div>
            <motion.span
              animate={{
                opacity: activeTab === 'chat' ? 1 : 0.5
              }}
              style={{
                fontSize: '10px',
                color: appState.isNightMode ? '#FFFFFF' : '#1A1A1A',
                letterSpacing: '0.02em',
                transition: 'all var(--duration-fast) var(--ease-smooth)'
              }}
            >
              Messages
            </motion.span>
            {/* 活跃指示器 */}
            {activeTab === 'chat' && (
              <motion.div
                layoutId="activeTabIndicator"
                style={{
                  position: 'absolute',
                  bottom: 0,
                  width: '20px',
                  height: '2px',
                  borderRadius: '2px 2px 0 0',
                  background: appState.isNightMode ? '#FFFFFF' : '#1A1A1A'
                }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              />
            )}
          </button>

          {/* 动态Tab */}
          <button
            onClick={() => {
              setActiveTab('moments');
              setSubPage('list');
            }}
            style={{
              flex: 1,
              height: '70px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 'var(--space-1)',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              transition: 'all var(--duration-fast) var(--ease-smooth)',
              position: 'relative'
            }}
          >
            <motion.div
              animate={{
                scale: activeTab === 'moments' ? 1 : 0.95,
                y: activeTab === 'moments' ? -1 : 0
              }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              style={{
                fontSize: '24px',
                color: activeTab === 'moments'
                  ? (appState.isNightMode ? '#FFFFFF' : '#1A1A1A')
                  : (appState.isNightMode ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.3)'),
                transition: 'color var(--duration-fast) var(--ease-smooth)',
                position: 'relative'
              }}
            >
              <i className="fas fa-circle-notch"></i>
              {/* 新动态角标 */}
              {appState.moments?.some((m: any) => m.isNew) && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  style={{
                    position: 'absolute',
                    top: '-4px',
                    right: '-8px',
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: '#FF3B30',
                    border: `2px solid ${appState.isNightMode ? '#141414' : '#FFFFFF'}`
                  }}
                />
              )}
            </motion.div>
            <motion.span
              animate={{
                opacity: activeTab === 'moments' ? 1 : 0.5
              }}
              style={{
                fontSize: '10px',
                color: appState.isNightMode ? '#FFFFFF' : '#1A1A1A',
                letterSpacing: '0.02em',
                transition: 'all var(--duration-fast) var(--ease-smooth)'
              }}
            >
              Moments
            </motion.span>
            {/* 活跃指示器 */}
            {activeTab === 'moments' && (
              <motion.div
                layoutId="activeTabIndicator"
                style={{
                  position: 'absolute',
                  bottom: 0,
                  width: '20px',
                  height: '2px',
                  borderRadius: '2px 2px 0 0',
                  background: appState.isNightMode ? '#FFFFFF' : '#1A1A1A'
                }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              />
            )}
          </button>
        </motion.div>
      )}
    </div>
  );
}