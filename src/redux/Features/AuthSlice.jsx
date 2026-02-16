import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: "sanjeev kumar",
    token: "twefjkjasdfasjfuoipfjfjuojffjsnflkusdlikfrsdhfjk",
    isLogged: true,
    role: "ManagementOfficer",
    UserId: "CUST-100",
};

export const AuthSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        login: (state, action) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.isLogged = true;
            state.role = action.payload.role;
            state.UserId = action.payload.UserId;
        },
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.isLogged = false;
            state.role = null;
            state.UserId = null;
        }
    }
});

export const { login, logout } = AuthSlice.actions;
export default AuthSlice.reducer;
