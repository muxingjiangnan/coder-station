import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Input, Select } from "antd";
import LoginAvatar from "./LoginAvatar";
import { useNavigate } from "react-router-dom";

const { Search } = Input;
const { Option } = Select;

function NavHeader(props) {
	const navigate = useNavigate();
	const [searchOption, setSearchOption] = useState("issue");

	function onSearch(value) {
		if (value) {
			// 搜索框有内容
			navigate("/searchPage", {
				state: { searchOption, value },
			});
			return;
		}
		// message.info("请输入搜索内容！");
	}

	function onChange(value) {
		setSearchOption(value);
	}

	return (
		<div className="headerContainer">
			{/* 头部logo */}
			<NavLink to="/">
				<div className="logoContainer">
					<div className="logo"></div>
				</div>
			</NavLink>
			{/* 头部导航 */}
			<nav className="navContainer">
				<NavLink to="/" className="navgation">
					问答
				</NavLink>
				<NavLink to="/books" className="navgation">
					书籍
				</NavLink>
				<NavLink to="/interviews" className="navgation">
					面试题
				</NavLink>
				<a
					href="https://search.bilibili.com/video?keyword=frontend"
					target="_blank"
					rel="noreferrer"
					className="navgation">
					视频教程
				</a>
			</nav>
			{/* 搜索框 */}
			<div className="searchContainer">
				<Input.Group compact>
					<Select
						defaultValue="issue"
						size="large"
						style={{
							width: "20%",
						}}
						onChange={onChange}>
						<Option value="issue">问答</Option>
						<Option value="book">书籍</Option>
						{/* <Option value="jobs">招聘</Option> */}
					</Select>
					<Search
						placeholder="请输入要搜索的内容"
						allowClear
						enterButton="搜索"
						size="large"
						onSearch={onSearch}
						style={{
							width: "80%",
						}}
					/>
				</Input.Group>
			</div>
			{/* 登录按钮 */}
			<div className="loginBtnContainer">
				<LoginAvatar loginHandle={props.loginHandle} />
			</div>
		</div>
	);
}

export default NavHeader;
