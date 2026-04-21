export type PayoutStatus = 'Pending' | 'Released'

export type PaymentSystem =
  | 'Secure Pay'
  | 'Quick Transfer'
  | 'Global Bank'
  | 'Express Funds'
  | 'Safe Wire'

export type PayoutCategory = 'Escrow' | 'Direct'

export type Transaction = {
  key: string
  sl: string
  transactionId: string
  name: string
  system: PaymentSystem
  grossAmount: number
  category: PayoutCategory
  status: PayoutStatus
  createdAt: string
}

export const FEE_PERCENTAGE = 0.03

export const PAYMENT_SYSTEMS: PaymentSystem[] = [
  'Secure Pay',
  'Quick Transfer',
  'Global Bank',
  'Express Funds',
  'Safe Wire',
]

export const PAYOUT_STATUSES: PayoutStatus[] = ['Pending', 'Released']

export const feeFor = (gross: number) => gross * FEE_PERCENTAGE

export const initialTransactions: Transaction[] = [
  {
    key: '1',
    sl: '01',
    transactionId: 'TXN-9021',
    name: 'Alex Johnson',
    system: 'Secure Pay',
    grossAmount: 1200,
    category: 'Escrow',
    status: 'Pending',
    createdAt: '27 Oct 2025, 10:15',
  },
  {
    key: '2',
    sl: '02',
    transactionId: 'TXN-9022',
    name: 'Maria Gonzales',
    system: 'Quick Transfer',
    grossAmount: 2500,
    category: 'Direct',
    status: 'Pending',
    createdAt: '27 Oct 2025, 10:42',
  },
  {
    key: '3',
    sl: '03',
    transactionId: 'TXN-9023',
    name: 'Samuel Lee',
    system: 'Global Bank',
    grossAmount: 3750,
    category: 'Direct',
    status: 'Pending',
    createdAt: '27 Oct 2025, 11:05',
  },
  {
    key: '4',
    sl: '04',
    transactionId: 'TXN-9024',
    name: 'Nina Patel',
    system: 'Express Funds',
    grossAmount: 980,
    category: 'Direct',
    status: 'Released',
    createdAt: '27 Oct 2025, 11:30',
  },
  {
    key: '5',
    sl: '05',
    transactionId: 'TXN-9025',
    name: 'David Kim',
    system: 'Safe Wire',
    grossAmount: 5000,
    category: 'Direct',
    status: 'Pending',
    createdAt: '27 Oct 2025, 12:02',
  },
  {
    key: '6',
    sl: '06',
    transactionId: 'TXN-9026',
    name: 'Sofia Martinez',
    system: 'Secure Pay',
    grossAmount: 1850,
    category: 'Escrow',
    status: 'Released',
    createdAt: '27 Oct 2025, 12:25',
  },
  {
    key: '7',
    sl: '07',
    transactionId: 'TXN-9027',
    name: 'Rakib Hossain',
    system: 'Quick Transfer',
    grossAmount: 640,
    category: 'Direct',
    status: 'Pending',
    createdAt: '27 Oct 2025, 12:58',
  },
  {
    key: '8',
    sl: '08',
    transactionId: 'TXN-9028',
    name: 'Tania Rahman',
    system: 'Secure Pay',
    grossAmount: 4400,
    category: 'Escrow',
    status: 'Pending',
    createdAt: '27 Oct 2025, 13:14',
  },
  {
    key: '9',
    sl: '09',
    transactionId: 'TXN-9029',
    name: 'Imran Chowdhury',
    system: 'Global Bank',
    grossAmount: 2120,
    category: 'Direct',
    status: 'Released',
    createdAt: '27 Oct 2025, 13:40',
  },
  {
    key: '10',
    sl: '10',
    transactionId: 'TXN-9030',
    name: 'Mousumi Akter',
    system: 'Secure Pay',
    grossAmount: 890,
    category: 'Escrow',
    status: 'Pending',
    createdAt: '27 Oct 2025, 14:02',
  },
  {
    key: '11',
    sl: '11',
    transactionId: 'TXN-9031',
    name: 'Sabbir Khan',
    system: 'Express Funds',
    grossAmount: 1575,
    category: 'Direct',
    status: 'Released',
    createdAt: '27 Oct 2025, 14:32',
  },
  {
    key: '12',
    sl: '12',
    transactionId: 'TXN-9032',
    name: 'Oishee Das',
    system: 'Safe Wire',
    grossAmount: 3200,
    category: 'Direct',
    status: 'Pending',
    createdAt: '27 Oct 2025, 15:01',
  },
  {
    key: '13',
    sl: '13',
    transactionId: 'TXN-9033',
    name: 'Arman Karim',
    system: 'Secure Pay',
    grossAmount: 2650,
    category: 'Escrow',
    status: 'Pending',
    createdAt: '27 Oct 2025, 15:30',
  },
  {
    key: '14',
    sl: '14',
    transactionId: 'TXN-9034',
    name: 'Hasib Ali',
    system: 'Quick Transfer',
    grossAmount: 420,
    category: 'Direct',
    status: 'Released',
    createdAt: '27 Oct 2025, 15:58',
  },
  {
    key: '15',
    sl: '15',
    transactionId: 'TXN-9035',
    name: 'Rafi Islam',
    system: 'Global Bank',
    grossAmount: 1100,
    category: 'Direct',
    status: 'Pending',
    createdAt: '27 Oct 2025, 16:20',
  },
]
