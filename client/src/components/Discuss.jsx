import { useRef, useState, useEffect } from "react";
import { Editor } from "@toast-ui/react-editor";
import "@toast-ui/editor/dist/toastui-editor.css";
import "@toast-ui/editor/dist/i18n/zh-cn";
import {
	Comment,
	Avatar,
	Form,
	Button,
	List,
	Tooltip,
	message,
	Pagination,
} from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import { getIssueCommentById } from "../api/comment";
import { getUserById } from "../api/user";
import { formatDate } from "../utils/tool";
import { addCommet ,getBookCommentById} from "../api/comment";
import { updataIssue } from "../api/issue";
import { updataUserInfoAsync } from "../redux/userSlice";
import styles from "../css/Discuss.module.css";

function Discuss(props) {
	const dispatch = useDispatch();
	const editorRef = useRef();
	const [commentList, setCommentList] = useState(null);
	const [Refresh, setRefresh] = useState(false);
	const [pageInfo, setPageInfo] = useState({
		current: 1,
		pageSize: 10,
		total: 0,
	});
	const { userInfo, isLogin } = useSelector((state) => state.user);

	useEffect(() => {
		async function fetchCommentList() {
			let data = null;
			if (props.commentType === 1) {
				// 传递过来的是 问答的id，所以需要获取该问答 id 对应的评论
				const result = await getIssueCommentById(props.targetId, {
					current: pageInfo.current,
					pageSize: pageInfo.pageSize,
				});
				data = result.data;
			} else if (props.commentType === 2) {
				// 传递过来的是 书籍的id，所以需要获取该书籍 id 对应的评论
				const result = await getBookCommentById(props.targetId, {
					current: pageInfo.current,
					pageSize: pageInfo.pageSize,
				});
				data = result.data;
			}
			for (let i = 0; i < data?.data?.length; i++) {
				const result = await getUserById(data.data[i].userId);
				// 将用户信息添加到评论对象上
				data.data[i].userInfo = result.data;
			}
			// 更新评论数据
			setCommentList(data.data);
			// 更新分页数据
			setPageInfo({
				current: data.currentPage,
				pageSize: data.eachPage,
				total: data.count,
			});
		}
		if (props.targetId) fetchCommentList();
	}, [props.targetId, Refresh, props.issueInfo?.commentNumber]);

	/**
	 * 添加评论的回调函数
	 */
	function onSubmit() {
		let newComment = null;
		if (props.commentType === 1) {
			// 问答评论
			newComment = editorRef.current?.getInstance().getHTML();
		} else if (props.commentType === 2) {
			// 书籍评论
			newComment = editorRef.current?.getInstance().getHTML();
		}
		if (newComment === "<p><br></p>") {
			newComment = "";
		}
		if (!newComment && !newComment?.trim()) {
			message.warning("评论内容不能为空！");
			return;
		}
		addCommet({
			userId: userInfo._id,
			typeId: props.issueInfo ? props.issueInfo.typeId : props.bookInfo.typeId,
			commentContent: newComment,
			commentType: props.commentType,
			bookId: props.issueInfo ? null : props.targetId,
			issueId: props.issueInfo ? props.targetId : null,
		});
		message.success("评论成功！积分 +4！");
		setRefresh(!Refresh);
		editorRef.current?.getInstance().setHTML("<p><br></p>", true);

		// 更新该问答的评论数
		updataIssue(props.targetId, {
			commentNumber: props.issueInfo
				? ++props.issueInfo.commentNumber
				: ++props.bookInfo.commentNumber,
		});

		// 更新用户积分数据
		dispatch(
			updataUserInfoAsync({
				userId: userInfo._id,
				newInfo: {
					points: userInfo.points + 4,
				},
			})
		);
	}

	return (
		<div>
			{/* 评论框 */}
			<Comment
				avatar={
					isLogin ? (
						<Avatar src={userInfo?.avatar} />
					) : (
						<Avatar icon={<UserOutlined />} />
					)
				}
				content={
					<>
						<Form.Item>
							<Editor
								initialValue=""
								previewStyle="vertical"
								height="270px"
								initialEditType="wysiwyg"
								useCommandShortcut={true}
								ref={editorRef}
								className="editor"
							/>
						</Form.Item>
						<Form.Item>
							<Button
								type="primary"
								disabled={isLogin ? false : true}
								onClick={onSubmit}>
								添加评论
							</Button>
						</Form.Item>
					</>
				}
			/>
			{/* 评论列表 */}
			{commentList?.length > 0 && (
				<List
					header="当前评论"
					dataSource={commentList}
					renderItem={(item) => (
						<Comment
							avatar={<Avatar src={item.userInfo.avatar} />}
							content={
								<div
									dangerouslySetInnerHTML={{
										__html: item.commentContent,
									}}></div>
							}
							datetime={
								<Tooltip title={formatDate(item.commentDate, "year")}>
									<span>{formatDate(item.commentDate, "year")}</span>
								</Tooltip>
							}
							style={{ cursor: "default" }}
						/>
					)}
				/>
			)}
			{/* 分页 */}
			{commentList?.length > 0 ? (
				<div className={styles.paginationContainer}>
					<Pagination
						showQuickJumper
						defaultCurrent={1}
						total={pageInfo.total}
					/>
				</div>
			) : (
				<div
					style={{
						fontWeight: "200",
						textAlign: "center",
						margin: "50px",
					}}>
					暂无评论
				</div>
			)}
		</div>
	);
}

export default Discuss;
