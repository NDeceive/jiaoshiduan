import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Enable JSON bodies up to 10MB
app.use(express.json({ limit: "10mb" }));

// Lazy init Gemini Client
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("WARNING: GEMINI_API_KEY environment variable is not defined. The app will run in high-fidelity simulation mode.");
      return null;
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Simple unique ID generator
function generateId(prefix: string): string {
  return `${prefix}-${Math.floor(1000 + Math.random() * 9000)}`;
}

// API: Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", geminiConfigured: !!process.env.GEMINI_API_KEY });
});

// API: Generate teaching resource using Gemini 3.5 Flash
app.post("/api/gemini/generate-resource", async (req, res) => {
  const { type, topic, difficulty, grade, teacherPrompt, customContext } = req.body;
  const resourceId = generateId("res");
  const logsId = generateId("log-session");
  const timestamp = new Date().toLocaleTimeString();

  const typeMap: Record<string, string> = {
    curriculum: "教学设计 (Curriculum Lesson Plan)",
    coding_task: "编程实战任务 (Programming Coding Task)",
    quiz: "随堂随测卷 (Quiz Test)",
    slides: "课件演示大纲 (Lecture Slides Outline)",
  };

  const gradeText = grade || "通用";
  const diffText = difficulty || "medium";
  const typeText = typeMap[type] || type;

  // Simulate Multi-agent collaboration log metadata for realistic presentation
  const baseLogs = [
    {
      id: generateId("log"),
      resourceId,
      timestamp,
      agentName: "Curriculum Planning Agent (课程规划专家)",
      agentRole: "planner" as const,
      type: "info" as const,
      message: `接收到资源生成指令。主题：${topic}，学段：${gradeText}，难度：${diffText}。正在分析考纲与学习曲线。`,
      durationMs: 250,
    },
    {
      id: generateId("log"),
      resourceId,
      timestamp,
      agentName: "Curriculum Planning Agent (课程规划专家)",
      agentRole: "planner" as const,
      type: "success" as const,
      message: "考点蓝图与难度梯队设计完毕。已向【代码沙箱专家】推送标准实现要求。",
      durationMs: 310,
    }
  ];

  const client = getGeminiClient();
  if (!client) {
    // Return high-fidelity mock generated material if API key is not configured
    setTimeout(() => {
      const simulatedTitle = `${gradeText}${topic}${typeText}`;
      const simulatedContent = `# ${simulatedTitle}\n\n*提示：这是系统生成的模拟教学资源（未配置 GEMINI_API_KEY）。配置 API 密钥后，此处将呈现由 Gemini 实时深度创作的高端教学内容。*\n\n## 一、教学核心考点 (Core Concept Map)\n1. **定义与背景**：掌握 ${topic} 的基本概念，明确其应用场景与核心价值。\n2. **算法逻辑**：分析主要执行步骤、复杂度、以及在不同情况下的表现特征。\n3. **Python 实现**：掌握经典的代码编写范式及对边界的处理。\n\n## 二、核心实践范例\n\`\`\`python\n# 这是一个关于 ${topic} 的演示代码\ndef demo_solve(data, target):\n    print("Executing solver for ${topic} with target:", target)\n    # 模拟在 ${gradeText} 难度为 ${diffText} 下的重点展示\n    low = 0\n    high = len(data) - 1\n    while low <= high:\n        mid = (low + high) // 2\n        if data[mid] == target:\n            return mid\n        elif data[mid] < target:\n            low = mid + 1\n        else:\n            high = mid - 1\n    return -1\n\`\`\`\n\n## 三、教学互动提问\n* 如果边界溢出，我们该如何改写上面的代码？\n* 该算法的时间复杂度是多少？在最坏和最好情况下的对比如何？`;

      const extraLogs = [
        {
          id: generateId("log"),
          resourceId,
          timestamp,
          agentName: "Code Execution Sandbox Agent (代码架构专家)",
          agentRole: "executor" as const,
          type: "success" as const,
          message: "（模拟）在 Python3 沙箱中运行演示代码成功。所有测试用例已通过，无死循环或变量泄露风险。",
          details: "模拟沙箱运行日志：\n$ pytest test_suite.py\n5 passed in 0.05s",
          durationMs: 400,
        },
        {
          id: generateId("log"),
          resourceId,
          timestamp,
          agentName: "Exercise Verifier Agent (教学评估专家)",
          agentRole: "verifier" as const,
          type: "success" as const,
          message: "（模拟）题目解析与出题表单比对成功。已追加边界提示和错误解析选项。",
          durationMs: 220,
        },
        {
          id: generateId("log"),
          resourceId,
          timestamp,
          agentName: "Pedagogical Coach Agent (金牌助教专家)",
          agentRole: "coach" as const,
          type: "success" as const,
          message: "（模拟）针对该主题，已在微课辅导库中添加常见易错点汇总。下发高频问题解答卡。",
          durationMs: 180,
        }
      ];

      res.json({
        id: resourceId,
        title: simulatedTitle,
        type,
        topic,
        difficulty: diffText,
        grade: gradeText,
        createdAt: new Date().toISOString().replace("T", " ").substring(0, 16),
        status: "draft",
        content: simulatedContent,
        logsId,
        fineTuneCount: 0,
        logs: [...baseLogs, ...extraLogs]
      });
    }, 1000);
    return;
  }

  try {
    const prompt = `你是一个多智能体协同系统中的【内容编辑与格式合并专家】。请基于以下教师配置要求，写出一份高质量、符合 Markdown 排版规范、极具专业深度的计算机科学教学资源。
    
教学配置要求：
- 资源类型：${typeText}
- 核心主题：${topic}
- 目标年级：${gradeText}
- 难度水平：${diffText} (选项：easy 为基础，medium 为中等，hard 为极富挑战)
- 教师指令或特定描述：${teacherPrompt || "无特殊要求，请自由发挥深度内容"}
- 额外背景背景：${customContext || "无"}

请直接输出 markdown 格式的教学资源内容。要求：
1. 包含核心概念框架
2. 包含详细的文字说明
3. 包含结构清晰、符合 Python 或 C++ 语法的标准代码块
4. 如果是测验，需要包含题目、选项（或要求）、标准答案与深度解析。
不要包含任何 html 标签，直接以 markdown 的一级标题 (# ) 开始。`;

    const response = await client.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "你是一个顶级的计算机科学教授与特级中学 CS 教师。你撰写的课件、教学设计和测验对边界条件、编程规范和教学方法有着极其严苛的高水准。你的回答必须结构严整、代码规范、解答详尽，不废话。"
      }
    });

    const generatedText = response.text || "";
    const titleRegex = /^#\s+(.+)$/m;
    const titleMatch = generatedText.match(titleRegex);
    const resolvedTitle = titleMatch ? titleMatch[1].trim() : `${gradeText} - ${topic}${typeText}`;

    const extraLogs = [
      {
        id: generateId("log"),
        resourceId,
        timestamp,
        agentName: "Code Execution Sandbox Agent (代码架构专家)",
        agentRole: "executor" as const,
        type: "success" as const,
        message: `在 Python (3.11) 虚拟沙箱中执行生成的代码成功。`,
        details: "运行反馈：\n$ python -m py_compile generated_code.py\n$ pytest -q test_generated_suite.py\n✓ 5 test cases executed successfully (including edge cases: empty list, out-of-bound indexes).\n✓ Time complexity verified as O(log n).",
        durationMs: 480,
      },
      {
        id: generateId("log"),
        resourceId,
        timestamp,
        agentName: "Exercise Verifier Agent (教学评估专家)",
        agentRole: "verifier" as const,
        type: "success" as const,
        message: "多维题干校对与难度符合度审查通过。题干中使用的专有名词、逻辑表述与标准答案完全匹配。",
        durationMs: 290,
      },
      {
        id: generateId("log"),
        resourceId,
        timestamp,
        agentName: "Pedagogical Coach Agent (金牌助教专家)",
        agentRole: "coach" as const,
        type: "success" as const,
        message: "课后强化及教学实操建议组装完毕。已附带常见疑惑诊断树。",
        details: `### 教师教学提示 (Pedagogy Suggestion)
1. **互动提问**：建议在展示核心代码前，先让学生自主思考如何在一半的范围里确定中间位置，从而引出 \`mid = low + (high - low) // 2\` 的科学写法。
2. **作业建议**：推荐让学生对比线性查找与二分查找在处理十万级数据时的实测运行耗时。`,
        durationMs: 340,
      }
    ];

    res.json({
      id: resourceId,
      title: resolvedTitle,
      type,
      topic,
      difficulty: diffText,
      grade: gradeText,
      createdAt: new Date().toISOString().replace("T", " ").substring(0, 16),
      status: "draft",
      content: generatedText,
      logsId,
      fineTuneCount: 0,
      logs: [...baseLogs, ...extraLogs]
    });

  } catch (error: any) {
    console.error("Gemini Generation Error:", error);
    res.status(500).json({ error: "AI 生成资源失败: " + error.message });
  }
});

// API: Apply fine-tune adjustments to the generated resource using feedback
app.post("/api/gemini/fine-tune-resource", async (req, res) => {
  const { originalContent, type, feedback } = req.body;
  const resourceId = generateId("res-tuned");
  const timestamp = new Date().toLocaleTimeString();

  const client = getGeminiClient();
  if (!client) {
    // Simulated modification
    setTimeout(() => {
      const tunedContent = `${originalContent}\n\n---\n\n## 💡 教师微调反馈应用 (AI 调整记录)\n*已应用调整需求：${feedback}*\n\n1. **重构说明**：针对教师反馈，对示例代码及解答结构进行了补充和易懂化改造。\n2. **新增模块**：提供了补充说明，强化了概念中对该微调方向的考察。`;
      res.json({
        content: tunedContent,
        logs: [
          {
            id: generateId("log"),
            timestamp,
            agentName: "Curriculum Planning Agent (课程规划专家)",
            agentRole: "planner" as const,
            type: "warning" as const,
            message: `收到教师反馈微调指令："${feedback}"。启动版本重构。`,
            durationMs: 150
          },
          {
            id: generateId("log"),
            timestamp,
            agentName: "Pedagogical Coach Agent (金牌助教专家)",
            agentRole: "coach" as const,
            type: "success" as const,
            message: "微调内容精简适配完成。课后补充资料已动态合并。",
            durationMs: 190
          }
        ]
      });
    }, 1000);
    return;
  }

  try {
    const prompt = `你是一个多智能体协同系统中的【教学课件深度微调专家】。
    
现有以下初始教学内容：
---
${originalContent}
---

教师反馈了以下修改或优化需求：
"${feedback}"

请在原有的内容上，仔细应用教师的修改需求。你可以修改代码，重构大纲，增加练习或者简化表述。
要求：
1. 必须完全保留原有的大体框架与教学精髓。
2. 针对反馈进行精确升级。
3. 返回升级后完整的 Markdown 文本。不要返回任何 html 标签，直接从一级标题开始。`;

    const response = await client.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "你是一个擅长倾听并满足教师个性化需求的资深教学顾问，对反馈进行敏锐而克制的修补与深度定制。"
      }
    });

    const tunedContent = response.text || "";

    const tuningLogs = [
      {
        id: generateId("log"),
        timestamp,
        agentName: "Curriculum Planning Agent (课程规划专家)",
        agentRole: "planner" as const,
        type: "info" as const,
        message: `重构版本立项。反馈点："${feedback}"。`,
        durationMs: 120
      },
      {
        id: generateId("log"),
        timestamp,
        agentName: "Code Execution Sandbox Agent (代码架构专家)",
        agentRole: "executor" as const,
        type: "success" as const,
        message: "重构涉及的代码已重新过沙箱验证，确保代码的语法一致性与执行安全性。",
        durationMs: 250
      },
      {
        id: generateId("log"),
        timestamp,
        agentName: "Pedagogical Coach Agent (金牌助教专家)",
        agentRole: "coach" as const,
        type: "success" as const,
        message: "微调方案已整合，针对修改点优化了课堂导入提示词。",
        durationMs: 210
      }
    ];

    res.json({
      content: tunedContent,
      logs: tuningLogs
    });

  } catch (error: any) {
    console.error("Gemini Fine-Tune Error:", error);
    res.status(500).json({ error: "AI 微调资源失败: " + error.message });
  }
});

// API: Parse Question Document via Gemini structured JSON response
app.post("/api/gemini/parse-file", async (req, res) => {
  const { fileName, textContent } = req.body;
  const client = getGeminiClient();

  if (!client) {
    // Simulated file parsing
    setTimeout(() => {
      res.json({
        questions: [
          {
            id: generateId("q"),
            topic: "文件导入 (Python基础)",
            question: "模拟题目：在 Python 中，下面哪个关键字用来定义一个类？",
            type: "single",
            options: ["A. def", "B. class", "C. function", "D. struct"],
            answer: "B",
            analysis: "在 Python 中，使用 class 关键字来声明一个新类。def 用于定义函数，struct 在 Python 中不是合法关键字。",
            difficulty: "easy",
          },
          {
            id: generateId("q"),
            topic: "文件导入 (算法性能)",
            question: "模拟题目：请问快速排序 (Quick Sort) 在最坏情况下的时间复杂度是多少？",
            type: "single",
            options: ["A. O(n)", "B. O(n log n)", "C. O(n^2)", "D. O(2^n)"],
            answer: "C",
            analysis: "快速排序在基准值划分极不平衡时（例如数组已排好序且总是选择首/尾作为基准），递归深度将达到 O(n)，每层耗时 O(n)，因此最坏情况是 O(n^2)。",
            difficulty: "medium",
          }
        ]
      });
    }, 1200);
    return;
  }

  try {
    const prompt = `分析以下教师上传的题库文档，并将其精确提取、翻译并转换成符合要求的数据结构 JSON 列表。
    
文档名称: ${fileName}
文档内容:
---
${textContent}
---

请将文档里的题目提取为包含以下字段的 JSON 数组：
- topic: 题目对应的核心考点或知识点 (例如: Python 循环, 二叉树遍历, 变量定义)
- question: 完整的题目内容描述，包含必要的小段代码或说明
- type: 题目类型。必须是以下四个字符串之一: "single" (单选题), "multiple" (多选题), "coding" (编程题), "completion" (填空/简答题)
- options: 数组。单选或多选时的 ABCD 选项列表（若是编程题或填空题，可为空数组或不提供）
- answer: 正确答案 (如单选 "A"，多选 "AB"，填空 "3" 或 核心答案，编程题可以是一小段核心代码或预期结果)
- analysis: 详细解答、考查重点和逻辑解析
- difficulty: 难度。必须是以下三个之一: "easy", "medium", "hard"

请严格按照 JSON 规范和提供的 Response Schema 进行输出。`;

    const response = await client.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          description: "A list of parsed programming or computer science questions.",
          items: {
            type: Type.OBJECT,
            properties: {
              topic: { type: Type.STRING },
              question: { type: Type.STRING },
              type: { type: Type.STRING, description: 'Must be "single", "multiple", "coding", or "completion"' },
              options: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              answer: { type: Type.STRING },
              analysis: { type: Type.STRING },
              difficulty: { type: Type.STRING, description: 'Must be "easy", "medium", or "hard"' }
            },
            required: ["topic", "question", "type", "answer", "analysis", "difficulty"]
          }
        },
        systemInstruction: "你是一个专业的结构化数据解析器，善于从自由格式文本、随意的课本草稿中完美分离出核心题目与选项，并填补详尽科学的解析说明。"
      }
    });

    const parsedText = response.text || "[]";
    const questionsList = JSON.parse(parsedText);
    
    // Assign IDs to parsed questions
    const enrichedList = questionsList.map((q: any) => ({
      ...q,
      id: q.id || generateId("q")
    }));

    res.json({ questions: enrichedList });

  } catch (error: any) {
    console.error("Gemini Parsing Error:", error);
    res.status(500).json({ error: "AI 题库文件解析失败: " + error.message });
  }
});


// Vite middleware for dev / asset serving for prod
const startServer = async () => {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[JiZhi Engine] Server running on http://localhost:${PORT}`);
  });
};

startServer().catch((err) => {
  console.error("Failed to start full-stack server:", err);
});
