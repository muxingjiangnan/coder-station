import { Routes, Route, Navigate } from "react-router-dom";
import Issues from "../pages/Issues";
import Books from "../pages/books";
import Interviews from "../pages/Interviews";
import AddIssue from "../pages/AddIssue";
import IssueDetail from "../pages/IssueDetail";
import SearchPage from "../pages/SearchPage";
import BookDetail from "../pages/BookDetail";
import Personal from "../pages/Personal";
import NotFound from "../pages/NotFound";

function RouterConfig() {
	return (
		<Routes>
			<Route path="/issues" element={<Issues />} />
			<Route path="/addIssue" element={<AddIssue />} />
			<Route path="/issues/:id" element={<IssueDetail />} />
			<Route path="/books" element={<Books />} />
			<Route path="/books/:id" element={<BookDetail />} />
			<Route path="/interviews" element={<Interviews />} />
			<Route path="/searchPage" element={<SearchPage />} />
			<Route path="/personal" element={<Personal />} />
			<Route path="/" element={<Navigate replace to="/issues" />} />
			<Route path="*" element={<NotFound />} />
		</Routes>
	);
}

export default RouterConfig;
