"use client";

import { FormEvent, useMemo, useState } from "react";

type MessageStatus = "pending" | "approved" | "rejected" | "hidden";
type VisitorMessage = {
  id: string;
  nickname: string;
  city?: string;
  message: string;
  email?: string;
  status: MessageStatus;
  created_at: string;
  reply?: string;
};

const statusLabels: Record<MessageStatus | "all", string> = {
  all: "全部",
  pending: "待审核",
  approved: "已通过",
  rejected: "已驳回",
  hidden: "已隐藏",
};

export default function VisitorMessagesAdminPage() {
  const [token, setToken] = useState("");
  const [messages, setMessages] = useState<VisitorMessage[]>([]);
  const [filter, setFilter] = useState<MessageStatus | "all">("pending");
  const [replyDrafts, setReplyDrafts] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const visibleMessages = useMemo(
    () => filter === "all" ? messages : messages.filter((message) => message.status === filter),
    [filter, messages],
  );

  const requestMessages = async (event?: FormEvent) => {
    event?.preventDefault();
    setLoading(true);
    setError("");
    setNotice("");
    try {
      const response = await fetch("/api/admin/visitor-messages", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json() as { messages?: VisitorMessage[]; error?: string };
      if (!response.ok) throw new Error(data.error || "无法加载留言");
      setMessages(data.messages ?? []);
      setNotice(`已加载 ${data.messages?.length ?? 0} 条留言`);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "无法加载留言");
    } finally {
      setLoading(false);
    }
  };

  const moderate = async (id: string, status: MessageStatus) => {
    setLoading(true);
    setError("");
    setNotice("");
    try {
      const response = await fetch(`/api/admin/visitor-messages/${id}`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}`, "content-type": "application/json" },
        body: JSON.stringify({ status, reply: replyDrafts[id] ?? "" }),
      });
      const data = await response.json() as { error?: string };
      if (!response.ok) throw new Error(data.error || "审核操作失败");
      await requestMessages();
      setNotice(`已${statusLabels[status]}`);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "审核操作失败");
      setLoading(false);
    }
  };

  const remove = async (id: string) => {
    if (!window.confirm("确定永久删除这条留言吗？")) return;
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`/api/admin/visitor-messages/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("删除失败");
      await requestMessages();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "删除失败");
      setLoading(false);
    }
  };

  return (
    <main className="admin-guestbook-page">
      <div className="admin-guestbook-shell">
        <header className="admin-guestbook-header">
          <div>
            <small>DUODUO OS · PRIVATE TOOL</small>
            <h1>VISITOR LIGHTS</h1>
            <p>查看、回复和审核 About 页的来访留言。只有通过审核的留言才会出现在公开星空中。</p>
          </div>
          <a href="/world#about">回到 About ↗</a>
        </header>

        {!messages.length && !notice && (
          <form className="admin-guestbook-login" onSubmit={requestMessages}>
            <label htmlFor="admin-token">ADMIN TOKEN · 管理员密钥</label>
            <input id="admin-token" type="password" value={token} onChange={(event) => setToken(event.target.value)} placeholder="粘贴 Cloudflare ADMIN_TOKEN" required />
            <button type="submit" disabled={loading}>{loading ? "连接中…" : "进入留言审核"}</button>
            {error && <p className="admin-guestbook-error">{error}</p>}
          </form>
        )}

        {(messages.length > 0 || notice) && (
          <>
            <div className="admin-guestbook-toolbar">
              <label>FILTER · 筛选
                <select value={filter} onChange={(event) => setFilter(event.target.value as MessageStatus | "all")}>
                  {(Object.keys(statusLabels) as Array<MessageStatus | "all">).map((status) => <option key={status} value={status}>{statusLabels[status]}</option>)}
                </select>
              </label>
              <button type="button" onClick={() => void requestMessages()} disabled={loading}>刷新列表</button>
            </div>
            {notice && <p className="admin-guestbook-notice">{notice}</p>}
            {error && <p className="admin-guestbook-error">{error}</p>}
            <section className="admin-guestbook-list" aria-live="polite">
              {visibleMessages.length === 0 && <p className="admin-guestbook-empty">这个筛选条件下暂时没有留言。</p>}
              {visibleMessages.map((message) => (
                <article className={`admin-guestbook-card is-${message.status}`} key={message.id}>
                  <header><div><b>{message.nickname}</b>{message.city && <span> · {message.city}</span>}</div><small>{message.status} · {message.created_at}</small></header>
                  <p>{message.message}</p>
                  <dl>
                    {message.email && <div><dt>Email</dt><dd>{message.email}</dd></div>}
                    {message.reply && <div><dt>已回复</dt><dd>{message.reply}</dd></div>}
                  </dl>
                  <textarea value={replyDrafts[message.id] ?? message.reply ?? ""} onChange={(event) => setReplyDrafts((current) => ({ ...current, [message.id]: event.target.value }))} placeholder="回复（选填）" maxLength={240} />
                  <div className="admin-guestbook-actions">
                    <button type="button" data-status="approved" onClick={() => void moderate(message.id, "approved")}>通过并公开</button>
                    <button type="button" data-status="rejected" onClick={() => void moderate(message.id, "rejected")}>驳回</button>
                    <button type="button" data-status="hidden" onClick={() => void moderate(message.id, "hidden")}>隐藏</button>
                    <button type="button" data-delete="true" onClick={() => void remove(message.id)}>永久删除</button>
                  </div>
                </article>
              ))}
            </section>
          </>
        )}
      </div>
    </main>
  );
}
