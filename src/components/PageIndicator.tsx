interface PageIndicatorProps {
  currentPage: number;
  onPageChange: (page: number) => void;
}

export function PageIndicator({ currentPage, onPageChange }: PageIndicatorProps) {
  return (
    <div className="page-indicator">
      <div 
        className={`page-dot ${currentPage === 0 ? 'active' : ''}`}
        onClick={() => onPageChange(0)}
      ></div>
      <div 
        className={`page-dot ${currentPage === 1 ? 'active' : ''}`}
        onClick={() => onPageChange(1)}
      ></div>
    </div>
  );
}
