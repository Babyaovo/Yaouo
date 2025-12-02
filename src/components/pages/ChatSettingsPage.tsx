import { useState } from 'react';

interface ChatSettingsPageProps {
  appState: any;
  onUpdate: (updates: any) => void;
  onClose: () => void;
}

export function ChatSettingsPage({ appState, onUpdate, onClose }: ChatSettingsPageProps) {
  const chat = appState.chats?.find((c: any) => c.id === appState.currentChatId);
  const [currentSubPage, setCurrentSubPage] = useState<string | null>(null);

  if (!chat) {
    return (
      <div className="app-page">
        <div className="app-header">
          <button className="back-btn" onClick={onClose}>
            <i className="fas fa-chevron-left"></i>
          </button>
          <h1>聊天设置</h1>
          <div style={{ width: '40px' }}></div>
        </div>
      </div>
    );
  }

  // 如果在子页面中，渲染对应的子页面
  if (currentSubPage === 'conversation') {
    return <ConversationSettingsPage chat={chat} appState={appState} onUpdate={onUpdate} onBack={() => setCurrentSubPage(null)} onClose={onClose} />;
  }
  if (currentSubPage === 'memory') {
    return <MemorySettingsPage chat={chat} appState={appState} onUpdate={onUpdate} onBack={() => setCurrentSubPage(null)} onClose={onClose} />;
  }
  if (currentSubPage === 'appearance') {
    return <AppearanceSettingsPage chat={chat} appState={appState} onUpdate={onUpdate} onBack={() => setCurrentSubPage(null)} onClose={onClose} />;
  }

  // 主设置页面 - 显示分类入口
  return (
    <div className="app-page">
      <div className="app-header">
        <button className="back-btn" onClick={onClose}>
          <i className="fas fa-chevron-left"></i>
        </button>
        <h1>聊天设置</h1>
        <div style={{ width: '40px' }}></div>
      </div>

      <div className="app-content">
        <div className="settings-menu-list">
          <div className="settings-menu-item" onClick={() => setCurrentSubPage('conversation')}>
            <div className="menu-item-icon">
              <i className="fas fa-comments"></i>
            </div>
            <div className="menu-item-content">
              <div className="menu-item-title">对话设置</div>
              <div className="menu-item-subtitle">上下文轮数、温度等</div>
            </div>
            <i className="fas fa-chevron-right menu-item-arrow"></i>
          </div>

          <div className="settings-menu-item" onClick={() => setCurrentSubPage('memory')}>
            <div className="menu-item-icon">
              <i className="fas fa-lightbulb"></i>
            </div>
            <div className="menu-item-content">
              <div className="menu-item-title">核心记忆</div>
              <div className="menu-item-subtitle">自动总结、记忆管理</div>
            </div>
            <i className="fas fa-chevron-right menu-item-arrow"></i>
          </div>

          <div className="settings-menu-item" onClick={() => setCurrentSubPage('appearance')}>
            <div className="menu-item-icon">
              <i className="fas fa-palette"></i>
            </div>
            <div className="menu-item-content">
              <div className="menu-item-title">外观设置</div>
              <div className="menu-item-subtitle">壁纸、头像显示</div>
            </div>
            <i className="fas fa-chevron-right menu-item-arrow"></i>
          </div>
        </div>
      </div>
    </div>
  );
}

// 对话设置子页面
function ConversationSettingsPage({ chat, appState, onUpdate, onBack, onClose }: any) {
  const [contextRounds, setContextRounds] = useState(chat?.settings?.contextRounds || 10);
  const [temperature, setTemperature] = useState(chat?.settings?.temperature || 0.8);
  const [chatMode, setChatMode] = useState(chat?.settings?.chatMode || 'message');

  const saveSettings = () => {
    const updatedChats = appState.chats.map((c: any) => 
      c.id === chat.id ? { 
        ...c, 
        settings: {
          ...c.settings,
          contextRounds,
          temperature,
          chatMode
        }
      } : c
    );
    onUpdate({ chats: updatedChats });
    onBack();
  };

  return (
    <div className="app-page">
      <div className="app-header">
        <button className="back-btn" onClick={onBack}>
          <i className="fas fa-chevron-left"></i>
        </button>
        <h1>对话设置</h1>
        <button className="save-btn" onClick={saveSettings}>
          <i className="fas fa-check"></i>
        </button>
      </div>

      <div className="app-content">
        {/* 聊天模式切换 */}
        <div className="settings-section">
          <div className="section-title">聊天模式</div>
          
          <div className="chat-mode-selector">
            <div 
              className={`mode-option ${chatMode === 'message' ? 'active' : ''}`}
              onClick={() => setChatMode('message')}
            >
              <div className="mode-icon">
                <i className="fas fa-comment-dots"></i>
              </div>
              <div className="mode-info">
                <div className="mode-title">讯息模式</div>
                <div className="mode-desc">手机DM风格，纯文本对话</div>
              </div>
              {chatMode === 'message' && (
                <i className="fas fa-check-circle mode-check"></i>
              )}
            </div>

            <div 
              className={`mode-option ${chatMode === 'immersion' ? 'active' : ''}`}
              onClick={() => setChatMode('immersion')}
            >
              <div className="mode-icon">
                <i className="fas fa-theater-masks"></i>
              </div>
              <div className="mode-info">
                <div className="mode-title">沉浸模式</div>
                <div className="mode-desc">角色扮演，动作心理描写</div>
              </div>
              {chatMode === 'immersion' && (
                <i className="fas fa-check-circle mode-check"></i>
              )}
            </div>
          </div>
        </div>

        <div className="settings-section">
          <div className="settings-item">
            <label>
              上下文记忆轮数
              <span className="settings-value">{contextRounds} 轮</span>
            </label>
            <input
              type="range"
              min="1"
              max="500"
              value={contextRounds}
              onChange={(e) => setContextRounds(Number(e.target.value))}
              className="slider"
            />
            <div className="slider-hint">仅记住最近 {contextRounds} 轮对话</div>
          </div>

          <div className="settings-item">
            <label>
              模型温度
              <span className="settings-value">{temperature.toFixed(2)}</span>
            </label>
            <input
              type="range"
              min="0"
              max="2"
              step="0.1"
              value={temperature}
              onChange={(e) => setTemperature(Number(e.target.value))}
              className="slider"
            />
            <div className="slider-hint">
              {temperature < 0.5 ? '严谨' : temperature < 1.0 ? '平衡' : temperature < 1.5 ? '创造' : '随机'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 核心记忆设置子页面
function MemorySettingsPage({ chat, appState, onUpdate, onBack, onClose }: any) {
  const [coreMemory, setCoreMemory] = useState(chat?.settings?.coreMemory || '');
  const [memoryInterval, setMemoryInterval] = useState(chat?.settings?.memoryInterval || 10);
  const [isSummarizing, setIsSummarizing] = useState(false);

  const saveSettings = () => {
    const updatedChats = appState.chats.map((c: any) => 
      c.id === chat.id ? { 
        ...c, 
        settings: {
          ...c.settings,
          coreMemory,
          memoryInterval
        }
      } : c
    );
    onUpdate({ chats: updatedChats });
    onBack();
  };

  const summarizeCoreMemory = async () => {
    if (!chat?.messages || chat.messages.length === 0) {
      alert('没有对话记录可供总结');
      return;
    }

    if (!appState.apiSettings?.apiUrl || !appState.apiSettings?.apiKey) {
      alert('请先配置API');
      return;
    }

    setIsSummarizing(true);

    try {
      const recentMessages = chat.messages.slice(-memoryInterval * 2);
      
      const conversationText = recentMessages
        .map((m: any) => `${m.role === 'user' ? '用户' : 'AI'}：${m.content}`)
        .join('\n');

      const summaryPrompt = `你现在将作为一个核心记忆分析模块，通过分析列表中的对话和自己的原始核心记忆，来扩充或修改现有的核心记忆。

请严格遵守：
1. 保留原始核心记忆，除非你认为对其进行简化后不影响信息量或某些原始核心记忆需要更新（例如：约定的时间已经过去，或者用户改变了约定，则更改原始核心记忆中相关的约定记忆）
2. 将生成内容添加在原始核心记忆（或者被你进行过调整的原始核心记忆）的后面
3. 若你认为当前上下文并不需要生成新的核心记忆，保留原始核心记忆即可
4. 若没有信息表明原始核心记忆需要修改/删除，请务必保留原始核心记忆，并紧接其后面生成新的记忆内容

生成内容要求：
1. 严格控制字数在50-100字内，尽可能精简
2. 仅保留对未来对话至关重要的信息
3. 按优先级提取：用户个人信息 > 用户偏好/喜好 > 重要约定 > 特殊事件 > 常去地点
4. 使用第一人称视角撰写，仿佛是你自己在记录对话记忆
5. 使用极简句式，省略不必要的修饰词，禁止使用颜文字和括号描述动作
6. 不保留日期、时间等临时性信息，除非是周期性的重要约定
7. 信息应当是从你的角度了解到的用户信息
8. 格式为简洁的要点，可用分号分隔不同信息

原始核心记忆：
${coreMemory || '（无）'}

最近的对话内容：
${conversationText}

仅返回你扩充/修改后的核心记忆内容，不要包含任何解释。`;

      const response = await fetch(`${appState.apiSettings.apiUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${appState.apiSettings.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: appState.apiSettings.selectedModel,
          messages: [
            { role: 'system', content: summaryPrompt }
          ],
          temperature: 0.3
        })
      });

      if (!response.ok) {
        throw new Error('总结失败');
      }

      const data = await response.json();
      const newMemory = data.choices[0]?.message?.content || '';
      
      setCoreMemory(newMemory);
      alert('核心记忆已更新！');
    } catch (error) {
      console.error(error);
      alert('总结失败，请检查API设置');
    } finally {
      setIsSummarizing(false);
    }
  };

  return (
    <div className="app-page">
      <div className="app-header">
        <button className="back-btn" onClick={onBack}>
          <i className="fas fa-chevron-left"></i>
        </button>
        <h1>核心记忆</h1>
        <button className="save-btn" onClick={saveSettings}>
          <i className="fas fa-check"></i>
        </button>
      </div>

      <div className="app-content">
        <div className="settings-section">
          <div className="settings-item">
            <label>
              自动总结间隔
              <span className="settings-value">每 {memoryInterval} 轮</span>
            </label>
            <input
              type="range"
              min="5"
              max="50"
              step="5"
              value={memoryInterval}
              onChange={(e) => setMemoryInterval(Number(e.target.value))}
              className="slider"
            />
            <div className="slider-hint">每 {memoryInterval} 轮对话自动总结核心记忆</div>
          </div>

          <div className="settings-item">
            <label>核心记忆内容</label>
            <textarea
              value={coreMemory}
              onChange={(e) => setCoreMemory(e.target.value)}
              placeholder="AI会始终记住的关键信息..."
              className="form-textarea"
              rows={6}
            />
            <div className="slider-hint">此内容会在每次对话中作为系统提示</div>
          </div>

          <button 
            className="primary-btn"
            onClick={summarizeCoreMemory}
            disabled={isSummarizing}
          >
            {isSummarizing ? (
              <>
                <i className="fas fa-spinner fa-spin"></i>
                <span>总结中...</span>
              </>
            ) : (
              <>
                <i className="fas fa-lightbulb"></i>
                <span>立即总结核心记忆</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// 外观设置子页面
function AppearanceSettingsPage({ chat, appState, onUpdate, onBack, onClose }: any) {
  const [showAIAvatar, setShowAIAvatar] = useState(chat?.settings?.showAIAvatar !== false);
  const [showUserAvatar, setShowUserAvatar] = useState(chat?.settings?.showUserAvatar !== false);
  const [showHeaderAvatar, setShowHeaderAvatar] = useState(chat?.settings?.showHeaderAvatar !== false);
  
  // 文字颜色设置
  const [dialogColor, setDialogColor] = useState(chat?.settings?.dialogColor || '#ffffff');
  const [translationColor, setTranslationColor] = useState(chat?.settings?.translationColor || '#a0a0a0');
  const [actionColor, setActionColor] = useState(chat?.settings?.actionColor || '#d0d0d0');

  const saveColorSettings = () => {
    const updatedChats = appState.chats.map((c: any) => 
      c.id === chat.id ? { 
        ...c, 
        settings: {
          ...c.settings,
          dialogColor,
          translationColor,
          actionColor
        }
      } : c
    );
    onUpdate({ chats: updatedChats });
    alert('颜色设置已保存！');
  };

  const handleWallpaperUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const updatedChats = appState.chats.map((c: any) => 
        c.id === chat.id ? { ...c, wallpaper: event.target?.result as string } : c
      );
      onUpdate({ chats: updatedChats });
    };
    reader.readAsDataURL(file);
  };

  const removeWallpaper = () => {
    const updatedChats = appState.chats.map((c: any) => 
      c.id === chat.id ? { ...c, wallpaper: '' } : c
    );
    onUpdate({ chats: updatedChats });
  };

  const toggleAIAvatar = () => {
    const newValue = !showAIAvatar;
    setShowAIAvatar(newValue);
    const updatedChats = appState.chats.map((c: any) => 
      c.id === chat.id ? { 
        ...c, 
        settings: { ...c.settings, showAIAvatar: newValue }
      } : c
    );
    onUpdate({ chats: updatedChats });
  };

  const toggleUserAvatar = () => {
    const newValue = !showUserAvatar;
    setShowUserAvatar(newValue);
    const updatedChats = appState.chats.map((c: any) => 
      c.id === chat.id ? { 
        ...c, 
        settings: { ...c.settings, showUserAvatar: newValue }
      } : c
    );
    onUpdate({ chats: updatedChats });
  };

  const toggleHeaderAvatar = () => {
    const newValue = !showHeaderAvatar;
    setShowHeaderAvatar(newValue);
    const updatedChats = appState.chats.map((c: any) => 
      c.id === chat.id ? { 
        ...c, 
        settings: { ...c.settings, showHeaderAvatar: newValue }
      } : c
    );
    onUpdate({ chats: updatedChats });
  };

  return (
    <div className="app-page">
      <div className="app-header">
        <button className="back-btn" onClick={onBack}>
          <i className="fas fa-chevron-left"></i>
        </button>
        <h1>外观设置</h1>
        <div style={{ width: '40px' }}></div>
      </div>

      <div className="app-content">
        {/* 聊天壁纸 */}
        <div className="settings-section">
          <div className="section-title">聊天壁纸</div>
          
          <div className="settings-item">
            {chat.wallpaper && (
              <div className="wallpaper-preview">
                <img src={chat.wallpaper} alt="壁纸预览" />
              </div>
            )}
            
            <input
              type="file"
              accept="image/*"
              onChange={handleWallpaperUpload}
              id={`wallpaper-upload-${chat.id}`}
              className="hidden-file-input"
            />
            
            <button 
              className="secondary-btn"
              onClick={() => document.getElementById(`wallpaper-upload-${chat.id}`)?.click()}
            >
              <i className="fas fa-image"></i>
              <span>{chat.wallpaper ? '更换壁纸' : '选择壁纸'}</span>
            </button>
            
            {chat.wallpaper && (
              <button 
                className="secondary-btn"
                onClick={removeWallpaper}
                style={{ marginTop: '12px' }}
              >
                <i className="fas fa-trash"></i>
                <span>移除壁纸</span>
              </button>
            )}
          </div>
        </div>

        {/* 头像显示设置 - 照抄日夜间模式切换样式 */}
        <div className="settings-section">
          <div className="section-title">头像显示</div>
          
          <div className="avatar-toggle-item">
            <span>显示AI头像</span>
            <div className={`avatar-toggle ${showAIAvatar ? 'on' : 'off'}`} onClick={toggleAIAvatar}>
              <div className="avatar-toggle-slider"></div>
            </div>
          </div>

          <div className="avatar-toggle-item">
            <span>显示用户头像</span>
            <div className={`avatar-toggle ${showUserAvatar ? 'on' : 'off'}`} onClick={toggleUserAvatar}>
              <div className="avatar-toggle-slider"></div>
            </div>
          </div>

          <div className="avatar-toggle-item">
            <span>顶栏显示头像</span>
            <div className={`avatar-toggle ${showHeaderAvatar ? 'on' : 'off'}`} onClick={toggleHeaderAvatar}>
              <div className="avatar-toggle-slider"></div>
            </div>
          </div>
        </div>

        {/* 文字颜色设置 */}
        <div className="settings-section">
          <div className="section-title">文字颜色</div>
          
          <div className="color-settings-item">
            <label>对话文字颜色</label>
            <input
              type="color"
              value={dialogColor}
              onChange={(e) => setDialogColor(e.target.value)}
              className="color-input"
            />
          </div>

          <div className="color-settings-item">
            <label>翻译文字颜色</label>
            <input
              type="color"
              value={translationColor}
              onChange={(e) => setTranslationColor(e.target.value)}
              className="color-input"
            />
          </div>

          <div className="color-settings-item">
            <label>动作文字颜色</label>
            <input
              type="color"
              value={actionColor}
              onChange={(e) => setActionColor(e.target.value)}
              className="color-input"
            />
          </div>

          <button 
            className="primary-btn"
            onClick={saveColorSettings}
            style={{ marginTop: '16px' }}
          >
            <i className="fas fa-check"></i>
            <span>保存颜色设置</span>
          </button>
        </div>
      </div>
    </div>
  );
}