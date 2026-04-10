import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getIntervieTitle } from "../api/interview";

export const getIntervieTitleAsync = createAsyncThunk(
	"interview/getIntervieTitleAsync",
	async (_, thunkApi) => {
		const { data } = await getIntervieTitle();
        thunkApi.dispatch(initInterviewTitleList(data))
	}
);

const interviewSlice = createSlice({
	name: "interview",
	initialState: {
		interviewTitleList: [],
	},
	reducers: {
		initInterviewTitleList: (state, { payload }) => {
			state.interviewTitleList = payload;
		},
	},
});

export const { initInterviewTitleList } = interviewSlice.actions;
export default interviewSlice.reducer;
