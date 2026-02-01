import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Generate mock data based on filter
const generateDataByFilter = (filter) => {
    if (filter === 'today') {
        const hours = ['9 AM', '11 AM', '1 PM', '3 PM', '5 PM', '7 PM', '9 PM'];
        return hours.map(hour => ({
            name: hour,
            revenue: Math.floor(Math.random() * 2000) + 500,
            orders: Math.floor(Math.random() * 10) + 1,
        }));
    } else if (filter === 'month') {
        const weeks = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
        return weeks.map(week => ({
            name: week,
            revenue: Math.floor(Math.random() * 15000) + 5000,
            orders: Math.floor(Math.random() * 50) + 10,
        }));
    } else {
        // Default to week
        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        return days.map(day => ({
            name: day,
            revenue: Math.floor(Math.random() * 5000) + 1000,
            orders: Math.floor(Math.random() * 20) + 5,
        }));
    }
};

const getSubtitle = (filter) => {
    switch (filter) {
        case 'today': return "Today's performance";
        case 'month': return "This month's performance";
        default: return "Last 7 days performance";
    }
};

export default function RevenueChart({ data = null, dateFilter = 'week' }) {
    const chartData = data || generateDataByFilter(dateFilter);
    const subtitle = getSubtitle(dateFilter);

    return (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm" style={{ padding: '20px' }}>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-lg font-bold text-slate-800">Revenue Overview</h3>
                    <p className="text-sm text-slate-500">{subtitle}</p>
                </div>
                <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500" />
                        <span className="text-slate-600">Revenue</span>
                    </div>
                </div>
            </div>

            <div className="h-64 min-h-[200px]">
                <ResponsiveContainer width="100%" height="100%" minWidth={200} minHeight={200}>
                    <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#94a3b8', fontSize: 12 }}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#94a3b8', fontSize: 12 }}
                            tickFormatter={(value) => `₹${value}`}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'white',
                                border: 'none',
                                borderRadius: '12px',
                                boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                                padding: '12px 16px',
                            }}
                            labelStyle={{ color: '#1e293b', fontWeight: 600, marginBottom: '4px' }}
                            formatter={(value) => [`₹${value.toLocaleString()}`, 'Revenue']}
                        />
                        <Area
                            type="monotone"
                            dataKey="revenue"
                            stroke="#8b5cf6"
                            strokeWidth={3}
                            fill="url(#revenueGradient)"
                            dot={false}
                            activeDot={{ r: 6, fill: '#8b5cf6', stroke: 'white', strokeWidth: 2 }}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
