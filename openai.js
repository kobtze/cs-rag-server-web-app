const OpenAI = require('openai');

const openAIProcess = async ({userQuery, retrievedDocument}) => {
    const apiKey = process.env.OPENAI_API_KEY;
    const openai = new OpenAI({ apiKey });

    const prompt = `
    Based on user query and answer already given for similar query, write a suggested response to user.
    Return only suggested response (omit any context from response).
    
    User query:
    "${userQuery}"
    
    Answer already given for similar query:
    ${JSON.stringify(retrievedDocument)}
    
    `;

    const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
            { role: 'system', content: 'You are a helpful technical support / customer service assistant.' },
            { role: 'user', content: prompt }
        ]
    });

    return completion.choices[0].message.content;
}

module.exports = {
    openAIProcess
}
