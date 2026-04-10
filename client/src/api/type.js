import request from "./request";

export function getType() {
	return request({
		url: "/api/type",
		method: "GET",
	});
}
