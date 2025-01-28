import {create} from 'zustand';

interface TravelOptionsState {
  selectedOption: string | null;
  setSelectedOption: (option: string) => void;
}

export const useTravelOptionsStore = create<TravelOptionsState>((set) => ({
  selectedOption: "Bil", 
  setSelectedOption: (option) => set({ selectedOption: option }),
}));