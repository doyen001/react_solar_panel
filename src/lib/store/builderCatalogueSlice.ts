import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import {
  BUILDER_CATEGORIES,
  fetchBuilderCatalogue,
  type BuilderCatalogue,
} from "@/lib/designs/catalogue";
import type { RootState } from "./store";

const EMPTY_CATALOGUE: BuilderCatalogue = {
  "Solar Panel": [],
  Inverter: [],
  Battery: [],
};

export type BuilderCatalogueLoadState = "idle" | "loading" | "ready" | "error";

type BuilderCatalogueState = {
  catalogue: BuilderCatalogue;
  status: BuilderCatalogueLoadState;
  error: string | null;
};

const initialState: BuilderCatalogueState = {
  catalogue: EMPTY_CATALOGUE,
  status: "idle",
  error: null,
};

export const loadBuilderCatalogue = createAsyncThunk(
  "builderCatalogue/load",
  async (includeIds: readonly string[] = []) => {
    return fetchBuilderCatalogue(includeIds);
  },
);

const builderCatalogueSlice = createSlice({
  name: "builderCatalogue",
  initialState,
  reducers: {
    resetBuilderCatalogue: () => initialState,
    setBuilderCatalogue: (
      state,
      action: PayloadAction<BuilderCatalogue>,
    ) => {
      state.catalogue = action.payload;
      state.status = "ready";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadBuilderCatalogue.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loadBuilderCatalogue.fulfilled, (state, action) => {
        state.catalogue = action.payload;
        state.status = "ready";
        state.error = null;
      })
      .addCase(loadBuilderCatalogue.rejected, (state, action) => {
        state.status = "error";
        state.error =
          action.error.message ?? "Could not load equipment options";
      });
  },
});

export const { resetBuilderCatalogue, setBuilderCatalogue } =
  builderCatalogueSlice.actions;

export const selectBuilderCatalogue = (state: RootState) =>
  state.builderCatalogue.catalogue;

export const selectBuilderCatalogueStatus = (state: RootState) =>
  state.builderCatalogue.status;

export const selectBuilderCatalogueError = (state: RootState) =>
  state.builderCatalogue.error;

/** True once every category array has been populated (may still be empty). */
export const selectBuilderCatalogueReady = (state: RootState) =>
  state.builderCatalogue.status === "ready" &&
  BUILDER_CATEGORIES.every(
    (category) => Array.isArray(state.builderCatalogue.catalogue[category]),
  );

export default builderCatalogueSlice.reducer;
