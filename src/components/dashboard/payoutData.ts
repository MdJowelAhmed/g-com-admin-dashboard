export type PayoutFilterState = {
  statuses: string[]
  methods: string[]
}

export const EMPTY_PAYOUT_FILTER: PayoutFilterState = {
  statuses: [],
  methods: [],
}
