import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface ChatListPageProps {
  appState: any;
  onUpdate: (updates: any) => void;
  onClose: () => void;
  onOpenChat: (chatId: string) => void;
  onOpenContactPicker: () => void;
}

export function ChatListPage({ appState, onUpdate, onClose, onOpenChat, onOpenContactPicker }: ChatListPageProps) {
  const chats = appState.chats || [];
  const [longPressTimer, setLongPressTimer] = useState<NodeJS.Timeout | null>(null);
  const [deletingChatId, setDeletingChatId] = useState<string | null>(null);

  const handleLongPress = (chatId: string) => {
    setDeletingChatId(chatId);
  };

  const confirmDelete = () => {
    if (deletingChatId) {
      onUpdate({ chats: chats.filter((c: any) => c.id !== deletingChatId) });
      setDeletingChatId(null);
    }
  };

  const cancelDelete = () => {
    setDeletingChatId(null);
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    if (diff < 60000) return '刚刚';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}分钟前`;
    if (diff < 86400000) return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
    return date.toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' });
  };

  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      background: appState.isNightMode ? '#000000' : '#FFFFFF',
      overflow: 'hidden'
    }}>
      {/* 顶栏 - 统一风格 */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        style={{
          padding: `max(env(safe-area-inset-top, 0px), var(--space-6)) var(--space-6) var(--space-4)`,
          background: appState.isNightMode 
            ? 'linear-gradient(180deg, rgba(10, 10, 10, 0.98) 0%, rgba(10, 10, 10, 0.95) 80%, rgba(10, 10, 10, 0) 100%)'
            : 'linear-gradient(180deg, rgba(250, 250, 250, 0.98) 0%, rgba(250, 250, 250, 0.95) 80%, rgba(250, 250, 250, 0) 100%)',
          backdropFilter: 'blur(40px) saturate(180%)',
          WebkitBackdropFilter: 'blur(40px) saturate(180%)',
          position: 'sticky',
          top: 0,
          zIndex: 100
        }}
      >
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <button
            onClick={onClose}
            style={{
              width: '44px',
              height: '44px',
              borderRadius: 'var(--radius-full)',
              background: appState.isNightMode 
                ? 'rgba(255, 255, 255, 0.05)' 
                : 'rgba(0, 0, 0, 0.04)',
              border: `1px solid ${appState.isNightMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)'}`,
              color: appState.isNightMode ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.8)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '16px',
              transition: 'all 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateX(-3px) scale(1.05)';
              e.currentTarget.style.background = appState.isNightMode 
                ? 'rgba(255, 255, 255, 0.08)' 
                : 'rgba(0, 0, 0, 0.06)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateX(0) scale(1)';
              e.currentTarget.style.background = appState.isNightMode 
                ? 'rgba(255, 255, 255, 0.05)' 
                : 'rgba(0, 0, 0, 0.04)';
            }}
          >
            <i className="fas fa-chevron-left"></i>
          </button>

          <h1 style={{
            fontSize: '20px',
            fontWeight: '600',
            color: appState.isNightMode ? 'rgba(255, 255, 255, 0.95)' : 'rgba(0, 0, 0, 0.9)',
            letterSpacing: '-0.3px',
            margin: 0
          }}>
            Messages
          </h1>

          <button
            onClick={onOpenContactPicker}
            style={{
              width: '44px',
              height: '44px',
              borderRadius: 'var(--radius-full)',
              background: appState.isNightMode ? '#FFFFFF' : '#1A1A1A',
              border: 'none',
              color: appState.isNightMode ? '#1A1A1A' : '#FFFFFF',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '18px',
              transition: 'all 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
              boxShadow: appState.isNightMode 
                ? '0 4px 20px rgba(255, 255, 255, 0.15)' 
                : '0 4px 20px rgba(0, 0, 0, 0.15)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'rotate(90deg) scale(1.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'rotate(0deg) scale(1)';
            }}
          >
            <i className="fas fa-plus"></i>
          </button>
        </div>
      </motion.div>

      {/* 聊天列表 */}
      <div style={{
        flex: 1,
        overflow: 'auto',
        WebkitOverflowScrolling: 'touch'
      }}>
        {chats.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '80px 40px',
              textAlign: 'center',
              minHeight: '60vh'
            }}
          >
            <div style={{
              width: '100px',
              height: '100px',
              borderRadius: '50%',
              background: appState.isNightMode 
                ? 'rgba(255, 255, 255, 0.05)' 
                : 'rgba(0, 0, 0, 0.03)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '24px'
            }}>
              <i className="fas fa-comments" style={{
                fontSize: '44px',
                color: appState.isNightMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.15)'
              }}></i>
            </div>
            <p style={{
              fontSize: '17px',
              color: appState.isNightMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.45)',
              fontWeight: '400',
              marginBottom: '8px',
              letterSpacing: '-0.2px'
            }}>
              暂无聊天
            </p>
            <p style={{
              fontSize: '14px',
              color: appState.isNightMode ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)',
              fontWeight: '400',
              marginBottom: '32px',
              letterSpacing: '-0.1px'
            }}>
              点击右上角开始新的对话
            </p>
          </motion.div>
        ) : (
          <div>
            {chats.map((chat: any, index: number) => {
              const contact = appState.contacts?.find((c: any) => c.id === chat.contactId);
              if (!contact) return null;

              return (
                <motion.div
                  key={chat.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
                  onClick={() => onOpenChat(chat.id)}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    handleLongPress(chat.id);
                  }}
                  onTouchStart={(e) => {
                    const timer = setTimeout(() => {
                      handleLongPress(chat.id);
                    }, 500);
                    setLongPressTimer(timer);
                  }}
                  onTouchEnd={() => {
                    if (longPressTimer) {
                      clearTimeout(longPressTimer);
                      setLongPressTimer(null);
                    }
                  }}
                  onTouchMove={() => {
                    if (longPressTimer) {
                      clearTimeout(longPressTimer);
                      setLongPressTimer(null);
                    }
                  }}
                  style={{
                    padding: '12px 20px',
                    borderBottom: `0.5px solid ${appState.isNightMode ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.05)'}`,
                    cursor: 'pointer',
                    transition: 'background 0.15s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    background: appState.isNightMode ? '#000000' : '#FFFFFF'
                  }}
                  whileHover={{
                    background: appState.isNightMode ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.02)'
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  {/* 头像 */}
                  <div style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '50%',
                    background: appState.isNightMode 
                      ? 'rgba(255, 255, 255, 0.08)' 
                      : 'rgba(0, 0, 0, 0.05)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                    flexShrink: 0,
                    position: 'relative'
                  }}>
                    {contact.charAvatar ? (
                      <img 
                        src={contact.charAvatar} 
                        alt={contact.charName}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                      />
                    ) : (
                      <i className="fas fa-user" style={{
                        fontSize: '24px',
                        color: appState.isNightMode ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.2)'
                      }}></i>
                    )}
                    {/* 未读标记 */}
                    {chat.unreadCount > 0 && (
                      <div style={{
                        position: 'absolute',
                        top: '-4px',
                        right: '-4px',
                        minWidth: '20px',
                        height: '20px',
                        borderRadius: '10px',
                        background: '#FF3B30',
                        color: '#FFFFFF',
                        fontSize: '12px',
                        fontWeight: '600',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '0 6px',
                        border: `2px solid ${appState.isNightMode ? '#000000' : '#FFFFFF'}`
                      }}>
                        {chat.unreadCount > 99 ? '99+' : chat.unreadCount}
                      </div>
                    )}
                  </div>

                  {/* 信息区域 */}
                  <div style={{ 
                    flex: 1, 
                    minWidth: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '8px'
                    }}>
                      <h3 style={{
                        fontSize: '17px',
                        fontWeight: '400',
                        color: appState.isNightMode ? '#FFFFFF' : '#000000',
                        margin: 0,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        letterSpacing: '-0.3px'
                      }}>
                        {contact.charName}
                      </h3>
                      <span style={{
                        fontSize: '14px',
                        color: appState.isNightMode ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.35)',
                        fontWeight: '400',
                        flexShrink: 0,
                        letterSpacing: '-0.1px'
                      }}>
                        {formatTime(chat.lastTime)}
                      </span>
                    </div>
                    <p style={{
                      fontSize: '15px',
                      color: appState.isNightMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.45)',
                      fontWeight: '400',
                      margin: 0,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      letterSpacing: '-0.2px'
                    }}>
                      {chat.lastMessage || '开始聊天吧...'}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* 删除确认对话框 - iOS风格 */}
      <AnimatePresence>
        {deletingChatId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={cancelDelete}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px',
              zIndex: 1000,
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)'
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              style={{
                width: '100%',
                maxWidth: '320px',
                borderRadius: '14px',
                background: appState.isNightMode 
                  ? 'rgba(30, 30, 30, 0.95)' 
                  : 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(40px) saturate(180%)',
                WebkitBackdropFilter: 'blur(40px) saturate(180%)',
                overflow: 'hidden',
                boxShadow: appState.isNightMode 
                  ? '0 20px 60px rgba(0, 0, 0, 0.6)' 
                  : '0 20px 60px rgba(0, 0, 0, 0.2)'
              }}
            >
              <div style={{
                padding: '20px 16px',
                textAlign: 'center'
              }}>
                <div style={{
                  fontSize: '17px',
                  fontWeight: '600',
                  color: appState.isNightMode ? '#FFFFFF' : '#000000',
                  marginBottom: '8px',
                  letterSpacing: '-0.3px'
                }}>
                  删除聊天
                </div>
                <div style={{
                  fontSize: '13px',
                  color: appState.isNightMode ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.5)',
                  fontWeight: '400',
                  lineHeight: '1.5',
                  letterSpacing: '-0.1px'
                }}>
                  确定删除此聊天？所有消息将被永久删除。
                </div>
              </div>

              <div style={{
                borderTop: `0.5px solid ${appState.isNightMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
                display: 'flex'
              }}>
                <button
                  onClick={cancelDelete}
                  style={{
                    flex: 1,
                    height: '44px',
                    background: 'transparent',
                    border: 'none',
                    borderRight: `0.5px solid ${appState.isNightMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
                    color: '#007AFF',
                    fontSize: '17px',
                    fontWeight: '400',
                    cursor: 'pointer',
                    transition: 'background 0.15s ease',
                    letterSpacing: '-0.3px'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = appState.isNightMode 
                      ? 'rgba(255, 255, 255, 0.05)' 
                      : 'rgba(0, 0, 0, 0.03)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                  }}
                >
                  取消
                </button>
                <button
                  onClick={confirmDelete}
                  style={{
                    flex: 1,
                    height: '44px',
                    background: 'transparent',
                    border: 'none',
                    color: '#FF3B30',
                    fontSize: '17px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'background 0.15s ease',
                    letterSpacing: '-0.3px'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = appState.isNightMode 
                      ? 'rgba(255, 255, 255, 0.05)' 
                      : 'rgba(0, 0, 0, 0.03)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                  }}
                >
                  删除
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}