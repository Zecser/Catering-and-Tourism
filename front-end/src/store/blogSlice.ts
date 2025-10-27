import { createSlice,type  PayloadAction } from "@reduxjs/toolkit";

interface Image {
  url: string;
  public_id: string;
  _id: string;
}

export interface BlogItem {
  _id: string;
  title: string;
  description: string;
  category?: string
  images: Image[];
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

interface PageData {
  data: BlogItem[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface BlogState {
  pages: Record<number, BlogItem[]>; 
  pageMeta: Record<
    number,
    {
      limit: number;
      total: number;
      totalPages: number;
    }
  >;
  isLoading: boolean;
  error: string | null;
}

const initialState: BlogState = {
  pages: {},
  pageMeta: {},
  isLoading: false,
  error: null,
};

const blogSlice = createSlice({
  name: "blogs",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    savePageData: (state, action: PayloadAction<PageData>) => {
      const { data, page, limit, total, totalPages } = action.payload;

      state.pages[page] = data;

      state.pageMeta[page] = { limit, total, totalPages };

      state.isLoading = false;
      state.error = null;
    },
    clearAll: () => initialState,
  },
});

export const { setLoading, setError, savePageData, clearAll } =
  blogSlice.actions;

export default blogSlice.reducer;
