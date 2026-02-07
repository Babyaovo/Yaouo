import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface SettingsPageProps {
  appState: any;
  onUpdate: (updates: any) => void;
  onClose: () => void;
}

export function SettingsPage({ appState, onUpdate, onClose }: SettingsPageProps) {
  const [apiUrl, setApiUrl] = useState(appState.apiSettings?.apiUrl || '');
  const [apiKey, setApiKey] = useState(appState.apiSettings?.apiKey || '');
  const [selectedModel, setSelectedModel] = useState(appState.apiSettings?.selectedModel || '');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  
  // 方案管理状态
  const [showProfileManager, setShowProfileManager] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [newProfileName, setNewProfileName] = useState('');
  const [editingProfileId, setEditingProfileId] = useState<string | null>(null);

  const profiles = appState.apiProfiles || [];
  const currentProfileId = appState.currentProfileId;

  const fetchModels = async () => {
    if (!apiUrl || !apiKey) {
      setMessage('请先填写 API URL 和 API Key');
      return;
    }

    setIsLoading(true);
    setMessage('正在获取模型列表...');

    try {
      const response = await fetch(`${apiUrl}/models`, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('获取模型列表失败');
      }

      const data = await response.json();
      const models = data.data?.map((m: any) => m.id) || [];
      
      onUpdate({
        apiSettings: {
          ...appState.apiSettings,
          apiUrl,
          apiKey,
          selectedModel: models[0] || '',
          availableModels: models
        }
      });

      setMessage(`成功获取 ${models.length} 个模型`);
      if (models.length > 0) {
        setSelectedModel(models[0]);
      }
    } catch (error) {
      setMessage('获取模型失败，请检查设置');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveSettings = () => {
    onUpdate({
      apiSettings: {
        ...appState.apiSettings,
        apiUrl,
        apiKey,
        selectedModel
      }
    });
    setMessage('设置已保存');
    setTimeout(() => setMessage(''), 2000);
  };

  // 保存当前配置为新方案
  const saveAsProfile = () => {
    if (!newProfileName.trim()) {
      setMessage('请输入方案名称');
      return;
    }

    const newProfile = {
      id: Date.now().toString(),
      name: newProfileName.trim(),
      apiUrl,
      apiKey,
      selectedModel,
      createdAt: Date.now()
    };

    const updatedProfiles = [...profiles, newProfile];
    
    onUpdate({
      apiProfiles: updatedProfiles,
      currentProfileId: newProfile.id,
      apiSettings: {
        ...appState.apiSettings,
        apiUrl,
        apiKey,
        selectedModel
      }
    });

    setNewProfileName('');
    setShowSaveDialog(false);
    setMessage(`方案"${newProfile.name}"已保存`);
    setTimeout(() => setMessage(''), 2000);
  };

  // 切换到指定方案
  const switchProfile = (profileId: string) => {
    const profile = profiles.find((p: any) => p.id === profileId);
    if (!profile) return;

    setApiUrl(profile.apiUrl);
    setApiKey(profile.apiKey);
    setSelectedModel(profile.selectedModel);

    onUpdate({
      currentProfileId: profileId,
      apiSettings: {
        ...appState.apiSettings,
        apiUrl: profile.apiUrl,
        apiKey: profile.apiKey,
        selectedModel: profile.selectedModel
      }
    });

    setShowProfileManager(false);
    setMessage(`已切换到方案"${profile.name}"`);
    setTimeout(() => setMessage(''), 2000);
  };

  // 删除方案
  const deleteProfile = (profileId: string) => {
    const profile = profiles.find((p: any) => p.id === profileId);
    if (!profile) return;

    const updatedProfiles = profiles.filter((p: any) => p.id !== profileId);
    const updates: any = { apiProfiles: updatedProfiles };

    // 如果删除的是当前方案，清空currentProfileId
    if (currentProfileId === profileId) {
      updates.currentProfileId = null;
    }

    onUpdate(updates);
    setMessage(`方案"${profile.name}"已删除`);
    setTimeout(() => setMessage(''), 2000);
  };

  // 更新现有方案
  const updateProfile = (profileId: string) => {
    const profile = profiles.find((p: any) => p.id === profileId);
    if (!profile) return;

    const updatedProfiles = profiles.map((p: any) =>
      p.id === profileId
        ? { ...p, apiUrl, apiKey, selectedModel }
        : p
    );

    onUpdate({
      apiProfiles: updatedProfiles,
      apiSettings: {
        ...appState.apiSettings,
        apiUrl,
        apiKey,
        selectedModel
      }
    });

    setEditingProfileId(null);
    setMessage(`方案"${profile.name}"已更新`);
    setTimeout(() => setMessage(''), 2000);
  };

  const currentProfile = profiles.find((p: any) => p.id === currentProfileId);

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
      <div style={{
        padding: `max(env(safe-area-inset-top, 0px), var(--space-6)) var(--space-6) var(--space-4)`,
        background: appState.isNightMode 
          ? 'linear-gradient(180deg, rgba(10, 10, 10, 0.98) 0%, rgba(10, 10, 10, 0.95) 80%, rgba(10, 10, 10, 0) 100%)'
          : 'linear-gradient(180deg, rgba(250, 250, 250, 0.98) 0%, rgba(250, 250, 250, 0.95) 80%, rgba(250, 250, 250, 0) 100%)',
        backdropFilter: 'blur(40px) saturate(180%)',
        WebkitBackdropFilter: 'blur(40px) saturate(180%)',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        {/* 顶部按钮栏 */}
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
            Settings
          </h1>

          <div style={{ width: '44px' }}></div>
        </div>
      </div>

      <div className="app-content" style={{
        background: appState.isNightMode ? '#0a0a0a' : '#fafafa',
        padding: '24px',
        overflowY: 'auto'
      }}>
        {/* 方案选择器 - 简洁版 */}
        <div style={{
          background: appState.isNightMode ? '#1a1a1a' : '#fff',
          border: appState.isNightMode ? '1px solid rgba(255,255,255,0.12)' : '1px solid rgba(0,0,0,0.08)',
          borderRadius: '16px',
          padding: '20px',
          marginBottom: '20px'
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '12px',
            marginBottom: '4px'
          }}>
            <i className="fas fa-layer-group" style={{ 
              color: appState.isNightMode ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)',
              fontSize: '14px'
            }}></i>
            <label style={{
              fontSize: '13px',
              fontWeight: '500',
              color: appState.isNightMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)',
              letterSpacing: '0.02em'
            }}>配置方案</label>
          </div>
          
          <div style={{ display: 'flex', gap: '8px', alignItems: 'stretch' }}>
            {/* 方案选择下拉框 */}
            <select
              value={currentProfileId || ''}
              onChange={(e) => {
                if (e.target.value) {
                  switchProfile(e.target.value);
                }
              }}
              style={{
                flex: 1,
                padding: '12px 16px',
                borderRadius: '10px',
                border: appState.isNightMode ? '1px solid rgba(255,255,255,0.12)' : '1px solid rgba(0,0,0,0.08)',
                background: appState.isNightMode ? '#0a0a0a' : '#fff',
                color: appState.isNightMode ? '#e5e7eb' : '#1a1a1a',
                fontSize: '14px',
                fontWeight: '400',
                outline: 'none',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
                appearance: 'none',
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='%23${appState.isNightMode ? 'e5e7eb' : '1a1a1a'}' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 16px center',
                paddingRight: '40px'
              }}
            >
              <option value="">无方案（临时配置）</option>
              {profiles.map((profile: any) => (
                <option key={profile.id} value={profile.id}>
                  {profile.name}
                </option>
              ))}
            </select>

            {/* 新建方案按钮 */}
            <button
              onClick={() => setShowSaveDialog(true)}
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '10px',
                border: appState.isNightMode ? '1px solid rgba(255,255,255,0.12)' : '1px solid rgba(0,0,0,0.08)',
                background: appState.isNightMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)',
                color: appState.isNightMode ? '#e5e7eb' : '#1a1a1a',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '16px',
                transition: 'all 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
                flexShrink: 0
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = appState.isNightMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)';
                e.currentTarget.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = appState.isNightMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)';
                e.currentTarget.style.transform = 'scale(1)';
              }}
              title="保存为新方案"
            >
              <i className="fas fa-plus"></i>
            </button>

            {/* 管理方案按钮 */}
            <button
              onClick={() => setShowProfileManager(true)}
              disabled={profiles.length === 0}
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '10px',
                border: appState.isNightMode ? '1px solid rgba(255,255,255,0.12)' : '1px solid rgba(0,0,0,0.08)',
                background: appState.isNightMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)',
                color: appState.isNightMode ? '#e5e7eb' : '#1a1a1a',
                cursor: profiles.length === 0 ? 'not-allowed' : 'pointer',
                opacity: profiles.length === 0 ? 0.3 : 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '16px',
                transition: 'all 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
                flexShrink: 0
              }}
              onMouseEnter={(e) => {
                if (profiles.length > 0) {
                  e.currentTarget.style.background = appState.isNightMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)';
                  e.currentTarget.style.transform = 'scale(1.05)';
                }
              }}
              onMouseLeave={(e) => {
                if (profiles.length > 0) {
                  e.currentTarget.style.background = appState.isNightMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)';
                  e.currentTarget.style.transform = 'scale(1)';
                }
              }}
              title="管理方案"
            >
              <i className="fas fa-cog"></i>
            </button>

            {/* 更新当前方案按钮 */}
            {currentProfile && (
              <button
                onClick={() => updateProfile(currentProfile.id)}
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '10px',
                  border: appState.isNightMode ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(5, 150, 105, 0.3)',
                  background: appState.isNightMode ? 'rgba(16, 185, 129, 0.1)' : 'rgba(5, 150, 105, 0.1)',
                  color: appState.isNightMode ? '#10b981' : '#059669',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '14px',
                  transition: 'all 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
                  flexShrink: 0
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = appState.isNightMode ? 'rgba(16, 185, 129, 0.15)' : 'rgba(5, 150, 105, 0.15)';
                  e.currentTarget.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = appState.isNightMode ? 'rgba(16, 185, 129, 0.1)' : 'rgba(5, 150, 105, 0.1)';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
                title="更新当前方案"
              >
                <i className="fas fa-sync-alt"></i>
              </button>
            )}
          </div>

          {/* 当前方案提示 */}
          {currentProfile && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              style={{
                marginTop: '12px',
                padding: '10px 14px',
                borderRadius: '8px',
                background: appState.isNightMode ? 'rgba(16, 185, 129, 0.08)' : 'rgba(5, 150, 105, 0.08)',
                border: `1px solid ${appState.isNightMode ? 'rgba(16, 185, 129, 0.2)' : 'rgba(5, 150, 105, 0.2)'}`,
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <i className="fas fa-info-circle" style={{ 
                color: appState.isNightMode ? '#10b981' : '#059669',
                fontSize: '12px'
              }}></i>
              <span style={{
                fontSize: '12px',
                color: appState.isNightMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)',
                fontWeight: '300'
              }}>
                点击更新图标可保存修改到当前方案
              </span>
            </motion.div>
          )}
        </div>

        {/* API 设置卡片 */}
        <div style={{
          background: appState.isNightMode ? '#1a1a1a' : '#fff',
          border: appState.isNightMode ? '1px solid rgba(255,255,255,0.12)' : '1px solid rgba(0,0,0,0.08)',
          borderRadius: '16px',
          padding: '28px',
          marginBottom: '16px'
        }}>
          <h2 style={{
            fontSize: '14px',
            fontWeight: '400',
            color: appState.isNightMode ? '#e5e7eb' : '#1a1a1a',
            marginBottom: '24px',
            letterSpacing: '0.02em'
          }}>API 设置</h2>
          
          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              fontSize: '12px',
              color: '#9ca3af',
              marginBottom: '10px',
              letterSpacing: '0.03em'
            }}>API URL</label>
            <input
              type="text"
              value={apiUrl}
              onChange={(e) => setApiUrl(e.target.value)}
              placeholder="https://api.openai.com/v1"
              autoComplete="off"
              data-form-type="other"
              style={{
                width: '100%',
                padding: '14px 16px',
                borderRadius: '10px',
                border: appState.isNightMode ? '1px solid rgba(255,255,255,0.12)' : '1px solid rgba(0,0,0,0.08)',
                background: appState.isNightMode ? '#0a0a0a !important' : '#fff !important',
                color: appState.isNightMode ? '#e5e7eb !important' : '#1a1a1a !important',
                fontSize: '14px',
                outline: 'none',
                transition: 'background-color 5000s ease-in-out 0s',
                WebkitBoxShadow: `0 0 0 1000px ${appState.isNightMode ? '#0a0a0a' : '#fff'} inset !important`,
                boxShadow: `0 0 0 1000px ${appState.isNightMode ? '#0a0a0a' : '#fff'} inset !important`,
                WebkitTextFillColor: `${appState.isNightMode ? '#e5e7eb' : '#1a1a1a'} !important`
              }}
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              fontSize: '12px',
              color: '#9ca3af',
              marginBottom: '10px',
              letterSpacing: '0.03em'
            }}>API Key</label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-..."
              autoComplete="new-password"
              data-form-type="other"
              style={{
                width: '100%',
                padding: '14px 16px',
                borderRadius: '10px',
                border: appState.isNightMode ? '1px solid rgba(255,255,255,0.12)' : '1px solid rgba(0,0,0,0.08)',
                background: appState.isNightMode ? '#0a0a0a !important' : '#fff !important',
                color: appState.isNightMode ? '#e5e7eb !important' : '#1a1a1a !important',
                fontSize: '14px',
                outline: 'none',
                transition: 'background-color 5000s ease-in-out 0s',
                WebkitBoxShadow: `0 0 0 1000px ${appState.isNightMode ? '#0a0a0a' : '#fff'} inset !important`,
                boxShadow: `0 0 0 1000px ${appState.isNightMode ? '#0a0a0a' : '#fff'} inset !important`,
                WebkitTextFillColor: `${appState.isNightMode ? '#e5e7eb' : '#1a1a1a'} !important`
              }}
            />
          </div>

          <button 
            onClick={fetchModels}
            disabled={isLoading}
            style={{
              width: '100%',
              height: '48px',
              borderRadius: '12px',
              border: appState.isNightMode ? '1px solid #e5e7eb' : '1px solid #1a1a1a',
              background: appState.isNightMode ? '#e5e7eb' : '#1a1a1a',
              color: appState.isNightMode ? '#1a1a1a' : '#fff',
              fontSize: '14px',
              fontWeight: '400',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              letterSpacing: '0.01em',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              marginBottom: '24px',
              opacity: isLoading ? 0.5 : 1,
              transition: 'all 0.3s cubic-bezier(0.22, 1, 0.36, 1)'
            }}
          >
            {isLoading ? (
              <>
                <i className="fas fa-spinner fa-spin"></i>
                <span>获取中...</span>
              </>
            ) : (
              <>
                <i className="fas fa-download"></i>
                <span>拉取模型列表</span>
              </>
            )}
          </button>

          {appState.apiSettings?.availableModels?.length > 0 && (
            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                fontSize: '12px',
                fontWeight: '300',
                color: '#9ca3af',
                marginBottom: '10px',
                letterSpacing: '0.03em'
              }}>选择模型</label>
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
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
                  transition: 'all 0.3s cubic-bezier(0.22, 1, 0.36, 1)'
                }}
              >
                {appState.apiSettings.availableModels.map((model: string) => (
                  <option key={model} value={model}>{model}</option>
                ))}
              </select>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <button 
              onClick={saveSettings}
              style={{
                height: '48px',
                borderRadius: '12px',
                border: appState.isNightMode ? '1px solid rgba(255,255,255,0.12)' : '1px solid rgba(0,0,0,0.08)',
                background: 'transparent',
                color: appState.isNightMode ? '#e5e7eb' : '#1a1a1a',
                fontSize: '14px',
                fontWeight: '400',
                cursor: 'pointer',
                letterSpacing: '0.01em',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'all 0.3s cubic-bezier(0.22, 1, 0.36, 1)'
              }}
            >
              <i className="fas fa-save"></i>
              <span>保存设置</span>
            </button>

            <button 
              onClick={() => setShowSaveDialog(true)}
              style={{
                height: '48px',
                borderRadius: '12px',
                border: appState.isNightMode ? '1px solid rgba(255,255,255,0.12)' : '1px solid rgba(0,0,0,0.08)',
                background: 'transparent',
                color: appState.isNightMode ? '#e5e7eb' : '#1a1a1a',
                fontSize: '14px',
                fontWeight: '400',
                cursor: 'pointer',
                letterSpacing: '0.01em',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'all 0.3s cubic-bezier(0.22, 1, 0.36, 1)'
              }}
            >
              <i className="fas fa-plus-circle"></i>
              <span>另存为方案</span>
            </button>
          </div>

          {message && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                marginTop: '20px',
                padding: '16px',
                borderRadius: '10px',
                background: appState.isNightMode ? 'rgba(255,255,255,0.05)' : '#f9fafb',
                border: appState.isNightMode ? '1px solid rgba(255,255,255,0.12)' : '1px solid #e5e7eb',
                fontSize: '13px',
                color: appState.isNightMode ? '#9ca3af' : '#6b7280',
                fontWeight: '300',
                letterSpacing: '0.01em',
                textAlign: 'center'
              }}
            >
              {message}
            </motion.div>
          )}
        </div>
      </div>

      {/* 方案管理弹窗 */}
      <AnimatePresence>
        {showProfileManager && (
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
            onClick={() => setShowProfileManager(false)}
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
              {/* 弹窗头部 */}
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
                  margin: 0,
                  letterSpacing: '-0.2px'
                }}>配置方案</h2>
                <button
                  onClick={() => setShowProfileManager(false)}
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
                    fontSize: '14px',
                    transition: 'all 0.2s'
                  }}
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>

              {/* 方案列表 */}
              <div style={{
                flex: 1,
                overflowY: 'auto',
                padding: '20px'
              }}>
                {profiles.length === 0 ? (
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
                    {profiles.map((profile: any) => (
                      <motion.div
                        key={profile.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        style={{
                          background: currentProfileId === profile.id
                            ? (appState.isNightMode 
                              ? 'linear-gradient(135deg, rgba(30, 30, 30, 0.8) 0%, rgba(20, 20, 20, 0.9) 100%)' 
                              : 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(245, 245, 245, 0.8) 100%)')
                            : (appState.isNightMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)'),
                          border: currentProfileId === profile.id 
                            ? (appState.isNightMode ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid rgba(0, 0, 0, 0.15)')
                            : (appState.isNightMode ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(0, 0, 0, 0.06)'),
                          borderRadius: '12px',
                          padding: '16px',
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                        onClick={() => switchProfile(profile.id)}
                        onMouseEnter={(e) => {
                          if (currentProfileId !== profile.id) {
                            e.currentTarget.style.background = appState.isNightMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (currentProfileId !== profile.id) {
                            e.currentTarget.style.background = appState.isNightMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)';
                          }
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                              {currentProfileId === profile.id && (
                                <i className="fas fa-check-circle" style={{ 
                                  color: appState.isNightMode ? '#10b981' : '#059669',
                                  fontSize: '14px'
                                }}></i>
                              )}
                              <h3 style={{
                                fontSize: '15px',
                                fontWeight: '500',
                                color: appState.isNightMode ? '#fff' : '#1a1a1a',
                                margin: 0,
                                letterSpacing: '-0.1px'
                              }}>{profile.name}</h3>
                            </div>
                            <p style={{
                              fontSize: '12px',
                              color: appState.isNightMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
                              margin: '4px 0 0 0',
                              fontWeight: '300'
                            }}>
                              {new Date(profile.createdAt).toLocaleDateString('zh-CN')}
                            </p>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteProfile(profile.id);
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
                              fontSize: '13px',
                              transition: 'all 0.2s'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = appState.isNightMode ? 'rgba(239, 68, 68, 0.25)' : 'rgba(239, 68, 68, 0.2)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = appState.isNightMode ? 'rgba(239, 68, 68, 0.15)' : 'rgba(239, 68, 68, 0.1)';
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

      {/* 保存方案对话框 */}
      <AnimatePresence>
        {showSaveDialog && (
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
              setShowSaveDialog(false);
              setNewProfileName('');
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
                marginBottom: '8px',
                letterSpacing: '-0.2px'
              }}>保存为新方案</h2>
              <p style={{
                fontSize: '13px',
                color: appState.isNightMode ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)',
                marginBottom: '24px',
                fontWeight: '300'
              }}>为当前配置命名，以便快速切换</p>

              <input
                type="text"
                value={newProfileName}
                onChange={(e) => setNewProfileName(e.target.value)}
                placeholder="例如：OpenAI GPT-4"
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
                  marginBottom: '20px',
                  transition: 'all 0.3s cubic-bezier(0.22, 1, 0.36, 1)'
                }}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && newProfileName.trim()) {
                    saveAsProfile();
                  }
                }}
              />

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <button
                  onClick={() => {
                    setShowSaveDialog(false);
                    setNewProfileName('');
                  }}
                  style={{
                    height: '44px',
                    borderRadius: '10px',
                    border: appState.isNightMode ? '1px solid rgba(255,255,255,0.12)' : '1px solid rgba(0,0,0,0.08)',
                    background: 'transparent',
                    color: appState.isNightMode ? '#e5e7eb' : '#1a1a1a',
                    fontSize: '14px',
                    fontWeight: '400',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  取消
                </button>
                <button
                  onClick={saveAsProfile}
                  disabled={!newProfileName.trim()}
                  style={{
                    height: '44px',
                    borderRadius: '10px',
                    border: 'none',
                    background: newProfileName.trim() 
                      ? (appState.isNightMode ? '#e5e7eb' : '#1a1a1a')
                      : (appState.isNightMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'),
                    color: newProfileName.trim()
                      ? (appState.isNightMode ? '#1a1a1a' : '#fff')
                      : (appState.isNightMode ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)'),
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: newProfileName.trim() ? 'pointer' : 'not-allowed',
                    transition: 'all 0.2s'
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