interface ContactsPageProps {
  appState: any;
  onUpdate: (updates: any) => void;
  onClose: () => void;
  onOpenDetail: (contactId: string) => void;
  onOpenEdit: (contactId?: string) => void;
}

export function ContactsPage({ appState, onUpdate, onClose, onOpenDetail, onOpenEdit }: ContactsPageProps) {
  const contacts = appState.contacts || [];

  return (
    <div className="app-page contacts-page">
      <div className="app-header">
        <button className="back-btn" onClick={onClose}>
          <i className="fas fa-chevron-left"></i>
        </button>
        <h1>联系人</h1>
        <button className="add-btn" onClick={() => onOpenEdit()}>
          <i className="fas fa-plus"></i>
        </button>
      </div>

      <div className="app-content">
        {contacts.length === 0 ? (
          <div className="empty-state">
            <i className="fas fa-address-book"></i>
            <p>暂无联系人</p>
            <button className="primary-btn" onClick={() => onOpenEdit()}>
              <i className="fas fa-plus"></i>
              <span>创建联系人</span>
            </button>
          </div>
        ) : (
          <div className="contacts-list">
            {contacts.map((contact: any) => (
              <div 
                key={contact.id} 
                className="contact-card"
                onClick={() => onOpenDetail(contact.id)}
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
                  <div className="contact-meta">
                    {contact.occupation && <span className="meta-tag">{contact.occupation}</span>}
                    {contact.age && <span className="meta-tag">{contact.age}岁</span>}
                  </div>
                  {contact.summary && (
                    <p className="contact-summary">{contact.summary}</p>
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
