
import { generateMonthlyComparisonStyles } from './water/monthlyComparisonStyles';
import { generateHistoricalComparisonStyles } from './water/historicalComparisonStyles';
import { generateUsageBreakdownStyles } from './water/usageBreakdownStyles';
import { generateReportLabelStyles } from './water/reportLabelStyles';

/**
 * Generates CSS styles specific to water reports by combining
 * all water-related style modules
 */
export const generateWaterReportStyles = (): string => {
  return `
    ${generateReportLabelStyles()}
    ${generateMonthlyComparisonStyles()}
    ${generateHistoricalComparisonStyles()}
    ${generateUsageBreakdownStyles()}
  `;
};
