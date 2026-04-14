import styles from "../css/ScoreItem.module.css";
import { Avatar } from "antd";

function ScoreRankItem(props) {
	let rankNum = null;
	rankNum = props.rank;
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
