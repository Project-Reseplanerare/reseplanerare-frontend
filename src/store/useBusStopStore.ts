import {create} from 'zustand';
interface busStopStore {
  fromStopId: string;
  toStopId: string;
  setFromStopId: (id: string) => void;
  setToStopId: (id: string) => void;
}

export const useBusStopStore = create<busStopStore>((set) => ({
  fromStopId: '',
  toStopId: '',
  setFromStopId: (id: string) => set({ fromStopId: id }),
  setToStopId: (id: string) => set({ toStopId: id }),
}));