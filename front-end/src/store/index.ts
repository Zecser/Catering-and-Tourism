import { configureStore } from "@reduxjs/toolkit";
import adminReducer from './adminAuthSlice'
import planPackageReducer from './pricingSlice'
import adminMenuReducer from './adminMenuSlice'
import galleryReducer from './gallerySlice'
import adminServicesReducer from './adminServicesSlice'
import adminHomeReducer from './adminHomeSlice'
import homeReducer from './homeSlice'
import servicesReducer from './servicesSlice'
import menuReducer from './menuSlice'
import blogReducer from './blogSlice'
import reviewsReducer from './reviewSlice'


export const store = configureStore({
    reducer: {
        admin: adminReducer,
        planPackage: planPackageReducer,
        adminMenu: adminMenuReducer,
        gallery: galleryReducer,
        adminServices: adminServicesReducer,
        adminHome: adminHomeReducer,
        home: homeReducer,
        services: servicesReducer,
        menu: menuReducer,
        blog: blogReducer,
        reviews:reviewsReducer
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
