// 🌐 双向邮件翻译器（中↔英 + 外企格式）
// 输入中文或英文邮件草稿，输出对应语言的完整外企邮件

const apiKey = "your-api-key"; 
const url = "your-api- address";

// 输入弹窗
let alert = new Alert();
alert.title = "🌐 邮件翻译器（双向）";
alert.message = "支持中文↔英文自动翻译，并格式化为完整外企邮件。\n输入中文或英文草稿即可。";
alert.addTextField("粘贴邮件草稿", "");
alert.addAction("翻译并格式化");
alert.addCancelAction("取消");

let response = await alert.present();
if (response === -1) return;

let inputText = alert.textFieldValue(0);
if (!inputText || inputText.trim().length === 0) {
    let err = new Alert();
    err.title = "⚠️ 输入不能为空";
    err.addAction("确定");
    await err.present();
    return;
}

// 构造请求（核心：自动检测语言并双向翻译）
const body = {
    model: "glm-5.2",
    messages: [
        {
            role: "system",
            content: `你是一名资深外企商务邮件翻译助理。你的任务是将用户提供的邮件草稿，翻译成另一种语言，并输出为完整的外企邮件格式。

【语言方向】
- 如果输入是中文 → 翻译为英文
- 如果输入是英文 → 翻译为中文
- 自动检测，无需用户指定

【输出格式要求】
你必须严格按照以下完整邮件模板输出，不要省略任何部分：

---
Subject: [根据内容生成一个清晰的主题，用目标语言]

[开头称呼：用目标语言的标准称呼，如 Hi Team / 亲爱的团队]

[第一段：问候与背景]
- 英文开头：用 "I hope this email finds you well." 或类似
- 中文开头：用“希望您收到此邮件时一切顺利。”或类似
然后简要说明发邮件的原因或背景（1-2句）。

[第二段：核心内容]
- 准确翻译用户草稿中的核心内容
- 分段清晰，如有多个事项用 bullet points（- 或 •）列出
- 专业术语（如 timeline, scope, kick-off）在目标语言中保留英文或恰当翻译

[第三段：行动号召]
- 明确收件人应该做什么，使用目标语言的礼貌请求句式

[第四段：结尾客套语]
- 英文：如 "Please feel free to reach out." / "Looking forward to your reply."
- 中文：如“期待您的回复。” / “如有问题，请随时联系。”

[署名]
- 英文： "Best regards," 后加 [Your Name]
- 中文： “此致” 或 “祝好” 后加 [您的名字]
---

【语言要求】
- 只输出翻译后的邮件正文，不要添加任何额外解释
- 确保翻译流畅、专业、符合目标语言的商务写作习惯
- 整封邮件读起来像一个外企员工亲手写出的`
        },
        {
            role: "user",
            content: `请将以下草稿翻译为相应语言，并按完整外企邮件模板输出：\n${inputText}`
        }
    ]
};

const req = new Request(url);
req.method = "POST";
req.headers = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${apiKey}`
};
req.body = JSON.stringify(body);

try {
    const result = await req.loadJSON();
    const reply = result.choices[0].message.content;

    // 显示结果
    let resultAlert = new Alert();
    resultAlert.title = "✅ 翻译完成";
    resultAlert.message = reply;
    resultAlert.addAction("复制内容");
    resultAlert.addAction("确定");
    let btn = await resultAlert.present();
    if (btn === 0) {
        Pasteboard.copyString(reply);
        let copied = new Alert();
        copied.title = "已复制到剪贴板";
        copied.addAction("好的");
        await copied.present();
    }
} catch (error) {
    let err = new Alert();
    err.title = "❌ 请求失败";
    err.message = error.message;
    err.addAction("确定");
    await err.present();
}
