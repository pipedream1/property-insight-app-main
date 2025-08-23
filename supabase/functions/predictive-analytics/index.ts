
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    // Fetch component data for analysis
    const { data: components, error } = await supabaseClient
      .from('property_components')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Database error: ${error.message}`);
    }

    // Analyze components using AI
    const prompt = `Analyze the following property component data and provide predictive insights for infrastructure replacement planning:

${JSON.stringify(components, null, 2)}

Please provide:
1. Components that likely need replacement within 6 months
2. Components that need attention within 1 year  
3. Overall infrastructure health score (1-10)
4. Recommended maintenance priorities
5. Estimated replacement costs (general ranges)

Format your response as JSON with the following structure:
{
  "immediate_attention": [{"component": "name", "reason": "explanation", "priority": "high/medium/low"}],
  "within_year": [{"component": "name", "reason": "explanation", "estimated_cost": "range"}],
  "health_score": number,
  "recommendations": ["recommendation1", "recommendation2"],
  "total_estimated_costs": "range"
}`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
    model: Deno.env.get('OPENAI_MODEL') || 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are an expert infrastructure analyst. Provide detailed, practical insights based on component condition data.' },
          { role: 'user', content: prompt }
        ],
        max_tokens: 1500,
        temperature: 0.3,
      }),
    });

    const data = await response.json();
    let analysis;
    
    try {
      analysis = JSON.parse(data.choices[0].message.content);
    } catch (parseError) {
      // If JSON parsing fails, return a structured fallback
      analysis = {
        immediate_attention: [],
        within_year: [],
        health_score: 7,
        recommendations: ["Regular inspections needed", "Update component tracking"],
        total_estimated_costs: "Data insufficient for cost estimation"
      };
    }

    return new Response(JSON.stringify({ analysis }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in predictive analytics function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
