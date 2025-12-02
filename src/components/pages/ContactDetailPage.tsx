import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog';

interface ContactDetailPageProps {
  appState: any;
  onUpdate: (updates: any) => void;
  onClose: () => void;
  onEdit: () => void;
  onNavigate: (page: string) => void;
}

export function ContactDetailPage({ appState, onUpdate, onClose, onEdit, onNavigate }: ContactDetailPageProps) {
  const contact = appState.contacts?.find((c: any) => c.id === appState.currentContactId);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [longPressTimer, setLongPressTimer] = useState<NodeJS.Timeout | null>(null);

  const handleLongPressStart = () => {
    const timer = setTimeout(() => {
      setShowDeleteDialog(true);
    }, 800); // 长按800ms触发
    setLongPressTimer(timer);
  };

  const handleLongPressEnd = () => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
  };

  const handleDelete = () => {
    const updatedContacts = appState.contacts.filter((c: any) => c.id !== contact.id);
    onUpdate({ contacts: updatedContacts });
    setShowDeleteDialog(false);
    onClose();
  };

  const handleStartChat = () => {
    // 查找或创建与该联系人的聊天
    let chat = appState.chats?.find((c: any) => c.contactId === contact.id);
    
    if (!chat) {
      // 创建新聊天
      chat = {
        id: Date.now().toString(),
        contactId: contact.id,
        messages: [],
        lastMessage: '',
        lastTime: Date.now(),
        settings: {
          chatMode: 'message',
          temperature: 0.8,
          contextRounds: 10,
          coreMemory: '',
          memoryInterval: 10,
          showAIAvatar: true,
          showUserAvatar: true,
          showHeaderAvatar: true
        }
      };
      
      const updatedChats = [...(appState.chats || []), chat];
      onUpdate({ chats: updatedChats, currentChatId: chat.id });
    } else {
      onUpdate({ currentChatId: chat.id });
    }
    
    // 打开聊天app
    onNavigate('chat-list');
  };

  if (!contact) {
    return (
      <div className="app-page">
        <div className="app-header">
          <button className="back-btn" onClick={onClose}>
            <i className="fas fa-chevron-left"></i>
          </button>
          <h1>联系人详情</h1>
          <div style={{ width: '40px' }}></div>
        </div>
        <div className="app-content">
          <div className="empty-state">
            <p>联系人不存在</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-page contact-detail-page">
      <div className="app-header">
        <button className="back-btn" onClick={onClose}>
          <i className="fas fa-chevron-left"></i>
        </button>
        <h1>联系人详情</h1>
        <button className="edit-btn" onClick={onEdit}>
          <i className="fas fa-edit"></i>
        </button>
      </div>

      <div className="app-content">
        <div 
          className="detail-card"
          onTouchStart={handleLongPressStart}
          onTouchEnd={handleLongPressEnd}
          onMouseDown={handleLongPressStart}
          onMouseUp={handleLongPressEnd}
          onMouseLeave={handleLongPressEnd}
        >
          <div className="detail-avatar">
            {contact.charAvatar ? (
              <img src={contact.charAvatar} alt={contact.charName} />
            ) : (
              <i className="fas fa-user"></i>
            )}
          </div>
          
          <h2 className="detail-name">{contact.charName}</h2>
          
          <div className="detail-meta">
            {contact.occupation && (
              <div className="meta-item">
                <i className="fas fa-briefcase"></i>
                <span>{contact.occupation}</span>
              </div>
            )}
            {contact.age && (
              <div className="meta-item">
                <i className="fas fa-birthday-cake"></i>
                <span>{contact.age}岁</span>
              </div>
            )}
          </div>

          {contact.summary && (
            <div className="detail-summary">
              <h3>简介</h3>
              <p>{contact.summary}</p>
            </div>
          )}
          
          {/* 通讯录风格信息列表 */}
          <div className="detail-info-list">
            {contact.occupation && (
              <div className="info-row">
                <span className="info-label">职业</span>
                <span className="info-value">{contact.occupation}</span>
              </div>
            )}
            {contact.age && (
              <div className="info-row">
                <span className="info-label">年龄</span>
                <span className="info-value">{contact.age}岁</span>
              </div>
            )}
            {contact.charLanguage && (
              <div className="info-row">
                <span className="info-label">语言</span>
                <span className="info-value">{contact.charLanguage}</span>
              </div>
            )}
            {contact.userName && (
              <div className="info-row">
                <span className="info-label">关联用户</span>
                <span className="info-value">{contact.userName}</span>
              </div>
            )}
          </div>
        </div>

        {/* 开始聊天按钮 */}
        <button className="start-chat-btn primary-btn" onClick={handleStartChat}>
          <i className="fas fa-comments"></i>
          开始聊天
        </button>

        {/* 原始设定折叠显示 */}
        <div className="detail-section collapsed-section">
          <h3 className="section-header">
            <i className="fas fa-file-alt"></i>
            原始设定（点击编辑查看完整）
          </h3>
          <div className="settings-preview">
            <p>{(contact.charSettings || '暂无设定').substring(0, 100)}{(contact.charSettings || '').length > 100 ? '...' : ''}</p>
          </div>
        </div>
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>删除联系人</AlertDialogTitle>
            <AlertDialogDescription>
              确认删除联系人 {contact.charName} 吗？此操作不可逆。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>删除</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}