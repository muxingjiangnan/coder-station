import {
	Modal,
	Radio,
	Form,
	Input,
	Button,
	Row,
	Col,
	Checkbox,
	message,
} from "antd";
import styles from "../css/LoginForm.module.css";
import { useState, useEffect } from "react";
import {
	getCaptcha,
	userIsExist,
	addUser,
	getUserById,
	userLogin,
} from "../api/user";
import { initUserInfo, changeLoginState } from "../redux/userSlice";
import { useDispatch } from "react-redux";

function LoginForm(props) {
	const [value, setValue] = useState(1);
	//登录表单状态数据
	const [loginInfo, setLoginInfo] = useState({
		loginId: "",
		loginPwd: "",
		captcha: "",
		remember: false,
	});
	// 注册表单状态
	const [registerInfo, setRegisterInfo] = useState({
		registerId: "",
		nickname: "",
		captcha: "",
	});
	const [captcha, setCaptcha] = useState(null);
	const dispatch = useDispatch();

	useEffect(() => {
    if (props.isShow) {
    // 每次打开时重置表单（双重保险）
    setLoginInfo({ loginId: "", loginPwd: "", captcha: "", remember: false });
    setRegisterInfo({ registerId: "", nickname: "", captcha: "" });
  }
		captchaClickHandle();
	}, [props.isShow]);

	function onChange(e) {
		setValue(e.target.value);
		captchaClickHandle();
	}

	async function captchaClickHandle() {
		const result = await getCaptcha();
		setCaptcha(result);
	}

	/**
	 * 验证登录账号是否存在
	 */
	async function checkLoginIdIsExist() {
		if (registerInfo.loginId) {
			const { data } = await userIsExist(registerInfo.loginId);
			if (data) {
				// 该用户已经存在
				return Promise.reject("该用户已存在");
			}
		}
	}

	async function loginHandle() {
		const result = await userLogin(loginInfo);
		if (result.data) {
			// 说明验证码正确
			// 接下来会有这几种情况：1、账号或密码错误 2、用户被禁止使用 3、账号正常

			const datas = result.data;
			if (!datas.data) {
				message.warning("账号或密码错误");
				captchaClickHandle();
				return;
			}
			if (!datas.data.enabled) {
				message.warning("该用户已被禁止使用，请联系管理员");
				captchaClickHandle();
				return;
			}
			// 账号正常，可以登录
			// 获取token并存入localStorage
			localStorage.setItem("userToken", datas.token);
			// 将用户信息存储到数据仓库store
			const userResult = await getUserById(datas.data._id);
			dispatch(initUserInfo(userResult.data));
			dispatch(changeLoginState(true));
			message.success("登录成功");
			handleCancel();
		} else {
			message.warning(result.msg);
		}
	}

	function handleCancel() {
		props.closeModal();
		// 重置表单
		setLoginInfo({
			loginId: "",
			loginPwd: "",
			captcha: "",
			remember: false,
		});
		setRegisterInfo({
			registerId: "",
			nickname: "",
			captcha: "",
		});
	}

	async function registerHandle() {
		// 去看registerHandle调用的地方，是注册表单提交成功后调用的，所以表单数据一定是合法的
		const result = await addUser(registerInfo);
		if (result.data) {
			message.success("用户注册成功，默认密码为123456");
			// 将用户信息存入redux

			dispatch(initUserInfo(result.data));
			dispatch(changeLoginState(true));
			handleCancel();
		} else {
			message.warning(result.msg);
			captchaClickHandle();
		}
	}
	/**
	 *
	 * @param {Object} oldInfo 之前的状态
	 * @param {*} newContent 修改的内容
	 * @param {*} key 对应键名
	 * @param {Function} setLoginInfoFunc 修改状态函数
	 */
	function updateInfo(oldInfo, newContent, key, setLoginInfoFunc) {
		const newInfo = { ...oldInfo };
		newInfo[key] = newContent;
		setLoginInfoFunc(newInfo);
	}

	/**
	 * 重置表单
	 * @param {*} num
	 */
	function ResetFormHandle(num) {
		if (num === 1) {
			// 登录表单
			setLoginInfo({
				loginId: "",
				loginPwd: "",
				captcha: "",
				remember: false,
			});
			captchaClickHandle();
		} else {
			// 注册表单
			setRegisterInfo({
				registerId: "",
				nickname: "",
				captcha: "",
			});
			captchaClickHandle();
		}
	}

	let container = null;
	if (value === 1) {
		//登录面板jsx
		container = (
			<div className={styles.container}>
				<Form
          key="login-form"
					autoComplete="off"
					onFinish={loginHandle}>
					<Form.Item
						label="登录账号"
						name="loginId"
						rules={[
							{
								required: true,
								message: "请输入账号",
							},
							// 认证用户是否存在
							{ vallidator: checkLoginIdIsExist },
						]}>
						<Input
							placeholder="请输入你的登录账号"
							value={loginInfo.loginId}
							onChange={(e) =>
								updateInfo(loginInfo, e.target.value, "loginId", setLoginInfo)
							}
              autoComplete="off"
						/>
					</Form.Item>

					<Form.Item
						label="登录密码"
						name="loginPwd"
						rules={[
							{
								required: true,
								message: "请输入密码",
							},
						]}>
						<Input.Password
							placeholder="请输入你的登录密码，新用户默认为123456"
							value={loginInfo.loginPwd}
							onChange={(e) =>
								updateInfo(loginInfo, e.target.value, "loginPwd", setLoginInfo)
							}
              autoComplete="off"
						/>
					</Form.Item>

					{/* 验证码 */}
					<Form.Item
						name="logincaptcha"
						label="验证码"
						rules={[
							{
								required: true,
								message: "请输入验证码",
							},
						]}>
						<Row align="middle">
							<Col span={16}>
								<Input
									placeholder="请输入验证码"
									value={loginInfo.captcha}
									onChange={(e) =>
										updateInfo(
											loginInfo,
											e.target.value,
											"captcha",
											setLoginInfo,
										)
									}
                  autoComplete="off"
								/>
							</Col>
							<Col span={6}>
								<div
									className={styles.captchaImg}
									onClick={captchaClickHandle}
									dangerouslySetInnerHTML={{ __html: captcha }}></div>
							</Col>
						</Row>
					</Form.Item>

					<Form.Item
						name="remember"
						wrapperCol={{
							offset: 5,
							span: 16,
						}}>
						<Checkbox
							onChange={(e) =>
								updateInfo(
									loginInfo,
									e.target.checked,
									"remember",
									setLoginInfo,
								)
							}
							checked={loginInfo.remember}>
							记住我
						</Checkbox>
					</Form.Item>

					<Form.Item
						wrapperCol={{
							offset: 5,
							span: 16,
						}}>
						<Button
							type="primary"
							htmlType="submit"
							style={{ marginRight: 20 }}>
							登录
						</Button>
						<Button
							type="primary"
							htmlType="reset"
							onClick={() => {
								ResetFormHandle(value);
							}}>
							重置
						</Button>
					</Form.Item>
				</Form>
			</div>
		);
	} else {
		//注册面板jsx
		container = (
			<div className={styles.container}>
				<Form
          key="register-form"
					autoComplete="off"
					onFinish={registerHandle}>
					<Form.Item
						label="登录账号"
						name="loginId"
						rules={[
							{
								required: true,
								message: "请输入账号，仅此项为必填项",
							},
							//验证用户是否已经存在
							{ validator: checkLoginIdIsExist },
						]}
						validateTrigger="onBlur">
						<Input
							placeholder="请输入账号"
							value={registerInfo.loginId}
							onChange={(e) =>
								updateInfo(
									registerInfo,
									e.target.value,
									"loginId",
									setRegisterInfo,
								)
							}
              autoComplete="off"
						/>
					</Form.Item>

					<Form.Item label="用户昵称" name="nickname">
						<Input
							placeholder="请输入昵称，不填写默认为新用户xxx"
							value={registerInfo.nickname}
							onChange={(e) =>
								updateInfo(
									registerInfo,
									e.target.value,
									"nickname",
									setRegisterInfo,
								)
							}
              autoComplete="off"
						/>
					</Form.Item>

					<Form.Item
						name="registercaptcha"
						label="验证码"
						rules={[
							{
								required: true,
								message: "请输入验证码",
							},
						]}>
						<Row align="middle">
							<Col span={16}>
								<Input
									placeholder="请输入验证码"
									value={registerInfo.captcha}
									onChange={(e) =>
										updateInfo(
											registerInfo,
											e.target.value,
											"captcha",
											setRegisterInfo,
										)
									}
                  autoComplete="off"
								/>
							</Col>
							<Col span={6}>
								<div
									className={styles.captchaImg}
									onClick={captchaClickHandle}
									dangerouslySetInnerHTML={{ __html: captcha }}></div>
							</Col>
						</Row>
					</Form.Item>

					<Form.Item
						wrapperCol={{
							offset: 5,
							span: 16,
						}}>
						<Button
							type="primary"
							htmlType="submit"
							style={{ marginRight: 20 }}>
							注册
						</Button>
						<Button
							type="primary"
							htmlType="reset"
							onClick={() => {
								ResetFormHandle(value);
							}}>
							重置
						</Button>
					</Form.Item>
				</Form>
			</div>
		);
	}

	return (
		<div>
			<Modal
				title="注册/登录"
				open={props.isShow}
				onCancel={() => {
					setLoginInfo({
						loginId: "",
						loginPwd: "",
						captcha: "",
						remember: false,
					});
					setRegisterInfo({
						registerId: "",
						nickname: "",
						captcha: "",
					});
          setTimeout(() => {
            props.closeModal();
          }, 0);
				}}
				footer={null}>
				<Radio.Group
					value={value}
					onChange={onChange}
					className={styles.radioGroup}
					buttonStyle="solid">
					<Radio.Button value={1} className={styles.radioButton}>
						登录
					</Radio.Button>
					<Radio.Button value={2} className={styles.radioButton}>
						注册
					</Radio.Button>
					{/* 下面需要显示对应功能的表单 */}
					{container}
				</Radio.Group>
			</Modal>
		</div>
	);
}

export default LoginForm;
