import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { message } from "antd";
import RouterConfig from "./index.jsx";
import RouteBeforeConfig from "./RouteBeforeConfig";

/**
 * 路由守卫
 * 检查当前路径是否需要登录，未登录则拦截并重定向
 */
function RouteBefore() {
	const location = useLocation();
	const navigate = useNavigate();

	useEffect(() => {
		// 查找当前路径对应的配置
		const matchedRoute = RouteBeforeConfig.find((item) => {
			// 精确匹配
			if (item.path === location.pathname) {
				return true;
			}
			// 动态路由匹配，如 /issues/:id 匹配 /issues/123
			if (item.path.includes(":id")) {
				const pattern = item.path.replace(":id", "[^/]+");
				const regex = new RegExp(`^${pattern}$`);
				return regex.test(location.pathname);
			}
			return false;
		});

		// 如果匹配到需要登录的路由，且未登录，则重定向到首页并提示
		if (matchedRoute?.needLogin && !localStorage.getItem("userToken")) {
			message.warning("请先登录");
			navigate("/", { replace: true });
		}
	}, [location.pathname, navigate]);

	return <RouterConfig />;
}

export default RouteBefore;
