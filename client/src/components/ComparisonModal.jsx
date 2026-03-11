import { X, Scale, ArrowRight, Wallet, Calendar, MapPin, Zap } from "lucide-react";

export default function ComparisonModal({
  isOpen,
  onClose,
  contracts,
  clearComparison,
  addToPortfolio,
  portfolio,
}) {
  if (!isOpen) return null;

  const getHighlightClass = (value, field, allContracts) => {
    const values = allContracts.map((c) => c[field]);
    if (field === "price_per_mwh") {
      return value === Math.min(...values) ? "text-green-600 dark:text-green-400 font-bold" : "";
    }
    if (field === "quantity_mwh") {
      return value === Math.max(...values) ? "text-blue-600 dark:text-blue-400 font-bold" : "";
    }
    return "";
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[70]">
      <div className="bg-white dark:bg-gray-950 rounded-3xl shadow-2xl max-w-6xl w-full overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50 dark:bg-gray-800/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white">
              <Scale className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-xl text-gray-900 dark:text-white">
                Contract Comparison
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Comparing {contracts.length} energy contracts
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={clearComparison}
              className="text-sm font-medium text-red-500 hover:text-red-600"
            >
              Clear All
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-gray-500 dark:text-gray-400" />
            </button>
          </div>
        </div>

        <div className="p-8 overflow-x-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 min-w-[800px]">
            {contracts.map((c) => (
              <div
                key={c.id}
                className="bg-gray-50 dark:bg-gray-900/50 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 space-y-6 relative"
              >
                <div className="space-y-1">
                  <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-[10px] font-bold uppercase rounded">
                    {c.energy_type}
                  </span>
                  <h4 className="text-xl font-bold dark:text-white">{c.location}</h4>
                  <p className="text-xs text-gray-500">ID: {c.id.slice(0, 8)}</p>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-white dark:bg-gray-950 rounded-xl shadow-sm">
                    <div className="flex items-center gap-2 text-gray-400 mb-1">
                      <Wallet className="w-4 h-4" />
                      <span className="text-[10px] font-bold uppercase tracking-wider">Price</span>
                    </div>
                    <p className={`text-2xl ${getHighlightClass(c.price_per_mwh, "price_per_mwh", contracts)}`}>
                      ${c.price_per_mwh}
                      <span className="text-xs font-normal text-gray-500">/MWh</span>
                    </p>
                  </div>

                  <div className="p-4 bg-white dark:bg-gray-950 rounded-xl shadow-sm">
                    <div className="flex items-center gap-2 text-gray-400 mb-1">
                      <Zap className="w-4 h-4" />
                      <span className="text-[10px] font-bold uppercase tracking-wider">Quantity</span>
                    </div>
                    <p className={`text-2xl ${getHighlightClass(c.quantity_mwh, "quantity_mwh", contracts)}`}>
                      {c.quantity_mwh.toLocaleString()}
                      <span className="text-xs font-normal text-gray-500"> MWh</span>
                    </p>
                  </div>

                  <div className="p-4 bg-white dark:bg-gray-950 rounded-xl shadow-sm">
                    <div className="flex items-center gap-2 text-gray-400 mb-1">
                      <Calendar className="w-4 h-4" />
                      <span className="text-[10px] font-bold uppercase tracking-wider">Duration</span>
                    </div>
                    <div className="text-sm space-y-1">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Start:</span>
                        <span className="font-medium dark:text-white">{c.delivery_start}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">End:</span>
                        <span className="font-medium dark:text-white">{c.delivery_end}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-white dark:bg-gray-950 rounded-xl shadow-sm">
                    <div className="flex items-center gap-2 text-gray-400 mb-1">
                      <MapPin className="w-4 h-4" />
                      <span className="text-[10px] font-bold uppercase tracking-wider">Location</span>
                    </div>
                    <p className="text-sm font-medium dark:text-white">{c.location}</p>
                  </div>
                </div>

                <button
                  onClick={() => addToPortfolio(c.id)}
                  disabled={
                    c.status !== "Available" ||
                    portfolio.contracts.some((pc) => pc.id === c.id)
                  }
                  className="w-full py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-bold hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {portfolio.contracts.some((pc) => pc.id === c.id) ? "Added" : "Reserve"}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
