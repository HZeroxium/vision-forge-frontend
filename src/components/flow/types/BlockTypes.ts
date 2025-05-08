/**
 * Represents a block of content with an image, script, and prompt.
 */
export interface Block {
  /** Unique identifier for the block */
  id: string
  /** URL to the image */
  imageUrl: string
  /** Script text associated with the image */
  script: string
  /** Prompt used to generate the image */
  prompt: string
  /** Flag indicating if this is a custom uploaded image */
  isCustomImage?: boolean
}
