import { Zap, Moon, Sun, Wallet, LayoutDashboard, User, LogOut, TrendingUp } from "lucide-react";

export default function Sidebar({ view, setView, theme, toggleTheme, user, logout }) {
  return (
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
        <button
          onClick={() => setView("trends")}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
            view === "trends"
              ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
              : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
          }`}
        >
          <TrendingUp className="w-5 h-5" /> Price Trends
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
  );
}