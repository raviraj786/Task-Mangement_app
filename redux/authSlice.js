import AsyncStorage from "@react-native-async-storage/async-storage";
import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: null,
    user: null,
    loading: false,
    error: null,
  },

  reducers: {
    registerStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    registerSuccess: (state, action) => {
      (state.loading = false), (state.token = action.payload.token);
      state.user = action.payload.newuser;
      AsyncStorage.setItem("token", action.payload.token);
      AsyncStorage.setItem("user", JSON.stringify(action.payload.newuser));
    },
    registerFailuer: () => {
      state.loading = false;
      state.error = action.payload;
    },

    loginSuccess: (state, action) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      console.log(action.payload)
      AsyncStorage.setItem("token", action.payload.token);
      AsyncStorage.setItem("user", JSON.stringify(action.payload.user));
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      AsyncStorage.removeItem("token");
    },
  },
});

export const {
  loginSuccess,
  logout,
  registerStart,
  registerSuccess,
  registerFailuer,
} = authSlice.actions;

export default authSlice.reducer;
