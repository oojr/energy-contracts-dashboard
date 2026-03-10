import { useState, useEffect } from 'react'

function App() {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    energy_types: [],
    min_price: '',
    max_price: '',
    min_quantity: '',
    max_quantity: '',
    location: '',
    start_date: '',
    end_date: ''
  });

  const energyOptions = ['Solar', 'Wind', 'Nuclear', 'Hydro', 'Geothermal'];

  useEffect(() => {
    const params = new URLSearchParams();
    filters.energy_types.forEach(type => params.append('energy_types', type));
    if (filters.min_price) params.append('min_price', filters.min_price);
    if (filters.max_price) params.append('max_price', filters.max_price);
    if (filters.min_quantity) params.append('min_quantity', filters.min_quantity);
    if (filters.max_quantity) params.append('max_quantity', filters.max_quantity);
    if (filters.location) params.append('location', filters.location);
    if (filters.start_date) params.append('start_date', filters.start_date);
    if (filters.end_date) params.append('end_date', filters.end_date);

    setLoading(true);
    fetch(`http://localhost:8000/contracts?${params.toString()}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch contracts');
        return res.json();
      })
      .then(data => {
        setContracts(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleEnergyTypeToggle = (type) => {
    setFilters(prev => ({
      ...prev,
      energy_types: prev.energy_types.includes(type)
        ? prev.energy_types.filter(t => t !== type)
        : [...prev.energy_types, type]
    }));
  };

  const clearFilters = () => {
    setFilters({
      energy_types: [],
      min_price: '',
      max_price: '',
      min_quantity: '',
      max_quantity: '',
      location: '',
      start_date: '',
      end_date: ''
    });
  };

  if (loading && contracts.length === 0) return <div className="flex justify-center items-center h-screen text-xl">Loading contracts...</div>;
  if (error) return <div className="flex justify-center items-center h-screen text-xl text-red-600">Error: {error}</div>;

  const getStatusClasses = (status) => {
    switch (status.toLowerCase()) {
      case 'available': return 'bg-[#e8f5e9] text-[#2e7d32]';
      case 'sold': return 'bg-[#ffebee] text-[#c62828]';
      case 'reserved': return 'bg-[#fff3e0] text-[#ef6c00]';
      default: return '';
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto p-5 font-sans">
      <header className="text-center mb-10">
        <h1 className="text-4xl font-bold">Energy Contract Marketplace</h1>
      </header>

      <main className="flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-64 flex-shrink-0 bg-gray-50 p-4 rounded-lg shadow-sm h-fit">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Filters</h2>
            <button
              onClick={clearFilters}
              className="text-sm text-blue-600 hover:underline"
            >
              Clear All
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Energy Type</label>
              <div className="flex flex-wrap gap-2">
                {energyOptions.map(type => (
                  <button
                    key={type}
                    onClick={() => handleEnergyTypeToggle(type)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                      filters.energy_types.includes(type)
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-700 border border-gray-300 hover:border-blue-400'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs text-gray-500">Min Price</label>
                <input
                  type="number"
                  name="min_price"
                  value={filters.min_price}
                  onChange={handleFilterChange}
                  placeholder="Min"
                  className="w-full p-2 border border-gray-300 rounded text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500">Max Price</label>
                <input
                  type="number"
                  name="max_price"
                  value={filters.max_price}
                  onChange={handleFilterChange}
                  placeholder="Max"
                  className="w-full p-2 border border-gray-300 rounded text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs text-gray-500">Min Qty (MWh)</label>
                <input
                  type="number"
                  name="min_quantity"
                  value={filters.min_quantity}
                  onChange={handleFilterChange}
                  placeholder="Min"
                  className="w-full p-2 border border-gray-300 rounded text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500">Max Qty (MWh)</label>
                <input
                  type="number"
                  name="max_quantity"
                  value={filters.max_quantity}
                  onChange={handleFilterChange}
                  placeholder="Max"
                  className="w-full p-2 border border-gray-300 rounded text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Location</label>
              <input
                type="text"
                name="location"
                value={filters.location}
                onChange={handleFilterChange}
                placeholder="Search location..."
                className="w-full p-2 border border-gray-300 rounded text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Delivery Range</label>
              <div className="space-y-2">
                <input
                  type="date"
                  name="start_date"
                  value={filters.start_date}
                  onChange={handleFilterChange}
                  className="w-full p-2 border border-gray-300 rounded text-sm"
                />
                <input
                  type="date"
                  name="end_date"
                  value={filters.end_date}
                  onChange={handleFilterChange}
                  className="w-full p-2 border border-gray-300 rounded text-sm"
                />
              </div>
            </div>
          </div>
        </aside>

        <div className="flex-grow">
          <div className="mb-4 text-gray-600">
            Found <strong>{contracts.length}</strong> contract{contracts.length !== 1 ? 's' : ''}
          </div>
          <div className={`grid grid-cols-1 xl:grid-cols-2 gap-5 transition-opacity duration-200 ${loading ? 'opacity-50' : 'opacity-100'}`}>
            {contracts.map(contract => (
              <div key={contract.id} className="bg-white rounded-xl shadow-md p-5 flex flex-col text-[#333] transition-transform duration-200 hover:-translate-y-1">
                <div className="flex justify-between items-center mb-4 border-b border-[#eee] pb-2.5">
                  <span className="font-bold text-[1.2rem] text-[#2c3e50]">{contract.energy_type}</span>
                  <span className={`px-3 py-1 rounded-[20px] text-[0.8rem] uppercase font-bold ${getStatusClasses(contract.status)}`}>
                    {contract.status}
                  </span>
                </div>
                <div className="flex-grow">
                  <p className="my-2 text-[0.95rem]"><strong>Quantity:</strong> {contract.quantity_mwh} MWh</p>
                  <p className="my-2 text-[0.95rem]"><strong>Price:</strong> ${contract.price_per_mwh}/MWh</p>
                  <p className="my-2 text-[0.95rem]"><strong>Location:</strong> {contract.location}</p>
                  <p className="my-2 text-[0.95rem]"><strong>Duration:</strong> {contract.delivery_start} to {contract.delivery_end}</p>
                </div>
                <div className="mt-auto pt-5">
                  <button
                    className="w-full p-2.5 border-none rounded-md bg-[#3498db] text-white font-bold cursor-pointer disabled:bg-[#bdc3c7] disabled:cursor-not-allowed"
                    disabled={contract.status !== 'Available'}
                  >
                    {contract.status === 'Available' ? 'Reserve Now' : 'Not Available'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App
