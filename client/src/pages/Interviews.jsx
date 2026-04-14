import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getIntervieTitleAsync } from "../redux/interviewSlice";
import { getTypeList } from "../redux/typeSlice";
import { highlightAllCode } from "../utils/highlight";
import styles from "../css/Interview.module.css";
import PageHearder from "../components/PageHeader";
import { Tree ,BackTop} from "antd";
import { getInterviewById } from "../api/interview";

function Interviews() {
	const { interviewTitleList } = useSelector((state) => state.interview);
	const { typeList } = useSelector((state) => state.type);
	const [treeData, setTreeData] = useState([]);

	// 该状态存储 id 对应的面试题内容
	const [interviewInfo, setInterviewInfo] = useState(null);
	const dispatch = useDispatch();

	useEffect(() => {
		if (!interviewTitleList.length) {
			dispatch(getIntervieTitleAsync());
		}
		if (!typeList.length) {
			dispatch(getTypeList());
		}

		if (typeList.length && interviewTitleList.length) {
			const arr = []; // 存储最终组装的数据
			// 添加分类标题
			for (let i = 0; i < typeList.length; i++) {
				arr.push({
					title: <h3 style={{ fontWeight: 200 }}>{typeList[i].typeName}</h3>,
					key: typeList[i]._id,
				});
			}

			// 每一个分类下的面试题
			for (let i = 0; i < interviewTitleList.length; i++) {
				const childArr = [];
				for (let j = 0; j < interviewTitleList[i].length; j++) {
					childArr.push({
						title: (
							<h4
								style={{ fontWeight: 200 }}
								onClick={() => {
									clickHandle(interviewTitleList[i][j]._id);
								}}>
								{interviewTitleList[i][j].interviewTitle}
							</h4>
						),
						key: `${i}-${j}`,
					});
				}
				arr[i].children = childArr;
			}
			setTreeData(arr);
		}
	}, [typeList, interviewTitleList]);

	useEffect(() => {
		if (interviewInfo) {
			highlightAllCode();
		}
	}, [interviewInfo]);

	function clickHandle(interviewId) {
		async function fetchData() {
			const { data } = await getInterviewById(interviewId);
            setInterviewInfo(data)
		}
        fetchData();
	}

	let interviewRightSide = null;
	if (interviewInfo) {
        interviewRightSide = (
            <div className={styles.content}>
                <h1 className={styles.interviewRightTitle}>{interviewInfo?.interviewTitle}</h1>
                <div className={styles.contentContainer}>
                    <div className={styles.markdown} dangerouslySetInnerHTML={{__html:interviewInfo?.interviewContent}}></div>
                </div>
            </div>
        )
	} else {
		interviewRightSide = (
			<div
				style={{
					textAlign: "center",
					fontSize: "40px",
					fontWeight: "100",
					marginTop: "150px",
				}}>
				请在左侧选择面试题
			</div>
		);
	}
	return (
		<div className={styles.container}>
			<PageHearder title="面试题大全" />
			<div className={styles.interviewContainer}>
				<div className={styles.leftSide}>
					<Tree treeData={treeData} />
				</div>
				<div className={styles.rightSide}>{interviewRightSide}</div>
			</div>
            <BackTop/>
		</div>
	);
}

export default Interviews;
