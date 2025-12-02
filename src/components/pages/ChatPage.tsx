import { useState, useRef, useEffect } from 'react';

interface ChatPageProps {
  appState: any;
  onUpdate: (updates: any) => void;
  onClose: () => void;
  onNavigate: (page: string) => void;
}

export function ChatPage({ appState, onUpdate, onClose, onNavigate }: ChatPageProps) {
  const chat = appState.chats?.find((c: any) => c.id === appState.currentChatId);
  const contact = appState.contacts?.find((c: any) => c.id === chat?.contactId);
  
  const [message, setMessage] = useState('');
  const [pendingMessages, setPendingMessages] = useState<string[]>([]); // 待发送消息队列
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

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
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // 自动总结核心记忆
  const autoSummarizeCoreMemory = async () => {
    if (!appState.apiSettings?.apiUrl || !appState.apiSettings?.apiKey) return;

    try {
      const memoryInterval = chat.settings.memoryInterval || 10;
      const recentMessages = chat.messages.slice(-memoryInterval * 2);
      
      const conversationText = recentMessages
        .map((m: any) => `${m.role === 'user' ? '用户' : 'AI'}：${m.content}`)
        .join('\n');

      const currentMemory = chat.settings?.coreMemory || '';

      const summaryPrompt = `你现在将作为一个核心记忆分析模块，通过分析列表中的对话和自己的原始核心记忆，来扩充或修改现有的核心记忆。

请严格遵守：
1. 保留原始核心记忆，除非你认为对其进行简化后不影响信息量或某些原始核心记忆需要更新（例如：约定的时间已经过去，或者用户改变了约定，则更改原始核心记忆中相关的约定记忆）
2. 将生成内容添加在原始核心记忆（或者被你进行过调整的原始核心记忆）的后面
3. 若你认为当前上下文并不需要生成新的核心记忆，保留原始核心记忆即可
4. 若没有信息表明原始核心记忆需要修改/删除，请务必保留原始核心记忆，并紧接其后面生成新的记忆内容

生成内容要求：
1. 严格控制字数在50-100字内，尽可能精简
2. 仅保留对未来对话至关重要的信息
3. 按优先级提取：用户个人信息 > 用户偏好/喜好 > 重要约定 > 特殊事件 > 常去地点
4. 使用第一人称视角撰写，仿佛是你自己在记录对话记忆
5. 使用极简句式，省略不必要的修饰词，禁止使用颜文字和括号描述动作
6. 不保留日期、时间等临时性信息，除非是周期性的重要约定
7. 信息应当是从你的角度了解到的用户信息
8. 格式为简洁的要点，可用分号分隔不同信息

原始核心记忆：
${currentMemory || '（无）'}

最近的对话内容：
${conversationText}

仅返回你扩充/修改后的核心记忆内容，不要包含任何解释。`;

      const response = await fetch(`${appState.apiSettings.apiUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${appState.apiSettings.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: appState.apiSettings.selectedModel,
          messages: [
            { role: 'system', content: summaryPrompt }
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

  // 发送全部消息并获取AI回复
  const sendAllMessages = async () => {
    if (pendingMessages.length === 0 || !contact || isSending) return;

    setIsSending(true);

    // 将所有待发送消息添加到聊天记录
    const newUserMessages = pendingMessages.map((content, index) => ({
      id: (Date.now() + index).toString(),
      role: 'user',
      content,
      timestamp: Date.now() + index,
      avatar: contact.userAvatar
    }));

    const updatedMessages = [...(chat.messages || []), ...newUserMessages];
    
    // 更新聊天记录
    let updatedChats = appState.chats.map((c: any) => 
      c.id === chat.id 
        ? { 
            ...c, 
            messages: updatedMessages, 
            lastMessage: pendingMessages[pendingMessages.length - 1], 
            lastTime: Date.now() 
          }
        : c
    );
    
    onUpdate({ chats: updatedChats });
    setPendingMessages([]); // 清空待发送区

    // 调用API获取回复
    try {
      if (!appState.apiSettings?.apiUrl || !appState.apiSettings?.apiKey) {
        throw new Error('请先配置API');
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

### 讯息模式规则（Message Mode）

核心原则：
· 目标：模拟真实的手机私信/DM对话，像朋友聊天一样自然
· 风格：纯文本消息，口语化，简短直接

严格禁止：
1. 禁止使用括号 () 进行任何动作或心理描写
2. 禁止使用 ** 或其他格式标记动作
3. 禁止小说式旁白、场景描述
4. 禁止"xxx（动作）"这类格式

消息分割与格式：
· 使用 ||| 分隔多条消息，模拟连续发送的感觉
· 句尾禁止句号（除非是正式语境）
· 省略号谨慎使用，避免显得犹豫
· 单条消息应该是一个完整的思绪单元

长度控制：
· 情绪稳定时：保持简短，10-30字为宜
· 情绪波动时：可以稍长，表达强调，但不超过50字
· 连续逻辑的短句可在同条消息内，独立情感必须拆分

示例对比：
❌ 错误："好的（微笑）我马上过去"
✅ 正确："好的|||马上过去"

❌ 错误："*看着你* 你今天心情好像不太好？"
✅ 正确："你今天心情好像不太好"

❌ 错误："嗯……我明白了。那就这样吧。"  
✅ 正确："嗯我明白了|||那就这样吧"`;
      } else {
        // 沉浸模式 - 角色扮演风格
        systemPrompt = `你是${contact.charName}。${contact.charSettings}。你必须完全遵循以上设定进行对话。${languageRules}

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
· 每个场景元素独立发送
· 示例：
  "天色渐暗|||雨声淅沥|||街道上行人稀少"

2. 【主角扮演轨道】Protagonist_Track  
· 你扮演的角色（${contact.charName}）
· 动作/心理用 (描述) 标记，遵循动作描写规则
· 对话直接输出，不加引号
· 动作、心理、对话分别独立发送
· 示例：
  "(抬起头 看向窗外)|||有点冷|||要不要关窗"

3. 【NPC扮演轨道】NPC_Track
· 场景中的其他角色
· 格式：【NPC姓名】：(动作/神态) 对话内容
· 每个NPC独立发送
· 示例：
  "【服务员】：(微笑着 走过来) 两位需要点些什么"

气泡分割规则：
· 使用 ||| 分隔每个独立的"叙事块"
· 一个动作 = 一条消息
· 一句对话 = 一条消息  
· 一个心理活动 = 一条消息
· 一个场景描述 = 一条消息

示例完整流程：
(推开门)|||里面一片漆黑|||(摸索着 找到开关)|||灯光亮起|||房间里空无一人|||(皱眉 感到疑惑)|||奇怪，明明说好在这里等的|||【陌生人】：(从阴影中走出) 你终于来了

注意事项：
· 每个叙事块独立且完整
· 保持电影分镜感，画面流动自然
· NPC对话要有个性，避免千篇一律
· 环境描写适度，不要过度渲染
· 动作描写精简，用空格分隔，无标点`;
      }

      const userInfo = contact.userSettings ? `用户信息：${contact.userName || '用户'}，${contact.userSettings}` : '';
      const coreMemory = chat?.settings?.coreMemory || '';
      const coreMemoryPrompt = coreMemory ? `\n核心记忆：${coreMemory}` : '';

      // 获取上下文轮数设置
      const rounds = chat?.settings?.contextRounds || 10;
      const contextMessages = updatedMessages.slice(-rounds * 2); // 取最近N轮对话

      const messages = [
        { role: 'system', content: systemPrompt + (userInfo ? '\n' + userInfo : '') + coreMemoryPrompt },
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
      
      // 检查是否包含气泡分隔符 |||
      const bubbles = aiResponse.split('|||').map((text: string) => text.trim()).filter((text: string) => text.length > 0);
      
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

  // 获取头像显示设置
  const showAIAvatar = chat?.settings?.showAIAvatar !== false;
  const showUserAvatar = chat?.settings?.showUserAvatar !== false;
  const showHeaderAvatar = chat?.settings?.showHeaderAvatar !== false;

  return (
    <div className="app-page chat-page">
      <div className="app-header chat-header">
        <button className="back-btn" onClick={onClose}>
          <i className="fas fa-chevron-left"></i>
        </button>
        <div className="chat-title">
          {showHeaderAvatar && (
            <div className="title-avatar">
              {contact.charAvatar ? (
                <img src={contact.charAvatar} alt={contact.charName} />
              ) : (
                <i className="fas fa-user"></i>
              )}
            </div>
          )}
          <h1>{contact.charName}</h1>
        </div>
        <button className="settings-btn" onClick={() => onNavigate('ChatSettings')}>
          <i className="fas fa-cog"></i>
        </button>
      </div>

      <div 
        className="chat-messages"
        style={{
          backgroundImage: chat.wallpaper ? `url(${chat.wallpaper})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        {chat.messages?.length === 0 && pendingMessages.length === 0 ? (
          <div className="chat-empty">
            <p>开始和 {contact.charName} 聊天吧</p>
          </div>
        ) : (
          <>
            {/* 已发送的消息 */}
            {chat.messages?.map((msg: any) => (
              <div key={msg.id} className={`message ${msg.role}`}>
                {msg.role === 'assistant' && showAIAvatar && msg.avatar && (
                  <div className="message-avatar">
                    <img src={msg.avatar} alt="" />
                  </div>
                )}
                {msg.role === 'user' && showUserAvatar && msg.avatar && (
                  <div className="message-avatar">
                    <img src={msg.avatar} alt="" />
                  </div>
                )}
                <div className={`message-bubble ${msg.isError ? 'error' : ''}`}>
                  {msg.content}
                </div>
              </div>
            ))}

            {/* 待发送的消息 */}
            {pendingMessages.map((content, index) => (
              <div key={`pending-${index}`} className="message user pending">
                {showUserAvatar && contact.userAvatar && (
                  <div className="message-avatar">
                    <img src={contact.userAvatar} alt="" />
                  </div>
                )}
                <div className="message-bubble pending-bubble">
                  {content}
                  <button 
                    className="remove-pending-btn"
                    onClick={() => removePending(index)}
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      <div className="chat-input-container">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addToPending()}
          placeholder="输入消息..."
          className="chat-input"
          disabled={isSending}
        />
        <button 
          className="add-pending-btn"
          onClick={addToPending}
          disabled={!message.trim() || isSending}
          title="添加到待发送区"
        >
          <i className="fas fa-plus"></i>
        </button>
        <button 
          className="send-all-btn"
          onClick={sendAllMessages}
          disabled={pendingMessages.length === 0 || isSending}
          title="发送全部消息"
        >
          {isSending ? (
            <i className="fas fa-spinner fa-spin"></i>
          ) : (
            <i className="fas fa-paper-plane"></i>
          )}
          {pendingMessages.length > 0 && (
            <span className="pending-count">{pendingMessages.length}</span>
          )}
        </button>
      </div>
    </div>
  );
}