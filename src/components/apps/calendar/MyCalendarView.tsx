import { useState } from 'react';
import { CalendarMonth } from './CalendarMonth';

interface MyCalendarViewProps {
  appState: any;
  onUpdate: (updates: any) => void;
}

interface Calendar {
  id: string;
  name: string;
  color: string;
  sharedWith: string[];
  events: Record<string, {
    title: string;
    time: string;
    description: string;
  }>;
}

export function MyCalendarView({ appState, onUpdate }: MyCalendarViewProps) {
  const [view, setView] = useState<'list' | 'calendar'>('list');
  const [selectedCalendar, setSelectedCalendar] = useState<string | null>(null);
  const [showCalendarEditor, setShowCalendarEditor] = useState(false);
  const [editingCalendar, setEditingCalendar] = useState<Calendar | null>(null);
  const [showEventEditor, setShowEventEditor] = useState(false);
  const [editingEvent, setEditingEvent] = useState<any | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);

  const myCalendars: Calendar[] = appState.myCalendars || [];
  const contacts = appState.contacts || [];

  const handleCreateCalendar = () => {
    setEditingCalendar({
      id: Date.now().toString(),
      name: '',
      color: '#FF3B30',
      sharedWith: [],
      events: {}
    });
    setShowCalendarEditor(true);
  };

  const handleEditCalendar = (calendar: Calendar) => {
    setEditingCalendar({ ...calendar });
    setShowCalendarEditor(true);
  };

  const handleSaveCalendar = () => {
    if (!editingCalendar || !editingCalendar.name.trim()) return;

    const updatedCalendars = [...myCalendars];
    const index = updatedCalendars.findIndex(c => c.id === editingCalendar.id);
    
    if (index >= 0) {
      updatedCalendars[index] = editingCalendar;
    } else {
      updatedCalendars.push(editingCalendar);
    }

    onUpdate({ myCalendars: updatedCalendars });
    setShowCalendarEditor(false);
    setEditingCalendar(null);
  };

  const handleDeleteCalendar = (calendarId: string) => {
    const updatedCalendars = myCalendars.filter(c => c.id !== calendarId);
    onUpdate({ myCalendars: updatedCalendars });
    if (selectedCalendar === calendarId) {
      setSelectedCalendar(null);
      setView('list');
    }
  };

  const handleOpenCalendar = (calendarId: string) => {
    setSelectedCalendar(calendarId);
    setView('calendar');
    setSelectedEvent(null);
  };

  const handleBackToList = () => {
    setView('list');
    setSelectedCalendar(null);
    setSelectedEvent(null);
  };

  const handleDateClick = (date: Date) => {
    if (!selectedCalendar) return;
    
    const calendar = myCalendars.find(c => c.id === selectedCalendar);
    if (!calendar) return;

    const dateKey = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    const existingEvent = calendar.events[dateKey];
    
    if (existingEvent) {
      // 显示已存在的日程详情
      setSelectedEvent({
        calendarId: selectedCalendar,
        dateKey,
        date,
        ...existingEvent
      });
    } else {
      // 打开新建日程编辑器
      setSelectedEvent(null);
      setEditingEvent({
        calendarId: selectedCalendar,
        dateKey,
        date,
        title: '',
        time: '',
        description: '',
      });
      setShowEventEditor(true);
    }
  };

  const handleEditEvent = () => {
    if (!selectedEvent) return;
    setEditingEvent({ ...selectedEvent });
    setShowEventEditor(true);
  };

  const handleSaveEvent = () => {
    if (!editingEvent || !editingEvent.title.trim()) return;

    const updatedCalendars = myCalendars.map(cal => {
      if (cal.id === editingEvent.calendarId) {
        const updatedEvents = { ...cal.events };
        updatedEvents[editingEvent.dateKey] = {
          title: editingEvent.title,
          time: editingEvent.time,
          description: editingEvent.description,
        };
        return { ...cal, events: updatedEvents };
      }
      return cal;
    });

    onUpdate({ myCalendars: updatedCalendars });
    setShowEventEditor(false);
    
    // 更新选中的事件显示
    setSelectedEvent({
      ...editingEvent
    });
    setEditingEvent(null);
  };

  const handleDeleteEvent = () => {
    if (!editingEvent) return;

    const updatedCalendars = myCalendars.map(cal => {
      if (cal.id === editingEvent.calendarId) {
        const updatedEvents = { ...cal.events };
        delete updatedEvents[editingEvent.dateKey];
        return { ...cal, events: updatedEvents };
      }
      return cal;
    });

    onUpdate({ myCalendars: updatedCalendars });
    setShowEventEditor(false);
    setEditingEvent(null);
    setSelectedEvent(null);
  };

  const renderCalendarList = () => (
    <div className="calendar-list-view">
      <div className="calendar-list-header">
        <h2>我的日程表</h2>
        <button className="create-calendar-btn" onClick={handleCreateCalendar}>
          <i className="fas fa-plus"></i>
          创建日程表
        </button>
      </div>

      {myCalendars.length === 0 ? (
        <div className="calendar-empty-state">
          <i className="fas fa-calendar-plus"></i>
          <p>还没有日程表</p>
          <p className="empty-hint">创建日程表来管理你的安排</p>
        </div>
      ) : (
        <div className="calendar-cards">
          {myCalendars.map(calendar => {
            const eventCount = Object.keys(calendar.events).length;
            const sharedCount = calendar.sharedWith.length;
            
            return (
              <div key={calendar.id} className="calendar-card">
                <div 
                  className="calendar-card-color" 
                  style={{ backgroundColor: calendar.color }}
                ></div>
                <div className="calendar-card-content">
                  <div className="calendar-card-name">{calendar.name}</div>
                  <div className="calendar-card-stats">
                    <span><i className="fas fa-calendar-day"></i> {eventCount} 个日程</span>
                    <span><i className="fas fa-share-alt"></i> 分享给 {sharedCount} 人</span>
                  </div>
                  {sharedCount > 0 && (
                    <div className="calendar-card-shared">
                      {calendar.sharedWith.slice(0, 3).map(contactId => {
                        const contact = contacts.find((c: any) => c.id === contactId);
                        return contact ? (
                          <span key={contactId} className="shared-badge">
                            {contact.charName}
                          </span>
                        ) : null;
                      })}
                      {sharedCount > 3 && <span className="shared-badge">+{sharedCount - 3}</span>}
                    </div>
                  )}
                </div>
                <div className="calendar-card-actions">
                  <button 
                    className="calendar-action-btn"
                    onClick={() => handleOpenCalendar(calendar.id)}
                  >
                    <i className="fas fa-eye"></i>
                  </button>
                  <button 
                    className="calendar-action-btn"
                    onClick={() => handleEditCalendar(calendar)}
                  >
                    <i className="fas fa-edit"></i>
                  </button>
                  <button 
                    className="calendar-action-btn delete"
                    onClick={() => handleDeleteCalendar(calendar.id)}
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  const renderCalendarView = () => {
    const calendar = myCalendars.find(c => c.id === selectedCalendar);
    if (!calendar) return null;

    const handlePrevMonth = () => {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    return (
      <div className="calendar-detail-view">
        <div className="calendar-detail-header">
          <button className="calendar-back-btn" onClick={handleBackToList}>
            <i className="fas fa-chevron-left"></i>
          </button>
          <div className="calendar-detail-title">
            <div 
              className="calendar-title-color" 
              style={{ backgroundColor: calendar.color }}
            ></div>
            <span>{calendar.name}</span>
          </div>
          <button 
            className="calendar-action-btn"
            onClick={() => handleEditCalendar(calendar)}
          >
            <i className="fas fa-cog"></i>
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

        <CalendarMonth
          currentDate={currentDate}
          events={calendar.events}
          onDateClick={handleDateClick}
          isAISchedule={false}
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

              <div className="event-expand-actions">
                <button className="event-action-btn edit" onClick={handleEditEvent}>
                  <i className="fas fa-edit"></i>
                  编辑
                </button>
              </div>
            </div>
          </div>
        )}

        {!selectedEvent && (
          <div className="calendar-tip">
            <i className="fas fa-info-circle"></i>
            点击日期添加或查看日程
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="my-calendar-view">
      {view === 'list' ? renderCalendarList() : renderCalendarView()}

      {/* 日程表编辑器 */}
      {showCalendarEditor && editingCalendar && (
        <div className="modal-overlay" onClick={() => setShowCalendarEditor(false)}>
          <div className="calendar-editor-modal" onClick={(e) => e.stopPropagation()}>
            <div className="editor-header">
              <button className="calendar-detail-close" onClick={() => setShowCalendarEditor(false)}>
                <i className="fas fa-times"></i>
              </button>
              <div className="editor-title">
                {myCalendars.find(c => c.id === editingCalendar.id) ? '编辑日程表' : '新建日程表'}
              </div>
              <button className="editor-save-btn" onClick={handleSaveCalendar}>
                保存
              </button>
            </div>

            <div className="editor-form">
              <div className="form-group">
                <label>日程表名称</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="例如：工作日程、个人计划"
                  value={editingCalendar.name}
                  onChange={(e) => setEditingCalendar({ ...editingCalendar, name: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>颜色标记</label>
                <div className="color-picker">
                  {['#FF3B30', '#FF9500', '#FFCC00', '#34C759', '#5856D6', '#AF52DE', '#FF2D55', '#A2845E', '#8E8E93'].map(color => (
                    <button
                      key={color}
                      className={`color-option ${editingCalendar.color === color ? 'active' : ''}`}
                      style={{ backgroundColor: color }}
                      onClick={() => setEditingCalendar({ ...editingCalendar, color })}
                    />
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label>分享权限</label>
                <div className="permission-hint">
                  选择可以查看这个日程表的联系人
                </div>
                <div className="shared-contacts">
                  {contacts.map((contact: any) => {
                    const isShared = editingCalendar.sharedWith.includes(contact.id);
                    return (
                      <button
                        key={contact.id}
                        className={`shared-contact-chip ${isShared ? 'active' : ''}`}
                        onClick={() => {
                          const sharedWith = isShared
                            ? editingCalendar.sharedWith.filter((id: string) => id !== contact.id)
                            : [...editingCalendar.sharedWith, contact.id];
                          setEditingCalendar({ ...editingCalendar, sharedWith });
                        }}
                      >
                        {isShared && <i className="fas fa-check"></i>}
                        {contact.charName}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 日程事件编辑器 */}
      {showEventEditor && editingEvent && (
        <div className="modal-overlay" onClick={() => setShowEventEditor(false)}>
          <div className="calendar-event-editor" onClick={(e) => e.stopPropagation()}>
            <div className="editor-header">
              <button className="calendar-detail-close" onClick={() => setShowEventEditor(false)}>
                <i className="fas fa-times"></i>
              </button>
              <div className="editor-title">
                {selectedEvent ? '编辑日程' : '新建日程'}
              </div>
              <button className="editor-save-btn" onClick={handleSaveEvent}>
                保存
              </button>
            </div>

            <div className="editor-date">
              {editingEvent.date.getMonth() + 1}月{editingEvent.date.getDate()}日
            </div>

            <div className="editor-form">
              <div className="form-group">
                <label>标题</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="日程标题"
                  value={editingEvent.title}
                  onChange={(e) => setEditingEvent({ ...editingEvent, title: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>时间</label>
                <input
                  type="time"
                  className="form-input"
                  value={editingEvent.time}
                  onChange={(e) => setEditingEvent({ ...editingEvent, time: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>描述</label>
                <textarea
                  className="form-textarea"
                  placeholder="详细描述"
                  rows={3}
                  value={editingEvent.description}
                  onChange={(e) => setEditingEvent({ ...editingEvent, description: e.target.value })}
                />
              </div>

              {selectedEvent && (
                <button className="delete-event-btn" onClick={handleDeleteEvent}>
                  <i className="fas fa-trash"></i>
                  删除日程
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}