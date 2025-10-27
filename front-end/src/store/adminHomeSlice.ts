import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface HeroBanner {
  _id: string;
  type: "hero" | "catering" | "tourism";
  imageUrl: string;
  createdAt: string;
}

export interface HomeBanner {
  _id: string;
  type: "catering" | "tourism";
  imageUrl: string;
  createdAt: string;
}

interface AdminHomeState {
  heroBanners: HeroBanner[];
  homeBanners: HomeBanner[];
  heroLoading: boolean;
  homeLoading: boolean;
  isFetched:boolean;
  error: string | null;
}

const initialState: AdminHomeState = {
  heroBanners: [],
  homeBanners: [],
  heroLoading: false,
  homeLoading: false,
  isFetched:false,
  error: null,
};

const adminHomeSlice = createSlice({
  name: "adminHome",
  initialState,
  reducers: {
    setHeroBanners(state, action: PayloadAction<HeroBanner[]>) {
      state.heroBanners = action.payload;
      state.isFetched = true;
    },
    setHomeBanners(state, action: PayloadAction<HomeBanner[]>) {
      state.homeBanners = action.payload;
      state.isFetched = true;
    },
    setHeroLoading(state, action: PayloadAction<boolean>) {
      state.heroLoading = action.payload;
    },
    setHomeLoading(state, action: PayloadAction<boolean>) {
      state.homeLoading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
    addHeroBanner(state, action: PayloadAction<HeroBanner>) {
      // append the new banner
      state.heroBanners = [...state.heroBanners, action.payload];
      state.isFetched = false; // force refetch for consistent ordering/sync
    },
    addHomeBanner(state, action: PayloadAction<HomeBanner>) {
      state.homeBanners = [...state.homeBanners, action.payload];
      state.isFetched = false; // force refetch for consistent ordering/sync
    },
   updateHeroBanner(state, action: PayloadAction<HeroBanner>) {
  state.heroBanners = state.heroBanners.map(b =>
    b._id === action.payload._id ? action.payload : b
  );
  state.isFetched = false; // ensure consumers refetch if needed
},
updateHomeBanner(state, action: PayloadAction<HomeBanner>) {
  state.homeBanners = state.homeBanners.map(b =>
    b._id === action.payload._id ? action.payload : b
  );
  state.isFetched = false; // ensure consumers refetch if needed
},
    deleteHeroBanner(state, action: PayloadAction<string>) {
      state.heroBanners = state.heroBanners.filter(b => b._id !== action.payload);
      state.isFetched = false; // force refetch
    },
    deleteHomeBanner(state, action: PayloadAction<string>) {
      state.homeBanners = state.homeBanners.filter(b => b._id !== action.payload);
      state.isFetched = false; // force refetch
    },
  },
});

export const {
  setHeroBanners,
  setHomeBanners,
  setHeroLoading,
  setHomeLoading,
  setError,
  addHeroBanner,
  addHomeBanner,
  updateHeroBanner,
  updateHomeBanner,
  deleteHeroBanner,
  deleteHomeBanner,
} = adminHomeSlice.actions;

export default adminHomeSlice.reducer;
