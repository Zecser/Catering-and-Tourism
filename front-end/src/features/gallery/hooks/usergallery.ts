import axios from "axios";
import { baseURL } from "../../../lib/api"; // your base API URL

export interface Image {
  _id: string;
  title: string;
  url: string;
  status:"active" | "inactive";
}

export const fetchGallery = async (): Promise<Image[]> => {
  try {
    const res = await axios.get(`${baseURL}/gallery`);

  if (Array.isArray(res.data.images)) {
      return res.data.images;
    }
    console.log(res.data)
    console.warn("API did not return an array:", res.data);
    return []; // fallback
  } catch (error) {
    console.error("Failed to fetch gallery:", error);
    return []; // fallback on error
  }
};
