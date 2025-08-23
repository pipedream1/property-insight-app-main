
import { ComponentReportData } from '../types';
import { generateColorVars } from '../styles/commonStyles';

/**
 * Generates HTML for the status statistics section
 */
export function renderStatsSection(data: ComponentReportData): string {
  const colors = generateColorVars();
  
  return `
    <div class="stats-section">
      <h3>Component Status Overview</h3>
      <div class="stats-container">
        <div class="stat-card good">
          <div class="stat-icon">✓</div>
          <h3>Good Condition</h3>
          <p class="stat-value">${data.status.good}</p>
        </div>
        <div class="stat-card fair">
          <div class="stat-icon">⚠️</div>
          <h3>Fair Condition</h3>
          <p class="stat-value">${data.status.fair}</p>
        </div>
        <div class="stat-card needs-attention">
          <div class="stat-icon">⚡</div>
          <h3>Needs Attention</h3>
          <p class="stat-value">${data.status.needsAttention}</p>
        </div>
      </div>
      
      <style>
        .stats-section {
          margin: 25px 0;
        }
        
        .stats-container {
          display: flex;
          gap: 20px;
          margin-top: 15px;
        }
        
        .stat-card {
          flex: 1;
          padding: 20px;
          border-radius: 8px;
          text-align: center;
          box-shadow: ${colors.cardShadow};
          transition: transform 0.2s ease;
        }
        
        .stat-card:hover {
          transform: translateY(-3px);
        }
        
        .stat-card h3 {
          margin-top: 10px;
          font-size: 16px;
          margin-bottom: 5px;
        }
        
        .stat-icon {
          font-size: 24px;
          margin-bottom: 10px;
        }
        
        .stat-value {
          font-size: 32px;
          font-weight: 600;
          margin: 10px 0 0;
        }
        
        .stat-card.good {
          background-color: ${colors.statusGood};
          color: ${colors.statusGoodText};
        }
        
        .stat-card.fair {
          background-color: ${colors.statusFair};
          color: ${colors.statusFairText};
        }
        
        .stat-card.needs-attention {
          background-color: ${colors.statusAttention};
          color: ${colors.statusAttentionText};
        }
        
        @media (max-width: 768px) {
          .stats-container {
            flex-direction: column;
          }
          
          .stat-card {
            margin-bottom: 15px;
          }
        }
      </style>
    </div>
  `;
}

