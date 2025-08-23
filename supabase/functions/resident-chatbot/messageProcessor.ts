
import { fetchRelevantData as fetchDatabaseData, formatDataForAI as formatDatabaseData } from './dataHelpers.ts';
import { fetchStorageDocuments, formatStorageDocumentContext, buildEnhancedSystemPrompt } from './storageDocumentProcessor.ts';

interface CombinedDataContext {
  databaseData: any;
  documentData: any;
  storageDocuments: any;
}

export async function fetchRelevantData(message: string, documentOnly: boolean = false): Promise<CombinedDataContext> {
  console.log('🔍 Fetching comprehensive data for message:', message);
  
  try {
    // Fetch data from multiple sources in parallel (excluding mock documents)
    const [databaseData, storageDocuments] = await Promise.all([
      documentOnly ? Promise.resolve(null) : fetchDatabaseData(message),
      fetchStorageDocuments(message)
    ]);

    console.log('📊 Data fetch results:');
    console.log('- Database data available:', !!databaseData);
    console.log('- Mock documents: DISABLED (focusing on real documents)');
    console.log('- Storage documents:', storageDocuments.totalCount);

    return {
      databaseData,
      documentData: null, // No more mock documents
      storageDocuments
    };
  } catch (error) {
    console.error('❌ Error fetching comprehensive data:', error);
    return {
      databaseData: null,
      documentData: null,
      storageDocuments: { documents: [], relevantDocuments: [], totalCount: 0 }
    };
  }
}

export function formatDataForAI(combinedData: CombinedDataContext): string {
  let formattedData = '';

  // Add storage documents (highest priority - real documents only)
  if (combinedData.storageDocuments) {
    formattedData += formatStorageDocumentContext(combinedData.storageDocuments);
  }

  // Mock documents removed - focusing on real documents only

  // Add database data if not document-only mode
  if (combinedData.databaseData) {
    formattedData += '\n\n' + formatDatabaseData(combinedData.databaseData);
  }

  return formattedData;
}

export function buildSystemPrompt(dataContext: string, documentOnly: boolean = false): string {
  if (documentOnly) {
    return buildEnhancedSystemPrompt(dataContext);
  }

  // For full access mode, combine enhanced prompt with database access
  const enhancedPrompt = buildEnhancedSystemPrompt(dataContext);
  
  return `${enhancedPrompt}

🏠 ADDITIONAL PROPERTY DATA ACCESS:
You also have access to live property management data including:
• Water readings and usage patterns
• Maintenance tasks and component inspections
• Property component conditions and history
• Reports and analytics data

When users ask about property-specific data, maintenance, or water usage, you can provide detailed insights from this live data while maintaining your distinguished butler persona.`;
}
