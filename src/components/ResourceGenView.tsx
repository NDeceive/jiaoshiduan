import React, { useState } from 'react';
import { 
  Sparkles, 
  BookOpen, 
  Code, 
  HelpCircle, 
  Presentation, 
  ChevronRight, 
  RefreshCw, 
  Cpu, 
  FileDown, 
  Wand2, 
  CheckCircle,
  Clock,
  ArrowRight
} from 'lucide-react';
import { motion } from 'motion/react';
import { Resource, AgentLog } from '../types';

interface ResourceGenViewProps {
  resources: Resource[];
  setResources: React.Dispatch<React.SetStateAction<Resource[]>>;
  addAgentLogs: (logs: AgentLog[]) => void;
  preFilledTopic: string;
  preFilledGrade: string;
  preFilledType: 'curriculum' | 'coding_task' | 'quiz' | 'slides' | null;
  clearPreFilled: () => void;
}

export const ResourceGenView: React.FC<ResourceGenViewProps> = ({
  resources,
  setResources,
  addAgentLogs,
  preFilledTopic,
  preFilledGrade,
  preFilledType,
  clearPreFilled
}) => {
  // Config state
  const [type, setType] = useState<'curriculum' | 'coding_task' | 'quiz' | 'slides'>(preFilledType || 'curriculum');
  const [topic, setTopic] = useState(preFilledTopic || 'Python 递归算法');
  const [grade, setGrade] = useState(preFilledGrade || '高一');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [teacherPrompt, setTeacherPrompt] = useState('');
  const [customContext, setCustomContext] = useState('');

  // Execution state
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [currentAgent, setCurrentAgent] = useState('');
  const [currentPreviewResource, setCurrentPreviewResource] = useState<Resource | null>(
    resources.length > 0 ? resources[0] : null
  );

  // Fine-tuning state
  const [feedback, setFeedback] = useState('');
  const [isFineTuning, setIsFineTuning] = useState(false);
  const [showRawMarkdown, setShowRawMarkdown] = useState(false);

  // Pre-set CS Topics for quick selection
  const quickTopics = [
    'Python 递归算法',
    '二分折半查找',
    '快速排序与冒泡排序',
    'TCP三次握手连接',
    'Python 列表切片与拷贝',
    'CSS Flexbox 弹性布局'
  ];

  // Quick Action: Pre-fills values
  const handleQuickTopicSelect = (t: string) => {
    setTopic(t);
  };

  // Generate action
  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setIsGenerating(true);
    setActiveStep(1);
    setCurrentAgent('课程规划专家 @curriculum_planner');

    // Simulate stepping of agents
    const timer1 = setTimeout(() => {
      setActiveStep(2);
      setCurrentAgent('代码架构专家 @sandbox_executor');
    }, 1200);

    const timer2 = setTimeout(() => {
      setActiveStep(3);
      setCurrentAgent('教学评估专家 @quiz_verifier');
    }, 2400);

    const timer3 = setTimeout(() => {
      setActiveStep(4);
      setCurrentAgent('金牌助教专家 @pedagogy_coach');
    }, 3600);

    try {
      const response = await fetch('/api/gemini/generate-resource', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          topic,
          difficulty,
          grade,
          teacherPrompt,
          customContext
        })
      });

      if (!response.ok) {
        throw new Error('API server returned error');
      }

      const newResource = await response.json();
      
      // Complete generating animations
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);

      setTimeout(() => {
        setResources(prev => [newResource, ...prev]);
        addAgentLogs(newResource.logs || []);
        setCurrentPreviewResource(newResource);
        setIsGenerating(false);
        setActiveStep(0);
        setCurrentAgent('');
        setTeacherPrompt('');
        setCustomContext('');
        clearPreFilled();
      }, 500);

    } catch (err) {
      console.error(err);
      setIsGenerating(false);
      setActiveStep(0);
      alert('AI 生成失败，请重试');
    }
  };

  // Fine tune action
  const handleFineTune = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedback.trim() || !currentPreviewResource) return;

    setIsFineTuning(true);

    try {
      const response = await fetch('/api/gemini/fine-tune-resource', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          originalContent: currentPreviewResource.content,
          type: currentPreviewResource.type,
          feedback
        })
      });

      if (!response.ok) {
        throw new Error('API server returned error');
      }

      const { content: tunedContent, logs: tuningLogs } = await response.json();

      const updatedResource: Resource = {
        ...currentPreviewResource,
        content: tunedContent,
        fineTuneCount: (currentPreviewResource.fineTuneCount || 0) + 1
      };

      setResources(prev => prev.map(r => r.id === currentPreviewResource.id ? updatedResource : r));
      setCurrentPreviewResource(updatedResource);
      addAgentLogs(tuningLogs.map((l: any) => ({ ...l, resourceId: currentPreviewResource.id })));
      setFeedback('');
      setIsFineTuning(false);

    } catch (err) {
      console.error(err);
      setIsFineTuning(false);
      alert('AI 微调失败，请重试');
    }
  };

  // Export functions (Simulated)
  const handleExport = (format: 'md' | 'pdf' | 'docx') => {
    if (!currentPreviewResource) return;
    const element = document.createElement("a");
    const file = new Blob([currentPreviewResource.content], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = `${currentPreviewResource.title}.${format}`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // Quick Markdown-like Simple Formatter for Preview Card
  const renderFormattedMarkdown = (text: string) => {
    if (!text) return null;
    const lines = text.split('\n');
    let inCodeBlock = false;
    let codeContent: string[] = [];

    return lines.map((line, index) => {
      // Code Block Detection
      if (line.startsWith('```')) {
        if (inCodeBlock) {
          inCodeBlock = false;
          const content = codeContent.join('\n');
          codeContent = [];
          return (
            <pre key={index} className="bg-slate-50 border border-slate-200 p-4 rounded-xl font-mono text-xs text-slate-800 my-4 overflow-x-auto leading-relaxed">
              <code>{content}</code>
            </pre>
          );
        } else {
          inCodeBlock = true;
          return null;
        }
      }

      if (inCodeBlock) {
        codeContent.push(line);
        return null;
      }

      // Headers
      if (line.startsWith('# ')) {
        return <h1 key={index} className="text-xl font-bold text-slate-900 mt-6 mb-4 font-sans tracking-tight border-b border-slate-100 pb-2">{line.replace('# ', '')}</h1>;
      }
      if (line.startsWith('## ')) {
        return <h2 key={index} className="text-lg font-bold text-slate-800 mt-5 mb-3 font-sans tracking-tight">{line.replace('## ', '')}</h2>;
      }
      if (line.startsWith('### ')) {
        return <h3 key={index} className="text-sm font-bold text-slate-700 mt-4 mb-2 font-sans">{line.replace('### ', '')}</h3>;
      }

      // Bullets
      if (line.startsWith('* ') || line.startsWith('- ')) {
        return <li key={index} className="text-xs text-slate-600 ml-5 list-disc my-1.5 leading-relaxed">{line.substring(2)}</li>;
      }

      // Plain Text / inline math / bold highlights (simple conversions)
      if (line.trim() === '') {
        return <div key={index} className="h-2" />;
      }

      // Replace simple bullet formats or inline bold codes
      const formattedLine = line
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/`(.*?)`/g, '<code class="bg-slate-100 text-blue-600 font-mono px-1.5 py-0.5 rounded border border-slate-200 text-[11px]">$1</code>');

      return (
        <p 
          key={index} 
          className="text-xs text-slate-600 leading-relaxed my-2"
          dangerouslySetInnerHTML={{ __html: formattedLine }}
        />
      );
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 p-1">
      
      {/* Left Column (Configuration Form - 5 Columns) */}
      <div className="lg:col-span-5 space-y-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h4 className="text-sm font-bold text-slate-900 mb-5 flex items-center space-x-2">
            <Cpu size={16} className="text-blue-600" />
            <span>配置教研指令</span>
          </h4>

          <form onSubmit={handleGenerate} className="space-y-5">
            {/* Tab Type selection */}
            <div>
              <label className="text-xs font-semibold text-slate-500 block mb-2">生成资源类型</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'curriculum', label: '教学设计', icon: BookOpen },
                  { id: 'coding_task', label: '编程实战', icon: Code },
                  { id: 'quiz', label: '随堂测验', icon: HelpCircle },
                  { id: 'slides', label: '课件大纲', icon: Presentation },
                ].map((t) => {
                  const Icon = t.icon;
                  const isSelected = type === t.id;
                  return (
                    <button
                      type="button"
                      key={t.id}
                      onClick={() => setType(t.id as any)}
                      className={`flex items-center space-x-2 p-2.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                        isSelected 
                          ? 'bg-blue-50 border-blue-500 text-blue-700 shadow-inner' 
                          : 'bg-white border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50/50'
                      }`}
                    >
                      <Icon size={14} className={isSelected ? 'text-blue-600' : ''} />
                      <span>{t.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* CS Topic Area */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-semibold text-slate-500">核心知识考点 (主题)</label>
                <span className="text-[10px] text-slate-400 font-mono">必填</span>
              </div>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="例如: Python 递归算法"
                className="w-full bg-slate-50/50 border border-slate-200 focus:border-blue-500 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/10 transition-all font-sans"
              />
              
              {/* Quick autocompletes */}
              <div className="flex flex-wrap gap-1 mt-2">
                {quickTopics.map((qt, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleQuickTopicSelect(qt)}
                    className="text-[9px] bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-slate-700 px-2 py-0.5 rounded border border-slate-200 transition-colors cursor-pointer font-sans"
                  >
                    + {qt}
                  </button>
                ))}
              </div>
            </div>

            {/* Row Grade & Difficulty */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-500 block mb-1.5">教学适用年级</label>
                <select
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  className="w-full bg-slate-50/50 border border-slate-200 focus:border-blue-500 rounded-xl px-3 py-2.5 text-xs text-slate-800 focus:outline-none"
                >
                  <option value="高一">高中一年级 (高一)</option>
                  <option value="高二">高中二年级 (高二)</option>
                  <option value="高三">高中三年级 (高三)</option>
                  <option value="通用">通用学段</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-500 block mb-1.5">内容难度设定</label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as any)}
                  className="w-full bg-slate-50/50 border border-slate-200 focus:border-blue-500 rounded-xl px-3 py-2.5 text-xs text-slate-800 focus:outline-none"
                >
                  <option value="easy">Easy (基础巩固)</option>
                  <option value="medium">Medium (核心突围)</option>
                  <option value="hard">Hard (竞赛拔高)</option>
                </select>
              </div>
            </div>

            {/* Teacher instructions */}
            <div>
              <label className="text-xs font-semibold text-slate-500 block mb-1.5">
                个性化需求指令 (选填)
              </label>
              <textarea
                value={teacherPrompt}
                onChange={(e) => setTeacherPrompt(e.target.value)}
                placeholder="例如: “包含2道斐波那契和阶乘的代码填空”，“重点强调递归深度的堆栈溢出机制，写出 Python 完整示例。”"
                className="w-full h-20 bg-slate-50/50 border border-slate-200 focus:border-blue-500 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/10 transition-all font-sans resize-none"
              />
            </div>

            {/* Extra context files */}
            <div>
              <label className="text-xs font-semibold text-slate-500 block mb-1.5">
                辅导参考背景资料 (选填)
              </label>
              <textarea
                value={customContext}
                onChange={(e) => setCustomContext(e.target.value)}
                placeholder="选填。可黏贴参考的大纲知识点、或相关的教科书原文段落。"
                className="w-full h-14 bg-slate-50/50 border border-slate-200 focus:border-blue-500 rounded-xl px-4 py-2 text-[11px] text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/10 transition-all font-sans resize-none"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isGenerating || !topic.trim()}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 disabled:bg-slate-100 disabled:text-slate-400 disabled:border-slate-200 border border-blue-500/30 rounded-2xl text-white font-semibold text-xs flex items-center justify-center space-x-2 shadow-sm transition-all cursor-pointer"
            >
              {isGenerating ? (
                <>
                  <RefreshCw size={14} className="animate-spin text-blue-200" />
                  <span>正在协同智能体多路生成...</span>
                </>
              ) : (
                <>
                  <Sparkles size={14} className="text-blue-200" />
                  <span>立即生成资源</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Right Column (Live Preview + Fine-tune - 7 Columns) */}
      <div className="lg:col-span-7 flex flex-col min-h-[500px]">
        {isGenerating ? (
          /* Staggered Multi-agent generating monitor */
          <div className="flex-1 bg-white border border-slate-200 rounded-2xl p-8 flex flex-col justify-center items-center text-center space-y-6 shadow-sm">
            <div className="relative p-5 bg-blue-50 rounded-full border border-blue-100 text-blue-600">
              <RefreshCw size={32} className="animate-spin text-blue-600" />
              <Cpu size={14} className="absolute top-1 right-1 text-indigo-500" />
            </div>

            <div className="space-y-1 max-w-md">
              <h4 className="text-sm font-bold text-slate-900">4 个教研专家智能体正在组队研讨...</h4>
              <p className="text-xs text-slate-500">
                正在激活沙箱编译引擎、教学设计提纲。请稍等，通常需要 2-4 秒。
              </p>
            </div>

            {/* Progress Step List */}
            <div className="w-full max-w-sm bg-slate-50 border border-slate-200 rounded-xl p-4 text-left space-y-3 font-sans">
              <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono pb-2 border-b border-slate-200">
                <span>当前执行节点:</span>
                <span className="text-blue-600 font-bold">{currentAgent}</span>
              </div>
              
              {[
                { step: 1, label: '课程规划专家', desc: '考纲解析与大纲重构' },
                { step: 2, label: '代码架构专家', desc: '虚拟沙箱编译测试' },
                { step: 3, label: '教学评估专家', desc: '难度比对与黑盒测评' },
                { step: 4, label: '金牌助教专家', desc: '装配教学微课和导入语' },
              ].map((s) => {
                const isDone = activeStep > s.step;
                const isCurrent = activeStep === s.step;
                let statusIcon = <div className="w-3.5 h-3.5 rounded-full border border-slate-300 bg-slate-100 shrink-0" />;
                if (isDone) statusIcon = <CheckCircle size={14} className="text-emerald-500 shrink-0" />;
                else if (isCurrent) statusIcon = <RefreshCw size={14} className="animate-spin text-blue-500 shrink-0" />;

                return (
                  <div key={s.step} className="flex items-center space-x-3 text-xs">
                    {statusIcon}
                    <div className="flex-1 min-w-0">
                      <span className={`font-semibold ${isCurrent ? 'text-blue-600' : isDone ? 'text-slate-700' : 'text-slate-400'}`}>
                        {s.label}
                      </span>
                      <span className="text-[10px] text-slate-400 ml-2">({s.desc})</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : currentPreviewResource ? (
          /* Finished generated item preview and tuning options */
          <div className="flex-1 flex flex-col space-y-6">
            
            {/* Top Preview toolbar */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-sm">
              <div className="flex items-center space-x-3">
                <span className="text-xs font-mono font-bold bg-blue-50 border border-blue-100 px-2.5 py-1 rounded text-blue-600">
                  {currentPreviewResource.grade} • {currentPreviewResource.topic}
                </span>
                <span className="text-[11px] text-slate-400 font-mono">
                  微调轮次: x{currentPreviewResource.fineTuneCount || 0}
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowRawMarkdown(!showRawMarkdown)}
                  className="text-xs bg-slate-50 border border-slate-200 hover:border-slate-350 px-3 py-1.5 rounded-lg text-slate-600 hover:text-slate-900 cursor-pointer transition-colors"
                >
                  {showRawMarkdown ? '格式化预览' : '查看 Markdown 源码'}
                </button>

                <div className="w-px h-5 bg-slate-200" />

                {/* Export Dropdown options */}
                <div className="flex items-center space-x-1">
                  <button 
                    onClick={() => handleExport('md')}
                    className="p-1.5 hover:bg-slate-50 text-slate-500 hover:text-slate-800 rounded-md cursor-pointer transition-colors" 
                    title="导出为 Markdown"
                  >
                    <FileDown size={14} />
                  </button>
                  <button 
                    onClick={() => handleExport('pdf')}
                    className="p-1.5 hover:bg-slate-50 text-rose-500 hover:text-rose-700 rounded-md cursor-pointer transition-colors" 
                    title="导出为 PDF"
                  >
                    <span className="text-[10px] font-bold font-mono">PDF</span>
                  </button>
                  <button 
                    onClick={() => handleExport('docx')}
                    className="p-1.5 hover:bg-slate-50 text-blue-500 hover:text-blue-700 rounded-md cursor-pointer transition-colors" 
                    title="导出为 Word"
                  >
                    <span className="text-[10px] font-bold font-mono">DOC</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Scrollable Document Area */}
            <div className="flex-1 bg-white border border-slate-200 rounded-2xl p-6 max-h-[500px] overflow-y-auto font-sans relative shadow-inner">
              {showRawMarkdown ? (
                <pre className="text-xs text-slate-600 font-mono leading-relaxed whitespace-pre-wrap select-text selection:bg-blue-100">
                  {currentPreviewResource.content}
                </pre>
              ) : (
                <div className="select-text selection:bg-blue-100">
                  {renderFormattedMarkdown(currentPreviewResource.content)}
                </div>
              )}
            </div>

            {/* Fine tune actions */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center space-x-2 mb-3">
                <Wand2 size={14} className="text-blue-600" />
                <h5 className="text-xs font-bold text-slate-800">AI 智能微调及调整 (Fine-Tuning)</h5>
              </div>

              <form onSubmit={handleFineTune} className="flex space-x-3">
                <input
                  type="text"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="例如: “把代码示例换成 C++”、“增加一个边界溢出的教学要点”"
                  className="flex-1 bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-xl px-4 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/10"
                  disabled={isFineTuning}
                />
                <button
                  type="submit"
                  disabled={isFineTuning || !feedback.trim()}
                  className="bg-blue-50 hover:bg-blue-600 hover:text-white border border-blue-100 text-blue-600 active:bg-blue-700 disabled:bg-slate-50 disabled:text-slate-400 disabled:border-slate-200 px-4 rounded-xl text-xs font-semibold flex items-center space-x-1 transition-all cursor-pointer shrink-0"
                >
                  {isFineTuning ? (
                    <RefreshCw size={12} className="animate-spin text-blue-500" />
                  ) : (
                    <Sparkles size={12} className="text-blue-500" />
                  )}
                  <span>应用微调并重新生成</span>
                </button>
              </form>
            </div>

          </div>
        ) : (
          <div className="flex-1 bg-white border border-slate-200 rounded-2xl p-8 flex flex-col justify-center items-center text-center text-slate-400 shadow-sm">
            <BookOpen size={40} className="text-slate-300 mb-3" />
            <p className="text-xs font-semibold text-slate-700">尚未生成任何教研资源</p>
            <p className="text-[11px] text-slate-400 mt-1">请在左侧配置教研指令，点击“立即生成资源”开始</p>
          </div>
        )}
      </div>

    </div>
  );
};
