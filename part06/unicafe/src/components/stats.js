import { create } from 'zustand'
import { useShallow } from 'zustand/react/shallow'

const useStats = create(set => ({
  good: 0,
  neutral: 0,
  bad: 0,
  actions: {
    addGood: () => set(state => ({ good: state.good + 1 })),
    addNeutral: () => set(state => ({ neutral: state.neutral + 1 })),
    addBad: () => set(state => ({ bad: state.bad + 1 }))
  }
}))

export const useValues = () => useStats(
  useShallow((state) => ({
    good: state.good,
    neutral: state.neutral,
    bad: state.bad,
  }))
)
export const useStatControls = () => useStats(state => state.actions)
