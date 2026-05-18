'use client';

import { useEffect, useState } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { TrendingUp, Users, BookOpen, Globe } from 'lucide-react';

const monthlyData = [
  { month: 'Jan', authors: 120, books: 80, revenue: 180000 },
  { month: 'Feb', authors: 150, books: 110, revenue: 240000 },
  { month: 'Mar', authors: 220, books: 165, revenue: 320000 },
  { month: 'Apr', authors: 310, books: 240, revenue: 480000 },
  { month: 'May', authors: 380, books: 290, revenue: 560000 },
  { month: 'Jun', authors: 450, books: 370, revenue: 720000 },
];

const genreData = [
  { name: 'Literary Fiction', value: 28, color: '#1f1547' },
  { name: 'Romance', value: 22, color: '#871f2d' },
  { name: 'Mystery', value: 18, color: '#d4a017' },
  { name: 'Sci-Fi', value: 12, color: '#3d298d' },
  { name: 'Non-Fiction', value: 10, color: '#a87d0f' },
  { name: 'Other', value: 10, color: '#705cc0' },
];

const countryData = [
  { country: 'India', authors: 1450 },
  { country: 'USA', authors: 480 },
  { country: 'UK', authors: 220 },
  { country: 'Canada', authors: 140 },
  { country: 'Australia', authors: 110 },
];

export default function AdminPlatformPage() {
  return (
    <div>
      <div className="mb-8">
        <p className="text-[10px] tracking-[0.3em] uppercase text-gold-400 font-bold">Platform Health</p>
        <h2 className="font-display text-4xl text-cream-50 italic">Platform Statistics</h2>
        <p className="text-cream-100/50 mt-2 text-sm">Real-time insights into platform growth and performance.</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'New Authors (30d)', value: '+247', icon: Users, color: 'from-royal-600 to-royal-800', change: '+34%' },
          { label: 'New Books (30d)', value: '+182', icon: BookOpen, color: 'from-burgundy-500 to-burgundy-700', change: '+28%' },
          { label: 'Revenue (30d)', value: '₹7.2L', icon: TrendingUp, color: 'from-gold-500 to-gold-700', change: '+42%' },
          { label: 'Countries Reached', value: '187', icon: Globe, color: 'from-green-600 to-green-800', change: '+12' },
        ].map((s, i) => (
          <div key={i} className="bg-ink-900/60 border border-cream-100/10 rounded-2xl p-5">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center mb-3`}>
              <s.icon className="w-4 h-4 text-cream-50" />
            </div>
            <p className="font-display text-3xl text-cream-50">{s.value}</p>
            <div className="flex items-center justify-between mt-2">
              <p className="text-xs tracking-widest uppercase text-cream-100/50">{s.label}</p>
              <span className="text-xs text-green-300 font-semibold">{s.change}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-ink-900/60 border border-cream-100/10 rounded-2xl p-6">
          <h3 className="font-display text-xl text-cream-50 mb-1">Author Growth</h3>
          <p className="text-xs text-cream-100/50 mb-4">Monthly new author signups</p>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={monthlyData}>
              <defs>
                <linearGradient id="authorGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#d4a017" stopOpacity={0.6} />
                  <stop offset="100%" stopColor="#d4a017" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a2438" />
              <XAxis dataKey="month" stroke="#cccccc60" style={{ fontSize: 11 }} />
              <YAxis stroke="#cccccc60" style={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ backgroundColor: '#0d0b14', border: '1px solid #d4a01740', borderRadius: 12, color: '#faf6ec' }} />
              <Area type="monotone" dataKey="authors" stroke="#d4a017" strokeWidth={2} fill="url(#authorGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-ink-900/60 border border-cream-100/10 rounded-2xl p-6">
          <h3 className="font-display text-xl text-cream-50 mb-1">Revenue Trend</h3>
          <p className="text-xs text-cream-100/50 mb-4">Monthly platform revenue (₹)</p>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a2438" />
              <XAxis dataKey="month" stroke="#cccccc60" style={{ fontSize: 11 }} />
              <YAxis stroke="#cccccc60" style={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ backgroundColor: '#0d0b14', border: '1px solid #d4a01740', borderRadius: 12, color: '#faf6ec' }} />
              <Line type="monotone" dataKey="revenue" stroke="#d4a017" strokeWidth={3} dot={{ fill: '#1f1547', r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-ink-900/60 border border-cream-100/10 rounded-2xl p-6">
          <h3 className="font-display text-xl text-cream-50 mb-1">Books by Genre</h3>
          <p className="text-xs text-cream-100/50 mb-4">Distribution across categories</p>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={genreData} cx="50%" cy="50%" innerRadius={50} outerRadius={90} paddingAngle={2} dataKey="value">
                {genreData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#0d0b14', border: '1px solid #d4a01740', borderRadius: 12, color: '#faf6ec' }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-2 space-y-1">
            {genreData.map((g, i) => (
              <div key={i} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full" style={{ background: g.color }} /><span className="text-cream-100/70">{g.name}</span></div>
                <span className="text-cream-50 font-semibold">{g.value}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-ink-900/60 border border-cream-100/10 rounded-2xl p-6">
          <h3 className="font-display text-xl text-cream-50 mb-1">Authors by Country</h3>
          <p className="text-xs text-cream-100/50 mb-4">Top 5 countries</p>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={countryData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#2a2438" />
              <XAxis type="number" stroke="#cccccc60" style={{ fontSize: 11 }} />
              <YAxis dataKey="country" type="category" stroke="#cccccc60" style={{ fontSize: 11 }} width={80} />
              <Tooltip contentStyle={{ backgroundColor: '#0d0b14', border: '1px solid #d4a01740', borderRadius: 12, color: '#faf6ec' }} />
              <Bar dataKey="authors" fill="#d4a017" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
