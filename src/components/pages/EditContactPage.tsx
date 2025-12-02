import { useState, useEffect } from 'react';

interface EditContactPageProps {
  appState: any;
  onUpdate: (updates: any) => void;
  onClose: () => void;
}

export function EditContactPage({ appState, onUpdate, onClose }: EditContactPageProps) {
  const editingContact = appState.contacts?.find((c: any) => c.id === appState.currentContactId);
  
  const [charName, setCharName] = useState(editingContact?.charName || '');
  const [charAvatar, setCharAvatar] = useState(editingContact?.charAvatar || '');
  const [charSettings, setCharSettings] = useState(editingContact?.charSettings || '');
  const [charLanguage, setCharLanguage] = useState(editingContact?.charLanguage || 'zh-CN');
  const [needsTranslation, setNeedsTranslation] = useState(editingContact?.needsTranslation !== false);
  const [userName, setUserName] = useState(editingContact?.userName || '');
  const [userAvatar, setUserAvatar] = useState(editingContact?.userAvatar || '');
  const [userSettings, setUserSettings] = useState(editingContact?.userSettings || '');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleImageUpload = (type: 'char' | 'user', file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (type === 'char') {
        setCharAvatar(e.target?.result as string);
      } else {
        setUserAvatar(e.target?.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const generateSummary = async () => {
    if (!charSettings.trim()) {
      alert('请先填写角色基础设定');
      return;
    }

    if (!appState.apiSettings?.apiUrl || !appState.apiSettings?.apiKey) {
      alert('请先在设置中配置 API');
      return;
    }

    setIsGenerating(true);

    try {
      const response = await fetch(`${appState.apiSettings.apiUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${appState.apiSettings.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: appState.apiSettings.selectedModel,
          messages: [
            {
              role: 'system',
              content: '你是一个角色卡片生成助手。根据用户提供的角色基础设定，提取并总结出：职业、年龄、性格描述（50字以内）。请以JSON格式回复：{"occupation":"职业","age":"年龄","summary":"性格描述"}'
            },
            {
              role: 'user',
              content: charSettings
            }
          ],
          temperature: 0.7
        })
      });

      if (!response.ok) {
        throw new Error('生成失败');
      }

      const data = await response.json();
      const content = data.choices[0]?.message?.content;
      
      try {
        const parsed = JSON.parse(content);
        saveContact(parsed);
      } catch {
        // 如果不是JSON格式，尝试简单解析
        saveContact({
          occupation: '未知',
          age: '未知',
          summary: content.slice(0, 50)
        });
      }
    } catch (error) {
      alert('生成失败，请检查API设置');
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  const saveContact = (generated?: any) => {
    const contactData = {
      id: editingContact?.id || Date.now().toString(),
      charName,
      charAvatar,
      charSettings,
      charLanguage,
      needsTranslation,
      userName,
      userAvatar,
      userSettings,
      occupation: generated?.occupation || editingContact?.occupation || '',
      age: generated?.age || editingContact?.age || '',
      summary: generated?.summary || editingContact?.summary || '',
      createdAt: editingContact?.createdAt || Date.now()
    };

    const updatedContacts = editingContact
      ? appState.contacts.map((c: any) => c.id === editingContact.id ? contactData : c)
      : [...(appState.contacts || []), contactData];

    onUpdate({ contacts: updatedContacts });
    onClose();
  };

  return (
    <div className="app-page edit-contact-page">
      <div className="app-header">
        <button className="back-btn" onClick={onClose}>
          <i className="fas fa-times"></i>
        </button>
        <h1>{editingContact ? '编辑联系人' : '新建联系人'}</h1>
        <button className="save-btn" onClick={() => saveContact()}>
          保存
        </button>
      </div>

      <div className="app-content">
        <div className="edit-section">
          <h2 className="section-title">
            <i className="fas fa-user"></i>
            角色信息
          </h2>
          
          <div className="avatar-upload">
            <div className="avatar-preview">
              {charAvatar ? (
                <img src={charAvatar} alt="角色头像" />
              ) : (
                <i className="fas fa-camera"></i>
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => e.target.files?.[0] && handleImageUpload('char', e.target.files[0])}
              id="char-avatar-upload"
              style={{ display: 'none' }}
            />
            <button 
              className="upload-btn"
              onClick={() => document.getElementById('char-avatar-upload')?.click()}
            >
              选择头像
            </button>
          </div>

          <div className="form-group">
            <label>角色姓名</label>
            <input
              type="text"
              value={charName}
              onChange={(e) => setCharName(e.target.value)}
              placeholder="请输入角色姓名"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label>角色基础设定</label>
            <textarea
              value={charSettings}
              onChange={(e) => setCharSettings(e.target.value)}
              placeholder="描述角色的背景、性格、特点等..."
              className="form-textarea"
              rows={6}
            />
          </div>

          <div className="form-group">
            <label>角色语言</label>
            <select
              value={charLanguage}
              onChange={(e) => setCharLanguage(e.target.value)}
              className="form-select"
            >
              <option value="zh-CN">简体中文</option>
              <option value="zh-TW">繁体中文</option>
              <option value="en-US">美式英语</option>
              <option value="en-GB">英式英语</option>
              <option value="fr-FR">法语</option>
              <option value="it-IT">意大利语</option>
              <option value="de-DE">德语</option>
              <option value="ja-JP">日语</option>
              <option value="yue">粤语</option>
              <option value="ko-KR">韩语</option>
            </select>
            
            <div className="translation-toggle-container">
              <label htmlFor="needsTranslation">需要翻译</label>
              <div 
                className={`translation-toggle ${needsTranslation ? 'on' : 'off'}`}
                onClick={() => setNeedsTranslation(!needsTranslation)}
              >
                <div className="translation-toggle-slider"></div>
              </div>
            </div>
          </div>
        </div>

        <div className="edit-section bg-[rgb(0,0,0)]">
          <h2 className="section-title">
            <i className="fas fa-user-circle"></i>
            用户信息
          </h2>
          
          <div className="avatar-upload">
            <div className="avatar-preview">
              {userAvatar ? (
                <img src={userAvatar} alt="用户头像" />
              ) : (
                <i className="fas fa-camera"></i>
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => e.target.files?.[0] && handleImageUpload('user', e.target.files[0])}
              id="user-avatar-upload"
              style={{ display: 'none' }}
            />
            <button 
              className="upload-btn"
              onClick={() => document.getElementById('user-avatar-upload')?.click()}
            >
              选择头像
            </button>
          </div>

          <div className="form-group">
            <label>用户姓名</label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="请输入用户姓名"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label>用户基础设定</label>
            <textarea
              value={userSettings}
              onChange={(e) => setUserSettings(e.target.value)}
              placeholder="描述用户的背景、性格、特点等..."
              className="form-textarea"
              rows={4}
            />
          </div>
        </div>

        <button 
          className="generate-btn"
          onClick={generateSummary}
          disabled={isGenerating || !charSettings.trim()}
        >
          {isGenerating ? (
            <>
              <i className="fas fa-spinner fa-spin"></i>
              <span>生成中...</span>
            </>
          ) : (
            <>
              <i className="fas fa-magic"></i>
              <span>生成角色卡片</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}