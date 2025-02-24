// Import Zustand
import { create } from 'zustand';
// Import travelOptions Interfaces
import TravelOptionsState from '../interfaces/storeInterfaces/travelOptions_interfaces';

export const useTravelOptionsStore = create<TravelOptionsState>((set) => ({
  selectedOption: null,
  setSelectedOption: (option) => set({ selectedOption: option }),
}));
