import { useApp } from '../context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { PageTransition } from '../components/PageTransition';
import { motion } from 'motion/react';
import { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { TrendingUp, TrendingDown, AlertCircle, DollarSign } from 'lucide-react';

export const Insights = () => {
  const { transactions } = useApp();

  const insights = useMemo(() => {
    // Calculate highest spending category
    const categoryTotals = {};
    transactions
      .filter((t) => t.type === 'expense')
      .forEach((t) => {
        categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
      });

    const highestCategory = Object.entries(categoryTotals).sort(
      ([, a], [, b]) => b - a
    )[0];

    // Monthly comparison (current month vs last month)
    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1);
    const lastMonthStr = `${lastMonth.getFullYear()}-${String(lastMonth.getMonth() + 1).padStart(2, '0')}`;

    const currentMonthExpenses = transactions
      .filter((t) => t.type === 'expense' && t.date.startsWith(currentMonth))
      .reduce((sum, t) => sum + t.amount, 0);

    const lastMonthExpenses = transactions
      .filter((t) => t.type === 'expense' && t.date.startsWith(lastMonthStr))
      .reduce((sum, t) => sum + t.amount, 0);

    const expenseChange = currentMonthExpenses - lastMonthExpenses;
    const expenseChangePercent = lastMonthExpenses
      ? ((expenseChange / lastMonthExpenses) * 100).toFixed(1)
      : '0';

    // Average transaction by type
    const incomeTransactions = transactions.filter((t) => t.type === 'income');
    const expenseTransactions = transactions.filter((t) => t.type === 'expense');

    const avgIncome = incomeTransactions.length
      ? incomeTransactions.reduce((sum, t) => sum + t.amount, 0) / incomeTransactions.length
      : 0;

    const avgExpense = expenseTransactions.length
      ? expenseTransactions.reduce((sum, t) => sum + t.amount, 0) / expenseTransactions.length
      : 0;

    // Monthly breakdown
    const monthlyData = {};

    transactions.forEach((t) => {
      const month = t.date.substring(0, 7);
      if (!monthlyData[month]) {
        monthlyData[month] = { income: 0, expenses: 0, count: 0 };
      }
      if (t.type === 'income') {
        monthlyData[month].income += t.amount;
      } else {
        monthlyData[month].expenses += t.amount;
      }
      monthlyData[month].count++;
    });

    const monthlyChartData = Object.entries(monthlyData)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, data]) => ({
        month: new Date(month + '-01').toLocaleDateString('en-US', {
          month: 'short',
          year: 'numeric',
        }),
        income: data.income,
        expenses: data.expenses,
      }));

    return {
      highestCategory,
      currentMonthExpenses,
      lastMonthExpenses,
      expenseChange,
      expenseChangePercent,
      avgIncome,
      avgExpense,
      monthlyChartData,
      categoryTotals,
    };
  }, [transactions]);

  const currencyFormatter = useMemo(
    () =>
      new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0,
      }),
    []
  );

  return (
    <PageTransition>
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
            Fintech Insights
          </p>
          <h1 className="mt-3 text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Financial performance dashboard
          </h1>
          <p className="mt-3 max-w-2xl text-base text-slate-600 dark:text-slate-400">
            Analyze your spend trends, category performance, and key patterns in a crisp, modern view.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.1 }}
            whileHover={{ y: -4 }}
          >
            <Card className="border border-blue-200/90 bg-blue-50/80 shadow-lg transition-shadow duration-300 hover:shadow-xl dark:border-slate-700/80 dark:bg-slate-950/70">
              <CardHeader className="pb-0">
                <CardTitle className="flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-slate-100">
                  <DollarSign className="w-5 h-5 text-blue-600" />
                  Highest Spending Category
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                {insights.highestCategory ? (
                  <>
                    <p className="text-2xl font-semibold text-slate-900 dark:text-white">
                      {insights.highestCategory[0]}
                    </p>
                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                      {currencyFormatter.format(insights.highestCategory[1])} spent
                    </p>
                  </>
                ) : (
                  <p className="text-sm text-slate-500 dark:text-slate-400">No expense data available</p>
                )}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.2 }}
            whileHover={{ y: -4 }}
          >
            <Card className={`border ${insights.expenseChange > 0 ? 'border-rose-300/80 bg-rose-50/60' : 'border-emerald-300/80 bg-emerald-50/60'} shadow-lg transition-shadow duration-300 hover:shadow-xl dark:border-slate-700/80 dark:bg-slate-950/70`}>
              <CardHeader className="pb-0">
                <CardTitle className="flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-slate-100">
                  {insights.expenseChange > 0 ? (
                    <TrendingUp className="w-5 h-5 text-rose-600" />
                  ) : (
                    <TrendingDown className="w-5 h-5 text-emerald-600" />
                  )}
                  Monthly Expense Change
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <p className={`text-2xl font-semibold ${insights.expenseChange > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                  {insights.expenseChange > 0 ? '+' : ''}
                  {insights.expenseChangePercent}%
                </p>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                  {insights.expenseChange > 0 ? 'Increased' : 'Decreased'} by {currencyFormatter.format(Math.abs(insights.expenseChange))} from last month
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.3 }}
            whileHover={{ y: -4 }}
          >
            <Card className="border border-green-200/90 bg-green-50/80 shadow-lg transition-shadow duration-300 hover:shadow-xl dark:border-slate-700/80 dark:bg-slate-950/70">
              <CardHeader className="pb-0">
                <CardTitle className="flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-slate-100">
                  <AlertCircle className="w-5 h-5 text-slate-600" />
                  Average Transaction
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-4 flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Income</p>
                  <p className="text-xl font-semibold text-emerald-600">
                    {currencyFormatter.format(insights.avgIncome)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Expense</p>
                  <p className="text-xl font-semibold text-rose-600">
                    {currencyFormatter.format(insights.avgExpense)}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.7fr_1fr] mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
          >
            <Card className="overflow-hidden border border-blue-200/90 shadow-lg transition-shadow duration-300 hover:shadow-xl dark:border-slate-700/80">
              <CardHeader className="bg-slate-50/90 px-6 py-5 dark:bg-slate-950/80">
                <CardTitle className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                  Monthly Income vs Expenses
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {insights.monthlyChartData.length > 0 ? (
                  <div className="h-64 sm:h-72 lg:h-80 xl:h-[360px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={insights.monthlyChartData} margin={{ top: 20, right: 0, left: -10, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="4 4" stroke="#cbd5e1" vertical={false} />
                        <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                        <YAxis tickLine={false} axisLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'white',
                            border: '1px solid #e2e8f0',
                            borderRadius: '16px',
                            color: '#0f172a',
                          }}
                          cursor={{ fill: 'rgba(15, 23, 42, 0.05)' }}
                        />
                        <Legend wrapperStyle={{ paddingTop: 12 }} />
                        <Bar dataKey="income" fill="#10b981" radius={[12, 12, 0, 0]} name="Income" />
                        <Bar dataKey="expenses" fill="#ef4444" radius={[12, 12, 0, 0]} name="Expenses" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="flex h-[360px] items-center justify-center text-slate-500 dark:text-slate-400">
                    No data available
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.45 }}
            className=''
          >
            <Card className="border border-slate-200/90  shadow-lg transition-shadow duration-300 hover:shadow-xl dark:border-slate-700/80">
              <CardHeader className="bg-slate-50/90 px-6 py-5 dark:bg-slate-950/80">
                <CardTitle className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                  Key Observations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 p-6">
                {insights.highestCategory && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.55 }}
                    className="rounded-3xl border border-slate-200/90 bg-slate-50 p-4 dark:border-slate-700/80 dark:bg-slate-950/70"
                  >
                    <div className="flex items-start gap-3">
                      <AlertCircle className="mt-1 h-5 w-5 text-slate-600" />
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-slate-100">Top Spending Category</p>
                        <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-400">
                          You spent the most on <span className="font-semibold text-slate-900 dark:text-white">{insights.highestCategory[0]}</span> with a total of {currencyFormatter.format(insights.highestCategory[1])}. Review this category to optimize spending.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {insights.expenseChange > 0 ? (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.65 }}
                    className="rounded-3xl border border-rose-200/90 bg-rose-50/70 p-4 dark:border-rose-700/60 dark:bg-rose-950/30"
                  >
                    <div className="flex items-start gap-3">
                      <TrendingUp className="mt-1 h-5 w-5 text-rose-600" />
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-white">Expenses Rising</p>
                        <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-400">
                          Expenses increased by {insights.expenseChangePercent}% from last month. Keep an eye on your variable costs to avoid overspending.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ) : insights.lastMonthExpenses > 0 ? (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.65 }}
                    className="rounded-3xl border border-emerald-200/90 bg-emerald-50/70 p-4 dark:border-emerald-700/60 dark:bg-emerald-950/30"
                  >
                    <div className="flex items-start gap-3">
                      <TrendingDown className="mt-1 h-5 w-5 text-emerald-600" />
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-white">Expenses Improving</p>
                        <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-400">
                          Good work — expenses decreased by {Math.abs(parseFloat(insights.expenseChangePercent))}% compared to last month.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ) : null}

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.75 }}
                  className="rounded-3xl border border-slate-200/90 bg-violet-50/70 p-4 dark:border-slate-700/80 dark:bg-slate-950/70"
                >
                  <div className="flex items-start gap-3">
                    <DollarSign className="mt-1 h-5 w-5 text-violet-600" />
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">Transaction Balance</p>
                      <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-400">
                        Your average income transaction is {currencyFormatter.format(insights.avgIncome)} while your average expense is {currencyFormatter.format(insights.avgExpense)}.
                      </p>
                    </div>
                  </div>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
};
