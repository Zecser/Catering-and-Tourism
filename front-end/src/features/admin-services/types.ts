export interface Service {
  _id: string;
  title: string;
  heading?: string;
  description?: string;
  image?: {
    url: string;
    public_id: string;
  };
}
