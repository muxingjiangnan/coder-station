import request from "./request";

export async function getRecommendList() {
  const response = await request("/api/recommend/segmentfault");
  return Array.isArray(response?.data) ? response.data : response;
}
