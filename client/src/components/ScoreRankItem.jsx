import styles from "../css/ScoreItem.module.css";
import { Avatar } from "antd";

function ScoreRankItem(props) {
	let rankNum = null;
	switch (props.rank) {
		case 1: {
			rankNum = (
				<div
					style={{
						color: "#ffda23",
						fontSize: "22px",
					}}
					className="iconfont icon-jiangbei-"></div>
			);

			break;
		}
		case 2: {
			rankNum = (
				<div
					style={{ color: "#C0C0C0", fontSize: "21px" }}
					className="iconfont icon-jiangbei-1"></div>
			);
			break;
		}
		case 3: {
			rankNum = (
				<div
					style={{ color: "#B87333", fontSize: "20px" }}
					className="iconfont icon-jiangbei-2"></div>
			);
			break;
		}

		default:
			rankNum = props.rank;
			break;
	}

	return (
		<div className={styles.container}>
			{/* 名次  头像和昵称*/}
			<div className={styles.left}>
				<div className={styles.rank}>{rankNum}</div>

				<div className={styles.avatar}>
					<Avatar size="small" src={props.rankInfo.avatar} />
				</div>
				<div className={styles.nickname}>{props.rankInfo.nickname}</div>
			</div>
			{/* 积分 */}
			<div className={styles.right}>{props.rankInfo.points}</div>
		</div>
	);
}

export default ScoreRankItem;
