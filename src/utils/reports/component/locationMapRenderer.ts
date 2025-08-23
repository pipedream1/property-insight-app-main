
import { getImageMetadata } from '../../storage/extractMetadata';
import { generateColorVars } from '../styles/commonStyles';

/**
 * Generates HTML for a location map based on photo metadata
 */
export function generateLocationMap(photoUrl: string): string {
  const metadata = getImageMetadata(photoUrl);
  const colors = generateColorVars();
  
  if (!metadata?.location?.latitude || !metadata?.location?.longitude) {
    return '';
  }
  
  const { latitude, longitude } = metadata.location;
  
  return `
    <div class="location-info">
      <h6>Location Information</h6>
      <div class="location-map">
        <a href="https://maps.google.com/?q=${latitude},${longitude}" target="_blank" class="map-link">
          <img 
            src="https://maps.googleapis.com/maps/api/staticmap?center=${latitude},${longitude}&zoom=14&size=300x150&markers=color:red%7C${latitude},${longitude}&key=AIzaSyBVvrihOwwJTWfMr7PSGTUyr-wl733ZZHY" 
            alt="Location map" 
            class="static-map"
          />
          <span class="map-caption">View on Google Maps</span>
        </a>
      </div>
      
      <style>
        .location-info {
          margin-top: 10px;
          padding: 10px;
          background-color: ${colors.bgMuted};
          border-radius: 6px;
        }
        
        h6 {
          margin: 0 0 5px 0;
          font-size: 14px;
          color: ${colors.text};
          font-weight: 500;
        }
        
        .location-map {
          border-radius: 6px;
          overflow: hidden;
        }
        
        .map-link {
          display: block;
          color: ${colors.primary};
          text-decoration: none;
          transition: opacity 0.2s ease;
        }
        
        .map-link:hover {
          opacity: 0.9;
        }
        
        .static-map {
          width: 100%;
          border-radius: 4px;
          border: 1px solid ${colors.border};
        }
        
        .map-caption {
          display: block;
          text-align: center;
          padding: 5px;
          font-size: 12px;
          color: ${colors.primary};
        }
      </style>
    </div>
  `;
}
