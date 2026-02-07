interface CalendarMonthProps {
  currentDate: Date;
  events: any;
  onDateClick: (date: Date) => void;
  isAISchedule: boolean;
}

export function CalendarMonth({ currentDate, events, onDateClick, isAISchedule }: CalendarMonthProps) {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // 获取当月第一天和最后一天
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  
  // 获取当月第一天是星期几（0=周日）
  const firstDayOfWeek = firstDay.getDay();
  
  // 获取当月天数
  const daysInMonth = lastDay.getDate();

  // 生成日历网格
  const calendarDays = [];
  
  // 填充前面的空白
  for (let i = 0; i < firstDayOfWeek; i++) {
    calendarDays.push(null);
  }
  
  // 填充当月日期
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  const today = new Date();
  const isToday = (day: number) => {
    return day === today.getDate() && 
           month === today.getMonth() && 
           year === today.getFullYear();
  };

  const hasEvent = (day: number) => {
    const dateKey = `${year}-${month + 1}-${day}`;
    return !!events[dateKey];
  };

  const handleDayClick = (day: number) => {
    const date = new Date(year, month, day);
    onDateClick(date);
  };

  return (
    <div className="calendar-month">
      <div className="calendar-weekdays">
        {['日', '一', '二', '三', '四', '五', '六'].map((day, index) => (
          <div key={index} className="calendar-weekday">
            {day}
          </div>
        ))}
      </div>

      <div className="calendar-days">
        {calendarDays.map((day, index) => (
          <div
            key={index}
            className={`calendar-day ${day ? 'has-day' : 'empty'} ${
              day && isToday(day) ? 'today' : ''
            } ${day && hasEvent(day) ? 'has-event' : ''}`}
            onClick={() => day && handleDayClick(day)}
          >
            {day && (
              <>
                <div className="day-number">{day}</div>
                {hasEvent(day) && (
                  <div className={`event-indicator ${isAISchedule ? 'ai' : 'mine'}`}></div>
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
