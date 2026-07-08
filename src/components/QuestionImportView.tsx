import React, { useState, useRef } from 'react';
import { 
  FileUp, 
  Sparkles, 
  CheckCircle, 
  AlertCircle, 
  Trash2, 
  Edit3, 
  RefreshCw, 
  HelpCircle,
  Cpu,
  BookmarkCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ImportedQuestion } from '../types';

interface QuestionImportViewProps {
  onImportSuccess: (questions: ImportedQuestion[]) => void;
}

export const QuestionImportView: React.FC<QuestionImportViewProps> = ({ onImportSuccess }) => {
  const [dragActive, setDragActive] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [fileContent, setFileContent] = useState('');
  const [fileName, setFileName] = useState('');
  
  // Parsed questions preview list
  const [parsedQuestions, setParsedQuestions] = useState<ImportedQuestion[]>([]);
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Drag handers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const onButtonClick = () => {
    fileInputRef.current?.click();
  };

  // Read and Parse File using Gemini
  const handleFile = (file: File) => {
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = async (e) => {
      const text = e.target?.result as string;
      setFileContent(text);
      await parseFileContent(file.name, text);
    };
    reader.readAsText(file);
  };

  const parseFileContent = async (name: string, content: string) => {
    setIsParsing(true);
    try {
      const response = await fetch('/api/gemini/parse-file', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileName: name, textContent: content })
      });

      if (!response.ok) {
        throw new Error('API server failed');
      }

      const data = await response.json();
      setParsedQuestions(data.questions || []);
      setIsParsing(false);

    } catch (err) {
      console.error(err);
      setIsParsing(false);
      alert('AI 解析题库文件失败，请确保格式正确');
    }
  };

  // Modify question details in grid
  const handleFieldChange = (id: string, field: keyof ImportedQuestion, value: any) => {
    setParsedQuestions(prev => prev.map(q => {
      if (q.id === id) {
        return { ...q, [field]: value };
      }
      return q;
    }));
  };

  const handleDelete = (id: string) => {
    setParsedQuestions(prev => prev.filter(q => q.id !== id));
  };

  // Save parsed questions to central state
  const handleSaveToBank = () => {
    if (parsedQuestions.length === 0) return;
    onImportSuccess(parsedQuestions);
    setParsedQuestions([]);
    setFileName('');
    setFileContent('');
    alert(`成功导入 ${parsedQuestions.length} 道高品质计算机科学题目！`);
  };

  return (
    <div className="space-y-8 p-1">
      
      {/* Instructions header card */}
      <div className="bg-gradient-to-r from-blue-900/20 via-slate-900 to-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-white flex items-center space-x-1.5">
            <Sparkles size={16} className="text-blue-400" />
            <span>AI 零格式题库识别与解析导入</span>
          </h4>
          <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
            支持拖拽或选择随意的 Markdown 课本、Word 试题草稿或 TXT 文本，AI 智能体将深度研判并结构化拆分出 核心考点、题目主干、选项、标准答案、难度水位 及 逐行代码级剖析。
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Drag & Drop Zone (5 Columns) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between min-h-[400px]">
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-5">上传源文件或课件试题草案</h4>
            
            <div 
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center transition-all min-h-[220px] cursor-pointer ${
                dragActive 
                  ? 'border-blue-500 bg-blue-600/5' 
                  : 'border-slate-800 bg-slate-950/20 hover:border-slate-700/80 hover:bg-slate-950/40'
              }`}
              onClick={onButtonClick}
            >
              <input 
                ref={fileInputRef}
                type="file" 
                onChange={handleFileChange}
                accept=".txt,.md,.json"
                className="hidden" 
              />
              
              <div className="p-4 bg-blue-500/10 rounded-full border border-blue-500/20 text-blue-400 mb-4">
                <FileUp size={28} className={dragActive ? 'animate-bounce' : ''} />
              </div>

              <div className="space-y-1.5 max-w-xs">
                <p className="text-xs font-bold text-white">拖拽文件至此，或点击本地选择</p>
                <p className="text-[10px] text-slate-500">支持 .md, .txt, .json 等纯文本源文件</p>
              </div>
            </div>

            {/* Current Loaded File indicators */}
            {fileName && (
              <div className="bg-slate-950/50 border border-slate-800 rounded-xl p-3.5 flex items-center justify-between mt-4">
                <div className="min-w-0">
                  <p className="text-xs font-bold text-white truncate">{fileName}</p>
                  <span className="text-[9px] text-slate-500 font-mono mt-0.5 block">字符大小：{fileContent.length} bytes</span>
                </div>
                {isParsing ? (
                  <span className="text-[10px] text-blue-400 font-mono flex items-center shrink-0">
                    <RefreshCw size={10} className="animate-spin mr-1" />
                    AI 正在识别...
                  </span>
                ) : (
                  <span className="text-[10px] text-emerald-400 font-mono flex items-center shrink-0">
                    <CheckCircle size={10} className="mr-1" />
                    识别成功
                  </span>
                )}
              </div>
            )}
          </div>

          <div className="bg-slate-950/30 border border-slate-800 p-4 rounded-xl mt-6">
            <span className="text-[11px] font-bold text-slate-400 flex items-center space-x-1.5 font-sans mb-1.5">
              <HelpCircle size={12} className="text-blue-400" />
              <span>快速测试？黏贴此示范：</span>
            </span>
            <pre className="text-[10px] text-slate-500 font-mono leading-relaxed bg-slate-950 p-2 rounded border border-slate-800/60 overflow-x-auto max-h-32 select-text">
              {`【Python基础题】
在 Python 里，nums = [10, 20, 30]
请问 nums[-1] 输出什么？
A. 10
B. 20
C. 30
D. IndexError
答案：C
解析：-1 索引指向列表倒数第一个元素 30。`}
            </pre>
          </div>
        </div>

        {/* Right Parsed Questions Preview & Edit table (7 Columns) */}
        <div className="lg:col-span-7 flex flex-col min-h-[400px]">
          {isParsing ? (
            /* Smooth skeleton loader while parsing */
            <div className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl p-8 flex flex-col justify-center items-center text-center space-y-5">
              <div className="relative p-6 bg-blue-500/10 rounded-full border border-blue-500/20">
                <RefreshCw size={36} className="animate-spin text-blue-400" />
                <Cpu size={18} className="absolute top-2 right-2 text-indigo-400" />
              </div>
              <div className="space-y-1">
                <h4 className="text-base font-bold text-white">正在执行 AI 文档多维拆解...</h4>
                <p className="text-xs text-slate-400">
                  文本正在推送至 Gemini 3.5 Flash 解析器，并按照结构化 Schema 验证生成题目模型。
                </p>
              </div>
            </div>
          ) : parsedQuestions.length > 0 ? (
            /* Parsed results lists */
            <div className="flex-1 flex flex-col space-y-6">
              
              {/* Header count & action */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-300">
                  AI 共拆分识别出 <span className="text-blue-400 font-bold">{parsedQuestions.length}</span> 道题，可进行修正：
                </span>
                <button
                  onClick={handleSaveToBank}
                  className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4.5 py-2 rounded-xl flex items-center space-x-1 shadow-md cursor-pointer"
                >
                  <BookmarkCheck size={14} />
                  <span>确认导入并存档至中央题库</span>
                </button>
              </div>

              {/* Editable Question lists cards */}
              <div className="flex-1 space-y-4 max-h-[500px] overflow-y-auto pr-1">
                {parsedQuestions.map((q) => {
                  const isEditing = editingQuestionId === q.id;
                  
                  return (
                    <div 
                      key={q.id}
                      className="bg-slate-900 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-5 space-y-4 transition-colors relative"
                    >
                      {/* Delete absolute button */}
                      <button
                        onClick={() => handleDelete(q.id)}
                        className="absolute top-4 right-4 p-1.5 hover:bg-slate-950 text-slate-500 hover:text-rose-400 border border-slate-800 hover:border-rose-500/20 rounded-lg transition-colors cursor-pointer"
                        title="删除该题"
                      >
                        <Trash2 size={13} />
                      </button>

                      {/* Topic & difficulty row */}
                      <div className="flex items-center space-x-3">
                        <span className="text-[10px] font-mono font-bold bg-blue-500/10 border border-blue-500/20 px-2.5 py-0.5 rounded text-blue-400">
                          {q.topic}
                        </span>
                        <span className={`text-[9px] uppercase tracking-wider font-mono font-bold px-1.5 py-0.2 rounded border ${
                          q.difficulty === 'easy' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
                          q.difficulty === 'medium' ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' :
                          'bg-rose-500/10 border-rose-500/20 text-rose-400'
                        }`}>
                          {q.difficulty}
                        </span>
                      </div>

                      {/* Question Content */}
                      <div className="space-y-2">
                        {isEditing ? (
                          <textarea
                            value={q.question}
                            onChange={(e) => handleFieldChange(q.id, 'question', e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none"
                            rows={3}
                          />
                        ) : (
                          <p className="text-xs text-slate-200 font-semibold select-text leading-relaxed whitespace-pre-wrap">{q.question}</p>
                        )}
                      </div>

                      {/* Options listing if multiple/single choice */}
                      {q.options && q.options.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pb-2.5">
                          {q.options.map((opt, oIdx) => (
                            <div key={oIdx} className="text-[11px] bg-slate-950/40 border border-slate-800/80 p-2.5 rounded-xl text-slate-400 font-mono">
                              {opt}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Answer and Analysis section */}
                      <div className="bg-slate-950/40 border border-slate-800/80 p-3.5 rounded-xl space-y-2 text-xs">
                        <div className="flex items-center space-x-2">
                          <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.2 border border-emerald-500/20 rounded font-mono">标准答案</span>
                          {isEditing ? (
                            <input
                              type="text"
                              value={q.answer}
                              onChange={(e) => handleFieldChange(q.id, 'answer', e.target.value)}
                              className="bg-slate-900 border border-slate-800 rounded px-2 py-0.5 text-xs text-white focus:outline-none"
                            />
                          ) : (
                            <span className="text-white font-bold font-mono">{q.answer}</span>
                          )}
                        </div>

                        <div className="border-t border-slate-800/50 pt-2 space-y-1">
                          <span className="text-[10px] text-slate-500 block font-mono">解析深度：</span>
                          {isEditing ? (
                            <textarea
                              value={q.analysis}
                              onChange={(e) => handleFieldChange(q.id, 'analysis', e.target.value)}
                              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none"
                              rows={2}
                            />
                          ) : (
                            <p className="text-[11px] text-slate-400 leading-relaxed font-sans select-text">{q.analysis}</p>
                          )}
                        </div>
                      </div>

                      {/* Edit toggle */}
                      <div className="flex justify-end pt-1">
                        <button
                          onClick={() => setEditingQuestionId(isEditing ? null : q.id)}
                          className="text-[10px] font-semibold text-blue-400 hover:text-blue-300 flex items-center space-x-1 cursor-pointer"
                        >
                          <Edit3 size={11} />
                          <span>{isEditing ? '保存修改' : '手动修正题干/解析'}</span>
                        </button>
                      </div>

                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl p-8 flex flex-col justify-center items-center text-center text-slate-500">
              <FileUp size={48} className="text-slate-700 mb-3" />
              <p className="text-sm">尚未导入任何题库资料</p>
              <p className="text-xs text-slate-600 mt-1">请在左侧拖入文本或选择测试用例，AI 智能体将瞬间解析并在右侧呈现结构化细节。</p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
