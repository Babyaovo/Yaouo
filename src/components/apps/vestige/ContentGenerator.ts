import { Phase, MediaType } from '../Vestige';

export function generateContentBasedOnCharacter(type: MediaType, phase: Phase, char: any) {
  const userName = '你';
  const charName = char.charName || char.name;
  const charAge = char.age || '未知';
  const charOccupation = char.occupation || '未知';
  const charPersonality = char.personality || '神秘';

  const phaseLabels = {
    'I': '遇见之前',
    'II': '暗中观察',
    'III': '确认关系后'
  };

  // 这里可以调用真实的AI API来生成内容
  // 例如: await fetch('https://api.openai.com/v1/chat/completions', {...})
  
  if (type === 'torn_note') {
    const contents = {
      'I': `${new Date().toLocaleDateString('zh-CN', { month: 'long', day: 'numeric' })}\n\n今天又是一个人。\n\n窗外的雨声很吵，\n却比不过心里的空洞。\n\n${charPersonality}的我，\n注定孤独吗？`,
      'II': `${userName}...\n\n今天在${charOccupation === '未知' ? '那里' : charOccupation}又看到了${userName}。\n\n${userName}穿着米色的外套，\n在阳光下特别耀眼。\n\n我躲在角落里，\n像个小偷一样偷看。\n\n这样...不对吧？`,
      'III': `凌晨3点\n\n${userName}在我旁边睡着了。\n\n我数着${userName}的呼吸：\n一、二、三...\n\n如果时间能停在这一刻，\n该多好。\n\n——${charName}`
    };

    return {
      location: phase === 'I' ? '公寓 · 深夜' : phase === 'II' ? '街角咖啡馆' : '家中 · 卧室',
      timeContext: phaseLabels[phase],
      condition: '纸张边缘不规则撕裂，有水渍痕迹',
      text: contents[phase],
      dateWritten: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toLocaleDateString('zh-CN')
    };
  }

  if (type === 'inscribed_photo') {
    const scenes = {
      'I': `空无一人的${charOccupation === '学生' ? '图书馆' : '办公室'}，窗外细雨绵绵，桌上一杯已经冷掉的咖啡`,
      'II': `${userName}的侧影，在${new Date().getHours() > 18 ? '黄昏' : '午后'}的街道上行走。光线恰好打在${userName}的脸上`,
      'III': `我和${userName}的合照。但我用剪刀剪掉了左半边——那是我。我不配和${userName}在一起出现`
    };

    const inscriptions = {
      'I': `${charAge}岁的孤独\n${new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long' })}`,
      'II': `${userName}不知道我在看\n——偷来的瞬间`,
      'III': `剪掉的那一半是我\n我不配`
    };

    return {
      cameraInfo: phase === 'I' ? 'iPhone 14 Pro' : phase === 'II' ? 'Canon EOS 70-200mm' : 'Polaroid SX-70',
      timestamp: phaseLabels[phase],
      sceneDescription: scenes[phase],
      backInscription: inscriptions[phase],
      location: phase === 'I' ? (charOccupation === '学生' ? '大学图书馆' : '公司茶水间') : phase === 'II' ? '城市街道' : '家中',
      shootingDate: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000).toLocaleDateString('zh-CN')
    };
  }

  if (type === 'voice_memo') {
    const transcripts = {
      'I': `（深呼吸声）\n\n录音日期：${new Date().toLocaleDateString('zh-CN')}\n时间：凌晨2:17\n\n我...我是不是有问题？${charAge}岁了，还是一个人。\n\n${charPersonality}...大家都这么说我。但其实，我只是...\n\n（长时间停顿）\n\n...算了。习惯就好。`,
      'II': `（压抑的声音）\n\n今天是第${Math.floor(Math.random() * 90 + 30)}天。\n\n${userName}今天笑了...对着别人笑。不是对我。\n\n我捡起了${userName}掉在地上的笔。握着这支笔的时候，感觉自己拥有了${userName}的一部分。\n\n这样想...是不是很变态？`,
      'III': `（颤抖且激动的声音，带着哭腔）\n\n${userName}说爱我了！\n\n今天，${new Date().toLocaleDateString('zh-CN')}，${new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}，${userName}说爱我！\n\n我录下来了。我要永远保存。\n\n这样...这样${userName}就不能反悔了...`
    };

    const ambiences = {
      'I': '深夜 · 远处偶尔的车声 · 压抑的呼吸声 · 钟表滴答',
      'II': `${new Date().getHours() > 18 ? '黄昏' : '午后'} · 咖啡馆轻音乐 · 心跳声`,
      'III': '卧室 · 雨声 · 不规律的呼吸 · 枕头摩擦声'
    };

    return {
      label: phaseLabels[phase],
      timestamp: phaseLabels[phase],
      ambience: ambiences[phase],
      transcript: transcripts[phase],
      duration: `${Math.floor(Math.random() * 3 + 2)}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
      recordDate: new Date(Date.now() - Math.random() * 40 * 24 * 60 * 60 * 1000).toLocaleDateString('zh-CN'),
      deviceInfo: 'Voice Memos · iPhone'
    };
  }

  if (type === 'journal_entry') {
    const entries = {
      'I': `${new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })}\n${['晴', '阴', '雨', '多云'][Math.floor(Math.random() * 4)]}\n\n又去了那家书店。找了三个小时，还是没找到想要的书。\n\n也许要找的根本不是书。\n\n${charAge}岁的我，到底在寻找什么？`,
      'II': `机密日志 · 第${Math.floor(Math.random() * 100 + 50)}天\n\n开始系统性地记录${userName}的作息：\n\n07:30 - ${userName}从公寓出门\n08:00 - 在星巴克买美式咖啡（大杯，少冰）\n12:30 - 午餐\n\n我知道这样不对。但控制不住。${userName}就像突然出现的光。`,
      'III': `${new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })}\n第${Math.floor(Math.random() * 300 + 100)}天\n\n今天${userName}问我："你为什么总是盯着我看？"\n\n我说："因为喜欢啊。"\n\n${userName}笑了，说我奇怪。\n\n但${userName}不知道，我每天祈祷${userName}不要离开。`
    };

    return {
      dateLabel: phaseLabels[phase],
      timeContext: phaseLabels[phase],
      pageCondition: phase === 'III' ? '页面边缘有水渍，应该是泪痕' : '纸张微微泛黄，字迹工整但有些颤抖',
      entry: entries[phase],
      weather: ['晴', '阴', '雨', '多云'][Math.floor(Math.random() * 4)],
      mood: phase === 'I' ? '空虚' : phase === 'II' ? '焦虑' : '依赖'
    };
  }

  if (type === 'letter_to_user') {
    const letters = {
      'I': `致未来的你：\n\n我是${charName}，${charAge}岁，${charOccupation}。\n\n我不知道你是谁，也不知道你会在什么时候出现。但我想象过无数次，如果有人能懂我该多好。\n\n我会一直等你。\n\n——${charName}`,
      'II': `亲爱的${userName}：\n\n这是第${Math.floor(Math.random() * 50 + 20)}封写给你的信。\n\n你永远不会看到它们。我把它们都藏在床底的盒子里。\n\n从第一次见到你，我就知道——你就是我等的人。\n\n对不起。但我爱你。`,
      'III': `我最爱的${userName}：\n\n今天是我们在一起的第${Math.floor(Math.random() * 200 + 50)}天。\n\n你说我太黏人了。但你不知道...如果不时刻确认你在我身边，我会害怕。\n\n永远爱你，\n${charName}`
    };

    return {
      recipient: phase === 'I' ? '致未来的你' : userName,
      timeContext: phaseLabels[phase],
      paperCondition: phase === 'I' ? '全新信纸，字迹工整' : phase === 'II' ? '信纸微黄，有折痕和泪痕' : '信纸皱巴巴的，边缘有撕裂',
      letterBody: letters[phase],
      sealed: phase !== 'III',
      envelope: phase === 'II' ? '从未寄出' : phase === 'III' ? '已送达' : '等待收件人'
    };
  }

  if (type === 'letter_to_other') {
    const letters = {
      'I': `致心理咨询中心：\n\n我叫${charName}，${charAge}岁，${charOccupation}。\n\n我想咨询关于...孤独症的问题。\n\n这样的我，还能被爱吗？\n\n——${charName}`,
      'II': `致我的朋友：\n\n关于${userName}的事，不要告诉任何人。\n\n这是我的秘密。\n\n如果你敢泄露...我不知道我会做什么。\n\n——${charName}`,
      'III': `致XX：\n\n别担心，我很好。\n\n我和${userName}在一起了。\n\n我知道你觉得这段关系"不健康"。但我不在乎。\n\n——${charName}`
    };

    return {
      recipient: phase === 'I' ? '心理咨询中心' : phase === 'II' ? '某位朋友' : '亲人',
      timeContext: phaseLabels[phase],
      paperCondition: phase === 'I' ? '正式信纸，打印' : '手写，字迹潦草',
      letterBody: letters[phase],
      sent: phase === 'I',
      response: phase === 'I' ? '等待回复中' : '未寄出'
    };
  }

  if (type === 'letter_received') {
    const letters = {
      'I': `${charName}：\n\n好久不见，你最近好吗？\n\n听说你总是一个人待在房间里。我有点担心。\n\n要不要出来聊聊？\n\n——你的朋友`,
      'II': `${charName}：\n\n我注意到你最近状态不太对。\n\n是不是喜欢上谁了？小心点，不要做出让自己后悔的事。\n\n——关心你的人`,
      'III': `${charName}：\n\n恭喜你找到了${userName}。\n\n但说实话...我有点担心。你对${userName}的依恋似乎有点过度了？\n\n这样的关系...健康吗？\n\n——老友`
    };

    const annotations = {
      'I': `${charName}的批注：\n"不想见人。"`,
      'II': `${charName}的批注：\n"他们不懂。${userName}是我的救赎。"`,
      'III': `${charName}的批注：\n"嫉妒。他们都在嫉妒我。"`
    };

    return {
      sender: phase === 'I' ? '旧友' : '关心你的人',
      timeContext: phaseLabels[phase],
      paperCondition: phase === 'III' ? '信纸有折痕和撕裂痕迹' : '信纸完整',
      letterBody: letters[phase],
      charAnnotation: annotations[phase],
      opened: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toLocaleDateString('zh-CN')
    };
  }

  return {};
}
