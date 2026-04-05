import { useApp } from '../context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { PageTransition } from '../components/PageTransition';
import { motion } from 'motion/react';
import {
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { TrendingUp, TrendingDown, Wallet, PiggyBank, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { useMemo, useState, useEffect } from 'react';

export const Dashboard = () => {
  const { transactions } = useApp();

  const summary = useMemo(() => {
    const totalIncome = transactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = transactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const balance = totalIncome - totalExpenses;
    const savingsRate = totalIncome > 0 ? ((balance / totalIncome) * 100).toFixed(1) : '0';

    return { totalIncome, totalExpenses, balance, savingsRate };
  }, [transactions]);

  // Balance trend data (grouped by month)
  const balanceTrendData = useMemo(() => {
    const monthlyData = {};

    transactions.forEach((t) => {
      const month = t.date.substring(0, 7); // YYYY-MM
      if (!monthlyData[month]) {
        monthlyData[month] = { income: 0, expenses: 0 };
      }
      if (t.type === 'income') {
        monthlyData[month].income += t.amount;
      } else {
        monthlyData[month].expenses += t.amount;
      }
    });

    return Object.entries(monthlyData)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, data]) => ({
        month: new Date(month + '-01').toLocaleDateString('en-US', {
          month: 'short',
        }),
        income: data.income,
        expenses: data.expenses,
        balance: data.income - data.expenses,
      }));
  }, [transactions]);

  // Category spending data
  const categoryData = useMemo(() => {
    const categoryTotals = {};

    transactions
      .filter((t) => t.type === 'expense')
      .forEach((t) => {
        categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
      });

    return Object.entries(categoryTotals)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [transactions]);

  const processedCategoryData = useMemo(() => {
    if (categoryData.length <= 6) return categoryData;
    const sorted = [...categoryData].sort((a, b) => b.value - a.value);
    const top5 = sorted.slice(0, 5);
    const othersValue = sorted.slice(5).reduce((sum, item) => sum + item.value, 0);
    if (othersValue > 0) {
      top5.push({ name: 'Others', value: othersValue });
    }
    return top5;
  }, [categoryData]);

  const [activeIndex, setActiveIndex] = useState(-1);

  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const outerRadius = windowWidth < 640 ? 60 : windowWidth < 1024 ? 70 : 80;
  const innerRadius = windowWidth < 640 ? 30 : windowWidth < 1024 ? 35 : 40;
  const showLabel = windowWidth >= 768;

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="font-semibold text-gray-900 dark:text-white">{data.payload.name}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Amount: {formatCurrency(data.value)}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Percentage: {(data.percent * 100).toFixed(1)}%
          </p>
        </div>
      );
    }
    return null;
  };

  const renderActiveShape = (props) => {
    const { cx, cy, midAngle, innerRadius, outerRadius, percent, ...rest } = props;
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <g>
        <Pie {...rest} outerRadius={outerRadius + 6} stroke="#333" strokeWidth={2} />
        <text x={x} y={y} fill="#333" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontSize="14" fontWeight="bold">
          {`${(percent * 100).toFixed(0)}%`}
        </text>
      </g>
    );
  };

  const CustomLegend = ({ data, colors }) => (
    <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
      {data.map((entry, index) => (
        <div key={entry.name} className="flex items-center gap-2">
          <div
            className="w-4 h-4 rounded-full border border-gray-300 dark:border-gray-600"
            style={{ backgroundColor: colors[index % colors.length] }}
          ></div>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{entry.name}</span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            ({((entry.value / data.reduce((sum, d) => sum + d.value, 0)) * 100).toFixed(1)}%)
          </span>
        </div>
      ))}
    </div>
  );

  const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#06B6D4'];

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const statCards = [
    {
      title: 'Total Balance',
      value: formatCurrency(summary.balance),
      icon: Wallet,
      gradient: 'from-indigo-500 to-purple-500',
      trend: { value: '+12.5%', positive: true },
    },
    {
      title: 'Total Income',
      value: formatCurrency(summary.totalIncome),
      icon: TrendingUp,
      gradient: 'from-cyan-500 to-blue-500',
      trend: { value: '+8.2%', positive: true },
    },
    {
      title: 'Total Expenses',
      value: formatCurrency(summary.totalExpenses),
      icon: TrendingDown,
      gradient: 'from-amber-500 to-orange-500',
      trend: { value: '-3.1%', positive: true },
    },
    {
      title: 'Savings Rate',
      value: `${summary.savingsRate}%`,
      icon: PiggyBank,
      gradient: 'from-emerald-500 to-teal-500',
      trend: { value: '+2.4%', positive: true },
    },
  ];

  return (
    <PageTransition>
      <div className="max-w-7xl mx-auto">
        <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-500 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
            Dashboard Overview
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Track your financial summary and trends
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
                whileHover={{ y: -4 }}
              >
                <Card className="relative overflow-hidden border-gray-200 dark:border-white/[0.08] hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                          {stat.title}
                        </p>
                        <motion.h3
                          className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2"
                          initial={{ scale: 0.8 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: index * 0.1 + 0.2, type: 'spring' }}
                        >
                          {stat.value}
                        </motion.h3>
                        {stat.trend && (
                          <div className="flex items-center gap-1 text-sm">
                            {stat.trend.positive ? (
                              <ArrowUpRight className="w-4 h-4 text-emerald-500" />
                            ) : (
                              <ArrowDownRight className="w-4 h-4 text-rose-500" />
                            )}
                            <span className={stat.trend.positive ? 'text-emerald-500' : 'text-rose-500'}>
                              {stat.trend.value}
                            </span>
                            <span className="text-gray-500 dark:text-gray-400">vs last month</span>
                          </div>
                        )}
                      </div>
                      <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.gradient} shadow-lg`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 lg:gap-6">
          {/* Balance Trend Chart - Takes 2 columns */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="xl:col-span-2"
          >
            <Card className="border-gray-200 dark:border-white/[0.08] shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl">Income vs Expenses</CardTitle>
                <p className="text-sm text-gray-500 dark:text-gray-400">Monthly comparison</p>
              </CardHeader>
              <CardContent>
                <div className="h-64 sm:h-72 lg:h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={balanceTrendData}>
                      <defs>
                        <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(156, 163, 175, 0.2)" />
                      <XAxis
                        dataKey="month"
                        stroke="#9CA3AF"
                        style={{ fontSize: '12px' }}
                      />
                      <YAxis
                        stroke="#9CA3AF"
                        style={{ fontSize: '12px' }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'var(--card)',
                          border: '1px solid var(--border)',
                          borderRadius: '12px',
                          color: 'var(--card-foreground)',
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="income"
                        stroke="#10B981"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorIncome)"
                        animationDuration={1000}
                      />
                      <Area
                        type="monotone"
                        dataKey="expenses"
                        stroke="#EF4444"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorExpenses)"
                        animationDuration={1000}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Category Breakdown Chart */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
          >
            <Card className="border-gray-200 dark:border-white/[0.08] shadow-sm hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="text-xl">Category Breakdown</CardTitle>
                <p className="text-sm text-gray-500 dark:text-gray-400">Distribution of your spending</p>
              </CardHeader>
              <CardContent>
                <div className="w-full h-64 sm:h-72 lg:h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={processedCategoryData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={showLabel ? ({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%` : false}
                        outerRadius={outerRadius}
                        innerRadius={innerRadius}
                        fill="#8884d8"
                        dataKey="value"
                        animationDuration={1000}
                        // activeIndex={activeIndex}
                        // activeShape={renderActiveShape}
                        onMouseEnter={(_, index) => setActiveIndex(index)}
                        onMouseLeave={() => setActiveIndex(-1)}
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4">
                  <CustomLegend data={processedCategoryData} colors={COLORS} />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Recent Transactions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
        >
          <Card className="border-gray-200 dark:border-white/[0.08] shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl">Recent Transactions</CardTitle>
              <p className="text-sm text-gray-500 dark:text-gray-400">Latest 5 transactions</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {transactions.slice(0, 5).map((transaction, index) => (
                  <motion.div
                    key={transaction.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.05 }}
                    className={` ${transaction.type === 'income' ? 'bg-emerald-100 dark:bg-emerald-500/10' : 'bg-rose-100 dark:bg-rose-500/10'}  flex  items-center justify-between p-4 rounded-xl hover:${transaction.type === 'income' 
  ? 'bg-emerald-100 dark:bg-emerald-500/10 hover:bg-emerald-200 dark:hover:bg-emerald-500/20' 
  : 'bg-rose-100 dark:bg-rose-500/10 hover:bg-rose-200 dark:hover:bg-rose-500/20'} transition-colors duration-200 border border-gray-100 dark:border-white/[0.05]`}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`p-2.5 rounded-lg ${
                          transaction.type === 'income'
                            ? 'bg-emerald-100 dark:bg-emerald-500/10'
                            : 'bg-rose-100 dark:bg-rose-500/10'
                        }`}
                      >
                        {transaction.type === 'income' ? (
                          <TrendingUp className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                        ) : (
                          <TrendingDown className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-gray-100">{transaction.category}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{transaction.date}</p>
                      </div>
                    </div>
                    <p
                      className={`font-bold text-lg ${
                        transaction.type === 'income'
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : 'text-rose-600 dark:text-rose-400'
                      }`}
                    >
                      {transaction.type === 'income' ? '+' : '-'}
                      {formatCurrency(transaction.amount)}
                    </p>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
        </div>
      </div>
    </PageTransition>
  );
};
