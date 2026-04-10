import { useRef, useState, useEffect } from "react";
import { Form, Input, Select, Button, message } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { Editor } from "@toast-ui/react-editor";
import "@toast-ui/editor/dist/toastui-editor.css";
import "@toast-ui/editor/dist/i18n/zh-cn";
import styles from "../css/AddIssue.module.css";
import { typeOptionCreator } from "../utils/tool";
import { getTypeList } from "../redux/typeSlice";
import { addIssue } from "../api/issue";
import { useNavigate } from "react-router-dom";

function AddIssue() {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { typeList } = useSelector((state) => state.type);
	const { userInfo } = useSelector((state) => state.user);
	const formRef = useRef();
	const editorRef = useRef();
	const [issueInfo, setIssueInfo] = useState({
		issueTitle: "",
		issueContent: "",
		userId: "",
		typeId: "",
	});

	useEffect(() => {
		if (!typeList.length) dispatch(getTypeList());
	}, []);

	async function addHandle() {
		try {
			const editorInstance = editorRef.current?.getInstance();
			if (!editorInstance) {
				message.error("编辑器未初始化");
				return;
			}

			const content = editorInstance.getHTML();

			if (!content.trim() || !issueInfo.issueTitle.trim()) {
				message.error("标题和内容不能为空");
				return;
			}

			if (!userInfo?._id) {
				message.error("用户信息无效");
				return;
			}

			await addIssue({
				issueTitle: issueInfo.issueTitle,
				issueContent: content,
				userId: userInfo._id,
				typeId: issueInfo.typeId,
			});

			message.success("添加成功！");
			navigate("/");
		} catch (error) {
			message.error("添加失败，请重试");
		}
	}

	function updateInfo(value, key) {
		const newData = { ...issueInfo };
		newData[key] = value;
		setIssueInfo(newData);
	}

	/**
	 * 下拉列表改变的时候触发
	 */
	function handleChange(value) {
		updateInfo(value, "typeId");
	}

	return (
		<div className={styles.container}>
			<Form
				name="basic"
				initialValues={issueInfo}
				autoComplete="off"
				ref={formRef}
				onFinish={addHandle}>
				{/* 问答标题 */}
				<Form.Item
					label="标题"
					name="issueTitle"
					rules={[{ required: true, message: "请输入标题" }]}>
					<Input
						placeholder="请输入标题"
						size="large"
						value={issueInfo.issueTitle}
						onChange={(e) => updateInfo(e.target.value, "issueTitle")}
					/>
				</Form.Item>

				{/* 问题类型 */}
				<Form.Item
					label="问题分类"
					name="typeId"
					rules={[{ required: true, message: "请选择问题所属分类" }]}>
					<Select style={{ width: 200 }} onChange={handleChange}>
						{typeOptionCreator(Select, typeList)}
					</Select>
				</Form.Item>

				{/* 问答内容 */}
				<Form.Item
					label="问题描述"
					name="issueContent"
					rules={[{ required: true, message: "请输入问题描述" }]}>
					<Editor
						initialValue=""
						previewStyle="vertical"
						height="600px"
						initialEditType="wysiwyg"
						useCommandShortcut={true}
						language="zh-CN"
						ref={editorRef}
					/>
				</Form.Item>

				{/* 确认修改按钮 */}
				<Form.Item wrapperCol={{ offset: 3, span: 16 }}>
					<Button type="primary" htmlType="submit">
						确认新增
					</Button>

					<Button type="link" htmlType="submit" className="resetBtn">
						重置
					</Button>
				</Form.Item>
			</Form>
		</div>
	);
}

export default AddIssue;
