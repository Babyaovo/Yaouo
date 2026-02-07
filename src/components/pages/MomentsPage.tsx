import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface MomentsPageProps {
  appState: any;
  onUpdate: (updates: any) => void;
  onClose: () => void;
  onOpenPost: (postId: string) => void;
  onCreatePost: () => void;
}

export function MomentsPage({ appState, onUpdate, onClose, onOpenPost, onCreatePost }: MomentsPageProps) {
  const moments = appState.moments || [];
  const contacts = appState.contacts || [];

  const getMomentAuthor = (moment: any) => {
    if (moment.isMe) return appState.userInfo || { name: '我', avatar: '' };
    return contacts.find((c: any) => c.id === moment.contactId);
  };

  const formatTime = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return '刚刚';
    if (minutes < 60) return `${minutes}分钟前`;
    if (hours < 24) return `${hours}小时前`;
    if (days < 7) return `${days}天前`;
    return new Date(timestamp).toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' });
  };

  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      background: appState.isNightMode ? '#000000' : '#F0F0F0',
      overflow: 'hidden'
    }}>
      {/* 统一风格顶栏 */}
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
            Moments
          </h1>

          <button
            onClick={onCreatePost}
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

      {/* 朋友圈时间线 */}
      <div style={{
        flex: 1,
        overflow: 'auto',
        WebkitOverflowScrolling: 'touch'
      }}>
        {moments.length === 0 ? (
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
              <i className="fas fa-circle-notch" style={{
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
              暂无动态
            </p>
            <p style={{
              fontSize: '14px',
              color: appState.isNightMode ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)',
              fontWeight: '400',
              letterSpacing: '-0.1px'
            }}>
              点击右上角分享新鲜事
            </p>
          </motion.div>
        ) : (
          <div style={{ 
            padding: '12px 0',
            background: appState.isNightMode ? '#000000' : '#F0F0F0'
          }}>
            <AnimatePresence mode="popLayout">
              {moments.map((moment: any, index: number) => {
                const author = getMomentAuthor(moment);
                const isMe = moment.isMe;

                return (
                  <motion.div
                    key={moment.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ 
                      duration: 0.4, 
                      delay: index * 0.05, 
                      ease: [0.22, 1, 0.36, 1],
                      layout: { duration: 0.3, ease: [0.22, 1, 0.36, 1] }
                    }}
                    onClick={() => onOpenPost(moment.id)}
                    style={{
                      marginBottom: '12px',
                      padding: '16px 20px',
                      background: appState.isNightMode ? '#000000' : '#FFFFFF',
                      borderTop: `0.5px solid ${appState.isNightMode ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.05)'}`,
                      borderBottom: `0.5px solid ${appState.isNightMode ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.05)'}`,
                      cursor: 'pointer',
                      transition: 'background 0.15s ease'
                    }}
                    whileHover={{
                      background: appState.isNightMode ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.02)'
                    }}
                    whileTap={{ scale: 0.995 }}
                  >
                    {/* 朋友圈布局 - 左侧头像，右侧内容 */}
                    <div style={{
                      display: 'flex',
                      gap: '12px'
                    }}>
                      {/* 头像 */}
                      <div style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '6px',
                        background: appState.isNightMode 
                          ? 'rgba(255, 255, 255, 0.08)' 
                          : 'rgba(0, 0, 0, 0.05)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'hidden',
                        flexShrink: 0
                      }}>
                        {author?.charAvatar || author?.avatar ? (
                          <img
                            src={author.charAvatar || author.avatar}
                            alt={author?.charName || author?.name}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover'
                            }}
                          />
                        ) : (
                          <span style={{
                            fontSize: '18px',
                            fontWeight: '400',
                            color: appState.isNightMode ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.2)'
                          }}>
                            {(author?.charName || author?.name || '?')[0]}
                          </span>
                        )}
                      </div>

                      {/* 内容区域 */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        {/* 名字 */}
                        <h3 style={{
                          fontSize: '16px',
                          fontWeight: '600',
                          color: appState.isNightMode ? 'rgba(80, 140, 210, 1)' : 'rgba(87, 107, 149, 1)',
                          marginBottom: '6px',
                          letterSpacing: '-0.2px',
                          lineHeight: '1.3'
                        }}>
                          {isMe ? (appState.userInfo?.name || '我') : (author?.charName || '未知')}
                        </h3>

                        {/* 内容文本 */}
                        {moment.content && (
                          <p style={{
                            fontSize: '16px',
                            color: appState.isNightMode ? 'rgba(255, 255, 255, 0.85)' : 'rgba(0, 0, 0, 0.8)',
                            lineHeight: '1.5',
                            marginBottom: moment.images?.length > 0 ? '12px' : '8px',
                            fontWeight: '400',
                            letterSpacing: '-0.1px',
                            whiteSpace: 'pre-wrap',
                            wordBreak: 'break-word'
                          }}>
                            {moment.content}
                          </p>
                        )}

                        {/* 图片网格 - 朋友圈风格 */}
                        {moment.images && moment.images.length > 0 && (
                          <div style={{
                            display: 'grid',
                            gridTemplateColumns: moment.images.length === 1 ? '1fr' : 'repeat(3, 1fr)',
                            gap: '4px',
                            marginBottom: '8px',
                            maxWidth: moment.images.length === 1 ? '200px' : '100%'
                          }}>
                            {moment.images.slice(0, 9).map((img: string, idx: number) => (
                              <div
                                key={idx}
                                style={{
                                  aspectRatio: '1',
                                  background: appState.isNightMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)',
                                  borderRadius: '4px',
                                  overflow: 'hidden'
                                }}
                              >
                                <img
                                  src={img}
                                  alt=""
                                  style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover'
                                  }}
                                />
                              </div>
                            ))}
                          </div>
                        )}

                        {/* 时间 */}
                        <p style={{
                          fontSize: '13px',
                          color: appState.isNightMode ? 'rgba(255, 255, 255, 0.35)' : 'rgba(0, 0, 0, 0.3)',
                          fontWeight: '400',
                          letterSpacing: '-0.1px',
                          lineHeight: '1.3'
                        }}>
                          {formatTime(moment.createdAt)}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}