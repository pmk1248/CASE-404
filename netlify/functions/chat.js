export default async (req, context) => {
    if (req.method !== 'POST') {
        return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
    }
    try {
        const body = await req.json();
        const text = body.text;
        const persona = body.persona;
        const apiKey = process.env.GROQ_API_KEY;
        
        if (!apiKey) {
            return new Response(JSON.stringify({ reply: "DEBUG ERROR: GROQ_API_KEY environment variable is missing or empty in Netlify." }), { status: 200 });
        }

        const apiRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'openai/gpt-oss-120b',
                messages: [
                    { role: 'system', content: persona },
                    { role: 'user', content: text }
                ],
                temperature: 0.7,
                max_tokens: 300
            })
        });

        const data = await apiRes.json();
        
        if (data.error) {
            return new Response(JSON.stringify({ reply: "GROQ API ERROR: " + (data.error.message || JSON.stringify(data.error)) }), { status: 200 });
        }

        const reply = data.choices && data.choices[0] && data.choices[0].message ? data.choices[0].message.content : "The suspect remains silent.";
        
        return new Response(JSON.stringify({ reply }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    } catch (error) {
        return new Response(JSON.stringify({ reply: "SERVER EXCEPTION: " + error.message }), { status: 200 });
    }
};
