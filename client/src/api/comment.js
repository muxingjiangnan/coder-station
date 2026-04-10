import request from "./request";


/**
 * 根据问答id获取评论
 * @param {*} id 
 * @param {*} params 
 * @returns 
 */
export function getIssueCommentById(id, params) {
	return request({
		url: `/api/comment/issuecomment/${id}`,
		method: "GET",
		params: {
			...params,
		},
	});
}

/**
 * 新增评论
 */
export function addCommet(newCommet){
	return request({
		url:"/api/comment",
		method:"POST",
		data:newCommet
	})
}

/**
 * 根据 bookId 获取该书籍所对应的评论
 * @param {*} id 
 * @param {*} params 
 * @returns 
 */
export function getBookCommentById(id, params) {
  return request(`/api/comment/bookcomment/${id}`, {
    method: "GET",
    params: {
      ...params,
    },
  });
}

