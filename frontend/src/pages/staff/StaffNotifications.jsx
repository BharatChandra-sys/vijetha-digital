import { useState } from "react";

const INITIAL_NOTIFICATIONS = [
  { id: 1, title: "New order assigned", body: "Order #VJ1042 assigned to operations queue.", time: "5 min ago", read: false },
  { id: 2, title: "Dispatch updated", body: "Delivery partner picked up shipment for Order #VJ1039.", time: "27 min ago", read: false },
  { id: 3, title: "QC reminder", body: "2 jobs are pending quality check before EOD.", time: "1 hr ago", read: true },
];

export default function StaffNotifications() {
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <section className="space-y-5">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-plum-deep">Staff Notifications</h1>
          <p className="text-sm text-text-muted">Operational alerts and assignment updates for your team.</p>
        </div>
        <button
          type="button"
          onClick={markAllRead}
          className="h-9 px-4 rounded-lg border border-stone-border bg-white text-sm font-semibold text-plum-deep hover:bg-stone-light"
        >
          Mark all as read
        </button>
      </header>

      <div className="grid gap-3">
        {notifications.map((n) => (
          <article
            key={n.id}
            className={`rounded-xl border p-4 bg-white shadow-sm ${n.read ? "border-stone-border" : "border-coral-accent/40"}`}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-base font-semibold text-plum-deep">{n.title}</h2>
                <p className="text-sm text-text-muted mt-1">{n.body}</p>
              </div>
              <span className="text-xs text-text-muted whitespace-nowrap">{n.time}</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
