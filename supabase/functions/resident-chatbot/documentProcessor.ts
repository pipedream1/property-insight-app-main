interface DocumentContext {
  documents: any[];
  relevantDocuments: any[];
}

interface OfficialDocument {
  id: string;
  title: string;
  description: string;
  file_url: string;
  file_type: string;
  upload_date: string;
  tags: string[];
  file_size: number;
}

const mockDocuments: OfficialDocument[] = [
  {
    id: '0',
    title: 'Building Design Manual Revised 2024',
    description: 'Comprehensive building design guidelines and architectural standards for Belvidere Estate construction and renovations.',
    file_url: 'https://belvidereestate.co.za/wp-content/uploads/2024/12/Building-Design-Manual-Revised-2024.pdf',
    file_type: 'pdf',
    upload_date: new Date().toISOString(),
    tags: ['Building', 'Design', 'Manual', 'Architecture', '2024'],
    file_size: 5242880
  },
  {
    id: '1',
    title: 'Estate Rules and Regulations',
    description: 'Comprehensive guide to estate living rules, policies, and community guidelines.',
    file_url: '/documents/estate-rules.pdf',
    file_type: 'pdf',
    upload_date: new Date().toISOString(),
    tags: ['Rules', 'Regulations', 'Community'],
    file_size: 2048576
  },
  {
    id: '2',
    title: 'Maintenance Fee Schedule',
    description: 'Annual maintenance fee structure and payment schedule for residents.',
    file_url: '/documents/maintenance-fees.pdf',
    file_type: 'pdf',
    upload_date: new Date().toISOString(),
    tags: ['Fees', 'Maintenance', 'Finance'],
    file_size: 1024000
  },
  {
    id: '3',
    title: 'Air Quality Management By-law',
    description: 'Official PDF document from Knysna Municipality regarding air quality management regulations.',
    file_url: 'https://www.knysna.gov.za/wp-content/uploads/2019/03/Air-Quality-Management-By-law.pdf',
    file_type: 'pdf',
    upload_date: new Date().toISOString(),
    tags: ['Air Quality', 'Management', 'Bylaws', 'Municipality'],
    file_size: 1500000
  },
  {
    id: '4',
    title: 'Building Regulations By-law',
    description: 'Official PDF document from Knysna Municipality covering building regulations and requirements.',
    file_url: 'https://www.knysna.gov.za/wp-content/uploads/2019/03/Building-Regulations-By-law.pdf',
    file_type: 'pdf',
    upload_date: new Date().toISOString(),
    tags: ['Building', 'Regulations', 'Bylaws', 'Municipality'],
    file_size: 2100000
  },
  {
    id: '5',
    title: 'Cemetery By-law',
    description: 'Official PDF document from Knysna Municipality regarding cemetery regulations and procedures.',
    file_url: 'https://www.knysna.gov.za/wp-content/uploads/2019/03/Cemetery-By-law.pdf',
    file_type: 'pdf',
    upload_date: new Date().toISOString(),
    tags: ['Cemetery', 'Bylaws', 'Municipality'],
    file_size: 800000
  },
  {
    id: '6',
    title: 'Coastal Management By-law',
    description: 'Official PDF document from Knysna Municipality covering coastal area management and protection.',
    file_url: 'https://www.knysna.gov.za/wp-content/uploads/2019/03/Coastal-Management-By-law.pdf',
    file_type: 'pdf',
    upload_date: new Date().toISOString(),
    tags: ['Coastal', 'Management', 'Bylaws', 'Municipality'],
    file_size: 1800000
  },
  {
    id: '7',
    title: 'Credit Control and Debt Collection By-law',
    description: 'Official PDF document from Knysna Municipality regarding credit control and debt collection procedures.',
    file_url: 'https://www.knysna.gov.za/wp-content/uploads/2019/03/Credit-Control-and-Debt-Collection-By-law.pdf',
    file_type: 'pdf',
    upload_date: new Date().toISOString(),
    tags: ['Credit Control', 'Debt Collection', 'Bylaws', 'Municipality'],
    file_size: 1200000
  },
  {
    id: '8',
    title: 'Customer Care Management and Credit Control By-law',
    description: 'Official PDF document from Knysna Municipality covering customer service and credit management.',
    file_url: 'https://www.knysna.gov.za/wp-content/uploads/2019/03/Customer-Care-Management-and-Credit-Control-By-law.pdf',
    file_type: 'pdf',
    upload_date: new Date().toISOString(),
    tags: ['Customer Care', 'Credit Control', 'Bylaws', 'Municipality'],
    file_size: 1400000
  },
  {
    id: '9',
    title: 'Environmental Health By-law',
    description: 'Official PDF document from Knysna Municipality regarding environmental health regulations and standards.',
    file_url: 'https://www.knysna.gov.za/wp-content/uploads/2019/03/Environmental-Health-By-law.pdf',
    file_type: 'pdf',
    upload_date: new Date().toISOString(),
    tags: ['Environmental Health', 'Bylaws', 'Municipality'],
    file_size: 1900000
  },
  {
    id: '10',
    title: 'Fire Safety By-law',
    description: 'Official PDF document from Knysna Municipality covering fire safety regulations and requirements.',
    file_url: 'https://www.knysna.gov.za/wp-content/uploads/2019/03/Fire-Safety-By-law.pdf',
    file_type: 'pdf',
    upload_date: new Date().toISOString(),
    tags: ['Fire Safety', 'Bylaws', 'Municipality'],
    file_size: 1300000
  },
  {
    id: '11',
    title: 'Informal Trading By-law',
    description: 'Official PDF document from Knysna Municipality regarding informal trading regulations and permits.',
    file_url: 'https://www.knysna.gov.za/wp-content/uploads/2019/03/Informal-Trading-By-law.pdf',
    file_type: 'pdf',
    upload_date: new Date().toISOString(),
    tags: ['Informal Trading', 'Bylaws', 'Municipality'],
    file_size: 1000000
  },
  {
    id: '12',
    title: 'Integrated Waste Management By-law',
    description: 'Official PDF document from Knysna Municipality covering waste management and recycling regulations.',
    file_url: 'https://www.knysna.gov.za/wp-content/uploads/2019/03/Integrated-Waste-Management-By-law.pdf',
    file_type: 'pdf',
    upload_date: new Date().toISOString(),
    tags: ['Waste Management', 'Bylaws', 'Municipality'],
    file_size: 2200000
  },
  {
    id: '13',
    title: 'Liquor Trading By-law',
    description: 'Official PDF document from Knysna Municipality regarding liquor trading licenses and regulations.',
    file_url: 'https://www.knysna.gov.za/wp-content/uploads/2019/03/Liquor-Trading-By-law.pdf',
    file_type: 'pdf',
    upload_date: new Date().toISOString(),
    tags: ['Liquor Trading', 'Bylaws', 'Municipality'],
    file_size: 900000
  },
  {
    id: '14',
    title: 'Municipal Land Use Planning By-law',
    description: 'Official PDF document from Knysna Municipality covering land use planning and zoning regulations.',
    file_url: 'https://www.knysna.gov.za/wp-content/uploads/2019/03/Municipal-Land-Use-Planning-By-law.pdf',
    file_type: 'pdf',
    upload_date: new Date().toISOString(),
    tags: ['Land Use Planning', 'Zoning', 'Bylaws', 'Municipality'],
    file_size: 2500000
  },
  {
    id: '15',
    title: 'Noise Control By-law',
    description: 'Official PDF document from Knysna Municipality regarding noise control and sound pollution regulations.',
    file_url: 'https://www.knysna.gov.za/wp-content/uploads/2019/03/Noise-Control-By-law.pdf',
    file_type: 'pdf',
    upload_date: new Date().toISOString(),
    tags: ['Noise Control', 'Bylaws', 'Municipality'],
    file_size: 700000
  },
  {
    id: '16',
    title: 'Outdoor Advertising and Signage By-law',
    description: 'Official PDF document from Knysna Municipality covering outdoor advertising and signage regulations.',
    file_url: 'https://www.knysna.gov.za/wp-content/uploads/2019/03/Outdoor-Advertising-and-Signage-By-law.pdf',
    file_type: 'pdf',
    upload_date: new Date().toISOString(),
    tags: ['Outdoor Advertising', 'Signage', 'Bylaws', 'Municipality'],
    file_size: 1100000
  },
  {
    id: '17',
    title: 'Parking Meter By-law',
    description: 'Official PDF document from Knysna Municipality regarding parking meter regulations and enforcement.',
    file_url: 'https://www.knysna.gov.za/wp-content/uploads/2019/03/Parking-Meter-By-law.pdf',
    file_type: 'pdf',
    upload_date: new Date().toISOString(),
    tags: ['Parking', 'Meters', 'Bylaws', 'Municipality'],
    file_size: 600000
  },
  {
    id: '18',
    title: 'Public Open Spaces By-law',
    description: 'Official PDF document from Knysna Municipality covering public open spaces management and usage.',
    file_url: 'https://www.knysna.gov.za/wp-content/uploads/2019/03/Public-Open-Spaces-By-law.pdf',
    file_type: 'pdf',
    upload_date: new Date().toISOString(),
    tags: ['Public Spaces', 'Bylaws', 'Municipality'],
    file_size: 1600000
  },
  {
    id: '19',
    title: 'Roads and Public Places By-law',
    description: 'Official PDF document from Knysna Municipality regarding roads and public places regulations.',
    file_url: 'https://www.knysna.gov.za/wp-content/uploads/2019/03/Roads-and-Public-Places-By-law.pdf',
    file_type: 'pdf',
    upload_date: new Date().toISOString(),
    tags: ['Roads', 'Public Places', 'Bylaws', 'Municipality'],
    file_size: 2000000
  },
  {
    id: '20',
    title: 'Water Services By-law',
    description: 'Official PDF document from Knysna Municipality covering water services regulations and requirements.',
    file_url: 'https://www.knysna.gov.za/wp-content/uploads/2019/03/Water-Services-By-law.pdf',
    file_type: 'pdf',
    upload_date: new Date().toISOString(),
    tags: ['Water Services', 'Bylaws', 'Municipality'],
    file_size: 1700000
  }
];

export async function fetchDocumentContext(message: string): Promise<DocumentContext> {
  const lowerMessage = message.toLowerCase();
  console.log('Fetching document context for:', message);
  
  const documents = mockDocuments;

  // Extract meaningful words from the user's message
  const messageWords = lowerMessage
    .replace(/[^\p{L}\p{N}\s]/gu, '') // Keep letters and numbers
    .split(/\s+/)
    .filter(word => word.length > 2); // Reduced from 3 to 2 for better matching

  console.log('Message words extracted:', messageWords);

  // Find documents where the title, description, or tags contain words from the message
  const relevantDocuments = documents.filter(doc => {
    const searchText = `${doc.title} ${doc.description} ${doc.tags.join(' ')}`.toLowerCase();
    
    const hasMatch = messageWords.some(word => {
      // Also check for partial matches and common variations
      return searchText.includes(word) || 
             searchText.includes(word + 's') || // plural
             searchText.includes(word.slice(0, -1)) || // remove last character
             word.includes('build') && searchText.includes('building') ||
             word.includes('rule') && searchText.includes('regulation') ||
             word.includes('pet') && searchText.includes('animal') ||
             word.includes('solar') && searchText.includes('energy');
    });
    
    if (hasMatch) {
      console.log('Found relevant document:', doc.title);
    }
    
    return hasMatch;
  });
  
  console.log('Relevant documents found:', relevantDocuments.length);
  
  // If no specific documents are found but this is clearly a document query,
  // provide the most commonly referenced documents
  if (relevantDocuments.length === 0) {
    console.log('No specific matches, providing general estate documents');
    const generalDocuments = documents.filter(doc => 
      doc.title.includes('Estate Rules') || 
      doc.title.includes('Building Design') ||
      doc.title.includes('Building Regulations') ||
      doc.title.includes('Maintenance Fee')
    );
    
    return {
      documents,
      relevantDocuments: generalDocuments.length > 0 ? generalDocuments : documents.slice(0, 5)
    };
  }
  
  return {
    documents,
    relevantDocuments
  };
}

export function formatDocumentContext(documentContext: DocumentContext): string {
  const { documents, relevantDocuments } = documentContext;
  
  let contextString = '\n\nOFFICIAL DOCUMENTS LIBRARY:\n';
  contextString += `Total Available Documents: ${documents.length}\n\n`;
  
  if (relevantDocuments.length > 0) {
    contextString += 'MOST RELEVANT DOCUMENTS FOR THIS QUERY:\n';
    relevantDocuments.forEach((doc, index) => {
      contextString += `${index + 1}. "${doc.title}"\n`;
      contextString += `   Description: ${doc.description}\n`;
      contextString += `   Type: ${doc.file_type.toUpperCase()}\n`;
      contextString += `   Tags: ${doc.tags.join(', ')}\n`;
      contextString += `   URL: ${doc.file_url}\n\n`;
    });
    
    contextString += '\nIMPORTANT: You have been trained on the content of these documents. ';
    contextString += 'Please provide specific, detailed answers based on the actual content within these documents. ';
    contextString += 'Reference specific sections, requirements, or procedures mentioned in the documents.\n\n';
  }
  
  contextString += 'COMPLETE DOCUMENT CATALOG:\n';
  documents.forEach((doc, index) => {
    contextString += `• ${doc.title} - ${doc.description}\n`;
  });
  
  contextString += '\n\nNOTE: You are an expert on all these documents and can answer detailed questions about their content.';
  
  return contextString;
}

export function buildDocumentAnalysisPrompt(dataContext: string, documentOnly: boolean = false): string {
  const butlerPersonality = `You are Rutherford, a distinguished English butler AI assistant specialized in official estate documentation and municipal regulations. You embody the qualities of a professional, courteous, and knowledgeable butler with impeccable manners and attention to detail.

Your personality traits:
- Always polite, formal, and respectful  
- Use proper English expressions like "Good day", "I do apologize", "How may I be of service", "At your service"
- Professional yet warm and helpful
- Methodical and thorough in responses
- Maintain dignity while being approachable`;

  if (documentOnly) {
    return `${butlerPersonality}

You have EXCLUSIVE access to the official documents library for Belvidere Estate and may ONLY provide information from these official sources:

${dataContext}

IMPORTANT RESTRICTIONS:
- You may ONLY answer questions about estate rules, building codes, municipal bylaws, and official regulations
- You do NOT have access to property data, water readings, maintenance records, or reports  
- If asked about anything outside of official documents, politely redirect: "I do apologize, but I can only assist with questions about our official estate documents and municipal regulations. For property-specific data, please contact the management office."

Your responses should:
- Be professional and butler-like in tone
- Reference specific documents when possible
- Provide accurate information based solely on the official documents
- Suggest contacting management for non-document related queries`;
  }

  return `${butlerPersonality}

You are the comprehensive property management assistant for Belvidere Estate with access to both official documents AND property management data.

${dataContext}

Your expertise includes:
- Official estate documents and municipal regulations
- Property management and maintenance guidance
- Water usage analysis and reporting
- Component inspections and monitoring
- Compliance with estate and municipal standards

Always maintain your distinguished butler demeanor while providing thorough, accurate assistance based on the available official documents and property data.`;
}
