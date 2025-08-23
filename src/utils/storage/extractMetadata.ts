
/**
 * Extracts metadata from an image file
 */
export interface ImageMetadata {
  location?: {
    latitude: number;
    longitude: number;
  };
  timestamp?: Date;
  make?: string;
  model?: string;
  software?: string;
}

/**
 * Extracts EXIF data from image ArrayBuffer
 */
const extractEXIFData = (buffer: ArrayBuffer): ImageMetadata => {
  const dataView = new DataView(buffer);
  
  // Check for JPEG SOI marker
  if (dataView.getUint16(0) !== 0xFFD8) {
    console.log("Not a valid JPEG file");
    return {};
  }

  let offset = 2;
  let marker = dataView.getUint16(offset);
  
  // Look for APP1 marker (0xFFE1) which contains EXIF data
  while (offset < dataView.byteLength - 2) {
    if (marker === 0xFFE1) {
      // Found APP1 marker, check for EXIF header
      const segmentLength = dataView.getUint16(offset + 2);
      const exifHeader = new TextDecoder().decode(buffer.slice(offset + 4, offset + 10));
      
      if (exifHeader === 'Exif\0\0') {
        return parseEXIF(dataView, offset + 10);
      }
    }
    
    if (marker >= 0xFFE0 && marker <= 0xFFEF) {
      // Skip APP segments
      const segmentLength = dataView.getUint16(offset + 2);
      offset += 2 + segmentLength;
    } else {
      offset += 2;
    }
    
    if (offset < dataView.byteLength - 2) {
      marker = dataView.getUint16(offset);
    }
  }
  
  return {};
};

/**
 * Parse EXIF data from TIFF structure
 */
const parseEXIF = (dataView: DataView, offset: number): ImageMetadata => {
  try {
    // Read TIFF header
    const byteOrder = dataView.getUint16(offset);
    const littleEndian = byteOrder === 0x4949;
    
    // Read first IFD offset
    const ifdOffset = littleEndian 
      ? dataView.getUint32(offset + 4, true)
      : dataView.getUint32(offset + 4, false);
    
    return parseIFD(dataView, offset + ifdOffset, littleEndian, offset);
  } catch (error) {
    console.error("Error parsing EXIF data:", error);
    return {};
  }
};

/**
 * Parse Image File Directory (IFD)
 */
const parseIFD = (dataView: DataView, ifdOffset: number, littleEndian: boolean, tiffOffset: number): ImageMetadata => {
  const metadata: ImageMetadata = {};
  
  try {
    const entryCount = littleEndian 
      ? dataView.getUint16(ifdOffset, true)
      : dataView.getUint16(ifdOffset, false);
    
    let gpsIfdOffset = 0;
    
    // Parse directory entries
    for (let i = 0; i < entryCount; i++) {
      const entryOffset = ifdOffset + 2 + (i * 12);
      
      const tag = littleEndian 
        ? dataView.getUint16(entryOffset, true)
        : dataView.getUint16(entryOffset, false);
      
      const type = littleEndian 
        ? dataView.getUint16(entryOffset + 2, true)
        : dataView.getUint16(entryOffset + 2, false);
      
      const count = littleEndian 
        ? dataView.getUint32(entryOffset + 4, true)
        : dataView.getUint32(entryOffset + 4, false);
      
      const value = littleEndian 
        ? dataView.getUint32(entryOffset + 8, true)
        : dataView.getUint32(entryOffset + 8, false);
      
      // GPS Info IFD tag
      if (tag === 0x8825) {
        gpsIfdOffset = value;
      }
      
      // DateTime tag
      if (tag === 0x0132 && type === 2) { // ASCII string
        try {
          const dateString = readString(dataView, tiffOffset + value, count - 1);
          metadata.timestamp = new Date(dateString.replace(/:/g, '-').replace(' ', 'T'));
        } catch (e) {
          console.warn("Error parsing date:", e);
        }
      }
      
      // Make tag
      if (tag === 0x010F && type === 2) {
        try {
          metadata.make = readString(dataView, tiffOffset + value, count - 1);
        } catch (e) {
          console.warn("Error parsing make:", e);
        }
      }
      
      // Model tag
      if (tag === 0x0110 && type === 2) {
        try {
          metadata.model = readString(dataView, tiffOffset + value, count - 1);
        } catch (e) {
          console.warn("Error parsing model:", e);
        }
      }
    }
    
    // Parse GPS data if GPS IFD exists
    if (gpsIfdOffset > 0) {
      const gpsData = parseGPSIFD(dataView, tiffOffset + gpsIfdOffset, littleEndian, tiffOffset);
      if (gpsData.latitude !== undefined && gpsData.longitude !== undefined) {
        metadata.location = {
          latitude: gpsData.latitude,
          longitude: gpsData.longitude
        };
      }
    }
  } catch (error) {
    console.error("Error parsing IFD:", error);
  }
  
  return metadata;
};

/**
 * Parse GPS IFD for location data
 */
const parseGPSIFD = (dataView: DataView, gpsIfdOffset: number, littleEndian: boolean, tiffOffset: number) => {
  let latitude: number | undefined;
  let longitude: number | undefined;
  let latRef = '';
  let lonRef = '';
  
  try {
    const entryCount = littleEndian 
      ? dataView.getUint16(gpsIfdOffset, true)
      : dataView.getUint16(gpsIfdOffset, false);
    
    for (let i = 0; i < entryCount; i++) {
      const entryOffset = gpsIfdOffset + 2 + (i * 12);
      
      const tag = littleEndian 
        ? dataView.getUint16(entryOffset, true)
        : dataView.getUint16(entryOffset, false);
      
      const type = littleEndian 
        ? dataView.getUint16(entryOffset + 2, true)
        : dataView.getUint16(entryOffset + 2, false);
      
      const count = littleEndian 
        ? dataView.getUint32(entryOffset + 4, true)
        : dataView.getUint32(entryOffset + 4, false);
      
      const value = littleEndian 
        ? dataView.getUint32(entryOffset + 8, true)
        : dataView.getUint32(entryOffset + 8, false);
      
      switch (tag) {
        case 1: // GPSLatitudeRef
          latRef = String.fromCharCode(dataView.getUint8(entryOffset + 8));
          break;
        case 2: // GPSLatitude
          if (type === 5 && count === 3) { // Rational array
            latitude = parseGPSCoordinate(dataView, tiffOffset + value, littleEndian);
          }
          break;
        case 3: // GPSLongitudeRef
          lonRef = String.fromCharCode(dataView.getUint8(entryOffset + 8));
          break;
        case 4: // GPSLongitude
          if (type === 5 && count === 3) { // Rational array
            longitude = parseGPSCoordinate(dataView, tiffOffset + value, littleEndian);
          }
          break;
      }
    }
    
    // Apply hemisphere corrections
    if (latitude !== undefined && latRef === 'S') {
      latitude = -latitude;
    }
    if (longitude !== undefined && lonRef === 'W') {
      longitude = -longitude;
    }
  } catch (error) {
    console.error("Error parsing GPS IFD:", error);
  }
  
  return { latitude, longitude };
};

/**
 * Parse GPS coordinate from rational values (degrees, minutes, seconds)
 */
const parseGPSCoordinate = (dataView: DataView, offset: number, littleEndian: boolean): number => {
  // Read three rational values: degrees, minutes, seconds
  const degrees = readRational(dataView, offset, littleEndian);
  const minutes = readRational(dataView, offset + 8, littleEndian);
  const seconds = readRational(dataView, offset + 16, littleEndian);
  
  return degrees + (minutes / 60) + (seconds / 3600);
};

/**
 * Read a rational number (fraction) from EXIF data
 */
const readRational = (dataView: DataView, offset: number, littleEndian: boolean): number => {
  const numerator = littleEndian 
    ? dataView.getUint32(offset, true)
    : dataView.getUint32(offset, false);
  
  const denominator = littleEndian 
    ? dataView.getUint32(offset + 4, true)
    : dataView.getUint32(offset + 4, false);
  
  return denominator !== 0 ? numerator / denominator : 0;
};

/**
 * Read ASCII string from data
 */
const readString = (dataView: DataView, offset: number, length: number): string => {
  const bytes = new Uint8Array(dataView.buffer, offset, length);
  return new TextDecoder().decode(bytes);
};

export const extractImageMetadata = async (file: File | Blob): Promise<ImageMetadata> => {
  return new Promise((resolve) => {
    try {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const arrayBuffer = e.target?.result as ArrayBuffer;
          if (!arrayBuffer) {
            console.log("No array buffer available");
            resolve({});
            return;
          }
          
          console.log("Extracting EXIF data from image...");
          const metadata = extractEXIFData(arrayBuffer);
          
          // If no GPS data found, generate mock location around Belvidere Estate
          if (!metadata.location?.latitude || !metadata.location?.longitude) {
            console.log("No GPS data found in image, using mock location");
            const mockMetadata: ImageMetadata = {
              ...metadata,
              location: {
                latitude: -34.0687 + (Math.random() - 0.5) * 0.01,
                longitude: 23.0473 + (Math.random() - 0.5) * 0.01
              },
              timestamp: metadata.timestamp || new Date()
            };
            resolve(mockMetadata);
          } else {
            console.log("Found GPS coordinates:", metadata.location);
            resolve(metadata);
          }
        } catch (error) {
          console.error("Error extracting metadata:", error);
          resolve({});
        }
      };
      
      reader.onerror = () => {
        console.error("Error reading file");
        resolve({});
      };
      
      reader.readAsArrayBuffer(file);
    } catch (error) {
      console.error("Error reading file:", error);
      resolve({});
    }
  });
};

/**
 * Combine image URL with its metadata
 */
export interface ImageWithMetadata {
  url: string;
  metadata?: ImageMetadata;
}

/**
 * Cache for storing metadata by image URL
 */
export const metadataCache: Record<string, ImageMetadata> = {};

/**
 * Store metadata for an image URL
 */
export const storeImageMetadata = (imageUrl: string, metadata: ImageMetadata): void => {
  metadataCache[imageUrl] = metadata;
  console.log(`Stored metadata for ${imageUrl}:`, metadata);
};

/**
 * Get metadata for an image URL
 */
export const getImageMetadata = (imageUrl: string): ImageMetadata | undefined => {
  // If we don't have metadata cached, generate some mock data for demo
  if (!metadataCache[imageUrl]) {
    const mockMetadata: ImageMetadata = {
      location: {
        latitude: -34.0687 + (Math.random() - 0.5) * 0.01,
        longitude: 23.0473 + (Math.random() - 0.5) * 0.01
      },
      timestamp: new Date(),
      make: "Camera",
      model: "Smartphone"
    };
    metadataCache[imageUrl] = mockMetadata;
    console.log(`Generated mock metadata for ${imageUrl}:`, mockMetadata);
  }
  
  return metadataCache[imageUrl];
};
