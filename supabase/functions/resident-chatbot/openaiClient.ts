
export async function testOpenAIConnection(apiKey: string) {
  console.log('Testing OpenAI API connection...');
  
  if (!apiKey || apiKey.trim() === '') {
    throw new Error('OpenAI API key is missing or empty');
  }
  
  try {
    const testResponse = await fetch('https://api.openai.com/v1/models', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('API test response status:', testResponse.status);
    console.log('API test response headers:', Object.fromEntries(testResponse.headers.entries()));
    
    if (!testResponse.ok) {
      const errorText = await testResponse.text();
      console.error('API key test failed:', testResponse.status, errorText);
      throw new Error(`API test failed: ${testResponse.status} - ${errorText}`);
    }

    const data = await testResponse.json();
    console.log('✅ OpenAI API connection successful, models available:', data.data?.length || 0);
    return testResponse;
  } catch (error) {
    console.error('❌ OpenAI API connection failed:', error);
    throw error;
  }
}

export async function callOpenAI(apiKey: string, messages: any[]) {
  console.log('Calling OpenAI chat completion API with message count:', messages.length);
  
  if (!apiKey || apiKey.trim() === '') {
    throw new Error('OpenAI API key is missing or empty');
  }
  
  if (!messages || messages.length === 0) {
    throw new Error('No messages provided for OpenAI API call');
  }
  
  try {
  // Allow overriding the model via environment variable for global control
  const model = (typeof Deno !== 'undefined' && Deno.env?.get?.('OPENAI_MODEL')) || 'gpt-4o-mini';

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
    model,
        messages: messages,
        temperature: 0.7,
        max_tokens: 1000,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      }),
    });

    console.log('Chat completion response status:', response.status);
    console.log('Chat completion response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI chat completion error:', response.status, response.statusText);
      console.error('Error details:', errorText);
      
      // Parse error response for better error messages
      try {
        const errorData = JSON.parse(errorText);
        throw new Error(`OpenAI API Error: ${errorData.error?.message || errorText}`);
      } catch {
        throw new Error(`Chat completion failed: ${response.status} - ${errorText}`);
      }
    }

    return response;
  } catch (error) {
    console.error('❌ OpenAI API call failed:', error);
    throw error;
  }
}
