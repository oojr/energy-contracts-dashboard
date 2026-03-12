import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useEnergyStore = create(
  persist(
    (set) => ({
      energyOptions: [
        "Solar",
        "Wind",
        "Nuclear",
        "Hydro",
        "Geothermal",
        "Natural Gas",
        "Coal",
        "Oil",
      ],
      selectedEnergyTypes: [],
      minPrice: 0,
      maxPrice: 100,
      location: "",
      sortBy: "delivery_start",
      sortOrder: "asc",
      comparisonList: [],
      theme: "light",
      toggleTheme: () =>
        set((state) => ({
          theme: state.theme === "light" ? "dark" : "light",
        })),
      toggleEnergyType: (type) =>
        set((state) => ({
          selectedEnergyTypes: state.selectedEnergyTypes.includes(type)
            ? state.selectedEnergyTypes.filter((t) => t !== type)
            : [...state.selectedEnergyTypes, type],
        })),
      setMinPrice: (price) => set({ minPrice: price }),
      setMaxPrice: (price) => set({ maxPrice: price }),
      setLocation: (loc) => set({ location: loc }),
      setSortBy: (field) => set({ sortBy: field }),
      setSortOrder: (order) => set({ sortOrder: order }),
      toggleComparison: (contract) =>
        set((state) => {
          const exists = state.comparisonList.find((c) => c.id === contract.id);
          if (exists) {
            return {
              comparisonList: state.comparisonList?.filter(
                (c) => c.id !== contract.id,
              ),
            };
          }
          if (state.comparisonList.length >= 3) return state;
          return { comparisonList: [...state.comparisonList, contract] };
        }),
      clearComparison: () => set({ comparisonList: [] }),
      resetFilters: () =>
        set({
          selectedEnergyTypes: [],
          minPrice: 0,
          maxPrice: 100,
          location: "",
          sortBy: "delivery_start",
          sortOrder: "asc",
        }),
    }),
    {
      name: "energy-storage",
    },
  ),
);
