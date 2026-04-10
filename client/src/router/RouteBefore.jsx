import { Alert } from "antd";
import RouterConfig from "./index.jsx";
import RouteBeforeConfig from "./RouteBeforeConfig";

/**
 * 模拟导航守卫
 * 该组件也是个容器组件，不做任何 JSX 展示，完全是为了实现某些功能
 */
function RouteBefore() {
	function closeHandle() {
		location.pathname = "/";
	}
	// 根据location.pathname 获取到 RouteBeforeConfig 对应的对象
	const result = RouteBeforeConfig.filter((item) => {
		return item.path === location.pathname;
	})[0];
	if (result) {
		if (result.needLogin && !localStorage.getItem("userToken")) {
			return (
				<Alert
					message="请先登录"
					closable
					type="warning"
					onClose={closeHandle}
					style={{
						marginTop: "30px",
						marginBottom: "200px",
					}}
				/>
			);
		}
	}

	return <RouterConfig />;
}

export default RouteBefore;
