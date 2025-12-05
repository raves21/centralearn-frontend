import {create} from "zustand"

type Values = {
    topPanelPointerEventsNone: boolean
}

type Actions = {
    setTopPanelPointerEventsNone: (value: boolean) => void
}

type Store = Values & Actions

const initialState: Values = {
    topPanelPointerEventsNone: false
}


//A STORE FOR SMALL STATE BUT NEEDS TO BE GLOBALLY ACCESSIBLE
export const useGeneralStore = create<Store>((set) => ({
    ...initialState,
    setTopPanelPointerEventsNone: (value: boolean) => set({ topPanelPointerEventsNone: value })
}))