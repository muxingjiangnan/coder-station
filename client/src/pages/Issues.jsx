import PageHeader from "../components/PageHeader";
import styles from "../css/Issue.module.css";
import { getIssueByPage } from "../api/issue";
import { useState, useEffect } from "react";
import { Pagination } from "antd";
import IssueItem from "../components/IssueItem";
import AddIssueBtn from "../components/AddIssueBtn";
import Recommend from "../components/Recommend";
import ScoreRank from "../components/ScoreRank";
import TypeSelect from "../components/TypeSelect";
import { useSelector } from "react-redux";

function Issues() {
	const { issueTypeId } = useSelector((state) => state.type);
	// 当前页 问答信息列表
	const [issueInfo, setIssueInfo] = useState([]);
	// 加载状态
	const [isLoading, setIsLoading] = useState(true);
	// 分页信息
	const [pageInfo, setPageInfo] = useState({
		current: 1,
		pageSize: 15,
		total: 0,
	});

	function handlePageChange(current, pageSize) {
		setPageInfo({
			current,
			pageSize,
			total: pageInfo.total,
		});
	}

	useEffect(() => {
		async function fetchData() {
			setIsLoading(true);
			try {
				let searchParams = {
					current: pageInfo.current,
					pageSize: pageInfo.pageSize,
					issueStatus: true,
				};
				if (issueTypeId !== "all") {
					// 用户点击了分类
					searchParams.typeId = issueTypeId;

					// 需要将当前页重置为 1 ，因为：如果用户点击到了数据的最后一页，再来点击分类，
					// 此时 getIssueByPage 中的参数 current 为当前页，有可能取不到数据.
					searchParams.current = 1;
				}

				const { data } = await getIssueByPage(searchParams);

				setIssueInfo(data.data);
				setPageInfo({
					current: data.currentPage,
					pageSize: data.eachPage,
					total: data.count,
				});
			} catch (error) {
				console.error("Failed to fetch issues:", error);
			} finally {
				setIsLoading(false);
			}
		}
		fetchData();
	}, [pageInfo.current, pageInfo.pageSize, issueTypeId]);

	let issueList = [];
	for (let i = 0; i < issueInfo.length; i++) {
		issueList.push(<IssueItem key={i} issueInfo={issueInfo[i]} />);
	}

	return (
		<div className={styles.container}>
			{/* 上面的头部 */}
			<PageHeader title="问答列表">
				<TypeSelect />
			</PageHeader>
			{/* 下面的列表内容区域 */}
			<div className={styles.issueContainer}>
				{/* 左边区域 */}
				<div className={styles.leftSide}>
					{isLoading ? (
						// 显示骨架屏
						Array(5)
							.fill(0)
							.map((_, index) => (
								<div
									key={index}
									style={{
										marginBottom: 24,
										padding: 16,
										borderRadius: 4,
										backgroundColor: "#fafafa",
									}}>
									<div
										style={{
											height: 20,
											backgroundColor: "#e8e8e8",
											borderRadius: 4,
											marginBottom: 16,
										}}></div>
									<div
										style={{
											height: 16,
											backgroundColor: "#e8e8e8",
											borderRadius: 4,
											marginBottom: 8,
											width: "80%",
										}}></div>
									<div
										style={{
											height: 16,
											backgroundColor: "#e8e8e8",
											borderRadius: 4,
											marginBottom: 8,
											width: "90%",
										}}></div>
									<div
										style={{
											height: 16,
											backgroundColor: "#e8e8e8",
											borderRadius: 4,
											marginBottom: 16,
											width: "70%",
										}}></div>
									<div style={{ display: "flex", alignItems: "center" }}>
										<div
											style={{
												width: 32,
												height: 32,
												borderRadius: 16,
												backgroundColor: "#e8e8e8",
												marginRight: 8,
											}}></div>
										<div
											style={{
												height: 14,
												backgroundColor: "#e8e8e8",
												borderRadius: 4,
												width: "60%",
											}}></div>
									</div>
								</div>
							))
					) : issueInfo.length > 0 ? (
						// 显示实际数据
						<>
							{issueList}
							<div className="paginationContainer">
								<Pagination
									showQuickJumper
									defaultCurrent={1}
									{...pageInfo}
									onChange={handlePageChange}
									pageSizeOptions={[5, 10, 15]}
									showSizeChanger
								/>
							</div>
						</>
					) : (
						// 显示暂无数据
						<div className={styles.noIssue}>暂无数据</div>
					)}
				</div>
				{/* 右边区域 */}
				<div className={styles.rightSide}>
					{isLoading ? (
						// 右侧骨架屏
						<>
							<div
								style={{
									height: 40,
									backgroundColor: "#e8e8e8",
									borderRadius: 4,
									marginBottom: 16,
								}}></div>
							<div
								style={{
									padding: 16,
									borderRadius: 4,
									backgroundColor: "#fafafa",
									marginBottom: 30,
								}}>
								<div
									style={{
										height: 18,
										backgroundColor: "#e8e8e8",
										borderRadius: 4,
										marginBottom: 16,
									}}></div>
								{Array(5)
									.fill(0)
									.map((_, index) => (
										<div
											key={index}
											style={{
												height: 14,
												backgroundColor: "#e8e8e8",
												borderRadius: 4,
												marginBottom: 8,
												width: "80%",
											}}></div>
									))}
							</div>
							<div
								style={{
									padding: 16,
									borderRadius: 4,
									backgroundColor: "#fafafa",
								}}>
								<div
									style={{
										height: 18,
										backgroundColor: "#e8e8e8",
										borderRadius: 4,
										marginBottom: 16,
									}}></div>
								{Array(5)
									.fill(0)
									.map((_, index) => (
										<div
											key={index}
											style={{
												height: 14,
												backgroundColor: "#e8e8e8",
												borderRadius: 4,
												marginBottom: 8,
												width: "80%",
											}}></div>
									))}
							</div>
						</>
					) : (
						// 显示实际内容
						<>
							<AddIssueBtn />
							<div style={{ marginBottom: "30px" }}>
								<Recommend />
							</div>
							<ScoreRank />
						</>
					)}
				</div>
			</div>
		</div>
	);
}

export default Issues;
