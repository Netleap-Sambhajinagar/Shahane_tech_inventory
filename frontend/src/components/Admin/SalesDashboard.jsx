import React, { useState, useEffect, useMemo } from 'react';
import Papa from 'papaparse';
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend,
    AreaChart, Area, CartesianGrid,
} from 'recharts';
import { getApiUrl } from '../../utils/api';

const fmt = (n) => {
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`;
    if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
    return n.toFixed(2);
};

const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
];

const SalesDashboard = () => {
    const [rawData, setRawData] = useState([]);
    const [loading, setLoading] = useState(true);

    const [stateFilter, setStateFilter] = useState('All');
    const [deliveryFilter, setDeliveryFilter] = useState('All');
    const [orderDateFilter, setOrderDateFilter] = useState('All');
    const [customerTypeFilter, setCustomerTypeFilter] = useState('All');

    useEffect(() => {
        const fetchData = async () => {
            try {
                // 1. Fetch live SQL data from API
                const token = localStorage.getItem('adminToken');
                const apiRes = await fetch(getApiUrl('/api/orders'), {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                
                let dbData = [];
                if (apiRes.ok) {
                    const dbOrders = await apiRes.json();
                    
                    // Transform DB orders to match dashboard format
                    dbData = dbOrders.map(order => {
                        // Calculate total quantity across items
                        const totalQty = order.items ? order.items.reduce((sum, item) => sum + (parseFloat(item.quantity) || 0), 0) : 0;
                        
                        return {
                            Order_Date: order.order_date ? order.order_date.split('T')[0] : '',
                            State: order.state || 'Maharashtra',
                            Delivery_Status: order.status || 'Pending',
                            Customer_Type: order.customer_type || 'Regular',
                            Quantity_Sold: totalQty,
                            // If prize is total for order, we estimate unit price
                            Selling_Price: totalQty > 0 ? (order.prize / totalQty) : order.prize,
                            // Estimate landed cost (approx 70% of prize) for profit calculation
                            Landed_Cost: totalQty > 0 ? (order.prize * 0.7) / totalQty : (order.prize * 0.7),
                            Product_Name: order.items && order.items.length > 0 ? order.items[0].product_name : 'Direct Order',
                            Sales_Channel: 'Direct' 
                        };
                    });
                }

                // 2. Fetch CSV for historical reference
                const csvRes = await fetch('/dataset.csv');
                const csvText = await csvRes.text();
                const { data: csvData } = Papa.parse(csvText, { header: true, skipEmptyLines: true });

                // Merge live SQL data with CSV data
                setRawData([...dbData, ...csvData]);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching data:', err);
                // Fallback to just CSV if API fails
                try {
                    const csvRes = await fetch('/dataset.csv');
                    const csvText = await csvRes.text();
                    const { data: csvData } = Papa.parse(csvText, { header: true, skipEmptyLines: true });
                    setRawData(csvData);
                } catch (csvErr) {
                    console.error('CSV fallback failed:', csvErr);
                }
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const filterOptions = useMemo(() => {
        const unique = (key) => [...new Set(rawData.map(r => r[key]).filter(Boolean))].sort();
        return {
            states: unique('State'),
            deliveryStatuses: unique('Delivery_Status'),
            orderDates: unique('Order_Date'),
            customerTypes: unique('Customer_Type'),
        };
    }, [rawData]);

    const filtered = useMemo(() => {
        return rawData.filter(r => {
            if (stateFilter !== 'All' && r.State !== stateFilter) return false;
            if (deliveryFilter !== 'All' && r.Delivery_Status !== deliveryFilter) return false;
            if (orderDateFilter !== 'All' && r.Order_Date !== orderDateFilter) return false;
            if (customerTypeFilter !== 'All' && r.Customer_Type !== customerTypeFilter) return false;
            return true;
        });
    }, [rawData, stateFilter, deliveryFilter, orderDateFilter, customerTypeFilter]);

    const kpis = useMemo(() => {
        let totalRevenue = 0, totalCost = 0, totalQty = 0, count = 0;
        filtered.forEach(r => {
            const qty = parseFloat(r.Quantity_Sold) || 0;
            const sp = parseFloat(r.Selling_Price) || 0;
            const lc = parseFloat(r.Landed_Cost) || 0;
            totalRevenue += qty * sp;
            totalCost += qty * lc;
            totalQty += qty;
            count++;
        });
        const totalProfit = totalRevenue - totalCost;
        const avgSP = count ? totalRevenue / totalQty : 0;
        const marginPct = totalRevenue ? (totalProfit / totalRevenue) * 100 : 0;
        return { totalRevenue, totalProfit, avgSP, marginPct };
    }, [filtered]);

    const productSales = useMemo(() => {
        const map = {};
        filtered.forEach(r => {
            const name = r.Product_Name || 'Unknown';
            const rev = (parseFloat(r.Quantity_Sold) || 0) * (parseFloat(r.Selling_Price) || 0);
            map[name] = (map[name] || 0) + rev;
        });
        return Object.entries(map)
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value).slice(0, 10);
    }, [filtered]);

    const customerTypeData = useMemo(() => {
        const map = {};
        filtered.forEach(r => {
            const ct = r.Customer_Type || 'Unknown';
            const rev = (parseFloat(r.Quantity_Sold) || 0) * (parseFloat(r.Selling_Price) || 0);
            map[ct] = (map[ct] || 0) + rev;
        });
        return Object.entries(map).map(([name, value]) => ({ name, value }));
    }, [filtered]);

    const channelData = useMemo(() => {
        const map = {};
        filtered.forEach(r => {
            const ch = r.Sales_Channel || 'Unknown';
            const rev = (parseFloat(r.Quantity_Sold) || 0) * (parseFloat(r.Selling_Price) || 0);
            map[ch] = (map[ch] || 0) + rev;
        });
        return Object.entries(map).map(([name, value]) => ({ name, value }));
    }, [filtered]);

    const monthlySales = useMemo(() => {
        const map = {};
        filtered.forEach(r => {
            if (!r.Order_Date) return;
            const month = parseInt(r.Order_Date.split('-')[1], 10);
            const rev = (parseFloat(r.Quantity_Sold) || 0) * (parseFloat(r.Selling_Price) || 0);
            map[month] = (map[month] || 0) + rev;
        });
        return monthNames.map((m, i) => ({ month: m, revenue: map[i + 1] || 0 }));
    }, [filtered]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px] text-slate-400">
                <div className="text-center">
                    <div className="text-xl font-bold mb-2">Loading Analytics...</div>
                    <div className="text-sm">Processing sales data</div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto overflow-hidden">
            {/* ── FILTERS ROW ── */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em]">Filter Analytics</h2>
                    <button
                        onClick={() => { setStateFilter('All'); setDeliveryFilter('All'); setOrderDateFilter('All'); setCustomerTypeFilter('All'); }}
                        className="text-[10px] font-black text-blue-600 hover:text-blue-700 uppercase tracking-widest transition-colors"
                    >
                        Reset Filters
                    </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Region / State</label>
                        <select 
                            value={stateFilter} 
                            onChange={(e) => setStateFilter(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-bold text-slate-900 outline-none focus:bg-white focus:border-blue-600 transition-all cursor-pointer"
                        >
                            <option value="All">All Regions</option>
                            {filterOptions.states.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Delivery Status</label>
                        <select 
                            value={deliveryFilter} 
                            onChange={(e) => setDeliveryFilter(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-bold text-slate-900 outline-none focus:bg-white focus:border-blue-600 transition-all cursor-pointer"
                        >
                            <option value="All">All Statuses</option>
                            {filterOptions.deliveryStatuses.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Timeline</label>
                        <select 
                            value={orderDateFilter} 
                            onChange={(e) => setOrderDateFilter(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-bold text-slate-900 outline-none focus:bg-white focus:border-blue-600 transition-all cursor-pointer"
                        >
                            <option value="All">Lifetime</option>
                            {filterOptions.orderDates.map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Customer Segment</label>
                        <select 
                            value={customerTypeFilter} 
                            onChange={(e) => setCustomerTypeFilter(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-bold text-slate-900 outline-none focus:bg-white focus:border-blue-600 transition-all cursor-pointer"
                        >
                            <option value="All">All Segments</option>
                            {filterOptions.customerTypes.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                    </div>
                </div>
            </div>

            {/* ── KPI CARDS ── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {[
                    { label: 'Total Net Profit', value: `₹ ${fmt(kpis.totalProfit)}`, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
                    { label: 'Gross Revenue', value: `₹ ${fmt(kpis.totalRevenue)}`, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
                    { label: 'Avg Unit Sale', value: `₹ ${kpis.avgSP.toFixed(2)}`, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100' },
                    { label: 'Margin Efficiency', value: `${kpis.marginPct.toFixed(2)}%`, color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-100' },
                ].map((kpi, i) => (
                    <div key={i} className={`${kpi.bg} ${kpi.border} border-2 rounded-[2rem] p-8 shadow-sm transition-transform hover:scale-[1.02] duration-300`}>
                        <div className={`text-3xl font-black ${kpi.color} mb-1 tracking-tighter`}>{kpi.value}</div>
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{kpi.label}</div>
                    </div>
                ))}
            </div>

            {/* ── CHARTS ROW 1 ── */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Product-wise Sales */}
                <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-8">Product Performance</h3>
                    <div className="h-[320px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={productSales} layout="vertical" margin={{ left: -20, right: 40 }}>
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" width={110} tick={{ fontSize: 10, fontWeight: 700, fill: '#64748b' }} axisLine={false} tickLine={false} />
                                <Tooltip formatter={(v) => `₹ ${fmt(v)}`} contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 40px rgba(0,0,0,0.05)', fontSize: '12px', fontWeight: 'bold' }} />
                                <Bar dataKey="value" fill="#1e293b" radius={[0, 10, 10, 0]} barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Revenue by Customer Type */}
                <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-8">Segment Revenue</h3>
                    <div className="h-[320px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={customerTypeData} margin={{ top: 20 }}>
                                <XAxis dataKey="name" tick={{ fontSize: 11, fontWeight: 800, fill: '#64748b' }} axisLine={false} tickLine={false} />
                                <YAxis hide />
                                <Tooltip formatter={(v) => `₹ ${fmt(v)}`} contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 40px rgba(0,0,0,0.05)' }} />
                                <Bar dataKey="value" fill="#3b82f6" radius={[12, 12, 0, 0]} barSize={60} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Sales Channel Distribution */}
                <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-8">Channel Split</h3>
                    <div className="h-[320px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={channelData} dataKey="value" nameKey="name"
                                    cx="50%" cy="50%" innerRadius={70} outerRadius={100}
                                    paddingAngle={10}
                                >
                                    {channelData.map((_, i) => (
                                        <Cell key={i} fill={i === 0 ? '#1e293b' : '#3b82f6'} fillOpacity={i === 0 ? 1 : 0.6} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(v) => `₹ ${fmt(v)}`} contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 40px rgba(0,0,0,0.05)' }} />
                                <Legend verticalAlign="bottom" iconType="circle" wrapperStyle={{ paddingTop: '30px', fontSize: '11px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '1px' }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* ── Monthly Sales Trend ── */}
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-10">Revenue Velocity Trend</h3>
                <div className="h-[380px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={monthlySales} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15}/>
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis 
                                dataKey="month" 
                                tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} 
                                axisLine={false} 
                                tickLine={false} 
                                dy={15}
                            />
                            <YAxis 
                                tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} 
                                axisLine={false} 
                                tickLine={false} 
                                tickFormatter={(v) => fmt(v)}
                            />
                            <Tooltip formatter={(v) => `₹ ${fmt(v)}`} contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 40px rgba(0,0,0,0.05)' }} />
                            <Area 
                                type="monotone" 
                                dataKey="revenue" 
                                stroke="#3b82f6" 
                                strokeWidth={5} 
                                fillOpacity={1} 
                                fill="url(#colorRev)" 
                                dot={{ fill: '#3b82f6', strokeWidth: 3, r: 5, stroke: '#fff' }}
                                activeDot={{ r: 8, strokeWidth: 0 }}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="text-center py-10">
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em]">Shahane Tech Intel • v2.0.4</p>
            </div>
        </div>
    );
};

export default SalesDashboard;
