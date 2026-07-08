import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { DashboardView } from './components/DashboardView';
import { ResourceGenView } from './components/ResourceGenView';
import { QuizTasksView } from './components/QuizTasksView';
import { ClassAnalyticsView } from './components/ClassAnalyticsView';
import { AgentLogsView } from './components/AgentLogsView';
import { QuestionImportView } from './components/QuestionImportView';
import { motion, AnimatePresence } from 'motion/react';
import { 
  initialResources, 
  initialActiveQuizzes, 
  initialWeaknesses, 
  initialAgentLogs 
} from './mockData';
import { Resource, ActiveQuiz, AgentLog, ImportedQuestion } from './types';
import { BookOpen, FileDown, Eye } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  
  // App-level Shared State
  const [resources, setResources] = useState<Resource[]>(initialResources);
  const [quizzes, setQuizzes] = useState<ActiveQuiz[]>(initialActiveQuizzes);
  const [weaknesses, setWeaknesses] = useState(initialWeaknesses);
  const [agentLogs, setAgentLogs] = useState<AgentLog[]>(initialAgentLogs);

  // Prefilled parameters for transition shortcuts
  const [preFilledTopic, setPreFilledTopic] = useState('');
  const [preFilledGrade, setPreFilledGrade] = useState('');
  const [preFilledType, setPreFilledType] = useState<'curriculum' | 'coding_task' | 'quiz' | 'slides' | null>(null);

  // Preview Resource modal
  const [previewResource, setPreviewResource] = useState<Resource | null>(null);

  // Transition helper from dashboard weakness card to generator config
  const handlePreFillGenerator = (topic: string, grade: string, type: 'curriculum' | 'coding_task' | 'quiz' | 'slides') => {
    setPreFilledTopic(topic);
    setPreFilledGrade(grade);
    setPreFilledType(type);
    setActiveTab('generator');
  };

  const handleClearPreFilled = () => {
    setPreFilledTopic('');
    setPreFilledGrade('');
    setPreFilledType(null);
  };

  // Merge new AI generated logs
  const handleAddAgentLogs = (newLogs: AgentLog[]) => {
    setAgentLogs(prev => [...newLogs, ...prev]);
  };

  // Convert parsed questions into a Quiz test paper draft resource
  const handleImportSuccess = (imported: ImportedQuestion[]) => {
    const resourceId = `res-${Date.now()}`;
    const quizTitle = `${imported[0]?.topic || '智能导入'}考查随测卷 (AI导入版)`;
    
    // Construct beautiful markdown content from parsed questions
    let markdownContent = `# ${quizTitle}\n\n本卷由 AI 题库识别引擎于系统自动解析归档，题干格式、公式排版及解析已校验。\n\n`;
    
    imported.forEach((q, idx) => {
      markdownContent += `## 题 ${idx + 1}：${q.type === 'single' ? '单选题' : q.type === 'multiple' ? '多选题' : q.type === 'coding' ? '编程题' : '填空题'} (考点: ${q.topic})\n`;
      markdownContent += `${q.question}\n\n`;
      if (q.options && q.options.length > 0) {
        q.options.forEach(opt => {
          markdownContent += `* ${opt}\n`;
        });
        markdownContent += `\n`;
      }
      markdownContent += `**标准答案**：${q.answer}\n\n`;
      markdownContent += `**名师解析**：${q.analysis}\n\n`;
      markdownContent += `*难度分级：${q.difficulty}*\n\n---\n\n`;
    });

    const newResource: Resource = {
      id: resourceId,
      title: quizTitle,
      type: 'quiz',
      topic: imported[0]?.topic || '多维测验',
      difficulty: 'medium',
      grade: '通用学段',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      status: 'draft',
      content: markdownContent,
      fineTuneCount: 0
    };

    setResources(prev => [newResource, ...prev]);
    setActiveTab('generator'); // open generator so they can view/fine-tune it
  };

  // Format markdown helper for full preview modal
  const renderFormattedPreview = (text: string) => {
    if (!text) return null;
    const lines = text.split('\n');
    let inCodeBlock = false;
    let codeContent: string[] = [];

    return lines.map((line, index) => {
      if (line.startsWith('```')) {
        if (inCodeBlock) {
          inCodeBlock = false;
          const content = codeContent.join('\n');
          codeContent = [];
          return (
            <pre key={index} className="bg-slate-950 border border-slate-800 p-4 rounded-xl font-mono text-xs text-blue-300 my-4 overflow-x-auto">
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

      if (line.startsWith('# ')) return <h1 key={index} className="text-2xl font-bold text-slate-900 mt-6 mb-4 pb-2 border-b border-slate-200 font-sans tracking-tight">{line.replace('# ', '')}</h1>;
      if (line.startsWith('## ')) return <h2 key={index} className="text-xl font-bold text-slate-800 mt-5 mb-3 font-sans tracking-tight">{line.replace('## ', '')}</h2>;
      if (line.startsWith('### ')) return <h3 key={index} className="text-base font-bold text-slate-700 mt-4 mb-2 font-sans">{line.replace('### ', '')}</h3>;
      if (line.startsWith('* ') || line.startsWith('- ')) return <li key={index} className="text-sm text-slate-600 ml-5 list-disc my-1.5 leading-relaxed">{line.substring(2)}</li>;
      if (line.trim() === '') return <div key={index} className="h-2" />;

      const formattedLine = line
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/`(.*?)`/g, '<code class="bg-slate-100 text-blue-600 font-mono px-1.5 py-0.5 rounded border border-slate-200">$1</code>');

      return <p key={index} className="text-sm text-slate-600 leading-relaxed my-2" dangerouslySetInnerHTML={{ __html: formattedLine }} />;
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      
      {/* Navigation Sidebar */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area Container */}
      <div className="ml-64 flex flex-col min-h-screen">
        
        {/* Top Header Controls bar */}
        <TopBar activeTab={activeTab} />

        {/* Scrollable View Area */}
        <main className="p-8 flex-1 max-w-7xl w-full mx-auto overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'dashboard' && (
                <DashboardView 
                  resources={resources}
                  activeQuizzes={quizzes}
                  weaknesses={weaknesses}
                  onNavigateToTab={setActiveTab}
                  onSelectResourceForPreview={setPreviewResource}
                  onPreFillGenerator={handlePreFillGenerator}
                />
              )}

              {activeTab === 'generator' && (
                <ResourceGenView 
                  resources={resources}
                  setResources={setResources}
                  addAgentLogs={handleAddAgentLogs}
                  preFilledTopic={preFilledTopic}
                  preFilledGrade={preFilledGrade}
                  preFilledType={preFilledType}
                  clearPreFilled={handleClearPreFilled}
                />
              )}

              {activeTab === 'quizzes' && (
                <QuizTasksView 
                  quizzes={quizzes}
                  setQuizzes={setQuizzes}
                  availableResources={resources}
                />
              )}

              {activeTab === 'analytics' && (
                <ClassAnalyticsView 
                  weaknesses={weaknesses}
                  onPreFillGenerator={handlePreFillGenerator}
                />
              )}

              {activeTab === 'logs' && (
                <AgentLogsView 
                  logs={agentLogs}
                />
              )}

              {activeTab === 'import' && (
                <QuestionImportView 
                  onImportSuccess={handleImportSuccess}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* DETAILED MODAL OVERLAY: Resource Quick Inspector */}
      {previewResource && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white border border-slate-200 rounded-2xl max-w-3xl w-full max-h-[85vh] flex flex-col justify-between shadow-2xl"
          >
            {/* Header */}
            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg border border-blue-100">
                  <BookOpen size={16} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{previewResource.title}</h4>
                  <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                    考查科目：{previewResource.topic} | 适用：{previewResource.grade}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setPreviewResource(null)}
                className="text-slate-400 hover:text-slate-600 text-sm font-mono cursor-pointer"
              >
                ✕ 关闭窗口
              </button>
            </div>

            {/* Content Area */}
            <div className="p-6 overflow-y-auto select-text selection:bg-blue-100 font-sans max-h-[55vh]">
              {renderFormattedPreview(previewResource.content)}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex justify-end space-x-3 rounded-b-2xl">
              <button
                onClick={() => {
                  const element = document.createElement("a");
                  const file = new Blob([previewResource.content], { type: 'text/plain;charset=utf-8' });
                  element.href = URL.createObjectURL(file);
                  element.download = `${previewResource.title}.md`;
                  document.body.appendChild(element);
                  element.click();
                  document.body.removeChild(element);
                }}
                className="px-4.5 py-2.5 bg-white border border-slate-200 hover:border-slate-300 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-800 flex items-center space-x-1.5 cursor-pointer transition-colors"
              >
                <FileDown size={14} />
                <span>导出为 Markdown (.md)</span>
              </button>
              <button
                onClick={() => setPreviewResource(null)}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 rounded-xl text-xs font-bold text-white shadow-md cursor-pointer transition-colors"
              >
                确认并关闭
              </button>
            </div>
          </motion.div>
        </div>
      )}

    </div>
  );
}
