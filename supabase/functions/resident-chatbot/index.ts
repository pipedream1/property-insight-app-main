
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { fetchRelevantData, formatDataForAI, buildSystemPrompt } from './messageProcessor.ts';
import { testOpenAIConnection, callOpenAI } from './openaiClient.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('=== Ask Rutherford - Enhanced Butler AI ===');
    console.log('Request method:', req.method);
    
    let requestBody;
    try {
      requestBody = await req.json();
    } catch (parseError) {
      console.error('❌ Failed to parse request body:', parseError);
      return new Response(JSON.stringify({ 
        reply: 'I apologize, but I received an invalid request format. Please try again.' 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }
    
    const { message, conversationHistory = [], testConnection = false, documentOnly = false } = requestBody;
    console.log('Request details:');
    console.log('- testConnection:', testConnection);
    console.log('- documentOnly:', documentOnly);
    console.log('- message:', message ? 'provided' : 'missing');
    console.log('- conversationHistory length:', conversationHistory.length);

    // Get and validate OpenAI API key
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    
    if (!openAIApiKey || openAIApiKey.trim() === '') {
      console.error('❌ OpenAI API key not found or empty in environment variables');
      const fallbackReply = `I do apologize most sincerely, but I'm currently not properly configured to access my knowledge base. The API credentials appear to be missing. Please contact the estate management office for assistance.`;
      return new Response(JSON.stringify({ 
        reply: fallbackReply,
        error: 'API key not configured'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      });
    }

    console.log('✅ API key found, length:', openAIApiKey.length);

    // Test API key connection
    try {
      console.log('🔍 Testing OpenAI API connection...');
      const testResponse = await testOpenAIConnection(openAIApiKey);
      
      // If this is just a connection test, return detailed info
      if (testConnection) {
        const modelsData = await testResponse.json();
        console.log('✅ Connection test successful, models count:', modelsData.data?.length || 0);
        
        return new Response(JSON.stringify({ 
          success: true,
          status: testResponse.status,
          modelsCount: modelsData.data?.length || 0,
          message: "Rutherford is ready to serve with full document access!"
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      console.log('✅ API key test successful');
    } catch (error) {
      console.error('❌ API key test failed:', error.message);
      
      if (testConnection) {
        return new Response(JSON.stringify({ 
          success: false,
          error: error.message,
          message: "Rutherford is experiencing technical difficulties with the OpenAI connection",
          details: error.toString()
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      let fallbackReply;
      if (error.message.includes('401') || error.message.includes('authentication')) {
        fallbackReply = `I do apologize, but my credentials appear to be invalid. The API key may be incorrect or expired. Please contact the estate management office for assistance.`;
      } else if (error.message.includes('429') || error.message.includes('rate limit')) {
        fallbackReply = `I'm rather busy at the moment serving other residents. Please try again shortly.`;
      } else if (error.message.includes('quota') || error.message.includes('billing')) {
        fallbackReply = `I'm experiencing service limitations at the moment. Please contact the estate management office for assistance.`;
      } else {
        fallbackReply = `I'm experiencing technical difficulties: ${error.message}. Please contact the estate management office for assistance.`;
      }
      
      return new Response(JSON.stringify({ 
        reply: fallbackReply,
        error: error.message 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!message || message.trim() === '') {
      console.log('❌ No message provided');
      return new Response(JSON.stringify({ 
        reply: 'Good day! How may I be of service to you today?' 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('🎩 Rutherford processing inquiry:', message.substring(0, 100) + '...');

    // Fetch comprehensive data including storage documents
    console.log('📚 Accessing comprehensive document library and property data...');
    let dataContext;
    try {
      dataContext = await fetchRelevantData(message, documentOnly);
    } catch (dataError) {
      console.error('❌ Error fetching data context:', dataError);
      dataContext = {
        databaseData: null,
        documentData: null,
        storageDocuments: { documents: [], relevantDocuments: [], totalCount: 0 }
      };
    }
    
    const dataContextString = formatDataForAI(dataContext);
    
    console.log('📊 Enhanced data context result:', {
      hasStorageDocuments: !!dataContext.storageDocuments?.totalCount,
      storageDocumentCount: dataContext.storageDocuments?.totalCount || 0,
      relevantStorageDocuments: dataContext.storageDocuments?.relevantDocuments?.length || 0,
      hasMockDocuments: !!dataContext.documentData?.allDocuments?.length,
      mockDocumentCount: dataContext.documentData?.allDocuments?.length || 0,
      hasDatabaseData: !!dataContext.databaseData,
      contextLength: dataContextString.length,
      documentOnly
    });

    const systemPrompt = buildSystemPrompt(dataContextString, documentOnly);
    console.log('🎩 Enhanced Rutherford system prompt created, length:', systemPrompt.length);

    // Format messages for OpenAI with enhanced context
    const messages = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory.map(msg => ({
        role: msg.role,
        content: msg.content
      })),
      { role: 'user', content: message }
    ];

    console.log('📤 Calling OpenAI with enhanced Rutherford context, messages:', messages.length);

    try {
      const response = await callOpenAI(openAIApiKey, messages);
      const data = await response.json();
      console.log('✅ Rutherford response received');
      
      if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        console.error('❌ Invalid response structure from OpenAI:', JSON.stringify(data, null, 2));
        const fallbackReply = `I received an unexpected response format. Please try your question again, or contact the estate management office for assistance.`;
        
        return new Response(JSON.stringify({ 
          reply: fallbackReply,
          error: 'Invalid API response structure'
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const reply = data.choices[0].message.content;
      console.log('🎩 Rutherford sending distinguished reply (first 200 chars):', reply.substring(0, 200) + '...');

      return new Response(JSON.stringify({ reply }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } catch (error) {
      console.error('❌ OpenAI call failed:', error.message);
      
      let fallbackReply;
      if (error.message.includes('401') || error.message.includes('authentication')) {
        fallbackReply = `I'm experiencing authentication issues with my knowledge systems. Please contact the estate management office for assistance.`;
      } else if (error.message.includes('429') || error.message.includes('rate limit')) {
        fallbackReply = `I'm rather busy at the moment serving other residents. Please try again shortly.`;
      } else if (error.message.includes('500') || error.message.includes('server')) {
        fallbackReply = `The OpenAI services are temporarily unavailable. Please try again later.`;
      } else if (error.message.includes('quota') || error.message.includes('billing')) {
        fallbackReply = `I'm experiencing service limitations. Please contact the estate management office for assistance.`;
      } else {
        fallbackReply = `I'm experiencing technical difficulties: ${error.message}. Please try your question again, or contact the estate management office for assistance.`;
      }
      
      return new Response(JSON.stringify({ 
        reply: fallbackReply,
        error: error.message
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
  } catch (error) {
    console.error('❌ Unexpected error in Ask Rutherford function:', error);
    console.error('❌ Error stack:', error.stack);
    
    const errorReply = `I encountered an unexpected error: ${error.message}. Please try again, or contact the estate management office for assistance.`;
    
    return new Response(JSON.stringify({ 
      reply: errorReply,
      error: error.message,
      stack: error.stack
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
