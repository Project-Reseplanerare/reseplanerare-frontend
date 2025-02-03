import {create} from 'zustand';

interface searchBtnStore {
  isButtonClicked: boolean; 
  setIsButtonClicked: (status: boolean) => void; 
}

export const useSearchBtnStore = create<searchBtnStore>((set) => ({
  isButtonClicked: false,
  setIsButtonClicked: (status: boolean) => set({ isButtonClicked: status }),
}));