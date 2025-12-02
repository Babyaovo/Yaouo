interface AppsGridProps {
  onOpenApp: (appName: string) => void;
}

export function AppsGrid({ onOpenApp }: AppsGridProps) {
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
            <i className={`fas ${app.icon} app-icon`}></i>
          </div>
          <div className="app-name">{app.name}</div>
        </div>
      ))}
    </div>
  );
}