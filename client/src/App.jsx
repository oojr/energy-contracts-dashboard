import { useState, useEffect } from 'react'

function App() {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:8000/contracts')
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
  }, []);

  if (loading) return <div className="flex justify-center items-center h-screen text-xl">Loading contracts...</div>;
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

      <main>
        <div className="grid grid-cols-1 md:grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-5">
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
      </main>
    </div>
  );
}

export default App
