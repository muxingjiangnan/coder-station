import NavHeader from "./components/NavHeader";
import PageFooter from "./components/PageFooter";
import "./css/App.css";
import { Layout, message } from "antd";
import RouteBefore from "./router/RouteBefore";
import LoginForm from "./components/loginForm";
import { useState, useEffect } from "react";
import { reLogin, getUserById } from "./api/user";
import { useDispatch } from "react-redux";
import { initUserInfo, changeLoginState } from "./redux/userSlice";

const { Header, Footer, Content } = Layout;

function App() {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const dispatch = useDispatch();

	// 加载跟组件的时候，尝试恢复登录状态
	useEffect(() => {
		async function fetchData() {
			const result = await reLogin();
			if (result.data) {
				// token 有效
				// 获取该 ID 对应的用户信息，存储到状态仓库
				const { data } = await getUserById(result.data._id);
				data.lastLoginDate = new Date().getTime().toString();
				dispatch(initUserInfo(data));
				dispatch(changeLoginState(true));
			} else {
				message.warning(result.msg);
				localStorage.removeItem("userToken");
			}
		}
		if (localStorage.getItem("userToken")) {
			fetchData();
		}
	}, []);

	function closeModal() {
		setIsModalOpen(false);
	}

	function loginHandle() {
		setIsModalOpen(true);
	}

	return (
		<div className="App">
			<Header>
				<NavHeader loginHandle={loginHandle} />
			</Header>
			<Content>
				<RouteBefore />
			</Content>
			<Footer className="footer">
				<PageFooter />
			</Footer>
			{/* 登录弹窗 */}
			<LoginForm isShow={isModalOpen} closeModal={closeModal} />
		</div>
	);
}

export default App;
