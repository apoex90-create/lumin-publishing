'use client';

import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Eye, Users, ShoppingBag } from 'lucide-react';

const monthlyData = [
  { month: 'Jan', sales: 45, revenue: 18000 },
  { month: 'Feb', sales: 62, revenue: 24800 },
  { month: 'Mar', sales: 88, revenue: 35200 },
  { month: 'Apr', sales: 104, revenue: 41600 },
  { month: 'May', sales: 78, revenue: 31200 },
  { month: 'Jun', sales: 132, revenue: 52800 },
];

const channelData = [
  { name: 'LUMIN Store', value: 45, color: '#1f1547' },
  { name: 'Amazon', value: 30, color: '#d4a017' },
  { name: 'Apple Books', value: 15, color: '#871f2d' },
  { name: 'Google Play', value: 10, color: '#3d298d' },
];

const stats = [
  { label: 'Total Revenue', value: '₹2,03,600', change: '+24%', icon: TrendingUp },
  { label: 'Page Views', value: '14,820', change: '+18%', icon: Eye },
  { label: 'Unique Readers', value: '3,240', change: '+12%', icon: Users },
  { label: 'Books Sold', value: '509', change: '+32%', icon: ShoppingBag },
];

export default function AnalyticsPage() {
  return (
    <div>
      <div className="mb-10">
        <p className="eyebrow">Performance</p>
        <h2 className="font-display text-4xl text-royal-900">Analytics</h2>
        <p className="text-ink-900/60 mt-2">Real-time insights into your books' performance.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {stats.map((s, i) => (
          <div key={i} className="card-premium p-6">
            <s.icon className="w-5 h-5 text-gold-600 mb-3" />
            <p className="font-display text-3xl text-royal-900">{s.value}</p>
            <div className="flex items-center justify-between mt-2">
              <p className="text-xs tracking-widest uppercase text-ink-900/60">{s.label}</p>
              <span className="text-xs text-green-700 font-semibold">{s.change}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card-premium p-6">
          <h3 className="font-display text-2xl text-royal-900 mb-1">Revenue Trend</h3>
          <p className="text-sm text-ink-900/60 mb-6">Monthly revenue across all books (₹)</p>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#dcd6f0" />
              <XAxis dataKey="month" stroke="#1a1625" style={{ fontSize: 12 }} />
              <YAxis stroke="#1a1625" style={{ fontSize: 12 }} />
              <Tooltip contentStyle={{ backgroundColor: '#fdfcf8', border: '1px solid #dcd6f0', borderRadius: 12 }} />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#d4a017"
                strokeWidth={3}
                dot={{ fill: '#1f1547', r: 5 }}
                activeDot={{ r: 7, fill: '#d4a017' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="card-premium p-6">
          <h3 className="font-display text-2xl text-royal-900 mb-1">Sales by Channel</h3>
          <p className="text-sm text-ink-900/60 mb-6">Where readers find you</p>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={channelData} cx="50%" cy="50%" innerRadius={45} outerRadius={80} paddingAngle={2} dataKey="value">
                {channelData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {channelData.map((c, i) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full" style={{ background: c.color }} />
                  <span>{c.name}</span>
                </div>
                <span className="font-semibold text-royal-900">{c.value}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-3 card-premium p-6">
          <h3 className="font-display text-2xl text-royal-900 mb-1">Monthly Book Sales</h3>
          <p className="text-sm text-ink-900/60 mb-6">Units sold per month</p>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#dcd6f0" />
              <XAxis dataKey="month" stroke="#1a1625" style={{ fontSize: 12 }} />
              <YAxis stroke="#1a1625" style={{ fontSize: 12 }} />
              <Tooltip contentStyle={{ backgroundColor: '#fdfcf8', border: '1px solid #dcd6f0', borderRadius: 12 }} />
              <Bar dataKey="sales" fill="url(#barGrad)" radius={[8, 8, 0, 0]} />
              <defs>
                <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3d298d" />
                  <stop offset="100%" stopColor="#1f1547" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
