import { useState, useEffect } from "react";
import { useEnergyStore } from "./store";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import {
  LayoutDashboard,
  Wallet,
  User,
  LogOut,
  Filter,
  X,
  Plus,
  Trash2,
  ShieldCheck,
  Sun,
  Moon,
  Building2,
  Leaf,
  Calendar,
  MapPin,
  ExternalLink,
  Info,
  Zap,
} from "lucide-react";

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884d8",
  "#82ca9d",
];

function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [email, setEmail] = useState("test@example.com");
  const [password, setPassword] = useState("test1234");
  const [authError, setAuthError] = useState("");
  const [view, setView] = useState("marketplace"); // 'marketplace' or 'portfolio'
  const [contracts, setContracts] = useState([]);
  const [portfolio, setPortfolio] = useState({ contracts: [], metrics: null });
  const [loading, setLoading] = useState(true);
  const [selectedContract, setSelectedContract] = useState(null);
  const {
    energyOptions,
    selectedEnergyTypes,
    toggleEnergyType,
    minPrice,
    maxPrice,
    location,
    setMinPrice,
    setMaxPrice,
    setLocation,
    resetFilters,
    theme,
    toggleTheme,
  } = useEnergyStore();
  const [filters, setFilters] = useState({
    min_quantity: "",
    max_quantity: "",
    start_date: "",
    end_date: "",
  });

  useEffect(() => {
    if (user) {
      fetchContracts();
      fetchPortfolio();
    }
  }, [user, filters, selectedEnergyTypes, minPrice, maxPrice, location]);

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  const fetchContracts = () => {
    if (!token) return;
    const params = new URLSearchParams();
    selectedEnergyTypes.forEach((type) => params.append("energy_types", type));
    if (minPrice) params.append("min_price", minPrice);
    if (maxPrice) params.append("max_price", maxPrice);
    if (location) params.append("location", location);
    if (filters.min_quantity)
      params.append("min_quantity", filters.min_quantity);
    if (filters.max_quantity)
      params.append("max_quantity", filters.max_quantity);
    if (filters.start_date) params.append("start_date", filters.start_date);
    if (filters.end_date) params.append("end_date", filters.end_date);

    setLoading(true);
    fetch(`/contracts?${params.toString()}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setContracts(data);
        setLoading(false);
      });
  };

  const fetchPortfolio = () => {
    fetch("/portfolio", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setPortfolio(data));
  };

  const addToPortfolio = (contractId) => {
    fetch(`/portfolio/${contractId}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    }).then(() => fetchPortfolio());
  };

  const removeFromPortfolio = (contractId) => {
    fetch(`/portfolio/${contractId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    }).then(() => fetchPortfolio());
  };

  const login = async (e) => {
    e.preventDefault();
    setAuthError("");
    try {
      const response = await fetch("/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || "Login failed");

      setUser(data.user);
      setToken(data.access_token);
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("token", data.access_token);
    } catch (err) {
      setAuthError(err.message);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  if (!user) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <div className="bg-white dark:bg-gray-950 rounded-2xl shadow-2xl p-8 max-w-md w-full">
          <div className="flex flex-col items-center text-center">
            <div className="bg-blue-100 dark:bg-blue-900/30 p-4 rounded-full mb-4">
              <ShieldCheck className="w-12 h-12 text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
              Welcome Back
            </h2>
            <p className="text-gray-700 dark:text-gray-400 mb-8">
              Please sign in with your credentials to access the marketplace.
            </p>

            <form onSubmit={login} className="w-full space-y-4">
              <div>
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                  required
                />
              </div>
              <div>
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                  required
                />
              </div>
              {authError && <p className="text-red-500 text-sm">{authError}</p>}
              <button
                type="submit"
                className="w-full py-3 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 transition-colors"
              >
                Sign In
              </button>
            </form>

            <div className="w-full h-px bg-gray-200 dark:bg-gray-800 my-6 flex items-center justify-center">
              <span className="bg-white dark:bg-gray-900 px-4 text-gray-600 dark:text-gray-400 text-sm font-medium">
                CREDENTIALS
              </span>
            </div>

            <div className="text-sm text-gray-700 dark:text-gray-400">
              <p>
                Email:{" "}
                <span className="font-semibold dark:text-white">
                  test@example.com
                </span>
              </p>
              <p>
                Password:{" "}
                <span className="font-semibold dark:text-white">test1234</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const chartData = portfolio.metrics?.breakdown_by_type
    ? Object.entries(portfolio.metrics.breakdown_by_type).map(
        ([name, value]) => ({ name, value }),
      )
    : [];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col md:flex-row text-gray-900 dark:text-white">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white dark:bg-gray-950 border-r border-gray-200 dark:border-gray-800 flex flex-col">
        <div className="p-6 flex justify-between items-center">
          <h1 className="text-xl font-bold flex items-center gap-2">
            <Zap className="text-blue-600" />
            Energy Trade
          </h1>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            aria-label="Toggle Theme"
          >
            {theme === "light" ? (
              <Moon className="w-5 h-5 text-gray-600" />
            ) : (
              <Sun className="w-5 h-5 text-amber-400" />
            )}
          </button>
        </div>

        <nav className="flex-grow p-4 space-y-2">
          <button
            onClick={() => setView("marketplace")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
              view === "marketplace"
                ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
            }`}
          >
            <Wallet className="w-5 h-5" /> Marketplace
          </button>
          <button
            onClick={() => setView("portfolio")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
              view === "portfolio"
                ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
            }`}
          >
            <LayoutDashboard className="w-5 h-5" /> My Portfolio
          </button>
        </nav>

        <div className="p-4 border-t border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-3 px-4 py-3 text-gray-600 dark:text-gray-400">
            <User className="w-5 h-5" />
            <div className="flex-grow overflow-hidden">
              <p className="text-sm font-medium truncate">{user.email}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors mt-2"
          >
            <LogOut className="w-5 h-5" /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-4 md:p-8 overflow-y-auto h-screen">
        {view === "marketplace" ? (
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-end mb-8">
              <div>
                <h2 className="text-3xl font-bold dark:text-white">
                  Contract Marketplace
                </h2>
                <p className="text-gray-500 dark:text-gray-400">
                  Explore and reserve available energy contracts.
                </p>
              </div>
              <div className="flex items-center gap-2 bg-white dark:bg-gray-900 px-4 py-2 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 text-sm text-gray-500 dark:text-gray-400">
                <Wallet className="w-4 h-4" />{" "}
                {contracts.filter((c) => c.status === "Available").length}{" "}
                Available
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Filters */}
              <div className="space-y-6">
                <div className="bg-white dark:bg-gray-950 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold flex items-center gap-2 dark:text-white">
                      <Filter className="w-4 h-4" /> Filters
                    </h3>
                    <button
                      onClick={() => {
                        resetFilters();
                        setFilters({
                          min_quantity: "",
                          max_quantity: "",
                          start_date: "",
                          end_date: "",
                        });
                      }}
                      className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      Reset
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2 block">
                        Energy Type
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {energyOptions.map((t) => (
                          <button
                            key={t}
                            onClick={() => toggleEnergyType(t)}
                            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                              selectedEnergyTypes.includes(t)
                                ? "bg-blue-600 text-white shadow-md"
                                : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                            }`}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase">
                          Min Price
                        </label>
                        <input
                          type="number"
                          value={minPrice}
                          onChange={(e) => setMinPrice(e.target.value)}
                          className="w-full bg-gray-50 dark:bg-gray-950 border-none rounded-lg p-2 text-sm mt-1 focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase">
                          Max Price
                        </label>
                        <input
                          type="number"
                          value={maxPrice}
                          onChange={(e) => setMaxPrice(e.target.value)}
                          className="w-full bg-gray-50 dark:bg-gray-950 border-none rounded-lg p-2 text-sm mt-1 focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase">
                        Location
                      </label>
                      <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="e.g. Texas"
                        className="w-full bg-gray-50 dark:bg-gray-950 border-none rounded-lg p-2 text-sm mt-1 focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Contracts Grid */}
              <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6">
                {loading ? (
                  <div className="col-span-full flex justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                  </div>
                ) : (
                  contracts.map((c) => (
                    <div
                      key={c.id}
                      className="bg-white dark:bg-gray-950 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 flex flex-col hover:shadow-md transition-shadow relative group"
                    >
                      <div
                        className="flex justify-between items-start mb-4 cursor-pointer"
                        onClick={() => setSelectedContract(c)}
                      >
                        <div>
                          <h4 className="font-bold text-xl dark:text-white">
                            {c.energy_type}
                          </h4>
                          <p className="text-gray-400 dark:text-gray-500 text-sm">
                            {c.location}
                          </p>
                        </div>
                        <span
                          className={`px-3 py-1 text-[10px] font-bold uppercase rounded-full tracking-wider ${
                            c.status === "Available"
                              ? "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400"
                              : c.status === "Reserved"
                                ? "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400"
                                : "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400"
                          }`}
                        >
                          {c.status}
                        </span>
                      </div>
                      <div className="space-y-2 mb-6">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500 dark:text-gray-400">
                            Quantity
                          </span>
                          <span className="font-semibold dark:text-white">
                            {c.quantity_mwh} MWh
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500 dark:text-gray-400">
                            Price
                          </span>
                          <span className="font-semibold dark:text-white">
                            ${c.price_per_mwh}/MWh
                          </span>
                        </div>
                      </div>
                      <div className="mt-auto flex gap-2">
                        <button
                          onClick={() => setSelectedContract(c)}
                          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30"
                        >
                          <Info className="w-4 h-4" /> Details
                        </button>
                        <button
                          onClick={() => addToPortfolio(c.id)}
                          disabled={
                            c.status !== "Available" ||
                            portfolio.contracts.some((pc) => pc.id === c.id)
                          }
                          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:text-gray-400 dark:disabled:text-gray-600"
                        >
                          <Plus className="w-4 h-4" />{" "}
                          {portfolio.contracts.some((pc) => pc.id === c.id)
                            ? "Added"
                            : "Add"}
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <h2 className="text-3xl font-bold dark:text-white">
                My Portfolio
              </h2>
              <p className="text-gray-500 dark:text-gray-400">
                Real-time metrics and contract management.
              </p>
            </div>

            {portfolio.contracts.length === 0 ? (
              <div className="bg-white dark:bg-gray-900 rounded-3xl p-12 text-center border border-dashed border-gray-300 dark:border-gray-700">
                <Wallet className="w-16 h-16 text-gray-200 dark:text-gray-800 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2 dark:text-white">
                  Your portfolio is empty
                </h3>
                <p className="text-gray-400 dark:text-gray-500 mb-6">
                  Start adding contracts from the marketplace to build your
                  energy strategy.
                </p>
                <button
                  onClick={() => setView("marketplace")}
                  className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors"
                >
                  View Marketplace
                </button>
              </div>
            ) : (
              <div className="space-y-8">
                {/* Metrics Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
                    <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase mb-1">
                      Total Capacity
                    </p>
                    <p className="text-2xl font-bold dark:text-white">
                      {portfolio.metrics?.total_capacity_mwh?.toLocaleString()}{" "}
                      <span className="text-sm font-medium text-gray-400 dark:text-gray-500">
                        MWh
                      </span>
                    </p>
                  </div>
                  <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
                    <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase mb-1">
                      Total Cost
                    </p>
                    <p className="text-2xl font-bold dark:text-white">
                      ${portfolio.metrics?.total_cost?.toLocaleString()}{" "}
                      <span className="text-sm font-medium text-gray-400 dark:text-gray-500">
                        USD
                      </span>
                    </p>
                  </div>
                  <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
                    <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase mb-1">
                      Avg Price
                    </p>
                    <p className="text-2xl font-bold dark:text-white">
                      ${portfolio.metrics?.average_price_per_mwh?.toFixed(2)}{" "}
                      <span className="text-sm font-medium text-gray-400 dark:text-gray-500">
                        /MWh
                      </span>
                    </p>
                  </div>
                  <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
                    <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase mb-1">
                      Contracts
                    </p>
                    <p className="text-2xl font-bold dark:text-white">
                      {portfolio.metrics?.total_contracts}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Contracts List */}
                  <div className="lg:col-span-2 space-y-4">
                    <h3 className="font-bold flex items-center gap-2 dark:text-white">
                      <Wallet className="w-5 h-5 text-blue-600 dark:text-blue-400" />{" "}
                      Selected Contracts
                    </h3>
                    {portfolio.contracts.map((c) => (
                      <div
                        key={c.id}
                        className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-6">
                          <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center font-bold text-blue-600 dark:text-blue-400">
                            {c.energy_type[0]}
                          </div>
                          <div>
                            <h4 className="font-bold dark:text-white">
                              {c.energy_type}
                            </h4>
                            <p className="text-gray-400 dark:text-gray-500 text-xs">
                              {c.location} • {c.quantity_mwh} MWh
                            </p>
                          </div>
                        </div>
                        <div className="text-right flex items-center gap-8">
                          <div>
                            <p className="font-bold dark:text-white">
                              $
                              {(
                                c.quantity_mwh * c.price_per_mwh
                              ).toLocaleString()}
                            </p>
                            <p className="text-gray-400 dark:text-gray-500 text-xs">
                              ${c.price_per_mwh}/MWh
                            </p>
                          </div>
                          <button
                            onClick={() => removeFromPortfolio(c.id)}
                            className="p-2 text-gray-300 dark:text-gray-600 hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Visual Breakdown */}
                  <div className="space-y-4">
                    <h3 className="font-bold dark:text-white">
                      Energy Breakdown
                    </h3>
                    <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={chartData}
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {chartData.map((entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={COLORS[index % COLORS.length]}
                              />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Contract Details Modal */}
      {selectedContract && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[60]">
          <div className="bg-white dark:bg-gray-950 rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50 dark:bg-gray-800/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white">
                  <Sun className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-xl text-gray-900 dark:text-white">
                    Contract Details
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    ID: {selectedContract.id.slice(0, 8)}...
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedContract(null)}
                className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            <div className="p-8 overflow-y-auto space-y-8">
              {/* Header Info */}
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-2xl border border-blue-100 dark:border-blue-900/30">
                  <p className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase mb-1 tracking-wider">
                    Energy Type
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {selectedContract.energy_type}
                  </p>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-2xl border border-green-100 dark:border-green-900/30">
                  <p className="text-xs font-bold text-green-600 dark:text-green-400 uppercase mb-1 tracking-wider">
                    Status
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {selectedContract.status}
                  </p>
                </div>
              </div>

              {/* Detailed Specs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <h4 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase mb-3 flex items-center gap-2">
                      <Building2 className="w-4 h-4" /> Provider Information
                    </h4>
                    <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                      {selectedContract.provider || "Global Energy Corp"}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Certified Renewable Energy Provider
                    </p>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase mb-3 flex items-center gap-2">
                      <MapPin className="w-4 h-4" /> Delivery Location
                    </h4>
                    <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                      {selectedContract.location}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase mb-3 flex items-center gap-2">
                      <Leaf className="w-4 h-4" /> Environmental Impact
                    </h4>
                    <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                      {selectedContract.carbon_intensity || "0.0"} kg CO2/MWh
                    </p>
                    <p className="text-xs text-green-600 dark:text-green-400 font-medium">
                      Low Carbon Footprint
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h4 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase mb-3 flex items-center gap-2">
                      <Calendar className="w-4 h-4" /> Delivery Period
                    </h4>
                    <div className="flex items-center gap-2">
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-400 dark:text-gray-500">
                          Start
                        </span>
                        <span className="font-semibold dark:text-white">
                          {selectedContract.delivery_start}
                        </span>
                      </div>
                      <div className="h-px w-4 bg-gray-300 dark:bg-gray-700"></div>
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-400 dark:text-gray-500">
                          End
                        </span>
                        <span className="font-semibold dark:text-white">
                          {selectedContract.delivery_end}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase mb-3 flex items-center gap-2">
                      <Wallet className="w-4 h-4" /> Pricing Structure
                    </h4>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      ${selectedContract.price_per_mwh}
                      <span className="text-sm text-gray-400 dark:text-gray-500 font-normal">
                        /MWh
                      </span>
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Fixed price contract
                    </p>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase mb-3">
                      Total Capacity
                    </h4>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">
                      {selectedContract.quantity_mwh.toLocaleString()} MWh
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-100 dark:border-gray-800">
                <h4 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase mb-3 flex items-center gap-2">
                  <ExternalLink className="w-4 h-4" /> Description
                </h4>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {selectedContract.description ||
                    "This energy purchase agreement provides for the delivery of high-quality energy resources from certified local facilities. All delivery is subject to regional grid management protocols and quality standards."}
                </p>
              </div>
            </div>

            <div className="p-6 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-800">
              <button
                onClick={() => {
                  addToPortfolio(selectedContract.id);
                  setSelectedContract(null);
                }}
                disabled={
                  selectedContract.status !== "Available" ||
                  portfolio.contracts.some(
                    (pc) => pc.id === selectedContract.id,
                  )
                }
                className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 dark:shadow-none disabled:bg-gray-200 dark:disabled:bg-gray-800 disabled:shadow-none disabled:text-gray-400 dark:disabled:text-gray-600"
              >
                {portfolio.contracts.some((pc) => pc.id === selectedContract.id)
                  ? "Already in Portfolio"
                  : selectedContract.status !== "Available"
                    ? `Contract ${selectedContract.status}`
                    : "Reserve Contract Now"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
