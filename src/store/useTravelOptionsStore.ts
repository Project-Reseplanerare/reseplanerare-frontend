import { create } from 'zustand';
import TravelOptionsState from '../interfaces/storeInterfaces/travelOptions_interfaces';

export const useTravelOptionsStore = create<TravelOptionsState>((set) => ({
  selectedOption: null,
  setSelectedOption: (option) => set({ selectedOption: option }),
}));
