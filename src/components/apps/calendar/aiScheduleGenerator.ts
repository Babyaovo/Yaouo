// AI日程生成器 - 基于联系人人设、对话历史和日期因素生成可能的日程

interface Contact {
  id: string;
  charName: string;
  charPersona?: string;
  charBackground?: string;
  charTraits?: string[];
  occupation?: string;
}

interface Message {
  role: string;
  content: string;
  timestamp: number;
}

// 从人设中提取关键信息
function extractKeyInfo(contact: Contact) {
  const persona = contact.charPersona || '';
  const background = contact.charBackground || '';
  const occupation = contact.occupation || '';
  const allText = `${persona} ${background} ${occupation}`.toLowerCase();

  return {
    occupation,
    isStudent: allText.includes('学生') || allText.includes('student'),
    isWorker: allText.includes('工作') || allText.includes('职员') || allText.includes('员工'),
    isBusy: allText.includes('忙') || allText.includes('busy'),
    likesExercise: allText.includes('健身') || allText.includes('运动') || allText.includes('锻炼'),
    likesReading: allText.includes('阅读') || allText.includes('读书') || allText.includes('看书'),
    likesCoffee: allText.includes('咖啡') || allText.includes('coffee'),
    isCreative: allText.includes('创作') || allText.includes('设计') || allText.includes('艺术'),
  };
}

// 从近期对话中提取日程线索
function extractScheduleClues(messages: Message[]) {
  const recentMessages = messages.slice(-20); // 最近20条消息
  const clues: any[] = [];

  recentMessages.forEach(msg => {
    const content = msg.content.toLowerCase();
    
    // 检测会议相关
    if (content.includes('会议') || content.includes('meeting')) {
      clues.push({ type: 'meeting', weight: 0.8 });
    }
    
    // 检测约会相关
    if (content.includes('约') || content.includes('见面') || content.includes('聚')) {
      clues.push({ type: 'appointment', weight: 0.7 });
    }
    
    // 检测出差/旅行
    if (content.includes('出差') || content.includes('旅行') || content.includes('出门')) {
      clues.push({ type: 'trip', weight: 0.9 });
    }
    
    // 检测项目deadline
    if (content.includes('deadline') || content.includes('截止') || content.includes('交付')) {
      clues.push({ type: 'deadline', weight: 0.9 });
    }
  });

  return clues;
}

// 判断日期类型
function analyzeDateContext(date: Date) {
  const dayOfWeek = date.getDay();
  const dayOfMonth = date.getDate();
  const month = date.getMonth() + 1;
  
  return {
    isWeekend: dayOfWeek === 0 || dayOfWeek === 6,
    isMonday: dayOfWeek === 1,
    isFriday: dayOfWeek === 5,
    isMonthStart: dayOfMonth <= 5,
    isMonthEnd: dayOfMonth >= 25,
    month,
  };
}

// 生成具体的日程事件
function generateEvent(date: Date, contact: Contact, keyInfo: any, clues: any[], dateContext: any) {
  const events = [];

  // 工作日日程
  if (!dateContext.isWeekend) {
    // 职场人士的会议
    if (keyInfo.isWorker) {
      if (dateContext.isMonday) {
        events.push({
          title: '周例会',
          time: '10:00',
          description: '每周一上午的团队例会',
          reasoning: `基于${contact.charName}的职业特征，周一通常有团队例会`,
          probability: 0.7,
        });
      }
      
      if (dateContext.isFriday) {
        events.push({
          title: '周总结会议',
          time: '16:00',
          description: '周五下午的工作总结',
          reasoning: `根据职场规律，${contact.charName}周五下午可能有周总结会议`,
          probability: 0.6,
        });
      }
      
      // 月末可能有月度会议
      if (dateContext.isMonthEnd) {
        events.push({
          title: '月度总结会',
          time: '14:00',
          description: '月末的部门总结会议',
          reasoning: `月末时期，${contact.charName}通常会参加月度总结`,
          probability: 0.75,
        });
      }
    }

    // 学生的课程
    if (keyInfo.isStudent) {
      events.push({
        title: '课程安排',
        time: '14:00',
        description: '下午的专业课程',
        reasoning: `作为学生，${contact.charName}在工作日通常有课程安排`,
        probability: 0.8,
      });
    }
  }

  // 周末日程
  if (dateContext.isWeekend) {
    if (keyInfo.likesExercise) {
      events.push({
        title: '健身计划',
        time: '09:00',
        description: '周末早晨的健身时间',
        reasoning: `${contact.charName}喜欢运动，周末早晨可能会健身`,
        probability: 0.7,
      });
    }

    if (keyInfo.likesCoffee) {
      events.push({
        title: '咖啡时光',
        time: '15:00',
        description: '下午的咖啡时间',
        reasoning: `基于${contact.charName}的兴趣，周末下午可能会去咖啡店`,
        probability: 0.6,
      });
    }
  }

  // 基于对话线索的日程
  clues.forEach(clue => {
    if (clue.type === 'meeting' && !dateContext.isWeekend) {
      events.push({
        title: '重要会议',
        time: '15:00',
        description: '近期提到的会议安排',
        reasoning: `根据近期对话，${contact.charName}可能在此时有会议`,
        probability: clue.weight,
      });
    }

    if (clue.type === 'deadline') {
      events.push({
        title: '项目截止',
        time: '18:00',
        description: '项目交付期限',
        reasoning: `对话中提到的项目deadline可能在此时`,
        probability: clue.weight,
      });
    }
  });

  // 选择概率最高的事件
  if (events.length > 0) {
    events.sort((a, b) => b.probability - a.probability);
    return events[0];
  }

  return null;
}

// 主生成函数
export function generateAISchedule(contact: Contact, messages: Message[], baseDate: Date) {
  const schedule: any = {};
  
  const keyInfo = extractKeyInfo(contact);
  const clues = extractScheduleClues(messages);

  // 生成未来30天的日程
  for (let i = 0; i < 30; i++) {
    const date = new Date(baseDate.getFullYear(), baseDate.getMonth(), i + 1);
    
    // 跳过无效日期
    if (date.getMonth() !== baseDate.getMonth()) continue;

    const dateContext = analyzeDateContext(date);
    const event = generateEvent(date, contact, keyInfo, clues, dateContext);

    if (event && event.probability > 0.5) {
      const dateKey = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
      schedule[dateKey] = event;
    }
  }

  return schedule;
}
