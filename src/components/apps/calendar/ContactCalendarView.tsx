import { useState, useEffect } from 'react';
import { CalendarMonth } from './CalendarMonth';

interface ContactCalendarViewProps {
  contactId: string;
  appState: any;
  onBack: () => void;
  onUpdate: (updates: any) => void;
}

export function ContactCalendarView({ contactId, appState, onBack, onUpdate }: ContactCalendarViewProps) {
  const contact = appState.contacts?.find((c: any) => c.id === contactId);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedSchedule, setGeneratedSchedule] = useState<any>({});

  if (!contact) return null;

  // 获取该联系人的聊天记录
  const chat = appState.chats?.find((c: any) => c.id === contactId);
  const messages = chat?.messages || [];

  // 生成AI日程
  const generateSchedule = async () => {
    setIsGenerating(true);
    
    // 模拟API调用 - 这里应该调用真实的AI API
    const prompt = `根据以下信息，生成${contact.charName}的日程安排：
人物简介：${contact.charBio || '暂无'}
聊天记录：${messages.slice(-10).map((m: any) => `${m.sender}: ${m.content}`).join('\n')}

请生成未来30天的可能日程，包括日期、时间、标题和描述。返回JSON格式。`;

    // 实际应该调用 AI API，这里用模拟数据
    setTimeout(() => {
      const schedule: any = {};
      const today = new Date();
      
      // 生成一些示例日程
      for (let i = 1; i <= 30; i += 3) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        const dateKey = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
        
        schedule[dateKey] = {
          title: `${contact.charName}的活动 ${i}`,
          time: `${9 + Math.floor(i / 3)}:00`,
          description: `基于聊天记录和人物特征生成的日程安排`,
          type: 'ai-generated'
        };
      }
      
      setGeneratedSchedule(schedule);
      setIsGenerating(false);
    }, 1500);
  };

  useEffect(() => {
    generateSchedule();
  }, [contactId]);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleDateClick = (date: Date) => {
    const dateKey = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    const event = generatedSchedule[dateKey];
    if (event) {
      setSelectedEvent({ date, dateKey, ...event });
    } else {
      setSelectedEvent(null);
    }
  };

  const handleRegenerate = () => {
    setSelectedEvent(null);
    generateSchedule();
  };

  return (
    <div className="contact-calendar-view">
      <div className="calendar-contact-header">
        <button className="calendar-back-btn" onClick={onBack}>
          <i className="fas fa-chevron-left"></i>
        </button>
        <div className="calendar-contact-info">
          <div className="calendar-contact-avatar-small">
            {contact.charAvatar ? (
              <img src={contact.charAvatar} alt={contact.charName} />
            ) : (
              <i className="fas fa-user"></i>
            )}
          </div>
          <div>
            <div className="calendar-contact-name-large">{contact.charName}</div>
            <div className="calendar-contact-subtitle">日程管理</div>
          </div>
        </div>
        <button 
          className="calendar-regenerate-btn"
          onClick={handleRegenerate}
          disabled={isGenerating}
        >
          <i className={`fas fa-sync-alt ${isGenerating ? 'fa-spin' : ''}`}></i>
        </button>
      </div>

      <div className="calendar-navigation">
        <button className="calendar-nav-btn" onClick={handlePrevMonth}>
          <i className="fas fa-chevron-left"></i>
        </button>
        <div className="calendar-month-title">
          {currentDate.getFullYear()}年 {currentDate.getMonth() + 1}月
        </div>
        <button className="calendar-nav-btn" onClick={handleNextMonth}>
          <i className="fas fa-chevron-right"></i>
        </button>
      </div>

      {isGenerating ? (
        <div className="calendar-loading">
          <i className="fas fa-spinner fa-spin"></i>
          <div>正在生成日程...</div>
        </div>
      ) : (
        <>
          <CalendarMonth
            currentDate={currentDate}
            events={generatedSchedule}
            onDateClick={handleDateClick}
            isAISchedule={true}
          />

          {/* 日程详情展开区域 */}
          {selectedEvent && (
            <div className="calendar-event-expand">
              <div className="event-expand-header">
                <div className="event-expand-date">
                  {selectedEvent.date.getMonth() + 1}月{selectedEvent.date.getDate()}日
                </div>
                <button className="event-expand-close" onClick={() => setSelectedEvent(null)}>
                  <i className="fas fa-times"></i>
                </button>
              </div>
              
              <div className="event-expand-content">
                <div className="event-expand-title">
                  <i className="fas fa-calendar-check"></i>
                  {selectedEvent.title}
                </div>
                
                {selectedEvent.time && (
                  <div className="event-expand-time">
                    <i className="fas fa-clock"></i>
                    {selectedEvent.time}
                  </div>
                )}
                
                {selectedEvent.description && (
                  <div className="event-expand-description">
                    {selectedEvent.description}
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
