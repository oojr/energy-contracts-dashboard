import { Wallet, Trash2, CheckCircle2 } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d"];

export default function Portfolio({ portfolio, setView, removeFromPortfolio, markContractAsSold }) {
  const chartData = portfolio.metrics?.breakdown_by_type
    ? Object.entries(portfolio.metrics.breakdown_by_type).map(([name, value]) => ({
        name,
        value,
      }))
    : [];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold dark:text-white">My Portfolio</h2>
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
            Start adding contracts from the marketplace to build your energy strategy.
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
                      <h4 className="font-bold dark:text-white">{c.energy_type}</h4>
                      <p className="text-gray-400 dark:text-gray-500 text-xs">
                        {c.location} • {c.quantity_mwh} MWh
                      </p>
                    </div>
                  </div>
                  <div className="text-right flex items-center gap-8">
                    <div>
                      <p className="font-bold dark:text-white">
                        ${(c.quantity_mwh * c.price_per_mwh).toLocaleString()}
                      </p>
                      <p className="text-gray-400 dark:text-gray-500 text-xs">
                        ${c.price_per_mwh}/MWh
                      </p>
                    </div>
                    {c.status !== "Sold" && (
                      <button
                        onClick={() => markContractAsSold(c.id)}
                        title="Mark as Sold"
                        className="p-2 text-gray-300 dark:text-gray-600 hover:text-green-500 transition-colors"
                      >
                        <CheckCircle2 className="w-5 h-5" />
                      </button>
                    )}
                    <button
                      onClick={() => removeFromPortfolio(c.id)}
                      title="Remove from Portfolio"
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
              <h3 className="font-bold dark:text-white">Energy Breakdown</h3>
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
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
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
  );
}