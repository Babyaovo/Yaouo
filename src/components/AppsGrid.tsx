interface AppsGridProps {
  onOpenApp: (appName: string) => void;
  customIcons?: Record<string, string>;
  customNames?: Record<string, string>;
  customIconImages?: Record<string, string>;
}

export function AppsGrid({ onOpenApp, customIcons, customNames, customIconImages }: AppsGridProps) {
  const defaultApps = [
    { id: 'settings', icon: 'fa-cog', name: '设置' },
    { id: 'contacts', icon: 'fa-address-book', name: '联系人' },
    { id: 'chat-list', icon: 'fa-comments', name: '聊天' },
    { id: 'gallery', icon: 'fa-images', name: '画廊' },
    { id: 'calendar', icon: 'fa-calendar', name: '日历' },
    { id: 'vestige', icon: 'fa-archive', name: '记忆印痕' },
    { id: 'maps', icon: 'fa-map-marked-alt', name: '地图' },
    { id: 'weather', icon: 'fa-cloud-sun', name: '天气' },
  ];

  const apps = defaultApps.map(app => ({
    ...app,
    icon: customIcons?.[app.id] || app.icon,
    name: customNames?.[app.id] || app.name,
    iconImage: customIconImages?.[app.id]
  }));

  return (
    <div className="apps-grid">
      {apps.map((app) => (
        <div 
          key={app.id} 
          className="app-item"
          onClick={() => {
            if (['settings', 'contacts', 'chat-list', 'gallery', 'calendar', 'vestige'].includes(app.id)) {
              onOpenApp(app.id);
            }
          }}
        >
          <div className="app-icon-wrapper">
            {app.iconImage ? (
              <img src={app.iconImage} alt={app.name} className="app-icon-image" />
            ) : (
              <i className={`fas ${app.icon} app-icon`}></i>
            )}
          </div>
          <div className="app-name">{app.name}</div>
        </div>
      ))}
    </div>
  );
}