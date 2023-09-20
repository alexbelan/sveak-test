import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { News } from "../../interfaces";
import { getNewsApi } from "../../api";

export interface InitialState {
  news: News[];
  loading: boolean;
}

const initialState: InitialState = {
  news: [],
  loading: false,
};

export const getNews = createAsyncThunk("news/getNews", async () => {
  return getNewsApi();
});

const newsSlice = createSlice({
  name: "news",
  initialState,
  reducers: {
    setNews: (state: InitialState, action: PayloadAction<News[]>) => {
      state.news = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(
      getNews.fulfilled,
      (state: InitialState, action: PayloadAction<News[] | undefined>) => {
        state.news =
          typeof action.payload !== "undefined" ? action.payload : [];
        state.loading = false;
      }
    );
    builder.addCase(getNews.pending, (state: InitialState, _) => {
      state.loading = true;
    });
  },
});

export const { setNews } = newsSlice.actions;

export default newsSlice;
