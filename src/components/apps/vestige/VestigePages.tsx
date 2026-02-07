import { motion } from 'motion/react';
import { Artifact, MediaType } from '../Vestige';
import { 
  TornNoteView,
  PhotoView,
  VoiceMemoView,
  JournalView,
  LetterView
} from './MediaViews';

// 主页
export function HomePage({ onClose, onGenerate, onArchive, artifactCount, appState }: any) {
  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      background: appState?.isNightMode ? 'var(--surface-dark)' : 'var(--surface-light)',
      overflow: 'hidden'
    }}>
      {/* 统一风格顶栏 */}
      <div style={{
        padding: `max(env(safe-area-inset-top, 0px), var(--space-6)) var(--space-6) var(--space-4)`,
        background: appState?.isNightMode 
          ? 'linear-gradient(180deg, rgba(10, 10, 10, 0.98) 0%, rgba(10, 10, 10, 0.95) 80%, rgba(10, 10, 10, 0) 100%)'
          : 'linear-gradient(180deg, rgba(250, 250, 250, 0.98) 0%, rgba(250, 250, 250, 0.95) 80%, rgba(250, 250, 250, 0) 100%)',
        backdropFilter: 'blur(40px) saturate(180%)',
        WebkitBackdropFilter: 'blur(40px) saturate(180%)',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <button
            onClick={onClose}
            style={{
              width: '44px',
              height: '44px',
              borderRadius: 'var(--radius-full)',
              background: appState?.isNightMode 
                ? 'rgba(255, 255, 255, 0.05)' 
                : 'rgba(0, 0, 0, 0.04)',
              border: `1px solid ${appState?.isNightMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)'}`,
              color: appState?.isNightMode ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.8)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '16px',
              transition: 'all 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateX(-3px) scale(1.05)';
              e.currentTarget.style.background = appState?.isNightMode 
                ? 'rgba(255, 255, 255, 0.08)' 
                : 'rgba(0, 0, 0, 0.06)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateX(0) scale(1)';
              e.currentTarget.style.background = appState?.isNightMode 
                ? 'rgba(255, 255, 255, 0.05)' 
                : 'rgba(0, 0, 0, 0.04)';
            }}
          >
            <i className="fas fa-chevron-left"></i>
          </button>

          <h1 style={{
            fontSize: '20px',
            fontWeight: '600',
            color: appState?.isNightMode ? 'rgba(255, 255, 255, 0.95)' : 'rgba(0, 0, 0, 0.9)',
            letterSpacing: '-0.3px',
            margin: 0
          }}>
            Vestige
          </h1>

          <div style={{ width: '44px' }}></div>
        </div>
      </div>

      <div className="app-content" style={{ 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 32px'
      }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          style={{ textAlign: 'center', marginBottom: '80px' }}
        >
          <p style={{ 
            fontSize: '28px',
            letterSpacing: '0.15em',
            fontFamily: 'Georgia, serif',
            fontWeight: '300',
            fontStyle: 'italic'
          }} className="vestige-title">
            Vestige
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '16px' }}
        >
          <button
            onClick={onGenerate}
            className="vestige-action-btn"
            style={{
              width: '100%',
              padding: '40px 32px',
              cursor: 'pointer',
              transition: 'all 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <div style={{ 
              width: '48px',
              height: '48px',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <i className="fas fa-feather-alt vestige-icon" style={{ fontSize: '28px' }}></i>
            </div>
            <h3 className="vestige-btn-text" style={{ 
              fontSize: '15px',
              fontWeight: '400',
              letterSpacing: '0.05em',
              textAlign: 'center'
            }}>
              镌刻
            </h3>
          </button>

          <button
            onClick={onArchive}
            className="vestige-action-btn"
            style={{
              width: '100%',
              padding: '40px 32px',
              cursor: 'pointer',
              transition: 'all 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative'
            }}
          >
            <div style={{ 
              width: '48px',
              height: '48px',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <i className="fas fa-archive vestige-icon" style={{ fontSize: '28px' }}></i>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h3 className="vestige-btn-text" style={{ 
                fontSize: '15px',
                fontWeight: '400',
                letterSpacing: '0.05em',
                textAlign: 'center'
              }}>
                馆藏
              </h3>
              {artifactCount > 0 && (
                <span style={{
                  fontSize: '9px',
                  color: '#aaa',
                  fontFamily: 'monospace',
                  letterSpacing: '0.05em'
                }}>
                  {artifactCount}
                </span>
              )}
            </div>
          </button>
        </motion.div>
      </div>
    </div>
  );
}

// 选择联系人页面
export function SelectCharPage({ contacts, onBack, onSelect, appState }: any) {
  return (
    <div className="app-page" style={{ 
      background: appState?.isNightMode ? '#0a0a0a' : '#fafafa' 
    }}>
      <div className="app-header" style={{
        background: appState?.isNightMode ? 'rgba(26, 26, 26, 0.95)' : 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: appState?.isNightMode ? '1px solid rgba(255,255,255,0.12)' : '1px solid rgba(0,0,0,0.08)'
      }}>
        <button className="back-btn" onClick={onBack} style={{
          color: appState?.isNightMode ? '#e5e7eb' : '#1a1a1a'
        }}>
          <i className="fas fa-chevron-left"></i>
        </button>
        <h1 style={{ 
          fontWeight: '400', 
          fontSize: '17px', 
          letterSpacing: '0.01em',
          color: appState?.isNightMode ? '#e5e7eb' : '#1a1a1a'
        }}>选择</h1>
        <div style={{ width: 40 }}></div>
      </div>

      <div className="app-content" style={{ 
        padding: '0',
        background: appState?.isNightMode ? '#0a0a0a' : '#fafafa'
      }}>
        {contacts.length === 0 ? (
          <div className="empty-state">
            <i className="fas fa-user-friends"></i>
            <p>暂无联系人</p>
          </div>
        ) : (
          <div style={{ padding: '0 20px' }}>
            {contacts.map((contact: any, index: number) => (
              <motion.div
                key={contact.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <button
                  onClick={() => onSelect(contact)}
                  style={{
                    width: '100%',
                    background: 'transparent',
                    border: 'none',
                    borderBottom: appState?.isNightMode ? '1px solid rgba(255,255,255,0.08)' : '1px solid #e5e7eb',
                    padding: '24px 0',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px'
                  }}
                >
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    background: appState?.isNightMode ? '#1a1a1a' : '#f3f4f6',
                    border: appState?.isNightMode ? '1px solid rgba(255,255,255,0.08)' : '1px solid #e5e7eb',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    {contact.charAvatar ? (
                      <img 
                        src={contact.charAvatar} 
                        alt={contact.charName}
                        style={{
                          width: '100%',
                          height: '100%',
                          borderRadius: '50%',
                          objectFit: 'cover'
                        }}
                      />
                    ) : (
                      <span style={{ 
                        fontSize: '16px', 
                        color: appState?.isNightMode ? '#6b7280' : '#9ca3af', 
                        fontWeight: '300' 
                      }}>
                        {(contact.charName || contact.name || '?')[0]}
                      </span>
                    )}
                  </div>
                  <div style={{ flex: 1, textAlign: 'left', minWidth: 0 }}>
                    <h3 style={{ 
                      fontSize: '15px',
                      fontWeight: '400',
                      color: appState?.isNightMode ? '#e5e7eb' : '#111827',
                      marginBottom: '4px',
                      letterSpacing: '0.01em'
                    }}>
                      {contact.charName || contact.name}
                    </h3>
                    {contact.summary && (
                      <p style={{ 
                        fontSize: '13px',
                        color: '#9ca3af',
                        fontWeight: '300',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}>
                        {contact.summary}
                      </p>
                    )}
                  </div>
                  <i className="fas fa-chevron-right" style={{ 
                    fontSize: '12px', 
                    color: appState?.isNightMode ? '#374151' : '#d1d5db' 
                  }}></i>
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// 生成中页面
export function GeneratingPage({ charName }: any) {
  return (
    <div className="app-page" style={{ background: '#fafafa' }}>
      <div className="empty-state">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          style={{
            width: '48px',
            height: '48px',
            border: '1px solid #e5e7eb',
            borderTopColor: '#9ca3af',
            borderRadius: '50%',
            marginBottom: '32px'
          }}
        />
        <p style={{ 
          fontSize: '13px',
          color: '#9ca3af',
          fontWeight: '300',
          letterSpacing: '0.15em',
          marginBottom: '8px'
        }}>
          GENERATING
        </p>
        <p style={{ fontSize: '15px', color: '#6b7280', fontWeight: '300' }}>
          {charName}
        </p>
      </div>
    </div>
  );
}

// 查看记忆页面
export function ViewingPage({ artifact, isSaved, onSave, onNext, onBack }: any) {
  // 本地mediaLabels映射
  const mediaLabels: Record<string, string> = {
    torn_note: '撕下的笔记',
    inscribed_photo: '附言的照片',
    voice_memo: '独白的录音',
    journal_entry: '日记本',
    letter_to_user: '写给你的信',
    letter_to_other: '写给他人的信',
    letter_received: '收到的信'
  };

  return (
    <div className="app-page" style={{ background: '#fafafa' }}>
      <div className="app-header" style={{ 
        background: 'transparent',
        border: 'none'
      }}>
        <button className="back-btn" onClick={onBack}>
          <i className="fas fa-chevron-left"></i>
        </button>
        <div style={{ width: 40 }}></div>
        <div style={{ width: 40 }}></div>
      </div>

      <div className="app-content" style={{ paddingBottom: '120px' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ padding: '0 24px' }}
        >
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <p style={{ 
              fontSize: '11px',
              color: '#9ca3af',
              letterSpacing: '0.12em',
              fontWeight: '300',
              marginBottom: '8px'
            }}>
              PHASE {artifact.phase}
            </p>
            <p style={{ 
              fontSize: '13px',
              color: '#6b7280',
              fontWeight: '300'
            }}>
              {mediaLabels[artifact.mediaType]}
            </p>
            <div style={{
              width: '32px',
              height: '1px',
              background: '#e5e7eb',
              margin: '16px auto 0'
            }}></div>
          </div>

          {artifact.mediaType === 'torn_note' && <TornNoteView data={artifact.content} />}
          {artifact.mediaType === 'inscribed_photo' && <PhotoView data={artifact.content} />}
          {artifact.mediaType === 'voice_memo' && <VoiceMemoView data={artifact.content} />}
          {artifact.mediaType === 'journal_entry' && <JournalView data={artifact.content} />}
          {artifact.mediaType.includes('letter') && <LetterView data={artifact.content} type={artifact.mediaType} />}
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          background: 'rgba(250,250,250,0.95)',
          backdropFilter: 'blur(20px)',
          borderTop: '1px solid #e5e7eb',
          padding: '20px 24px',
          paddingBottom: 'calc(20px + env(safe-area-inset-bottom, 0px))'
        }}
      >
        <div style={{ display: 'flex', gap: '2px', marginBottom: '16px' }}>
          <button
            onClick={onNext}
            style={{
              flex: 1,
              height: '48px',
              border: '1px solid #e5e7eb',
              borderRadius: '0',
              background: 'transparent',
              color: '#374151',
              fontSize: '14px',
              fontWeight: '400',
              cursor: 'pointer',
              letterSpacing: '0.01em'
            }}
          >
            下一个
          </button>
          {!isSaved ? (
            <button
              onClick={onSave}
              style={{
                flex: 1,
                height: '48px',
                border: '1px solid #111827',
                borderRadius: '0',
                background: '#111827',
                color: '#fff',
                fontSize: '14px',
                fontWeight: '400',
                cursor: 'pointer',
                letterSpacing: '0.01em'
              }}
            >
              留存
            </button>
          ) : (
            <div style={{
              flex: 1,
              height: '48px',
              border: '1px solid #e5e7eb',
              background: '#f9fafb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}>
              <i className="fas fa-check" style={{ color: '#6b7280', fontSize: '13px' }}></i>
              <span style={{ color: '#6b7280', fontSize: '14px', fontWeight: '400' }}>已留存</span>
            </div>
          )}
        </div>
        <p style={{
          textAlign: 'center',
          fontSize: '11px',
          color: '#9ca3af',
          fontWeight: '300',
          letterSpacing: '0.02em'
        }}>
          {artifact.charName}
        </p>
      </motion.div>
    </div>
  );
}

// 存档列表页面
export function ArchiveListPage({ contactsWithArtifacts, onBack, onSelectContact }: any) {
  return (
    <div className="app-page" style={{ background: '#fafafa' }}>
      <div className="app-header" style={{ 
        background: 'transparent',
        border: 'none'
      }}>
        <button className="back-btn" onClick={onBack}>
          <i className="fas fa-chevron-left"></i>
        </button>
        <h1 style={{ fontWeight: '300', fontSize: '17px', letterSpacing: '0.01em' }}>存档</h1>
        <div style={{ width: 40 }}></div>
      </div>

      <div className="app-content" style={{ padding: '0' }}>
        {contactsWithArtifacts.length === 0 ? (
          <div className="empty-state">
            <i className="fas fa-inbox"></i>
            <p>暂无存档</p>
          </div>
        ) : (
          <div style={{ padding: '0 20px' }}>
            {contactsWithArtifacts.map(({ contact, count }: any, index: number) => (
              <motion.div
                key={contact.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <button
                  onClick={() => onSelectContact(contact)}
                  style={{
                    width: '100%',
                    background: 'transparent',
                    border: 'none',
                    borderBottom: '1px solid #e5e7eb',
                    padding: '24px 0',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px'
                  }}
                >
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    background: '#f3f4f6',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    {contact.charAvatar ? (
                      <img 
                        src={contact.charAvatar} 
                        alt={contact.charName}
                        style={{
                          width: '100%',
                          height: '100%',
                          borderRadius: '50%',
                          objectFit: 'cover'
                        }}
                      />
                    ) : (
                      <span style={{ fontSize: '16px', color: '#9ca3af', fontWeight: '300' }}>
                        {(contact.charName || contact.name || '?')[0]}
                      </span>
                    )}
                  </div>
                  <div style={{ flex: 1, textAlign: 'left' }}>
                    <h3 style={{ 
                      fontSize: '15px',
                      fontWeight: '400',
                      color: '#111827',
                      marginBottom: '4px',
                      letterSpacing: '0.01em'
                    }}>
                      {contact.charName || contact.name}
                    </h3>
                    <p style={{ 
                      fontSize: '12px',
                      color: '#9ca3af',
                      fontWeight: '300',
                      fontFamily: 'monospace',
                      letterSpacing: '0.02em'
                    }}>
                      {count}
                    </p>
                  </div>
                  <i className="fas fa-chevron-right" style={{ fontSize: '12px', color: '#d1d5db' }}></i>
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// 存档详情页面 - 包含两种查看模式
export function ArchiveDetailPage({ 
  char, 
  artifacts, 
  archiveView,
  archiveFilter,
  mediaLabels,
  onBack, 
  onViewModeChange,
  onFilterChange,
  onView, 
  onDelete 
}: any) {
  // 按Phase分组
  const groupByPhase = (artifacts: Artifact[]) => {
    const groups: Record<string, Artifact[]> = {
      '1': [],
      '2': [],
      '3': []
    };
    artifacts.forEach(artifact => {
      const phase = String(artifact.phase);
      if (groups[phase]) {
        groups[phase].push(artifact);
      }
    });
    return groups;
  };

  const phaseGroups = archiveView === 'timeline' ? groupByPhase(artifacts) : {};
  const phaseNames: Record<string, string> = {
    '1': 'Phase I · 遇见之前',
    '2': 'Phase II · 暗中观察',
    '3': 'Phase III · 确认关系'
  };

  return (
    <div className="app-page" style={{ background: '#fafafa' }}>
      <div className="app-header" style={{ 
        background: 'transparent',
        border: 'none'
      }}>
        <button className="back-btn" onClick={onBack}>
          <i className="fas fa-chevron-left"></i>
        </button>
        <h1 style={{ fontWeight: '300', fontSize: '17px', letterSpacing: '0.01em' }}>
          馆藏
        </h1>
        <div style={{ width: 40 }}></div>
      </div>

      {/* 查看模式切换 */}
      <div style={{
        padding: '16px 20px',
        borderBottom: '1px solid #e5e7eb',
        flexShrink: 0,
        display: 'flex',
        gap: '8px'
      }}>
        <button
          onClick={() => {
            onViewModeChange('timeline');
            onFilterChange(null);
          }}
          style={{
            flex: 1,
            height: '36px',
            border: `1px solid ${archiveView === 'timeline' ? '#111827' : '#e5e7eb'}`,
            background: archiveView === 'timeline' ? '#111827' : 'transparent',
            color: archiveView === 'timeline' ? '#fff' : '#9ca3af',
            fontSize: '13px',
            fontWeight: '400',
            cursor: 'pointer',
            letterSpacing: '0.01em',
            borderRadius: '0'
          }}
        >
          时间线
        </button>
        <button
          onClick={() => onViewModeChange('category')}
          style={{
            flex: 1,
            height: '36px',
            border: `1px solid ${archiveView === 'category' ? '#111827' : '#e5e7eb'}`,
            background: archiveView === 'category' ? '#111827' : 'transparent',
            color: archiveView === 'category' ? '#fff' : '#9ca3af',
            fontSize: '13px',
            fontWeight: '400',
            cursor: 'pointer',
            letterSpacing: '0.01em',
            borderRadius: '0'
          }}
        >
          分类
        </button>
      </div>

      {/* 分类筛选器 - 网格布局，只在分类模式显示 */}
      {archiveView === 'category' && (
        <div style={{
          padding: '20px',
          borderBottom: '1px solid #e5e7eb',
          flexShrink: 0
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '8px'
          }}>
            <button
              onClick={() => onFilterChange(null)}
              style={{
                padding: '12px 16px',
                border: `1px solid ${!archiveFilter ? '#111827' : '#e5e7eb'}`,
                background: !archiveFilter ? '#111827' : 'transparent',
                color: !archiveFilter ? '#fff' : '#9ca3af',
                fontSize: '12px',
                fontWeight: '400',
                cursor: 'pointer',
                borderRadius: '0',
                letterSpacing: '0.01em',
                textAlign: 'center'
              }}
            >
              全部
            </button>
            {Object.entries(mediaLabels).map(([key, label]) => (
              <button
                key={key}
                onClick={() => onFilterChange(key)}
                style={{
                  padding: '12px 16px',
                  border: `1px solid ${archiveFilter === key ? '#111827' : '#e5e7eb'}`,
                  background: archiveFilter === key ? '#111827' : 'transparent',
                  color: archiveFilter === key ? '#fff' : '#9ca3af',
                  fontSize: '12px',
                  fontWeight: '400',
                  cursor: 'pointer',
                  borderRadius: '0',
                  letterSpacing: '0.01em',
                  textAlign: 'center'
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="app-content" style={{ padding: '0' }}>
        {artifacts.length === 0 ? (
          <div className="empty-state">
            <i className="fas fa-inbox"></i>
            <p>暂无记忆</p>
          </div>
        ) : archiveView === 'timeline' ? (
          /* 时间线模式 - 按Phase分组 */
          <div style={{ padding: '20px' }}>
            {['3', '2', '1'].map((phase, groupIndex) => {
              const phaseArtifacts = phaseGroups[phase] || [];
              if (phaseArtifacts.length === 0) return null;
              
              return (
                <div key={phase} style={{ marginBottom: '48px' }}>
                  {/* Phase标题 */}
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: groupIndex * 0.1 }}
                    style={{
                      marginBottom: '24px',
                      paddingBottom: '12px',
                      borderBottom: '1px solid #e5e7eb'
                    }}
                  >
                    <h2 style={{
                      fontSize: '14px',
                      color: '#111827',
                      fontWeight: '400',
                      letterSpacing: '0.03em',
                      marginBottom: '6px'
                    }}>
                      {phaseNames[phase]}
                    </h2>
                    <p style={{
                      fontSize: '10px',
                      color: '#d1d5db',
                      fontFamily: 'monospace',
                      letterSpacing: '0.05em'
                    }}>
                      {phaseArtifacts.length} 条记忆
                    </p>
                  </motion.div>

                  {/* 该Phase下的记忆 - 2列网格 */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: '12px'
                  }}>
                    {phaseArtifacts.map((artifact: Artifact, index: number) => (
                      <motion.div
                        key={artifact.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: groupIndex * 0.1 + index * 0.04 }}
                        onClick={() => onView(artifact)}
                        style={{
                          background: '#fff',
                          border: '1px solid #f3f4f6',
                          padding: '16px',
                          cursor: 'pointer',
                          position: 'relative',
                          minHeight: '140px',
                          display: 'flex',
                          flexDirection: 'column'
                        }}
                      >
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDelete(artifact.id);
                          }}
                          style={{
                            position: 'absolute',
                            top: '8px',
                            right: '8px',
                            background: 'transparent',
                            border: 'none',
                            padding: '4px',
                            cursor: 'pointer',
                            color: '#e5e7eb',
                            fontSize: '12px',
                            opacity: 0.5
                          }}
                        >
                          <i className="fas fa-times"></i>
                        </button>
                        
                        <p style={{ 
                          fontSize: '10px',
                          color: '#9ca3af',
                          letterSpacing: '0.08em',
                          fontWeight: '300',
                          marginBottom: '12px'
                        }}>
                          {mediaLabels[artifact.mediaType]}
                        </p>
                        
                        <p style={{ 
                          fontSize: '12px',
                          color: '#6b7280',
                          lineHeight: '1.5',
                          fontWeight: '300',
                          flex: 1,
                          display: '-webkit-box',
                          WebkitLineClamp: 4,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }}>
                          {artifact.content.text || artifact.content.sceneDescription || artifact.content.letterBody || artifact.content.entry || '...'}
                        </p>

                        <p style={{ 
                          fontSize: '9px',
                          color: '#d1d5db',
                          fontFamily: 'monospace',
                          marginTop: '8px',
                          paddingTop: '8px',
                          borderTop: '1px solid #f9fafb'
                        }}>
                          {new Date(artifact.createdAt).toLocaleDateString('zh-CN', {
                            month: '2-digit',
                            day: '2-digit'
                          })}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* 分类模式 - 瀑布流网格 */
          <div style={{ padding: '20px' }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '12px'
            }}>
              {artifacts.map((artifact: Artifact, index: number) => (
                <motion.div
                  key={artifact.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.04 }}
                  onClick={() => onView(artifact)}
                  style={{
                    background: '#fff',
                    border: '1px solid #f3f4f6',
                    padding: '16px',
                    cursor: 'pointer',
                    position: 'relative',
                    minHeight: '140px',
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(artifact.id);
                    }}
                    style={{
                      position: 'absolute',
                      top: '8px',
                      right: '8px',
                      background: 'transparent',
                      border: 'none',
                      padding: '4px',
                      cursor: 'pointer',
                      color: '#e5e7eb',
                      fontSize: '12px',
                      opacity: 0.5
                    }}
                  >
                    <i className="fas fa-times"></i>
                  </button>
                  
                  <div style={{ marginBottom: '12px' }}>
                    <p style={{ 
                      fontSize: '10px',
                      color: '#9ca3af',
                      letterSpacing: '0.08em',
                      fontWeight: '300',
                      marginBottom: '4px'
                    }}>
                      {mediaLabels[artifact.mediaType]}
                    </p>
                    <p style={{ 
                      fontSize: '9px',
                      color: '#d1d5db',
                      fontFamily: 'monospace'
                    }}>
                      PHASE {artifact.phase}
                    </p>
                  </div>
                  
                  <p style={{ 
                    fontSize: '12px',
                    color: '#6b7280',
                    lineHeight: '1.5',
                    fontWeight: '300',
                    flex: 1,
                    display: '-webkit-box',
                    WebkitLineClamp: 4,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {artifact.content.text || artifact.content.sceneDescription || artifact.content.letterBody || artifact.content.entry || '...'}
                  </p>

                  <p style={{ 
                    fontSize: '9px',
                    color: '#d1d5db',
                    fontFamily: 'monospace',
                    marginTop: '8px',
                    paddingTop: '8px',
                    borderTop: '1px solid #f9fafb'
                  }}>
                    {new Date(artifact.createdAt).toLocaleDateString('zh-CN', {
                      month: '2-digit',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}