import { useState } from 'react';

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

  const handleGenerate = async () => {
    if (!appState.apiSettings.selectedModel) {
      setMessage('请先选择一个模型');
      return;
    }

    setIsLoading(true);
    setMessage('正在生成角色卡片...');

    try {
      const response = await fetch(`${apiUrl}/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: appState.apiSettings.selectedModel,
          prompt: '生成一个角色设定',
          max_tokens: 150
        })
      });

      if (!response.ok) {
        throw new Error('生成角色卡片失败');
      }

      const data = await response.json();
      const roleDescription = data.choices[0].text.trim();
      
      onUpdate({
        roleDescription
      });

      setMessage('角色卡片生成成功');
    } catch (error) {
      setMessage('生成角色卡片失败，请检查设置');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-page settings-page">
      <div className="app-header">
        <button className="back-btn" onClick={onClose}>
          <i className="fas fa-chevron-left"></i>
        </button>
        <h1>设置</h1>
        <div style={{ width: '40px' }}></div>
      </div>

      <div className="app-content">
        <div className="settings-section">
          <h2 className="section-title">API 设置</h2>
          
          <div className="form-group">
            <label>API URL</label>
            <input
              type="text"
              value={apiUrl}
              onChange={(e) => setApiUrl(e.target.value)}
              placeholder="https://api.openai.com/v1"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label>API Key</label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-..."
              className="form-input"
            />
          </div>

          <button 
            className="primary-btn"
            onClick={fetchModels}
            disabled={isLoading}
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
            <div className="form-group">
              <label>选择模型</label>
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="form-select"
              >
                {appState.apiSettings.availableModels.map((model: string) => (
                  <option key={model} value={model}>{model}</option>
                ))}
              </select>
            </div>
          )}

          <button className="secondary-btn" onClick={saveSettings}>
            <i className="fas fa-save"></i>
            <span>保存设置</span>
          </button>

          {message && (
            <div className="message-box text-[rgb(0,0,0)]">
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}