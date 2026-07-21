import requests
import json
API_KEY = "your-api-key"
URL = "your-api-address"
# ===========================

def polish_email(draft):
    """
    输入：草稿文字(字符串)
    输出：润色后的正式邮件(字符串)
    """
    payload = {
        "model": "glm-5.2",
        "messages": [
            {
                "role": "system",
                "content": """你是一名在外企工作多年的资深商务邮件助理，熟悉外企沟通风格。请严格遵循以下邮件标准结构，将用户输入的中文草稿改写为一封符合外企规范的专业邮件。

【你必须严格按照这个模板输出，不要省略任何部分】

---
主题(Subject)：[根据内容生成一个简洁的主题]

[开头问候语，如 Hi Team, Dear All, Hello XXX]

[第一段：背景说明] 简要说明发邮件的原因或背景，用1-2句话。

[第二段：核心内容] 详细说明事项、需求或问题，分点或分段清晰呈现。

[第三段：行动号召] 明确希望收件人做什么，如 "请帮忙..."、"麻烦确认..."、"期待你的反馈"。

[第四段：补充信息] 如有额外说明，放在此段。

[结尾客套语，如 期待回复 / 如有问题随时沟通]

Best regards,
[你的名字]
---

【语言要求】邮件正文**以中文为主**，确保专业、清晰、有结构。关键的商务动词、产品术语或专业词汇可以保留英文(如 align, roadmap, timeline, scope, kick-off, stakeholder 等)，但整体句子为中文，不要输出大段英文。"""
            },
            {
                "role": "user",
                "content": f"请将下面这段草稿润色成一封符合外企规范的邮件：\n{draft}"
            }
        ]
    }

    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {API_KEY}"
    }

    try:
        response = requests.post(URL, headers=headers, json=payload)
        if response.status_code == 200:
            result = response.json()
            return result["choices"][0]["message"]["content"]
        else:
            return f"❌ 请求失败，状态码：{response.status_code}\n{response.text}"
    except Exception as e:
        return f"❌ 发生异常：{str(e)}"


# ========== 主程序入口 ==========
if __name__ == "__main__":
    print("📧 欢迎使用邮件润色工具(外企风格)！")
    print("请输入你的草稿内容(输入完成后按回车，输入 q 或 quit 退出)：")
    
    while True:
        user_input = input("\n📝 你的草稿：")
        if user_input.lower() in ['q', 'quit']:
            print("👋 再见！")
            break
        if not user_input.strip():
            print("⚠️ 输入不能为空，请重新输入。")
            continue
        
        print("🔄 正在润色中，请稍候...")
        result = polish_email(user_input)
        print("\n✅ 润色结果：")
        print("-" * 60)
        print(result)
        print("-" * 60)
