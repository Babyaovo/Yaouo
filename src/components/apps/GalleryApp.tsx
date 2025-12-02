import { useState } from 'react';

interface GalleryAppProps {
  appState: any;
  onUpdate: (updates: any) => void;
  onClose: () => void;
}

export function GalleryApp({ appState, onUpdate, onClose }: GalleryAppProps) {
  const [activeTab, setActiveTab] = useState<'wallpaper' | 'bubble' | 'icons' | 'names'>('wallpaper');
  const [customCSS, setCustomCSS] = useState('');

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

    // 创建或更新style标签
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

  return (
    <div className="app-page gallery-app">
      <div className="app-header">
        <button className="back-btn" onClick={onClose}>
          <i className="fas fa-chevron-left"></i>
        </button>
        <h1>画廊</h1>
        <div style={{ width: '40px' }}></div>
      </div>

      <div className="gallery-tabs">
        <button 
          className={`gallery-tab ${activeTab === 'wallpaper' ? 'active' : ''}`}
          onClick={() => setActiveTab('wallpaper')}
        >
          <i className="fas fa-image"></i>
          <span>壁纸</span>
        </button>
        <button 
          className={`gallery-tab ${activeTab === 'bubble' ? 'active' : ''}`}
          onClick={() => setActiveTab('bubble')}
        >
          <i className="fas fa-comment"></i>
          <span>气泡</span>
        </button>
        <button 
          className={`gallery-tab ${activeTab === 'icons' ? 'active' : ''}`}
          onClick={() => setActiveTab('icons')}
        >
          <i className="fas fa-th"></i>
          <span>图标</span>
        </button>
        <button 
          className={`gallery-tab ${activeTab === 'names' ? 'active' : ''}`}
          onClick={() => setActiveTab('names')}
        >
          <i className="fas fa-tag"></i>
          <span>名称</span>
        </button>
      </div>

      <div className="app-content">
        {activeTab === 'wallpaper' && (
          <div className="gallery-section">
            <h2 className="section-title">
              <i className="fas fa-image"></i>
              主页面壁纸
            </h2>
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
              >
                <i className="fas fa-trash"></i>
                <span>移除壁纸</span>
              </button>
            )}
          </div>
        )}

        {activeTab === 'bubble' && (
          <div className="gallery-section">
            <h2 className="section-title">
              <i className="fas fa-comment"></i>
              自定义气泡样式
            </h2>
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
          <div className="gallery-section">
            <h2 className="section-title">
              <i className="fas fa-th"></i>
              App图标自定义
            </h2>
            <p className="section-desc coming-soon">功能开发中，敬请期待...</p>
            <div className="coming-soon-placeholder">
              <i className="fas fa-hammer"></i>
              <p>即将推出</p>
            </div>
          </div>
        )}

        {activeTab === 'names' && (
          <div className="gallery-section">
            <h2 className="section-title">
              <i className="fas fa-tag"></i>
              App名称自定义
            </h2>
            <p className="section-desc coming-soon">功能开发中，敬请期待...</p>
            <div className="coming-soon-placeholder">
              <i className="fas fa-hammer"></i>
              <p>即将推出</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
