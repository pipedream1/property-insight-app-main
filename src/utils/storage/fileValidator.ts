
/**
 * Validates an image file before upload
 * @param file The file to validate
 */
export const validateImageFile = (file: Blob): void => {
  // Verify file is an image
  if (!file.type.startsWith('image/')) {
    throw new Error('Selected file is not an image');
  }
  
  // Check file size (max 10MB)
  if (file.size > 10 * 1024 * 1024) {
    throw new Error('Image is too large (max 10MB)');
  }
};

/**
 * Creates a readable stream from a file blob
 * @param file The file blob to convert to a stream
 * @returns A promise that resolves to a new blob from the stream
 */
export const createStreamFromFile = async (file: Blob): Promise<Blob> => {
  // Create a ReadableStream from the file to track upload progress
  const fileStream = new ReadableStream({
    start(controller) {
      const reader = file.stream().getReader();
      
      function push() {
        reader.read().then(({ done, value }) => {
          if (done) {
            controller.close();
            return;
          }
          controller.enqueue(value);
          push();
        });
      }
      
      push();
    }
  });
  
  // Convert the stream back to a blob for upload
  const response = new Response(fileStream);
  return await response.blob();
};
