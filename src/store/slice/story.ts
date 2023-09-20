import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Comment, News } from "../../interfaces";
import { getItemApi } from "../../api";
import { RootState } from "..";

export interface InitialState {
  story: News | null;
  loading: boolean;
  comments: Comment[];
  loadingComments: boolean;
}

const initialState: InitialState = {
  story: null,
  loading: false,
  comments: [],
  loadingComments: false,
};

const iteratingOverUpdateComments = async (
  comments: Array<Comment>
): Promise<Comment[]> => {
  const newComments: Comment[] = await Promise.all(
    comments.map(async (comment) => {
      if (typeof comment.comments !== "undefined") {
        const newComment: Comment = await getItemApi(comment.id);
        comments = await Promise.all(
          await iteratingOverUpdateComments(comment.comments ?? [])
        );
        newComment.comments = comments;
        return newComment;
      } else {
        return await getItemApi(comment.id);
      }
    })
  );
  return newComments;
};

const iteratingOverGetNestedComments = async (
  id: number,
  oldComments: Comment[]
): Promise<Comment[] | undefined> => {
  const newComments: Comment[] = [];
  for (let i = 0; i < oldComments.length; i++) {
    if (
      oldComments[i].id === id &&
      typeof oldComments[i].comments === "undefined"
    ) {
      newComments.push({
        ...oldComments[i],
        comments: await Promise.all(
          oldComments[i].kids.map(async (element) => {
            return await getItemApi(element);
          })
        ),
      });
    } else if (typeof oldComments[i].comments !== "undefined") {
      if (typeof oldComments[i].comments !== "undefined") {
        newComments.push({
          ...oldComments[i],
          comments: await iteratingOverGetNestedComments(
            id,
            oldComments[i].comments ?? []
          ),
        });
      }
    } else {
      newComments.push(oldComments[i]);
    }
  }
  return newComments;
};

export const getStory = createAsyncThunk(
  "story/getStory",
  async (id: number) => {
    const news: News = await getItemApi(id);
    if (news?.kids) {
      const comments: Array<Comment> = await Promise.all(
        news.kids.map(async (element) => {
          return await getItemApi(element);
        })
      );
      news.comments = comments;
    }
    return news;
  }
);

export const updateComments = createAsyncThunk<
  Comment[],
  void,
  { state: RootState }
>("story/updateComments", async (_: void, thunkAPI) => {
  const state = thunkAPI.getState().story;
  if (state.comments.length > 0) {
    return await iteratingOverUpdateComments(state.comments);
  }
  return [];
});

export const getNestedComments = createAsyncThunk<
  Array<Comment>,
  number,
  { state: RootState }
>("story/getNestedComments", async (id: number, thunkAPI) => {
  const story = thunkAPI.getState().story;
  if (story.comments.length > 0) {
    const comments = await iteratingOverGetNestedComments(id, story.comments);
    return comments ?? [];
  }
  return [];
});

const storySlice = createSlice({
  name: "news",
  initialState,
  reducers: {
    setStory: (state: InitialState, action: PayloadAction<News>) => {
      state.story = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(
      getStory.fulfilled,
      (state: InitialState, action: PayloadAction<News | undefined>) => {
        state.story = action.payload ?? null;
        state.comments = action.payload?.comments ?? [];
        state.loading = false;
      }
    );
    builder.addCase(getStory.pending, (state: InitialState, _) => {
      state.loading = true;
    });
    builder.addCase(
      updateComments.fulfilled,
      (state: InitialState, action: PayloadAction<Comment[]>) => {
        state.comments = action.payload;
        state.loadingComments = false;
      }
    );
    builder.addCase(updateComments.pending, (state: InitialState, _) => {
      state.loadingComments = true;
    });
    builder.addCase(
      getNestedComments.fulfilled,
      (state: InitialState, action: PayloadAction<Comment[]>) => {
        if (action.payload) state.comments = action.payload;
      }
    );
  },
});

export const { setStory } = storySlice.actions;

export default storySlice;
