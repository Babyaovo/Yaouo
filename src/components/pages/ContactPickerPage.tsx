interface ContactPickerPageProps {
  appState: any;
  onClose: () => void;
  onSelect: (contactId: string) => void;
}

export function ContactPickerPage({ appState, onClose, onSelect }: ContactPickerPageProps) {
  const contacts = appState.contacts || [];

  return (
    <div className="app-page contact-picker-page">
      <div className="app-header">
        <button className="back-btn" onClick={onClose}>
          <i className="fas fa-chevron-left"></i>
        </button>
        <h1>选择联系人</h1>
        <div style={{ width: '40px' }}></div>
      </div>

      <div className="app-content">
        {contacts.length === 0 ? (
          <div className="empty-state">
            <i className="fas fa-address-book"></i>
            <p>暂无联系人</p>
            <p className="hint">请先在联系人中创建角色</p>
          </div>
        ) : (
          <div className="contacts-list">
            {contacts.map((contact: any) => (
              <div
                key={contact.id}
                className="contact-card"
                onClick={() => onSelect(contact.id)}
              >
                <div className="contact-avatar">
                  {contact.charAvatar ? (
                    <img src={contact.charAvatar} alt={contact.charName} />
                  ) : (
                    <i className="fas fa-user"></i>
                  )}
                </div>
                <div className="contact-info">
                  <h3>{contact.charName}</h3>
                  {contact.charAge && contact.charGender && (
                    <div className="contact-meta">
                      <span className="meta-tag">{contact.charGender}</span>
                      <span className="meta-tag">{contact.charAge}岁</span>
                    </div>
                  )}
                  {contact.charProfile && (
                    <p className="contact-summary">{contact.charProfile}</p>
                  )}
                </div>
                <i className="fas fa-chevron-right"></i>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
