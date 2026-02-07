import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { StatusBar } from './components/StatusBar';
import { ProfileWidget } from './components/ProfileWidget';
import { MusicWidget } from './components/MusicWidget';
import { AppsGrid } from './components/AppsGrid';
import { PageIndicator } from './components/PageIndicator';
import { Dock } from './components/Dock';
import { SettingsPage } from './components/pages/SettingsPage';
import { ContactsApp } from './components/apps/ContactsApp';
import { ChatApp } from './components/apps/ChatApp';
import { GalleryApp } from './components/apps/GalleryApp';
import { CalendarApp } from './components/apps/CalendarApp';
import { Vestige } from './components/apps/Vestige';
import './styles/calendar.css';

interface AppState {
  currentPage: number;
  isNightMode: boolean;
  widgetImages: Record<string, string>;
  profileName: string;
  profileLocation: string;
  profileBio: string;
  tags: string[];
  followers: string;
  following: string;
  posts: string;
  musicTitle: string;
  lyrics: string[];
  progress: number;
  isPlaying: boolean;
  currentApp: string | null;
  homeWallpaper: string;
  apiSettings: {
    apiUrl: string;
    apiKey: string;
    selectedModel: string;
    availableModels: string[];
  };
  apiProfiles?: Array<{ // 新增：API配置方案
    id: string;
    name: string;
    apiUrl: string;
    apiKey: string;
    selectedModel: string;
    createdAt: number;
  }>;
  currentProfileId?: string; // 新增：当前使用的方案ID
  userProfiles?: Array<{ // 新增：用户信息方案
    id: string;
    name: string;
    userName: string;
    userAvatar: string;
    userSettings: string;
    createdAt: number;
  }>;
  currentUserProfileId?: string; // 新增：当前使用的用户信息方案ID
  contacts: any[];
  chats: any[];
  moments: any[];
  currentChatId: string | null;
  currentContactId: string | null;
  customAppIcons?: Record<string, string>;
  customAppNames?: Record<string, string>;
  customAppIconImages?: Record<string, string>;
  customBubbleCSS?: string;
  customChatCSS?: string;
  myCalendarEvents?: Record<string, any>;
  vestigeArtifacts?: any[];
  characters?: any[];
  userInfo?: {
    name: string;
    avatar: string;
  };
}

export default function App() {
  const [appState, setAppState] = useState<AppState>({
    currentPage: 0,
    isNightMode: false,
    widgetImages: {},
    profileName: "Your Name",
    profileLocation: "📍 Beijing",
    profileBio: "Write your personal bio here. This is a wider input area for your introduction...",
    tags: ["#Design", "#Travel", "#Music", "#Art"],
    followers: "12.5K",
    following: "856",
    posts: "347",
    musicTitle: "Song Title - Main Lyrics",
    lyrics: ["Second line lyrics", "Third line lyrics", "Fourth line lyrics"],
    progress: 45,
    isPlaying: false,
    currentApp: null,
    homeWallpaper: '',
    apiSettings: {
      apiUrl: '',
      apiKey: '',
      selectedModel: '',
      availableModels: []
    },
    contacts: [],
    chats: [],
    moments: [],
    currentChatId: null,
    currentContactId: null
  });

  useEffect(() => {
    const savedState = localStorage.getItem('phoneAppState');
    if (savedState) {
      const parsed = JSON.parse(savedState);
      setAppState(parsed);
      
      // 恢复自定义CSS
      if (parsed.customBubbleCSS) {
        let styleEl = document.getElementById('custom-bubble-style');
        if (!styleEl) {
          styleEl = document.createElement('style');
          styleEl.id = 'custom-bubble-style';
          document.head.appendChild(styleEl);
        }
        styleEl.textContent = parsed.customBubbleCSS;
      }
      
      if (parsed.customChatCSS) {
        let styleEl = document.getElementById('custom-chat-style');
        if (!styleEl) {
          styleEl = document.createElement('style');
          styleEl.id = 'custom-chat-style';
          document.head.appendChild(styleEl);
        }
        styleEl.textContent = parsed.customChatCSS;
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('phoneAppState', JSON.stringify(appState));
    document.body.className = appState.isNightMode ? 'night-mode' : 'day-mode';
  }, [appState]);

  const toggleTheme = () => {
    setAppState(prev => ({ ...prev, isNightMode: !prev.isNightMode }));
  };

  const goToPage = (page: number) => {
    setAppState(prev => ({ ...prev, currentPage: page }));
  };

  const updateProfile = (updates: Partial<AppState>) => {
    setAppState(prev => ({ ...prev, ...updates }));
  };

  const openApp = (appName: string) => {
    setAppState(prev => ({ ...prev, currentApp: appName }));
  };

  const closeApp = () => {
    setAppState(prev => ({ ...prev, currentApp: null, currentChatId: null, currentContactId: null }));
  };

  const handleTouchSwipe = (e: React.TouchEvent) => {
    if (appState.currentApp) return; // 禁用app内滑动切换页面
    
    const startX = e.touches[0]?.clientX;
    
    const handleTouchEnd = (endEvent: TouchEvent) => {
      const endX = endEvent.changedTouches[0].clientX;
      const diff = startX - endX;
      const threshold = 50;

      if (Math.abs(diff) > threshold) {
        if (diff > 0 && appState.currentPage < 1) {
          goToPage(appState.currentPage + 1);
        } else if (diff < 0 && appState.currentPage > 0) {
          goToPage(appState.currentPage - 1);
        }
      }
      document.removeEventListener('touchend', handleTouchEnd);
    };

    document.addEventListener('touchend', handleTouchEnd);
  };

  const openChat = (chatId: string) => {
    setAppState(prev => ({ ...prev, currentChatId: chatId, currentApp: 'chat-list' }));
  };

  const openContactDetail = (contactId: string) => {
    setAppState(prev => ({ ...prev, currentContactId: contactId, currentApp: 'contact-detail' }));
  };

  const openEditContact = (contactId?: string) => {
    setAppState(prev => ({ 
      ...prev, 
      currentContactId: contactId || null, 
      currentApp: 'edit-contact' 
    }));
  };

  const openContactPicker = () => {
    setAppState(prev => ({ ...prev, currentApp: 'contact-picker' }));
  };

  const handleContactSelect = (contactId: string) => {
    const contact = appState.contacts.find((c: any) => c.id === contactId);
    if (!contact) return;

    // 检查是否已有此联系人的聊天
    const existingChat = appState.chats.find((c: any) => c.contactId === contactId);
    if (existingChat) {
      openChat(existingChat.id);
      return;
    }

    // 创建新聊天
    const newChat = {
      id: Date.now().toString(),
      contactId: contact.id,
      charName: contact.charName,
      charAvatar: contact.charAvatar,
      messages: [],
      lastMessage: '',
      lastTime: Date.now(),
      wallpaper: '',
      settings: {
        contextRounds: 10,
        temperature: 0.8,
        coreMemory: '',
        memoryInterval: 10,
        showAIAvatar: true,
        showUserAvatar: true,
        headerDisplayMode: 'both',
        chatMode: 'message'
      }
    };

    setAppState(prev => ({
      ...prev,
      chats: [...prev.chats, newChat]
    }));
    
    openChat(newChat.id);
  };

  const handleViewContact = (contactId: string) => {
    // 关闭当前chat app，打开contacts app并显示详情
    setAppState(prev => ({
      ...prev,
      currentContactId: contactId,
      currentApp: 'contacts'
    }));
  };

  // 渲染当前打开的app
  const renderCurrentApp = () => {
    switch (appState.currentApp) {
      case 'settings':
        return <SettingsPage appState={appState} onUpdate={updateProfile} onClose={closeApp} />;
      case 'contacts':
        return <ContactsApp 
          appState={appState} 
          onUpdate={updateProfile} 
          onClose={closeApp}
          onStartChat={handleContactSelect}
          onViewContact={handleViewContact}
        />;
      case 'chat-list':
        return <ChatApp 
          appState={appState} 
          onUpdate={updateProfile}
          onClose={closeApp}
          onViewContact={handleViewContact}
        />;
      case 'gallery':
        return <GalleryApp 
          appState={appState} 
          onUpdate={updateProfile}
          onClose={closeApp}
        />;
      case 'calendar':
        return <CalendarApp 
          appState={appState} 
          onUpdate={updateProfile}
          onClose={closeApp}
        />;
      case 'vestige':
        return <Vestige 
          appState={appState} 
          onUpdate={updateProfile}
          onClose={closeApp}
        />;
      default:
        return null;
    }
  };

  return (
    <div className="phone-interface">
      <StatusBar isNightMode={appState.isNightMode} onToggleTheme={toggleTheme} />
      
      <div 
        className="screen-container"
        style={{
          backgroundImage: appState.homeWallpaper ? `url(${appState.homeWallpaper})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div 
          className="pages-container" 
          style={{ transform: `translateX(-${appState.currentPage * 50}%)` }}
          onTouchStart={handleTouchSwipe}
        >
          <div className="page" id="page-0">
            <div className="widget-item extra-large">
              <ProfileWidget 
                appState={appState}
                onUpdate={updateProfile}
              />
            </div>
            
            <AppsGrid 
              onOpenApp={openApp}
              customIcons={appState.customAppIcons}
              customNames={appState.customAppNames}
              customIconImages={appState.customAppIconImages}
            />
          </div>

          <div className="page" id="page-1">
            <div className="widgets-grid">
              <MusicWidget 
                appState={appState}
                onUpdate={updateProfile}
              />
              
              <div className="widget-item small left-top image-widget" onClick={() => {
                const input = document.getElementById('image-upload') as HTMLInputElement;
                input.setAttribute('data-widget', 'image1');
                input.click();
              }}>
                {appState.widgetImages['image1'] ? (
                  <img src={appState.widgetImages['image1']} alt="Widget 1" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '20px' }} />
                ) : (
                  <div className="image-placeholder">
                    <i className="fas fa-image"></i>
                    <div>Add Image</div>
                  </div>
                )}
              </div>

              <div className="widget-item small right-bottom image-widget" onClick={() => {
                const input = document.getElementById('image-upload') as HTMLInputElement;
                input.setAttribute('data-widget', 'image2');
                input.click();
              }}>
                {appState.widgetImages['image2'] ? (
                  <img src={appState.widgetImages['image2']} alt="Widget 2" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '20px' }} />
                ) : (
                  <div className="image-placeholder">
                    <i className="fas fa-image"></i>
                    <div>Add Image</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <PageIndicator currentPage={appState.currentPage} onPageChange={goToPage} />
        <Dock onOpenApp={openApp} currentApp={appState.currentApp} />
      </div>

      <input 
        type="file" 
        id="image-upload" 
        className="hidden-file-input" 
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            const widgetId = (e.target as HTMLInputElement).getAttribute('data-widget');
            const reader = new FileReader();
            reader.onload = (event) => {
              if (widgetId && event.target?.result) {
                setAppState(prev => ({
                  ...prev,
                  widgetImages: {
                    ...prev.widgetImages,
                    [widgetId]: event.target.result as string
                  }
                }));
              }
            };
            reader.readAsDataURL(file);
          }
          e.target.value = '';
        }}
      />

      <AnimatePresence mode="sync">
        {appState.currentApp && (
          <motion.div
            key={appState.currentApp}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            style={{ 
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%', 
              height: '100%',
              zIndex: 10000,
              backgroundColor: appState.isNightMode ? '#0a0a0a' : '#f8fafc'
            }}
          >
            {renderCurrentApp()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}