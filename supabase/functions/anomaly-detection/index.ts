
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

    // Fetch recent water readings for analysis
    const { data: readings, error } = await supabaseClient
      .from('water_readings')
      .select('*')
      .eq('component_type', 'WaterMeter')
      .order('date', { ascending: false })
      .limit(100);

    if (error) {
      throw new Error(`Database error: ${error.message}`);
    }

    // Analyze water usage patterns using AI
    const prompt = `Analyze the following water usage data for anomaly detection:

${JSON.stringify(readings, null, 2)}

Look for:
1. Unusual spikes in consumption that might indicate leaks
2. Patterns that suggest meter malfunctions
3. Consumption trends that deviate from normal patterns
4. Components with concerning usage patterns

Provide your analysis as JSON:
{
  "anomalies": [
    {
      "component": "component_name",
      "type": "spike|drop|malfunction|trend",
      "severity": "high|medium|low",
      "description": "explanation",
      "recommended_action": "action to take"
    }
  ],
  "overall_status": "normal|concerning|critical",
  "summary": "brief summary of findings"
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
          { role: 'system', content: 'You are a water utility analyst expert in detecting anomalies and potential issues in water usage patterns.' },
          { role: 'user', content: prompt }
        ],
        max_tokens: 1000,
        temperature: 0.2,
      }),
    });

    const data = await response.json();
    let analysis;
    
    try {
      analysis = JSON.parse(data.choices[0].message.content);
    } catch (parseError) {
      analysis = {
        anomalies: [],
        overall_status: "normal",
        summary: "Unable to analyze data patterns at this time"
      };
    }

    return new Response(JSON.stringify({ analysis }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in anomaly detection function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
