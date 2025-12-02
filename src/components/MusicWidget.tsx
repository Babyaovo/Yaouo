interface MusicWidgetProps {
  appState: any;
  onUpdate: (updates: any) => void;
}

export function MusicWidget({ appState, onUpdate }: MusicWidgetProps) {
  const togglePlayPause = () => {
    onUpdate({ isPlaying: !appState.isPlaying });
  };

  const handleVinylClick = () => {
    const input = document.getElementById('image-upload') as HTMLInputElement;
    input.setAttribute('data-widget', 'music');
    input.click();
  };

  return (
    <div className="widget-item large">
      <div className="music-widget">
        <div className="music-left">
          <div className="vinyl-container">
            <div 
              className="vinyl-disc" 
              style={{ animationPlayState: appState.isPlaying ? 'running' : 'paused' }}
              onClick={handleVinylClick}
            >
              {appState.widgetImages['music'] ? (
                <img src={appState.widgetImages['music']} alt="Album Cover" />
              ) : (
                <div className="placeholder" style={{ color: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', borderRadius: '50%' }}>
                  <i className="fas fa-music"></i>
                </div>
              )}
              <div className="vinyl-center"></div>
            </div>
            <div className={`record-arm ${appState.isPlaying ? 'playing' : ''}`}></div>
          </div>

          <div className="music-controls-compact">
            <div className="music-progress-compact">
              <div className="music-progress-bar-compact" style={{ width: `${appState.progress}%` }}></div>
            </div>
            <div className="music-buttons-compact">
              <button className="music-button-compact">
                <i className="fas fa-backward"></i>
              </button>
              <button className="music-button-compact play-pause" onClick={togglePlayPause}>
                <i className={`fas fa-${appState.isPlaying ? 'pause' : 'play'}`}></i>
              </button>
              <button className="music-button-compact">
                <i className="fas fa-forward"></i>
              </button>
            </div>
          </div>
        </div>

        <div className="music-right">
          <div className="lyrics-container">
            <div 
              className="lyric-line main" 
              contentEditable 
              suppressContentEditableWarning
              onBlur={(e) => onUpdate({ musicTitle: e.currentTarget.textContent || '' })}
            >
              {appState.musicTitle}
            </div>
            {appState.lyrics.map((lyric: string, index: number) => (
              <div 
                key={index}
                className="lyric-line sub" 
                contentEditable 
                suppressContentEditableWarning
                onBlur={(e) => {
                  const newLyrics = [...appState.lyrics];
                  newLyrics[index] = e.currentTarget.textContent || '';
                  onUpdate({ lyrics: newLyrics });
                }}
              >
                {lyric}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
