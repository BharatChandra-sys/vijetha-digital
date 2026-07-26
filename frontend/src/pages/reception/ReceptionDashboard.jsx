import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

/* ─── Mock data for demonstration ─────────────────────────────── */
const DASHBOARD_STATS = {
  todayOrders: 18,
  pendingPayments: 7,
  readyForDelivery: 12,
  customerCallbacks: 3,
  totalRevenue: 45800,
  avgOrderValue: 2544
};

const RECENT_ORDERS = [
  { id: "VD2024-1205", customer: "Rajesh Kumar", items: "Business Cards x500", status: "in_production", priority: "normal", total: 1500 },
  { id: "VD2024-1206", customer: "Priya Sharma", items: "Banner 6x4 ft", status: "ready", priority: "urgent", total: 850 },
  { id: "VD2024-1207", customer: "Tech Solutions Pvt", items: "Signboard + Installation", status: "pending_payment", priority: "normal", total: 12500 },
  { id: "VD2024-1208", customer: "Maya Textiles", items: "Flex Printing 10x8 ft", status: "in_production", priority: "normal", total: 2200 },
  { id: "VD2024-1209", customer: "Dr. Ananth Clinic", items: "LED Signboard", status: "design_approval", priority: "urgent", total: 8500 },
];

const PENDING_TASKS = [
  { id: 1, task: "Call Tech Solutions for payment confirmation", type: "payment", urgent: true },
  { id: 2, task: "Schedule delivery for Priya Sharma banner", type: "delivery", urgent: false },
  { id: 3, task: "Follow up Dr. Ananth for design approval", type: "approval", urgent: true },
  { id: 4, task: "Update inventory - cardstock running low", type: "inventory", urgent: false },
  { id: 5, task: "Process 3 walk-in quotation requests", type: "quote", urgent: false },
];

const STATUS_CONFIG = {
  pending_payment: { label: "Payment Due", color: "text-red-700", bg: "bg-red-50", border: "border-red-200" },
  design_approval: { label: "Design Review", color: "text-orange-700", bg: "bg-orange-50", border: "border-orange-200" },
  in_production: { label: "In Production", color: "text-blue-700", bg: "bg-blue-50", border: "border-blue-200" },
  ready: { label: "Ready for Pickup", color: "text-green-700", bg: "bg-green-50", border: "border-green-200" },
  delivered: { label: "Delivered", color: "text-gray-600", bg: "bg-gray-50", border: "border-gray-200" },
};

const PRIORITY_CONFIG = {
  urgent: { icon: "priority_high", color: "text-red-600" },
  normal: { icon: "remove", color: "text-gray-400" },
};

function StatCard({ icon, title, value, subtitle, trend, color = "bg-white" }) {
  return (
    <div className={`${color} rounded-xl border border-[#E4E1DA] p-5 hover:shadow-card-default transition-all duration-200`}>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-lg bg-[#1A2332]/8 flex items-center justify-center flex-shrink-0">
            <span className="material-symbols-outlined text-[#1A2332]" style={{ fontSize: 20 }}>{icon}</span>
          </div>
          <div>
            <p className="text-[0.8125rem] font-semibold text-[#64748B] uppercase tracking-wide">{title}</p>
            <p className="text-[1.625rem] font-black text-[#1A2332] leading-none mt-1">{value}</p>
          </div>
        </div>
        {trend && (
          <div className="flex items-center gap-1 text-green-600 text-[0.75rem] font-semibold">
            <span className="material-symbols-outlined" style={{ fontSize: 14 }}>trending_up</span>
            {trend}
          </div>
        )}
      </div>
      {subtitle && (
        <p className="text-[0.75rem] text-[#94A3B8] mt-2">{subtitle}</p>
      )}
    </div>
  );
}

function OrderRow({ order, onViewOrder }) {
  const status = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending_payment;
  const priority = PRIORITY_CONFIG[order.priority] || PRIORITY_CONFIG.normal;

  return (
    <div 
      className="flex items-center gap-3 p-3 hover:bg-[#F8F7F4] transition-colors cursor-pointer rounded-lg border border-transparent hover:border-[#E4E1DA]"
      onClick={() => onViewOrder(order.id)}
    >
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <span className={`material-symbols-outlined ${priority.color}`} style={{ fontSize: 16 }}>{priority.icon}</span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1">
            <p className="font-bold text-[#1A2332] text-[0.875rem]">{order.id}</p>
            <span className={`px-2 py-0.5 rounded-full text-[0.625rem] font-bold uppercase tracking-wider ${status.bg} ${status.color} ${status.border} border`}>
              {status.label}
            </span>
          </div>
          <p className="text-[0.8125rem] text-[#64748B] truncate">{order.customer}</p>
          <p className="text-[0.75rem] text-[#94A3B8] truncate">{order.items}</p>
        </div>
      </div>
      <div className="text-right flex-shrink-0">
        <p className="text-[0.875rem] font-bold text-[#1A2332]">₹{order.total.toLocaleString()}</p>
        <span className="material-symbols-outlined text-[#94A3B8] hover:text-[#1A2332] transition-colors" style={{ fontSize: 18 }}>chevron_right</span>
      </div>
    </div>
  );
}

function TaskItem({ task, onCompleteTask }) {
  const typeIcons = {
    payment: "payments",
    delivery: "local_shipping", 
    approval: "check_circle",
    inventory: "inventory_2",
    quote: "request_quote"
  };

  return (
    <div className={`flex items-start gap-3 p-3 rounded-lg border transition-all
      ${task.urgent ? "bg-red-50 border-red-200" : "bg-white border-[#E4E1DA] hover:border-[#1A2332]/20"}`}>
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0
        ${task.urgent ? "bg-red-100" : "bg-[#1A2332]/8"}`}>
        <span className={`material-symbols-outlined ${task.urgent ? "text-red-600" : "text-[#1A2332]"}`} style={{ fontSize: 18 }}>
          {typeIcons[task.type] || "task"}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[0.875rem] font-medium text-[#1A2332] leading-snug">{task.task}</p>
        <div className="flex items-center gap-2 mt-1">
          {task.urgent && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-[0.625rem] font-bold uppercase tracking-wider">
              <span className="material-symbols-outlined" style={{ fontSize: 10 }}>priority_high</span>
              Urgent
            </span>
          )}
        </div>
      </div>
      <button 
        onClick={() => onCompleteTask(task.id)}
        className="flex-shrink-0 p-1 rounded-lg text-[#64748B] hover:text-[#1A2332] hover:bg-[#F4F2EE] transition-all"
      >
        <span className="material-symbols-outlined" style={{ fontSize: 18 }}>check_circle</span>
      </button>
    </div>
  );
}

export default function ReceptionDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const handleViewOrder = (orderId) => {
    navigate(`/reception/orders/${orderId}`);
  };

  const handleCompleteTask = (taskId) => {
    console.log("Complete task:", taskId);
    // TODO: Implement task completion logic
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1400px] mx-auto">
      
      {/* ── Header with greeting ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[2rem] font-bold text-[#1A2332] leading-tight mb-1">
            Good {currentTime.getHours() < 12 ? 'Morning' : currentTime.getHours() < 18 ? 'Afternoon' : 'Evening'}, {user?.full_name?.split(' ')[0] || 'Reception'}
          </h1>
          <p className="text-[0.9375rem] text-[#64748B]">
            {currentTime.toLocaleDateString('en-IN', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })} • {currentTime.toLocaleTimeString('en-IN', { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </p>
        </div>
        
        <div className="flex gap-3">
          <Link
            to="/reception/walk-in"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#C0392B] text-white font-semibold rounded-xl hover:bg-[#A93226] transition-all hover:-translate-y-0.5 shadow-sm"
          >
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>person_add</span>
            New Walk-in
          </Link>
          <Link
            to="/reception/orders"
            className="inline-flex items-center gap-2 px-4 py-2.5 border-2 border-[#1A2332]/20 text-[#1A2332] font-semibold rounded-xl hover:bg-[#1A2332] hover:text-white transition-all"
          >
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>receipt_long</span>
            View All Orders
          </Link>
        </div>
      </div>

      {/* ── Key metrics ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        <StatCard
          icon="today"
          title="Today's Orders"
          value={DASHBOARD_STATS.todayOrders}
          subtitle="3 more than yesterday"
          trend="+16%"
        />
        <StatCard
          icon="payments"
          title="Pending Payments"
          value={DASHBOARD_STATS.pendingPayments}
          subtitle="Follow up required"
          color="bg-red-50"
        />
        <StatCard
          icon="inventory_2"
          title="Ready for Delivery"
          value={DASHBOARD_STATS.readyForDelivery}
          subtitle="Notify customers"
          color="bg-green-50"
        />
        <StatCard
          icon="call"
          title="Customer Callbacks"
          value={DASHBOARD_STATS.customerCallbacks}
          subtitle="Priority follow-up"
          color="bg-orange-50"
        />
        <StatCard
          icon="currency_rupee"
          title="Today's Revenue"
          value={`₹${(DASHBOARD_STATS.totalRevenue / 1000).toFixed(0)}k`}
          subtitle="Across all orders"
          trend="+24%"
        />
        <StatCard
          icon="trending_up"
          title="Avg Order Value"
          value={`₹${DASHBOARD_STATS.avgOrderValue.toLocaleString()}`}
          subtitle="This month"
        />
      </div>

      {/* ── Main content grid ── */}
      <div className="grid lg:grid-cols-3 gap-6">
        
        {/* Recent orders */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-[#E4E1DA] shadow-sm">
            <div className="flex items-center justify-between p-5 border-b border-[#E4E1DA]">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[#1A2332]" style={{ fontSize: 20 }}>receipt_long</span>
                <h2 className="text-[1.125rem] font-bold text-[#1A2332]">Recent Orders</h2>
              </div>
              <Link 
                to="/reception/orders"
                className="text-[#C0392B] font-semibold text-[0.875rem] hover:text-[#A93226] transition-colors"
              >
                View All
              </Link>
            </div>
            <div className="divide-y divide-[#E4E1DA]">
              {RECENT_ORDERS.map(order => (
                <OrderRow key={order.id} order={order} onViewOrder={handleViewOrder} />
              ))}
            </div>
          </div>
        </div>

        {/* Pending tasks */}
        <div>
          <div className="bg-white rounded-xl border border-[#E4E1DA] shadow-sm">
            <div className="flex items-center justify-between p-5 border-b border-[#E4E1DA]">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[#1A2332]" style={{ fontSize: 20 }}>task_alt</span>
                <h2 className="text-[1.125rem] font-bold text-[#1A2332]">My Tasks</h2>
              </div>
              <span className="px-2 py-1 bg-[#C0392B]/10 text-[#C0392B] text-[0.75rem] font-bold rounded-full">
                {PENDING_TASKS.filter(t => t.urgent).length} Urgent
              </span>
            </div>
            <div className="p-3 space-y-2">
              {PENDING_TASKS.slice(0, 6).map(task => (
                <TaskItem key={task.id} task={task} onCompleteTask={handleCompleteTask} />
              ))}
            </div>
            <div className="p-4 border-t border-[#E4E1DA]">
              <Link
                to="/reception/tasks"
                className="w-full flex items-center justify-center gap-2 py-2.5 text-[#1A2332] font-semibold text-[0.875rem] hover:bg-[#F4F2EE] transition-colors rounded-lg"
              >
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>add</span>
                View All Tasks
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ── Quick actions ── */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { 
            icon: "person_add", 
            title: "New Walk-in Order", 
            desc: "Register walk-in customer", 
            to: "/reception/walk-in",
            color: "bg-[#C0392B]",
            textColor: "text-white"
          },
          { 
            icon: "search", 
            title: "Track Order", 
            desc: "Search by order ID or customer", 
            to: "/reception/tracking",
            color: "bg-blue-600",
            textColor: "text-white"
          },
          { 
            icon: "payments", 
            title: "Payment Center", 
            desc: "Process payments & refunds", 
            to: "/reception/payments",
            color: "bg-green-600",
            textColor: "text-white"
          },
          { 
            icon: "support_agent", 
            title: "Customer Support", 
            desc: "Handle customer queries", 
            to: "/reception/support",
            color: "bg-purple-600",
            textColor: "text-white"
          },
        ].map((action, idx) => (
          <Link
            key={idx}
            to={action.to}
            className={`${action.color} ${action.textColor} p-5 rounded-xl hover:shadow-lg transition-all hover:-translate-y-1 group`}
          >
            <div className="flex items-start justify-between mb-3">
              <span className="material-symbols-outlined opacity-90 group-hover:opacity-100" style={{ fontSize: 24 }}>{action.icon}</span>
              <span className="material-symbols-outlined opacity-70 group-hover:opacity-100 group-hover:translate-x-1 transition-all" style={{ fontSize: 20 }}>arrow_forward</span>
            </div>
            <h3 className="font-bold text-[0.9375rem] mb-1">{action.title}</h3>
            <p className="text-[0.75rem] opacity-90">{action.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}