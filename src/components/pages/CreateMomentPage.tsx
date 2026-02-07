import { useState } from 'react';
import { motion } from 'motion/react';

interface CreateMomentPageProps {
  appState: any;
  onUpdate: (updates: any) => void;
  onClose: () => void;
}

export function CreateMomentPage({ appState, onUpdate, onClose }: CreateMomentPageProps) {
  const [content, setContent] = useState('');
  const [images, setImages] = useState<string[]>([]);

  const handleImageUpload = (files: FileList) => {
    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImages(prev => [...prev, e.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handlePublish = () => {
    if (!content.trim() && images.length === 0) {
      return;
    }

    const newMoment = {
      id: Date.now().toString(),
      userId: 'me',
      content: content.trim(),
      images,
      likes: [],
      comments: [],
      createdAt: Date.now()
    };

    const updatedMoments = [...(appState.moments || []), newMoment];
    onUpdate({ moments: updatedMoments });
    onClose();
  };

  return (
    <div className="app-page" style={{ background: '#fafafa' }}>
      <div className="app-header" style={{ 
        background: 'transparent',
        borderBottom: 'none'
      }}>
        <button 
          className="back-btn" 
          onClick={onClose}
          style={{ fontSize: '14px', fontWeight: '300' }}
        >
          取消
        </button>
        <div style={{ width: 40 }}></div>
        <button 
          className="back-btn"
          onClick={handlePublish}
          disabled={!content.trim() && images.length === 0}
          style={{
            fontSize: '14px',
            fontWeight: '400',
            color: (content.trim() || images.length > 0) ? '#1a1a1a' : '#d1d5db',
            cursor: (content.trim() || images.length > 0) ? 'pointer' : 'not-allowed'
          }}
        >
          发布
        </button>
      </div>

      {/* 标题 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        style={{ 
          padding: '40px 28px 32px',
          textAlign: 'center'
        }}
      >
        <h1 style={{ 
          fontSize: '20px',
          fontWeight: '300',
          color: '#1a1a1a',
          letterSpacing: '0.06em',
          fontFamily: 'Georgia, serif',
          fontStyle: 'italic'
        }}>
          New Moment
        </h1>
        <div style={{
          width: '32px',
          height: '1px',
          background: '#d1d5db',
          margin: '12px auto 0'
        }}></div>
      </motion.div>

      <div className="app-content" style={{ padding: '0 28px' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {/* 文字输入 */}
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="分享此刻..."
            style={{
              width: '100%',
              minHeight: '180px',
              border: '1px solid #f3f4f6',
              background: '#fff',
              outline: 'none',
              fontSize: '15px',
              fontWeight: '300',
              lineHeight: '1.8',
              resize: 'none',
              fontFamily: 'inherit',
              padding: '24px',
              letterSpacing: '0.01em',
              marginBottom: '24px'
            }}
            autoFocus
          />

          {/* 图片预览网格 */}
          {images.length > 0 && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '8px',
              marginBottom: '24px'
            }}>
              {images.map((img, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  style={{
                    aspectRatio: '1',
                    position: 'relative',
                    overflow: 'hidden',
                    background: '#f9fafb'
                  }}
                >
                  <img 
                    src={img} 
                    alt={`upload-${index}`}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <button
                    onClick={() => removeImage(index)}
                    style={{
                      position: 'absolute',
                      top: '8px',
                      right: '8px',
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      background: 'rgba(0,0,0,0.6)',
                      backdropFilter: 'blur(4px)',
                      border: 'none',
                      color: '#fff',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '10px',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </motion.div>
              ))}

              {/* 添加更多图片按钮 */}
              {images.length < 9 && (
                <label style={{
                  aspectRatio: '1',
                  border: '1px dashed #e5e7eb',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  background: '#fafafa',
                  color: '#d1d5db',
                  fontSize: '20px',
                  transition: 'all 0.3s ease'
                }}>
                  <i className="fas fa-plus"></i>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => e.target.files && handleImageUpload(e.target.files)}
                    style={{ display: 'none' }}
                  />
                </label>
              )}
            </div>
          )}

          {/* 添加图片按钮 - 只在没有图片时显示 */}
          {images.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <label style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                padding: '20px',
                border: '1px solid #f3f4f6',
                cursor: 'pointer',
                fontSize: '14px',
                color: '#9ca3af',
                background: '#fff',
                transition: 'all 0.3s ease',
                fontWeight: '300',
                letterSpacing: '0.02em'
              }}>
                <i className="fas fa-image" style={{ fontSize: '16px' }}></i>
                <span>添加图片</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => e.target.files && handleImageUpload(e.target.files)}
                  style={{ display: 'none' }}
                />
              </label>
            </motion.div>
          )}

          {/* 提示文字 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            style={{
              marginTop: '32px',
              padding: '16px',
              background: '#f9fafb',
              border: '1px solid #f3f4f6',
              fontSize: '12px',
              color: '#9ca3af',
              lineHeight: '1.6',
              letterSpacing: '0.01em',
              fontWeight: '300'
            }}
          >
            分享你的生活瞬间，开启AI角色的评论权限后，他们会对你的动态做出回应。
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
