import {
  Wallet,
  Filter,
  Info,
  Plus,
  ArrowUpDown,
  Scale,
  Check,
} from "lucide-react";

export default function Marketplace({
  contracts,
  loading,
  energyOptions,
  selectedEnergyTypes,
  toggleEnergyType,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  location,
  setLocation,
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder,
  resetFilters,
  setFilters,
  setSelectedContract,
  addToPortfolio,
  portfolio,
  comparisonList = [],
  toggleComparison,
  setShowComparison,
}) {
  return (
    <div className="max-w-6xl mx-auto pb-24">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-3xl font-bold dark:text-white">
            Contract Marketplace
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            Explore and reserve available energy contracts.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-white dark:bg-gray-900 px-4 py-2 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 text-sm">
            <ArrowUpDown className="w-4 h-4 text-gray-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent border-none focus:ring-0 text-gray-500 dark:text-gray-400 p-0 text-sm"
            >
              <option value="delivery_start">Date</option>
              <option value="price_per_mwh">Price</option>
              <option value="quantity_mwh">Quantity</option>
            </select>
            <button
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              className="ml-1 text-xs font-bold text-blue-600 dark:text-blue-400"
            >
              {sortOrder.toUpperCase()}
            </button>
          </div>
          <div className="flex items-center gap-2 bg-white dark:bg-gray-900 px-4 py-2 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 text-sm text-gray-500 dark:text-gray-400">
            <Wallet className="w-4 h-4" />{" "}
            {contracts?.filter((c) => c.status === "Available").length}{" "}
            Available
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
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

        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6">
          {loading ? (
            <div className="col-span-full flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            contracts.map((c) => (
              <div
                key={c.id}
                className="bg-white dark:bg-gray-950 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 flex flex-col hover:shadow-md transition-shadow relative"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="font-bold text-xl dark:text-white">
                      {c.energy_type}
                    </h4>
                    <p className="text-gray-400 dark:text-gray-500 text-sm">
                      {c.location}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => toggleComparison(c)}
                      className={`p-2 rounded-lg transition-all ${
                        comparisonList.some((comp) => comp.id === c.id)
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 dark:bg-gray-800 text-gray-400 hover:text-blue-600"
                      }`}
                      title="Compare"
                    >
                      {comparisonList.some((comp) => comp.id === c.id) ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <Scale className="w-4 h-4" />
                      )}
                    </button>
                    <span
                      className={`px-3 py-2 text-[10px] font-bold uppercase rounded-full tracking-wider ${
                        c.status === "Available"
                          ? "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400"
                          : "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400"
                      }`}
                    >
                      {c.status}
                    </span>
                  </div>
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
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 disabled:opacity-50"
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

      {comparisonList.length > 0 && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 p-4 flex items-center gap-6">
          <div className="flex -space-x-3">
            {comparisonList.map((c) => (
              <div
                key={c.id}
                className="w-12 h-12 rounded-xl bg-blue-600 border-4 border-white dark:border-gray-900 flex items-center justify-center text-white font-bold text-xs"
              >
                {c.energy_type[0]}
              </div>
            ))}
          </div>
          <button
            onClick={() => setShowComparison(true)}
            disabled={comparisonList.length < 2}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white px-6 py-2 rounded-xl font-bold transition-all"
          >
            Compare {comparisonList.length} Selected
          </button>
        </div>
      )}
    </div>
  );
}
