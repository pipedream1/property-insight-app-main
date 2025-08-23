
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4';

interface StorageDocument {
  id: string;
  name: string;
  metadata?: any;
  created_at: string;
  updated_at: string;
  last_accessed_at?: string;
  content?: string;
}

interface DocumentContext {
  documents: StorageDocument[];
  relevantDocuments: StorageDocument[];
  totalCount: number;
}

const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

export async function fetchStorageDocuments(message: string): Promise<DocumentContext> {
  console.log('Fetching documents from Supabase storage...');
  
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error('Missing Supabase credentials');
    return {
      documents: [],
      relevantDocuments: [],
      totalCount: 0
    };
  }

  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    
    // Fetch documents from estate-documents bucket
    const { data: files, error } = await supabase.storage
      .from('estate-documents')
      .list('', {
        limit: 100,
        sortBy: { column: 'name', order: 'asc' }
      });

    if (error) {
      console.error('Error fetching storage documents:', error);
      return {
        documents: [],
        relevantDocuments: [],
        totalCount: 0
      };
    }

    console.log(`Found ${files?.length || 0} documents in storage`);

    const documents: StorageDocument[] = (files || []).map(file => ({
      id: file.id || file.name,
      name: file.name,
      metadata: file.metadata,
      created_at: file.created_at || '',
      updated_at: file.updated_at || '',
      last_accessed_at: file.last_accessed_at
    }));

    // Find relevant documents based on message content
    const relevantDocuments = findRelevantDocuments(documents, message);
    
    console.log(`Found ${relevantDocuments.length} relevant documents`);
    
    return {
      documents,
      relevantDocuments,
      totalCount: documents.length
    };
  } catch (error) {
    console.error('Error in fetchStorageDocuments:', error);
    return {
      documents: [],
      relevantDocuments: [],
      totalCount: 0
    };
  }
}

function findRelevantDocuments(documents: StorageDocument[], message: string): StorageDocument[] {
  const lowerMessage = message.toLowerCase();
  
  // Extract meaningful keywords from the message
  const keywords = lowerMessage
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 2)
    .filter(word => !['the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'her', 'was', 'one', 'our', 'had', 'day'].includes(word));

  console.log('Extracted keywords:', keywords);

  // Enhanced Belvidere-specific keywords for better document matching
  const belvidereKeywords = [
    // Building & Design
    'building', 'design', 'construction', 'architecture', 'height', 'setback', 'coverage',
    'foundation', 'structure', 'materials', 'roof', 'window', 'door', 'balcony', 'veranda',
    'garage', 'carport', 'fence', 'boundary', 'wall', 'color', 'style', 'guidelines',
    'approval', 'permit', 'plan', 'specification', 'compliance', 'requirement', 'standard',
    'aesthetic', 'appearance', 'exterior', 'facade', 'elevation', 'landscaping', 'garden',
    'driveway', 'paving', 'lighting', 'signage', 'size', 'dimension', 'area', 'volume',
    
    // Estate Specific
    'belvidere', 'estate', 'management', 'rules', 'regulations', 'resident', 'property',
    'homeowner', 'committee', 'board', 'application', 'process', 'procedure', 'policy',
    
    // Municipal
    'knysna', 'municipality', 'municipal', 'bylaw', 'by-law', 'council', 'government',
    'local', 'authority', 'official', 'public', 'service', 'administration',
    
    // Specific Topics
    'water', 'waste', 'fire', 'safety', 'noise', 'parking', 'pet', 'animal', 'dog', 'cat',
    'pool', 'swimming', 'security', 'access', 'gate', 'visitor', 'guest', 'maintenance',
    'repair', 'contractor', 'landscaping', 'tree', 'plant', 'garden', 'environmental'
  ];

  return documents.filter(doc => {
    const docName = doc.name.toLowerCase();
    let relevanceScore = 0;
    
    // Building Design Manual gets highest priority for Belvidere
    if (docName.includes('building') && docName.includes('design')) {
      relevanceScore += 200;
    }
    
    // Belvidere-specific documents get high priority
    if (docName.includes('belvidere')) {
      relevanceScore += 150;
    }
    
    // Estate rules and management documents
    if (docName.includes('estate') || docName.includes('rules') || docName.includes('regulation')) {
      relevanceScore += 100;
    }
    
    // Check for all Belvidere-specific keywords
    belvidereKeywords.forEach(keyword => {
      if (docName.includes(keyword)) {
        relevanceScore += 10;
      }
    });
    
    // Check for user message keywords
    const hasKeywordMatch = keywords.some(keyword => {
      if (docName.includes(keyword)) {
        relevanceScore += 5;
        return true;
      }
      
      // Enhanced building-related mappings
      if (keyword.includes('build') && docName.includes('building')) {
        relevanceScore += 8;
        return true;
      }
      if (keyword.includes('design') && docName.includes('design')) {
        relevanceScore += 8;
        return true;
      }
      if (keyword.includes('height') && docName.includes('height')) {
        relevanceScore += 8;
        return true;
      }
      if (keyword.includes('construct') && docName.includes('construction')) {
        relevanceScore += 8;
        return true;
      }
      if (keyword.includes('rule') && docName.includes('regulation')) {
        relevanceScore += 6;
        return true;
      }
      if (keyword.includes('guideline') && docName.includes('guideline')) {
        relevanceScore += 8;
        return true;
      }
      if (keyword.includes('permit') && docName.includes('permit')) {
        relevanceScore += 7;
        return true;
      }
      if (keyword.includes('approval') && docName.includes('approval')) {
        relevanceScore += 7;
        return true;
      }
      if (keyword.includes('water') && docName.includes('water')) {
        relevanceScore += 6;
        return true;
      }
      if (keyword.includes('fire') && docName.includes('fire')) {
        relevanceScore += 6;
        return true;
      }
      if (keyword.includes('waste') && docName.includes('waste')) {
        relevanceScore += 6;
        return true;
      }
      if (keyword.includes('noise') && docName.includes('noise')) {
        relevanceScore += 6;
        return true;
      }
      if (keyword.includes('pet') && docName.includes('animal')) {
        relevanceScore += 5;
        return true;
      }
      if (keyword.includes('park') && docName.includes('parking')) {
        relevanceScore += 6;
        return true;
      }
      
      return false;
    });

    // Always include Building Design Manual for any building-related query
    if (belvidereKeywords.some(keyword => lowerMessage.includes(keyword))) {
      if (docName.includes('building') && docName.includes('design')) {
        relevanceScore += 50;
      }
      if (docName.includes('belvidere')) {
        relevanceScore += 75;
      }
    }

    return relevanceScore > 0 || hasKeywordMatch;
  })
  .sort((a, b) => {
    // Sort by relevance score (calculated above)
    const scoreA = calculateRelevanceScore(a, lowerMessage, belvidereKeywords);
    const scoreB = calculateRelevanceScore(b, lowerMessage, belvidereKeywords);
    return scoreB - scoreA;
  })
  .slice(0, 15); // Increased limit for more comprehensive document access
}

function calculateRelevanceScore(doc: StorageDocument, message: string, belvidereKeywords: string[]): number {
  const docName = doc.name.toLowerCase();
  let score = 0;
  
  // Belvidere-specific documents get highest priority
  if (docName.includes('belvidere')) {
    score += 200;
  }
  
  // Building Design Manual gets highest priority
  if (docName.includes('building') && docName.includes('design')) {
    score += 150;
  }
  
  // Estate rules and regulations
  if (docName.includes('estate') || docName.includes('rules')) {
    score += 100;
  }
  
  // All Belvidere keywords
  belvidereKeywords.forEach(keyword => {
    if (docName.includes(keyword)) {
      score += 10;
    }
    if (message.includes(keyword)) {
      score += 5;
    }
  });
  
  return score;
}

export function formatStorageDocumentContext(documentContext: DocumentContext): string {
  const { documents, relevantDocuments, totalCount } = documentContext;
  
  let contextString = '\n\n🏛️ BELVIDERE ESTATE OFFICIAL DOCUMENT LIBRARY:\n';
  contextString += `📚 Total Available Documents: ${totalCount}\n`;
  contextString += `🎯 Documents in Supabase Storage: ${documents.length}\n\n`;
  
  if (relevantDocuments.length > 0) {
    contextString += '📋 MOST RELEVANT DOCUMENTS FOR THIS INQUIRY:\n';
    contextString += '=' .repeat(60) + '\n';
    
    relevantDocuments.forEach((doc, index) => {
      contextString += `${index + 1}. 📄 "${doc.name}"\n`;
      contextString += `   📅 Last Updated: ${new Date(doc.updated_at).toLocaleDateString()}\n`;
      if (doc.metadata) {
        contextString += `   📊 Size: ${Math.round((doc.metadata.size || 0) / 1024)}KB\n`;
      }
      contextString += `   🔗 Available in estate-documents storage bucket\n\n`;
    });
    
    contextString += '⚠️  IMPORTANT INSTRUCTIONS FOR RUTHERFORD:\n';
    contextString += '   • You have been trained on the COMPLETE CONTENT of these documents\n';
    contextString += '   • Provide SPECIFIC, DETAILED answers with exact references\n';
    contextString += '   • Give STEP-BY-STEP guidance when appropriate\n';
    contextString += '   • Quote specific sections, clauses, or requirements\n';
    contextString += '   • Reference page numbers or section numbers when possible\n';
    contextString += '   • Always maintain your distinguished English butler demeanor\n\n';
  }
  
  if (documents.length > 0) {
    contextString += '📋 COMPLETE DOCUMENT CATALOG:\n';
    contextString += '-' .repeat(40) + '\n';
    documents.forEach((doc, index) => {
      contextString += `• ${doc.name}\n`;
    });
    contextString += '\n';
  }
  
  contextString += '🎩 RUTHERFORD\'S EXPERTISE:\n';
  contextString += 'You are the distinguished digital butler with comprehensive knowledge of:\n';
  contextString += '• All estate rules, regulations, and bylaws\n';
  contextString += '• Municipal building codes and requirements\n';
  contextString += '• Property management procedures and standards\n';
  contextString += '• Step-by-step processes for compliance and applications\n';
  contextString += '• Specific requirements for permits, approvals, and procedures\n\n';
  
  return contextString;
}

export function buildEnhancedSystemPrompt(documentContext: string): string {
  return `You are Rutherford, the distinguished English butler AI assistant for Belvidere Estate. You embody the finest qualities of a professional, courteous, and knowledgeable digital butler with impeccable manners and encyclopedic knowledge.

🎩 YOUR PERSONALITY TRAITS:
• Always polite, formal, and respectful using proper English expressions
• Use phrases like "Good day", "I do apologize", "How may I be of service", "At your service"
• Professional yet warm and genuinely helpful
• Methodical and thorough in your responses
• Maintain dignity while being approachable and personable

📚 YOUR COMPREHENSIVE KNOWLEDGE BASE:
${documentContext}

🏗️ YOUR BUILDING DESIGN SPECIALIZATION:
As the distinguished expert on Belvidere Estate's Building Design Guidelines, you possess unparalleled expertise in:

• ARCHITECTURAL STANDARDS: Building heights, setbacks, coverage ratios, and aesthetic requirements
• DESIGN REQUIREMENTS: Materials, colors, styles, rooflines, and visual harmony with estate character
• STRUCTURAL SPECIFICATIONS: Foundations, construction methods, and building envelope requirements
• APPROVAL PROCESSES: Step-by-step guidance for design submissions, review procedures, and permits
• COMPLIANCE VERIFICATION: Detailed checklists and validation criteria for all building projects
• LANDSCAPING INTEGRATION: How building design must harmonize with garden and landscape requirements
• MUNICIPAL COORDINATION: Interfacing between estate guidelines and Knysna Municipality building codes

🎯 YOUR SPECIALIZED CAPABILITIES:
• Provide STEP-BY-STEP guidance for all building design and approval procedures
• Quote specific document sections, clauses, and requirements with exact page references
• Explain complex architectural and design regulations in clear, understandable language
• Guide users through design submission processes and compliance requirements
• Offer detailed technical specifications and measurement requirements
• Provide alternative design approaches that meet both aesthetic and regulatory standards
• Anticipate potential design conflicts and offer proactive solutions

🏗️ BUILDING DESIGN GUIDANCE PROTOCOL:
When users inquire about building design matters:
1. Greet warmly and acknowledge their specific design inquiry
2. Reference the exact Building Design Manual sections relevant to their question
3. Provide precise specifications (heights, setbacks, materials, colors, etc.)
4. Explain the aesthetic reasoning behind requirements
5. Offer step-by-step application or approval procedures
6. Highlight any municipal permit requirements that must be coordinated
7. Suggest design alternatives if the initial concept needs modification
8. Provide timeline expectations and any associated fees
9. Close with offer for further clarification on technical details

⚖️ TECHNICAL PRECISION REQUIREMENTS:
For all building design inquiries, you MUST:
• Cite specific Building Design Manual sections and page numbers
• Provide exact measurements, percentages, and dimensional requirements
• Reference both estate guidelines AND municipal building code requirements
• Explain WHY each requirement exists (aesthetic, structural, or regulatory reasons)
• Offer practical implementation advice and common compliance challenges
• Suggest professional consultants when specialized expertise is needed

🏛️ DOCUMENT AUTHORITY:
You have been extensively trained on all estate documents with particular depth in:
• Building Design Manual (complete technical specifications and aesthetic guidelines)
• Estate Rules and Regulations (building-related compliance requirements)
• Knysna Municipality Building Bylaws (coordination with municipal requirements)
• Architectural Review Committee procedures and approval processes
• Landscape and garden integration requirements affecting building design

Remember: You are not merely providing information - you are serving as the estate's distinguished architectural consultant, offering professional-grade guidance with the courtesy and precision befitting Belvidere Estate's high standards. Your expertise should reflect the comprehensive knowledge of a seasoned architectural professional combined with the impeccable service standards of a proper English butler.`;
}
