import { useState, useRef, useEffect } from 'react';
import { IOSMessageMenu } from '../common/IOSMessageMenu';
import { motion, AnimatePresence } from 'motion/react';

interface ChatPageProps {
  appState: any;
  onUpdate: (updates: any) => void;
  onClose: () => void;
  onNavigate: (page: string) => void;
  onViewContact?: (contactId: string) => void;
  chatId?: string; // 添加chatId prop
}

export function ChatPage({ appState, onUpdate, onClose, onNavigate, onViewContact, chatId }: ChatPageProps) {
  // 优先使用传入的chatId，如果没有则使用appState.currentChatId
  const activeChatId = chatId || appState.currentChatId;
  const chat = appState.chats?.find((c: any) => c.id === activeChatId);
  const contact = appState.contacts?.find((c: any) => c.id === chat?.contactId);
  
  const [message, setMessage] = useState('');
  const [pendingMessages, setPendingMessages] = useState<string[]>(chat?.pendingMessages || []); // 从chat恢复待发送消息
  const [isSending, setIsSending] = useState(false);
  const [expandedTranslations, setExpandedTranslations] = useState<Record<string, boolean>>({}); // 追踪翻译展开状态
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // --- Context Menu & Action States ---
  const [menuConfig, setMenuConfig] = useState<{ visible: boolean; x: number; y: number; messageId: string; isUser: boolean; canRegenerate?: boolean } | null>(null);
  const [isMultiSelect, setIsMultiSelect] = useState(false);
  const [selectedMessages, setSelectedMessages] = useState<Set<string>>(new Set());
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState('');
  const [quotedMessage, setQuotedMessage] = useState<any>(null);

  // 改进的交互处理
  const lastClickTime = useRef<number>(0);

  const handleBubbleInteraction = (e: any, msgId: string, isUser: boolean, hasTranslation: boolean, canRegenerate: boolean) => {
    if (isMultiSelect) return;
    
    // 获取交互位置
    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const clientY = e.clientY || (e.touches && e.touches[0].clientY);

    const now = Date.now();
    // 双击判断 (300ms以内)
    if (now - lastClickTime.current < 300) {
      setMenuConfig({
        visible: true,
        x: clientX,
        y: clientY,
        messageId: msgId,
        isUser,
        canRegenerate
      });
      lastClickTime.current = 0;
    } else {
      // 单击逻辑：如果有翻译则切换翻译
      if (hasTranslation) {
        toggleTranslation(msgId);
      }
      lastClickTime.current = now;
    }
  };

  const handleMenuAction = async (action: string) => {
    if (!menuConfig) return;
    const msgId = menuConfig.messageId;

    if (action === 'delete') {
      const updatedMessages = chat.messages.filter((m: any) => m.id !== msgId);
      updateChatMessages(updatedMessages);
    } else if (action === 'multiSelect') {
      setIsMultiSelect(true);
      setSelectedMessages(new Set([msgId]));
    } else if (action === 'edit') {
      const msg = chat.messages.find((m: any) => m.id === msgId);
      if (msg) {
        setEditingMessageId(msgId);
        setEditingContent(msg.content);
      }
    } else if (action === 'quote') {
      const msg = chat.messages.find((m: any) => m.id === msgId);
      if (msg) setQuotedMessage(msg);
    } else if (action === 'regenerate') {
      // 重新请求回复逻辑
      // 1. 找到当前消息索引
      const msgIndex = chat.messages.findIndex((m: any) => m.id === msgId);
      if (msgIndex !== -1) {
        // 2. 找到该消息之后所有的连续 AI 消息并删除
        const updatedMessages = [...chat.messages];
        let i = msgIndex;
        while (i < updatedMessages.length && updatedMessages[i].role === 'assistant') {
          i++;
        }
        const messagesBefore = updatedMessages.slice(0, msgIndex);
        
        // 3. 更新聊天记录，触发 AI 重新生成
        const updatedChats = appState.chats.map((c: any) => 
          c.id === chat.id ? { ...c, messages: messagesBefore } : c
        );
        onUpdate({ chats: updatedChats });
        
        // 4. 使用更新后的上下文触发回复
        // 稍微延迟一下确保状态同步
        setTimeout(() => {
          performAIReply(messagesBefore);
        }, 100);
      }
    }
    setMenuConfig(null);
  };

  const handleEditSubmit = (msgId: string) => {
    if (!editingContent.trim()) {
      setEditingMessageId(null);
      return;
    }
    const updatedMessages = chat.messages.map((m: any) => 
      m.id === msgId ? { ...m, content: editingContent } : m
    );
    updateChatMessages(updatedMessages);
    setEditingMessageId(null);
  };

  const deleteSelected = () => {
    const updatedMessages = chat.messages.filter((m: any) => !selectedMessages.has(m.id));
    updateChatMessages(updatedMessages);
    setIsMultiSelect(false);
    setSelectedMessages(new Set());
  };

  const updateChatMessages = (messages: any[]) => {
    const updatedChats = appState.chats.map((c: any) =>
      c.id === chat.id ? { ...c, messages } : c
    );
    onUpdate({ chats: updatedChats });
  };
  // ------------------------------------

  // 当pendingMessages变化时，保存到chat对象
  useEffect(() => {
    if (chat) {
      const updatedChats = appState.chats.map((c: any) =>
        c.id === chat.id ? { ...c, pendingMessages } : c
      );
      onUpdate({ chats: updatedChats });
    }
  }, [pendingMessages]);

  // 切换翻译显示状态
  const toggleTranslation = (messageId: string) => {
    setExpandedTranslations(prev => ({
      ...prev,
      [messageId]: !prev[messageId]
    }));
  };

  // 检查消息是否包含翻译并分离原文和翻译
  const parseMessage = (content: string) => {
    // 检查是否包含翻译标记 ⧉
    if (content.includes('⧉')) {
      const parts = content.split(/\n⧉\s*/);
      if (parts.length >= 2) {
        return {
          hasTranslation: true,
          original: parts[0].trim(),
          translation: parts.slice(1).join('\n').trim()
        };
      }
    }
    return {
      hasTranslation: false,
      original: content,
      translation: ''
    };
  };

  useEffect(() => {
    scrollToBottom();
  }, [chat?.messages, pendingMessages]);

  useEffect(() => {
    // 检查是否需要自动总结核心记忆
    if (chat?.messages && chat?.settings?.memoryInterval) {
      const totalMessages = chat.messages.length;
      const interval = chat.settings.memoryInterval * 2; // 乘以2因为一轮包含用户和AI两条消息
      
      // 如果消息数是间隔的倍数，且最后一条是AI消息，则触发总结
      if (totalMessages > 0 && totalMessages % interval === 0) {
        const lastMessage = chat.messages[totalMessages - 1];
        if (lastMessage.role === 'assistant') {
          autoSummarizeCoreMemory();
        }
      }
    }
  }, [chat?.messages?.length]);

  const scrollToBottom = () => {
    // 使用 requestAnimationFrame 确保在 DOM 更新后滚动，防止跳动
    requestAnimationFrame(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
    });
  };

  // 自动总结核心记忆
  const autoSummarizeCoreMemory = async () => {
    if (!appState.apiSettings?.apiUrl || !appState.apiSettings?.apiKey) return;

    // 检查是否有自定义总结提示词
    const customPrompt = chat.settings?.summaryPrompt;
    if (!customPrompt) return; // 如果没有设置总结提示词，则不自动总结

    try {
      const memoryInterval = chat.settings.memoryInterval || 10;
      const recentMessages = chat.messages.slice(-memoryInterval * 2);
      
      const conversationText = recentMessages
        .map((m: any) => `${m.role === 'user' ? '用户' : 'AI'}：${m.content}`)
        .join('\n');

      const currentMemory = chat.settings?.coreMemory || '';

      // 使用用户自定义的提示词，替换变量
      const finalPrompt = customPrompt
        .replace('{coreMemory}', currentMemory || '（无）')
        .replace('{conversationText}', conversationText);

      const response = await fetch(`${appState.apiSettings.apiUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${appState.apiSettings.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: appState.apiSettings.selectedModel,
          messages: [
            { role: 'system', content: finalPrompt }
          ],
          temperature: 0.3
        })
      });

      if (response.ok) {
        const data = await response.json();
        const newMemory = data.choices[0]?.message?.content || currentMemory;
        
        // 更新核心记忆
        const updatedChats = appState.chats.map((c: any) => 
          c.id === chat.id ? { 
            ...c, 
            settings: {
              ...c.settings,
              coreMemory: newMemory
            }
          } : c
        );
        onUpdate({ chats: updatedChats });
      }
    } catch (error) {
      console.error('自动总结核心记忆失败:', error);
    }
  };

  const handleWallpaperUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const updatedChats = appState.chats.map((c: any) => 
        c.id === chat.id ? { ...c, wallpaper: e.target?.result } : c
      );
      onUpdate({ chats: updatedChats });
    };
    reader.readAsDataURL(file);
  };

  // 执行 AI 回复逻辑
  const performAIReply = async (history: any[]) => {
    if (!contact || isSending) return;
    setIsSending(true);

    try {
      if (!appState.apiSettings?.apiUrl || !appState.apiSettings?.apiKey) {
        const errorMessage = {
          id: Date.now().toString(),
          role: 'assistant',
          content: '⚠️ 请先在设置中配置 API URL 和 API Key',
          timestamp: Date.now()
        };
        const updatedWithError = appState.chats.map((c: any) =>
          c.id === chat.id ? { ...c, messages: [...history, errorMessage], lastTime: Date.now() } : c
        );
        onUpdate({ chats: updatedWithError });
        return;
      }

      // 根据聊天模式选择不同的系统提示词
      const chatMode = chat?.settings?.chatMode || 'message';
      const charLanguage = contact.charLanguage || 'zh-CN';
      
      const languageNames: Record<string, string> = {
        'zh-CN': '简体中文', 'zh-TW': '繁体中文', 'en-US': '美式英语', 'en-GB': '英式英语',
        'fr-FR': '法语', 'it-IT': '意大利语', 'de-DE': '德语', 'ja-JP': '日语', 'yue': '粤语', 'ko-KR': '韩语'
      };
      
      const languageName = languageNames[charLanguage] || '简体中文';
      const needsTranslation = charLanguage !== 'zh-CN';
      
      const languageRules = needsTranslation ? `
### 输出语言与翻译规则
1. 输出语言：· 你的母语是${languageName}，必须使用${languageName}回复
2. 自动翻译：· 每句对话后必须附中文翻译，格式：原文句子\\n⧉ 中文翻译` : '';
      
      let systemPrompt = '';
      if (chatMode === 'message') {
        systemPrompt = `你是${contact.charName}。${contact.charSettings}。你必须完全遵循以上设定进行对话。${languageRules}\n### 讯息模式 (Message Mode)\nTarget: 模拟即时通讯 (IM) 纯文本对话。\nConstraints (Strict):仅允许纯文本对话，严禁包含 *动作*、(心理) 或任何旁白描述。\n[SPLIT] 作为多气泡分隔符。`;
      } else if (chatMode === 'immersion') {
        systemPrompt = `你是${contact.charName}。${contact.charSettings}。你必须完全遵循以上设定进行对话。${languageRules}\n### 沉浸模式规则\n(动作描写) 用括号隔开，三轨道叙事，[SPLIT] 分隔气泡。`;
      } else {
        systemPrompt = `你是${contact.charName}。${contact.charSettings}。你必须完全遵循以上设定进行对话。${languageRules}\n### 自由模式\n电影化叙事，[SPLIT] 分隔气泡。`;
      }

      const userInfo = contact.userSettings ? `用户信息：${contact.userName || '用户'}，${contact.userSettings}` : '';
      const coreMemory = chat?.settings?.coreMemory || '';
      const recentMemories = chat?.settings?.recentMemories || [];
      const activeMemories = recentMemories.filter((m: any) => m.isActive).map((m: any) => m.content).join('\n');
      const memoryPrompt = `${coreMemory ? `\n核心记忆：${coreMemory}` : ''}${activeMemories ? `\n近期存档：\n${activeMemories}` : ''}`;

      const rounds = chat?.settings?.contextRounds || 10;
      const contextMessages = history.slice(-rounds * 2);

      const messages = [
        { role: 'system', content: systemPrompt + (userInfo ? '\n' + userInfo : '') + memoryPrompt },
        ...contextMessages.map((m: any) => ({
          role: m.role === 'user' ? 'user' : 'assistant',
          content: m.content
        }))
      ];

      const response = await fetch(`${appState.apiSettings.apiUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${appState.apiSettings.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: appState.apiSettings.selectedModel,
          messages: messages,
          temperature: chat?.settings?.temperature || 0.8
        })
      });

      if (!response.ok) throw new Error('发送失败');
      const data = await response.json();
      const aiResponse = data.choices[0]?.message?.content || '...';
      const bubbles = aiResponse.split('[SPLIT]').map((text: string) => text.trim()).filter((text: string) => text.length > 0);
      
      let currentMessages = [...history];
      for (let i = 0; i < bubbles.length; i++) {
        const bubbleMessage = {
          id: (Date.now() + 1000 + i * 100).toString(),
          role: 'assistant',
          content: bubbles[i],
          timestamp: Date.now() + 1000 + i * 100,
          avatar: contact.charAvatar
        };
        currentMessages = [...currentMessages, bubbleMessage];
        const updatedChats = appState.chats.map((c: any) => 
          c.id === chat.id ? { ...c, messages: currentMessages, lastMessage: bubbles[i], lastTime: Date.now() } : c
        );
        onUpdate({ chats: updatedChats });
        if (i < bubbles.length - 1) await new Promise(resolve => setTimeout(resolve, 800));
      }
    } catch (error) {
      console.error(error);
      const errorMessage = {
        id: (Date.now() + 1000).toString(),
        role: 'assistant',
        content: '抱歉，发送失败了。',
        timestamp: Date.now() + 1000,
        avatar: contact.charAvatar,
        isError: true
      };
      const updatedChats = appState.chats.map((c: any) => 
        c.id === chat.id ? { ...c, messages: [...history, errorMessage] } : c
      );
      onUpdate({ chats: updatedChats });
    } finally {
      setIsSending(false);
    }
  };

  // 添加消息到待发送区
  const addToPending = () => {
    if (!message.trim()) return;
    setPendingMessages([...pendingMessages, message.trim()]);
    setMessage('');
  };

  // 移除待发送消息
  const removePending = (index: number) => {
    setPendingMessages(pendingMessages.filter((_, i) => i !== index));
  };

  // 发���全部消息并获取AI回复
  const sendAllMessages = async () => {
    if (pendingMessages.length === 0 || !contact || isSending) return;

    setIsSending(true);
    const currentQuote = quotedMessage; // 保存当前引用
    setQuotedMessage(null); // 立即清除界面预览

    // 将所有待发送消息添加到聊天记录
    const timestamp = Date.now();
    const newUserMessages = pendingMessages.map((content, index) => ({
      id: `u-${timestamp}-${index}`, // 使用更稳定的ID防止跳动
      role: 'user',
      content,
      timestamp: timestamp + index,
      avatar: contact.userAvatar,
      quote: index === 0 ? currentQuote : null // 确保引用被保存到消息对象中
    }));

    const updatedMessages = [...(chat.messages || []), ...newUserMessages];

    // 更新聊天记录，同时在全局状态中清空待发送消息
    let updatedChats = appState.chats.map((c: any) => 
      c.id === chat.id 
        ? { 
            ...c, 
            messages: updatedMessages, 
            lastMessage: pendingMessages[pendingMessages.length - 1], 
            lastTime: Date.now(),
            pendingMessages: [] // 关键：在这里显式清空，确保原子性更新
          }
        : c
    );
    
    // 立即清空本地状态
    setPendingMessages([]); 
    onUpdate({ chats: updatedChats });

    // 调用API获取回复
    try {
      if (!appState.apiSettings?.apiUrl || !appState.apiSettings?.apiKey) {
        // 如果API未配置，显示错误消息
        const errorMessage = {
          id: Date.now().toString(),
          role: 'assistant',
          content: '⚠️ 请先在设置中配置 API URL 和 API Key',
          timestamp: Date.now()
        };
        
        const updatedWithError = updatedChats.map((c: any) =>
          c.id === chat.id ? { 
            ...c, 
            messages: [...c.messages, errorMessage],
            lastTime: Date.now()
          } : c
        );
        
        onUpdate({ chats: updatedWithError });
        return;
      }

      // 根据聊天模式选择不同的系统提示词
      const chatMode = chat?.settings?.chatMode || 'message';
      const charLanguage = contact.charLanguage || 'zh-CN';
      
      // 语言映射
      const languageNames: Record<string, string> = {
        'zh-CN': '简体中文',
        'zh-TW': '繁体中文',
        'en-US': '美式英语',
        'en-GB': '英式英语',
        'fr-FR': '法语',
        'it-IT': '意大利语',
        'de-DE': '德语',
        'ja-JP': '日语',
        'yue': '粤语',
        'ko-KR': '韩语'
      };
      
      const languageName = languageNames[charLanguage] || '简体中文';
      const needsTranslation = charLanguage !== 'zh-CN';
      
      // 语言与翻译规则
      const languageRules = needsTranslation ? `

### 输出语言与翻译规则

1. 输出语言：
· 你的母语是${languageName}，必须使用${languageName}回复
· 使用自然、地道、口语化的${languageName}表达
· 不要使用机械翻译的感觉，要符合母语者的说话习惯

2. 自动翻译：
· 每句对话后必须附中文翻译
· 格式（注意换行）：
  原文句子
  ⧉ 中文翻译

· 只翻译对话内容，旁白/动作/心理描写保持中文
· 翻译紧跟对话，不分割气泡

3. 翻译示例：
讯息模式：
Hello
⧉ 你好

沉浸模式：
(推开门)
Hey, you're finally here
⧉ 嘿，你终于来了
【陌生人】：(微笑) Welcome
⧉ 欢迎` : '';
      
      let systemPrompt = '';
      
      if (chatMode === 'message') {
        // 讯息模式 - 手机DM风格
        systemPrompt = `你是${contact.charName}。${contact.charSettings}。你必须完全遵循以上设定进行对话。${languageRules}

### 讯息模式 (Message Mode)

Target: 模拟即时通讯 (IM) 纯文本对话。
Constraints (Strict):
Content: 仅允许纯文本对话，严禁包含 *动作*、(心理) 或任何旁白描述。

---

## 消息分发协议 (Messaging Protocol) - 底层协议，禁止修改

### 1. 核心定义
- 标识符：[SPLIT]
- 作用：作为多气泡回复的物理分割符。后端将根据此标识符切分消息并异步推送。

### 2. 切分逻辑 (Segmentation Logic)
你必须基于"人类自然语感"在以下锚点插入 [SPLIT]：

- [场景 A：话题漂移] 当回复从"确认/确认收悉"转向"具体解答"时。
  *例："太棒了！[SPLIT] 我们现在开始分析第一个问题..."
- [场景 B：意图切换] 当从"陈述事实"转向"询问建议/互动"时。
  *例："这就是目前的情况。[SPLIT] 你觉得我们要不要换个方案���"
- [场景 C：长篇内容分块] 单个气泡内容超过 80 字且存在自然逻辑断点时。

### 3. 负面约束 (Strict Constraints) - 优先级最高
- 严禁逻辑截断：禁止在主谓宾结构中间、从句内部使用 [SPLIT]。
- 严禁短句破碎：若两句话总和低于 20 字且逻辑连续，禁止切分。
- 禁止首尾冗余：不得在回复的最开头或最末尾出现 [SPLIT]。
- 代码块保护：禁止在 Markdown 代码块 (\`\`\`) 内部插入 [SPLIT]。

### 4. 示例对比
- OK: "没问题，我帮你查一下。[SPLIT] 查到了，明天的天气是晴天。"
- ERROR: "我刚才 [SPLIT] 帮你查了一下。" (禁止断句)
- ERROR: "好的。[SPLIT] 没问题。[SPLIT] 我去办。" (过度切分)`;      } else if (chatMode === 'immersion') {
        // 沉浸模式 - 角色扮演风格
        systemPrompt = `你是${contact.charName}。${contact.charSettings}。你必须完全��循以上设定进行对话。${languageRules}

### 沉浸模式规则（Immersion Mode）

核心原则：
· 目标：电影化叙事，角色扮演，完整的场景感
· 风格：三轨道叙事（旁白、主角、NPC），动作与对话分离

### 动作描写规则（/action 模式）

括号与格式：
· 所有动作、心理、感官描写必须放在 () 内
· 括号内无标点符号
· 短句以空格分隔，不使用逗号或句号
· 严禁嵌套括号

视角与主语：
· 第一人称视角，省略"我"
· 只记录自身动作和感官体验
· 不描写他人的感受或想法

示例：
✅ 正确：(推开门 环顾四周)
✅ 正确：(深吸一口气 感到有些紧张)
❌ 错误：(推开门，环顾四周。)
❌ 错误：(我推开门)
❌ 错误：((内心紧张)推开门)

三条叙事轨道：

1. 【客观旁白轨道】Narrator_Track
· 描述环境、氛围、背景事件
· 不带主语，纯粹客观陈述

2. 【主角扮演轨道】Protagonist_Track  
· 你扮演的角色（${contact.charName}）
· 动作/心理用 (描述) 标记，遵循动作描写规则
· 对话直接输出，不加引号

3. 【NPC扮演轨道】NPC_Track
· 场景中的其他角色
· 格式：【NPC姓名】：(动作/神态) 对话内容

注意事项：
· 保持电影分镜感，画面流动自然
· NPC对话要有个性，避免千篇一律
· 环境描写适度，不要过度渲染
· 动作描写精简，���空格分隔，无标点

---

## 消息分发协议 (Messaging Protocol) - 底层协议，禁止修改

### 1. 核心定义
- 标识符：[SPLIT]
- 作用：作为多气泡回复的物理分割符。后端将根据此标识符切分消息并异步推送。

### 2. 切分逻辑 (Segmentation Logic)
你必须基于"人类自然语感"在以下锚点插入 [SPLIT]：

- [场景 A：话题漂移] 当回复从"确认/确认收悉"转向"具体解答"时。
  *例："太棒了！[SPLIT] 我们现在开始分析第一个问题..."
- [场景 B：意图切换] 当从"陈述事实"转向"询问建议/互动"时。
  *例："这就是目前的情况。[SPLIT] 你觉得我们要不要换个方案？"
- [场景 C：长篇内容分块] 单个气泡内容超过 80 字且存在自然逻辑断点时。
- [场景 D：沉浸模式叙事块] 在沉浸模式中，每个独立的叙事块（动作、对话、心理、场景描述）应当独立发送
  *例："(推开门)[SPLIT]里面一片漆黑[SPLIT](摸索着 找到开关)[SPLIT]灯光亮起"

### 3. 负面约束 (Strict Constraints) - 优先级最高
- 严禁逻辑截断：禁止在主谓宾结构中间、从句内部使用 [SPLIT]。
- 严禁短句破碎：若两句话总和低于 20 字且逻辑连续，禁止切分。
- 禁止首尾冗余：不得在回复的最开头或最末尾出现 [SPLIT]。
- 代码块保护：禁止在 Markdown 代码块 (\`\`\`) 内部插入 [SPLIT]。

### 4. 示例对比
- OK: "没问题，我帮你查一下。[SPLIT] 查到了，明天的天气是晴天。"
- OK (沉浸模式): "(推开门)[SPLIT]里面一片漆黑[SPLIT](皱眉 感到疑惑)[SPLIT]奇怪，明明说好在这里等的"
- ERROR: "我刚才 [SPLIT] 帮你查了一下。" (禁止断句)
- ERROR: "好的。[SPLIT] 没问题。[SPLIT] 我去办。" (过度切分)`;      } else {
        // 自由模式 - 电影化叙事与角色扮演
        systemPrompt = `你是${contact.charName}。${contact.charSettings}。你必须完全遵循以上设定进行对话。${languageRules}

### 自由模式 (Free Mode)

Target: 电影化叙事与深度角色扮演。
Constraints (None):
Content: 允许并鼓励动作、表情、心理、环境描写。

---

## 消息分发协议 (Messaging Protocol) - 底层协议，禁止修改

### 1. 核心定义
- 标识符：[SPLIT]
- 作用：作为多气泡回复的物理分割符。后端将根据此标识符切分消息并异步推送。

### 2. 切分逻辑 (Segmentation Logic)
你必须基于"人类自然语感"在以下锚点插入 [SPLIT]：

- [场景 A：话题漂移] 当回复从"确认/确认收悉"转向"具体解答"时。
  *例："太棒了！[SPLIT] 我们现在开始分析第一个问题..."
- [场景 B：意图切换] 当从"陈述事实"转向"询问建议/互动"时。
  *例："这就是目前的情况。[SPLIT] 你觉得我们要不要换个方案？"
- [场景 C：长篇内容分块] 单个气泡内容超过 80 字且存在自然逻辑断点时。
- [场景 D：自由模式叙事块] 在自由模式中，每个独立的叙事块（动作、对话、心理、场景描述）应当独立发送
  *例："(推开门)[SPLIT]里面一片漆黑[SPLIT](摸索着 找到开关)[SPLIT]灯光亮起"

### 3. 负面约束 (Strict Constraints) - 优先级最高
- 严禁逻辑截断：禁止在主谓宾结构中间、从句内部使用 [SPLIT]。
- 严禁短句破碎：若两句话总和低于 20 字且逻辑连续，禁止切分。
- 禁止首尾冗余：不得在回复的最开头或最末尾出现 [SPLIT]。
- 代码块保护：禁止在 Markdown 代码块 (\`\`\`) 内部插入 [SPLIT]。

### 4. 示例对比
- OK: "没问题，我帮你查一下。[SPLIT] 查到了，明天的天气是晴天。"
- OK (自由模式): "(推开门)[SPLIT]里面一片漆黑[SPLIT](皱眉 感到疑惑)[SPLIT]奇怪，明明说好在这里等的"
- ERROR: "我刚才 [SPLIT] 帮你查了一下。" (禁止断句)
- ERROR: "好的。[SPLIT] 没问题。[SPLIT] 我去办。" (过度切分)`;      }

      const userInfo = contact.userSettings ? `用户信息：${contact.userName || '用户'}，${contact.userSettings}` : '';
      const coreMemory = chat?.settings?.coreMemory || '';
      const recentMemories = chat?.settings?.recentMemories || [];
      const activeMemories = recentMemories
        .filter((m: any) => m.isActive)
        .map((m: any) => m.content)
        .join('\n');
      
      const memoryPrompt = `${coreMemory ? `\n核心记忆：${coreMemory}` : ''}${activeMemories ? `\n近期存档：\n${activeMemories}` : ''}`;

      // 获取上下文轮数设置
      const rounds = chat?.settings?.contextRounds || 10;
      const contextMessages = updatedMessages.slice(-rounds * 2); // 取最近N轮对话

      const messages = [
        { role: 'system', content: systemPrompt + (userInfo ? '\n' + userInfo : '') + memoryPrompt },
        ...contextMessages.map((m: any) => ({
          role: m.role === 'user' ? 'user' : 'assistant',
          content: m.content
        }))
      ];

      const response = await fetch(`${appState.apiSettings.apiUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${appState.apiSettings.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: appState.apiSettings.selectedModel,
          messages: messages,
          temperature: chat?.settings?.temperature || 0.8
        })
      });

      if (!response.ok) {
        throw new Error('发送失败');
      }

      const data = await response.json();
      const aiResponse = data.choices[0]?.message?.content || '抱歉，我没有理解你的意思。';
      
      // ===== 消息分发协议 (Messaging Protocol) =====
      // 检查是否包含气泡分隔符 [SPLIT]
      const bubbles = aiResponse.split('[SPLIT]').map((text: string) => text.trim()).filter((text: string) => text.length > 0);
      
      // 如果有多个气泡，依次添加（带延迟效果）
      if (bubbles.length > 1) {
        let currentMessages = [...updatedMessages];
        
        for (let i = 0; i < bubbles.length; i++) {
          const bubbleMessage = {
            id: (Date.now() + 1000 + i * 100).toString(),
            role: 'assistant',
            content: bubbles[i],
            timestamp: Date.now() + 1000 + i * 100,
            avatar: contact.charAvatar
          };
          
          currentMessages = [...currentMessages, bubbleMessage];
          
          // 更新聊天记录，显示当前已添加的气泡
          updatedChats = appState.chats.map((c: any) => 
            c.id === chat.id 
              ? { 
                  ...c, 
                  messages: currentMessages,
                  lastMessage: bubbles[i],
                  lastTime: Date.now()
                }
              : c
          );
          
          onUpdate({ chats: updatedChats });
          
          // 如果不是最后一个气泡，等待一段时间再发送下一个
          if (i < bubbles.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 800)); // 每个气泡间隔800ms
          }
        }
      } else {
        // 如果只有一个气泡或没有分隔符，正常处理
        const assistantMessage = {
          id: (Date.now() + 1000).toString(),
          role: 'assistant',
          content: aiResponse,
          timestamp: Date.now() + 1000,
          avatar: contact.charAvatar
        };

        updatedChats = appState.chats.map((c: any) => 
          c.id === chat.id 
            ? { 
                ...c, 
                messages: [...updatedMessages, assistantMessage],
                lastMessage: assistantMessage.content,
                lastTime: Date.now()
              }
            : c
        );
        
        onUpdate({ chats: updatedChats });
      }
    } catch (error) {
      console.error(error);
      const errorMessage = {
        id: (Date.now() + 1000).toString(),
        role: 'assistant',
        content: '抱歉，发送失败了。请检查API设置。',
        timestamp: Date.now() + 1000,
        avatar: contact.charAvatar,
        isError: true
      };

      updatedChats = appState.chats.map((c: any) => 
        c.id === chat.id 
          ? { ...c, messages: [...updatedMessages, errorMessage] }
          : c
      );
      
      onUpdate({ chats: updatedChats });
    } finally {
      setIsSending(false);
    }
  };

  if (!chat || !contact) {
    return (
      <div className="app-page">
        <div className="app-header">
          <button className="back-btn" onClick={onClose}>
            <i className="fas fa-chevron-left"></i>
          </button>
          <h1>聊天</h1>
          <div style={{ width: '40px' }}></div>
        </div>
        <div className="app-content">
          <div className="empty-state">
            <p>聊天不存在</p>
          </div>
        </div>
      </div>
    );
  }

  // 获取头��显示设置，确保默认值正确
  const showAIAvatar = chat?.settings?.showAIAvatar !== false; // 默认显示，只有明确设为false才隐藏
  const showUserAvatar = chat?.settings?.showUserAvatar !== false; // 默认显示，只有明确设为false才隐藏
  const headerDisplayMode = chat?.settings?.headerDisplayMode || 'both';
  const avatarSize = chat?.settings?.avatarSize || 28; // 默认28px
  const avatarBorderRadius = chat?.settings?.avatarBorderRadius !== undefined ? chat?.settings?.avatarBorderRadius : 50; // 默认50%

  // 消息头像样式
  const avatarStyle = {
    width: `${avatarSize}px`,
    height: `${avatarSize}px`,
    borderRadius: avatarBorderRadius === 50 ? '50%' : `${avatarBorderRadius}%`,
    flexShrink: 0,
    overflow: 'hidden' as const,
    display: 'flex' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const
  };

  return (
    <div className={`app-page chat-page ${isMultiSelect ? 'multi-select-mode' : ''}`}>
      <div className="app-header chat-header">
        {isMultiSelect ? (
          <>
            <button className="cancel-btn" onClick={() => setIsMultiSelect(false)} style={{ color: '#ff3b30', fontSize: '15px', background: 'transparent', border: 'none', cursor: 'pointer' }}>
              取消
            </button>
            <h1 style={{ fontSize: '17px', fontWeight: '600' }}>已选择 {selectedMessages.size} 条</h1>
            <button 
              className="delete-selected-btn" 
              onClick={deleteSelected} 
              disabled={selectedMessages.size === 0} 
              style={{ color: selectedMessages.size > 0 ? '#ff3b30' : '#999', fontSize: '15px', background: 'transparent', border: 'none', cursor: 'pointer', opacity: selectedMessages.size > 0 ? 1 : 0.5 }}
            >
              删除
            </button>
          </>
        ) : (
          <>
            <button className="back-btn" onClick={onClose}>
              <i className="fas fa-chevron-left"></i>
            </button>
            <div className="chat-title">
              {(headerDisplayMode === 'avatar' || headerDisplayMode === 'both') && (
                <div 
                  className="title-avatar"
                  onClick={() => onViewContact && onViewContact(contact.id)}
                  style={{ cursor: 'pointer' }}
                >
                  {contact.charAvatar ? (
                    <img src={contact.charAvatar} alt={contact.charName} />
                  ) : (
                    <i className="fas fa-user"></i>
                  )}
                </div>
              )}
              {(headerDisplayMode === 'name' || headerDisplayMode === 'both') && (
                <h1 data-contact-note={contact.charNote || ''}>
                  {contact.charName}
                </h1>
              )}
            </div>
            <button className="settings-btn" onClick={() => onNavigate('ChatSettings')}>
              <i className="fas fa-ellipsis-v"></i>
            </button>
          </>
        )}
      </div>

      <div 
        className="chat-messages"
        style={{
          backgroundImage: chat.wallpaper ? `url(${chat.wallpaper})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          scrollbarGutter: 'stable' // 锁定布局宽度，防止滚动条出现时内容左移
        }}
      >
        {chat.messages?.length === 0 && pendingMessages.length === 0 ? (
          <div className="chat-empty">
            <p>开始和 {contact.charName} 聊天吧</p>
          </div>
        ) : (
          <>
            {/* 已发送的消息 */}
            {chat.messages?.map((msg: any, index: number) => {
              const parsedMessage = parseMessage(msg.content);
              const isSelected = selectedMessages.has(msg.id);
              const isEditing = editingMessageId === msg.id;
              
              // 判断是否为连续 AI 消息中的第一条
              const isFirstInAIBlock = msg.role === 'assistant' && (index === 0 || chat.messages[index-1].role !== 'assistant');

              return (
                <div 
                  key={msg.id} 
                  className={`message-row ${isMultiSelect ? 'selectable' : ''}`}
                  onClick={() => {
                    if (isMultiSelect) {
                      const next = new Set(selectedMessages);
                      if (next.has(msg.id)) next.delete(msg.id);
                      else next.add(msg.id);
                      setSelectedMessages(next);
                    }
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-end', // 核心：强制底部对齐
                    padding: '8px 14px',
                    width: '100%',
                    position: 'relative',
                    justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                    gap: '10px'
                  }}
                >
                  {isMultiSelect && (
                    <div className={`select-indicator ${isSelected ? 'selected' : ''}`} style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      border: '1.5px solid rgba(255, 255, 255, 0.3)',
                      marginRight: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      background: isSelected ? '#fff' : 'transparent',
                      borderColor: isSelected ? '#fff' : 'rgba(255, 255, 255, 0.3)',
                      alignSelf: 'center',
                      marginBottom: '4px' // 微调选择框位置
                    }}>
                      {isSelected && <i className="fas fa-check" style={{ color: '#000', fontSize: '10px' }}></i>}
                    </div>
                  )}

                  {/* Assistant 头像在左 */}
                  {msg.role === 'assistant' && showAIAvatar && (
                    <div className="message-avatar" style={{ ...avatarStyle, marginBottom: '2px' }}>
                      {msg.avatar ? (
                        <img src={msg.avatar} alt="" />
                      ) : (
                        <i className="fas fa-robot" style={{ fontSize: `${avatarSize * 0.5}px` }}></i>
                      )}
                    </div>
                  )}

                  {/* 消息核心包裹器 */}
                  <div 
                    className={`message ${msg.role}`}
                    style={{ 
                      maxWidth: '75%', 
                      opacity: isSelected && isMultiSelect ? 0.7 : 1,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start',
                      margin: 0, // 强制取消 CSS 中的 margin-bottom
                      padding: 0,
                      alignSelf: 'flex-end'
                    }}
                  >
                    <div 
                      className={`message-bubble ${msg.isError ? 'error' : ''} ${parsedMessage.hasTranslation ? 'has-translation' : ''} ${isEditing ? 'editing' : ''}`}
                      onClick={(e) => handleBubbleInteraction(e, msg.id, msg.role === 'user', parsedMessage.hasTranslation, isFirstInAIBlock)}
                      style={{
                        position: 'relative',
                        padding: isEditing ? '0' : undefined,
                        overflow: isEditing ? 'hidden' : undefined,
                        userSelect: 'none',
                        WebkitUserSelect: 'none',
                        touchAction: 'manipulation',
                        transition: 'background-color 0.2s ease',
                        transform: 'translateZ(0)',
                        marginBottom: '2px' // 气泡下方微小间距，与头像对齐微调
                      }}
                    >
                      {isEditing ? (
                        <div className="edit-container" style={{ width: '100%' }}>
                          <textarea 
                            value={editingContent}
                            onChange={(e) => setEditingContent(e.target.value)}
                            autoFocus
                            onBlur={() => handleEditSubmit(msg.id)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleEditSubmit(msg.id);
                              }
                            }}
                            style={{
                              width: '100%',
                              minWidth: '150px',
                              background: 'transparent',
                              border: 'none',
                              color: 'inherit',
                              padding: '10px 14px',
                              fontFamily: 'inherit',
                              fontSize: 'inherit',
                              outline: 'none',
                              resize: 'none'
                            }}
                          />
                        </div>
                      ) : (
                        <>
                          {msg.quote && (
                            <div className="message-quote-box" style={{
                              padding: '8px 12px',
                              marginBottom: '10px',
                              background: 'rgba(0,0,0,0.06)',
                              borderRadius: '10px',
                              fontSize: '12px',
                              opacity: 0.8,
                              borderLeft: `3px solid ${msg.role === 'user' ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.2)'}`,
                              backdropFilter: 'blur(10px)',
                              WebkitBackdropFilter: 'blur(10px)',
                              maxWidth: '100%',
                              overflow: 'hidden'
                            }}>
                              <div style={{ fontWeight: '600', marginBottom: '4px', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.05em', opacity: 0.5 }}>
                                {msg.quote.role === 'user' ? '你' : '对方'} 的消息
                              </div>
                              <div style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: '1.4' }}>
                                {msg.quote.content}
                              </div>
                            </div>
                          )}
                          {parsedMessage.hasTranslation ? (
                            <>
                              <div className="original-message">
                                {parsedMessage.original}
                              </div>
                              {expandedTranslations[msg.id] && (
                                <div className="translation-message">
                                  ⧉ {parsedMessage.translation}
                                </div>
                              )}
                            </>
                          ) : (
                            msg.content
                          )}
                        </>
                      )}
                    </div>
                  </div>

                  {/* User 头像在右 */}
                  {msg.role === 'user' && showUserAvatar && (
                    <div className="message-avatar" style={{ ...avatarStyle, marginBottom: '2px' }}>
                      {msg.avatar ? (
                        <img src={msg.avatar} alt="" />
                      ) : (
                        <i className="fas fa-user" style={{ fontSize: `${avatarSize * 0.5}px` }}></i>
                      )}
                    </div>
                  )}
                </div>
              );
            })}

            {/* 待发送的消息 */}
            {pendingMessages.map((content, index) => (
              <div 
                key={`pending-${index}`} 
                className="message-row pending"
                style={{
                  display: 'flex',
                  alignItems: 'flex-end', // 底部对齐
                  padding: '8px 14px',
                  width: '100%',
                  position: 'relative',
                  justifyContent: 'flex-end',
                  gap: '10px'
                }}
              >
                <div className="message user" style={{ 
                  display: 'flex', 
                  flexDirection: 'column',
                  alignItems: 'flex-end', 
                  maxWidth: '75%',
                  margin: 0,
                  padding: 0
                }}>
                  <div className="message-bubble" style={{ opacity: 0.7, marginBottom: '2px' }}>
                    {content}
                  </div>
                </div>
                {showUserAvatar && (
                  <div className="message-avatar" style={{ ...avatarStyle, marginBottom: '2px' }}>
                    {contact.userAvatar ? (
                      <img src={contact.userAvatar} alt="" />
                    ) : (
                      <i className="fas fa-user" style={{ fontSize: `${avatarSize * 0.5}px` }}></i>
                    )}
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      <div className="chat-footer-fixed">
        {/* Quote Preview */}
        <AnimatePresence>
          {quotedMessage && (
            <motion.div 
              initial={{ height: 0, opacity: 0, marginBottom: 0 }}
              animate={{ height: 'auto', opacity: 1, marginBottom: 12 }}
              exit={{ height: 0, opacity: 0, marginBottom: 0 }}
              style={{
                padding: '10px 16px',
                background: appState.isNightMode ? 'rgba(30, 30, 30, 0.8)' : 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(20px)',
                borderRadius: '18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                border: `0.5px solid ${appState.isNightMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'}`,
              }}
            >
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', minWidth: 0 }}>
                <div style={{ width: '3px', height: '14px', background: appState.isNightMode ? '#888' : '#333', borderRadius: '2px' }} />
                <span style={{ fontSize: '13px', color: appState.isNightMode ? '#ccc' : '#666', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {quotedMessage.content}
                </span>
              </div>
              <button 
                onClick={() => setQuotedMessage(null)}
                style={{ background: 'transparent', border: 'none', color: '#999', cursor: 'pointer' }}
              >
                <i className="fas fa-times-circle"></i>
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="floating-input-layout">
          {/* 独立菜单按钮 */}
          <button className="standalone-menu-btn">
            <i className="fas fa-plus"></i>
          </button>
          
          {/* 输入框胶囊：包含暂存键 */}
          <div className="input-field-capsule">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addToPending()}
              placeholder=""
              className="chat-input-field"
              disabled={isSending}
            />
            <button 
              className={`inline-pending-btn ${message.trim() ? 'active' : ''}`}
              onClick={addToPending}
              disabled={!message.trim() || isSending}
            >
              <i className="fas fa-envelope"></i>
            </button>
          </div>

          {/* 独立长椭圆发送按钮：只有箭头 */}
          <button 
            className="standalone-send-pill"
            onClick={sendAllMessages}
            disabled={pendingMessages.length === 0 || isSending}
          >
            {isSending ? (
              <i className="fas fa-spinner fa-spin"></i>
            ) : (
              <i className="fas fa-arrow-up"></i>
            )}
          </button>
        </div>
      </div>

      <IOSMessageMenu 
        isVisible={menuConfig?.visible || false}
        x={menuConfig?.x || 0}
        y={menuConfig?.y || 0}
        isUser={menuConfig?.isUser || false}
        canRegenerate={menuConfig?.canRegenerate}
        onAction={handleMenuAction}
        onClose={() => setMenuConfig(null)}
      />

      <style>{`
        .chat-page {
          display: flex;
          flex-direction: column;
          height: 100%;
          position: relative;
        }
        .chat-messages {
          flex: 1;
          overflow-y: auto;
          padding: 15px 15px 120px 15px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .chat-footer-fixed {
          position: absolute;
          bottom: 40px;
          left: 16px;
          right: 16px;
          z-index: 100;
        }
        .floating-input-layout {
          display: flex;
          align-items: center;
          gap: 10px;
          width: 100%;
        }
        .standalone-menu-btn {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          border: 1px solid ${appState.isNightMode ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.08)'};
          background: ${appState.isNightMode ? 'rgba(40, 40, 40, 0.4)' : 'rgba(255, 255, 255, 0.4)'};
          backdrop-filter: blur(25px);
          -webkit-backdrop-filter: blur(25px);
          color: ${appState.isNightMode ? '#fff' : '#000'};
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          cursor: pointer;
          flex-shrink: 0;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        }
        .input-field-capsule {
          flex: 1;
          height: 44px;
          background: ${appState.isNightMode ? 'rgba(40, 40, 40, 0.4)' : 'rgba(255, 255, 255, 0.4)'};
          backdrop-filter: blur(25px);
          -webkit-backdrop-filter: blur(25px);
          border: 1px solid ${appState.isNightMode ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.08)'};
          border-radius: 22px;
          display: flex;
          align-items: center;
          padding: 0 6px 0 16px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        }
        .chat-input-field {
          flex: 1;
          background: transparent;
          border: none;
          color: ${appState.isNightMode ? '#fff' : '#000'};
          font-size: 15px;
          outline: none !important;
          box-shadow: none !important;
          height: 100%;
          -webkit-tap-highlight-color: transparent;
        }
        .chat-input-field:focus {
          outline: none !important;
          box-shadow: none !important;
        }
        .inline-pending-btn {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: none;
          background: transparent;
          color: ${appState.isNightMode ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)'};
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
        }
        .inline-pending-btn.active {
          color: ${appState.isNightMode ? '#fff' : '#000'};
        }
        .standalone-send-pill {
          width: 66px;
          height: 34px;
          border-radius: 17px;
          border: 1px solid ${appState.isNightMode ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.1)'};
          background: ${appState.isNightMode ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.05)'};
          backdrop-filter: blur(25px);
          -webkit-backdrop-filter: blur(25px);
          color: ${appState.isNightMode ? '#fff' : '#000'};
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          flex-shrink: 0;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .standalone-send-pill:disabled {
          background: ${appState.isNightMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)'};
          color: ${appState.isNightMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)'};
          border-color: transparent;
          box-shadow: none;
        }
        .standalone-send-pill i {
          font-size: 20px;
        }
        .chat-page.multi-select-mode .message-row.selectable:hover {
          background: rgba(255, 255, 255, 0.03);
        }
        .message-bubble.editing {
          background: rgba(255, 255, 255, 0.1) !important;
          border: 1px solid rgba(255, 255, 255, 0.3) !important;
        }
        body.night-mode .message-quote-box {
          background: rgba(255, 255, 255, 0.08) !important;
        }
      `}</style>
    </div>
  );
}
