interface StatusBarProps {
  isNightMode: boolean;
  onToggleTheme: () => void;
}

export function StatusBar({ isNightMode, onToggleTheme }: StatusBarProps) {
  return (
    <div className="status-bar">
      <div className={`theme-toggle ${isNightMode ? 'night' : 'day'}`} onClick={onToggleTheme}>
        <div className="theme-toggle-slider"></div>
      </div>
    </div>
  );
}
