import { create } from "zustand";
import type { PeriodId } from "@/lib/constants";
import type { TransactionDTO } from "@/lib/server/finance";

type AddMode = "expense" | "income" | null;

type AppStore = {
  period: PeriodId;
  customFrom: string;
  customTo: string;
  addOpen: boolean;
  addMode: AddMode;
  editing: TransactionDTO | null;
  setPeriod: (period: PeriodId) => void;
  setCustom: (from: string, to: string) => void;
  openAdd: (mode?: AddMode) => void;
  openEdit: (tx: TransactionDTO) => void;
  closeAdd: () => void;
};

export const useAppStore = create<AppStore>((set) => ({
  period: "this_month",
  customFrom: "",
  customTo: "",
  addOpen: false,
  addMode: null,
  editing: null,
  setPeriod: (period) => set({ period }),
  setCustom: (customFrom, customTo) => set({ customFrom, customTo, period: "custom" }),
  openAdd: (mode = null) => set({ addOpen: true, addMode: mode, editing: null }),
  openEdit: (tx) => set({ addOpen: true, addMode: tx.type, editing: tx }),
  closeAdd: () => set({ addOpen: false, addMode: null, editing: null }),
}));
