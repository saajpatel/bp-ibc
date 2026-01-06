import { configureStore } from "@reduxjs/toolkit"
import siteStatusReducer from "../features/siteStatus/siteStatus.slices";

export const store = configureStore({
    reducer: {
        siteStatus: siteStatusReducer
    }
})

export type RootState = ReturnType<typeof store.getState>;