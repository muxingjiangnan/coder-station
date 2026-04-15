import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

import "antd/dist/antd.min.css";
import zhCN from "antd/es/locale/zh_CN"; // 中文语言包
import { ConfigProvider } from "antd";

import { BrowserRouter } from "react-router-dom";

import store from "./redux/store";
import { Provider } from "react-redux";
import "./index.css"

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
	<Provider store={store}>
		<BrowserRouter
			future={{
				v7_startTransition: true,    // 开启v7的startTransition特性
				v7_relativeSplatPath: true   // 开启v7的通配符路径解析规则
			}}>
			<ConfigProvider locale={zhCN}>
				<App />
			</ConfigProvider>
		</BrowserRouter>
	</Provider>
);
