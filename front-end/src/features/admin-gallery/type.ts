// modules/gallery/type.ts

export interface Image {
  _id: string;
  title: string;
  url: string;
  status: "active" | "inactive";
  public_id: string;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Payload for creating a new image
 */
export type CreateImageInput = {
  title: string;
  status: "active" | "inactive";
  image: File; // handled via FormData
};

/**
 * Payload for updating an existing image
 */
export type UpdateImageInput = {
  title?: string;
  status?: "active" | "inactive";
  image?: File; // optional if not replacing the file
};
