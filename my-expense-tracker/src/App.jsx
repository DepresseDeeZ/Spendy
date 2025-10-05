import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from "react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import {
  DollarSign,
  TrendingUp,
  BookOpen,
  Plus,
  Settings,
  X,
  Calendar,
  Hash,
  ShoppingCart,
  Briefcase,
  FileText,
  XCircle,
  ArrowLeft,
  LogOut,
} from "lucide-react";

// --- API Configuration ---
// const API_BASE_URL = "http://localhost:5001"; // URL of your backend server
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; // URL of your backend server

// --- Constants & Helpers ---
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const PASTEL_COLORS = [
  "#a2d2ff",
  "#bde0fe",
  "#ffafcc",
  "#ffc8dd",
  "#cdb4db",
  "#fcf6bd",
  "#d0f4de",
  "#a9def9",
  "#e4c1f9",
  "#fbf8cc",
  "#ffcfd2",
  "#f1c0e8",
];
const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
const getWeekOfMonth = (date) => {
  const d = new Date(date);
  return Math.ceil(d.getDate() / 7) - 1; // Returns a 0-indexed week (0 for week 1, 1 for week 2, etc.)
};

// --- Helper Components ---
const StatCard = ({ title, value, icon, color }) => (
  <div className="bg-white p-4 rounded-xl shadow-md flex items-center space-x-4 transition-transform hover:scale-105">
    <div className={`p-3 rounded-full ${color}`}>{icon}</div>
    <div>
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
    </div>
  </div>
);

const Section = ({ title, children, actions }) => (
  <div className="bg-white p-6 rounded-2xl shadow-lg mb-8">
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
      <div className="flex items-center gap-4">{actions}</div>
    </div>
    {children}
  </div>
);

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-sm">
        <p className="font-bold text-gray-700">{label}</p>
        {payload.map((entry, index) => (
          <p key={`item-${index}`} style={{ color: entry.color }}>
            {`${entry.name}: $${parseFloat(entry.value || 0).toFixed(2)}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md m-4">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-xl font-semibold">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

// --- AUTHENTICATION COMPONENTS ---
const AuthPage = ({ onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";
    try {
      const response = await fetch(API_BASE_URL + endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "An error occurred.");
      }
      onLoginSuccess(data.token);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-8 space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800">
            {isLogin ? "Welcome Back!" : "Create Account"}
          </h1>
          <p className="text-gray-500 mt-2">
            {isLogin
              ? "Log in to view your dashboard"
              : "Sign up to start tracking"}
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 transition-colors"
          >
            {loading ? "Processing..." : isLogin ? "Log In" : "Sign Up"}
          </button>
        </form>
        <p className="text-center text-sm text-gray-600">
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setError(null);
            }}
            className="font-medium text-indigo-600 hover:text-indigo-500 ml-1"
          >
            {isLogin ? "Sign up" : "Log in"}
          </button>
        </p>
      </div>
    </div>
  );
};

// --- TRACKER COMPONENTS ---

const YearSetup = ({ onSetupComplete, setApiError, token }) => {
  const [year, setYear] = useState(new Date().getFullYear());
  const [categories, setCategories] = useState(
    "Rent, Subscriptions, Entertainment, Food & Drink, Groceries, Shopping, Transport, Travel"
  );
  const [incomeSources, setIncomeSources] = useState(
    "Salary, Freelance, Business, Other"
  );
  const [mode, setMode] = useState("select"); // 'select' or 'create'

  const handleLoadOrCreate = async () => {
    if (!year) return;
    setApiError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/api/tracker/${year}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const existingData = await response.json();
        onSetupComplete(year, existingData);
      } else if (response.status === 404) {
        setMode("create");
      } else {
        throw new Error("Failed to check for existing year data.");
      }
    } catch (error) {
      console.error("Error loading year data:", error);
      setApiError(
        `Could not connect to the server. Please ensure the backend is running.`
      );
    }
  };

  const handleCreate = async () => {
    const categoriesArray = categories
      .split(",")
      .map((c) => c.trim())
      .filter(Boolean);
    const incomeSourcesArray = incomeSources
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const initialData = {
      year,
      categories: categoriesArray,
      incomeSources: incomeSourcesArray,
      dailyExpenses: {},
      weeklyIncomes: {},
      budgets: {},
      expenseLog: [],
      incomeLog: [],
    };

    setApiError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/api/tracker`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(initialData),
      });
      const createdData = await response.json();
      if (!response.ok)
        throw new Error(createdData.message || "Failed to create tracker");
      onSetupComplete(year, createdData);
    } catch (error) {
      console.error("Error setting up tracker:", error);
      setApiError(
        `Setup failed: Could not connect to the server. Please ensure the backend is running.`
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 space-y-6">
        {mode === "select" ? (
          <>
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-800">Select Year</h1>
              <p className="text-gray-500 mt-2">
                Enter a year to load existing data or create a new tracker.
              </p>
            </div>
            <div>
              <label
                htmlFor="year"
                className="block text-sm font-medium text-gray-700"
              >
                Tracking Year
              </label>
              <input
                type="number"
                id="year"
                value={year}
                onChange={(e) =>
                  setYear(parseInt(e.target.value) || new Date().getFullYear())
                }
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <button
              onClick={handleLoadOrCreate}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
              Load or Create
            </button>
          </>
        ) : (
          <>
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-800">
                New Tracker for {year}
              </h1>
              <p className="text-gray-500 mt-2">
                No data found. Let's set up your new financial year.
              </p>
            </div>
            <div>
              <label
                htmlFor="categories"
                className="block text-sm font-medium text-gray-700"
              >
                Expense Categories (comma-separated)
              </label>
              <textarea
                id="categories"
                rows="3"
                value={categories}
                onChange={(e) => setCategories(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label
                htmlFor="incomeSources"
                className="block text-sm font-medium text-gray-700"
              >
                Income Sources (comma-separated)
              </label>
              <input
                id="incomeSources"
                value={incomeSources}
                onChange={(e) => setIncomeSources(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setMode("select")}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
              >
                <ArrowLeft size={16} /> Back
              </button>
              <button
                onClick={handleCreate}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
              >
                Start Tracking
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const MonthlyOverview = ({ data, setData, year, derivedData }) => {
  const handleBudgetChange = (category, value) => {
    const updatedBudgets = {
      ...(data.budgets || {}),
      [category]: parseFloat(value) || 0,
    };
    setData((prev) => ({ ...prev, budgets: updatedBudgets }));
  };

  const {
    monthlyTotals,
    categoryTotals,
    grandTotalExpenditure,
    grandTotalIncome,
    grandTotalSavings,
  } = derivedData;

  const yearlyBreakdownData = useMemo(
    () =>
      data.categories
        .map((cat, catIndex) => ({
          name: cat,
          value: categoryTotals[catIndex],
        }))
        .filter((d) => d.value > 0),
    [categoryTotals, data.categories]
  );

  const yearlyIncomeData = useMemo(
    () =>
      MONTHS.map((month, index) => ({
        name: month.substring(0, 3),
        income: monthlyTotals[index].income,
        expenditure: monthlyTotals[index].totalExpenditure,
      })),
    [monthlyTotals]
  );

  const totalBudget = Object.values(data.budgets || {}).reduce(
    (sum, b) => sum + b,
    0
  );

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Total Income"
          value={`$${grandTotalIncome.toFixed(2)}`}
          icon={<DollarSign className="text-green-500" />}
          color="bg-green-100"
        />
        <StatCard
          title="Total Expenditure"
          value={`$${grandTotalExpenditure.toFixed(2)}`}
          icon={<TrendingUp className="text-red-500" />}
          color="bg-red-100"
        />
        <StatCard
          title="Gross Savings"
          value={`$${grandTotalSavings.toFixed(2)}`}
          icon={<FileText className="text-blue-500" />}
          color="bg-blue-100"
        />
      </div>

      <Section title="Monthly Breakdown">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-100">
              <tr>
                <th className="px-4 py-3 rounded-tl-lg">Month</th>
                {data.categories.map((cat) => (
                  <th key={cat} className="px-4 py-3 text-center">
                    {cat}
                  </th>
                ))}
                <th className="px-4 py-3 text-center">Total Expenditure</th>
                <th className="px-4 py-3 text-center">Income</th>
                <th className="px-4 py-3 rounded-tr-lg text-center">
                  Gross Savings
                </th>
              </tr>
            </thead>
            <tbody>
              {MONTHS.map((month, monthIndex) => (
                <tr key={month} className="bg-white border-b hover:bg-gray-50">
                  <td className="px-4 py-2 font-medium text-gray-900 whitespace-nowrap">
                    {month} {year}
                  </td>
                  {data.categories.map((cat, catIndex) => (
                    <td key={cat} className="px-4 py-2 text-center">
                      $
                      {(
                        monthlyTotals[monthIndex].categoryTotals[catIndex] || 0
                      ).toFixed(2)}
                    </td>
                  ))}
                  <td className="px-4 py-2 text-center font-semibold text-red-600">
                    ${monthlyTotals[monthIndex].totalExpenditure.toFixed(2)}
                  </td>
                  <td className="px-4 py-2 text-center font-semibold text-green-600">
                    ${monthlyTotals[monthIndex].income.toFixed(2)}
                  </td>
                  <td className="px-4 py-2 text-center font-semibold text-blue-600">
                    ${monthlyTotals[monthIndex].grossSavings.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="font-semibold text-gray-900 bg-gray-100">
                <th className="px-4 py-3 text-base">Total</th>
                {categoryTotals.map((total, i) => (
                  <td key={i} className="px-4 py-2 text-center">
                    ${total.toFixed(2)}
                  </td>
                ))}
                <td className="px-4 py-2 text-center text-red-700">
                  ${grandTotalExpenditure.toFixed(2)}
                </td>
                <td className="px-4 py-2 text-center text-green-700">
                  ${grandTotalIncome.toFixed(2)}
                </td>
                <td className="px-4 py-2 text-center text-blue-700">
                  ${grandTotalSavings.toFixed(2)}
                </td>
              </tr>
              <tr className="font-semibold text-gray-900 bg-gray-100">
                <th className="px-4 py-3 text-base rounded-bl-lg">
                  Monthly Budget
                </th>
                {data.categories.map((cat) => (
                  <td key={cat} className="px-2 py-1">
                    <input
                      type="number"
                      className="w-24 p-1 text-right bg-yellow-50 border border-yellow-200 rounded-md focus:ring-yellow-500 focus:border-yellow-500"
                      value={data.budgets?.[cat] || ""}
                      onChange={(e) => handleBudgetChange(cat, e.target.value)}
                      placeholder="0.00"
                    />
                  </td>
                ))}
                <td className="px-4 py-2 text-center">
                  ${totalBudget.toFixed(2)}
                </td>
                <td></td>
                <td className="px-4 py-2 text-center rounded-br-lg text-gray-700">
                  ${(-totalBudget).toFixed(2)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </Section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Section title="Yearly Expenditure Breakdown">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={yearlyBreakdownData}
              margin={{ top: 20, right: 20, left: -10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-25} textAnchor="end" height={60} />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" fill="#ffafcc" name="Total Spent" />
            </BarChart>
          </ResponsiveContainer>
        </Section>
        <Section title="Category Expenditure">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={yearlyBreakdownData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
              >
                {yearlyBreakdownData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={PASTEL_COLORS[index % PASTEL_COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Section>
        <Section title="Yearly Income vs Expenditure">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={yearlyIncomeData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line
                type="monotone"
                dataKey="income"
                stroke="#a2d2ff"
                strokeWidth={3}
                name="Income"
              />
              <Line
                type="monotone"
                dataKey="expenditure"
                stroke="#ffafcc"
                strokeWidth={3}
                name="Expenditure"
              />
            </LineChart>
          </ResponsiveContainer>
        </Section>
      </div>
    </div>
  );
};

const WeeklyOverview = ({ data, setData, year }) => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedWeek, setSelectedWeek] = useState(0); // 0 for Week 1, 1 for Week 2, etc.

  const handleDailyExpenseChange = (day, category, value) => {
    const key = `${selectedMonth}-${day}-${category}`;
    const updatedDailyExpenses = {
      ...data.dailyExpenses,
      [key]: parseFloat(value) || 0,
    };
    setData((prev) => ({ ...prev, dailyExpenses: updatedDailyExpenses }));
  };

  const daysInSelectedMonth = getDaysInMonth(year, selectedMonth);
  const numWeeks = Math.ceil(daysInSelectedMonth / 7);

  // Calculate the days for the selected week
  const startDay = selectedWeek * 7 + 1;
  const endDay = Math.min(startDay + 6, daysInSelectedMonth);
  const daysArray = Array.from(
    { length: endDay - startDay + 1 },
    (_, i) => startDay + i
  );

  const weeklyChartData = useMemo(() => {
    return daysArray.map((day) => {
      const dayTotal = data.categories.reduce((sum, cat) => {
        const key = `${selectedMonth}-${day}-${cat}`;
        return sum + (data.dailyExpenses?.[key] || 0);
      }, 0);
      return { name: `Day ${day}`, total: dayTotal };
    });
  }, [data.dailyExpenses, selectedMonth, daysArray, data.categories]);

  return (
    <Section
      title="Weekly & Daily Overview"
      actions={
        <>
          <div className="flex items-center space-x-2 bg-gray-100 p-1 rounded-lg">
            {Array.from({ length: numWeeks }, (_, i) => i).map((weekIndex) => (
              <button
                key={weekIndex}
                onClick={() => setSelectedWeek(weekIndex)}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  selectedWeek === weekIndex
                    ? "bg-white shadow text-indigo-700"
                    : "text-gray-600 hover:bg-gray-200"
                }`}
              >
                Week {weekIndex + 1}
              </button>
            ))}
          </div>
          <select
            value={selectedMonth}
            onChange={(e) => {
              setSelectedMonth(parseInt(e.target.value));
              setSelectedWeek(0);
            }}
            className="p-2 border rounded-md bg-white"
          >
            {MONTHS.map((month, index) => (
              <option key={month} value={index}>
                {month}
              </option>
            ))}
          </select>
        </>
      }
    >
      <div className="overflow-x-auto mb-8">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-100">
            <tr>
              <th className="px-4 py-3 rounded-tl-lg w-1/4">Category</th>
              {daysArray.map((day) => (
                <th key={day} className="px-2 py-3 text-center">
                  {day}
                </th>
              ))}
              <th className="px-4 py-3 rounded-tr-lg text-center">
                Week Total
              </th>
            </tr>
          </thead>
          <tbody>
            {data.categories.map((cat) => (
              <tr key={cat} className="bg-white border-b hover:bg-gray-50">
                <td className="px-4 py-2 font-medium text-gray-900 whitespace-nowrap">
                  {cat}
                </td>
                {daysArray.map((day) => (
                  <td key={day} className="p-1">
                    <input
                      type="number"
                      placeholder="0.00"
                      className="w-full p-2 text-right bg-gray-50 border border-gray-200 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      value={
                        data.dailyExpenses?.[
                          `${selectedMonth}-${day}-${cat}`
                        ] || ""
                      }
                      onChange={(e) =>
                        handleDailyExpenseChange(day, cat, e.target.value)
                      }
                    />
                  </td>
                ))}
                <td className="px-4 py-2 text-center font-semibold text-gray-800">
                  $
                  {daysArray
                    .reduce(
                      (sum, day) =>
                        sum +
                        (data.dailyExpenses?.[
                          `${selectedMonth}-${day}-${cat}`
                        ] || 0),
                      0
                    )
                    .toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <h3 className="text-xl font-bold text-gray-800 mb-4">
        Daily Spending for Week {selectedWeek + 1} of {MONTHS[selectedMonth]}
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={weeklyChartData}
          margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="total" fill="#bde0fe" name="Total Spent" />
        </BarChart>
      </ResponsiveContainer>
    </Section>
  );
};

const IncomeDashboard = ({ data, setData, year, derivedData }) => {
  const handleWeeklyIncomeChange = (monthIndex, weekIndex, value) => {
    const key = `${monthIndex}-${weekIndex}`;
    const updatedWeeklyIncomes = {
      ...data.weeklyIncomes,
      [key]: parseFloat(value) || 0,
    };
    setData((prev) => ({ ...prev, weeklyIncomes: updatedWeeklyIncomes }));
  };

  const weeklyAverageData = useMemo(() => {
    const weeklySums = [0, 0, 0, 0, 0];
    MONTHS.forEach((_, monthIndex) => {
      for (let i = 0; i < 5; i++) {
        weeklySums[i] += data.weeklyIncomes?.[`${monthIndex}-${i}`] || 0;
      }
    });
    return weeklySums
      .map((sum, i) => ({ name: `Week ${i + 1}`, value: sum / 12 }))
      .filter((d) => d.value > 0);
  }, [data.weeklyIncomes]);

  return (
    <Section title="Income Dashboard">
      <div className="overflow-x-auto mb-8">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-100">
            <tr>
              <th className="px-4 py-3 rounded-tl-lg">Month</th>
              {[1, 2, 3, 4, 5].map((w) => (
                <th key={w} className="px-4 py-3 text-center">
                  Week {w}
                </th>
              ))}
              <th className="px-4 py-3 rounded-tr-lg text-center">
                Total Income
              </th>
            </tr>
          </thead>
          <tbody>
            {MONTHS.map((month, monthIndex) => (
              <tr key={month} className="bg-white border-b hover:bg-gray-50">
                <td className="px-4 py-2 font-medium text-gray-900">
                  {month} {year}
                </td>
                {[0, 1, 2, 3, 4].map((weekIndex) => (
                  <td key={weekIndex} className="p-1">
                    <input
                      type="number"
                      placeholder="0.00"
                      className="w-full p-1 text-right bg-green-50 border border-green-200 rounded-md focus:ring-green-500 focus:border-green-500"
                      value={
                        data.weeklyIncomes?.[`${monthIndex}-${weekIndex}`] || ""
                      }
                      onChange={(e) =>
                        handleWeeklyIncomeChange(
                          monthIndex,
                          weekIndex,
                          e.target.value
                        )
                      }
                    />
                  </td>
                ))}
                <td className="px-4 py-2 text-center font-semibold text-green-700">
                  ${derivedData.monthlyTotals[monthIndex].income.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-gray-50 p-4 rounded-xl">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            Yearly Income Breakdown
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={derivedData.monthlyTotals.map((m, i) => ({
                name: MONTHS[i].slice(0, 3),
                income: m.income,
              }))}
              margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="income" fill="#cdb4db" name="Monthly Income" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-gray-50 p-4 rounded-xl">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            Average Weekly Income Contribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={weeklyAverageData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
                nameKey="name"
                label
              >
                {weeklyAverageData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={PASTEL_COLORS[index % PASTEL_COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Section>
  );
};

const LogView = ({ title, logData, headers, renderRow, icon }) => (
  <Section title={title}>
    {logData && logData.length > 0 ? (
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-100">
            <tr>
              {headers.map((h) => (
                <th key={h} className="px-6 py-3">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>{logData.map((item) => renderRow(item))}</tbody>
        </table>
      </div>
    ) : (
      <div className="text-center py-10">
        {icon}
        <p className="mt-4 text-gray-500">
          No entries yet. Add one to get started!
        </p>
      </div>
    )}
  </Section>
);

const TrackerPage = ({ token, onLogout }) => {
  const [activeTab, setActiveTab] = useState("Monthly Overview");
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isExpenseModalOpen, setExpenseModalOpen] = useState(false);
  const [isIncomeModalOpen, setIncomeModalOpen] = useState(false);
  const [apiError, setApiError] = useState(null);
  const isInitialMount = useRef(true);

  // --- FIX: This useEffect hook will run once when the component mounts ---
  useEffect(() => {
    const loadInitialData = async () => {
      const currentYear = new Date().getFullYear();
      setApiError(null);
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/tracker/${currentYear}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (response.status === 404) {
          setData(null); // No data for current year, go to YearSetup
        } else {
          const fetchedData = await response.json();
          if (!response.ok)
            throw new Error(
              fetchedData.message || "Failed to fetch initial data"
            );
          setData(fetchedData);
        }
      } catch (error) {
        console.error("Failed to load initial data:", error);
        setApiError(
          "Could not connect to the server. Please check your connection and refresh."
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, [token]); // Dependency array ensures this runs when the token is available

  // --- State Update Logic ---
  const handleAddExpense = (expense) => {
    const date = new Date(expense.date);
    const monthIndex = date.getMonth();
    const day = date.getDate();
    setData((prev) => {
      const newLog = [
        ...(prev.expenseLog || []),
        {
          ...expense,
          id: Date.now().toString(),
          timestamp: new Date().toISOString(),
        },
      ];
      const key = `${monthIndex}-${day}-${expense.category}`;
      const newDailyExpenses = { ...prev.dailyExpenses };
      newDailyExpenses[key] = (newDailyExpenses[key] || 0) + expense.amount;
      return { ...prev, expenseLog: newLog, dailyExpenses: newDailyExpenses };
    });
  };

  const handleAddIncome = (income) => {
    const date = new Date(income.date);
    const monthIndex = date.getMonth();
    const weekIndex = getWeekOfMonth(date);
    setData((prev) => {
      const newLog = [
        ...(prev.incomeLog || []),
        {
          ...income,
          id: Date.now().toString(),
          timestamp: new Date().toISOString(),
        },
      ];
      const key = `${monthIndex}-${weekIndex}`;
      const newWeeklyIncomes = { ...prev.weeklyIncomes };
      newWeeklyIncomes[key] = (newWeeklyIncomes[key] || 0) + income.amount;
      return { ...prev, incomeLog: newLog, weeklyIncomes: newWeeklyIncomes };
    });
  };

  // Debounced save to backend
  useEffect(() => {
    if (isInitialMount.current || !data) {
      isInitialMount.current = false;
      return;
    }
    const handler = setTimeout(async () => {
      try {
        await fetch(`${API_BASE_URL}/api/tracker/${data.year}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        });
      } catch (error) {
        console.error("Failed to save data:", error);
      }
    }, 1500);
    return () => clearTimeout(handler);
  }, [data, token]);

  // Derived data calculations
  const derivedData = useMemo(() => {
    if (!data) return null;
    const monthlyTotals = MONTHS.map((_, monthIndex) => {
      const categoryTotals = data.categories.map((cat) => {
        const daysInMonth = getDaysInMonth(data.year, monthIndex);
        let total = 0;
        for (let day = 1; day <= daysInMonth; day++) {
          total += data.dailyExpenses?.[`${monthIndex}-${day}-${cat}`] || 0;
        }
        return total;
      });
      const totalExpenditure = categoryTotals.reduce(
        (sum, total) => sum + total,
        0
      );
      let income = 0;
      for (let week = 0; week < 5; week++) {
        income += data.weeklyIncomes?.[`${monthIndex}-${week}`] || 0;
      }
      const grossSavings = income - totalExpenditure;
      return { totalExpenditure, income, grossSavings, categoryTotals };
    });
    const categoryTotals = data.categories.map((_, catIndex) =>
      monthlyTotals.reduce(
        (sum, month) => sum + (month.categoryTotals[catIndex] || 0),
        0
      )
    );
    const grandTotalExpenditure = categoryTotals.reduce(
      (sum, total) => sum + total,
      0
    );
    const grandTotalIncome = monthlyTotals.reduce(
      (sum, month) => sum + month.income,
      0
    );
    const grandTotalSavings = grandTotalIncome - grandTotalExpenditure;
    return {
      monthlyTotals,
      categoryTotals,
      grandTotalExpenditure,
      grandTotalIncome,
      grandTotalSavings,
    };
  }, [data]);

  if (apiError) {
    return (
      <div className="min-h-screen bg-red-50 flex items-center justify-center p-4">
        <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-8 text-center">
          <XCircle className="text-red-500 h-16 w-16 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-red-800">Connection Error</h1>
          <p className="text-gray-600 mt-2 mb-6">{apiError}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  if (isLoading)
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-xl font-semibold">
          Loading Your Financial Dashboard...
        </div>
      </div>
    );
  if (!data || !derivedData)
    return (
      <YearSetup
        onSetupComplete={(year, initialData) => setData(initialData)}
        setApiError={setApiError}
        token={token}
      />
    );

  const navItems = [
    "Monthly Overview",
    "Weekly Overview",
    "Income Dashboard",
    "Expense Log",
    "Income Log",
  ];
  const renderContent = () => {
    switch (activeTab) {
      case "Monthly Overview":
        return (
          <MonthlyOverview
            data={data}
            setData={setData}
            year={data.year}
            derivedData={derivedData}
          />
        );
      case "Weekly Overview":
        return (
          <WeeklyOverview data={data} setData={setData} year={data.year} />
        );
      case "Income Dashboard":
        return (
          <IncomeDashboard
            data={data}
            setData={setData}
            year={data.year}
            derivedData={derivedData}
          />
        );
      case "Expense Log":
        return (
          <LogView
            title="Expense Log"
            logData={[...(data.expenseLog || [])].reverse()}
            headers={["Date", "Item", "Category", "Amount"]}
            icon={<ShoppingCart size={48} className="text-gray-300 mx-auto" />}
            renderRow={(item) => (
              <tr key={item.id} className="bg-white border-b">
                <td className="px-6 py-4">
                  {new Date(item.date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 font-medium text-gray-900">
                  {item.item}
                </td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                    {item.category}
                  </span>
                </td>
                <td className="px-6 py-4 text-red-600 font-semibold">
                  ${item.amount.toFixed(2)}
                </td>
              </tr>
            )}
          />
        );
      case "Income Log":
        return (
          <LogView
            title="Income Log"
            logData={[...(data.incomeLog || [])].reverse()}
            headers={["Date", "Source", "Amount", "Invoice #"]}
            icon={<Briefcase size={48} className="text-gray-300 mx-auto" />}
            renderRow={(item) => (
              <tr key={item.id} className="bg-white border-b">
                <td className="px-6 py-4">
                  {new Date(item.date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 font-medium text-gray-900">
                  {item.source}
                </td>
                <td className="px-6 py-4 text-green-600 font-semibold">
                  ${item.amount.toFixed(2)}
                </td>
                <td className="px-6 py-4">{item.invoice || "N/A"}</td>
              </tr>
            )}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-gray-800">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <nav className="container mx-auto px-6 py-3 flex justify-between items-center">
          <div
            onClick={() => setData(null)}
            className="flex items-center space-x-2 cursor-pointer transition-colors hover:text-indigo-800"
            title="Change Year"
          >
            <Calendar className="text-indigo-600 h-8 w-8" />
            <h1 className="text-xl font-bold text-gray-800">
              Finance Tracker {data.year}
            </h1>
          </div>
          <div className="hidden md:flex items-center space-x-1 bg-gray-100 p-1 rounded-lg">
            {navItems.map((item) => (
              <button
                key={item}
                onClick={() => setActiveTab(item)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === item
                    ? "bg-white shadow text-indigo-700"
                    : "text-gray-600 hover:bg-gray-200"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIncomeModalOpen(true)}
              className="hidden md:flex items-center gap-1 bg-green-500 text-white px-3 py-2 rounded-lg hover:bg-green-600 transition-colors text-sm font-semibold"
            >
              <Plus size={16} /> Add Income
            </button>
            <button
              onClick={() => setExpenseModalOpen(true)}
              className="hidden md:flex items-center gap-1 bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 transition-colors text-sm font-semibold"
            >
              <Plus size={16} /> Add Expense
            </button>
            <button
              onClick={onLogout}
              title="Logout"
              className="p-2 rounded-full hover:bg-gray-200 transition-colors"
            >
              <LogOut size={20} className="text-gray-600" />
            </button>
            <div className="md:hidden">
              <select
                value={activeTab}
                onChange={(e) => setActiveTab(e.target.value)}
                className="px-4 py-2 rounded-md text-sm font-medium border border-gray-300 focus:ring-indigo-500"
              >
                {navItems.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </nav>
      </header>
      <main className="container mx-auto p-4 md:p-6">{renderContent()}</main>
      <div className="md:hidden fixed bottom-4 right-4 flex flex-col gap-3">
        <button
          onClick={() => setIncomeModalOpen(true)}
          className="bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600"
        >
          <Plus size={24} />
        </button>
        <button
          onClick={() => setExpenseModalOpen(true)}
          className="bg-red-500 text-white p-4 rounded-full shadow-lg hover:bg-red-600"
        >
          <Plus size={24} />
        </button>
      </div>
      <AddTransactionModal
        isOpen={isExpenseModalOpen}
        onClose={() => setExpenseModalOpen(false)}
        onAdd={handleAddExpense}
        type="Expense"
        categories={data.categories}
      />
      <AddTransactionModal
        isOpen={isIncomeModalOpen}
        onClose={() => setIncomeModalOpen(false)}
        onAdd={handleAddIncome}
        type="Income"
        categories={data.incomeSources}
      />
    </div>
  );
};

const AddTransactionModal = ({ isOpen, onClose, onAdd, type, categories }) => {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState(categories?.[0] || "");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [item, setItem] = useState("");
  const [invoice, setInvoice] = useState("");

  useEffect(() => {
    if (categories?.length > 0) setCategory(categories[0]);
  }, [categories]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload =
      type === "Expense"
        ? { amount: parseFloat(amount), category, date, item }
        : { amount: parseFloat(amount), source: category, date, invoice };
    onAdd(payload);
    setAmount("");
    setItem("");
    setInvoice("");
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Add New ${type}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Amount
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            className="mt-1 w-full p-2 border rounded-md"
            placeholder="0.00"
            step="0.01"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            {type === "Expense" ? "Category" : "Source"}
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="mt-1 w-full p-2 border rounded-md bg-white"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        {type === "Expense" ? (
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Item Name
            </label>
            <input
              type="text"
              value={item}
              onChange={(e) => setItem(e.target.value)}
              required
              className="mt-1 w-full p-2 border rounded-md"
              placeholder="e.g., Netflix Subscription"
            />
          </div>
        ) : (
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Invoice # (Optional)
            </label>
            <input
              type="text"
              value={invoice}
              onChange={(e) => setInvoice(e.target.value)}
              className="mt-1 w-full p-2 border rounded-md"
            />
          </div>
        )}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Date
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className="mt-1 w-full p-2 border rounded-md"
          />
        </div>
        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            className={`px-4 py-2 text-white rounded-lg ${
              type === "Expense"
                ? "bg-red-500 hover:bg-red-600"
                : "bg-green-500 hover:bg-green-600"
            }`}
          >
            Add {type}
          </button>
        </div>
      </form>
    </Modal>
  );
};

// --- MAIN APP COMPONENT ---
function App() {
  const [token, setToken] = useState(localStorage.getItem("authToken"));

  const handleLoginSuccess = (newToken) => {
    localStorage.setItem("authToken", newToken);
    setToken(newToken);
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setToken(null);
  };

  return (
    <>
      {token ? (
        <TrackerPage token={token} onLogout={handleLogout} />
      ) : (
        <AuthPage onLoginSuccess={handleLoginSuccess} />
      )}
      <footer className="w-full text-center py-6 bg-white shadow-inner mt-8">
        <span className="text-gray-500 text-sm font-medium">
          Made by Umang Raval. All rights reserved @2025
        </span>
      </footer>
    </>
  );
}

export default App;
