import request from "./request";

/**
 * 用户相关API都放在这，比如：注册，登录，查询......
 */

export function getCaptcha() {
	return request({
		url: "/res/captcha",
		method: "GET",
	});
}

/**
 * 验证用户是否存在
 */
export function userIsExist(loginId) {
	return request({
		url: `/api/user/userIsExist/${loginId}`,
		method: "GET",
	});
}

/**
 * 注册用户
 * @param {*} newUserInfo
 * @returns
 */
export function addUser(newUserInfo) {
	return request({
		url: "/api/user",
		method: "POST",
		data: newUserInfo,
	});
}

/**
 * 用户登录
 */
export function userLogin(loginInfo) {
	return request({
		url: "/api/user/login",
		method: "POST",
		data: loginInfo,
	});
}

/**
 * 根据Id获取用户信息
 */
export function getUserById(userId) {
	return request({
		url: `/api/user/${userId}`,
		method: "GET",
	});
}

/**
 * 恢复登录状态
 */
export function reLogin() {
	return request({
		url: "/api/user/whoami",
		method: "GET",
	});
}

/**
 * 获取积分前十用户
 */
export function getUserPointRank() {
	return request({
		url: "/api/user/pointsrank",
		method: "GET",
	});
}

/**
 * 根据 id 修改用户
 */
export function editUser(userId, newUserInfo) {
	return request({
		url: `/api/user/${userId}`,
		method: "PATCH",
		data: newUserInfo,
	});
}

/**
 * 验证账户密码是否存在
 */
export function checkPassword(userId,loginPwd){
	return request({
		url:'/api/user/passwordcheck',
		method:'POST',
		data:{
			userId,
			loginPwd
		}
	})
}