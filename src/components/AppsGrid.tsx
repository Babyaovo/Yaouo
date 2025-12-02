interface AppsGridProps {
  onOpenApp: (appName: string) => void;
  appState?: any;
}

export function AppsGrid({ onOpenApp, appState }: AppsGridProps) {
  const apps = [
    { id: 'settings', icon: 'fa-cog', name: '设置' },
    { id: 'contacts', icon: 'fa-address-book', name: '联系人' },
    { id: 'chat-list', icon: 'fa-comments', name: '聊天' },
    { id: 'gallery', icon: 'fa-palette', name: '画廊' },
    { id: 'calendar', icon: 'fa-calendar', name: '日历' },
    { id: 'notes', icon: 'fa-sticky-note', name: '笔记' },
    { id: 'maps', icon: 'fa-map-marked-alt', name: '地图' },
    { id: 'weather', icon: 'fa-cloud-sun', name: '天气' },
  ];

  const getAppIcon = (app: typeof apps[0]) => {
    const customIcon = appState?.appIcons?.[app.id];
    if (customIcon) {
      // 如果是图片URL，返回img标签
      if (customIcon.startsWith('data:') || customIcon.startsWith('http')) {
        return <img src={customIcon} alt={app.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '16px' }} />;
      }
      // 如果是FontAwesome类名
      return <i className={`${customIcon} app-icon`}></i>;
    }
    // 默认图标
    return <i className={`fas ${app.icon} app-icon`}></i>;
  };

  const getAppName = (app: typeof apps[0]) => {
    return appState?.appNames?.[app.id] || app.name;
  };

  return (
    <div className="apps-grid">
      {apps.map((app) => (
        <div 
          key={app.id} 
          className="app-item"
          onClick={() => {
            if (['settings', 'contacts', 'chat-list', 'gallery'].includes(app.id)) {
              onOpenApp(app.id);
            }
          }}
        >
          <div className="app-icon-wrapper">
            {getAppIcon(app)}
          </div>
          <div className="app-name">{getAppName(app)}</div>
        </div>
      ))}
    </div>
  );
}