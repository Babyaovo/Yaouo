import { useState } from 'react';
import { motion } from 'motion/react';

interface MomentDetailPageProps {
  appState: any;
  momentId: string;
  onUpdate: (updates: any) => void;
  onClose: () => void;
}

export function MomentDetailPage({ appState, momentId, onUpdate, onClose }: MomentDetailPageProps) {
  const moment = appState.moments?.find((m: any) => m.id === momentId);
  const contacts = appState.contacts || [];
  const [commentText, setCommentText] = useState('');
  const [isGeneratingComment, setIsGeneratingComment] = useState(false);
  const [commentError, setCommentError] = useState('');

  if (!moment) {
    return (
      <div className="app-page" style={{ background: '#fafafa' }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          height: '100%',
          color: '#d1d5db',
          fontSize: '14px'
        }}>
          动态不存在
        </div>
      </div>
    );
  }

  const getContactById = (contactId: string) => {
    return contacts.find((c: any) => c.id === contactId);
  };

  const contact = moment.userId === 'me' ? null : getContactById(moment.userId);
  const isMe = moment.userId === 'me';

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('zh-CN', {
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleLike = () => {
    const likes = moment.likes || [];
    const hasLiked = likes.includes('me');
    
    const updatedMoments = appState.moments.map((m: any) => {
      if (m.id === momentId) {
        return {
          ...m,
          likes: hasLiked 
            ? likes.filter((id: string) => id !== 'me')
            : [...likes, 'me']
        };
      }
      return m;
    });

    onUpdate({ moments: updatedMoments });
  };

  const handleSendComment = async () => {
    if (!commentText.trim()) return;

    const newComment = {
      id: Date.now().toString(),
      userId: 'me',
      content: commentText,
      createdAt: Date.now()
    };

    const updatedMoments = appState.moments.map((m: any) => {
      if (m.id === momentId) {
        return {
          ...m,
          comments: [...(m.comments || []), newComment]
        };
      }
      return m;
    });

    onUpdate({ moments: updatedMoments });
    setCommentText('');

    // 如果不是我发的动态，让角色生成回复
    if (!isMe && contact) {
      // 检查该联系人是否允许自主调用API
      if (!contact.apiPermissions?.moments) {
        return; // 没有权限就不生成
      }

      // 检查是否配置了API
      if (!appState.apiSettings?.apiUrl || !appState.apiSettings?.apiKey) {
        setCommentError('未配置API，无法生成角色回复');
        return;
      }

      setIsGeneratingComment(true);
      setCommentError('');

      try {
        const response = await fetch(`${appState.apiSettings.apiUrl}/chat/completions`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${appState.apiSettings.apiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: appState.apiSettings.selectedModel,
            messages: [
              {
                role: 'system',
                content: `你是${contact.charName}。${contact.charSettings}\n\n你看到用户对你的动态发表了评论，请生成一条简短自然的回复评论（30字以内）。`
              },
              {
                role: 'user',
                content: `我的动态内容："${moment.content}"\n用户的评论："${commentText}"\n请生成回复：`
              }
            ],
            temperature: 0.8
          })
        });

        if (!response.ok) {
          throw new Error('API调用失败');
        }

        const data = await response.json();
        const charCommentContent = data.choices?.[0]?.message?.content?.trim();

        if (!charCommentContent) {
          throw new Error('API返回内容为空');
        }

        // 添加角色的回复
        const charComment = {
          id: (Date.now() + 1).toString(),
          userId: contact.id,
          content: charCommentContent,
          createdAt: Date.now() + 1000
        };

        const momentsWithCharComment = updatedMoments.map((m: any) => {
          if (m.id === momentId) {
            return {
              ...m,
              comments: [...m.comments, charComment]
            };
          }
          return m;
        });

        onUpdate({ moments: momentsWithCharComment });
      } catch (error) {
        setCommentError('角色评论生成失败，请检查API配置');
        console.error('生成评论失败:', error);
      } finally {
        setIsGeneratingComment(false);
      }
    }
  };

  const hasLiked = moment.likes?.includes('me') || false;

  return (
    <div className="app-page" style={{ background: '#fafafa' }}>
      <div className="app-header" style={{ 
        background: 'transparent',
        borderBottom: 'none'
      }}>
        <button className="back-btn" onClick={onClose}>
          <i className="fas fa-chevron-left"></i>
        </button>
        <div style={{ width: 40 }}></div>
        <div style={{ width: 40 }}></div>
      </div>

      <div className="app-content" style={{ padding: '0 28px', paddingBottom: '100px' }}>
        {/* 动态内容卡片 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          style={{
            background: '#fff',
            border: '1px solid #f3f4f6',
            padding: '32px',
            marginBottom: '32px'
          }}
        >
          {/* 作者信息 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '24px' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              overflow: 'hidden',
              background: '#f9fafb',
              flexShrink: 0
            }}>
              {(isMe ? appState.userInfo?.avatar : contact?.charAvatar) ? (
                <img 
                  src={isMe ? appState.userInfo?.avatar : contact?.charAvatar} 
                  alt="avatar"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <div style={{ 
                  width: '100%', 
                  height: '100%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  color: '#d1d5db'
                }}>
                  <i className="fas fa-user"></i>
                </div>
              )}
            </div>

            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: '15px', fontWeight: '400', color: '#1a1a1a', marginBottom: '4px', letterSpacing: '0.01em' }}>
                {isMe ? (appState.userInfo?.name || '我') : (contact?.charName || '未知')}
              </h3>
              <p style={{ fontSize: '11px', color: '#d1d5db', fontFamily: 'monospace', letterSpacing: '0.03em' }}>
                {formatTime(moment.createdAt)}
              </p>
            </div>
          </div>

          {/* 文字内容 */}
          {moment.content && (
            <p style={{ 
              fontSize: '15px',
              color: '#1a1a1a',
              lineHeight: '1.9',
              marginBottom: moment.images?.length > 0 ? '24px' : '20px',
              fontWeight: '300',
              letterSpacing: '0.01em',
              whiteSpace: 'pre-wrap'
            }}>
              {moment.content}
            </p>
          )}

          {/* 图片 */}
          {moment.images && moment.images.length > 0 && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: moment.images.length === 1 ? '1fr' : 'repeat(2, 1fr)',
              gap: '8px',
              marginBottom: '20px'
            }}>
              {moment.images.map((img: string, imgIndex: number) => (
                <div
                  key={imgIndex}
                  style={{
                    aspectRatio: moment.images.length === 1 ? '4/3' : '1',
                    background: '#f9fafb',
                    overflow: 'hidden'
                  }}
                >
                  <img 
                    src={img} 
                    alt={`moment-${imgIndex}`}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
              ))}
            </div>
          )}

          {/* 点赞按钮 */}
          <div style={{ 
            paddingTop: '20px',
            borderTop: '1px solid #f9fafb'
          }}>
            <button
              onClick={handleLike}
              style={{
                background: 'transparent',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                fontSize: '13px',
                color: hasLiked ? '#1a1a1a' : '#9ca3af',
                padding: 0,
                transition: 'all 0.3s ease'
              }}
            >
              <i className={hasLiked ? 'fas fa-heart' : 'far fa-heart'}></i>
              <span style={{ fontFamily: 'monospace' }}>{moment.likes?.length || 0}</span>
            </button>
          </div>
        </motion.div>

        {/* 评论标题 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          style={{ 
            marginBottom: '20px',
            paddingBottom: '12px',
            borderBottom: '1px solid #f3f4f6'
          }}
        >
          <h4 style={{ 
            fontSize: '12px',
            fontWeight: '400',
            color: '#9ca3af',
            letterSpacing: '0.08em',
            textTransform: 'uppercase'
          }}>
            Comments · {moment.comments?.length || 0}
          </h4>
        </motion.div>

        {/* 评论列表 */}
        {moment.comments && moment.comments.length > 0 ? (
          <div style={{ marginBottom: '20px' }}>
            {moment.comments.map((comment: any, index: number) => {
              const commentContact = comment.userId === 'me' ? null : getContactById(comment.userId);
              const isMyComment = comment.userId === 'me';

              return (
                <motion.div
                  key={comment.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 + index * 0.05 }}
                  style={{
                    background: '#fff',
                    border: '1px solid #f9fafb',
                    padding: '20px',
                    marginBottom: '12px'
                  }}
                >
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      overflow: 'hidden',
                      background: '#f9fafb',
                      flexShrink: 0
                    }}>
                      {(isMyComment ? appState.userInfo?.avatar : commentContact?.charAvatar) ? (
                        <img 
                          src={isMyComment ? appState.userInfo?.avatar : commentContact?.charAvatar} 
                          alt="avatar"
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      ) : (
                        <div style={{ 
                          width: '100%', 
                          height: '100%', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          color: '#d1d5db',
                          fontSize: '12px'
                        }}>
                          <i className="fas fa-user"></i>
                        </div>
                      )}
                    </div>

                    <div style={{ flex: 1 }}>
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '10px',
                        marginBottom: '8px'
                      }}>
                        <span style={{ 
                          fontSize: '13px',
                          fontWeight: '400',
                          color: '#374151',
                          letterSpacing: '0.01em'
                        }}>
                          {isMyComment ? (appState.userInfo?.name || '我') : (commentContact?.charName || '未知')}
                        </span>
                        <span style={{ 
                          fontSize: '10px',
                          color: '#d1d5db',
                          fontFamily: 'monospace',
                          letterSpacing: '0.03em'
                        }}>
                          {formatTime(comment.createdAt)}
                        </span>
                      </div>
                      <p style={{ 
                        fontSize: '14px',
                        color: '#1a1a1a',
                        lineHeight: '1.7',
                        fontWeight: '300',
                        letterSpacing: '0.01em'
                      }}>
                        {comment.content}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            style={{
              textAlign: 'center',
              padding: '40px 20px',
              color: '#d1d5db'
            }}
          >
            <p style={{ fontSize: '12px', fontWeight: '300', letterSpacing: '0.02em' }}>暂无评论</p>
          </motion.div>
        )}

        {/* 错误提示 */}
        {commentError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              padding: '12px 16px',
              background: '#fef2f2',
              border: '1px solid #fecaca',
              marginBottom: '16px',
              fontSize: '12px',
              color: '#dc2626',
              letterSpacing: '0.01em'
            }}
          >
            {commentError}
          </motion.div>
        )}

        {/* 生成中提示 */}
        {isGeneratingComment && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ 
              padding: '16px',
              textAlign: 'center',
              color: '#9ca3af',
              fontSize: '12px',
              fontWeight: '300',
              letterSpacing: '0.02em'
            }}
          >
            <i className="fas fa-spinner fa-spin" style={{ marginRight: '8px' }}></i>
            角色正在生成回复...
          </motion.div>
        )}
      </div>

      {/* 评论输入框 */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        borderTop: '1px solid #f3f4f6',
        padding: '16px 28px',
        paddingBottom: 'max(16px, env(safe-area-inset-bottom))',
        display: 'flex',
        gap: '12px',
        alignItems: 'center'
      }}>
        <input
          type="text"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="写评论..."
          style={{
            flex: 1,
            padding: '10px 16px',
            border: '1px solid #e5e7eb',
            borderRadius: '0',
            fontSize: '14px',
            outline: 'none',
            background: '#fff',
            fontWeight: '300',
            letterSpacing: '0.01em'
          }}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleSendComment();
            }
          }}
        />
        <button
          onClick={handleSendComment}
          disabled={!commentText.trim()}
          style={{
            background: commentText.trim() ? '#1a1a1a' : 'transparent',
            color: commentText.trim() ? '#fff' : '#d1d5db',
            border: commentText.trim() ? 'none' : '1px solid #f3f4f6',
            padding: '10px 20px',
            fontSize: '13px',
            cursor: commentText.trim() ? 'pointer' : 'not-allowed',
            fontWeight: '400',
            letterSpacing: '0.02em',
            transition: 'all 0.3s ease'
          }}
        >
          发送
        </button>
      </div>
    </div>
  );
}
