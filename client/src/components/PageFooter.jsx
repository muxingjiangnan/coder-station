function PageFooter() {
	return (
		<div>
			<p className="links">
				<span className="linkItem">友情链接: </span>
				<a
					href="https://segmentfault.com/"
					target="_blank"
					rel="noreferrer"
					className="linkItem"
				>
					SegmentFault 思否
				</a>
				<a
					href="https://juejin.cn/"
					target="_blank"
					rel="noreferrer"
					className="linkItem"
				>
					掘金社区
				</a>
				<a
					href="https://www.nowcoder.com/"
					target="_blank"
					rel="noreferrer"
					className="linkItem"
				>
					牛客网
				</a>
				<a
					href="https://www.ruanyifeng.com/blog/"
					target="_blank"
					rel="noreferrer"
					className="linkItem"
				>
					阮一峰的日志
				</a>
			</p>
			<p>© 2026 - Coder Station</p>
			<p>Powered by Vite</p>
		</div>
	);
}

export default PageFooter;
