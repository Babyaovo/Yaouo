import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface EditContactPageProps {
  appState: any;
  onUpdate: (updates: any) => void;
  onClose: () => void;
}

const LANGUAGE_OPTIONS = [
  { value: 'zh-CN', label: '简体中文' },
  { value: 'zh-TW', label: '繁体中文' },
  { value: 'en-US', label: '美式英语' },
  { value: 'en-GB', label: '英式英语' },
  { value: 'fr-FR', label: '法语' },
  { value: 'it-IT', label: '意大利语' },
  { value: 'de-DE', label: '德语' },
  { value: 'ja-JP', label: '日语' },
  { value: 'yue', label: '粤语' },
  { value: 'ko-KR', label: '韩语' }
];

export function EditContactPage({ appState, onUpdate, onClose }: EditContactPageProps) {
  const editingContact = appState.contacts?.find((c: any) => c.id === appState.currentContactId);
  
  const [charName, setCharName] = useState(editingContact?.charName || '');
  const [charAvatar, setCharAvatar] = useState(editingContact?.charAvatar || '');
  const [charSettings, setCharSettings] = useState(editingContact?.charSettings || '');
  const [charLanguages, setCharLanguages] = useState<string[]>(editingContact?.charLanguages || ['zh-CN']);
  const [needsTranslation, setNeedsTranslation] = useState(editingContact?.needsTranslation !== false);
  const [userName, setUserName] = useState(editingContact?.userName || '');
  const [userAvatar, setUserAvatar] = useState(editingContact?.userAvatar || '');
  const [userSettings, setUserSettings] = useState(editingContact?.userSettings || '');
  
  // API权限配置
  const [apiPermissions, setApiPermissions] = useState(editingContact?.apiPermissions || {
    moments: false,
    vestige: false,
    calendar: false
  });

  // 用户信息方案管理
  const [showUserProfileManager, setShowUserProfileManager] = useState(false);
  const [showSaveUserDialog, setShowSaveUserDialog] = useState(false);
  const [newUserProfileName, setNewUserProfileName] = useState('');
  
  const userProfiles = appState.userProfiles || [];
  const currentUserProfileId = appState.currentUserProfileId;

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

  // 切换语言选择
  const toggleLanguage = (lang: string) => {
    if (charLanguages.includes(lang)) {
      // 至少保留一个语言
      if (charLanguages.length > 1) {
        setCharLanguages(charLanguages.filter(l => l !== lang));
      }
    } else {
      setCharLanguages([...charLanguages, lang]);
    }
  };

  // 保存用户信息方案
  const saveUserProfile = () => {
    if (!newUserProfileName.trim()) {
      return;
    }

    const newProfile = {
      id: Date.now().toString(),
      name: newUserProfileName.trim(),
      userName,
      userAvatar,
      userSettings,
      createdAt: Date.now()
    };

    const updatedProfiles = [...userProfiles, newProfile];
    
    onUpdate({
      userProfiles: updatedProfiles,
      currentUserProfileId: newProfile.id
    });

    setNewUserProfileName('');
    setShowSaveUserDialog(false);
  };

  // 加载用户方案
  const loadUserProfile = (profileId: string) => {
    const profile = userProfiles.find((p: any) => p.id === profileId);
    if (!profile) return;

    setUserName(profile.userName);
    setUserAvatar(profile.userAvatar);
    setUserSettings(profile.userSettings);

    onUpdate({
      currentUserProfileId: profileId
    });

    setShowUserProfileManager(false);
  };

  // 删除用户方案
  const deleteUserProfile = (profileId: string) => {
    const updatedProfiles = userProfiles.filter((p: any) => p.id !== profileId);
    const updates: any = { userProfiles: updatedProfiles };

    if (currentUserProfileId === profileId) {
      updates.currentUserProfileId = null;
    }

    onUpdate(updates);
  };

  // 更新用户方案
  const updateUserProfile = (profileId: string) => {
    const profile = userProfiles.find((p: any) => p.id === profileId);
    if (!profile) return;

    const updatedProfiles = userProfiles.map((p: any) =>
      p.id === profileId
        ? { ...p, userName, userAvatar, userSettings }
        : p
    );

    onUpdate({
      userProfiles: updatedProfiles
    });
  };

  const saveContact = () => {
    const contactData = {
      id: editingContact?.id || Date.now().toString(),
      charName,
      charAvatar,
      charSettings,
      charLanguages,
      needsTranslation,
      userName,
      userAvatar,
      userSettings,
      apiPermissions,
      createdAt: editingContact?.createdAt || Date.now()
    };

    const updatedContacts = editingContact
      ? appState.contacts.map((c: any) => c.id === editingContact.id ? contactData : c)
      : [...(appState.contacts || []), contactData];

    onUpdate({ contacts: updatedContacts });
    onClose();
  };

  const currentUserProfile = userProfiles.find((p: any) => p.id === currentUserProfileId);

  return (
    <div className="app-page edit-contact-page">
      <div className="app-header">
        <button className="back-btn" onClick={onClose}>
          <i className="fas fa-times"></i>
        </button>
        <h1>{editingContact ? '编辑联系人' : '新建联系人'}</h1>
        <button className="save-btn" onClick={saveContact}>
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
            <label>角色语言（可多选）</label>
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '8px',
              marginTop: '8px'
            }}>
              {LANGUAGE_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => toggleLanguage(option.value)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '12px',
                    border: charLanguages.includes(option.value)
                      ? (appState.isNightMode ? '1px solid rgba(255, 255, 255, 0.3)' : '1px solid rgba(0, 0, 0, 0.3)')
                      : (appState.isNightMode ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.1)'),
                    background: charLanguages.includes(option.value)
                      ? (appState.isNightMode ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.08)')
                      : (appState.isNightMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)'),
                    color: appState.isNightMode ? '#e5e7eb' : '#1a1a1a',
                    fontSize: '13px',
                    fontWeight: charLanguages.includes(option.value) ? '500' : '400',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    outline: 'none'
                  }}
                >
                  {option.label}
                </button>
              ))}
            </div>
            <div style={{
              marginTop: '8px',
              fontSize: '12px',
              color: '#9ca3af',
              fontWeight: '300'
            }}>
              已选择: {charLanguages.map(lang => 
                LANGUAGE_OPTIONS.find(opt => opt.value === lang)?.label
              ).join('、')}
            </div>
          </div>

          <div className="form-group">
            <div className="translation-toggle-wrapper">
              <div className="translation-toggle-label">
                <span>需要翻译</span>
                <div className="translation-hint">
                  {needsTranslation 
                    ? '角色将使用所选语言回复，并提供中文翻译' 
                    : '角色将直接使用所选语言回复，不提供翻译'
                  }
                </div>
              </div>
              <div 
                className={`translation-toggle ${needsTranslation ? 'on' : 'off'}`}
                onClick={() => setNeedsTranslation(!needsTranslation)}
              >
                <div className="translation-toggle-slider"></div>
              </div>
            </div>
          </div>
        </div>

        <div className="edit-section">
          <h2 className="section-title">
            <i className="fas fa-user-circle"></i>
            用户信息
          </h2>

          {/* 用户方案选择器 */}
          <div style={{
            marginBottom: '20px',
            padding: '16px',
            background: appState.isNightMode ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.02)',
            borderRadius: '12px',
            border: appState.isNightMode ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(0, 0, 0, 0.06)'
          }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px',
              marginBottom: '8px'
            }}>
              <i className="fas fa-layer-group" style={{ 
                color: appState.isNightMode ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)',
                fontSize: '12px'
              }}></i>
              <label style={{
                fontSize: '12px',
                fontWeight: '500',
                color: appState.isNightMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)'
              }}>用户信息方案</label>
            </div>
            
            <div style={{ display: 'flex', gap: '6px', alignItems: 'stretch' }}>
              <select
                value={currentUserProfileId || ''}
                onChange={(e) => {
                  if (e.target.value) {
                    loadUserProfile(e.target.value);
                  }
                }}
                style={{
                  flex: 1,
                  padding: '10px 12px',
                  borderRadius: '10px',
                  border: appState.isNightMode ? '1px solid rgba(255,255,255,0.12)' : '1px solid rgba(0,0,0,0.08)',
                  background: appState.isNightMode ? '#0a0a0a' : '#fff',
                  color: appState.isNightMode ? '#e5e7eb' : '#1a1a1a',
                  fontSize: '13px',
                  fontWeight: '400',
                  outline: 'none',
                  cursor: 'pointer',
                  appearance: 'none',
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='%23${appState.isNightMode ? 'e5e7eb' : '1a1a1a'}' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 12px center',
                  paddingRight: '36px'
                }}
              >
                <option value="">无方案（临时配置）</option>
                {userProfiles.map((profile: any) => (
                  <option key={profile.id} value={profile.id}>
                    {profile.name}
                  </option>
                ))}
              </select>

              <button
                onClick={() => setShowSaveUserDialog(true)}
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  border: appState.isNightMode ? '1px solid rgba(255,255,255,0.12)' : '1px solid rgba(0,0,0,0.08)',
                  background: appState.isNightMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)',
                  color: appState.isNightMode ? '#e5e7eb' : '#1a1a1a',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '14px',
                  flexShrink: 0
                }}
                title="保存为新方案"
              >
                <i className="fas fa-plus"></i>
              </button>

              <button
                onClick={() => setShowUserProfileManager(true)}
                disabled={userProfiles.length === 0}
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  border: appState.isNightMode ? '1px solid rgba(255,255,255,0.12)' : '1px solid rgba(0,0,0,0.08)',
                  background: appState.isNightMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)',
                  color: appState.isNightMode ? '#e5e7eb' : '#1a1a1a',
                  cursor: userProfiles.length === 0 ? 'not-allowed' : 'pointer',
                  opacity: userProfiles.length === 0 ? 0.3 : 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '14px',
                  flexShrink: 0
                }}
                title="管理方案"
              >
                <i className="fas fa-cog"></i>
              </button>

              {currentUserProfile && (
                <button
                  onClick={() => updateUserProfile(currentUserProfile.id)}
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    border: appState.isNightMode ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(5, 150, 105, 0.3)',
                    background: appState.isNightMode ? 'rgba(16, 185, 129, 0.1)' : 'rgba(5, 150, 105, 0.1)',
                    color: appState.isNightMode ? '#10b981' : '#059669',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    flexShrink: 0
                  }}
                  title="更新当前方案"
                >
                  <i className="fas fa-sync-alt"></i>
                </button>
              )}
            </div>

            {currentUserProfile && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                style={{
                  marginTop: '10px',
                  padding: '8px 10px',
                  borderRadius: '6px',
                  background: appState.isNightMode ? 'rgba(16, 185, 129, 0.08)' : 'rgba(5, 150, 105, 0.08)',
                  border: `1px solid ${appState.isNightMode ? 'rgba(16, 185, 129, 0.2)' : 'rgba(5, 150, 105, 0.2)'}`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <i className="fas fa-info-circle" style={{ 
                  color: appState.isNightMode ? '#10b981' : '#059669',
                  fontSize: '10px'
                }}></i>
                <span style={{
                  fontSize: '11px',
                  color: appState.isNightMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)',
                  fontWeight: '300'
                }}>
                  点击更新图标可保存修改到当前方案
                </span>
              </motion.div>
            )}
          </div>
          
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

        {/* API权限配置 */}
        <div className="edit-section">
          <h2 className="section-title">
            <i className="fas fa-robot"></i>
            AI自主活动权限
          </h2>
          
          <div style={{ 
            fontSize: '13px',
            color: '#6b7280',
            lineHeight: '1.6',
            marginBottom: '20px',
            padding: '12px',
            background: '#f9fafb',
            borderRadius: '6px',
            border: '1px solid #f3f4f6'
          }}>
            开启后，角色可以在相应应用中自主调用AI生成内容（如发动态、生成记忆等）
          </div>

          <div className="form-group">
            <div className="translation-toggle-wrapper">
              <div className="translation-toggle-label">
                <span>动态评论</span>
                <div className="translation-hint">
                  允许角色在你发布动态后自动生成评论
                </div>
              </div>
              <div 
                className={`translation-toggle ${apiPermissions.moments ? 'on' : 'off'}`}
                onClick={() => setApiPermissions({ ...apiPermissions, moments: !apiPermissions.moments })}
              >
                <div className="translation-toggle-slider"></div>
              </div>
            </div>
          </div>

          <div className="form-group">
            <div className="translation-toggle-wrapper">
              <div className="translation-toggle-label">
                <span>记忆生成</span>
                <div className="translation-hint">
                  允许在Vestige应用中生成该角色的记忆内容
                </div>
              </div>
              <div 
                className={`translation-toggle ${apiPermissions.vestige ? 'on' : 'off'}`}
                onClick={() => setApiPermissions({ ...apiPermissions, vestige: !apiPermissions.vestige })}
              >
                <div className="translation-toggle-slider"></div>
              </div>
            </div>
          </div>

          <div className="form-group">
            <div className="translation-toggle-wrapper">
              <div className="translation-toggle-label">
                <span>日历提醒</span>
                <div className="translation-hint">
                  允许角色根据日历事件主动提醒用户
                </div>
              </div>
              <div 
                className={`translation-toggle ${apiPermissions.calendar ? 'on' : 'off'}`}
                onClick={() => setApiPermissions({ ...apiPermissions, calendar: !apiPermissions.calendar })}
              >
                <div className="translation-toggle-slider"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 用户方案管理弹窗 */}
      <AnimatePresence>
        {showUserProfileManager && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.6)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'center',
              zIndex: 1000,
              padding: '20px'
            }}
            onClick={() => setShowUserProfileManager(false)}
          >
            <motion.div
              initial={{ y: 400, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 400, opacity: 0 }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                background: appState.isNightMode ? '#1a1a1a' : '#fff',
                borderRadius: '24px 24px 0 0',
                width: '100%',
                maxWidth: '500px',
                maxHeight: '70vh',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <div style={{
                padding: '24px',
                borderBottom: `1px solid ${appState.isNightMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <h2 style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: appState.isNightMode ? '#fff' : '#1a1a1a',
                  margin: 0
                }}>用户信息方案</h2>
                <button
                  onClick={() => setShowUserProfileManager(false)}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    border: 'none',
                    background: appState.isNightMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
                    color: appState.isNightMode ? '#fff' : '#1a1a1a',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '14px'
                  }}
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>

              <div style={{
                flex: 1,
                overflowY: 'auto',
                padding: '20px'
              }}>
                {userProfiles.length === 0 ? (
                  <div style={{
                    textAlign: 'center',
                    padding: '40px 20px',
                    color: appState.isNightMode ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.4)'
                  }}>
                    <i className="fas fa-inbox" style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.3 }}></i>
                    <p style={{ fontSize: '14px', fontWeight: '300' }}>暂无保存的方案</p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {userProfiles.map((profile: any) => (
                      <motion.div
                        key={profile.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        style={{
                          background: currentUserProfileId === profile.id
                            ? (appState.isNightMode 
                              ? 'linear-gradient(135deg, rgba(30, 30, 30, 0.8) 0%, rgba(20, 20, 20, 0.9) 100%)' 
                              : 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(245, 245, 245, 0.8) 100%)')
                            : (appState.isNightMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)'),
                          border: currentUserProfileId === profile.id 
                            ? (appState.isNightMode ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid rgba(0, 0, 0, 0.15)')
                            : (appState.isNightMode ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(0, 0, 0, 0.06)'),
                          borderRadius: '12px',
                          padding: '16px',
                          cursor: 'pointer'
                        }}
                        onClick={() => loadUserProfile(profile.id)}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              {currentUserProfileId === profile.id && (
                                <i className="fas fa-check-circle" style={{ 
                                  color: appState.isNightMode ? '#10b981' : '#059669',
                                  fontSize: '14px'
                                }}></i>
                              )}
                              <h3 style={{
                                fontSize: '15px',
                                fontWeight: '500',
                                color: appState.isNightMode ? '#fff' : '#1a1a1a',
                                margin: 0
                              }}>{profile.name}</h3>
                            </div>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteUserProfile(profile.id);
                            }}
                            style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '8px',
                              border: 'none',
                              background: appState.isNightMode ? 'rgba(239, 68, 68, 0.15)' : 'rgba(239, 68, 68, 0.1)',
                              color: '#ef4444',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '13px'
                            }}
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 保存用户方案对话框 */}
      <AnimatePresence>
        {showSaveUserDialog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.6)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
              padding: '20px'
            }}
            onClick={() => {
              setShowSaveUserDialog(false);
              setNewUserProfileName('');
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                background: appState.isNightMode ? '#1a1a1a' : '#fff',
                borderRadius: '20px',
                width: '100%',
                maxWidth: '400px',
                padding: '28px'
              }}
            >
              <h2 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: appState.isNightMode ? '#fff' : '#1a1a1a',
                marginBottom: '8px'
              }}>保存用户信息方案</h2>
              <p style={{
                fontSize: '13px',
                color: appState.isNightMode ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)',
                marginBottom: '24px',
                fontWeight: '300'
              }}>为当前用户信息命名，以便在不同联系人中快速应用</p>

              <input
                type="text"
                value={newUserProfileName}
                onChange={(e) => setNewUserProfileName(e.target.value)}
                placeholder="例如：我的默认信息"
                autoFocus
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  borderRadius: '10px',
                  border: appState.isNightMode ? '1px solid rgba(255,255,255,0.12)' : '1px solid rgba(0,0,0,0.08)',
                  background: appState.isNightMode ? '#0a0a0a' : '#fff',
                  color: appState.isNightMode ? '#e5e7eb' : '#1a1a1a',
                  fontSize: '14px',
                  fontWeight: '300',
                  outline: 'none',
                  marginBottom: '20px'
                }}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && newUserProfileName.trim()) {
                    saveUserProfile();
                  }
                }}
              />

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <button
                  onClick={() => {
                    setShowSaveUserDialog(false);
                    setNewUserProfileName('');
                  }}
                  style={{
                    height: '44px',
                    borderRadius: '10px',
                    border: appState.isNightMode ? '1px solid rgba(255,255,255,0.12)' : '1px solid rgba(0,0,0,0.08)',
                    background: 'transparent',
                    color: appState.isNightMode ? '#e5e7eb' : '#1a1a1a',
                    fontSize: '14px',
                    fontWeight: '400',
                    cursor: 'pointer'
                  }}
                >
                  取消
                </button>
                <button
                  onClick={saveUserProfile}
                  disabled={!newUserProfileName.trim()}
                  style={{
                    height: '44px',
                    borderRadius: '10px',
                    border: 'none',
                    background: newUserProfileName.trim() 
                      ? (appState.isNightMode ? '#e5e7eb' : '#1a1a1a')
                      : (appState.isNightMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'),
                    color: newUserProfileName.trim()
                      ? (appState.isNightMode ? '#1a1a1a' : '#fff')
                      : (appState.isNightMode ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)'),
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: newUserProfileName.trim() ? 'pointer' : 'not-allowed'
                  }}
                >
                  保存
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}