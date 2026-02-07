import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface GalleryAppProps {
  appState: any;
  onUpdate: (updates: any) => void;
  onClose: () => void;
}

const getDefaultIcon = (appId: string) => {
  const icons: Record<string, string> = {
    'settings': 'fa-cog',
    'contacts': 'fa-address-book',
    'chat-list': 'fa-comments',
    'gallery': 'fa-images'
  };
  return icons[appId] || 'fa-cube';
};

// 默认CSS代码
const DEFAULT_BUBBLE_CSS = `.message-bubble {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px) saturate(180%);
  color: #1e293b;
  border-radius: 18px;
  padding: 14px 18px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.message.user .message-bubble {
  background: rgba(0, 122, 255, 0.15);
  backdrop-filter: blur(20px) saturate(150%);
  color: #1e293b;
}

body.night-mode .message-bubble {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(20px) saturate(150%);
  color: #fff;
}

body.night-mode .message.user .message-bubble {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(20px) saturate(150%);
  color: #fff;
}`;

const DEFAULT_CHAT_CSS = `.chat-messages {
  background: linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%);
}

body.night-mode .chat-messages {
  background: #000;
}

.chat-header {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

body.night-mode .chat-header {
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.chat-input {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-top: 1px solid rgba(0, 0, 0, 0.08);
}

body.night-mode .chat-input {
  background: rgba(0, 0, 0, 0.95);
  backdrop-filter: blur(20px);
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}`;

export function GalleryApp({ appState, onUpdate, onClose }: GalleryAppProps) {
  const [activeTab, setActiveTab] = useState<'wallpaper' | 'bubble' | 'chat-style' | 'icons' | 'names'>('wallpaper');
  const [customBubbleCSS, setCustomBubbleCSS] = useState('');
  const [customChatCSS, setCustomChatCSS] = useState('');
  const [previewBubbleCSS, setPreviewBubbleCSS] = useState('');

  useEffect(() => {
    setCustomBubbleCSS(appState.customBubbleCSS || '');
    setCustomChatCSS(appState.customChatCSS || '');
  }, [appState.customBubbleCSS, appState.customChatCSS]);

  useEffect(() => {
    if (!customBubbleCSS.trim()) {
      setPreviewBubbleCSS('');
      return;
    }
    setPreviewBubbleCSS(customBubbleCSS);
  }, [customBubbleCSS]);

  const handleWallpaperUpload = (file: File) => {
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      onUpdate({ homeWallpaper: result });
    };
    reader.readAsDataURL(file);
  };

  const handleIconUpload = (appId: string, file: File) => {
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      const newIcons = {
        ...(appState.customAppIconImages || {}),
        [appId]: result
      };
      onUpdate({ customAppIconImages: newIcons });
    };
    reader.readAsDataURL(file);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => {
      alert(`${label}已复制！`);
    }).catch(() => {
      alert('复制失败');
    });
  };

  const applyBubbleCSS = () => {
    if (!customBubbleCSS.trim()) {
      alert('请输入CSS代码');
      return;
    }

    let styleEl = document.getElementById('custom-bubble-style');
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = 'custom-bubble-style';
      document.head.appendChild(styleEl);
    }
    styleEl.textContent = customBubbleCSS;
    onUpdate({ customBubbleCSS });
    alert('已应用');
  };

  const resetBubbleCSS = () => {
    const styleEl = document.getElementById('custom-bubble-style');
    if (styleEl) styleEl.remove();
    setCustomBubbleCSS('');
    setPreviewBubbleCSS('');
    onUpdate({ customBubbleCSS: '' });
    alert('已重置');
  };

  const applyChatCSS = () => {
    if (!customChatCSS.trim()) {
      alert('请输入CSS代码');
      return;
    }

    let styleEl = document.getElementById('custom-chat-style');
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = 'custom-chat-style';
      document.head.appendChild(styleEl);
    }
    styleEl.textContent = customChatCSS;
    onUpdate({ customChatCSS });
    alert('已应用');
  };

  const resetChatCSS = () => {
    const styleEl = document.getElementById('custom-chat-style');
    if (styleEl) styleEl.remove();
    setCustomChatCSS('');
    onUpdate({ customChatCSS: '' });
    alert('已重置');
  };

  const tabs = [
    { id: 'wallpaper', icon: 'fa-image', label: '壁纸' },
    { id: 'bubble', icon: 'fa-comment', label: '气泡' },
    { id: 'chat-style', icon: 'fa-palette', label: '样式' },
    { id: 'icons', icon: 'fa-th', label: '图标' },
    { id: 'names', icon: 'fa-tag', label: '名称' }
  ];

  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      background: appState.isNightMode ? 'var(--surface-dark)' : 'var(--surface-light)',
      transition: 'background var(--duration-normal) var(--ease-smooth)',
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
          marginBottom: 'var(--space-6)'
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
            Gallery
          </h1>

          <div style={{ width: '44px' }}></div>
        </div>
      </motion.div>

      {/* 优雅的Tab导航 */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        style={{
          display: 'flex',
          gap: 'var(--space-2)',
          padding: 'var(--space-4) var(--space-6)',
          overflowX: 'auto',
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'none',
          background: appState.isNightMode ? 'var(--surface-dark)' : 'var(--surface-light)'
        }}
        className="hide-scrollbar"
      >
        {tabs.map((tab, index) => (
          <motion.button
            key={tab.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 + index * 0.05, ease: [0.22, 1, 0.36, 1] }}
            onClick={() => setActiveTab(tab.id as any)}
            style={{
              flex: '0 0 auto',
              padding: 'var(--space-3) var(--space-5)',
              borderRadius: 'var(--radius-full)',
              border: `1px solid ${activeTab === tab.id 
                ? (appState.isNightMode ? 'var(--border-strong-dark)' : 'var(--border-strong-light)')
                : (appState.isNightMode ? 'var(--border-subtle-dark)' : 'var(--border-subtle-light)')}`,
              background: activeTab === tab.id
                ? (appState.isNightMode ? 'var(--surface-elevated-dark)' : 'var(--surface-elevated-light)')
                : 'transparent',
              color: activeTab === tab.id
                ? (appState.isNightMode ? 'var(--text-primary-dark)' : 'var(--text-primary-light)')
                : (appState.isNightMode ? 'var(--text-tertiary-dark)' : 'var(--text-tertiary-light)'),
              fontSize: 'var(--text-sm)',
              fontWeight: activeTab === tab.id ? 'var(--font-normal)' : 'var(--font-light)',
              cursor: 'pointer',
              transition: 'all var(--duration-fast) var(--ease-smooth)',
              boxShadow: activeTab === tab.id 
                ? (appState.isNightMode ? 'var(--shadow-glow-subtle)' : 'var(--shadow-subtle)')
                : 'none',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-2)',
              letterSpacing: '0.01em',
              whiteSpace: 'nowrap'
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <i className={`fas ${tab.icon}`} style={{ fontSize: 'var(--text-xs)' }}></i>
            <span>{tab.label}</span>
          </motion.button>
        ))}
      </motion.div>

      {/* 内容区域 - 使用AnimatePresence实现流畅切换 */}
      <div style={{
        flex: 1,
        overflow: 'auto',
        WebkitOverflowScrolling: 'touch',
        position: 'relative'
      }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            style={{
              padding: 'var(--space-6)',
              minHeight: '100%'
            }}
          >
            {/* 壁纸Tab */}
            {activeTab === 'wallpaper' && (
              <div>
                <h2 style={{
                  fontSize: 'var(--text-lg)',
                  fontWeight: 'var(--font-normal)',
                  color: appState.isNightMode ? 'var(--text-primary-dark)' : 'var(--text-primary-light)',
                  marginBottom: 'var(--space-2)',
                  letterSpacing: '0.02em',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-3)'
                }}>
                  <i className="fas fa-image" style={{ fontSize: 'var(--text-base)' }}></i>
                  主页壁纸
                </h2>
                <p style={{
                  fontSize: 'var(--text-sm)',
                  color: appState.isNightMode ? 'var(--text-tertiary-dark)' : 'var(--text-tertiary-light)',
                  marginBottom: 'var(--space-8)',
                  fontWeight: 'var(--font-light)',
                  letterSpacing: '0.01em',
                  lineHeight: 'var(--leading-relaxed)'
                }}>
                  设置主屏幕背景图片
                </p>

                {/* 壁纸预览 - 艺术级展示 */}
                <div style={{
                  width: '100%',
                  aspectRatio: '9/16',
                  borderRadius: 'var(--radius-xl)',
                  overflow: 'hidden',
                  marginBottom: 'var(--space-6)',
                  background: appState.isNightMode ? 'var(--surface-sunken-dark)' : 'var(--surface-sunken-light)',
                  border: `1px solid ${appState.isNightMode ? 'var(--border-subtle-dark)' : 'var(--border-subtle-light)'}`,
                  boxShadow: appState.isNightMode ? 'var(--shadow-glow-medium)' : 'var(--shadow-medium)',
                  position: 'relative'
                }}>
                  {appState.homeWallpaper ? (
                    <img
                      src={appState.homeWallpaper}
                      alt="壁纸预览"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                  ) : (
                    <div style={{
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 'var(--space-4)'
                    }}>
                      <i className="fas fa-image" style={{
                        fontSize: 'var(--text-4xl)',
                        color: appState.isNightMode ? 'var(--text-quaternary-dark)' : 'var(--text-quaternary-light)',
                        opacity: 0.3
                      }}></i>
                      <p style={{
                        fontSize: 'var(--text-sm)',
                        color: appState.isNightMode ? 'var(--text-tertiary-dark)' : 'var(--text-tertiary-light)',
                        fontWeight: 'var(--font-light)',
                        letterSpacing: '0.02em'
                      }}>
                        暂无壁纸
                      </p>
                    </div>
                  )}
                </div>

                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleWallpaperUpload(file);
                    e.target.value = '';
                  }}
                  id="wallpaper-upload"
                  style={{ display: 'none' }}
                />

                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                  <button
                    onClick={() => document.getElementById('wallpaper-upload')?.click()}
                    style={{
                      width: '100%',
                      height: '52px',
                      borderRadius: 'var(--radius-lg)',
                      background: appState.isNightMode ? 'var(--surface-elevated-dark)' : 'var(--text-primary-light)',
                      border: `1px solid ${appState.isNightMode ? 'var(--border-normal-dark)' : 'var(--text-primary-light)'}`,
                      color: appState.isNightMode ? 'var(--text-primary-dark)' : 'var(--surface-light)',
                      fontSize: 'var(--text-base)',
                      fontWeight: 'var(--font-normal)',
                      cursor: 'pointer',
                      letterSpacing: '0.01em',
                      transition: 'all var(--duration-fast) var(--ease-smooth)',
                      boxShadow: appState.isNightMode ? 'var(--shadow-glow-subtle)' : 'var(--shadow-soft)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 'var(--space-2)'
                    }}
                  >
                    <i className="fas fa-upload"></i>
                    <span>上传壁纸</span>
                  </button>

                  {appState.homeWallpaper && (
                    <button
                      onClick={() => onUpdate({ homeWallpaper: '' })}
                      style={{
                        width: '100%',
                        height: '52px',
                        borderRadius: 'var(--radius-lg)',
                        background: 'transparent',
                        border: `1px solid ${appState.isNightMode ? 'var(--border-normal-dark)' : 'var(--border-normal-light)'}`,
                        color: appState.isNightMode ? 'var(--text-secondary-dark)' : 'var(--text-secondary-light)',
                        fontSize: 'var(--text-base)',
                        fontWeight: 'var(--font-light)',
                        cursor: 'pointer',
                        letterSpacing: '0.01em',
                        transition: 'all var(--duration-fast) var(--ease-smooth)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 'var(--space-2)'
                      }}
                    >
                      <i className="fas fa-trash"></i>
                      <span>移除壁纸</span>
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* 气泡样式Tab - 保留所有原有功能 */}
            {activeTab === 'bubble' && (
              <div>
                <h2 style={{
                  fontSize: 'var(--text-lg)',
                  fontWeight: 'var(--font-normal)',
                  color: appState.isNightMode ? 'var(--text-primary-dark)' : 'var(--text-primary-light)',
                  marginBottom: 'var(--space-2)',
                  letterSpacing: '0.02em',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-3)'
                }}>
                  <i className="fas fa-comment" style={{ fontSize: 'var(--text-base)' }}></i>
                  气泡样式
                </h2>
                <p style={{
                  fontSize: 'var(--text-sm)',
                  color: appState.isNightMode ? 'var(--text-tertiary-dark)' : 'var(--text-tertiary-light)',
                  marginBottom: 'var(--space-6)',
                  fontWeight: 'var(--font-light)',
                  letterSpacing: '0.01em',
                  lineHeight: 'var(--leading-relaxed)'
                }}>
                  自定义聊天气泡CSS，实时预览效果
                </p>

                {/* 默认代码展示 */}
                <div style={{
                  marginBottom: 'var(--space-6)',
                  padding: 'var(--space-5)',
                  borderRadius: 'var(--radius-lg)',
                  background: appState.isNightMode ? 'var(--surface-elevated-dark)' : 'var(--surface-elevated-light)',
                  border: `1px solid ${appState.isNightMode ? 'var(--border-subtle-dark)' : 'var(--border-subtle-light)'}`,
                  boxShadow: appState.isNightMode ? 'var(--shadow-glow-subtle)' : 'var(--shadow-subtle)'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: 'var(--space-3)'
                  }}>
                    <span style={{
                      fontSize: 'var(--text-sm)',
                      color: appState.isNightMode ? 'var(--text-secondary-dark)' : 'var(--text-secondary-light)',
                      fontWeight: 'var(--font-normal)',
                      letterSpacing: '0.01em'
                    }}>
                      默认CSS代码
                    </span>
                    <button
                      onClick={() => copyToClipboard(DEFAULT_BUBBLE_CSS, '默认气泡CSS')}
                      style={{
                        padding: 'var(--space-2) var(--space-4)',
                        borderRadius: 'var(--radius-md)',
                        background: 'transparent',
                        border: `1px solid ${appState.isNightMode ? 'var(--border-normal-dark)' : 'var(--border-normal-light)'}`,
                        color: appState.isNightMode ? 'var(--text-secondary-dark)' : 'var(--text-secondary-light)',
                        fontSize: 'var(--text-xs)',
                        fontWeight: 'var(--font-light)',
                        cursor: 'pointer',
                        letterSpacing: '0.01em',
                        transition: 'all var(--duration-fast) var(--ease-smooth)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--space-2)'
                      }}
                    >
                      <i className="fas fa-copy" style={{ fontSize: '10px' }}></i>
                      <span>复制</span>
                    </button>
                  </div>
                  <pre style={{
                    fontSize: 'var(--text-xs)',
                    color: appState.isNightMode ? 'var(--text-tertiary-dark)' : 'var(--text-tertiary-light)',
                    fontFamily: 'monospace',
                    lineHeight: 'var(--leading-relaxed)',
                    margin: 0,
                    overflow: 'auto',
                    maxHeight: '200px',
                    padding: 'var(--space-3)',
                    borderRadius: 'var(--radius-md)',
                    background: appState.isNightMode ? 'var(--surface-sunken-dark)' : 'var(--surface-sunken-light)'
                  }}>
                    {DEFAULT_BUBBLE_CSS}
                  </pre>
                </div>

                {/* CSS输入框 */}
                <div style={{ marginBottom: 'var(--space-6)' }}>
                  <label style={{
                    display: 'block',
                    fontSize: 'var(--text-sm)',
                    color: appState.isNightMode ? 'var(--text-secondary-dark)' : 'var(--text-secondary-light)',
                    marginBottom: 'var(--space-3)',
                    fontWeight: 'var(--font-normal)',
                    letterSpacing: '0.01em'
                  }}>
                    自定义CSS
                  </label>
                  <textarea
                    value={customBubbleCSS}
                    onChange={(e) => setCustomBubbleCSS(e.target.value)}
                    placeholder="粘贴你的CSS代码..."
                    rows={12}
                    style={{
                      width: '100%',
                      padding: 'var(--space-4)',
                      borderRadius: 'var(--radius-md)',
                      border: `1px solid ${appState.isNightMode ? 'var(--border-normal-dark)' : 'var(--border-normal-light)'}`,
                      background: appState.isNightMode ? 'var(--surface-dark)' : 'var(--surface-light)',
                      color: appState.isNightMode ? 'var(--text-primary-dark)' : 'var(--text-primary-light)',
                      fontSize: 'var(--text-sm)',
                      fontWeight: 'var(--font-light)',
                      fontFamily: 'monospace',
                      lineHeight: 'var(--leading-relaxed)',
                      outline: 'none',
                      resize: 'vertical',
                      transition: 'all var(--duration-fast) var(--ease-smooth)'
                    }}
                  />
                </div>

                {/* 实时预览 */}
                <div style={{
                  marginBottom: 'var(--space-6)',
                  padding: 'var(--space-5)',
                  borderRadius: 'var(--radius-lg)',
                  background: appState.isNightMode ? 'var(--surface-elevated-dark)' : 'var(--surface-elevated-light)',
                  border: `1px solid ${appState.isNightMode ? 'var(--border-subtle-dark)' : 'var(--border-subtle-light)'}`,
                  boxShadow: appState.isNightMode ? 'var(--shadow-glow-subtle)' : 'var(--shadow-subtle)'
                }}>
                  <h3 style={{
                    fontSize: 'var(--text-sm)',
                    color: appState.isNightMode ? 'var(--text-secondary-dark)' : 'var(--text-secondary-light)',
                    marginBottom: 'var(--space-4)',
                    fontWeight: 'var(--font-normal)',
                    letterSpacing: '0.01em',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-2)'
                  }}>
                    <i className="fas fa-eye" style={{ fontSize: '12px' }}></i>
                    实时预览
                  </h3>
                  <div style={{ position: 'relative' }}>
                    <style>{previewBubbleCSS}</style>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                      <div className="message ai preview-mode" style={{ display: 'flex', justifyContent: 'flex-start' }}>
                        <div className="message-bubble">
                          <p style={{ margin: 0 }}>AI消息预览</p>
                        </div>
                      </div>
                      <div className="message user preview-mode" style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <div className="message-bubble">
                          <p style={{ margin: 0 }}>用户消息预览</p>
                        </div>
                      </div>
                      <div className="message ai preview-mode" style={{ display: 'flex', justifyContent: 'flex-start' }}>
                        <div className="message-bubble">
                          <p style={{ margin: 0 }}>实时预览效果 ✨</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 操作按钮 */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                  <button
                    onClick={applyBubbleCSS}
                    style={{
                      width: '100%',
                      height: '52px',
                      borderRadius: 'var(--radius-lg)',
                      background: appState.isNightMode ? 'var(--surface-elevated-dark)' : 'var(--text-primary-light)',
                      border: `1px solid ${appState.isNightMode ? 'var(--border-normal-dark)' : 'var(--text-primary-light)'}`,
                      color: appState.isNightMode ? 'var(--text-primary-dark)' : 'var(--surface-light)',
                      fontSize: 'var(--text-base)',
                      fontWeight: 'var(--font-normal)',
                      cursor: 'pointer',
                      letterSpacing: '0.01em',
                      transition: 'all var(--duration-fast) var(--ease-smooth)',
                      boxShadow: appState.isNightMode ? 'var(--shadow-glow-subtle)' : 'var(--shadow-soft)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 'var(--space-2)'
                    }}
                  >
                    <i className="fas fa-check"></i>
                    <span>应用样式</span>
                  </button>
                  <button
                    onClick={resetBubbleCSS}
                    style={{
                      width: '100%',
                      height: '52px',
                      borderRadius: 'var(--radius-lg)',
                      background: 'transparent',
                      border: `1px solid ${appState.isNightMode ? 'var(--border-normal-dark)' : 'var(--border-normal-light)'}`,
                      color: appState.isNightMode ? 'var(--text-secondary-dark)' : 'var(--text-secondary-light)',
                      fontSize: 'var(--text-base)',
                      fontWeight: 'var(--font-light)',
                      cursor: 'pointer',
                      letterSpacing: '0.01em',
                      transition: 'all var(--duration-fast) var(--ease-smooth)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 'var(--space-2)'
                    }}
                  >
                    <i className="fas fa-undo"></i>
                    <span>重置样式</span>
                  </button>
                </div>
              </div>
            )}

            {/* 聊天样式Tab - 类似气泡Tab的设计，保留所有功能 */}
            {activeTab === 'chat-style' && (
              <div>
                <h2 style={{
                  fontSize: 'var(--text-lg)',
                  fontWeight: 'var(--font-normal)',
                  color: appState.isNightMode ? 'var(--text-primary-dark)' : 'var(--text-primary-light)',
                  marginBottom: 'var(--space-2)',
                  letterSpacing: '0.02em',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-3)'
                }}>
                  <i className="fas fa-palette" style={{ fontSize: 'var(--text-base)' }}></i>
                  聊天界面样式
                </h2>
                <p style={{
                  fontSize: 'var(--text-sm)',
                  color: appState.isNightMode ? 'var(--text-tertiary-dark)' : 'var(--text-tertiary-light)',
                  marginBottom: 'var(--space-6)',
                  fontWeight: 'var(--font-light)',
                  letterSpacing: '0.01em',
                  lineHeight: 'var(--leading-relaxed)'
                }}>
                  自定义整个聊天界面的CSS样式
                </p>

                {/* 默认代码 */}
                <div style={{
                  marginBottom: 'var(--space-6)',
                  padding: 'var(--space-5)',
                  borderRadius: 'var(--radius-lg)',
                  background: appState.isNightMode ? 'var(--surface-elevated-dark)' : 'var(--surface-elevated-light)',
                  border: `1px solid ${appState.isNightMode ? 'var(--border-subtle-dark)' : 'var(--border-subtle-light)'}`,
                  boxShadow: appState.isNightMode ? 'var(--shadow-glow-subtle)' : 'var(--shadow-subtle)'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: 'var(--space-3)'
                  }}>
                    <span style={{
                      fontSize: 'var(--text-sm)',
                      color: appState.isNightMode ? 'var(--text-secondary-dark)' : 'var(--text-secondary-light)',
                      fontWeight: 'var(--font-normal)',
                      letterSpacing: '0.01em'
                    }}>
                      默认CSS代码
                    </span>
                    <button
                      onClick={() => copyToClipboard(DEFAULT_CHAT_CSS, '默认聊天界面CSS')}
                      style={{
                        padding: 'var(--space-2) var(--space-4)',
                        borderRadius: 'var(--radius-md)',
                        background: 'transparent',
                        border: `1px solid ${appState.isNightMode ? 'var(--border-normal-dark)' : 'var(--border-normal-light)'}`,
                        color: appState.isNightMode ? 'var(--text-secondary-dark)' : 'var(--text-secondary-light)',
                        fontSize: 'var(--text-xs)',
                        fontWeight: 'var(--font-light)',
                        cursor: 'pointer',
                        letterSpacing: '0.01em',
                        transition: 'all var(--duration-fast) var(--ease-smooth)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--space-2)'
                      }}
                    >
                      <i className="fas fa-copy" style={{ fontSize: '10px' }}></i>
                      <span>复制</span>
                    </button>
                  </div>
                  <pre style={{
                    fontSize: 'var(--text-xs)',
                    color: appState.isNightMode ? 'var(--text-tertiary-dark)' : 'var(--text-tertiary-light)',
                    fontFamily: 'monospace',
                    lineHeight: 'var(--leading-relaxed)',
                    margin: 0,
                    overflow: 'auto',
                    maxHeight: '200px',
                    padding: 'var(--space-3)',
                    borderRadius: 'var(--radius-md)',
                    background: appState.isNightMode ? 'var(--surface-sunken-dark)' : 'var(--surface-sunken-light)'
                  }}>
                    {DEFAULT_CHAT_CSS}
                  </pre>
                </div>

                {/* CSS输入框 */}
                <div style={{ marginBottom: 'var(--space-6)' }}>
                  <label style={{
                    display: 'block',
                    fontSize: 'var(--text-sm)',
                    color: appState.isNightMode ? 'var(--text-secondary-dark)' : 'var(--text-secondary-light)',
                    marginBottom: 'var(--space-3)',
                    fontWeight: 'var(--font-normal)',
                    letterSpacing: '0.01em'
                  }}>
                    自定义CSS
                  </label>
                  <textarea
                    value={customChatCSS}
                    onChange={(e) => setCustomChatCSS(e.target.value)}
                    placeholder="粘贴你的CSS代码..."
                    rows={12}
                    style={{
                      width: '100%',
                      padding: 'var(--space-4)',
                      borderRadius: 'var(--radius-md)',
                      border: `1px solid ${appState.isNightMode ? 'var(--border-normal-dark)' : 'var(--border-normal-light)'}`,
                      background: appState.isNightMode ? 'var(--surface-dark)' : 'var(--surface-light)',
                      color: appState.isNightMode ? 'var(--text-primary-dark)' : 'var(--text-primary-light)',
                      fontSize: 'var(--text-sm)',
                      fontWeight: 'var(--font-light)',
                      fontFamily: 'monospace',
                      lineHeight: 'var(--leading-relaxed)',
                      outline: 'none',
                      resize: 'vertical',
                      transition: 'all var(--duration-fast) var(--ease-smooth)'
                    }}
                  />
                </div>

                {/* 操作按钮 */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                  <button
                    onClick={applyChatCSS}
                    style={{
                      width: '100%',
                      height: '52px',
                      borderRadius: 'var(--radius-lg)',
                      background: appState.isNightMode ? 'var(--surface-elevated-dark)' : 'var(--text-primary-light)',
                      border: `1px solid ${appState.isNightMode ? 'var(--border-normal-dark)' : 'var(--text-primary-light)'}`,
                      color: appState.isNightMode ? 'var(--text-primary-dark)' : 'var(--surface-light)',
                      fontSize: 'var(--text-base)',
                      fontWeight: 'var(--font-normal)',
                      cursor: 'pointer',
                      letterSpacing: '0.01em',
                      transition: 'all var(--duration-fast) var(--ease-smooth)',
                      boxShadow: appState.isNightMode ? 'var(--shadow-glow-subtle)' : 'var(--shadow-soft)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 'var(--space-2)'
                    }}
                  >
                    <i className="fas fa-check"></i>
                    <span>应用样式</span>
                  </button>
                  <button
                    onClick={resetChatCSS}
                    style={{
                      width: '100%',
                      height: '52px',
                      borderRadius: 'var(--radius-lg)',
                      background: 'transparent',
                      border: `1px solid ${appState.isNightMode ? 'var(--border-normal-dark)' : 'var(--border-normal-light)'}`,
                      color: appState.isNightMode ? 'var(--text-secondary-dark)' : 'var(--text-secondary-light)',
                      fontSize: 'var(--text-base)',
                      fontWeight: 'var(--font-light)',
                      cursor: 'pointer',
                      letterSpacing: '0.01em',
                      transition: 'all var(--duration-fast) var(--ease-smooth)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 'var(--space-2)'
                    }}
                  >
                    <i className="fas fa-undo"></i>
                    <span>重置样式</span>
                  </button>
                </div>
              </div>
            )}

            {/* 图标Tab - 保留所有功能 */}
            {activeTab === 'icons' && (
              <div>
                <h2 style={{
                  fontSize: 'var(--text-lg)',
                  fontWeight: 'var(--font-normal)',
                  color: appState.isNightMode ? 'var(--text-primary-dark)' : 'var(--text-primary-light)',
                  marginBottom: 'var(--space-2)',
                  letterSpacing: '0.02em',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-3)'
                }}>
                  <i className="fas fa-th" style={{ fontSize: 'var(--text-base)' }}></i>
                  App图标
                </h2>
                <p style={{
                  fontSize: 'var(--text-sm)',
                  color: appState.isNightMode ? 'var(--text-tertiary-dark)' : 'var(--text-tertiary-light)',
                  marginBottom: 'var(--space-8)',
                  fontWeight: 'var(--font-light)',
                  letterSpacing: '0.01em',
                  lineHeight: 'var(--leading-relaxed)'
                }}>
                  为每个App上传自定义图标图片
                </p>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: 'var(--space-4)'
                }}>
                  {['settings', 'contacts', 'chat-list', 'gallery'].map((appId, index) => {
                    const appNames: Record<string, string> = {
                      'settings': '设置',
                      'contacts': '联系人',
                      'chat-list': '聊天',
                      'gallery': '画廊'
                    };
                    
                    const currentIconImage = appState.customAppIconImages?.[appId];
                    
                    return (
                      <motion.div
                        key={appId}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
                        style={{
                          padding: 'var(--space-5)',
                          borderRadius: 'var(--radius-lg)',
                          background: appState.isNightMode ? 'var(--surface-elevated-dark)' : 'var(--surface-elevated-light)',
                          border: `1px solid ${appState.isNightMode ? 'var(--border-subtle-dark)' : 'var(--border-subtle-light)'}`,
                          boxShadow: appState.isNightMode ? 'var(--shadow-glow-subtle)' : 'var(--shadow-subtle)',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: 'var(--space-4)'
                        }}
                      >
                        {/* 图标预览 */}
                        <div style={{
                          width: '80px',
                          height: '80px',
                          borderRadius: 'var(--radius-xl)',
                          background: appState.isNightMode ? 'var(--surface-sunken-dark)' : 'var(--surface-sunken-light)',
                          border: `1px solid ${appState.isNightMode ? 'var(--border-subtle-dark)' : 'var(--border-subtle-light)'}`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          overflow: 'hidden',
                          boxShadow: appState.isNightMode ? 'var(--shadow-glow-soft)' : 'var(--shadow-soft)'
                        }}>
                          {currentIconImage ? (
                            <img src={currentIconImage} alt={appNames[appId]} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          ) : (
                            <i className={`fas ${appState.customAppIcons?.[appId] || getDefaultIcon(appId)}`} style={{
                              fontSize: 'var(--text-2xl)',
                              color: appState.isNightMode ? 'var(--text-tertiary-dark)' : 'var(--text-tertiary-light)'
                            }}></i>
                          )}
                        </div>

                        <div style={{
                          fontSize: 'var(--text-sm)',
                          color: appState.isNightMode ? 'var(--text-secondary-dark)' : 'var(--text-secondary-light)',
                          fontWeight: 'var(--font-normal)',
                          letterSpacing: '0.01em'
                        }}>
                          {appNames[appId]}
                        </div>

                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleIconUpload(appId, file);
                            e.target.value = '';
                          }}
                          id={`icon-upload-${appId}`}
                          style={{ display: 'none' }}
                        />

                        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                          <button
                            onClick={() => document.getElementById(`icon-upload-${appId}`)?.click()}
                            style={{
                              width: '100%',
                              padding: 'var(--space-3)',
                              borderRadius: 'var(--radius-md)',
                              background: 'transparent',
                              border: `1px solid ${appState.isNightMode ? 'var(--border-normal-dark)' : 'var(--border-normal-light)'}`,
                              color: appState.isNightMode ? 'var(--text-secondary-dark)' : 'var(--text-secondary-light)',
                              fontSize: 'var(--text-xs)',
                              fontWeight: 'var(--font-light)',
                              cursor: 'pointer',
                              letterSpacing: '0.01em',
                              transition: 'all var(--duration-fast) var(--ease-smooth)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: 'var(--space-2)'
                            }}
                          >
                            <i className="fas fa-upload" style={{ fontSize: '10px' }}></i>
                            <span>上传</span>
                          </button>

                          {currentIconImage && (
                            <button
                              onClick={() => {
                                const newIcons = { ...(appState.customAppIconImages || {}) };
                                delete newIcons[appId];
                                onUpdate({ customAppIconImages: newIcons });
                              }}
                              style={{
                                width: '100%',
                                padding: 'var(--space-3)',
                                borderRadius: 'var(--radius-md)',
                                background: 'transparent',
                                border: `1px solid ${appState.isNightMode ? 'rgba(255, 100, 100, 0.3)' : 'rgba(220, 38, 38, 0.2)'}`,
                                color: appState.isNightMode ? 'rgba(255, 150, 150, 0.9)' : 'rgba(220, 38, 38, 0.9)',
                                fontSize: 'var(--text-xs)',
                                fontWeight: 'var(--font-light)',
                                cursor: 'pointer',
                                letterSpacing: '0.01em',
                                transition: 'all var(--duration-fast) var(--ease-smooth)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 'var(--space-2)'
                              }}
                            >
                              <i className="fas fa-trash" style={{ fontSize: '10px' }}></i>
                              <span>移除</span>
                            </button>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 名称Tab - 保留所有功能 */}
            {activeTab === 'names' && (
              <div>
                <h2 style={{
                  fontSize: 'var(--text-lg)',
                  fontWeight: 'var(--font-normal)',
                  color: appState.isNightMode ? 'var(--text-primary-dark)' : 'var(--text-primary-light)',
                  marginBottom: 'var(--space-2)',
                  letterSpacing: '0.02em',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-3)'
                }}>
                  <i className="fas fa-tag" style={{ fontSize: 'var(--text-base)' }}></i>
                  App名称
                </h2>
                <p style={{
                  fontSize: 'var(--text-sm)',
                  color: appState.isNightMode ? 'var(--text-tertiary-dark)' : 'var(--text-tertiary-light)',
                  marginBottom: 'var(--space-8)',
                  fontWeight: 'var(--font-light)',
                  letterSpacing: '0.01em',
                  lineHeight: 'var(--leading-relaxed)'
                }}>
                  为每个App设置自定义名称
                </p>

                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 'var(--space-4)'
                }}>
                  {['settings', 'contacts', 'chat-list', 'gallery'].map((appId, index) => {
                    const defaultNames: Record<string, string> = {
                      'settings': '设置',
                      'contacts': '联系人',
                      'chat-list': '聊天',
                      'gallery': '画廊'
                    };
                    
                    const currentName = appState.customAppNames?.[appId] || defaultNames[appId];
                    
                    return (
                      <motion.div
                        key={appId}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
                        style={{
                          padding: 'var(--space-5)',
                          borderRadius: 'var(--radius-lg)',
                          background: appState.isNightMode ? 'var(--surface-elevated-dark)' : 'var(--surface-elevated-light)',
                          border: `1px solid ${appState.isNightMode ? 'var(--border-subtle-dark)' : 'var(--border-subtle-light)'}`,
                          boxShadow: appState.isNightMode ? 'var(--shadow-glow-subtle)' : 'var(--shadow-subtle)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 'var(--space-4)'
                        }}
                      >
                        <div style={{
                          width: '44px',
                          height: '44px',
                          borderRadius: 'var(--radius-lg)',
                          background: appState.isNightMode ? 'var(--surface-sunken-dark)' : 'var(--surface-sunken-light)',
                          border: `1px solid ${appState.isNightMode ? 'var(--border-subtle-dark)' : 'var(--border-subtle-light)'}`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          boxShadow: appState.isNightMode ? 'var(--shadow-glow-soft)' : 'var(--shadow-subtle)'
                        }}>
                          <i className={`fas ${appState.customAppIcons?.[appId] || getDefaultIcon(appId)}`} style={{
                            fontSize: 'var(--text-base)',
                            color: appState.isNightMode ? 'var(--text-secondary-dark)' : 'var(--text-secondary-light)'
                          }}></i>
                        </div>

                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                          <div style={{
                            fontSize: 'var(--text-xs)',
                            color: appState.isNightMode ? 'var(--text-tertiary-dark)' : 'var(--text-tertiary-light)',
                            fontWeight: 'var(--font-light)',
                            letterSpacing: '0.02em',
                            textTransform: 'uppercase'
                          }}>
                            {defaultNames[appId]}
                          </div>
                          <input
                            type="text"
                            value={currentName}
                            onChange={(e) => {
                              const newNames = {
                                ...(appState.customAppNames || {}),
                                [appId]: e.target.value
                              };
                              onUpdate({ customAppNames: newNames });
                            }}
                            placeholder="自定义名称"
                            maxLength={6}
                            style={{
                              width: '100%',
                              padding: 'var(--space-3)',
                              borderRadius: 'var(--radius-md)',
                              border: `1px solid ${appState.isNightMode ? 'var(--border-normal-dark)' : 'var(--border-normal-light)'}`,
                              background: appState.isNightMode ? 'var(--surface-dark)' : 'var(--surface-light)',
                              color: appState.isNightMode ? 'var(--text-primary-dark)' : 'var(--text-primary-light)',
                              fontSize: 'var(--text-sm)',
                              fontWeight: 'var(--font-light)',
                              outline: 'none',
                              transition: 'all var(--duration-fast) var(--ease-smooth)',
                              letterSpacing: '0.01em'
                            }}
                          />
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}