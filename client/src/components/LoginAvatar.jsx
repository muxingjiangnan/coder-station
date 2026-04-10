import { useSelector, useDispatch } from "react-redux";
import { Button, Popover, Avatar, Image, List, Modal } from "antd";
import styles from "../css/LoginAvatar.module.css";
import { clearUserInfo } from "../redux/userSlice";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

function LoginAvatar(props) {
	const { isLogin, userInfo } = useSelector((state) => state.user);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const showModal = () => {
		setIsModalOpen(true);
	};
	const handleOk = () => {
		setIsModalOpen(false);
	};
	const handleCancel = () => {
		setIsModalOpen(false);
	};

	function listClickHandle(Item) {
		if (Item === "个人中心") {
			// 跳转到个人中心
			navigate("/personal");
		} else {
			// 退出登录
			// 清除token
			localStorage.removeItem("userToken");
			// 清除状态仓库
			dispatch(clearUserInfo());
			// 跳转至首页 issue 页面
			navigate("/issues");
		}
	}

	let loginStatus = null;
	if (isLogin) {
		//已经登录
		const content = (
			<List
				dataSource={["个人中心", "退出登录"]}
				size="large"
				renderItem={(Item) => {
					if (Item === "退出登录") {
						return (
							<>
								<List.Item
									key={Item}
									onClick={showModal}
									style={{ cursor: "pointer" }}>
									{Item}
								</List.Item>
								<Modal
									title="确认退出"
									className="custom-logout-modal"
									open={isModalOpen}
									// onOk={() => {
									// 	handleOk();
									// 	listClickHandle(Item);
									// }} // 用户点“确定”时执行退出
									// onCancel={handleCancel}
									footer={[
										<Button key="cancel" onClick={handleCancel}>
											取消
										</Button>,
										<Button
											key="confirm"
											type="primary"
											danger
											onClick={() => {
												handleOk();
												listClickHandle(Item);
											}}>
											确定退出
										</Button>,
									]}>
									<p>您确定要退出当前账号吗？</p>
								</Modal>
							</>
						);
					}
					return (
						<List.Item
							key={Item}
							style={{ cursor: "pointer" }}
							onClick={() => listClickHandle(Item)}>
							{Item}
						</List.Item>
					);
				}}
			/>
		);
		loginStatus = (
			<Popover content={content} trigger={"hover"}>
				<div className={styles.avatarContainer} style={{ cursor: "pointer" }}>
					<Avatar
						src={<Image src={userInfo?.avatar} preview={false} />}
						size={"large"}
					/>
				</div>
			</Popover>
		);
	} else {
		// 没有登录
		loginStatus = (
			<Button type="primary" size="large" onClick={props.loginHandle}>
				注册/登录
			</Button>
		);
	}

	return <div>{loginStatus}</div>;
}

export default LoginAvatar;
