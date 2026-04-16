import { useEffect, useState } from "react";
import { Card, Carousel } from "antd";
import RecommendItem from "./RecommendItem";
import { getRecommendList } from "../api/recommend";
import styles from "../css/Recommend.module.css";

/**
 * 推荐内容
 * @returns
 */
function Recommend() {
	const [recommendList, setRecommendList] = useState([]);
	const [loading, setLoading] = useState(true);
	const [errorMessage, setErrorMessage] = useState("");

	useEffect(() => {
		let mounted = true;

		getRecommendList()
			.then((data) => {
				if (!mounted) {
					return;
				}
				setRecommendList(Array.isArray(data) ? data : []);
			})
			.catch(() => {
				if (!mounted) {
					return;
				}
				setErrorMessage("推荐内容加载失败，请稍后重试。");
			})
			.finally(() => {
				if (mounted) {
					setLoading(false);
				}
			});

		return () => {
			mounted = false;
		};
	}, []);

	return (
		<div>
			<Card title="推荐内容">
				<div style={{ marginBottom: 20 }}>
					<Carousel autoplay>
						<div>
							<a
								style={{
									background:
										"url(https://image-static.segmentfault.com/583/489/583489293-62e22caab8392) center/cover no-repeat",
								}}
								className={styles.contentStyle}
								href="https://segmentfault.com/a/1190000042203704?utm_source=sf-homepage-headline"
								target="_blank"
								rel="noreferrer"></a>
						</div>
						<div>
							<a
								style={{
									background:
										"url(https://image-static.segmentfault.com/248/470/2484709773-635632347923b) center/cover no-repeat",
								}}
								className={styles.contentStyle}
								href="https://chinaevent.microsoft.com/Events/details/0decfcda-1959-4098-891d-690825a58f9e/?channel_id%3d50%26channel_name%3dPaid-SF"
								target="_blank"
								rel="noreferrer"></a>
						</div>
						<div>
							<a
								style={{
									background:
										"url(https://image-static.segmentfault.com/364/971/3649718341-6355fab16df40) center/cover no-repeat",
								}}
								className={styles.contentStyle}
								href="https://segmentfault.com/a/1190000042666738?utm_source=sf-homepage-headline"
								target="_blank"
								rel="noreferrer"></a>
						</div>
						<div>
							<a
								style={{
									background:
										"url(https://image-static.segmentfault.com/422/352/422352298-6355600c6676b) center/cover no-repeat",
								}}
								className={styles.contentStyle}
								href="https://segmentfault.com/reco/1640000042672710?utm_source=sf-homepage-headline"
								target="_blank"
								rel="noreferrer"></a>
						</div>
					</Carousel>
				</div>
				{loading ? (
					<div style={{ padding: 16, color: "#999" }}>加载中...</div>
				) : errorMessage ? (
					<div style={{ padding: 16, color: "#f00" }}>{errorMessage}</div>
				) : recommendList.length > 0 ? (
					recommendList.map((recommendInfo) => (
						<RecommendItem
							key={recommendInfo.href}
							recommendInfo={recommendInfo}
						/>
					))
				) : (
					<div style={{ padding: 16, color: "#999" }}>暂无推荐内容。</div>
				)}
			</Card>
		</div>
	);
}
export default Recommend;
