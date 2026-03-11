import { Wallet, Filter, Info, Plus } from "lucide-react";

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
  resetFilters,
  setFilters,
  setSelectedContract,
  addToPortfolio,
  portfolio,
}) {
  return (
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
          {contracts?.filter((c) => c.status === "Available").length} Available
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
  );
}
