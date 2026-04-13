import { useState } from "react";
import PageHeader from "../components/PageHeader";
import styles from "../css/Personal.module.css";
import { useSelector, useDispatch } from "react-redux";
import { Card, Image, Upload, Modal, Form, Input, Button, message } from "antd";
import PersonalInfoItem from "../components/PersonalInfoItem";
import { formatDate, passwordValidator } from "../utils/tool";
import { updataUserInfoAsync } from "../redux/userSlice";
import { checkPassword } from "../api/user";
import notFoundImg from "../img/not_found.png";

/**
 * 个人中心
 * @returns
 */
function Personal() {
	const { userInfo } = useSelector((state) => state.user);
	const dispatch = useDispatch();
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [panelName, setPanelName] = useState("");
	const [passwordInfo, setPasswordInfo] = useState({
		oldpassword: "",
		newpassword: "",
		passwordConfirm: "", // 确认密码
	});

	// 存储用户修改的项目
	const [editInfo, setEditInfo] = useState({});

	// 将仓库和服务器一起更新
	function handleAvatar(newUrl, key) {
		dispatch(
			updataUserInfoAsync({
				userId: userInfo._id,
				newInfo: {
					[key]: newUrl,
				},
			}),
		);
		message.success("修改成功!");
	}

	const showModal = (title) => {
		setPanelName(title);
		setIsModalOpen(true);
		setEditInfo({});
	};

	const handleOk = () => {
		setIsModalOpen(false);
		dispatch(
			updataUserInfoAsync({
				userId: userInfo._id,
				newInfo: editInfo,
			}),
		);
		message.success("修改成功!");
	};

	const handleCancel = () => {
		setIsModalOpen(false);
	};

	function updatePasswordInfo(value, key) {
		const newPasswordInfo = { ...passwordInfo };
		newPasswordInfo[key] = value.trim();
		setPasswordInfo(newPasswordInfo);
		if (key === "newpassword") {
			updateInfo(value, "loginPwd");
		}
	}

	function updateInfo(value, key) {
		const newEditInfo = { ...editInfo };
		newEditInfo[key] = value;
		setEditInfo(newEditInfo);
	}

	/**
	 * 验证用户输入的旧密码是否正确
	 */
	async function checkPasswordIsRight() {
		if (passwordInfo.oldpassword) {
			const { data } = await checkPassword(
				userInfo._id,
				passwordInfo.oldpassword,
			);
			if (!data) {
				return Promise.reject("密码不一致 请重新输入");
			}
		}
	}

	function ResetForm() {}

	let modalContent = null;
	switch (panelName) {
		case "基本信息": {
			modalContent = (
				<>
					<Form
						name="basic1"
						autoComplete="off"
						initialValues={userInfo}
						onFinish={handleOk}>
						{/* 登录密码 */}
						<Form.Item
							label="登录密码"
							name="oldpassword"
							rules={[
								{ required: true },
								{
									validator: checkPasswordIsRight,
								},
							]}
							validateTrigger="onBlur">
							<Input.Password
								rows={6}
								value={passwordInfo.oldpassword}
								placeholder="如果要修改密码，请先输入旧密码"
								onChange={(e) =>
									updatePasswordInfo(e.target.value, "oldpassword")
								}
							/>
						</Form.Item>

						{/* 新的登录密码 */}
						<Form.Item
							label="新密码"
							name="newpassword"
							rules={[
								{
									required: true,
									message: "请输入新密码",
								},
								passwordValidator,
							]}
							validateTrigger="onBlur">
							<Input.Password
								rows={6}
								value={passwordInfo.newpassword}
								placeholder="请输入新密码"
								onChange={(e) =>
									updatePasswordInfo(e.target.value, "newpassword")
								}
							/>
						</Form.Item>

						{/* 确认密码 */}
						<Form.Item
							label="确认密码"
							name="passwordConfirm"
							rules={[
								{ required: true },
								({ getFieldValue }) => ({
									validator(_, value) {
										if (!value || getFieldValue("newpassword") === value) {
											return Promise.resolve();
										}
										return Promise.reject(new Error("两次密码不一致"));
									},
								}),
							]}
							validateTrigger="onBlur">
							<Input.Password
								rows={6}
								placeholder="请确认密码"
								value={passwordInfo.passwordConfirm}
								onChange={(e) =>
									updatePasswordInfo(e.target.value, "passwordConfirm")
								}
							/>
						</Form.Item>

						{/* 用户昵称 */}
						<Form.Item label="用户昵称" name="nickname">
							<Input
								placeholder="昵称可选，默认为新用户"
								value={userInfo.nickname}
								onBlur={(e) => updateInfo(e.target.value, "nickname")}
							/>
						</Form.Item>

						{/* 确认修改按钮 */}
						<Form.Item wrapperCol={{ offset: 5, span: 16 }}>
							<Button type="primary" htmlType="submit">
								确认
							</Button>

							<Button type="link" className="resetBtn" onClick={ResetForm}>
								重置
							</Button>
						</Form.Item>
					</Form>
				</>
			);
			break;
		}
		case "社交账号": {
			modalContent = (
				<>
					<Form
						name="basic2"
						initialValues={userInfo}
						autoComplete="off"
						onFinish={handleOk}>
						<Form.Item label="邮箱" name="mail">
							<Input
								value={userInfo.mail}
								placeholder="请填写邮箱"
								onChange={(e) => updateInfo(e.target.value, "mail")}
							/>
						</Form.Item>
						<Form.Item label="QQ号" name="qq">
							<Input
								value={userInfo.qq}
								placeholder="请填写 QQ 号"
								onChange={(e) => updateInfo(e.target.value, "qq")}
							/>
						</Form.Item>
						<Form.Item label="微信" name="wechat">
							<Input
								value={userInfo.wechat}
								placeholder="请填写微信号"
								onChange={(e) => updateInfo(e.target.value, "wechat")}
							/>
						</Form.Item>
						<Form.Item label="github" name="github">
							<Input
								value={userInfo.github}
								placeholder="请填写 github "
								onChange={(e) => updateInfo(e.target.value, "github")}
							/>
						</Form.Item>

						{/* 确认修改按钮 */}
						<Form.Item wrapperCol={{ offset: 5, span: 16 }}>
							<Button type="primary" htmlType="submit">
								确认
							</Button>

							<Button type="link" className="resetBtn">
								重置
							</Button>
						</Form.Item>
					</Form>
				</>
			);
			break;
		}
		case "个人简介": {
			modalContent = (
				<>
					<Form
						name="basic3"
						initialValues={userInfo}
						autoComplete="off"
						onFinish={handleOk}>
						{/* 自我介绍 */}
						<Form.Item label="自我介绍" name="intro">
							<Input.TextArea
								rows={6}
								value={userInfo.intro}
								placeholder="选填"
								onChange={(e) => updateInfo(e.target.value, "intro")}
							/>
						</Form.Item>

						{/* 确认修改按钮 */}
						<Form.Item wrapperCol={{ offset: 5, span: 16 }}>
							<Button type="primary" htmlType="submit">
								确认
							</Button>

							<Button type="link" className="resetBtn">
								重置
							</Button>
						</Form.Item>
					</Form>
				</>
			);
			break;
		}
	}

	return !userInfo || Object.keys(userInfo).length === 0 ? (
		<div className={styles.emptyInfo}>
			<img src={notFoundImg} alt="信息为空" className={styles.emptyImg} />
			<p>暂无个人信息</p>
		</div>
	) : (
		<div>
			<PageHeader title="个人中心" />
			{/* 信息展示 */}
			<div className={styles.container}>
				{/* 基本信息 */}
				<div className={styles.row}>
					<Card
						title="基本信息"
						extra={
							<div
								className={styles.edit}
								onClick={() => showModal("基本信息")}>
								编辑
							</div>
						}>
						<PersonalInfoItem
							info={{ itemName: "登录账号", itemValue: userInfo?.loginId }}
						/>
						<PersonalInfoItem
							info={{ itemName: "账号密码", itemValue: "******" }}
						/>
						<PersonalInfoItem
							info={{ itemName: "用户昵称", itemValue: userInfo?.nickname }}
						/>
						<PersonalInfoItem
							info={{ itemName: "用户积分", itemValue: userInfo?.points }}
						/>
						<PersonalInfoItem
							info={{
								itemName: "注册时间",
								itemValue: formatDate(userInfo?.registerDate),
							}}
						/>
						<div style={{ fontWeight: "100", height: "50px" }}>当前头像</div>
						<Image src={userInfo?.avatar} width={100} />
						<div style={{ fontWeight: "100", height: "50px" }}>上传新头像</div>
						<Upload
							action="/api/upload"
							listType="picture-card"
							maxCount={1}
							onChange={(e) => {
								if (e.file.status === "done") {
									// 说明上传完毕
									const url = e.file.response.data;
									handleAvatar(url, "avatar");
								}
							}}>
							<i className="iconfont icon-xiangyou">&#xe60f;</i>
						</Upload>
					</Card>
				</div>

				{/* 社交账号 */}
				<div className={styles.row}>
					<Card
						title="社交账号"
						extra={
							<div
								onClick={() => showModal("社交账号")}
								className={styles.edit}>
								编辑
							</div>
						}>
						<PersonalInfoItem
							info={{
								itemName: "邮箱",
								itemValue: userInfo?.mail ? userInfo.mail : "未填写",
							}}
						/>
						<PersonalInfoItem
							info={{
								itemName: "QQ号",
								itemValue: userInfo?.qq ? userInfo.qq : "未填写",
							}}
						/>
						<PersonalInfoItem
							info={{
								itemName: "微信号",
								itemValue: userInfo?.wechat ? userInfo.wechat : "未填写",
							}}
						/>
						<PersonalInfoItem
							info={{
								itemName: "github",
								itemValue: userInfo?.github ? userInfo.github : "未填写",
							}}
						/>
					</Card>
				</div>

				{/* 个人简介 */}
				<div className={styles.row}>
					<Card
						title="个人简介"
						extra={
							<div
								onClick={() => showModal("个人简介")}
								className={styles.edit}>
								编辑
							</div>
						}>
						<p className={styles.intro}>
							{userInfo?.intro ? userInfo.intro : "未填写"}
						</p>
					</Card>
				</div>
			</div>
			{/* 修改信息的对话框 */}
			<Modal
				title={panelName}
				open={isModalOpen}
				onOk={handleOk}
				onCancel={handleCancel}
				footer={false}>
				{modalContent}
			</Modal>
		</div>
	);
}

export default Personal;
