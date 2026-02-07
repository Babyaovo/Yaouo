import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ContactCalendarView } from './calendar/ContactCalendarView';
import { MyCalendarView } from './calendar/MyCalendarView';

interface CalendarAppProps {
  appState: any;
  onUpdate: (updates: any) => void;
  onClose: () => void;
}

export function CalendarApp({ appState, onUpdate, onClose }: CalendarAppProps) {
  const [activeTab, setActiveTab] = useState<'contacts' | 'mine'>('contacts');
  const [selectedContactId, setSelectedContactId] = useState<string | null>(null);

  const contacts = appState.contacts || [];

  const handleContactSelect = (contactId: string) => {
    setSelectedContactId(contactId);
  };

  const handleBackToList = () => {
    setSelectedContactId(null);
  };

  // 只在列表页显示Tab
  const showTabs = !selectedContactId;

  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      background: appState.isNightMode ? '#000000' : '#FFFFFF',
      overflow: 'hidden'
    }}>
      {/* 顶栏 */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        style={{
          padding: `max(env(safe-area-inset-top, 0px), 16px) 20px 12px`,
          background: appState.isNightMode ? '#000000' : '#FFFFFF',
          borderBottom: `0.5px solid ${appState.isNightMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)'}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          zIndex: 100,
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)'
        }}
      >
        <button
          onClick={onClose}
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: 'transparent',
            border: 'none',
            color: appState.isNightMode ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.5)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '18px',
            transition: 'all 0.2s ease',
            marginRight: '8px'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = appState.isNightMode 
              ? 'rgba(255, 255, 255, 0.08)' 
              : 'rgba(0, 0, 0, 0.05)';
            e.currentTarget.style.color = appState.isNightMode ? '#FFFFFF' : '#000000';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.color = appState.isNightMode ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.5)';
          }}
        >
          <i className="fas fa-chevron-left"></i>
        </button>

        <h1 style={{
          fontSize: '20px',
          fontWeight: '600',
          color: appState.isNightMode ? 'rgba(255, 255, 255, 0.95)' : 'rgba(0, 0, 0, 0.9)',
          letterSpacing: '-0.3px',
          margin: 0,
          flex: 1
        }}>
          Calendar
        </h1>

        <div style={{ width: '32px' }}></div>
      </motion.div>

      {/* Tab切换 - 只在列表页显示 */}
      {showTabs && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          style={{
            display: 'flex',
            gap: '8px',
            padding: '12px 20px',
            overflowX: 'auto',
            WebkitOverflowScrolling: 'touch',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            background: appState.isNightMode ? '#000000' : '#FFFFFF'
          }}
        >
          <motion.button
            onClick={() => setActiveTab('contacts')}
            whileTap={{ scale: 0.98 }}
            style={{
              flex: '0 0 auto',
              padding: '10px 20px',
              borderRadius: '12px',
              border: `1px solid ${activeTab === 'contacts' 
                ? (appState.isNightMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.15)')
                : (appState.isNightMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)')}`,
              background: activeTab === 'contacts'
                ? (appState.isNightMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)')
                : 'transparent',
              color: activeTab === 'contacts'
                ? (appState.isNightMode ? '#FFFFFF' : '#000000')
                : (appState.isNightMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.4)'),
              fontSize: '14px',
              fontWeight: activeTab === 'contacts' ? '500' : '400',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              letterSpacing: '0.3px',
              whiteSpace: 'nowrap'
            }}
          >
            <i className="fas fa-users" style={{ fontSize: '12px' }}></i>
            <span>Contacts</span>
          </motion.button>

          <motion.button
            onClick={() => setActiveTab('mine')}
            whileTap={{ scale: 0.98 }}
            style={{
              flex: '0 0 auto',
              padding: '10px 20px',
              borderRadius: '12px',
              border: `1px solid ${activeTab === 'mine' 
                ? (appState.isNightMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.15)')
                : (appState.isNightMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)')}`,
              background: activeTab === 'mine'
                ? (appState.isNightMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)')
                : 'transparent',
              color: activeTab === 'mine'
                ? (appState.isNightMode ? '#FFFFFF' : '#000000')
                : (appState.isNightMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.4)'),
              fontSize: '14px',
              fontWeight: activeTab === 'mine' ? '500' : '400',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              letterSpacing: '0.3px',
              whiteSpace: 'nowrap'
            }}
          >
            <i className="fas fa-calendar-alt" style={{ fontSize: '12px' }}></i>
            <span>My Schedule</span>
          </motion.button>
        </motion.div>
      )}

      {/* 内容区域 */}
      <div style={{
        flex: 1,
        overflow: 'auto',
        WebkitOverflowScrolling: 'touch',
        background: appState.isNightMode ? '#000000' : '#F8F8F8'
      }}>
        <AnimatePresence mode="wait">
          {activeTab === 'contacts' ? (
            selectedContactId ? (
              <motion.div
                key="contact-detail"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                style={{ width: '100%', height: '100%' }}
              >
                <ContactCalendarView
                  contactId={selectedContactId}
                  appState={appState}
                  onBack={handleBackToList}
                  onUpdate={onUpdate}
                />
              </motion.div>
            ) : (
              <motion.div
                key="contacts-grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                style={{
                  padding: '20px',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
                  gap: '16px'
                }}
              >
                {contacts.length === 0 ? (
                  <div style={{
                    gridColumn: '1 / -1',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '80px 40px',
                    textAlign: 'center'
                  }}>
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
                      <i className="fas fa-users" style={{
                        fontSize: '44px',
                        color: appState.isNightMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.15)'
                      }}></i>
                    </div>
                    <p style={{
                      fontSize: '17px',
                      color: appState.isNightMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.45)',
                      fontWeight: '400',
                      letterSpacing: '-0.2px'
                    }}>
                      暂无联系人
                    </p>
                  </div>
                ) : (
                  contacts.map((contact: any, index: number) => (
                    <motion.button
                      key={contact.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
                      onClick={() => handleContactSelect(contact.id)}
                      whileHover={{ scale: 1.05, y: -4 }}
                      whileTap={{ scale: 0.95 }}
                      style={{
                        padding: '16px 12px',
                        borderRadius: '16px',
                        background: appState.isNightMode ? 'rgba(255, 255, 255, 0.05)' : '#FFFFFF',
                        border: `1px solid ${appState.isNightMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)'}`,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '12px'
                      }}
                    >
                      <div style={{
                        width: '64px',
                        height: '64px',
                        borderRadius: '50%',
                        background: appState.isNightMode 
                          ? 'rgba(255, 255, 255, 0.08)' 
                          : 'rgba(0, 0, 0, 0.05)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'hidden',
                        flexShrink: 0
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
                            fontSize: '28px',
                            color: appState.isNightMode ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.2)'
                          }}></i>
                        )}
                      </div>
                      <div style={{
                        fontSize: '13px',
                        fontWeight: '500',
                        color: appState.isNightMode ? 'rgba(255, 255, 255, 0.85)' : 'rgba(0, 0, 0, 0.8)',
                        letterSpacing: '0.2px',
                        textAlign: 'center',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        width: '100%'
                      }}>
                        {contact.charName}
                      </div>
                    </motion.button>
                  ))
                )}
              </motion.div>
            )
          ) : (
            <motion.div
              key="my-calendar"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              style={{ width: '100%', height: '100%' }}
            >
              <MyCalendarView
                appState={appState}
                onUpdate={onUpdate}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}