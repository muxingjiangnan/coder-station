import request from "./request";

/**
 * 获取所有面试题标题
 */
export function getIntervieTitle() {
	return request({
		url: "/api/interview/interviewTitle",
		method: "GET",
	});
}

/**
 * 根据面试题 id 获取面试题
 */
export function getInterviewById(id) {
	return request({
		url: `/api/interview/${id}`,
		method: "GET",
	});
}
