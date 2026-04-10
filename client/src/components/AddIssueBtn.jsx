import { Button, message } from "antd";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function AddIssueBtn() {
	const { isLogin } = useSelector((state) => state.user);
	const navigate = useNavigate();

	function clickHandle() {
		// 跳转到添加问答页面
		// 首先验证是否登录
		if (isLogin) {
			// 跳转
			navigate("/addIssue");
			return;
		}
		message.warning("请先登录");
	}

	return (
		<Button
			type="primary"
			size="large"
			style={{ width: "100%", marginBottom: "30px" }}
			onClick={clickHandle}>
			我要发问
		</Button>
	);
}

export default AddIssueBtn;
