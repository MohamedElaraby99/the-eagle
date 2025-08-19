import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../Helpers/axiosInstance";

export const checkCourseAccess = createAsyncThunk(
  "courseAccess/check",
  async (courseId, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(`/course-access/check/${courseId}`);
      return { courseId, data: res.data.data };
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Failed to check access" });
    }
  }
);

export const redeemCourseAccessCode = createAsyncThunk(
  "courseAccess/redeem",
  async ({ code, courseId }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post(`/course-access/redeem`, { code, courseId });
      return res.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Failed to redeem code" });
    }
  }
);

// ADMIN: generate codes
export const adminGenerateCourseAccessCodes = createAsyncThunk(
  "courseAccess/adminGenerate",
  async ({ courseId, accessStartAt, accessEndAt, quantity = 1, codeExpiresAt }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post(`/course-access/admin/codes`, {
        courseId,
        accessStartAt,
        accessEndAt,
        quantity,
        codeExpiresAt
      });
      return res.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Failed to generate codes" });
    }
  }
);

// ADMIN: list codes
export const adminListCourseAccessCodes = createAsyncThunk(
  "courseAccess/adminList",
  async ({ courseId, isUsed } = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      if (courseId) params.append("courseId", courseId);
      if (typeof isUsed !== "undefined") params.append("isUsed", String(isUsed));
      const url = `/course-access/admin/codes${params.toString() ? `?${params.toString()}` : ""}`;
      const res = await axiosInstance.get(url);
      return res.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Failed to fetch codes" });
    }
  }
);

const initialState = {
  byCourseId: {}, // courseId -> { hasAccess, accessEndAt }
  loading: false,
  error: null,
  lastRedemption: null,
  admin: {
    generating: false,
    listing: false,
    codes: []
  }
};

const courseAccessSlice = createSlice({
  name: "courseAccess",
  initialState,
  reducers: {
    clearCourseAccessError(state) {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkCourseAccess.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkCourseAccess.fulfilled, (state, action) => {
        state.loading = false;
        const { courseId, data } = action.payload;
        state.byCourseId[courseId] = {
          hasAccess: !!data.hasAccess,
          accessEndAt: data.accessEndAt || null
        };
      })
      .addCase(checkCourseAccess.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to check access";
      })
      .addCase(redeemCourseAccessCode.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(redeemCourseAccessCode.fulfilled, (state, action) => {
        state.loading = false;
        const { access } = action.payload;
        state.lastRedemption = access;
        state.byCourseId[access.courseId] = {
          hasAccess: true,
          accessEndAt: access.accessEndAt
        };
      })
      .addCase(redeemCourseAccessCode.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to redeem code";
      })
      // Admin generate
      .addCase(adminGenerateCourseAccessCodes.pending, (state) => {
        state.admin.generating = true;
        state.error = null;
      })
      .addCase(adminGenerateCourseAccessCodes.fulfilled, (state, action) => {
        state.admin.generating = false;
        const { codes } = action.payload || { codes: [] };
        state.admin.codes = [...codes, ...state.admin.codes];
      })
      .addCase(adminGenerateCourseAccessCodes.rejected, (state, action) => {
        state.admin.generating = false;
        state.error = action.payload?.message || "Failed to generate codes";
      })
      // Admin list
      .addCase(adminListCourseAccessCodes.pending, (state) => {
        state.admin.listing = true;
        state.error = null;
      })
      .addCase(adminListCourseAccessCodes.fulfilled, (state, action) => {
        state.admin.listing = false;
        state.admin.codes = action.payload.codes || [];
      })
      .addCase(adminListCourseAccessCodes.rejected, (state, action) => {
        state.admin.listing = false;
        state.error = action.payload?.message || "Failed to fetch codes";
      });
  }
});

export const { clearCourseAccessError } = courseAccessSlice.actions;
export default courseAccessSlice.reducer;


