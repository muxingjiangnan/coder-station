import { useParams } from "react-router-dom";
import { getIssueById } from "../api/issue";
import { useEffect, useState } from "react";
import { highlightAllCode } from "../utils/highlight";
import styles from "../css/IssueDetail.module.css";
import { PageHeader, Avatar } from "antd";
import Recommend from "../components/Recommend";
import ScoreRank from "../components/ScoreRank";
import { getUserById } from "../api/user";
import { formatDate } from "../utils/tool";
import Discuss from "../components/Discuss";
import DOMPurify from "dompurify";

/**
 * 问答详情
 */
function IssueDetail(props) {
	const { id } = useParams();
	const [issueDetail, setIssueDetail] = useState(null);
	const [userInfo, setUserInfo] = useState(null);
	useEffect(() => {
		async function fetchData() {
			const { data } = await getIssueById(id);
			const { userId } = data;
			setIssueDetail(data);
			const result = await getUserById(userId);
			setUserInfo(result.data);
		}
		fetchData();
	}, []);

	useEffect(() => {
		if (issueDetail) {
			highlightAllCode();
		}
	}, [issueDetail]);

	return (
		<div className={styles.container}>
			<PageHeader title="问题详情" />
			<div className={styles.detailContainer}>
				{/* 左边区域 */}
				<div className={styles.leftSide}>
					{/* 左上方：问答详情 */}
					<div className={styles.question}>
						{/* 标题 */}
						<h1>{issueDetail?.issueTitle}</h1>
						{/* 提问人信息：昵称，头像，提问时间 */}
						<div className={styles.questioner}>
							<Avatar size="small" src={userInfo?.avatar} />
							<span className={styles.user}>{userInfo?.nickname}</span>
							<span>发布于：{formatDate(issueDetail?.issueDate)}</span>
						</div>
						{/* 问题详情 */}
						<div className={styles.content}>
							<div
								dangerouslySetInnerHTML={{
									__html: DOMPurify.sanitize(issueDetail?.issueContent),
								}}></div>
						</div>
					</div>
					{/* 左下方：评论 */}
					<Discuss commentType={1} targetId={issueDetail?._id} issueInfo={issueDetail} />
				</div>
				{/* 右边区域 */}
				<div className={styles.rightSide}>
					<div style={{ marginBottom: "20px" }}>
						<Recommend />
					</div>
					<div style={{ marginBottom: "20px" }}>
						<ScoreRank />
					</div>
				</div>
			</div>
		</div>
	);
}

export default IssueDetail;
