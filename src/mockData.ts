import { Resource, ActiveQuiz, KnowledgeWeakness, AgentLog, ImportedQuestion } from './types';

export const initialResources: Resource[] = [
  {
    id: 'res-001',
    title: 'Python 递归函数基础教学设计',
    type: 'curriculum',
    topic: '递归算法',
    difficulty: 'medium',
    grade: '高一',
    createdAt: '2026-07-06 14:20',
    status: 'published',
    content: `# 教学设计：Python 递归函数基础

## 1. 教学目标
* 理解递归的本质：函数调用自身
* 掌握递归的两大要素：基准情形 (Base Case) 和 递归步骤 (Recursive Step)
* 能够用 Python 实现经典的斐波那契数列与阶乘函数
* 理解递归栈的概念，防范无限递归 (Stack Overflow)

## 2. 教学重点与难点
* **重点**：基准条件的设计，防止死循环。
* **难点**：递归调用的执行流程及内存栈的变化。

## 3. 教学步骤
### 导入 (10分钟)
从“从前有座山，山里有座庙”的故事，引出计算机中“自相似”的定义。

### 核心概念讲解 (20分钟)
阶乘的数学定义：
$n! = n \times (n-1)!$
基准：$0! = 1$

### 编程实践 (20分钟)
\`\`\`python
def factorial(n):
    # 1. 基准情形
    if n == 0 or n == 1:
        return 1
    # 2. 递归步骤
    return n * factorial(n - 1)
\`\`\`

## 4. 课后练习
1. 写一个递归函数计算斐波那契数列第 n 项。
2. 尝试将递归函数改写为循环结构，对比两者的性能差异。`,
    fineTuneCount: 1,
    logsId: 'log-session-001'
  },
  {
    id: 'res-002',
    title: '二分查找 (Binary Search) 核心算法测验卷',
    type: 'quiz',
    topic: '二分查找',
    difficulty: 'hard',
    grade: '高二',
    createdAt: '2026-07-07 09:30',
    status: 'draft',
    content: `# 二分查找 (Binary Search) 核心算法测验卷

本测验旨在考察学生对折半查找算法的边界条件处理、时间复杂度估算及代码调试能力。

## 单选题
**1. 在一个长度为 $n$ 的有序数组中进行二分查找，最坏情况下的时间复杂度是：**
A. $O(1)$
B. $O(n)$
C. $O(\log n)$
D. $O(n \log n)$
*答案：C*
*解析：每次查找均将搜索范围减半，因此最坏情况下需要查找 $\log_2 n$ 次。*

## 填空题
**2. 在二分查找 Python 实现中，计算中间位置 \`mid\` 时，为防止整数溢出，通常使用以下写法：\`mid = low + ____________________\`。**
*答案：(high - low) // 2*

## 编程题
**3. 请用 Python 实现一个标准的二分查找。如果找到目标值，返回其索引；若未找到，返回 -1。**
\`\`\`python
def binary_search(arr, target):
    low = 0
    high = len(arr) - 1
    while low <= high:
        mid = (low + high) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            low = mid + 1
        else:
            high = mid - 1
    return -1
\`\`\`
`,
    fineTuneCount: 0,
    logsId: 'log-session-002'
  },
  {
    id: 'res-003',
    title: '计算机网络: HTTP 与 TCP 三次握手互动课件',
    type: 'slides',
    topic: '计算机网络',
    difficulty: 'medium',
    grade: '高三',
    createdAt: '2026-07-05 11:05',
    status: 'published',
    content: `# 课件大纲：TCP 三次握手与 HTTP 请求

## Slide 1: 欢迎
* 课程名称：计算机网络入门
* 核心主题：数据如何在网络中建立可靠连接
* 讲师：计智教师助手

## Slide 2: 什么是 TCP？
* 传输控制协议 (Transmission Control Protocol)
* 特点：面向连接、可靠、基于字节流
* 现实比喻：打电话前的“喂，听得到吗？”

## Slide 3: 三次握手 (Three-Way Handshake) 详解
1. **第一次握手 (SYN)**: 客户端发送连接请求包。
   * 客户端状态：SYN-SENT
   * 信号：“我想和你建立连接。”
2. **第二次握手 (SYN-ACK)**: 服务端确认并同意。
   * 服务端状态：SYN-RCVD
   * 信号：“我收到你的请求了，我准备好了，你呢？”
3. **第三次握手 (ACK)**: 客户端再次确认。
   * 客户端状态：ESTABLISHED
   * 服务端状态：ESTABLISHED
   * 信号：“我也准备好了，现在开始传输数据！”

## Slide 4: 为什么不能是“两次握手”？
* 防止已失效的连接请求报文段突然又传送到了服务端，产生脏连接。
* 确保双方都具有发送和接收数据的能力。`,
    fineTuneCount: 2,
    logsId: 'log-session-003'
  }
];

export const initialActiveQuizzes: ActiveQuiz[] = [
  {
    id: 'quiz-101',
    title: '数据结构与基本排序算法随堂测验',
    className: '高一（3）班',
    studentCount: 5,
    completedCount: 3,
    avgScore: 84.5,
    status: 'active',
    releasedAt: '2026-07-07 15:45',
    students: [
      {
        id: 'std-001',
        studentName: '张伟',
        studentId: 'S202601',
        progress: 100,
        score: 95,
        status: 'online',
        completedAt: '15:58',
        submissions: [
          { problemId: 'p1', code: 'def bubble_sort(arr):\n    n = len(arr)\n    for i in range(n):\n        for j in range(0, n-i-1):\n            if arr[j] > arr[j+1]:\n                arr[j], arr[j+1] = arr[j+1], arr[j]\n    return arr', language: 'python', status: 'pass', timestamp: '15:52' }
        ]
      },
      {
        id: 'std-002',
        studentName: '李娜',
        studentId: 'S202602',
        progress: 100,
        score: 85,
        status: 'online',
        completedAt: '16:01',
        submissions: [
          { problemId: 'p1', code: 'def bubble_sort(arr):\n    for i in range(len(arr)):\n        for j in range(len(arr)-1):\n            if arr[j] > arr[j+1]:\n                arr[j], arr[j+1] = arr[j+1], arr[j]\n    return arr', language: 'python', status: 'pass', timestamp: '15:59' }
        ]
      },
      {
        id: 'std-003',
        studentName: '王强',
        studentId: 'S202603',
        progress: 70,
        score: 60,
        status: 'online',
        submissions: [
          { problemId: 'p1', code: 'def bubble_sort(arr):\n    for i in arr:\n        if arr[i] > arr[i+1]: # IndexError\n            pass', language: 'python', status: 'fail', error: 'IndexError: list index out of range', timestamp: '15:55' }
        ]
      },
      {
        id: 'std-004',
        studentName: '刘洋',
        studentId: 'S202604',
        progress: 100,
        score: 73,
        status: 'idle',
        completedAt: '16:05',
        submissions: [
          { problemId: 'p1', code: 'def bubble_sort(arr):\n    # 简易实现\n    arr.sort()\n    return arr', language: 'python', status: 'pass', timestamp: '16:03' }
        ]
      },
      {
        id: 'std-005',
        studentName: '赵敏',
        studentId: 'S202605',
        progress: 20,
        score: 0,
        status: 'offline',
        submissions: []
      }
    ]
  },
  {
    id: 'quiz-102',
    title: 'Python 条件与循环控制测试',
    className: '高一（1）班',
    studentCount: 4,
    completedCount: 4,
    avgScore: 89.0,
    status: 'ended',
    releasedAt: '2026-07-06 10:00',
    students: [
      {
        id: 'std-101',
        studentName: '陈林',
        studentId: 'S202611',
        progress: 100,
        score: 100,
        status: 'offline',
        completedAt: '10:22',
        submissions: []
      },
      {
        id: 'std-102',
        studentName: '周涛',
        studentId: 'S202612',
        progress: 100,
        score: 92,
        status: 'offline',
        completedAt: '10:28',
        submissions: []
      },
      {
        id: 'std-103',
        studentName: '郭芳',
        studentId: 'S202613',
        progress: 100,
        score: 88,
        status: 'offline',
        completedAt: '10:31',
        submissions: []
      },
      {
        id: 'std-104',
        studentName: '孙超',
        studentId: 'S202614',
        progress: 100,
        score: 76,
        status: 'offline',
        completedAt: '10:35',
        submissions: []
      }
    ]
  }
];

export const initialWeaknesses: KnowledgeWeakness[] = [
  {
    topic: '递归函数边界判定 (Base Case)',
    mastery: 45,
    studentCount: 14,
    recommendation: '该核心薄弱点源于学生在推导状态转移时，容易忽略首项特殊情况，建议通过“可视化调用树 (Call Tree)”辅导，并针对性下发《递归基础突破训练案》。'
  },
  {
    topic: '二分查找死循环规避 (指针更新)',
    mastery: 58,
    studentCount: 9,
    recommendation: '约 30% 学生在处理 low <= high 的等于号与 low = mid + 1 的偏移量上产生逻辑混乱。建议补充“双指针动态区间演示”，加强边界闭区间的逻辑训练。'
  },
  {
    topic: '列表切片与内存拷贝机制',
    mastery: 65,
    studentCount: 6,
    recommendation: '学生在对 shallow copy 与 deep copy 的区分上表现模糊，常因 arr[:] 的浅拷贝修改了多维列表内层元素。建议安排一节“Python 内存模型与堆栈图解课”。'
  },
  {
    topic: '复杂度分析与大O表示法',
    mastery: 72,
    studentCount: 4,
    recommendation: '主要是对非线性循环（如逐步减半、倍增）的时间复杂度计算模糊。可通过数轴折半的比例模型帮助建立直观认知。'
  }
];

export const initialAgentLogs: AgentLog[] = [
  {
    id: 'log-001',
    resourceId: 'res-002',
    timestamp: '15:45:01',
    agentName: 'Curriculum Planning Agent (课程规划专家)',
    agentRole: 'planner',
    type: 'info',
    message: '接到教学任务：“高二计算机科学 - 二分查找核心算法测验”。开始分析教学大纲与考纲重点。',
    details: `### 课程规划专家分析详情
* **主题**：二分查找 (Binary Search) 
* **学段**：高中二年级（计算机科学选择性必修）
* **考点对齐**：
  1. 检索效率对比（顺序查找 $O(n)$ 对比折半查找 $O(\log n)$）
  2. 边界条件计算（\`low <= high\` 判定、\`mid\` 防止溢出设计）
  3. 无法查找到目标值时的跳出机制与返回值
* **多智能体分工**：
  - \`Curriculum Planner\`: 制定题目大纲、题型配比（1单选，1填空，1编程）
  - \`Sandbox Executor\`: 模拟学生写出带有常见错误的 Python 样例，并在沙箱中编译验证
  - \`Quiz Verifier\`: 审查测试题目正确性，并撰写标准答案解析
  - \`Pedagogy Coach\`: 补充教学引导词与课后拓展微课方案`,
    durationMs: 450
  },
  {
    id: 'log-002',
    resourceId: 'res-002',
    timestamp: '15:45:02',
    agentName: 'Curriculum Planning Agent (课程规划专家)',
    agentRole: 'planner',
    type: 'success',
    message: '测验蓝图规划完毕，已确定包含：单选题 (时间复杂度考查)、填空题 (防止溢出写法) 与 编程题 (查找返回索引)。推送至代码沙箱。',
    durationMs: 380
  },
  {
    id: 'log-003',
    resourceId: 'res-002',
    timestamp: '15:45:03',
    agentName: 'Code Execution Sandbox Agent (代码架构专家)',
    agentRole: 'executor',
    type: 'info',
    message: '接收测验大纲。正在建立 Python 虚拟运行沙箱，测试二分查找的代码健壮性。',
    details: `### 沙箱测试套件启动
\`\`\`bash
$ python -m venv test_env
$ source test_env/bin/activate
$ pytest --version
pytest 8.1.1
\`\`\`
正在运行测试用例，验证以下极端输入下的二分查找正确性：
- 目标值在数组首位
- 目标值在数组末位
- 目标值不存在
- 数组为空
- 数组存在重复元素`,
    durationMs: 650
  },
  {
    id: 'log-004',
    resourceId: 'res-002',
    timestamp: '15:45:05',
    agentName: 'Code Execution Sandbox Agent (代码架构专家)',
    agentRole: 'executor',
    type: 'success',
    message: '代码验证成功。生成标准实现，并捕捉常见错误模型（如死循环：忽略 \`+1\`/\`-1\` 偏移量）用于题目错误选项。',
    details: `### 发现的错误模型
教师常需用来考查学生：
\`\`\`python
# 易错点1: 导致死循环
low = mid
# 易错点2: 导致死循环
while low < high: # 当数组只有2个元素且无法命中时可能卡死
\`\`\`
已将这些易错项整理并同步发送给【测验校验专家】。`,
    durationMs: 720
  },
  {
    id: 'log-005',
    resourceId: 'res-002',
    timestamp: '15:45:06',
    agentName: 'Exercise Verifier Agent (教学评估专家)',
    agentRole: 'verifier',
    type: 'info',
    message: '开始校对题目。验证单选题 A/B/C/D 描述精准度，核对数学公式与 Markdown 排版规范。',
    durationMs: 510
  },
  {
    id: 'log-006',
    resourceId: 'res-002',
    timestamp: '15:45:07',
    agentName: 'Exercise Verifier Agent (教学评估专家)',
    agentRole: 'verifier',
    type: 'success',
    message: '校对通过。填空题标准答案已做模糊匹配规则过滤，编程题配备 5 组黑盒测试数据（样例输入与预期输出）。',
    details: `### 测评测试数据 (Test Cases)
- **Case 1**: arr=[1, 3, 5, 7, 9], target=3 => 期望输出: 1
- **Case 2**: arr=[1, 3, 5, 7, 9], target=1 => 期望输出: 0
- **Case 3**: arr=[1, 3, 5, 7, 9], target=10 => 期望输出: -1
- **Case 4**: arr=[5], target=5 => 期望输出: 0
- **Case 5**: arr=[], target=3 => 期望输出: -1`,
    durationMs: 410
  },
  {
    id: 'log-007',
    resourceId: 'res-002',
    timestamp: '15:45:08',
    agentName: 'Pedagogical Coach Agent (金牌助教专家)',
    agentRole: 'coach',
    type: 'success',
    message: '教学建议装配完成。生成“二分查找速记顺口溜”与“极速纠错技巧”，帮助教师在讲评时增强课堂互动。',
    details: `### 教学微课设计建议
* **顺口溜**：
  > 查找折半真好用，前提数组有顺序；
  > 两个指针往中靠，边界偏移莫丢弃；
  > \`low\` 找 \`mid\` 加一个，\`high\` 找 \`mid\` 减一去；
  > 循环条件带等号，找不到时回负一。
* **随堂提问设计**：
  - 问：“如果我们的输入数组不是有序的，二分查找会怎样？”
  - 答：二分查找会失效。必须先排序，但排序的时间复杂度通常是 $O(n \log n)$，因此如果只查找一次，直接遍历 $O(n)$ 更划算。`,
    durationMs: 350
  }
];

export const initialImportedQuestions: ImportedQuestion[] = [
  {
    id: 'q-001',
    topic: 'Python 列表操作',
    question: '在 Python 中，给定列表 `nums = [1, 2, 3]`，执行 `nums.append([4, 5])` 后，`len(nums)` 的结果是多少？',
    type: 'single',
    options: [
      'A. 5',
      'B. 4',
      'C. 3',
      'D. 会报错'
    ],
    answer: 'B',
    analysis: '`append()` 方法将传入的参数作为一个整体元素追加到列表末尾。因此，子列表 `[4, 5]` 变成 `nums` 里的第四个元素，新列表为 `[1, 2, 3, [4, 5]]`，长度为 4。若想拆开添加应使用 `extend()`。',
    difficulty: 'easy'
  },
  {
    id: 'q-002',
    topic: '算法复杂度',
    question: '分析以下 Python 代码的时间复杂度是多少：\n```python\ni = 1\nwhile i < n:\n    i = i * 2\n```',
    type: 'single',
    options: [
      'A. O(1)',
      'B. O(n)',
      'C. O(log n)',
      'D. O(n log n)'
    ],
    answer: 'C',
    analysis: '在每次循环中，变量 `i` 的值都会乘以 2。假设循环执行了 $k$ 次，则有 $2^k \\ge n$。解得 $k \\approx \\log_2 n$。因此时间复杂度为 $O(\\log n)$。',
    difficulty: 'medium'
  }
];
