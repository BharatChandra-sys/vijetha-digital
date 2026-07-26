import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

/* ─── Mock staff workspace data ───────────────────────────── */
const WORKSPACE_METRICS = {
  assignedOrders: 8,
  completedToday: 5,
  inProgress: 3,
  pendingReview: 2,
  todayTarget: 12,
  efficiency: 94
};

const MY_ASSIGNED_ORDERS = [
  { id: "VD2024-1215", customer: "Tech Innovators Pvt", product: "LED Signboard 4x2 ft", priority: "urgent", deadline: "2024-12-24", status: "in_progress", progress: 75 },
  { id: "VD2024-1216", customer: "Green Foods", product: "Flex Banner 8x6 ft", priority: "normal", deadline: "2024-12-26", status: "design_review", progress: 45 },
  { id: "VD2024-1217", customer: "Fashion Store", product: "Window Graphics", priority: "normal", deadline: "2024-12-28", status: "production", progress: 85 },
  { id: "VD2024-1218", customer: "Dr. Raghav Clinic", product: "Acrylic Nameplate", priority: "normal", deadline: "2024-12-25", status: "quality_check", progress: 90 },
  { id: "VD2024-1219", customer: "StartupHub", product: "Business Cards x1000", priority: "low", deadline: "2024-12-30", status: "pending_materials", progress: 20 },
];

const TODAY_TASKS = [
  { id: 1, task: "Complete LED signboard installation prep", order: "VD2024-1215", priority: "urgent", estimated: "2h", type: "production" },
  { id: 2, task: "Review design feedback for Green Foods banner", order: "VD2024-1216", priority: "normal", estimated: "45m", type: "design" },
  { id: 3, task: "Quality check: Fashion Store window graphics", order: "VD2024-1217", priority: "normal", estimated: "30m", type: "quality" },
  { id: 4, task: "Update inventory - vinyl material stock", order: null, priority: "normal", estimated: "15m", type: "inventory" },
  { id: 5, task: "Coordinate with delivery team for clinic nameplate", order: "VD2024-1218", priority: "normal", estimated: "20m", type: "coordination" },
];

const PRIORITY_CONFIG = {
  urgent: { color: "text-red-700", bg: "bg-red-50", border: "border-red-200", icon: "priority_high" },
  normal: { color: "text-blue-700", bg: "bg-blue-50", border: "border-blue-200", icon: "remove" },
  low: { color: "text-gray-600", bg: "bg-gray-50", border: "border-gray-200", icon: "keyboard_arrow_down" },
};

const STATUS_CONFIG = {
  in_progress: { label: "In Progress", color: "text-blue-700", bg: "bg-blue-50", border: "border-blue-200" },
  design_review: { label: "Design Review", color: "text-orange-700", bg: "bg-orange-50", border: "border-orange-200" },
  production: { label: "Production", color: "text-purple-700", bg: "bg-purple-50", border: "border-purple-200" },
  quality_check: { label: "Quality Check", color: "text-indigo-700", bg: "bg-indigo-50", border: "border-indigo-200" },
  pending_materials: { label: "Pending Materials", color: "text-red-700", bg: "bg-red-50", border: "border-red-200" },
  ready: { label: "Ready", color: "text-green-700", bg: "bg-green-50", border: "border-green-200" },
};

const TASK_TYPES = {
  production: { icon: "precision_manufacturing", color: "text-blue-600" },
  design: { icon: "design_services", color: "text-purple-600" },
  quality: { icon: "verified", color: "text-green-600" },
  inventory: { icon: "inventory_2", color: "text-orange-600" },
  coordination: { icon: "groups", color: "text-indigo-600" },
};

function WorkspaceMetric({ icon, label, value, subtitle, color = "bg-white", trend }) {
  return (
    <div className={`${color} rounded-xl border border-[#E4E1DA] p-5 hover:shadow-card-default transition-all duration-200`}>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-lg bg-[#1A2332]/8 flex items-center justify-center flex-shrink-0">
            <span className="material-symbols-outlined text-[#1A2332]" style={{ fontSize: 20 }}>{icon}</span>
          </div>
          <div>
            <p className="text-[0.8125rem] font-semibold text-[#64748B] uppercase tracking-wide">{label}</p>
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

function OrderCard({ order, onViewOrder, onUpdateStatus }) {
  const status = STATUS_CONFIG[order.status] || STATUS_CONFIG.in_progress;
  const priority = PRIORITY_CONFIG[order.priority] || PRIORITY_CONFIG.normal;
  
  const getDeadlineStatus = (deadline) => {
    const deadlineDate = new Date(deadline);
    const today = new Date();
    const diffDays = Math.ceil((deadlineDate - today) / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return { color: "text-red-600", label: "Overdue", days: Math.abs(diffDays) };
    if (diffDays === 0) return { color: "text-orange-600", label: "Due Today", days: 0 };
    if (diffDays <= 2) return { color: "text-orange-600", label: "Due Soon", days: diffDays };
    return { color: "text-green-600", label: "On Track", days: diffDays };
  };

  const deadlineStatus = getDeadlineStatus(order.deadline);

  return (
    <div className="bg-white rounded-xl border border-[#E4E1DA] p-5 hover:shadow-card-hover transition-all duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <span className={`material-symbols-outlined ${priority.color} flex-shrink-0`} style={{ fontSize: 18 }}>
            {priority.icon}
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-1">
              <p className="font-bold text-[#1A2332] text-[0.875rem]">{order.id}</p>
              <span className={`px-2 py-0.5 rounded-full text-[0.625rem] font-bold uppercase tracking-wider ${status.bg} ${status.color} ${status.border} border`}>
                {status.label}
              </span>
            </div>
            <p className="text-[0.8125rem] text-[#64748B] font-medium truncate">{order.customer}</p>
            <p className="text-[0.75rem] text-[#94A3B8] truncate">{order.product}</p>
          </div>
        </div>
        <button 
          onClick={() => onViewOrder(order.id)}
          className="flex-shrink-0 p-1 rounded-lg text-[#94A3B8] hover:text-[#1A2332] hover:bg-[#F4F2EE] transition-all"
        >
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>open_in_new</span>
        </button>
      </div>

      {/* Progress bar */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-1">
          <span className="text-[0.75rem] font-semibold text-[#64748B]">Progress</span>
          <span className="text-[0.75rem] font-bold text-[#1A2332]">{order.progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-[#C0392B] h-2 rounded-full transition-all duration-300"
            style={{ width: `${order.progress}%` }}
          />
        </div>
      </div>

      {/* Deadline and actions */}
      <div className="flex items-center justify-between">
        <div className={`text-[0.75rem] font-semibold ${deadlineStatus.color}`}>
          <span className="material-symbols-outlined mr-1" style={{ fontSize: 14 }}>schedule</span>
          {deadlineStatus.label} {deadlineStatus.days > 0 && `(${deadlineStatus.days}d)`}
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => onUpdateStatus(order.id, order.status)}
            className="px-2.5 py-1 bg-[#1A2332] text-white text-[0.6875rem] font-bold rounded-lg hover:bg-[#2C3E55] transition-all"
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
}

function TaskItem({ task, onCompleteTask }) {
  const priority = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG.normal;
  const taskType = TASK_TYPES[task.type] || TASK_TYPES.production;

  return (
    <div className={`flex items-start gap-3 p-3 rounded-lg border transition-all
      ${task.priority === 'urgent' ? "bg-red-50 border-red-200" : "bg-white border-[#E4E1DA] hover:border-[#1A2332]/20"}`}>
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0
        ${task.priority === 'urgent' ? "bg-red-100" : "bg-[#1A2332]/8"}`}>
        <span className={`material-symbols-outlined ${task.priority === 'urgent' ? "text-red-600" : taskType.color}`} style={{ fontSize: 18 }}>
          {taskType.icon}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[0.875rem] font-medium text-[#1A2332] leading-snug">{task.task}</p>
        <div className="flex items-center gap-3 mt-1">
          {task.order && (
            <span className="text-[0.6875rem] text-[#94A3B8] font-mono">{task.order}</span>
          )}
          <span className="text-[0.6875rem] text-[#64748B] font-semibold">Est: {task.estimated}</span>
          {task.priority === 'urgent' && (
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

export default function StaffWorkspace() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const handleViewOrder = (orderId) => {
    navigate(`/staff/orders/${orderId}`);
  };

  const handleUpdateStatus = (orderId, currentStatus) => {
    console.log("Update status for order:", orderId, currentStatus);
    // TODO: Implement status update logic
  };

  const handleCompleteTask = (taskId) => {
    console.log("Complete task:", taskId);
    // TODO: Implement task completion logic
  };

  const completionPercentage = Math.round((WORKSPACE_METRICS.completedToday / WORKSPACE_METRICS.todayTarget) * 100);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1400px] mx-auto">
      
      {/* ── Staff workspace header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[2rem] font-bold text-[#1A2332] leading-tight mb-1">
            My Workspace
          </h1>
          <p className="text-[0.9375rem] text-[#64748B]">
            Welcome back, {user?.full_name?.split(' ')[0] || 'Team Member'} • {currentTime.toLocaleDateString('en-IN', { 
              weekday: 'long', 
              month: 'short', 
              day: 'numeric' 
            })} • {currentTime.toLocaleTimeString('en-IN', { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </p>
        </div>
        
        <div className="flex gap-3">
          <Link
            to="/staff/schedule"
            className="inline-flex items-center gap-2 px-4 py-2.5 border-2 border-[#1A2332]/20 text-[#1A2332] font-semibold rounded-xl hover:bg-[#1A2332] hover:text-white transition-all"
          >
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>calendar_month</span>
            My Schedule
          </Link>
          <Link
            to="/staff/orders"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#C0392B] text-white font-semibold rounded-xl hover:bg-[#A93226] transition-all hover:-translate-y-0.5 shadow-sm"
          >
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>receipt_long</span>
            All Orders
          </Link>
        </div>
      </div>

      {/* ── Daily performance metrics ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        <WorkspaceMetric
          icon="assignment"
          label="Assigned Today"
          value={WORKSPACE_METRICS.assignedOrders}
          subtitle="Active orders"
        />
        <WorkspaceMetric
          icon="task_alt"
          label="Completed"
          value={WORKSPACE_METRICS.completedToday}
          subtitle={`Target: ${WORKSPACE_METRICS.todayTarget}`}
          color="bg-green-50"
        />
        <WorkspaceMetric
          icon="hourglass_top"
          label="In Progress"
          value={WORKSPACE_METRICS.inProgress}
          subtitle="Active work"
          color="bg-blue-50"
        />
        <WorkspaceMetric
          icon="rate_review"
          label="Pending Review"
          value={WORKSPACE_METRICS.pendingReview}
          subtitle="Awaiting approval"
          color="bg-orange-50"
        />
        <WorkspaceMetric
          icon="percent"
          label="Daily Progress"
          value={`${completionPercentage}%`}
          subtitle={`${WORKSPACE_METRICS.completedToday}/${WORKSPACE_METRICS.todayTarget} completed`}
          trend="12.5"
        />
        <WorkspaceMetric
          icon="speed"
          label="Efficiency"
          value={`${WORKSPACE_METRICS.efficiency}%`}
          subtitle="This week average"
          color="bg-purple-50"
        />
      </div>

      {/* ── Main workspace grid ── */}
      <div className="grid lg:grid-cols-3 gap-6">
        
        {/* My assigned orders */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-[#E4E1DA] shadow-sm">
            <div className="flex items-center justify-between p-6 border-b border-[#E4E1DA]">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[#1A2332]" style={{ fontSize: 22 }}>assignment</span>
                <h2 className="text-[1.25rem] font-bold text-[#1A2332]">My Assigned Orders</h2>
              </div>
              <Link 
                to="/staff/orders"
                className="text-[#C0392B] font-semibold text-[0.875rem] hover:text-[#A93226] transition-colors"
              >
                View All
              </Link>
            </div>
            <div className="p-4 space-y-4">
              {MY_ASSIGNED_ORDERS.slice(0, 4).map(order => (
                <OrderCard 
                  key={order.id} 
                  order={order} 
                  onViewOrder={handleViewOrder}
                  onUpdateStatus={handleUpdateStatus}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Today's tasks */}
        <div>
          <div className="bg-white rounded-xl border border-[#E4E1DA] shadow-sm">
            <div className="flex items-center justify-between p-6 border-b border-[#E4E1DA]">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[#1A2332]" style={{ fontSize: 22 }}>today</span>
                <h2 className="text-[1.25rem] font-bold text-[#1A2332]">Today's Tasks</h2>
              </div>
              <span className="px-2.5 py-1 bg-[#C0392B]/10 text-[#C0392B] text-[0.75rem] font-bold rounded-full">
                {TODAY_TASKS.filter(t => t.priority === 'urgent').length} Urgent
              </span>
            </div>
            <div className="p-4 space-y-3">
              {TODAY_TASKS.slice(0, 5).map(task => (
                <TaskItem key={task.id} task={task} onCompleteTask={handleCompleteTask} />
              ))}
            </div>
            <div className="p-4 border-t border-[#E4E1DA]">
              <Link
                to="/staff/tasks"
                className="w-full flex items-center justify-center gap-2 py-2.5 text-[#1A2332] font-semibold text-[0.875rem] hover:bg-[#F4F2EE] transition-colors rounded-lg"
              >
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>add</span>
                View All Tasks
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ── Quick workspace actions ── */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { 
            icon: "update", 
            title: "Update Order Status", 
            desc: "Mark progress on assigned work", 
            to: "/staff/operations",
            color: "bg-[#1A2332]",
            textColor: "text-white"
          },
          { 
            icon: "inventory_2", 
            title: "Check Inventory", 
            desc: "Verify material availability", 
            to: "/staff/inventory",
            color: "bg-blue-600",
            textColor: "text-white"
          },
          { 
            icon: "quality_assurance", 
            title: "Quality Control", 
            desc: "Run quality checks", 
            to: "/staff/quality",
            color: "bg-green-600",
            textColor: "text-white"
          },
          { 
            icon: "support_agent", 
            title: "Request Support", 
            desc: "Get help from supervisor", 
            to: "/staff/support",
            color: "bg-purple-600",
            textColor: "text-white"
          },
        ].map((action, idx) => (
          <Link
            key={idx}
            to={action.to}
            className={`${action.color} ${action.textColor} p-6 rounded-xl hover:shadow-lg transition-all hover:-translate-y-1 group`}
          >
            <div className="flex items-start justify-between mb-4">
              <span className="material-symbols-outlined opacity-90 group-hover:opacity-100" style={{ fontSize: 26 }}>{action.icon}</span>
              <span className="material-symbols-outlined opacity-70 group-hover:opacity-100 group-hover:translate-x-1 transition-all" style={{ fontSize: 22 }}>arrow_forward</span>
            </div>
            <h3 className="font-bold text-[1rem] mb-1.5">{action.title}</h3>
            <p className="text-[0.8125rem] opacity-90">{action.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}