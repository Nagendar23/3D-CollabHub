"use client";

import { useState } from "react";
import useComments from "@/hooks/useComments";
import { isAuthenticated } from "@/lib/auth";

export default function CommentSection({ fileId }) {
	const { comments, loading, error, addComment } = useComments(fileId);
	const userLoggedIn = isAuthenticated();
	const [text, setText] = useState("");
	const [submitting, setSubmitting] = useState(false);

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!text.trim()) return;
		try {
			setSubmitting(true);
			await addComment(text.trim());
			setText("");
		} catch (err) {
			alert(err.response?.data?.message || "Failed to post comment");
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<div className="rounded-xl border border-slate-700 bg-slate-800 p-4">
			<h3 className="font-semibold mb-3">Comments</h3>

			<form onSubmit={handleSubmit} className="mb-4">
				<textarea
					value={text}
					onChange={(e) => setText(e.target.value)}
					placeholder={userLoggedIn ? "Add a comment..." : "Login to add comments"}
					disabled={!userLoggedIn}
					className="w-full p-2 rounded bg-slate-900 border border-slate-700 text-sm mb-2"
					rows={3}
				/>
				<div className="flex justify-end">
					<button
						type="submit"
						disabled={!userLoggedIn || submitting || !text.trim()}
						className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded disabled:opacity-50"
					>
						{submitting ? "Posting..." : "Post"}
					</button>
				</div>
			</form>

			{loading ? (
				<div className="space-y-2">
					<div className="h-8 bg-slate-700 animate-pulse rounded"></div>
					<div className="h-8 bg-slate-700 animate-pulse rounded"></div>
				</div>
			) : error ? (
				<div className="text-red-400">{error}</div>
			) : comments.length === 0 ? (
				<div className="text-slate-400">No comments yet</div>
			) : (
				<ul className="space-y-3">
					{comments.map((c) => (
						<li key={c._id} className="border border-slate-700 p-3 rounded bg-slate-900">
							<div className="flex items-center justify-between mb-1">
								<div className="font-semibold text-sm">{c.user?.name || c.user?.email || 'User'}</div>
								<div className="text-xs text-slate-400">{new Date(c.createdAt).toLocaleString()}</div>
							</div>
							<div className="text-sm text-slate-200">{c.text}</div>
						</li>
					))}
				</ul>
			)}
		</div>
	);
}
