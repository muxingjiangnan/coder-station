import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { editUser } from "../api/user";

export const updataUserInfoAsync = createAsyncThunk(
	"user/updataUserInfoAsyncStatus",
	async (payload, thunkApi) => {
		await editUser(payload.userId, payload.newInfo);
		thunkApi.dispatch(updataUserInfo(payload.newInfo));
	}
);

const userSlice = createSlice({
	name: "user",
	initialState: {
		isLogin: false,
		userInfo: null,
	},
	reducers: {
		initUserInfo: (state, { payload }) => {
			state.userInfo = payload;
		},
		changeLoginState: (state, { payload }) => {
			state.isLogin = payload;
		},
		/**
		 * 清除用户登录信息
		 */
		clearUserInfo: (state) => {
			state.isLogin = false;
			state.userInfo = null;
		},

		/**
		 * 更新用户信息
		 */
		updataUserInfo: (state, { payload }) => {
			for (const key in payload) {
				state.userInfo[key] = payload[key];
			}
		},
	},
});

export const { initUserInfo, changeLoginState, clearUserInfo, updataUserInfo } =
	userSlice.actions;

export default userSlice.reducer;
