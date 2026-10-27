import { ACCOUNTS } from './core'

export const CATEGORIES = {
  Income: ['Restaurant', 'Bar', 'Room booking', 'Souvenirs', 'Laundry', 'Events', 'Tours'],
  Expense: ['Restaurant', 'Bar', 'Room booking', 'Souvenirs', 'Laundry', 'Events', 'Tours', 'Utilities', 'Salary', 'Rent'],
}

export const ALL_CATEGORIES = [...new Set([...CATEGORIES.Income, ...CATEGORIES.Expense])]

export const INCOME_CATEGORIES = CATEGORIES.Income

const currencyOf = (accountId) => ACCOUNTS.find((a) => a.id === accountId)?.currency ?? 'ETB'

const tx = (hostelId, rows) =>
  rows.map(([id, date, type, category, description, amount, method, accountId, recordedBy, guest = ''], i) => ({
    id,
    hostelId,
    date,
    type,
    category,
    description,
    amount,
    currency: currencyOf(accountId),
    method,
    accountId,
    recordedBy,
    guest,
    ref: `TXN-${id}`,
    createdAt: `${date} ${String(9 + (i % 8)).padStart(2, '0')}:${String((i * 7) % 60).padStart(2, '0')}`,
  }))

export const INITIAL_LEDGER = [
  ...tx('addis', [
    ['1001', '2026-09-17', 'Income', 'Room booking', 'Mei Tanaka · BK-2419', 4800, 'Cash', 'addis-cash', 'Sara Bekele', 'Mei Tanaka'],
    ['1002', '2026-09-17', 'Income', 'Restaurant', 'Breakfast · 14 covers', 2450, 'Cash', 'addis-cash', 'Hanna Girma'],
    ['1003', '2026-09-17', 'Expense', 'Restaurant', 'Restaurant supplies · Merkato', 1200, 'Cash', 'addis-cash', 'Hanna Girma'],
    ['1004', '2026-09-16', 'Income', 'Room booking', 'Lukas Meyer · BK-2418', 8400, 'Card', 'addis-bank', 'Sara Bekele', 'Lukas Meyer'],
    ['1005', '2026-09-16', 'Income', 'Laundry', 'Guest laundry · 6 loads', 600, 'M-Pesa', 'addis-bank', 'Hanna Girma'],
    ['1006', '2026-09-15', 'Expense', 'Utilities', 'Water · September', 3800, 'Card', 'addis-bank', 'Almaz Tesfaye'],
    ['1007', '2026-09-14', 'Income', 'Souvenirs', 'T-shirts and postcards', 1350, 'Cash', 'addis-cash', 'Hanna Girma'],
    ['1008', '2026-09-13', 'Income', 'Room booking', 'Walk-in · single room', 60, 'Cash', 'addis-cash-usd', 'Sara Bekele'],
    ['1009', '2026-09-12', 'Expense', 'Utilities', 'Plumber · bathroom repair', 4500, 'Cash', 'addis-cash', 'Almaz Tesfaye'],
    ['1010', '2026-09-10', 'Income', 'Room booking', "James O'Brien · BK-2429", 11200, 'Card', 'addis-bank', 'Sara Bekele', "James O'Brien"],
    ['1011', '2026-09-09', 'Expense', 'Utilities', 'Card terminal fees · August', 120, 'Card', 'addis-bank-usd', 'Almaz Tesfaye'],
    ['1012', '2026-09-08', 'Expense', 'Salary', 'August salaries · 4 staff', 38000, 'Card', 'addis-bank', 'Almaz Tesfaye'],
    ['1013', '2026-09-05', 'Income', 'Bar', 'Bar week total', 6720, 'Cash', 'addis-cash', 'Hanna Girma'],
    ['1014', '2026-09-01', 'Expense', 'Rent', 'September rent · Addis Ababa', 45000, 'Card', 'addis-bank', 'Almaz Tesfaye'],
    ['1015', '2026-08-28', 'Expense', 'Utilities', 'Internet · August', 2600, 'Card', 'addis-bank', 'Almaz Tesfaye'],
    ['1016', '2026-08-20', 'Expense', 'Rent', 'August rent · Addis Ababa', 45000, 'Card', 'addis-bank', 'Almaz Tesfaye'],
    ['1017', '2026-08-18', 'Expense', 'Rent', 'August rent · staff quarters', 12000, 'Card', 'addis-bank', 'Almaz Tesfaye'],
    ['1018', '2026-08-12', 'Income', 'Room booking', 'Kigali FC U19 · deposit', 9600, 'Cash', 'addis-cash', 'Sara Bekele', 'Eric Nsengimana'],
    ['1019', '2026-08-03', 'Income', 'Bar', 'Bar week total', 5240, 'Cash', 'addis-cash', 'Hanna Girma'],
  ]),
  ...tx('nairobi', [
    ['2001', '2026-09-17', 'Income', 'Room booking', 'Wanjiku Mwangi · BK-3608', 5200, 'M-Pesa', 'nairobi-bank', 'Daniel Mwangi', 'Wanjiku Mwangi'],
    ['2002', '2026-09-17', 'Income', 'Restaurant', 'Lunch · 9 covers', 3100, 'Cash', 'nairobi-cash', 'Esther Wambui'],
    ['2003', '2026-09-16', 'Expense', 'Laundry', 'Linen replacement', 7800, 'Card', 'nairobi-bank', 'Daniel Mwangi'],
    ['2004', '2026-09-15', 'Income', 'Laundry', 'Guest laundry', 900, 'M-Pesa', 'nairobi-bank', 'Esther Wambui'],
    ['2005', '2026-09-14', 'Expense', 'Utilities', 'Electricity · August', 12400, 'Card', 'nairobi-bank', 'Daniel Mwangi'],
    ['2006', '2026-09-10', 'Income', 'Souvenirs', 'Craft sales', 2400, 'Cash', 'nairobi-cash', 'Esther Wambui'],
    ['2007', '2026-09-02', 'Expense', 'Rent', 'September rent · Nairobi', 85000, 'Card', 'nairobi-bank', 'Daniel Mwangi'],
    ['2008', '2026-08-21', 'Expense', 'Rent', 'August rent · Nairobi', 85000, 'Card', 'nairobi-bank', 'Daniel Mwangi'],
    ['2009', '2026-08-18', 'Income', 'Laundry', 'Guest laundry · 4 loads', 800, 'M-Pesa', 'nairobi-bank', 'Esther Wambui'],
    ['2010', '2026-08-05', 'Income', 'Laundry', 'Guest laundry · 3 loads', 600, 'M-Pesa', 'nairobi-bank', 'Esther Wambui'],
  ]),
]
export const INITIAL_TRANSFERS = [
  { id: 'TR-51', hostelId: 'addis', date: '2026-09-12', fromId: 'addis-cash-usd', toId: 'addis-bank-usd', amount: 400, toAmount: 400, by: 'Almaz Tesfaye', note: 'Weekly cash banking' },
  { id: 'TR-50', hostelId: 'addis', date: '2026-09-05', fromId: 'addis-bank', toId: 'addis-cash', amount: 10000, toAmount: 10000, by: 'Sara Bekele', note: 'Float for the weekend' },
  { id: 'TR-49', hostelId: 'addis', date: '2026-08-30', fromId: 'addis-cash-usd', toId: 'addis-bank', amount: 100, toAmount: 12400, by: 'Almaz Tesfaye', note: 'Converted at 124.00' },
  { id: 'TR-48', hostelId: 'nairobi', date: '2026-08-28', fromId: 'nairobi-bank', toId: 'nairobi-cash', amount: 15000, toAmount: 15000, by: 'Daniel Mwangi', note: 'Float for the weekend' },
]

export const INITIAL_STAFF_ENTRIES = [
  { id: 'entry-1', date: '2026-09-17', type: 'Income', category: 'Restaurant', description: 'Breakfast · 14 covers', amount: 2450, currency: 'ETB', method: 'Cash', accountId: 'addis-cash', by: 'Sara Bekele', at: '09:12' },
  { id: 'entry-2', date: '2026-09-17', type: 'Income', category: 'Laundry', description: 'Guest laundry · 6 loads', amount: 600, currency: 'ETB', method: 'M-Pesa', accountId: 'addis-bank', by: 'Sara Bekele', at: '10:04' },
  { id: 'entry-3', date: '2026-09-17', type: 'Expense', category: 'Restaurant', description: 'Restaurant supplies · Merkato', amount: 1200, currency: 'ETB', method: 'Cash', accountId: 'addis-cash', by: 'Sara Bekele', at: '11:38' },
]

