import { useEffect, useState } from "react";
import { getUserPointRank } from "../api/user";
import ScoreRankItem from "./ScoreRankItem";
import { Card } from "antd";

/**
 * 积分排名 前十
 * @param {*} props
 * @returns
 */
function ScoreRank(props) {
	// 用于存储用户排名信息
	const [userRankInfo, setUserRankInfo] = useState([]);

	useEffect(() => {
		async function fetchData() {
			const { data } = await getUserPointRank();
			setUserRankInfo(data);
		}
		fetchData();
	},[]);

	const userPointRankArr = [];
	if (userRankInfo.length) {
		for (let i = 0; i < userRankInfo.length; i++) {
			userPointRankArr.push(
				<ScoreRankItem
					rankInfo={userRankInfo[i]}
					rank={i + 1}
					key={userRankInfo[i]._id}
				/>
			);
		}
	}

	return (
		<div>
			<Card title="积分排行榜">
                {userPointRankArr}
            </Card>
		</div>
	);
}

export default ScoreRank;
