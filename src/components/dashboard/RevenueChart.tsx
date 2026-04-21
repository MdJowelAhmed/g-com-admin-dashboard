import { useState } from 'react'
import { Select } from 'antd'
import { ListFilter } from 'lucide-react'
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

type Point = { month: string; value: number }

const data: Point[] = [
  { month: 'Jan', value: 14200 },
  { month: 'Feb', value: 15600 },
  { month: 'Mar', value: 17300 },
  { month: 'Apr', value: 19800 },
  { month: 'May', value: 22400 },
  { month: 'Jun', value: 38753 },
  { month: 'Jul', value: 29100 },
  { month: 'Aug', value: 25600 },
  { month: 'Sept', value: 22800 },
  { month: 'Oct', value: 12657 },
  { month: 'Nov', value: 20400 },
  { month: 'Des', value: 23100 },
]

const formatCurrency = (n: number) =>
  `$${n.toLocaleString('en-US', { maximumFractionDigits: 0 })}`

export default function RevenueChart() {
  const [range, setRange] = useState('last-year')

  return (
    <div className="rounded-2xl border border-surface-border bg-surface-card p-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">Revenue Overview</h2>
        <Select
          value={range}
          onChange={setRange}
          suffixIcon={<ListFilter size={16} />}
          variant="borderless"
          className="min-w-[130px]"
          options={[
            { value: 'last-year', label: 'Last year' },
            { value: 'this-year', label: 'This year' },
            { value: 'last-6', label: 'Last 6 months' },
          ]}
        />
      </div>

      <div className="mt-4 h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 24, right: 16, left: 0, bottom: 8 }}>
            <CartesianGrid
              stroke="#2e2e34"
              strokeDasharray="3 6"
              vertical
              horizontal={false}
            />
            <XAxis
              dataKey="month"
              stroke="#9ca3af"
              tickLine={false}
              axisLine={false}
              tick={{ fill: '#9ca3af', fontSize: 12 }}
            />
            <YAxis
              stroke="#9ca3af"
              tickLine={false}
              axisLine={false}
              tick={{ fill: '#9ca3af', fontSize: 12 }}
              tickFormatter={(v) => `$${v / 1000}k`}
              width={56}
            />
            <Tooltip
              cursor={{ stroke: '#b5612f', strokeDasharray: '3 3' }}
              contentStyle={{
                backgroundColor: '#242429',
                border: '1px solid #3a3a40',
                borderRadius: 8,
                color: '#fff',
              }}
              formatter={(v) => [formatCurrency(Number(v) || 0), 'Revenue']}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#b5612f"
              strokeWidth={2.5}
              dot={{ r: 3, stroke: '#b5612f', fill: '#b5612f' }}
              activeDot={{ r: 6, stroke: '#b5612f', fill: '#b5612f' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
