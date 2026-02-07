import { useState } from 'react';
import { motion } from 'motion/react';

// 撕下的笔记 - 真实纸张质感
export function TornNoteView({ data }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, rotate: -0.5 }}
      animate={{ opacity: 1, y: 0, rotate: 0.3 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      style={{
        background: 'linear-gradient(160deg, #f9f8f4 0%, #f2f0eb 50%, #ebe8e0 100%)',
        border: '1px solid #ddd8d0',
        padding: '32px 28px',
        marginBottom: '24px',
        position: 'relative',
        boxShadow: '0 6px 20px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.04)',
        clipPath: 'polygon(0 0, 97% 0, 100% 3%, 100% 100%, 3% 100%, 0 97%)',
        transform: 'translateZ(0)'
      }}
    >
      {/* 加强纸张纹理 */}
      <div style={{
        position: 'absolute',
        inset: 0,
        opacity: 0.08,
        backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'1.2\' numOctaves=\'5\' /%3E%3C/filter%3E%3Crect width=\'100\' height=\'100\' filter=\'url(%23noise)\' /%3E%3C/svg%3E")',
        pointerEvents: 'none'
      }}></div>

      {/* 撕裂痕迹 */}
      <div style={{
        position: 'absolute',
        top: 0,
        right: '-1px',
        width: '8px',
        height: '100%',
        background: 'linear-gradient(90deg, transparent, rgba(0,0,0,0.03))',
        opacity: 0.6,
        pointerEvents: 'none'
      }}></div>

      <p style={{ 
        fontSize: '15px',
        color: '#2a2621',
        lineHeight: '2',
        whiteSpace: 'pre-wrap',
        marginBottom: '28px',
        fontWeight: '300',
        letterSpacing: '0.015em',
        position: 'relative',
        fontFamily: 'Georgia, serif'
      }}>
        {data.text}
      </p>

      <div style={{ 
        paddingTop: '24px',
        borderTop: '1px dashed rgba(0,0,0,0.08)',
        position: 'relative'
      }}>
        <p style={{ fontSize: '11px', color: '#8b7d6b', marginBottom: '8px', fontWeight: '300', letterSpacing: '0.02em' }}>
          地点：{data.location}
        </p>
        <p style={{ fontSize: '11px', color: '#a89e8e', fontWeight: '300', letterSpacing: '0.02em', fontStyle: 'italic' }}>
          {data.condition}
        </p>
        {data.dateWritten && (
          <p style={{ fontSize: '10px', color: '#c4b8a5', fontFamily: 'monospace', marginTop: '10px', letterSpacing: '0.08em' }}>
            {data.dateWritten}
          </p>
        )}
      </div>
    </motion.div>
  );
}

// 照片 - 宝丽来风格
export function PhotoView({ data }: any) {
  const [flipped, setFlipped] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div
        onClick={() => setFlipped(!flipped)}
        style={{
          background: '#fff',
          padding: '20px 20px 60px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.12), 0 1px 3px rgba(0,0,0,0.08)',
          cursor: 'pointer',
          marginBottom: '12px',
          position: 'relative'
        }}
      >
        {!flipped ? (
          <>
            <div style={{
              aspectRatio: '4/3',
              background: 'linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '28px',
              marginBottom: '16px',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'radial-gradient(circle at 30% 40%, rgba(255,255,255,0.03) 0%, transparent 60%)',
                pointerEvents: 'none'
              }}></div>
              <p style={{ 
                fontSize: '13px',
                color: 'rgba(255,255,255,0.75)',
                textAlign: 'center',
                fontWeight: '300',
                lineHeight: '1.7',
                letterSpacing: '0.01em',
                position: 'relative',
                zIndex: 1
              }}>
                {data.sceneDescription}
              </p>
            </div>
            <p style={{ 
              fontSize: '10px',
              color: '#999',
              textAlign: 'center',
              fontFamily: 'monospace',
              letterSpacing: '0.05em'
            }}>
              {data.cameraInfo}
            </p>
            {data.shootingDate && (
              <p style={{ 
                fontSize: '9px',
                color: '#ccc',
                textAlign: 'center',
                fontFamily: 'monospace',
                marginTop: '4px',
                letterSpacing: '0.08em'
              }}>
                {data.shootingDate}
              </p>
            )}
          </>
        ) : (
          <div style={{ 
            aspectRatio: '4/3',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '28px',
            background: '#fafaf8'
          }}>
            <p style={{ 
              fontSize: '15px',
              color: '#2a2a2a',
              textAlign: 'center',
              marginBottom: '20px',
              fontWeight: '300',
              lineHeight: '1.7',
              letterSpacing: '0.01em',
              fontFamily: 'Georgia, serif',
              fontStyle: 'italic'
            }}>
              {data.backInscription}
            </p>
            <div style={{
              width: '24px',
              height: '1px',
              background: '#ddd',
              marginBottom: '12px'
            }}></div>
            <p style={{ 
              fontSize: '10px',
              color: '#aaa',
              fontFamily: 'monospace',
              letterSpacing: '0.05em'
            }}>
              {data.timestamp}
            </p>
          </div>
        )}

        {/* 宝丽来底部标签 */}
        <div style={{
          position: 'absolute',
          bottom: '16px',
          left: '20px',
          right: '20px',
          height: '32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <p style={{ 
            fontSize: '9px',
            color: '#bbb',
            letterSpacing: '0.1em',
            fontFamily: 'monospace'
          }}>
            {flipped ? 'TAP TO VIEW PHOTO' : 'TAP TO FLIP'}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

// 录音 - 录音机界面
export function VoiceMemoView({ data }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      style={{ 
        background: 'linear-gradient(145deg, #1a1a1a 0%, #0d0d0d 100%)',
        borderRadius: '4px',
        overflow: 'hidden',
        boxShadow: '0 8px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)'
      }}
    >
      {/* 顶部控制栏 */}
      <div style={{ 
        height: '52px',
        background: 'rgba(0,0,0,0.3)',
        borderBottom: '1px solid rgba(255,255,255,0.04)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 20px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <motion.div 
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{ 
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#ef4444'
            }}
          />
          <span style={{ 
            fontSize: '11px',
            color: 'rgba(239,68,68,0.9)',
            fontFamily: 'monospace',
            letterSpacing: '0.12em',
            fontWeight: '500'
          }}>
            REC
          </span>
        </div>
        <span style={{ 
          fontSize: '11px',
          color: 'rgba(255,255,255,0.35)',
          fontFamily: 'monospace',
          letterSpacing: '0.05em'
        }}>
          {data.duration}
        </span>
      </div>

      <div style={{ padding: '28px 24px' }}>
        {/* 波形可视化 */}
        <div style={{ 
          height: '56px',
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center',
          gap: '3px',
          marginBottom: '28px',
          padding: '0 8px'
        }}>
          {Array.from({ length: 32 }).map((_, i) => (
            <div
              key={i}
              style={{
                width: '2px',
                height: `${15 + Math.random() * 70}%`,
                background: `rgba(255,255,255,${0.15 + Math.random() * 0.3})`,
                borderRadius: '1px',
                transition: 'all 0.3s ease'
              }}
            />
          ))}
        </div>

        {/* 转写文本 */}
        <div style={{ 
          borderLeft: '2px solid rgba(255,255,255,0.12)',
          paddingLeft: '20px'
        }}>
          <h4 style={{ 
            fontSize: '10px',
            color: 'rgba(255,255,255,0.3)',
            fontFamily: 'monospace',
            letterSpacing: '0.15em',
            marginBottom: '16px',
            fontWeight: '500'
          }}>
            TRANSCRIPT
          </h4>
          <p style={{ 
            fontSize: '13px',
            color: 'rgba(255,255,255,0.75)',
            lineHeight: '1.8',
            fontWeight: '300',
            letterSpacing: '0.01em',
            whiteSpace: 'pre-line'
          }}>
            {data.transcript}
          </p>
        </div>
      </div>

      {/* 底部信息栏 */}
      <div style={{ 
        background: 'rgba(0,0,0,0.4)',
        borderTop: '1px solid rgba(255,255,255,0.04)',
        padding: '14px 24px'
      }}>
        <p style={{ 
          fontSize: '10px',
          color: 'rgba(255,255,255,0.25)',
          fontFamily: 'monospace',
          letterSpacing: '0.03em'
        }}>
          {data.ambience}
        </p>
        {data.deviceInfo && (
          <p style={{ 
            fontSize: '9px',
            color: 'rgba(255,255,255,0.15)',
            fontFamily: 'monospace',
            marginTop: '4px',
            letterSpacing: '0.05em'
          }}>
            {data.deviceInfo} · {data.recordDate}
          </p>
        )}
      </div>
    </motion.div>
  );
}

// 日记本 - 横线纸张
export function JournalView({ data }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      style={{
        background: 'linear-gradient(to right, #fdfcfa 0%, #fffffe 20%, #fffffe 80%, #fdfcfa 100%)',
        border: '1px solid #e8e6e2',
        overflow: 'hidden',
        boxShadow: '0 4px 16px rgba(0,0,0,0.08), inset -1px 0 0 rgba(0,0,0,0.03)'
      }}
    >
      {/* 日记头部 */}
      <div style={{
        padding: '24px 28px',
        borderBottom: '1px solid rgba(0,0,0,0.06)',
        textAlign: 'center',
        background: 'linear-gradient(to bottom, rgba(255,255,255,0.4), transparent)'
      }}>
        <h2 style={{ 
          fontSize: '16px',
          fontWeight: '400',
          color: '#1a1a1a',
          marginBottom: '8px',
          letterSpacing: '0.03em',
          fontFamily: 'Georgia, serif'
        }}>
          {data.dateLabel}
        </h2>
        <div style={{
          width: '24px',
          height: '1px',
          background: '#d1d5db',
          margin: '0 auto 8px'
        }}></div>
        <p style={{ 
          fontSize: '11px',
          color: '#999',
          fontWeight: '300',
          letterSpacing: '0.02em'
        }}>
          {data.weather} · {data.mood}
        </p>
      </div>

      {/* 日记内容区 */}
      <div style={{ padding: '32px 28px', minHeight: '280px', position: 'relative' }}>
        {/* 横线纸效果 */}
        <div style={{
          position: 'absolute',
          inset: '32px 28px',
          background: 'repeating-linear-gradient(transparent, transparent 31px, rgba(200, 180, 160, 0.12) 32px)',
          pointerEvents: 'none'
        }}></div>

        {/* 左侧打孔装订线 */}
        <div style={{
          position: 'absolute',
          left: '12px',
          top: '32px',
          bottom: '32px',
          width: '1px',
          background: 'rgba(220, 200, 180, 0.25)',
          pointerEvents: 'none'
        }}></div>

        <p style={{
          fontSize: '14px',
          color: '#2a2a2a',
          lineHeight: '32px',
          whiteSpace: 'pre-wrap',
          position: 'relative',
          fontWeight: '300',
          letterSpacing: '0.01em',
          fontFamily: 'Georgia, serif'
        }}>
          {data.entry}
        </p>
      </div>

      {/* 页脚 */}
      <div style={{ 
        padding: '16px 28px',
        borderTop: '1px solid rgba(0,0,0,0.04)',
        background: 'rgba(0,0,0,0.01)'
      }}>
        <p style={{ 
          fontSize: '10px',
          color: '#aaa',
          fontFamily: 'monospace',
          letterSpacing: '0.02em'
        }}>
          {data.pageCondition}
        </p>
      </div>
    </motion.div>
  );
}

// 信件 - 信纸质感
export function LetterView({ data, type }: any) {
  const isReceived = type === 'letter_received';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      style={{
        background: 'linear-gradient(135deg, #fffef9 0%, #fdfcf7 100%)',
        border: '1px solid #f0ebe4',
        padding: '32px 28px',
        minHeight: '400px',
        position: 'relative',
        boxShadow: '0 4px 16px rgba(180,160,140,0.12), inset 0 1px 0 rgba(255,255,255,0.8)'
      }}
    >
      {/* 信纸纹理 */}
      <div style={{
        position: 'absolute',
        inset: 0,
        opacity: 0.02,
        backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'200\' height=\'200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'paper\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.04\' numOctaves=\'5\' /%3E%3CfeColorMatrix type=\'saturate\' values=\'0\' /%3E%3C/filter%3E%3Crect width=\'200\' height=\'200\' filter=\'url(%23paper)\' /%3E%3C/svg%3E")',
        pointerEvents: 'none'
      }}></div>

      {/* 邮戳 */}
      <div style={{
        position: 'absolute',
        top: '20px',
        right: '20px',
        width: '56px',
        height: '56px',
        border: '2px dashed rgba(139,119,101,0.2)',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <span style={{ 
          fontSize: '10px',
          color: 'rgba(139,119,101,0.35)',
          fontFamily: 'monospace',
          letterSpacing: '0.15em',
          fontWeight: '600'
        }}>
          {isReceived ? 'IN' : 'OUT'}
        </span>
      </div>

      {/* 收发信息 */}
      <div style={{ 
        marginBottom: '28px',
        paddingBottom: '20px',
        borderBottom: '1px solid rgba(0,0,0,0.04)',
        position: 'relative'
      }}>
        <p style={{ 
          fontSize: '13px',
          color: '#5a5a5a',
          marginBottom: '6px',
          fontWeight: '300',
          letterSpacing: '0.01em'
        }}>
          {isReceived ? `来自：${data.sender}` : `致：${data.recipient}`}
        </p>
        <p style={{ 
          fontSize: '10px',
          color: '#999',
          fontFamily: 'monospace',
          letterSpacing: '0.03em'
        }}>
          {data.timeContext}
        </p>
        {data.opened && (
          <p style={{ 
            fontSize: '9px',
            color: '#bbb',
            fontFamily: 'monospace',
            marginTop: '4px',
            letterSpacing: '0.05em'
          }}>
            拆封日期：{data.opened}
          </p>
        )}
      </div>

      {/* 信件正文 */}
      <div style={{
        fontSize: '14px',
        color: '#2a2a2a',
        lineHeight: '2',
        whiteSpace: 'pre-wrap',
        minHeight: '200px',
        fontWeight: '300',
        letterSpacing: '0.015em',
        marginBottom: data.charAnnotation ? '28px' : '0',
        position: 'relative',
        fontFamily: 'Georgia, serif'
      }}>
        {data.letterBody}
      </div>

      {/* 批注 */}
      {data.charAnnotation && (
        <div style={{ 
          marginTop: '28px',
          paddingTop: '20px',
          borderTop: '1px solid rgba(0,0,0,0.04)',
          position: 'relative'
        }}>
          <div style={{
            background: 'rgba(255,240,220,0.3)',
            border: '1px solid rgba(220,180,140,0.2)',
            borderLeft: '3px solid rgba(220,180,140,0.5)',
            padding: '12px 16px',
            borderRadius: '2px'
          }}>
            <p style={{ 
              fontSize: '12px',
              color: '#7a6a5a',
              fontWeight: '300',
              letterSpacing: '0.01em',
              lineHeight: '1.6',
              fontStyle: 'italic'
            }}>
              {data.charAnnotation}
            </p>
          </div>
        </div>
      )}

      {/* 纸张状态 */}
      <div style={{ 
        marginTop: '20px',
        paddingTop: '16px',
        borderTop: '1px solid rgba(0,0,0,0.03)',
        position: 'relative'
      }}>
        <p style={{ 
          fontSize: '9px',
          color: '#bbb',
          fontFamily: 'monospace',
          letterSpacing: '0.03em'
        }}>
          {data.paperCondition}
        </p>
        {data.envelope && (
          <p style={{ 
            fontSize: '9px',
            color: '#ccc',
            fontFamily: 'monospace',
            marginTop: '4px',
            letterSpacing: '0.05em'
          }}>
            状态：{data.envelope}
          </p>
        )}
      </div>
    </motion.div>
  );
}