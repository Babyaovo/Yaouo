import { useState } from 'react';

interface GalleryAppProps {
  appState: any;
  onUpdate: (updates: any) => void;
  onClose: () => void;
}

export function GalleryApp({ appState, onUpdate, onClose }: GalleryAppProps) {
  const [activeTab, setActiveTab] = useState<'wallpaper' | 'bubble' | 'icons' | 'names'>('wallpaper');
  const [customCSS, setCustomCSS] = useState('');
  const [editingApp, setEditingApp] = useState<string | null>(null);
  const [tempName, setTempName] = useState('');
  const [tempIcon, setTempIcon] = useState('');

  const handleWallpaperUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      onUpdate({ homeWallpaper: e.target?.result });
    };
    reader.readAsDataURL(file);
  };

  const applyBubbleCSS = () => {
    if (!customCSS.trim()) {
      alert('请输入CSS代码');
      return;
    }

    let styleEl = document.getElementById('custom-bubble-style');
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = 'custom-bubble-style';
      document.head.appendChild(styleEl);
    }
    styleEl.textContent = customCSS;
    
    alert('气泡样式已应用！');
  };

  const resetBubbleCSS = () => {
    const styleEl = document.getElementById('custom-bubble-style');
    if (styleEl) {
      styleEl.remove();
    }
    setCustomCSS('');
    alert('气泡样式已重置！');
  };

  const customizableApps = [
    { id: 'settings', defaultIcon: 'fas fa-cog', defaultName: '设置' },
    { id: 'contacts', defaultIcon: 'fas fa-address-book', defaultName: '联系人' },
    { id: 'chat-list', defaultIcon: 'fas fa-comments', defaultName: '聊天' },
    { id: 'gallery', defaultIcon: 'fas fa-palette', defaultName: '画廊' },
    { id: 'calendar', defaultIcon: 'fas fa-calendar', defaultName: '日历' },
    { id: 'notes', defaultIcon: 'fas fa-sticky-note', defaultName: '笔记' },
    { id: 'maps', defaultIcon: 'fas fa-map-marked-alt', defaultName: '地图' },
    { id: 'weather', defaultIcon: 'fas fa-cloud-sun', defaultName: '天气' },
  ];

  const handleIconUpload = (appId: string, file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      onUpdate({
        appIcons: {
          ...appState.appIcons,
          [appId]: result
        }
      });
    };
    reader.readAsDataURL(file);
  };

  const handleEditName = (appId: string) => {
    const currentName = appState.appNames?.[appId] || customizableApps.find(a => a.id === appId)?.defaultName || '';
    setEditingApp(appId);
    setTempName(currentName);
  };

  const handleSaveName = () => {
    if (editingApp && tempName.trim()) {
      onUpdate({
        appNames: {
          ...appState.appNames,
          [editingApp]: tempName.trim()
        }
      });
      setEditingApp(null);
      setTempName('');
    }
  };

  const handleResetIcon = (appId: string) => {
    const defaultApp = customizableApps.find(a => a.id === appId);
    if (!defaultApp) return;

    const newIcons = { ...appState.appIcons };
    delete newIcons[appId];
    onUpdate({ appIcons: newIcons });
  };

  const handleResetName = (appId: string) => {
    const newNames = { ...appState.appNames };
    delete newNames[appId];
    onUpdate({ appNames: newNames });
  };

  return (
    <div className="app-page">
      <div className="app-header">
        <button className="back-btn" onClick={onClose}>
          <i className="fas fa-chevron-left"></i>
        </button>
        <h1>画廊</h1>
        <div style={{ width: '40px' }}></div>
      </div>

      <div className="tab-bar">
        <button 
          className={`tab-item ${activeTab === 'wallpaper' ? 'active' : ''}`}
          onClick={() => setActiveTab('wallpaper')}
        >
          <i className="fas fa-image"></i>
          <span>壁纸</span>
        </button>
        <button 
          className={`tab-item ${activeTab === 'bubble' ? 'active' : ''}`}
          onClick={() => setActiveTab('bubble')}
        >
          <i className="fas fa-comment"></i>
          <span>气泡</span>
        </button>
        <button 
          className={`tab-item ${activeTab === 'icons' ? 'active' : ''}`}
          onClick={() => setActiveTab('icons')}
        >
          <i className="fas fa-th"></i>
          <span>图标</span>
        </button>
        <button 
          className={`tab-item ${activeTab === 'names' ? 'active' : ''}`}
          onClick={() => setActiveTab('names')}
        >
          <i className="fas fa-tag"></i>
          <span>名称</span>
        </button>
      </div>

      <div className="app-content">
        {activeTab === 'wallpaper' && (
          <div>
            <div className="section-title">
              <i className="fas fa-image"></i>
              主页面壁纸
            </div>
            <p className="section-desc">上传图片作为主页面背景壁纸</p>
            
            <div className="wallpaper-preview">
              {appState.homeWallpaper ? (
                <img src={appState.homeWallpaper} alt="壁纸预览" />
              ) : (
                <div className="empty-preview">
                  <i className="fas fa-image"></i>
                  <p>暂无壁纸</p>
                </div>
              )}
            </div>

            <input
              type="file"
              accept="image/*"
              onChange={(e) => e.target.files?.[0] && handleWallpaperUpload(e.target.files[0])}
              id="wallpaper-upload"
              style={{ display: 'none' }}
            />
            <button 
              className="primary-btn"
              onClick={() => document.getElementById('wallpaper-upload')?.click()}
            >
              <i className="fas fa-upload"></i>
              <span>上传壁纸</span>
            </button>

            {appState.homeWallpaper && (
              <button 
                className="secondary-btn"
                onClick={() => onUpdate({ homeWallpaper: '' })}
                style={{ marginTop: '12px' }}
              >
                <i className="fas fa-trash"></i>
                <span>移除壁纸</span>
              </button>
            )}
          </div>
        )}

        {activeTab === 'bubble' && (
          <div>
            <div className="section-title">
              <i className="fas fa-comment"></i>
              自定义气泡样式
            </div>
            <p className="section-desc">粘贴CSS代码自定义聊天气泡样式</p>
            
            <div className="css-example">
              <h3>CSS示例</h3>
              <pre>{`.message-bubble {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 18px;
  padding: 14px 18px;
}

.message.user .message-bubble {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}`}</pre>
            </div>

            <div className="form-group">
              <label>粘贴CSS代码</label>
              <textarea
                value={customCSS}
                onChange={(e) => setCustomCSS(e.target.value)}
                placeholder="粘贴你的CSS代码..."
                className="form-textarea css-textarea"
                rows={12}
              />
            </div>

            <div className="button-group">
              <button 
                className="primary-btn"
                onClick={applyBubbleCSS}
              >
                <i className="fas fa-check"></i>
                <span>应用样式</span>
              </button>
              <button 
                className="secondary-btn"
                onClick={resetBubbleCSS}
              >
                <i className="fas fa-undo"></i>
                <span>重置样式</span>
              </button>
            </div>
          </div>
        )}

        {activeTab === 'icons' && (
          <div>
            <div className="section-title">
              <i className="fas fa-th"></i>
              App图标自定义
            </div>
            <p className="section-desc">上传自定义图标替换默认图标（建议使用正方形图片）</p>
            
            <div className="app-list">
              {customizableApps.map(app => {
                const currentIcon = appState.appIcons?.[app.id];
                const isCustom = currentIcon && !currentIcon.startsWith('fas ');
                
                return (
                  <div key={app.id} className="app-item-row">
                    <div className="app-info">
                      <div className="app-icon-preview">
                        {isCustom ? (
                          <img src={currentIcon} alt={app.defaultName} />
                        ) : (
                          <i className={currentIcon || app.defaultIcon}></i>
                        )}
                      </div>
                      <span className="app-label">{app.defaultName}</span>
                    </div>
                    <div className="app-actions">
                      <input
                        type="file"
                        accept="image/*"
                        id={`icon-upload-${app.id}`}
                        style={{ display: 'none' }}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleIconUpload(app.id, file);
                        }}
                      />
                      <button
                        className="action-btn"
                        onClick={() => document.getElementById(`icon-upload-${app.id}`)?.click()}
                      >
                        <i className="fas fa-upload"></i>
                      </button>
                      {isCustom && (
                        <button
                          className="action-btn"
                          onClick={() => handleResetIcon(app.id)}
                        >
                          <i className="fas fa-undo"></i>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'names' && (
          <div>
            <div className="section-title">
              <i className="fas fa-tag"></i>
              App名称自定义
            </div>
            <p className="section-desc">自定义App显示名称</p>
            
            <div className="app-list">
              {customizableApps.map(app => {
                const currentName = appState.appNames?.[app.id] || app.defaultName;
                const isEditing = editingApp === app.id;
                
                return (
                  <div key={app.id} className="app-item-row">
                    <div className="app-info">
                      <div className="app-icon-preview">
                        {appState.appIcons?.[app.id] && !appState.appIcons[app.id].startsWith('fas ') ? (
                          <img src={appState.appIcons[app.id]} alt={app.defaultName} />
                        ) : (
                          <i className={appState.appIcons?.[app.id] || app.defaultIcon}></i>
                        )}
                      </div>
                      {isEditing ? (
                        <input
                          type="text"
                          className="name-input"
                          value={tempName}
                          onChange={(e) => setTempName(e.target.value)}
                          placeholder={app.defaultName}
                          autoFocus
                        />
                      ) : (
                        <span className="app-label">{currentName}</span>
                      )}
                    </div>
                    <div className="app-actions">
                      {isEditing ? (
                        <>
                          <button
                            className="action-btn save"
                            onClick={handleSaveName}
                          >
                            <i className="fas fa-check"></i>
                          </button>
                          <button
                            className="action-btn"
                            onClick={() => {
                              setEditingApp(null);
                              setTempName('');
                            }}
                          >
                            <i className="fas fa-times"></i>
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            className="action-btn"
                            onClick={() => handleEditName(app.id)}
                          >
                            <i className="fas fa-edit"></i>
                          </button>
                          {currentName !== app.defaultName && (
                            <button
                              className="action-btn"
                              onClick={() => handleResetName(app.id)}
                            >
                              <i className="fas fa-undo"></i>
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
