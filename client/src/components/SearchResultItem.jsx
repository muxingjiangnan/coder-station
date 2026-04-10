import IssueItem from "./IssueItem";

/**
 * 存储搜索结果的项目
 * 该组件是根据搜索的类型返回不同类型的搜索项目组件 issueItem 或 bookItem
 * 像这类组件，没有自己的 JSX 视图， 而是充当一个容器
 * 像这类组件，我们称之为 容器组件
 * @param {*} props
 * @returns
 */
function SearchResultItem(props) {
	return (
		<div>
			{props.info.issueTitle ? (
				<IssueItem issueInfo={props.info} />
			) : (
				null
			)}
		</div>
	);
}

export default SearchResultItem;
