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
      resetFilters: () =>
        set({
          selectedEnergyTypes: [],
          minPrice: 0,
          maxPrice: 100,
          location: "",
        }),
    }),
    {
      name: "energy-storage",
    },
  ),
);
