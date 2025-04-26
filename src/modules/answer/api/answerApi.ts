import axios from 'axios';
import { studentPrompt } from '../store/prompt';

const KIMI_TOKEN = 'sk-0475wT7Wd3RKbKYde3hbuH7ijtaUGzZnvL9sPjJzRyOQGIFO'; // 把你的Moonshot API Key填这里

export async function askAI(question: string) {
  try {
    const response = await axios.post(
      'https://api.moonshot.cn/v1/chat/completions',
      {
        model: 'moonshot-v1-8k', // 你用的模型名字
        messages: [
          { role: 'user', content: question},
          { role: "system", 
            content: studentPrompt
          },
        ],
        temperature: 0.3,
        stream: false, // 先用非流式，简单直接
      },
      {
        headers: {
          Authorization: `Bearer ${KIMI_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('🔍 Moonshot返回:', response.data);

    const aiContent = response.data?.choices?.[0]?.message?.content || 'AI无回复';
    return aiContent;

  } catch (error) {
    console.error('❌ 调用Moonshot失败:', error);
    return '抱歉，AI暂时无法回答，请稍后再试。';
  }
}
