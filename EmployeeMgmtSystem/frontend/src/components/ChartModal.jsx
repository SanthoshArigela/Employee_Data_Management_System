import {
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer
} from 'recharts';
import { FiX } from 'react-icons/fi';
import './ChartModal.css';

const COLORS = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#06b6d4', '#ec4899'];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="chart-tooltip">
        <p className="tooltip-label">{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color }}>
            {p.name}: <strong>{p.value}</strong>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const ChartModal = ({ type, employees, onClose }) => {
  // --- Data builders ---
  const deptCounts = Object.values(
    employees.reduce((acc, e) => {
      acc[e.department] = acc[e.department] || { department: e.department, count: 0, totalSalary: 0 };
      acc[e.department].count += 1;
      acc[e.department].totalSalary += e.salary || 0;
      return acc;
    }, {})
  );

  const activeData = [
    { name: 'Active',   value: employees.filter(e => e.status === 'active').length },
    { name: 'Inactive', value: employees.filter(e => e.status !== 'active').length },
  ];

  const salaryData = deptCounts.map(d => ({
    department: d.department,
    avgSalary: Math.round(d.totalSalary / d.count),
  }));

  // --- Chart configs ---
  const charts = {
    employees: {
      title: 'Employees per Department',
      subtitle: 'Headcount breakdown across all departments',
      render: () => (
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={deptCounts} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="department" tick={{ fill: '#94a3b8', fontSize: 12 }} />
            <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} allowDecimals={false} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(139,92,246,0.08)' }} />
            <Bar dataKey="count" name="Employees" radius={[6, 6, 0, 0]}>
              {deptCounts.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      ),
    },
    departments: {
      title: 'Department Distribution',
      subtitle: 'Proportion of employees in each department',
      render: () => (
        <ResponsiveContainer width="100%" height={320}>
          <PieChart>
            <Pie
              data={deptCounts}
              dataKey="count"
              nameKey="department"
              cx="50%"
              cy="50%"
              outerRadius={120}
              innerRadius={60}
              paddingAngle={3}
              label={({ department, percent }) => `${department} ${(percent * 100).toFixed(0)}%`}
              labelLine={{ stroke: 'rgba(255,255,255,0.2)' }}
            >
              {deptCounts.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              iconType="circle"
              formatter={(val) => <span style={{ color: '#cbd5e1' }}>{val}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      ),
    },
    salary: {
      title: 'Average Salary by Department',
      subtitle: 'Average monthly salary (₹) per department',
      render: () => (
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={salaryData} margin={{ top: 10, right: 20, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="department" tick={{ fill: '#94a3b8', fontSize: 12 }} />
            <YAxis
              tick={{ fill: '#94a3b8', fontSize: 12 }}
              tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
            />
            <Tooltip
              content={({ active, payload, label }) =>
                active && payload?.length ? (
                  <div className="chart-tooltip">
                    <p className="tooltip-label">{label}</p>
                    <p style={{ color: '#10b981' }}>Avg: <strong>₹{payload[0].value.toLocaleString()}</strong></p>
                  </div>
                ) : null
              }
              cursor={{ fill: 'rgba(16,185,129,0.08)' }}
            />
            <Bar dataKey="avgSalary" name="Avg Salary" radius={[6,6,0,0]}>
              {salaryData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      ),
    },
    active: {
      title: 'Active vs Inactive Employees',
      subtitle: 'Current employment activity status',
      render: () => (
        <ResponsiveContainer width="100%" height={320}>
          <PieChart>
            <Pie
              data={activeData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={120}
              innerRadius={65}
              paddingAngle={4}
              label={({ name, value }) => `${name}: ${value}`}
              labelLine={{ stroke: 'rgba(255,255,255,0.2)' }}
            >
              <Cell fill="#10b981" />
              <Cell fill="#ef4444" />
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              iconType="circle"
              formatter={(val) => <span style={{ color: '#cbd5e1' }}>{val}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      ),
    },
  };

  const chart = charts[type];
  if (!chart) return null;

  return (
    <div className="chart-overlay" onClick={onClose}>
      <div className="chart-modal glass-panel" onClick={(e) => e.stopPropagation()}>
        <div className="chart-modal-header">
          <div>
            <h2>{chart.title}</h2>
            <p>{chart.subtitle}</p>
          </div>
          <button className="close-btn" onClick={onClose}><FiX /></button>
        </div>
        <div className="chart-body">{chart.render()}</div>
      </div>
    </div>
  );
};

export default ChartModal;
