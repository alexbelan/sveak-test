import {
  AnyAction,
  ThunkDispatch,
  combineReducers,
  configureStore,
} from "@reduxjs/toolkit";
import newsSlice from "./slice/news";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import storySlice from "./slice/story";

export type RootState = ReturnType<typeof store.getState>;

type AppThunkDispatch = ThunkDispatch<RootState, any, AnyAction>;

const rootReducer = combineReducers({
  news: newsSlice.reducer,
  story: storySlice.reducer,
});

export const store = configureStore({
  reducer: rootReducer,
});

export const useAppDispatch = () => useDispatch<AppThunkDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
