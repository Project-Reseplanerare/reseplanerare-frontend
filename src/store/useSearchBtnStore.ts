import { create } from 'zustand';
import searchBtnStore from '../interfaces/storeInterfaces/searchBtn_interfaces';

export const useSearchBtnStore = create<searchBtnStore>((set) => ({
  isButtonClicked: false,
  setIsButtonClicked: (status: boolean) => set({ isButtonClicked: status }),
}));
