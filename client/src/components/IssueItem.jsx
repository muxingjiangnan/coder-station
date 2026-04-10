import { useEffect, useState } from "react";
import styles from "../css/IssueItem.module.css";
import { formatDate } from "../utils/tool";
import { useSelector, useDispatch } from "react-redux";
import { getTypeList } from "../redux/typeSlice";
import { Tag } from "antd";
import { getUserById } from "../api/user";
import { useNavigate } from "react-router-dom";

/**
 * 每一条问答的项目
 * @returns
 */
export default function IssueItem(props) {
	const navigate = useNavigate();
	const IssueInfo = props.issueInfo;
	const { typeList } = useSelector((state) => state.type);
	const [userInfo, setUserInfo] = useState(null);
	const [userLoading, setUserLoading] = useState(true);

	const colorArr = [
		"#108ee9",
		"#2db2f5",
		"#f50",
		"green",
		"#87d068",
		"blue",
		"red",
		"purple",
	];
	const dispatch = useDispatch();

	useEffect(() => {
		if (!typeList.length) {
			dispatch(getTypeList());
		}
		async function fetchUserData() {
			setUserLoading(true);
			const { data } = await getUserById(IssueInfo.userId);
			setUserInfo(data);
			setUserLoading(false);
		}
		fetchUserData();
	}, []);

	function showUserNicknameTagColor() {
		if (userLoading) return "blue";
		if (!userInfo || !userInfo.nickname) return "default";
		return "volcano";
	}

	function cursorStyle(){
		if(userLoading||!userInfo||!userInfo.nickname) return "not-allowed"
		return "pointer"
	}

	function showUserNickname() {
		if (userLoading) return "";
		if (!userInfo || !userInfo.nickname) return "该用户已注销";
		return userInfo.nickname;
	}

	const type = typeList.find((item) =>item._id === props.issueInfo.typeId);

	return (
		<div className={styles.container}>
			{/* 回答数 */}
			<div className={styles.issueNum}>
				<div>{IssueInfo.commentNumber}</div>
				<div>回答</div>
			</div>

			{/* 浏览数 */}
			<div className={styles.issueNum}>
				<div>{IssueInfo.scanNumber}</div>
				<div>浏览</div>
			</div>
			{/* 问题内容 */}
			<div className={styles.issueContainer}>
				<div 
				className={styles.top} 
				onClick={()=>{
					navigate(`/issues/${props.issueInfo._id}`)
				}}
				>{IssueInfo.issueTitle}</div>
				<div className={styles.bottom}>
					<div className={styles.left}>
						<Tag
							style={{ cursor: "pointer" }}
							color={colorArr[typeList.indexOf(type) % colorArr.length]}>
							{type?.typeName}
						</Tag>
					</div>
					<div className={styles.right}>
						<Tag color={showUserNicknameTagColor()} style={{ cursor: cursorStyle()}}>
							{showUserNickname()}
						</Tag>
						<span style={{ cursor: "default" }}>
							{formatDate(IssueInfo.issueDate, "year")}
						</span>
					</div>
				</div>
			</div>
		</div>
	);
}
