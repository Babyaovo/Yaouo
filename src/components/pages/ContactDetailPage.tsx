interface ContactDetailPageProps {
  appState: any;
  onClose: () => void;
  onEdit: () => void;
}

export function ContactDetailPage({ appState, onClose, onEdit }: ContactDetailPageProps) {
  const contact = appState.contacts?.find((c: any) => c.id === appState.currentContactId);

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
        <div className="detail-card">
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
              <h3>性格描述</h3>
              <p>{contact.summary}</p>
            </div>
          )}
        </div>

        <div className="detail-section">
          <h3 className="section-header">
            <i className="fas fa-file-alt"></i>
            原始设定
          </h3>
          <div className="settings-box">
            <h4>角色设定</h4>
            <p>{contact.charSettings || '暂无设定'}</p>
          </div>
          {contact.userSettings && (
            <div className="settings-box">
              <h4>用户设定</h4>
              <p>{contact.userSettings}</p>
            </div>
          )}
        </div>

        {contact.userName && (
          <div className="detail-section">
            <h3 className="section-header">
              <i className="fas fa-user-circle"></i>
              关联用户
            </h3>
            <div className="user-info">
              {contact.userAvatar && (
                <div className="user-avatar">
                  <img src={contact.userAvatar} alt={contact.userName} />
                </div>
              )}
              <span>{contact.userName}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
