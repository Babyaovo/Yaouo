import { useState } from 'react';

interface DockProps {
  onOpenApp: (appName: string) => void;
  currentApp: string | null;
}

export function Dock({ onOpenApp, currentApp }: DockProps) {
  const [activeItem, setActiveItem] = useState('home');

  const dockItems = [
    { id: 'home', icon: 'fa-home', name: '主页', appName: null },
    { id: 'contacts', icon: 'fa-address-book', name: '联系人', appName: 'contacts' },
    { id: 'chat', icon: 'fa-comments', name: '聊天', appName: 'chat-list' },
    { id: 'settings', icon: 'fa-cog', name: '设置', appName: 'settings' },
  ];

  const handleClick = (item: typeof dockItems[0]) => {
    setActiveItem(item.id);
    if (item.appName) {
      onOpenApp(item.appName);
    } else {
      onOpenApp(''); // 关闭app返回主页
    }
  };

  return (
    <div className="dock mt-[0px] mr-[20px] mb-[30px] ml-[20px]">
      {dockItems.map((item) => (
        <div 
          key={item.id}
          className={`dock-item ${!currentApp && activeItem === item.id ? 'active' : ''} ${currentApp === item.appName ? 'active' : ''}`}
          onClick={() => handleClick(item)}
        >
          <div className="dock-icon">
            <i className={`fas ${item.icon}`}></i>
          </div>
          <div className="dock-name">{item.name}</div>
        </div>
      ))}
    </div>
  );
}