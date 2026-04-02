import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useFinance } from '../../store/FinanceContext';

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  const data = payload[0].payload;

  return (
    <div className="rounded-2xl p-4 shadow-2xl min-w-[200px] border"
      style={{ background: 'hsl(var(--tooltip-bg))', borderColor: 'hsl(var(--tooltip-border))' }}
    >
      <div className="flex items-center gap-2 mb-3 pb-3 border-b">
        <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
        <span className="text-sm font-semibold text-primary">{label}</span>
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span className="text-xs text-secondary">Income</span>
          </div>
          <span className="text-sm font-semibold text-emerald-500">
            +₹{(data.income || 0).toLocaleString()}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-rose-400" />
            <span className="text-xs text-secondary">Expenses</span>
          </div>
          <span className="text-sm font-semibold text-rose-500">
            -₹{(data.expense || 0).toLocaleString()}
          </span>
        </div>
        <div className="flex items-center justify-between pt-2 mt-1 border-t">
          <span className="text-xs text-secondary font-medium">Net Balance</span>
          <span className="text-sm font-bold text-primary">
            ₹{data.balance?.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}

function CustomDot({ cx, cy, index, data }) {
  if (index !== data.length - 1) return null;
  return (
    <g>
      <circle cx={cx} cy={cy} r={8} fill="rgba(16, 185, 129, 0.15)" className="animate-ping" />
      <circle cx={cx} cy={cy} r={5} fill="#10B981" className="animate-pulse" />
      <circle cx={cx} cy={cy} r={2.5} fill="#fff" />
    </g>
  );
}

function CustomActiveDot({ cx, cy }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={12} fill="rgba(16, 185, 129, 0.1)" />
      <circle cx={cx} cy={cy} r={7} fill="rgba(16, 185, 129, 0.2)" stroke="#10B981" strokeWidth={2} />
      <circle cx={cx} cy={cy} r={3} fill="#10B981" />
    </g>
  );
}

export default function BalanceChart() {
  const { chartData } = useFinance();
  const data = chartData.monthlyData.length > 1 ? chartData.monthlyData : [
    { name: 'Jan', balance: 5281.01, income: 6000, expense: 1179.99 },
    { name: 'Feb', balance: 11785.21, income: 7400, expense: 887.80 },
    { name: 'Mar', balance: 20139.22, income: 9700, expense: 1346.68 },
  ];

  const latestBalance = data[data.length - 1]?.balance || 0;
  const prevBalance = data.length >= 2 ? data[data.length - 2]?.balance : 0;
  const change = latestBalance - prevBalance;
  const changePct = prevBalance > 0 ? ((change / prevBalance) * 100).toFixed(1) : '0.0';

  return (
    <div>
      <div className="flex items-baseline gap-3 mb-1">
        <span className="text-3xl font-bold text-primary tracking-tight">
          ₹{latestBalance.toLocaleString()}
        </span>
        <span className={`text-sm font-semibold ${change >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
          {change >= 0 ? '+' : ''}{changePct}%
        </span>
      </div>
      <p className="text-xs text-muted mb-6">Running balance across all months</p>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10B981" stopOpacity={0.35} />
                <stop offset="40%" stopColor="#10B981" stopOpacity={0.15} />
                <stop offset="100%" stopColor="#10B981" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="strokeGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#059669" />
                <stop offset="50%" stopColor="#10B981" />
                <stop offset="100%" stopColor="#34D399" />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            <CartesianGrid
              strokeDasharray="4 6"
              stroke="hsl(var(--text-muted) / 0.08)"
              vertical={false}
            />

            <XAxis
              dataKey="name"
              tick={{ fill: 'hsl(var(--text-muted))', fontSize: 12, fontWeight: 500 }}
              tickLine={false}
              axisLine={{ stroke: 'hsl(var(--text-muted) / 0.1)' }}
              dy={8}
            />

            <YAxis
              tick={{ fill: 'hsl(var(--text-muted))', fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`}
              width={55}
            />

            <Tooltip
              content={<CustomTooltip />}
              cursor={{
                stroke: 'hsl(var(--accent) / 0.3)',
                strokeWidth: 1,
                strokeDasharray: '4 4',
              }}
            />

            <Area
              type="monotone"
              dataKey="balance"
              stroke="url(#strokeGradient)"
              strokeWidth={2.5}
              fill="url(#balanceGradient)"
              filter="url(#glow)"
              isAnimationActive={true}
              animationDuration={1500}
              animationEasing="ease-out"
              dot={(props) => <CustomDot {...props} data={data} />}
              activeDot={<CustomActiveDot />}
              connectNulls
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
