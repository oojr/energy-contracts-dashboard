import { Sun, X, Building2, MapPin, Leaf, Calendar, Wallet, ExternalLink } from "lucide-react";

export default function ContractModal({
  selectedContract,
  setSelectedContract,
  addToPortfolio,
  portfolio,
}) {
  if (!selectedContract) return null;

  return (
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
                    <span className="text-xs text-gray-400 dark:text-gray-500">Start</span>
                    <span className="font-semibold dark:text-white">
                      {selectedContract.delivery_start}
                    </span>
                  </div>
                  <div className="h-px w-4 bg-gray-300 dark:bg-gray-700"></div>
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-400 dark:text-gray-500">End</span>
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
              portfolio.contracts.some((pc) => pc.id === selectedContract.id)
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
  );
}