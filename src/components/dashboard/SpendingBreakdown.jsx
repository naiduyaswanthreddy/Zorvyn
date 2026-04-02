import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { useFinance } from '../../store/FinanceContext';

const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#14B8A6'];

export default function SpendingBreakdown() {
  const { chartData } = useFinance();
  const data = chartData.categoryData.length > 0 ? chartData.categoryData : [
    { name: 'No data', value: 1 },
  ];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={65}
          outerRadius={95}
          paddingAngle={4}
          dataKey="value"
          stroke="none"
          isAnimationActive={true}
          animationDuration={1000}
        >
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={data[0].name === 'No data' ? '#94A3B8' : COLORS[index % COLORS.length]}
              className="hover:opacity-80 transition-opacity cursor-pointer"
            />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            background: 'hsl(var(--tooltip-bg))',
            border: '1px solid hsl(var(--tooltip-border))',
            borderRadius: '12px',
            color: 'hsl(var(--text-primary))',
            boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
          }}
          formatter={(value, name) => [`₹${value.toLocaleString()}`, name]}
        />
        <Legend
          verticalAlign="bottom"
          height={36}
          iconType="circle"
          wrapperStyle={{ fontSize: 12, color: 'hsl(var(--text-muted))' }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
