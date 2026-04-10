import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import PageHeader from "../components/PageHeader";

import AddIssueBtn from "../components/AddIssueBtn";
import Recommend from "../components/Recommend";
import ScoreRank from "../components/ScoreRank";
import { getIssueByPage } from "../api/issue";
import SearchResultItem from "../components/SearchResultItem";
import styles from "../css/SearchPage.module.css";
/**
 * 搜索结果页面
 * @param {*} props
 * @returns
 */
function SearchPage(props) {
	const location = useLocation();

	// 搜索结果
	const [searchResult, setSearchResult] = useState([]);
	const [pageInfo, setPageInfo] = useState({
		current: 1,
		pageSize: 15,
		total: 0,
	});

	useEffect(() => {
		async function fetchData(state) {
			// state: { searchOption, value }
			const { searchOption, value } = state;
			let searchParams = {
				current: pageInfo.current,
				pageSize: pageInfo.pageSize,
				issueStatus: true,
			};
			switch (searchOption) {
				case "issue": {
					// 搜索问答
					searchParams.issueTitle = value;
					searchParams.current = 1;
					const { data } = await getIssueByPage(searchParams);
					setSearchResult(data.data);
					setPageInfo({
						current: data.currentPage,
						pageSize: data.eachPage,
						total: data.count,
					});
					break;
				}
				case "book": {
					// 搜索书籍
					searchParams.bookTitle = value;
					searchParams.current = 1;
					break;
				}
			}
		}
		if (location.state) {
			fetchData(location.state);
		}
	}, [location.state]);
	return (
		<div>
			<PageHeader title="搜索结果" />
			<div className={styles.searchPageContainer}>
				{/* 左边部分 */}
				<div className={styles.leftSide}>
					{searchResult.map((item) => {
						return <SearchResultItem info={item} key={item._id} />;
					})}
				</div>
				{/* 右边部分 */}
				<div className={styles.rightSide}>
					<AddIssueBtn />
					<div style={{ marginBottom: "30px" }}>
						<Recommend />
					</div>
					<ScoreRank />
				</div>
			</div>
		</div>
	);
}

export default SearchPage;
