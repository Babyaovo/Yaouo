import { useState } from 'react';

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
    <div className="app-page chat-list-page">
      <div className="app-header">
        <button className="back-btn" onClick={onClose}>
          <i className="fas fa-chevron-left"></i>
        </button>
        <h1>聊天</h1>
        <button className="add-btn" onClick={onOpenContactPicker}>
          <i className="fas fa-plus"></i>
        </button>
      </div>

      <div className="app-content">
        {chats.length === 0 ? (
          <div className="empty-state">
            <i className="fas fa-comments"></i>
            <p>暂无聊天</p>
            <button className="primary-btn" onClick={onOpenContactPicker}>
              <i className="fas fa-plus"></i>
              <span>新建聊天</span>
            </button>
          </div>
        ) : (
          <div className="chat-list">
            {chats.map((chat: any) => {
              const contact = appState.contacts?.find((c: any) => c.id === chat.contactId);
              if (!contact) return null;

              return (
                <div
                  key={chat.id}
                  className="chat-item"
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
                >
                  <div className="chat-avatar">
                    {contact.charAvatar ? (
                      <img src={contact.charAvatar} alt={contact.charName} />
                    ) : (
                      <i className="fas fa-user"></i>
                    )}
                  </div>
                  <div className="chat-info">
                    <div className="chat-header">
                      <h3>{contact.charName}</h3>
                      <span className="chat-time">{formatTime(chat.lastTime)}</span>
                    </div>
                    <p className="chat-preview">{chat.lastMessage || '开始聊天吧...'}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 删除确认对话框 */}
      {deletingChatId && (
        <div className="modal-overlay" onClick={cancelDelete}>
          <div className="confirm-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="confirm-title">删除聊天</div>
            <div className="confirm-message">确定删除此聊天？所有消息将被永久删除。</div>
            <div className="confirm-actions">
              <button className="confirm-btn cancel" onClick={cancelDelete}>
                取消
              </button>
              <button className="confirm-btn delete" onClick={confirmDelete}>
                删除
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
