const form = document.querySelector("#briefForm");
const output = document.querySelector("#promptOutput");
const moduleGrid = document.querySelector("#moduleGrid");
const modeSwitch = document.querySelector(".mode-switch");
const fillDemo = document.querySelector("#fillDemo");
const clearBrief = document.querySelector("#clearBrief");
const copyPrompt = document.querySelector("#copyPrompt");
const downloadPrompt = document.querySelector("#downloadPrompt");

let currentModule = "account";
let currentMode = "prompt";
const storageKey = "decorationAgentBrief";

const demo = {
  company: "安居美学装饰",
  city: "杭州",
  business: "整装、旧房改造、局部翻新、改善型住宅设计施工",
  customer: "新交房业主、二胎家庭、老房翻新业主、预算15-35万的改善型家庭",
  price: "15-35万为主，部分大宅50万以上",
  advantage: "自有施工团队，报价透明，设计师全程跟进，材料环保可溯源，水电隐蔽工程标准化验收，有本地小区案例库。",
  goal: "搭建本地装修账号，稳定获取业主线索；包装样板间征集活动；形成年度代运营服务方案，用于对外年框提案。"
};

const moduleNames = {
  account: "账号搭建",
  content: "内容选题",
  shooting: "拍摄脚本",
  seeding: "种草笔记",
  campaign: "活动策划",
  ads: "广告投放",
  live: "直播运营",
  proposal: "年框标书",
  private: "私域跟进",
  review: "数据复盘",
  competitor: "竞品分析",
  bid: "标书目录"
};

function getBrief() {
  const data = new FormData(form);
  const value = (key) => data.get(key)?.trim() || "待补充";

  return {
    company: value("company"),
    city: value("city"),
    business: value("business"),
    customer: value("customer"),
    price: value("price"),
    advantage: value("advantage"),
    goal: value("goal")
  };
}

function briefBlock(brief) {
  return `公司名称：${brief.company}
所在城市：${brief.city}
主营业务：${brief.business}
目标客户：${brief.customer}
客单价：${brief.price}
核心优势：${brief.advantage}
近期目标：${brief.goal}`;
}

const builders = {
  account(brief) {
    return `你是装修公司品牌增长顾问，请基于以下资料，为这家公司设计本地账号搭建方案。

【公司资料】
${briefBlock(brief)}

【请输出】
1. 账号定位：一句话定位、差异化标签、目标人群。
2. 账号矩阵：抖音、小红书、视频号、公众号分别怎么做。
3. 账号基础设置：账号名、头像方向、简介、置顶内容。
4. 人设设计：老板、设计师、工长、监理、业主案例分别如何出镜。
5. 首月启动计划：前30天发布节奏和每周主题。
6. 转化路径：评论区、私信、表单、社群、到店如何衔接。

要求：内容必须适合${brief.city}本地装修市场，避免空泛口号，给出可直接执行的账号方案。`;
  },

  content(brief) {
    return `你是装修公司内容运营总监，请为以下公司生成30天内容选题表。

【公司资料】
${briefBlock(brief)}

【请输出表格】
字段包括：日期、平台、选题标题、内容角度、适合出镜人、拍摄场景、转化钩子、备注。

【内容类型比例】
- 装修避坑：30%
- 工地过程：20%
- 案例种草：20%
- 设计师专业内容：15%
- 活动转化：15%

要求：标题要有本地业主会点开的感觉，适合短视频和小红书二次改写。`;
  },

  shooting(brief) {
    return `你是装修公司短视频导演，请为以下公司设计一套可拍摄脚本。

【公司资料】
${briefBlock(brief)}

【请输出】
1. 10条短视频脚本。
2. 每条包括：标题、开头3秒、镜头分解、口播稿、字幕重点、道具/场景、结尾引导。
3. 至少包含：工地巡检、设计师讲方案、业主采访、材料展示、报价避坑、装修前后对比。

要求：每条脚本控制在45-90秒内，适合一个拍摄日集中完成。`;
  },

  seeding(brief) {
    return `你是小红书装修种草运营，请为以下公司生成种草内容。

【公司资料】
${briefBlock(brief)}

【请输出】
1. 12篇小红书笔记标题。
2. 6篇完整笔记正文。
3. 每篇包含：封面文字、正文、图片建议、标签、评论区引导、私信引导。
4. 内容方向包括：装修避坑、预算清单、真实案例、旧房改造、环保材料、设计前后对比。

要求：语言真实，不要广告腔，像本地业主愿意收藏和私信咨询的内容。`;
  },

  campaign(brief) {
    return `你是装修公司活动策划负责人，请为以下公司设计一个可落地的获客活动。

【公司资料】
${briefBlock(brief)}

【请输出】
1. 活动主题和核心卖点。
2. 目标客户和适用楼盘/小区。
3. 活动机制：报名、福利、名额、到店、成交政策。
4. 线上传播：短视频、小红书、朋友圈、社群话术。
5. 线下承接：门店布置、设计师接待、量房安排。
6. 7天预热排期、3天爆发排期、7天追单排期。
7. 风险控制：价格承诺、增项说明、客户异议处理。

要求：活动要适合装修公司真实成交，不做虚假低价噱头。`;
  },

  ads(brief) {
    return `你是装修行业广告投放优化师，请为以下公司制定广告投放方案。

【公司资料】
${briefBlock(brief)}

【请输出】
1. 投放目标：线索、私信、表单、直播间预约如何选择。
2. 人群定向：城市、年龄、兴趣、楼盘、小区、装修阶段。
3. 素材方向：至少12个广告素材选题。
4. 落地页结构：标题、痛点、案例、权益、表单、信任背书。
5. 预算建议：低预算、中预算、增长预算三档。
6. A/B测试计划：测试什么，如何判断保留。
7. 复盘表：曝光、点击、线索、成本、到店、成交辅助。

要求：给出保守、可执行、可复盘的投放建议。`;
  },

  live(brief) {
    return `你是装修公司直播运营负责人，请为以下公司设计直播运营方案。

【公司资料】
${briefBlock(brief)}

【请输出】
1. 直播定位和主题。
2. 直播间人员分工：主播、设计师、场控、客服。
3. 120分钟直播流程表。
4. 主播开场话术、福利话术、答疑话术、逼单话术。
5. 直播福利设计：免费量房、设计名额、材料礼包、老房诊断。
6. 直播前3天预热视频和私域邀约话术。
7. 直播后24小时跟进SOP。

要求：重视预约和到店转化，不要只追求在线人数。`;
  },

  proposal(brief) {
    return `你是装修公司年度代运营服务投标顾问，请为以下公司生成年框标书初稿。

【公司资料】
${briefBlock(brief)}

【请输出】
1. 年度服务总目标。
2. 服务模块：品牌策略、账号运营、内容策划、拍摄剪辑、种草投放、活动策划、直播运营、广告投放、数据复盘。
3. 每个模块的服务内容、交付频次、验收标准。
4. 年度运营排期：按季度规划。
5. 团队配置和分工。
6. KPI建议：内容、线索、到店、直播、投放复盘维度。
7. 报价结构：基础版、标准版、增长版。
8. 投标优势和风险说明。

要求：语气适合正式提案，能直接改成PPT或Word标书。`;
  },

  private(brief) {
    return `你是装修公司私域转化负责人，请为以下公司设计客户跟进体系。

【公司资料】
${briefBlock(brief)}

【请输出】
1. 客户分层：新线索、高意向、已量房、已到店、未成交、老客户。
2. 每类客户的跟进目标、跟进频次、负责人。
3. 私信、微信、电话、朋友圈、社群的标准话术。
4. 7天跟进SOP：每天发什么、问什么、如何推进。
5. 设计师、客服、老板分别怎么配合。
6. 装修客户常见异议处理话术。
7. 私域数据表字段建议。

要求：话术要自然，不要压迫感，重点提升预约量房和到店率。`;
  },

  review(brief) {
    return `你是装修公司运营数据分析师，请为以下公司设计月度复盘报告。

【公司资料】
${briefBlock(brief)}

【请输出】
1. 月度核心结论。
2. 账号数据复盘：发布量、播放、互动、涨粉、私信。
3. 内容复盘：爆款内容、低效内容、可复用选题。
4. 线索复盘：来源、数量、质量、跟进状态。
5. 活动复盘：报名、到店、成交辅助、问题。
6. 投放复盘：预算、线索成本、素材表现、落地页问题。
7. 直播复盘：在线、停留、预约、追单。
8. 下月优化动作清单。

要求：用老板能看懂的语言，不堆术语，每个问题都给具体动作。`;
  },

  competitor(brief) {
    return `你是装修行业竞品研究顾问，请为以下公司设计本地竞品分析方案。

【公司资料】
${briefBlock(brief)}

【请输出】
1. 应该选择哪些竞品：本地头部、同客单价、同业务、内容做得好的账号。
2. 竞品账号分析表字段。
3. 竞品内容拆解：定位、选题、标题、封面、出镜、转化。
4. 竞品活动拆解：活动主题、权益、报名路径、成交承接。
5. 竞品广告素材拆解：痛点、案例、利益点、落地页。
6. 可借鉴点、不可模仿点、差异化机会。
7. 30天追踪计划。

要求：不要只做表面评价，要能指导账号和活动优化。`;
  },

  bid(brief) {
    return `你是装修公司年框服务标书顾问，请为以下项目生成完整标书目录和每章写作要点。

【公司资料】
${briefBlock(brief)}

【请输出】
1. 标书封面信息建议。
2. 完整目录，至少包含12个章节。
3. 每章写作要点。
4. 服务范围和边界说明。
5. 项目组织架构。
6. 年度排期表。
7. 交付验收标准。
8. 风险控制和客户配合事项。
9. 附件清单：案例、团队、报价、SOP、数据报表样张。

要求：结构正式，适合复制到Word或PPT中继续完善。`;
  }
};

const frameworkBuilders = {
  account: (brief) => `# ${brief.company}账号搭建执行框架

## 账号定位
本地装修透明报价与标准化施工账号，重点服务${brief.city}的${brief.customer}。

## 账号矩阵
- 抖音：短视频获客，主打工地、案例、避坑。
- 小红书：种草和收藏，主打预算、案例、装修经验。
- 视频号：熟人信任和直播承接。
- 公众号：深度案例、活动报名、客户沉淀。

## 首月动作
1. 完成账号名、头像、简介、置顶内容。
2. 每周发布5-7条短视频。
3. 每周沉淀2-3篇小红书笔记。
4. 每周复盘私信和评论问题。

## 转化路径
内容曝光 -> 评论/私信 -> 发送案例/预算表 -> 预约量房 -> 到店方案沟通。`,

  content: (brief) => `# ${brief.company}月度内容执行框架

## 内容主线
围绕${brief.business}，用真实工地、真实案例和真实报价建立信任。

## 内容比例
- 装修避坑：30%
- 工地过程：20%
- 案例种草：20%
- 设计师专业：15%
- 活动转化：15%

## 每周节奏
- 周一：装修避坑
- 周二：工地细节
- 周三：案例前后对比
- 周四：设计师讲方案
- 周五：活动或直播预告
- 周末：直播切片和客户问答`,

  shooting: (brief) => `# ${brief.company}拍摄执行框架

## 拍摄对象
设计师、工长、监理、业主案例、材料展厅、在施工地。

## 单次拍摄清单
- 设计师口播3条
- 工地巡检3条
- 材料展示2条
- 案例讲解2条
- 活动口播2条

## 拍摄原则
每条视频必须有明确痛点、真实场景、专业细节和行动引导。`,

  seeding: (brief) => `# ${brief.company}小红书种草框架

## 适合内容
预算清单、避坑经验、户型改造、旧房翻新、环保材料、案例前后对比。

## 笔记结构
标题 -> 真实痛点 -> 改造过程 -> 费用或细节 -> 经验总结 -> 私信引导。

## 私信引导
用“同小区案例”“预算参考”“避坑清单”“免费量房”承接。`,

  campaign: (brief) => `# ${brief.company}活动策划框架

## 推荐活动
${brief.city}样板间征集计划。

## 活动机制
限量征集同小区或同户型业主，提供免费量房、方案沟通、预算审核和材料升级权益。

## 承接路径
短视频预热 -> 小红书种草 -> 社群报名 -> 设计师电话确认 -> 到店沟通 -> 成交追踪。`,

  ads: (brief) => `# ${brief.company}广告投放框架

## 投放目标
优先获取高质量表单和私信咨询，不只追求低价线索。

## 素材方向
工地细节、报价避坑、案例前后对比、设计师讲方案、样板间征集。

## 复盘指标
曝光、点击、表单、私信、有效线索、预约量房、到店、成交辅助。`,

  live: (brief) => `# ${brief.company}直播运营框架

## 直播主题
${brief.city}装修避坑与样板间征集专场。

## 120分钟流程
开场福利 -> 装修痛点 -> 案例讲解 -> 设计师答疑 -> 活动权益 -> 预约引导 -> 直播后追单。

## 重点
直播的目标是预约和到店，不是单纯在线人数。`,

  proposal: (brief) => `# ${brief.company}年框服务执行框架

## 年度服务目标
搭建本地装修公司内容获客和活动转化体系，形成可持续线索来源。

## 服务模块
品牌策略、账号运营、内容策划、拍摄脚本、种草运营、活动策划、直播运营、广告投放、数据复盘。

## 推荐报价
基础版：7.2万-14.4万/年
标准版：18万-36万/年
增长版：42万-96万/年`,

  private: (brief) => `# ${brief.company}私域跟进框架

## 客户分层
新线索、高意向、已量房、已到店、未成交、老客户。

## 跟进节奏
当天响应，24小时二次跟进，3天内给案例和预算参考，7天内推动量房或到店。

## 关键动作
客服问需求，设计师给专业建议，老板或店长负责关键客户信任背书。`,

  review: (brief) => `# ${brief.company}月度复盘框架

## 复盘维度
内容、线索、活动、投放、直播、私域、成交辅助。

## 必看问题
什么内容带来线索，什么线索能到店，什么环节流失最多，下月该减少什么、加大什么。

## 输出
月度结论、问题清单、下月动作、责任人、完成时间。`,

  competitor: (brief) => `# ${brief.company}竞品分析框架

## 分析对象
本地头部装修公司、同价位竞品、内容表现好的设计工作室、投放强的整装品牌。

## 分析维度
账号定位、内容选题、案例包装、活动权益、直播打法、私信承接、广告素材。

## 产出
可借鉴清单、差异化机会、30天优化动作。`,

  bid: (brief) => `# ${brief.company}年框标书目录框架

1. 项目背景
2. 客户需求理解
3. 年度服务目标
4. 品牌与账号策略
5. 内容运营方案
6. 拍摄与素材生产方案
7. 小红书与种草方案
8. 活动策划方案
9. 广告投放支持方案
10. 直播运营方案
11. 数据复盘机制
12. 项目团队配置
13. 年度排期
14. 交付验收标准
15. 报价方案
16. 风险控制与客户配合事项`
};

function render() {
  const brief = getBrief();
  output.value = currentMode === "prompt" ? builders[currentModule](brief) : frameworkBuilders[currentModule](brief);
  saveBrief();
}

form.addEventListener("input", render);

moduleGrid.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-module]");
  if (!button) return;
  currentModule = button.dataset.module;
  document.querySelectorAll("#moduleGrid button").forEach((item) => item.classList.remove("active"));
  button.classList.add("active");
  render();
});

modeSwitch.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-mode]");
  if (!button) return;
  currentMode = button.dataset.mode;
  document.querySelectorAll(".mode-switch button").forEach((item) => item.classList.remove("active"));
  button.classList.add("active");
  render();
});

fillDemo.addEventListener("click", () => {
  Object.entries(demo).forEach(([key, value]) => {
    const field = form.elements[key];
    if (field) field.value = value;
  });
  render();
});

clearBrief.addEventListener("click", () => {
  form.reset();
  if (canUseStorage()) localStorage.removeItem(storageKey);
  render();
});

copyPrompt.addEventListener("click", async () => {
  await navigator.clipboard.writeText(output.value);
  copyPrompt.textContent = "已复制";
  setTimeout(() => {
    copyPrompt.textContent = "复制结果";
  }, 1400);
});

downloadPrompt.addEventListener("click", () => {
  const brief = getBrief();
  const filename = `${brief.company}-${moduleNames[currentModule]}-${currentMode === "prompt" ? "提示词" : "执行框架"}.md`;
  const blob = new Blob([output.value], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename.replace(/[\\/:*?"<>|]/g, "-");
  link.click();
  URL.revokeObjectURL(url);
});

function saveBrief() {
  if (!canUseStorage()) return;
  const data = {};
  new FormData(form).forEach((value, key) => {
    data[key] = value;
  });
  localStorage.setItem(storageKey, JSON.stringify(data));
}

function restoreBrief() {
  if (!canUseStorage()) return;
  const raw = localStorage.getItem(storageKey);
  if (!raw) return;
  try {
    const data = JSON.parse(raw);
    Object.entries(data).forEach(([key, value]) => {
      const field = form.elements[key];
      if (field) field.value = value;
    });
  } catch {
    localStorage.removeItem(storageKey);
  }
}

function canUseStorage() {
  try {
    return typeof window.localStorage !== "undefined";
  } catch {
    return false;
  }
}

restoreBrief();
render();
