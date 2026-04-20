import request from "./request";

/**
 * 带重试的请求封装
 * @param {Function} fn 请求函数
 * @param {number} retries 剩余重试次数
 * @param {number} delay 重试间隔(ms)
 */
async function retryRequest(fn, retries = 2, delay = 1000) {
  try {
    return await fn();
  } catch (error) {
    if (retries > 0) {
      console.warn(`[Recommend] 请求失败，${delay}ms 后重试，剩余次数 ${retries}`);
      await new Promise((resolve) => setTimeout(resolve, delay));
      return retryRequest(fn, retries - 1, delay);
    }
    throw error;
  }
}

export async function getRecommendList() {
  const response = await retryRequest(
    () =>
      request.get("/api/recommend/segmentfault", {
        timeout: 10000, // 推荐接口单独放宽到 10 秒（后端可能需要实时爬取）
      }),
    2,    // 最多重试 2 次
    1500  // 每次间隔 1.5 秒
  );
  return Array.isArray(response?.data) ? response.data : response;
}
