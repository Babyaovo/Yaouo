import React from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface IOSMessageMenuProps {
  isVisible: boolean;
  x: number;
  y: number;
  onAction: (action: string) => void;
  onClose: () => void;
  isUser: boolean;
  canRegenerate?: boolean;
}

export function IOSMessageMenu({ isVisible, x, y, onAction, onClose, isUser, canRegenerate }: IOSMessageMenuProps) {
  if (!isVisible) return null;

  return (
    <>
      <div 
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9998,
          background: 'transparent'
        }}
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 10 }}
        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
        style={{
          position: 'fixed',
          left: Math.min(window.innerWidth - 200, Math.max(20, x - 100)),
          top: y - 70,
          zIndex: 9999,
          display: 'flex',
          background: 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          borderRadius: '14px',
          padding: '4px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
          border: '0.5px solid rgba(0, 0, 0, 0.1)',
          pointerEvents: 'auto'
        }}
        className="ios-context-menu"
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {isUser && (
            <MenuButton icon="fas fa-edit" label="编辑" onClick={() => onAction('edit')} />
          )}
          {!isUser && canRegenerate && (
            <MenuButton icon="fas fa-redo-alt" label="重新请求" onClick={() => onAction('regenerate')} />
          )}
          <MenuButton icon="fas fa-reply" label="引用" onClick={() => onAction('quote')} />
          <MenuButton icon="fas fa-trash-alt" label="删除" onClick={() => onAction('delete')} />
          <MenuButton icon="fas fa-tasks" label="多选" onClick={() => onAction('multiSelect')} />
        </div>
        
        {/* Triangle arrow */}
        <div style={{
          position: 'absolute',
          bottom: '-6px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '0',
          height: '0',
          borderLeft: '6px solid transparent',
          borderRight: '6px solid transparent',
          borderTop: '6px solid rgba(255, 255, 255, 0.85)'
        }} />
      </motion.div>

      <style>{`
        body.night-mode .ios-context-menu {
          background: rgba(40, 40, 40, 0.85) !important;
          border-color: rgba(255, 255, 255, 0.1) !important;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5) !important;
        }
        body.night-mode .ios-context-menu > div:last-child {
          border-top-color: rgba(40, 40, 40, 0.85) !important;
        }
      `}</style>
    </>
  );
}

function MenuButton({ icon, label, onClick }: { icon: string; label: string; onClick: () => void }) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      style={{
        background: 'transparent',
        border: 'none',
        padding: '8px 12px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '4px',
        cursor: 'pointer',
        color: 'inherit',
        minWidth: '50px'
      }}
    >
      <i className={icon} style={{ fontSize: '14px' }}></i>
      <span style={{ fontSize: '10px', opacity: 0.8, fontWeight: '500' }}>{label}</span>
    </button>
  );
}
