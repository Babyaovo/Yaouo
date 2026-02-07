import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface ContactsPageProps {
  appState: any;
  onUpdate: (updates: any) => void;
  onClose: () => void;
  onOpenDetail: (contactId: string) => void;
  onOpenEdit: (contactId?: string) => void;
}

export function ContactsPage({ appState, onUpdate, onClose, onOpenDetail, onOpenEdit }: ContactsPageProps) {
  const contacts = appState.contacts || [];
  const [searchQuery, setSearchQuery] = useState('');

  // 搜索过滤
  const filteredContacts = contacts.filter((c: any) =>
    c.charName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.occupation?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // 按首字母分组
  const groupedContacts = filteredContacts.reduce((groups: any, contact: any) => {
    const firstChar = (contact.charName?.[0] || '#').toUpperCase();
    if (!groups[firstChar]) groups[firstChar] = [];
    groups[firstChar].push(contact);
    return groups;
  }, {});

  const sortedGroups = Object.keys(groupedContacts).sort();

  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      background: appState.isNightMode ? 'var(--surface-dark)' : 'var(--surface-light)',
      overflow: 'hidden'
    }}>
      {/* 精致的顶栏 - 毛玻璃效果 */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        style={{
          padding: `max(env(safe-area-inset-top, 0px), var(--space-6)) var(--space-6) 0`,
          background: appState.isNightMode 
            ? 'linear-gradient(180deg, rgba(10, 10, 10, 0.98) 0%, rgba(10, 10, 10, 0.95) 80%, rgba(10, 10, 10, 0) 100%)'
            : 'linear-gradient(180deg, rgba(250, 250, 250, 0.98) 0%, rgba(250, 250, 250, 0.95) 80%, rgba(250, 250, 250, 0) 100%)',
          backdropFilter: 'blur(40px) saturate(180%)',
          WebkitBackdropFilter: 'blur(40px) saturate(180%)',
          position: 'sticky',
          top: 0,
          zIndex: 100,
          paddingBottom: 'var(--space-6)'
        }}
      >
        {/* 顶部按钮栏 */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 'var(--space-8)'
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
            Contacts
          </h1>

          <button
            onClick={() => onOpenEdit()}
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

        {/* 艺术级搜索框 */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          style={{
            position: 'relative'
          }}
        >
          <input
            type="text"
            placeholder="搜索联系人..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              height: '52px',
              padding: '0 var(--space-5) 0 calc(var(--space-5) + 36px)',
              borderRadius: '16px',
              border: `1px solid ${appState.isNightMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)'}`,
              background: appState.isNightMode 
                ? 'rgba(255, 255, 255, 0.05)' 
                : 'rgba(0, 0, 0, 0.03)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              color: appState.isNightMode ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.85)',
              fontSize: '15px',
              fontWeight: '300',
              outline: 'none',
              transition: 'all 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
              letterSpacing: '0.3px'
            }}
            onFocus={(e) => {
              e.currentTarget.style.background = appState.isNightMode 
                ? 'rgba(255, 255, 255, 0.08)' 
                : 'rgba(0, 0, 0, 0.05)';
              e.currentTarget.style.borderColor = appState.isNightMode 
                ? 'rgba(255, 255, 255, 0.15)' 
                : 'rgba(0, 0, 0, 0.1)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.background = appState.isNightMode 
                ? 'rgba(255, 255, 255, 0.05)' 
                : 'rgba(0, 0, 0, 0.03)';
              e.currentTarget.style.borderColor = appState.isNightMode 
                ? 'rgba(255, 255, 255, 0.08)' 
                : 'rgba(0, 0, 0, 0.06)';
            }}
          />
          <i className="fas fa-search" style={{
            position: 'absolute',
            left: '18px',
            top: '50%',
            transform: 'translateY(-50%)',
            fontSize: '14px',
            color: appState.isNightMode ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.3)',
            pointerEvents: 'none'
          }}></i>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                background: appState.isNightMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)',
                border: 'none',
                color: appState.isNightMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.4)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                transition: 'all 0.2s ease'
              }}
            >
              <i className="fas fa-times"></i>
            </button>
          )}
        </motion.div>
      </motion.div>

      {/* 联系人列表 */}
      <div style={{
        flex: 1,
        overflow: 'auto',
        WebkitOverflowScrolling: 'touch',
        padding: '0 var(--space-6) var(--space-6)'
      }}>
        {contacts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 'var(--space-20) var(--space-8)',
              textAlign: 'center',
              minHeight: '50vh'
            }}
          >
            <div style={{
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              background: appState.isNightMode 
                ? 'radial-gradient(circle, rgba(255, 255, 255, 0.05) 0%, transparent 70%)'
                : 'radial-gradient(circle, rgba(0, 0, 0, 0.03) 0%, transparent 70%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 'var(--space-8)',
              border: `1px solid ${appState.isNightMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.04)'}`
            }}>
              <i className="fas fa-address-book" style={{
                fontSize: '48px',
                color: appState.isNightMode ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.12)',
                opacity: 0.6
              }}></i>
            </div>
            <p style={{
              fontSize: '17px',
              color: appState.isNightMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.45)',
              fontWeight: '300',
              marginBottom: 'var(--space-3)',
              letterSpacing: '0.3px'
            }}>
              还没有联系人
            </p>
            <p style={{
              fontSize: '14px',
              color: appState.isNightMode ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)',
              fontWeight: '300',
              marginBottom: 'var(--space-8)',
              letterSpacing: '0.2px'
            }}>
              点击右上角创建你的第一位联系人
            </p>
          </motion.div>
        ) : filteredContacts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              padding: 'var(--space-16) var(--space-8)',
              textAlign: 'center'
            }}
          >
            <i className="fas fa-search" style={{
              fontSize: '40px',
              color: appState.isNightMode ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.12)',
              marginBottom: 'var(--space-4)',
              display: 'block'
            }}></i>
            <p style={{
              fontSize: '15px',
              color: appState.isNightMode ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.4)',
              fontWeight: '300',
              letterSpacing: '0.3px'
            }}>
              没有找到相关联系人
            </p>
          </motion.div>
        ) : (
          <div>
            {sortedGroups.map((letter, groupIndex) => (
              <motion.div
                key={letter}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + groupIndex * 0.05, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  marginBottom: 'var(--space-8)'
                }}
              >
                {/* 分组标题 */}
                <div style={{
                  fontSize: '13px',
                  fontWeight: '500',
                  color: appState.isNightMode ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.35)',
                  marginBottom: 'var(--space-3)',
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                  paddingLeft: 'var(--space-2)'
                }}>
                  {letter}
                </div>

                {/* 联系人卡片 */}
                <div style={{
                  display: 'grid',
                  gap: 'var(--space-3)'
                }}>
                  {groupedContacts[letter].map((contact: any, index: number) => (
                    <motion.div
                      key={contact.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.35 + groupIndex * 0.05 + index * 0.03, ease: [0.22, 1, 0.36, 1] }}
                      onClick={() => onOpenDetail(contact.id)}
                      style={{
                        padding: 'var(--space-4)',
                        borderRadius: '18px',
                        background: appState.isNightMode 
                          ? 'rgba(255, 255, 255, 0.03)' 
                          : 'rgba(255, 255, 255, 0.8)',
                        border: `1px solid ${appState.isNightMode ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.04)'}`,
                        cursor: 'pointer',
                        transition: 'all 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--space-4)',
                        backdropFilter: 'blur(20px) saturate(150%)',
                        WebkitBackdropFilter: 'blur(20px) saturate(150%)',
                        boxShadow: appState.isNightMode 
                          ? '0 2px 12px rgba(0, 0, 0, 0.2)' 
                          : '0 2px 12px rgba(0, 0, 0, 0.04)'
                      }}
                      whileHover={{
                        scale: 1.02,
                        y: -2,
                        boxShadow: appState.isNightMode 
                          ? '0 8px 24px rgba(0, 0, 0, 0.3)' 
                          : '0 8px 24px rgba(0, 0, 0, 0.08)'
                      }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {/* 头像 */}
                      <div style={{
                        width: '64px',
                        height: '64px',
                        borderRadius: '50%',
                        background: appState.isNightMode 
                          ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.03) 100%)'
                          : 'linear-gradient(135deg, rgba(0, 0, 0, 0.04) 0%, rgba(0, 0, 0, 0.02) 100%)',
                        border: `1px solid ${appState.isNightMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)'}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'hidden',
                        flexShrink: 0,
                        boxShadow: appState.isNightMode 
                          ? 'inset 0 1px 3px rgba(255, 255, 255, 0.05)' 
                          : 'inset 0 1px 3px rgba(0, 0, 0, 0.05)'
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
                            color: appState.isNightMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.15)'
                          }}></i>
                        )}
                      </div>

                      {/* 信息 */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <h3 style={{
                          fontSize: '16px',
                          fontWeight: '400',
                          color: appState.isNightMode ? 'rgba(255, 255, 255, 0.95)' : 'rgba(0, 0, 0, 0.9)',
                          marginBottom: 'var(--space-2)',
                          letterSpacing: '0.2px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}>
                          {contact.charName}
                        </h3>
                        <div style={{
                          display: 'flex',
                          gap: 'var(--space-2)',
                          marginBottom: 'var(--space-2)',
                          flexWrap: 'wrap'
                        }}>
                          {contact.occupation && (
                            <span style={{
                              fontSize: '11px',
                              padding: '4px 10px',
                              borderRadius: '8px',
                              background: appState.isNightMode 
                                ? 'rgba(255, 255, 255, 0.08)' 
                                : 'rgba(0, 0, 0, 0.05)',
                              border: `1px solid ${appState.isNightMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)'}`,
                              color: appState.isNightMode ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.5)',
                              fontWeight: '300',
                              letterSpacing: '0.3px'
                            }}>
                              {contact.occupation}
                            </span>
                          )}
                          {contact.age && (
                            <span style={{
                              fontSize: '11px',
                              padding: '4px 10px',
                              borderRadius: '8px',
                              background: appState.isNightMode 
                                ? 'rgba(255, 255, 255, 0.08)' 
                                : 'rgba(0, 0, 0, 0.05)',
                              border: `1px solid ${appState.isNightMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)'}`,
                              color: appState.isNightMode ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.5)',
                              fontWeight: '300',
                              letterSpacing: '0.3px'
                            }}>
                              {contact.age}岁
                            </span>
                          )}
                        </div>
                        {contact.summary && (
                          <p style={{
                            fontSize: '13px',
                            color: appState.isNightMode ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.4)',
                            fontWeight: '300',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            letterSpacing: '0.2px',
                            lineHeight: '1.4'
                          }}>
                            {contact.summary}
                          </p>
                        )}
                      </div>

                      {/* 箭头 */}
                      <i className="fas fa-chevron-right" style={{
                        fontSize: '12px',
                        color: appState.isNightMode ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.12)',
                        flexShrink: 0
                      }}></i>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}