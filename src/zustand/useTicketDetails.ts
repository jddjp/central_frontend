import { create } from 'zustand'

interface ticketState {
  detail: any
  setOrderData: (payload: any) => void
}

export const useTicketDetail = create<ticketState>()((set) => ({
  detail: {},
  setOrderData: (payload) => set(() => ({ detail: payload })),
}))