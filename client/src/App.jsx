import { useState, useEffect } from "react";
import { useEnergyStore } from "./store";
import Login from "./components/Login";
import Sidebar from "./components/Sidebar";
import Marketplace from "./components/Marketplace";
import Portfolio from "./components/Portfolio";
import PriceTrends from "./components/PriceTrends";
import ContractModal from "./components/ContractModal";
import ComparisonModal from "./components/ComparisonModal";

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
  const [trends, setTrends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedContract, setSelectedContract] = useState(null);
  const [showComparison, setShowComparison] = useState(false);
  const {
    energyOptions,
    selectedEnergyTypes,
    toggleEnergyType,
    minPrice,
    maxPrice,
    location,
    sortBy,
    sortOrder,
    setMinPrice,
    setMaxPrice,
    setLocation,
    setSortBy,
    setSortOrder,
    resetFilters,
    theme,
    toggleTheme,
    comparisonList,
    toggleComparison,
    clearComparison,
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
      fetchTrends();
    }
  }, [
    user,
    filters,
    selectedEnergyTypes,
    minPrice,
    maxPrice,
    location,
    sortBy,
    sortOrder,
  ]);

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
    if (sortBy) params.append("sort_by", sortBy);
    if (sortOrder) params.append("sort_order", sortOrder);
    if (filters.min_quantity)
      params.append("min_quantity", filters.min_quantity);
    if (filters.max_quantity)
      params.append("max_quantity", filters.max_quantity);
    if (filters.start_date) params.append("start_date", filters.start_date);
    if (filters.end_date) params.append("end_date", filters.end_date);

    setLoading(true);
    fetch(`/api/contracts?${params.toString()}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setContracts(data);
        setLoading(false);
      });
  };

  const fetchPortfolio = () => {
    fetch("/api/portfolio", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setPortfolio(data));
  };

  const fetchTrends = () => {
    fetch("/api/contracts/trends", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setTrends(data));
  };

  const addToPortfolio = (contractId) => {
    fetch(`/api/portfolio/${contractId}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    }).then(() => fetchPortfolio());
  };

  const removeFromPortfolio = (contractId) => {
    fetch(`/api/portfolio/${contractId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    }).then(() => fetchPortfolio());
  };

  const markContractAsSold = (contractId) => {
    fetch(`/api/contracts/${contractId}/sell`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    }).then(() => {
      fetchPortfolio();
      fetchContracts();
    });
  };

  const login = async (e) => {
    e.preventDefault();
    setAuthError("");
    try {
      const response = await fetch("/api/login", {
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
      <Login
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        login={login}
        authError={authError}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col md:flex-row text-gray-900 dark:text-white">
      <Sidebar
        view={view}
        setView={setView}
        theme={theme}
        toggleTheme={toggleTheme}
        user={user}
        logout={logout}
      />

      <main className="flex-grow p-4 md:p-8 overflow-y-auto h-screen">
        {view === "marketplace" ? (
          <Marketplace
            contracts={contracts}
            loading={loading}
            energyOptions={energyOptions}
            selectedEnergyTypes={selectedEnergyTypes}
            toggleEnergyType={toggleEnergyType}
            minPrice={minPrice}
            setMinPrice={setMinPrice}
            maxPrice={maxPrice}
            setMaxPrice={setMaxPrice}
            location={location}
            setLocation={setLocation}
            sortBy={sortBy}
            setSortBy={setSortBy}
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
            resetFilters={resetFilters}
            setFilters={setFilters}
            setSelectedContract={setSelectedContract}
            addToPortfolio={addToPortfolio}
            portfolio={portfolio}
            comparisonList={comparisonList}
            toggleComparison={toggleComparison}
            setShowComparison={setShowComparison}
          />
        ) : view === "portfolio" ? (
          <Portfolio
            portfolio={portfolio}
            setView={setView}
            removeFromPortfolio={removeFromPortfolio}
            markContractAsSold={markContractAsSold}
          />
        ) : (
          <PriceTrends trends={trends} energyOptions={energyOptions} />
        )}
      </main>

      <ContractModal
        selectedContract={selectedContract}
        setSelectedContract={setSelectedContract}
        addToPortfolio={addToPortfolio}
        portfolio={portfolio}
      />

      <ComparisonModal
        isOpen={showComparison}
        onClose={() => setShowComparison(false)}
        contracts={comparisonList}
        clearComparison={clearComparison}
        addToPortfolio={addToPortfolio}
        portfolio={portfolio}
      />
    </div>
  );
}

export default App;
