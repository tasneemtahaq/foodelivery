/* eslint-disable */
require('dotenv').config();

async function main() {
  const key = process.env.GROQ_API_KEY;
  if (!key) { console.log('❌ No GROQ_API_KEY'); return; }

  const models = [
    'qwen/qwen3.6-27b',
    'openai/gpt-oss-20b',
    'openai/gpt-oss-120b',
  ];

  for (const model of models) {
    console.log(`\nTrying: ${model}`);
    const res  = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type':  'application/json',
        'Authorization': `Bearer ${key}`,
      },
      body: JSON.stringify({
        model,
        max_tokens: 50,
        messages: [{ role: 'user', content: 'Say hello' }],
      }),
    });
    const data = await res.json();
    if (data.choices) {
      console.log(`✅ ${model} WORKS!`);
      console.log('Reply:', data.choices[0].message.content);
      break;
    } else {
      console.log(`❌ ${model}:`, data.error?.message);
    }
  }
}

main().catch(console.error);node test.js