
import { generateChartStyles } from './styles/chartStyles';
import { generateCommonStyles } from './styles/commonStyles';
import { generateConditionBadgeStyles } from './styles/component/conditionBadgeStyles';
import { generateComponentDetailStyles } from './styles/component/detailStyles';
import { generateComponentListStyles } from './styles/component/listStyles';
import { generateMaintenanceTasksStyles } from './styles/component/maintenanceTasksStyles';
import { generatePhotoStyles } from './styles/component/photoStyles';
import { generateComponentStatusStyles } from './styles/component/statusStyles';
import { generateComponentReportStyles } from './styles/componentReportStyles';
import { generateHistoricalComparisonStyles } from './styles/water/historicalComparisonStyles';
import { generateMonthlyComparisonStyles } from './styles/water/monthlyComparisonStyles';
import { generateReportLabelStyles } from './styles/water/reportLabelStyles';
import { generateUsageBreakdownStyles } from './styles/water/usageBreakdownStyles';
import { generateWaterReportStyles } from './styles/waterReportStyles';

/**
 * Combines all style generators to create complete CSS for reports
 */
export function generateReportStyles(): string {
  return `
    ${generateCommonStyles()}
    ${generateChartStyles()}
    
    /* Water Report Specific Styles */
    ${generateWaterReportStyles()}
    ${generateUsageBreakdownStyles()}
    ${generateMonthlyComparisonStyles()}
    ${generateHistoricalComparisonStyles()}
    ${generateReportLabelStyles()}
    
    /* Component Report Specific Styles */
    ${generateComponentReportStyles()}
    ${generateComponentListStyles()}
    ${generateComponentDetailStyles()}
    ${generateConditionBadgeStyles()}
    ${generateMaintenanceTasksStyles()}
    ${generateComponentStatusStyles()}
    ${generatePhotoStyles()}
  `;
}
