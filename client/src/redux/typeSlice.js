import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getType } from "../api/type";

export const getTypeList = createAsyncThunk(
	"type/getTypeListStatus",
	async (_, action) => {
		const resp = await getType();
		return resp.data;
	}
);

const typeSlice = createSlice({
	name: "type",
	initialState: {
		// 存储所有的类型
		typeList: [],
		issueTypeId: "all",
		bookTypeId: "all",
	},
	reducers: {
		updataIssueTypeById: (state, { payload }) => {
			state.issueTypeId = payload;
		},
		updataBookTypeById: (state, { payload }) => {
			state.bookTypeId = payload;
		},
	},
	extraReducers: (builder) => {
		// Add reducers for additional action types here, and handle loading state as needed
		// Translation : 在这里为其他动作类型添加reducer，并根据需要处理加载状态

		builder.addCase(getTypeList.fulfilled, (state, { payload }) => {
			// Add user to the state array
			// Translation : 将用户添加到状态数组

			state.typeList = payload;
		});
	},
});

export const { updataIssueTypeById ,updataBookTypeById} = typeSlice.actions;

export default typeSlice.reducer;
