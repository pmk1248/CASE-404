exports.handler = async (event) => {
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Method Not Allowed" };
    }

    try {
        const body = JSON.parse(event.body);
        const userText = body.text;
        const systemPrompt = body.persona; 
        
        // Grab the hidden API key from Netlify
        const API_KEY = process.env.GROQ_API_KEY; 
        
        // The Groq API URL
        const url = 'https://api.groq.com/openai/v1/chat/completions';

        // Send the interrogation data to Groq
        const response = await fetch(url, {
            method: 'POST',
            headers: { 
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile", // The smartest free model for roleplay
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: "Detective: " + userText }
                ],
                temperature: 0.7, // Keeps the AI creative but focused
                max_tokens: 150   // Prevents the AI from rambling
            })
        });

        const data = await response.json();
        const aiText = data.choices[0].message.content;

        // Send the AI's response back to your website
        return { 
            statusCode: 200, 
            body: JSON.stringify({ reply: aiText }) 
        };

    } catch (error) {
        console.error(error);
        return { 
            statusCode: 500, 
            body: JSON.stringify({ error: "Connection to suspect lost." }) 
        };
    }
};