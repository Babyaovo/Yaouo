import { useState } from 'react';

interface ChatSettingsPageProps {
  appState: any;
  onUpdate: (updates: any) => void;
  onClose: () => void;
  chatId?: string; // 添加chatId prop
}

export function ChatSettingsPage({ appState, onUpdate, onClose, chatId }: ChatSettingsPageProps) {
  // 优先使用传入的chatId，如果没有则使用appState.currentChatId
  const activeChatId = chatId || appState.currentChatId;
  const chat = appState.chats?.find((c: any) => c.id === activeChatId);
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
    return <MemoryHubPage chat={chat} appState={appState} onUpdate={onUpdate} onBack={() => setCurrentSubPage(null)} onNavigate={(page: string) => setCurrentSubPage(page)} onClose={onClose} />;
  }
  if (currentSubPage === 'coreMemory') {
    return <MemorySettingsPage chat={chat} appState={appState} onUpdate={onUpdate} onBack={() => setCurrentSubPage('memory')} onNavigate={(page: string) => setCurrentSubPage(page)} onClose={onClose} />;
  }
  if (currentSubPage === 'appearance') {
    return <AppearanceSettingsPage chat={chat} appState={appState} onUpdate={onUpdate} onBack={() => setCurrentSubPage(null)} onClose={onClose} />;
  }
  if (currentSubPage === 'promptManager') {
    return <PromptManagerPage chat={chat} appState={appState} onUpdate={onUpdate} onBack={() => setCurrentSubPage('coreMemory')} onNavigate={(page: string) => setCurrentSubPage(page)} onClose={onClose} />;
  }
  if (currentSubPage?.startsWith('promptEditor:')) {
    const templateId = currentSubPage.split(':')[1];
    return <PromptEditorPage templateId={templateId} chat={chat} appState={appState} onUpdate={onUpdate} onBack={() => setCurrentSubPage('promptManager')} onClose={onClose} />;
  }

  if (currentSubPage === 'recentMemory') {
    return <RecentMemorySettingsPage chat={chat} appState={appState} onUpdate={onUpdate} onBack={() => setCurrentSubPage('memory')} onClose={onClose} />;
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
              <i className="fas fa-book"></i>
            </div>
            <div className="menu-item-content">
              <div className="menu-item-title">记忆与记事本</div>
              <div className="menu-item-subtitle">核心记忆、近期约定与记事记录</div>
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
                <div className="mode-desc">模拟IM纯文本对话</div>
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
                <i className="fas fa-wand-magic-sparkles"></i>
              </div>
              <div className="mode-info">
                <div className="mode-title">自由模式</div>
                <div className="mode-desc">电影化叙事与角色扮演</div>
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

        {/* 清空聊天记录 */}
        <div className="settings-section danger-zone" style={{ marginTop: '20px' }}>
          <div className="settings-group">
            <button 
              className="clear-chat-btn"
              onClick={() => {
                if (window.confirm('确定要清空所有聊天记录吗？此操作不可恢复。')) {
                  const updatedChats = appState.chats.map((c: any) =>
                    c.id === chat.id ? { ...c, messages: [], lastMessage: '', lastTime: Date.now() } : c
                  );
                  onUpdate({ chats: updatedChats });
                }
              }}
            >
              <i className="fas fa-trash-alt"></i>
              清空聊天记录
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// 记忆管理中心 (Memory Hub)
function MemoryHubPage({ chat, appState, onUpdate, onBack, onNavigate, onClose }: any) {
  return (
    <div className="app-page">
      <div className="app-header">
        <button className="back-btn" onClick={onBack}>
          <i className="fas fa-chevron-left"></i>
        </button>
        <h1>记忆管理</h1>
        <div style={{ width: '40px' }}></div>
      </div>

      <div className="app-content">
        <div className="settings-menu-list">
          <div className="settings-menu-item" onClick={() => onNavigate('coreMemory')}>
            <div className="menu-item-icon" style={{ background: 'rgba(255,255,255,0.05)' }}>
              <i className="fas fa-key"></i>
            </div>
            <div className="menu-item-content">
              <div className="menu-item-title">核心记忆</div>
              <div className="menu-item-subtitle">AI 始终记住的底层设定与关键信息</div>
            </div>
            <i className="fas fa-chevron-right menu-item-arrow"></i>
          </div>

          <div className="settings-menu-item" onClick={() => onNavigate('recentMemory')}>
            <div className="menu-item-icon" style={{ background: 'rgba(255,255,255,0.05)' }}>
              <i className="fas fa-book-open"></i>
            </div>
            <div className="menu-item-content">
              <div className="menu-item-title">记事本</div>
              <div className="menu-item-subtitle">对话中产生的短期记录、约定与存档</div>
            </div>
            <i className="fas fa-chevron-right menu-item-arrow"></i>
          </div>
        </div>
      </div>
    </div>
  );
}

// 核心记忆设置子页面
function MemorySettingsPage({ chat, appState, onUpdate, onBack, onNavigate, onClose }: any) {
  const [coreMemory, setCoreMemory] = useState(chat?.settings?.coreMemory || '');
  const [memoryInterval, setMemoryInterval] = useState(chat?.settings?.memoryInterval || 10);
  const [isSummarizing, setIsSummarizing] = useState(false);

  // 获取当前选中的提示词方案
  const promptTemplates = appState.promptTemplates || [
    {
      id: 'default',
      name: '默认方案',
      content: `你现在将作为一个核心记忆分析模块，通过分析列表中的对话和自己的原始核心记忆，来扩充或修改现有的核心记忆。

请严格遵守：
1. 保留原始核心记忆，除非你认为对其进行简化后不影响信息量或某些原始核心记忆需要更新
2. 将生成内容添加在原始核心记忆的后面
3. 若你认为当前上下文并不需要生成新的核心记忆，保留原始核心记忆即可
4. 若没有信息表明原始核心记忆需要修改/删除，请务必保留原始核心记忆，并紧接其后面生成新的记忆内容

生成内容要求：
1. 严格控制字数在50-100字内，尽可能精简
2. 仅保留对未来对话至关重要的信息
3. 按优先级提取：用户个人信息 > 用户偏好/喜好 > 重要约定 > 特殊事件 > 常去地点
4. 使用第一人称视角撰写，仿佛是你自己在记录对话记忆
5. 使用极简句式，省略不必要的修饰词
6. 不保留日期、时间等临时性信息，除非是周期性的重要约定
7. 信息应当是从你的角度了解到的用户信息
8. 格式为简洁的要点，可用分号分隔不同信息

原始核心记忆：
{coreMemory}

最近的对话内容：
{conversationText}

仅返回你扩充/修改后的核心记忆内容，不要包含任何解释。`
    }
  ];
  
  const selectedTemplateId = chat?.settings?.selectedPromptTemplate || 'default';
  const selectedTemplate = promptTemplates.find((t: any) => t.id === selectedTemplateId);

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

  const clearCoreMemory = () => {
    if (window.confirm('确定要清除所有核心记忆吗？此操作不可恢复。')) {
      setCoreMemory('');
      const updatedChats = appState.chats.map((c: any) => 
        c.id === chat.id ? { 
          ...c, 
          settings: {
            ...c.settings,
            coreMemory: ''
          }
        } : c
      );
      onUpdate({ chats: updatedChats });
    }
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

    if (!selectedTemplate?.content) {
      alert('请先选择总结提示词方案');
      return;
    }

    setIsSummarizing(true);

    try {
      const recentMessages = chat.messages.slice(-memoryInterval * 2);
      
      const conversationText = recentMessages
        .map((m: any) => `${m.role === 'user' ? '用户' : 'AI'}：${m.content}`)
        .join('\n');

      // 使用选中方案的提示词，替换变量
      const finalPrompt = selectedTemplate.content
        .replace('{coreMemory}', coreMemory || '（无）')
        .replace('{conversationText}', conversationText);

      const response = await fetch(`${appState.apiSettings.apiUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${appState.apiSettings.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: appState.apiSettings.selectedModel,
          messages: [
            { role: 'system', content: finalPrompt }
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
          {/* 自动总结间隔 */}
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

          {/* 总结提示词方案 - 跳转入口 */}
          <div className="settings-menu-item" onClick={() => onNavigate('promptManager')}>
            <div className="menu-item-icon">
              <i className="fas fa-file-alt"></i>
            </div>
            <div className="menu-item-content">
              <div className="menu-item-title">总结提示词方案</div>
              <div className="menu-item-subtitle">
                当前：{selectedTemplate?.name || '未选择'}
              </div>
            </div>
            <i className="fas fa-chevron-right menu-item-arrow"></i>
          </div>

          {/* 核心记忆内容 */}
          <div className="settings-item">
            <label>核心记忆内容</label>
            <textarea
              value={coreMemory}
              onChange={(e) => setCoreMemory(e.target.value)}
              placeholder="AI会始终记住的关键信息..."
              className="form-textarea"
              rows={8}
            />
            <div className="slider-hint">此内容会在每次对话中作为系统提示</div>
          </div>

          {/* 操作按钮 */}
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

          <button 
            className="danger-btn"
            onClick={clearCoreMemory}
          >
            <i className="fas fa-trash-alt"></i>
            <span>清除核心记忆</span>
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
  const [headerDisplayMode, setHeaderDisplayMode] = useState<'avatar' | 'name' | 'both'>(
    chat?.settings?.headerDisplayMode || 'both'
  );
  // 消息头像设置
  const [avatarSize, setAvatarSize] = useState(chat?.settings?.avatarSize || 28); // 默认28px，范围20-60
  const [avatarBorderRadius, setAvatarBorderRadius] = useState(
    chat?.settings?.avatarBorderRadius !== undefined ? chat?.settings?.avatarBorderRadius : 50
  ); // 默认50%，范围0-50

  // 获取联系人信息用于预览
  const contact = appState.contacts?.find((c: any) => c.id === chat?.contactId);

  const handleAvatarSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSize = parseInt(e.target.value);
    setAvatarSize(newSize);
    const updatedChats = appState.chats.map((c: any) => 
      c.id === chat.id ? { 
        ...c, 
        settings: { ...c.settings, avatarSize: newSize }
      } : c
    );
    onUpdate({ chats: updatedChats });
  };

  const handleBorderRadiusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newRadius = parseInt(e.target.value);
    setAvatarBorderRadius(newRadius);
    const updatedChats = appState.chats.map((c: any) => 
      c.id === chat.id ? { 
        ...c, 
        settings: { ...c.settings, avatarBorderRadius: newRadius }
      } : c
    );
    onUpdate({ chats: updatedChats });
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

  const changeHeaderDisplayMode = (mode: 'avatar' | 'name' | 'both') => {
    setHeaderDisplayMode(mode);
    const updatedChats = appState.chats.map((c: any) => 
      c.id === chat.id ? { 
        ...c, 
        settings: { ...c.settings, headerDisplayMode: mode }
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

          <div className="avatar-toggle-item" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
            <span style={{ marginBottom: '12px' }}>顶栏显示模式</span>
            <div className="header-display-options">
              <button 
                className={`header-display-btn ${headerDisplayMode === 'avatar' ? 'active' : ''}`}
                onClick={() => changeHeaderDisplayMode('avatar')}
              >
                <i className="fas fa-user-circle"></i>
                <span>仅头像</span>
              </button>
              <button 
                className={`header-display-btn ${headerDisplayMode === 'name' ? 'active' : ''}`}
                onClick={() => changeHeaderDisplayMode('name')}
              >
                <i className="fas fa-font"></i>
                <span>仅备注</span>
              </button>
              <button 
                className={`header-display-btn ${headerDisplayMode === 'both' ? 'active' : ''}`}
                onClick={() => changeHeaderDisplayMode('both')}
              >
                <i className="fas fa-check-double"></i>
                <span>两者</span>
              </button>
            </div>
          </div>

          <div className="avatar-toggle-item" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
            <span style={{ marginBottom: '12px' }}>头像大小</span>
            <div className="header-display-options">
              <input
                type="range"
                min="20"
                max="60"
                value={avatarSize}
                onChange={handleAvatarSizeChange}
                className="slider"
              />
              <div className="slider-hint">当前大小：{avatarSize}px</div>
            </div>
          </div>

          <div className="avatar-toggle-item" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
            <span style={{ marginBottom: '12px' }}>头像圆角</span>
            <div className="header-display-options">
              <input
                type="range"
                min="0"
                max="50"
                value={avatarBorderRadius}
                onChange={handleBorderRadiusChange}
                className="slider"
              />
              <div className="slider-hint">当前圆角：{avatarBorderRadius}%</div>
            </div>
          </div>

          {/* 头像预览区 */}
          <div className="avatar-toggle-item" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
            <span style={{ marginBottom: '12px' }}>预览效果</span>
            <div className="avatar-preview-container">
              {/* 消息头像预览 */}
              <div className="avatar-preview-section">
                <div className="avatar-preview-section-title">消息头像</div>
                <div className="avatar-preview-row">
                  <div className="avatar-preview-item">
                    <div className="avatar-preview-label">AI</div>
                    <div 
                      className="avatar-preview-avatar"
                      style={{
                        width: `${avatarSize}px`,
                        height: `${avatarSize}px`,
                        borderRadius: avatarBorderRadius === 50 ? '50%' : `${avatarBorderRadius}%`,
                        overflow: 'hidden',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#f0f0f0',
                        border: '1px solid #e0e0e0'
                      }}
                    >
                      {contact?.charAvatar ? (
                        <img 
                          src={contact.charAvatar} 
                          alt="AI" 
                          style={{ 
                            width: '100%', 
                            height: '100%', 
                            objectFit: 'cover' 
                          }} 
                        />
                      ) : (
                        <i className="fas fa-robot" style={{ fontSize: `${avatarSize * 0.5}px`, color: '#999' }}></i>
                      )}
                    </div>
                  </div>

                  <div className="avatar-preview-item">
                    <div className="avatar-preview-label">用户</div>
                    <div 
                      className="avatar-preview-avatar"
                      style={{
                        width: `${avatarSize}px`,
                        height: `${avatarSize}px`,
                        borderRadius: avatarBorderRadius === 50 ? '50%' : `${avatarBorderRadius}%`,
                        overflow: 'hidden',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#f0f0f0',
                        border: '1px solid #e0e0e0'
                      }}
                    >
                      {contact?.userAvatar ? (
                        <img 
                          src={contact.userAvatar} 
                          alt="User" 
                          style={{ 
                            width: '100%', 
                            height: '100%', 
                            objectFit: 'cover' 
                          }} 
                        />
                      ) : (
                        <i className="fas fa-user" style={{ fontSize: `${avatarSize * 0.5}px`, color: '#999' }}></i>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 提示词方案管理子页面
function PromptManagerPage({ chat, appState, onUpdate, onBack, onNavigate, onClose }: any) {
  const [promptTemplates, setPromptTemplates] = useState<any[]>(
    appState.promptTemplates || [
      {
        id: 'default',
        name: '默认方案',
        content: `你现在将作为一个核心记忆分析模块，通过分析列表中的对话和自己的原始核心记忆，来扩充或修改现有的核心记忆。

请严格遵守：
1. 保留原始核心记忆，除非你认为对其进行简化后不影响信息量或某些原始核心记忆需要更新
2. 将生成内容添加在原始核心记忆的后面
3. 若你认为当前上下文并不需要生成新的核心记忆，保留原始核心记忆即可
4. 若没有信息表明原始核心记忆需要修改/删除，请务必保留原始核心记忆，并紧接其后面生成新的记忆内容

生成内容要求：
1. 严格控制字数在50-100字内，尽可能精简
2. 仅保留对未来对话至关重要的信息
3. 按优先级提取：用户个人信息 > 用户偏好/喜好 > 重要约定 > 特殊事件 > 常去地点
4. 使用第一人称视角撰写，仿佛是你自己在记录对话记忆
5. 使用极简句式，省略不必要的修饰词
6. 不保留日期、时间等临时性信息，除非是周期性的重要约定
7. 信息应当是从你的角度了解到的用户���息
8. ����为简洁的要点，可用分号分隔不同信息

原始核心记忆：
{coreMemory}

最近的对话内容：
{conversationText}

仅返回你扩充/修改后的核心记忆内容，不要包含任何解释。`
      }
    ]
  );
  const [selectedTemplateId, setSelectedTemplateId] = useState(chat?.settings?.selectedPromptTemplate || 'default');
  const [editingTemplate, setEditingTemplate] = useState<any>(null);

  const saveSettings = () => {
    const updatedChats = appState.chats.map((c: any) => 
      c.id === chat.id ? { 
        ...c, 
        settings: {
          ...c.settings,
          selectedPromptTemplate: selectedTemplateId
        }
      } : c
    );
    onUpdate({ 
      chats: updatedChats,
      promptTemplates: promptTemplates
    });
    onBack();
  };

  const addNewTemplate = () => {
    const newTemplate = {
      id: `template-${Date.now()}`,
      name: '新方案',
      content: ''
    };
    const updatedTemplates = [...promptTemplates, newTemplate];
    setPromptTemplates(updatedTemplates);
    
    // 立即保存到appState
    onUpdate({ promptTemplates: updatedTemplates });
    
    // 跳转到编辑页面
    onNavigate(`promptEditor:${newTemplate.id}`);
  };

  const saveTemplate = (template: any) => {
    const updatedTemplates = promptTemplates.map(t => 
      t.id === template.id ? template : t
    );
    setPromptTemplates(updatedTemplates);
    setEditingTemplate(null);
    
    // 如果编辑的是当前选中的模板，更新summaryPrompt
    if (template.id === selectedTemplateId) {
      setSummaryPrompt(template.content);
    }
  };

  const deleteTemplate = (templateId: string) => {
    if (templateId === 'default') {
      alert('默认方案不能删除');
      return;
    }
    if (window.confirm('确定要删除这个方案吗？')) {
      const updatedTemplates = promptTemplates.filter(t => t.id !== templateId);
      setPromptTemplates(updatedTemplates);
      if (selectedTemplateId === templateId) {
        setSelectedTemplateId('default');
        setSummaryPrompt(promptTemplates.find(t => t.id === 'default')?.content || '');
      }
    }
  };

  return (
    <div className="app-page">
      <div className="app-header">
        <button className="back-btn" onClick={onBack}>
          <i className="fas fa-chevron-left"></i>
        </button>
        <h1>提示词方案管理</h1>
        <button className="save-btn" onClick={saveSettings}>
          <i className="fas fa-check"></i>
        </button>
      </div>

      <div className="app-content">
        <div className="settings-section">
          <div className="prompt-list">
            {promptTemplates.map(template => (
              <div key={template.id} className="prompt-list-item">
                <div className="prompt-info">
                  <div className="prompt-name">{template.name}</div>
                  <div className="prompt-preview">
                    {template.content.substring(0, 50)}...
                  </div>
                </div>
                <div className="prompt-item-actions">
                  <button onClick={(e) => {
                    e.stopPropagation();
                    onNavigate(`promptEditor:${template.id}`);
                  }}>
                    <i className="fas fa-edit"></i>
                  </button>
                  {template.id !== 'default' && (
                    <button onClick={(e) => {
                      e.stopPropagation();
                      deleteTemplate(template.id);
                    }}>
                      <i className="fas fa-trash"></i>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <button 
            className="primary-btn"
            onClick={addNewTemplate}
            style={{ marginTop: '12px' }}
          >
            <i className="fas fa-plus"></i>
            <span>新建方案</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// 提示词编辑器子页面
function PromptEditorPage({ templateId, chat, appState, onUpdate, onBack, onClose }: any) {
  const [promptTemplates, setPromptTemplates] = useState<any[]>(
    appState.promptTemplates || [
      {
        id: 'default',
        name: '默认方案',
        content: `你现在将作为一个核心记忆分析模块，通过分析列表中的对话和自己的原始核心记忆，来扩充或修改现有的核心记忆。

请严格遵守：
1. 保留原始核心记忆，除非你认为对其进行简化后不影响信息量或某些原始核心记忆需要更新
2. 将生成内容添加在原始核心记忆的后面
3. 若你认为当前上下文并不需要生成新的核心记忆，保留原始核心记忆即可
4. 若没有信息表明原始核心记忆需要修改/删除，请务必保留原始核心记忆，并紧接其后面生成新的记忆内容

生成内容要求：
1. 严格控制字数在50-100字内，尽可能精简
2. 仅保留对未来对话至关重要的信息
3. 按优先级提取：用户个人信息 > 用户偏好/喜好 > 重要约定 > 特殊事件 > 常去地点
4. 使用第一人称视角撰写，仿佛是你自己在记录对话记忆
5. 使用极简句式，省略不必要的修饰词
6. 不保留日期、时间等临时性信息，除非是周期性的重要约定
7. 信息应当是从你的角度了解到的用户信息
8. 格式为简洁的要点，可用分号分隔不同信息

原始核心记忆：
{coreMemory}

最近的对话内容：
{conversationText}

仅返回你扩充/修改后的核心记忆内容，不要包含任何解释。`
      }
    ]
  );
  
  // 根据templateId找到要编辑的模板
  const template = promptTemplates.find(t => t.id === templateId);
  const [editingTemplate, setEditingTemplate] = useState<any>(template || { id: '', name: '', content: '' });

  const saveSettings = () => {
    // 保存编辑后的模板
    const updatedTemplates = promptTemplates.map(t => 
      t.id === editingTemplate.id ? editingTemplate : t
    );
    
    onUpdate({ promptTemplates: updatedTemplates });
    onBack();
  };

  return (
    <div className="app-page">
      <div className="app-header">
        <button className="back-btn" onClick={onBack}>
          <i className="fas fa-chevron-left"></i>
        </button>
        <h1>编辑方案</h1>
        <button className="save-btn" onClick={saveSettings}>
          <i className="fas fa-check"></i>
        </button>
      </div>

      <div className="app-content">
        <div className="settings-section">
          <div className="settings-item">
            <label>方案名称</label>
            <input
              type="text"
              value={editingTemplate.name}
              onChange={(e) => setEditingTemplate({ ...editingTemplate, name: e.target.value })}
              className="form-input"
              placeholder="输入方案名称..."
            />
          </div>

          <div className="settings-item">
            <label>提示词内容</label>
            <textarea
              value={editingTemplate.content}
              onChange={(e) => setEditingTemplate({ ...editingTemplate, content: e.target.value })}
              placeholder="输入提示词内容，可使用 {coreMemory} 和 {conversationText} 作为变量..."
              className="form-textarea"
              rows={10}
            />
            <div className="slider-hint">
              支持变量：{'{coreMemory}'} (当前核心记忆) 和 {'{conversationText}'} (最近对话)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 近期记忆 (Vestige) 设置页面
function RecentMemorySettingsPage({ chat, appState, onUpdate, onBack, onClose }: any) {
  const [recentMemories, setRecentMemories] = useState<any[]>(chat?.settings?.recentMemories || []);
  const [summaryCount, setSummaryCount] = useState(chat?.settings?.recentSummaryCount || 20);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState('');

  const totalMessages = chat?.messages?.length || 0;

  const saveSettings = (newMemories?: any[]) => {
    const memoriesToSave = newMemories || recentMemories;
    const updatedChats = appState.chats.map((c: any) => 
      c.id === chat.id ? { 
        ...c, 
        settings: {
          ...c.settings,
          recentMemories: memoriesToSave,
          recentSummaryCount: summaryCount
        }
      } : c
    );
    onUpdate({ chats: updatedChats });
  };

  const deleteMemory = (id: string) => {
    const updated = recentMemories.filter(m => m.id !== id);
    setRecentMemories(updated);
    saveSettings(updated);
  };

  const toggleMemory = (id: string) => {
    const updated = recentMemories.map(m => 
      m.id === id ? { ...m, isActive: !m.isActive } : m
    );
    setRecentMemories(updated);
    saveSettings(updated);
  };

  const startEdit = (memory: any) => {
    setEditingId(memory.id);
    setEditingContent(memory.content);
  };

  const saveEdit = () => {
    const updated = recentMemories.map(m => 
      m.id === editingId ? { ...m, content: editingContent } : m
    );
    setRecentMemories(updated);
    saveSettings(updated);
    setEditingId(null);
  };

  const summarizeRecent = async () => {
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
      const recentMessages = chat.messages.slice(-summaryCount);
      const contact = appState.contacts?.find((c: any) => c.id === chat.contactId);
      const charName = contact?.charName || '角色';
      const userName = contact?.userName || '用户';
      
      const conversationText = recentMessages
        .map((m: any) => `${m.role === 'user' ? userName : charName}：${m.content}`)
        .join('\n');

      const systemPrompt = `你现在不再是角色本身，而是客观的"时空记录员”。你的任务是将当前上下文转化为一份**可被直接读取理解的绝对记忆档案

## 核心执行协议
1.  **代词清洗（零容忍）**：
    *   严禁使用“你”、“我”、“他”、“她”。
    *   必须将所有指代词替换为**具体的角色全名**（例如：将“我救了你”转换为“${userName}救了${charName}”）。
2.  **时间锚点推演**：
    *   依据对话流逝推算日期。若发生剧情跳跃（如“三年后”），必须算出理论上的日期并标注。
    *   格式必须精确到【YYYY/MM/DD】。
3.  **高保真细节**：
    *   保留**关键台词原句**（尤其是承诺、诅咒、告白）。
    *   保留**物品变更**与**身体状态**（伤痕、道具）。
    *   不要写流水账，要写“事件块”。

## 输出格式规范（强制执行）
每条记忆必须严格遵守以下单行格式：
【YYYY/MM/DD】{事件类型}: {详细描述，必须使用具体角色全名}

示例：
【2024/05/12】情感契约: ${charName}向${userName}承诺会永远守护这段记忆。
【2024/05/13】物品变动: ${userName}将祖传的项链赠送给了${charName}。

请直接输出总结后的记忆条目，每行一条。不要包含任何前导语、总结性发言或列表符号。`;

      const response = await fetch(`${appState.apiSettings.apiUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${appState.apiSettings.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: appState.apiSettings.selectedModel,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: `请总结以下对话内容：\n\n${conversationText}` }
          ],
          temperature: 0.3
        })
      });

      if (!response.ok) throw new Error('总结失败');

      const data = await response.json();
      const rawResult = data.choices[0]?.message?.content || '';
      
      // 分条处理：按行切分
      const lines = rawResult.split('\n').map((l: string) => l.trim()).filter((l: string) => l && l.includes('【'));
      const newItems = lines.length > 0 
        ? lines.map((l: string) => ({ 
            id: Date.now() + Math.random().toString(36).substr(2, 5), 
            content: l, 
            isActive: true 
          }))
        : [{ id: Date.now().toString(), content: rawResult, isActive: true }];

      const updated = [...recentMemories, ...newItems];
      setRecentMemories(updated);
      saveSettings(updated);
    } catch (error) {
      console.error(error);
      alert('总结失败，请检查网络或API设置');
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
        <h1>记事本</h1>
        <div style={{ width: '40px' }}></div>
      </div>

      <div className="app-content" style={{ paddingBottom: '40px' }}>
        <div className="settings-section">
          <div className="section-title">状态统计</div>
          <div className="settings-item" style={{ background: 'rgba(0,0,0,0.03)', padding: '12px', borderRadius: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
              <span>总对话条数</span>
              <span style={{ fontWeight: '600' }}>{totalMessages} 条</span>
            </div>
          </div>
        </div>

        <div className="settings-section">
          <div className="section-title">手动总结</div>
          <div className="settings-item">
            <label>总结消息范围<span className="settings-value">最近 {summaryCount} 条</span></label>
            <input
              type="range"
              min="10"
              max="100"
              step="10"
              value={summaryCount}
              onChange={(e) => setSummaryCount(Number(e.target.value))}
              className="slider"
            />
            <div className="slider-hint">将分析最近的对话并生成高保真档案</div>
          </div>
          <button 
            className="primary-btn" 
            onClick={summarizeRecent}
            disabled={isSummarizing}
            style={{ marginTop: '12px' }}
          >
            {isSummarizing ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-pen-fancy"></i>}
            <span>{isSummarizing ? '时空记录员工作中...' : '生成记事条目'}</span>
          </button>
        </div>

        <div className="settings-section">
          <div className="section-title">记忆条目 ({recentMemories.length})</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {recentMemories.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 0', color: '#94a3b8', fontSize: '13px' }}>
                尚未生成任何近期记忆
              </div>
            ) : (
              recentMemories.map((m) => (
                <div key={m.id} style={{ 
                  background: appState.isNightMode ? 'rgba(255,255,255,0.05)' : '#fff',
                  borderRadius: '16px',
                  padding: '16px',
                  border: `1px solid ${appState.isNightMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}`,
                  position: 'relative'
                }}>
                  {editingId === m.id ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <textarea 
                        value={editingContent}
                        onChange={(e) => setEditingContent(e.target.value)}
                        className="form-textarea"
                        rows={3}
                        style={{ fontSize: '13px' }}
                      />
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button className="primary-btn" onClick={saveEdit} style={{ height: '32px', padding: '0 12px', fontSize: '12px', minWidth: '60px' }}>保存</button>
                        <button className="secondary-btn" onClick={() => setEditingId(null)} style={{ height: '32px', padding: '0 12px', fontSize: '12px', minWidth: '60px' }}>取消</button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div style={{ 
                        fontSize: '14px', 
                        lineHeight: '1.6', 
                        color: m.isActive ? (appState.isNightMode ? '#fff' : '#1e293b') : '#94a3b8',
                        marginBottom: '12px',
                        textDecoration: m.isActive ? 'none' : 'line-through'
                      }}>
                        {m.content}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '12px', borderTop: `0.5px solid ${appState.isNightMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}` }}>
                        <div style={{ display: 'flex', gap: '16px' }}>
                          <button onClick={() => startEdit(m)} style={{ background: 'none', border: 'none', color: '#64748b', fontSize: '13px', cursor: 'pointer' }}>
                            <i className="fas fa-edit"></i>
                          </button>
                          <button onClick={() => deleteMemory(m.id)} style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '13px', cursor: 'pointer' }}>
                            <i className="fas fa-trash-alt"></i>
                          </button>
                        </div>
                        <div 
                          className={`avatar-toggle ${m.isActive ? 'on' : 'off'}`} 
                          onClick={() => toggleMemory(m.id)}
                          style={{ width: '40px', height: '22px' }}
                        >
                          <div className="avatar-toggle-slider" style={{ width: '16px', height: '16px', transform: m.isActive ? 'translateX(18px)' : 'none' }}></div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
