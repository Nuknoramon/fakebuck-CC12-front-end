import { configureStore, createSlice } from "@reduxjs/toolkit";

const counterSlice = createSlice({
  name: "counter",
  initialState: { count: 123456 },
  reducers: {
    increase: (state, action) => {
      console.log(action);
      state.count = state.count + (action.payload ?? 1);
    },
    decrease: (state, action) => {
      state.count = state.count - 1;
    },
  },
});

const authSlice = createSlice({
  name: "auth",
  initialState: { user: { id: 1, username: "john" }, isLogged: true },
  reducers: {
    login: (state, action) => {},
    logout: (state, action) => {},
  },
});

const store = configureStore({
  reducer: {
    count: counterSlice.reducer,
    auth: authSlice.reducer,
  },
});

const countActions = counterSlice.actions;

export { store, countActions };
