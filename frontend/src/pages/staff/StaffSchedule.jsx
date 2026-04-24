const SCHEDULE = [
  { shift: "Morning", time: "8:00 AM - 4:00 PM", team: "Production", lead: "Ravi" },
  { shift: "General", time: "10:00 AM - 6:00 PM", team: "Design Review", lead: "Asha" },
  { shift: "Evening", time: "2:00 PM - 10:00 PM", team: "Dispatch", lead: "Naveen" },
];

export default function StaffSchedule() {
  return (
    <section className="space-y-5">
      <header>
        <h1 className="text-2xl font-bold text-plum-deep">Staff Schedule</h1>
        <p className="text-sm text-text-muted">Shift planning and lead assignment for smooth daily operations.</p>
      </header>

      <div className="overflow-x-auto rounded-xl border border-stone-border bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-stone-light/70 text-plum-deep">
            <tr>
              <th className="px-4 py-3 text-left font-bold">Shift</th>
              <th className="px-4 py-3 text-left font-bold">Timing</th>
              <th className="px-4 py-3 text-left font-bold">Team</th>
              <th className="px-4 py-3 text-left font-bold">Lead</th>
            </tr>
          </thead>
          <tbody>
            {SCHEDULE.map((row) => (
              <tr key={row.shift} className="border-t border-stone-border/70">
                <td className="px-4 py-3 font-semibold text-plum-deep">{row.shift}</td>
                <td className="px-4 py-3 text-text-muted">{row.time}</td>
                <td className="px-4 py-3 text-text-muted">{row.team}</td>
                <td className="px-4 py-3 text-text-muted">{row.lead}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
