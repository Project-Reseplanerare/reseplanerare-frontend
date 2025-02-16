import {create} from 'zustand';

interface TravelOptionsState {
  selectedOption: string | null;
  setSelectedOption: (option: string) => void;
}

export const useTravelOptionsStore = create<TravelOptionsState>((set) => ({
  selectedOption: null, 
  setSelectedOption: (option) => set({ selectedOption: option }),
}));