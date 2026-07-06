import { useMemo, useState } from 'react'
import { Select, Spin } from 'antd'
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
import {
  mapMonthlyRevenueToChart,
  useGetOverviewYearlyRevenueQuery,
} from '../../redux/api/overviewApi'

type RangeKey = 'last-year' | 'this-year' | 'last-6'

const formatCurrency = (n: number) =>
  `₵${n.toLocaleString('en-US', { maximumFractionDigits: 0 })}`

const formatYAxis = (value: number) => {
  if (value >= 1000) return `₵${value / 1000}k`
  return `₵${value}`
}

function getYearForRange(range: RangeKey) {
  const currentYear = new Date().getFullYear()
  return range === 'last-year' ? currentYear - 1 : currentYear
}

export default function RevenueChart() {
  const [range, setRange] = useState<RangeKey>('this-year')
  const year = getYearForRange(range)
  const { data, isLoading, isFetching } = useGetOverviewYearlyRevenueQuery(year)

  const chartData = useMemo(() => {
    const points = mapMonthlyRevenueToChart(data?.data?.monthlyRevenue ?? [])
    if (range !== 'last-6') return points

    const currentMonth = new Date().getMonth()
    return points.slice(Math.max(0, currentMonth - 5), currentMonth + 1)
  }, [data, range])

  const loading = isLoading || isFetching

  return (
    <div className="rounded-2xl border border-surface-border bg-surface-card p-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">Revenue Overview</h2>
        <Select<RangeKey>
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

      <div className="relative mt-4 h-[300px] w-full">
        {loading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-surface-card/60">
            <Spin />
          </div>
        )}
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 24, right: 16, left: 0, bottom: 8 }}>
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
              tickFormatter={formatYAxis}
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
              formatter={(value, _name, item) => {
                const orderCount = item?.payload?.orderCount ?? 0
                return [
                  `${formatCurrency(Number(value) || 0)} (${orderCount} orders)`,
                  'Revenue',
                ]
              }}
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
