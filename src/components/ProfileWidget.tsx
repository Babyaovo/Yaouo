interface ProfileWidgetProps {
  appState: any;
  onUpdate: (updates: any) => void;
}

export function ProfileWidget({ appState, onUpdate }: ProfileWidgetProps) {
  const handleImageUpload = (type: 'avatar' | 'background') => {
    const input = document.getElementById('image-upload') as HTMLInputElement;
    input.setAttribute('data-widget', type === 'avatar' ? 'profile-avatar' : 'profile-bg');
    input.click();
  };

  return (
    <div className="profile-widget">
      <div className="profile-background">
        {appState.widgetImages['profile-bg'] ? (
          <img src={appState.widgetImages['profile-bg']} alt="Background" />
        ) : (
          <div className="placeholder" style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(0,0,0,0.3)' }}>
            <i className="fas fa-image" style={{ fontSize: '24px' }}></i>
          </div>
        )}
      </div>

      <div className="background-change-btn" onClick={() => handleImageUpload('background')}>
        <i className="fas fa-camera"></i>
      </div>

      <div className="profile-content">
        <div className="profile-top">
          <div className="profile-left">
            <div className="profile-avatar" onClick={() => handleImageUpload('avatar')}>
              {appState.widgetImages['profile-avatar'] ? (
                <img src={appState.widgetImages['profile-avatar']} alt="Avatar" />
              ) : (
                <div className="placeholder">+</div>
              )}
            </div>
            <div 
              className="profile-location" 
              contentEditable 
              suppressContentEditableWarning
              onBlur={(e) => onUpdate({ profileLocation: e.currentTarget.textContent || '' })}
            >
              {appState.profileLocation}
            </div>
          </div>

          <div className="profile-right">
            <div 
              className="profile-name" 
              contentEditable 
              suppressContentEditableWarning
              onBlur={(e) => onUpdate({ profileName: e.currentTarget.textContent || '' })}
            >
              {appState.profileName}
            </div>
            <div 
              className="profile-bio" 
              contentEditable 
              suppressContentEditableWarning
              onBlur={(e) => onUpdate({ profileBio: e.currentTarget.textContent || '' })}
            >
              {appState.profileBio}
            </div>
          </div>
        </div>

        <div className="profile-tags">
          {appState.tags.map((tag: string, index: number) => (
            <div 
              key={index}
              className="tag" 
              contentEditable 
              suppressContentEditableWarning
              onBlur={(e) => {
                const newTags = [...appState.tags];
                newTags[index] = e.currentTarget.textContent || '';
                onUpdate({ tags: newTags });
              }}
            >
              {tag}
            </div>
          ))}
        </div>

        <div className="profile-stats">
          <div className="stat">
            <div 
              className="stat-number" 
              contentEditable 
              suppressContentEditableWarning
              onBlur={(e) => onUpdate({ followers: e.currentTarget.textContent || '' })}
            >
              {appState.followers}
            </div>
            <div className="stat-label">Followers</div>
          </div>
          <div className="stat">
            <div 
              className="stat-number" 
              contentEditable 
              suppressContentEditableWarning
              onBlur={(e) => onUpdate({ following: e.currentTarget.textContent || '' })}
            >
              {appState.following}
            </div>
            <div className="stat-label">Following</div>
          </div>
          <div className="stat">
            <div 
              className="stat-number" 
              contentEditable 
              suppressContentEditableWarning
              onBlur={(e) => onUpdate({ posts: e.currentTarget.textContent || '' })}
            >
              {appState.posts}
            </div>
            <div className="stat-label">Posts</div>
          </div>
        </div>
      </div>
    </div>
  );
}