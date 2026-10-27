const nights = (start, end) => Math.round((new Date(end) - new Date(start)) / 86400000)

const mk = (hostelId, rows) =>
  rows.map(([id, guestName, source, status, bed, start, end, rate, rest = {}]) => {
    const segments = rest.segments ?? [{ start, end, rate }]
    const amount = segments.reduce((sum, segment) => sum + nights(segment.start, segment.end) * segment.rate, 0)
    return {
      id,
      hostelId,
      guestName,
      source,
      status,
      bed,
      start,
      end,
      rate,
      amount,
      currency: 'USD',
      balance: 0,
      segments,
      guests: 1,
      country: '',
      phone: '',
      email: `${guestName.split(' ')[0].toLowerCase()}.${guestName.split(' ').slice(-1)[0].toLowerCase()}@mail.com`,
      notes: '',
      createdAt: '2026-09-10 09:00',
      createdBy: hostelId === 'addis' ? 'Sara Bekele' : 'Daniel Mwangi',
      ...rest,
    }
  })

export const INITIAL_BOOKINGS = [
  ...mk('addis', [
    ['BK-2417', 'Amara Okafor', 'phone', 'checked-in', 'hawassa-A', '2026-09-14', '2026-09-18', 12, { country: 'Nigeria', phone: '+234 803 555 0142', notes: 'Lower bunk requested. Paid in full by card.', createdAt: '2026-08-30 11:04' }],
    ['BK-2418', 'Lukas Meyer', 'direct', 'checked-in', 'hawassa-B', '2026-09-12', '2026-09-19', 12, { country: 'Germany', phone: '+49 151 555 0198', segments: [{ start: '2026-09-12', end: '2026-09-16', rate: 12 }, { start: '2026-09-16', end: '2026-09-19', rate: 15 }], notes: 'Extended 3 nights at a higher rate.', createdAt: '2026-08-24 09:12' }],
    ['BK-2419', 'Mei Tanaka', 'whatsapp', 'reserved', 'hawassa-C', '2026-09-17', '2026-09-21', 12, { country: 'Japan', phone: '+81 90 5555 0121', balance: 48, notes: 'Arriving around 19:00. Late check-in agreed.', createdAt: '2026-09-02 14:38' }],
    ['BK-2420', 'Sofia Rossi', 'direct', 'reserved', 'hawassa-D', '2026-09-17', '2026-09-20', 12, { country: 'Italy', phone: '+39 333 555 0177', balance: 0, notes: 'Prepaid in full by card. No payment due at the desk.', createdBy: 'Sara Bekele', createdAt: '2026-09-10 08:20' }],
    ['BK-2431', 'Tomás Silva', 'direct', 'checked-out', 'hawassa-D', '2026-09-13', '2026-09-17', 12, { country: 'Portugal', phone: '+351 912 555 043', notes: 'Checked out 10:40. Bed ready for 14:00.', createdAt: '2026-08-19 16:02' }],
    ['BK-2432', 'Eric Nsengimana', 'direct', 'reserved', 'hawassa-E', '2026-09-17', '2026-09-20', 12, { country: 'Rwanda', phone: '+250 788 555 061', balance: 108, groupId: 'G-77', groupName: 'Kigali FC U19', notes: 'Group leader. Invoice to the club.', createdBy: 'Sara Bekele', createdAt: '2026-09-06 12:11' }],
    ['BK-2433', 'Patrick Habimana', 'direct', 'reserved', 'hawassa-F', '2026-09-17', '2026-09-20', 12, { country: 'Rwanda', phone: '+250 788 555 062', groupId: 'G-77', groupName: 'Kigali FC U19', notes: 'Under 18 — guardian consent on file.', createdBy: 'Sara Bekele', createdAt: '2026-09-06 12:11' }],
    ['BK-2434', 'Samuel Uwase', 'direct', 'reserved', 'hawassa-G', '2026-09-17', '2026-09-20', 12, { country: 'Rwanda', phone: '+250 788 555 063', groupId: 'G-77', groupName: 'Kigali FC U19', notes: 'Under 18 — guardian consent on file.', createdBy: 'Sara Bekele', createdAt: '2026-09-06 12:11' }],
    ['BK-2422', 'Daniel Kim', 'direct', 'checked-in', 'hawassa-H', '2026-09-15', '2026-09-22', 12, { country: 'South Korea', phone: '+82 10 5555 0288', notes: 'Paying by card on departure.', createdAt: '2026-08-28 19:44' }],
    ['BK-2423', 'Priya Nair', 'phone', 'reserved', 'female6-A', '2026-09-17', '2026-09-23', 14, { country: 'India', phone: '+91 98 5555 0311', balance: 84, notes: 'Arriving 22:30, night bus from Hawassa.', createdAt: '2026-09-01 07:55' }],
    ['BK-2424', 'Emma Weber', 'phone', 'checked-in', 'female6-B', '2026-09-13', '2026-09-18', 14, { country: 'Austria', phone: '+43 660 555 019', notes: 'Extended once, already paid.', createdAt: '2026-08-21 10:31' }],
    ['BK-2425', 'Fatima Al-Sayed', 'phone', 'reserved', 'female6-C', '2026-09-17', '2026-09-19', 14, { country: 'Egypt', phone: '+20 100 555 0188', balance: 28, notes: 'Walk-in enquiry converted by phone.', createdBy: 'Hanna Girma', createdAt: '2026-09-15 17:09' }],
    ['BK-2426', 'Ana Sousa', 'direct', 'checked-out', 'female6-D', '2026-09-14', '2026-09-17', 14, { country: 'Brazil', phone: '+55 11 95555 0244', notes: 'Left luggage until 18:00.', createdAt: '2026-08-26 13:18' }],
    ['BK-2427', 'Chloe Martin', 'whatsapp', 'reserved', 'female6-E', '2026-09-19', '2026-09-24', 14, { country: 'France', phone: '+33 6 55 55 01 27', balance: 70, notes: 'Requests bottom bunk.', createdAt: '2026-09-11 11:47' }],
    ['BK-2428', 'Yuki Sato', 'whatsapp', 'checked-in', 'female6-F', '2026-09-16', '2026-09-21', 14, { country: 'Japan', phone: '+81 80 5555 0344', notes: '', createdAt: '2026-08-29 21:03' }],
    ['BK-2429', "James O'Brien", 'direct', 'checked-in', 'bahirdar-A', '2026-09-15', '2026-09-19', 30, { country: 'Ireland', phone: '+353 87 555 0166', guests: 2, notes: 'Double room, two guests. Extra towel requested.', createdBy: 'Sara Bekele', createdAt: '2026-08-18 08:14' }],
    ['BK-2430', 'Noor Haddad', 'phone', 'reserved', 'bahirdar-A', '2026-09-21', '2026-09-25', 30, { country: 'Jordan', phone: '+962 79 555 0192', balance: 120, guests: 2, notes: 'Honeymoon — quiet room requested.', createdAt: '2026-09-04 15:26' }],
    ['BK-2435', 'Lena Fischer', 'phone', 'checked-out', 'bale-A', '2026-09-12', '2026-09-17', 30, { country: 'Germany', phone: '+49 160 555 0210', guests: 2, notes: 'Departed 09:15.', createdAt: '2026-08-15 10:02' }],
    ['BK-2436', 'Hana Tesfaye', 'walkin', 'checked-in', 'denakil-A', '2026-09-16', '2026-09-19', 25, { country: 'Ethiopia', phone: '+251 91 555 0190', notes: 'Walk-in, single room, paid cash.', createdBy: 'Sara Bekele', createdAt: '2026-09-16 10:40' }],
  ]),
  ...mk('nairobi', [
    ['BK-3601', 'Grace Wanjiru', 'direct', 'checked-in', 'masaimara-A', '2026-09-15', '2026-09-19', 18, { country: 'Kenya', phone: '+254 712 555 101', createdAt: '2026-08-27 12:40' }],
    ['BK-3602', 'Peter Otieno', 'direct', 'checked-in', 'masaimara-B', '2026-09-14', '2026-09-18', 18, { country: 'Kenya', phone: '+254 733 555 102', notes: 'Regular guest, 4th stay.', createdBy: 'Daniel Mwangi', createdAt: '2026-09-01 09:15' }],
    ['BK-3612', 'Fatou Diallo', 'phone', 'checked-in', 'masaimara-C', '2026-09-16', '2026-09-19', 18, { country: 'Senegal', phone: '+221 77 555 112', createdAt: '2026-09-02 22:37' }],
    ['BK-3603', 'Amina Yusuf', 'phone', 'reserved', 'masaimara-D', '2026-09-17', '2026-09-21', 18, { country: 'Somalia', phone: '+252 61 555 103', balance: 72, notes: 'Arriving after midnight.', createdAt: '2026-09-08 18:22' }],
    ['BK-3604', 'Tom Becker', 'whatsapp', 'reserved', 'kisumu-A', '2026-09-16', '2026-09-20', 18, { country: 'Netherlands', phone: '+31 6 5555 0104', createdAt: '2026-09-03 20:11' }],
    ['BK-3605', 'Joseph Kariuki', 'walkin', 'checked-out', 'kisumu-B', '2026-09-13', '2026-09-17', 18, { country: 'Kenya', phone: '+254 700 555 105', notes: 'Walk-in, paid cash.', createdBy: 'Daniel Mwangi', createdAt: '2026-09-13 14:02' }],
    ['BK-3606', 'Sarah Njeri', 'direct', 'reserved', 'kisumu-C', '2026-09-18', '2026-09-23', 18, { country: 'Kenya', phone: '+254 721 555 106', balance: 90, createdBy: 'Daniel Mwangi', createdAt: '2026-09-12 11:33' }],
    ['BK-3607', 'Lena Hoffmann', 'direct', 'checked-in', 'turkana-A', '2026-09-15', '2026-09-20', 22, { country: 'Germany', phone: '+49 170 555 107', segments: [{ start: '2026-09-15', end: '2026-09-18', rate: 22 }, { start: '2026-09-18', end: '2026-09-20', rate: 25 }], notes: 'Extended 2 nights at a higher rate.', createdAt: '2026-08-22 07:48' }],
    ['BK-3608', 'Wanjiku Mwangi', 'direct', 'reserved', 'naivasha-A', '2026-09-17', '2026-09-19', 20, { country: 'Kenya', phone: '+254 722 555 108', balance: 40, notes: 'Friend of staff.', createdBy: 'Daniel Mwangi', createdAt: '2026-09-16 16:41' }],
    ['BK-3609', 'Aisha Mohamed', 'phone', 'checked-in', 'naivasha-B', '2026-09-14', '2026-09-18', 20, { country: 'Kenya', phone: '+254 715 555 109', createdAt: '2026-08-25 13:05' }],
    ['BK-3610', 'David Ochieng', 'walkin', 'checked-in', 'nakuru-A', '2026-09-16', '2026-09-19', 55, { country: 'Kenya', phone: '+254 728 555 110', guests: 2, notes: 'Walk-in, card payment.', createdBy: 'Daniel Mwangi', createdAt: '2026-09-16 18:52' }],
    ['BK-3611', 'Michaela Braun', 'direct', 'reserved', 'nakuru-A', '2026-09-20', '2026-09-24', 55, { country: 'Germany', phone: '+49 152 555 111', balance: 220, guests: 2, createdAt: '2026-09-09 10:20' }],
  ]),
]
export const HOLDS = [
  { id: 'H-31', hostelId: 'addis', bed: 'bale-A', start: '2026-09-18', end: '2026-09-21', reason: 'Broken window latch', createdBy: 'Almaz Tesfaye', createdAt: '2026-09-16 09:20' },
  { id: 'H-32', hostelId: 'addis', bed: 'female6-F', start: '2026-09-25', end: '2026-09-27', reason: 'Deep clean', createdBy: 'Sara Bekele', createdAt: '2026-09-15 17:02' },
  { id: 'H-41', hostelId: 'nairobi', bed: 'masaimara-D', start: '2026-09-19', end: '2026-09-22', reason: 'Fan replacement', createdBy: 'Daniel Mwangi', createdAt: '2026-09-16 11:45' },
]

export const GUESTS = [
  { id: 'g1', name: 'Mei Tanaka', country: 'Japan', phone: '+81 90 5555 0121', email: 'mei.tanaka@mail.jp', stays: 2, nights: 7, lastStay: '2026-09-17', doc: 'Passport · TK 884 120', notes: 'Late check-in agreed for 17 Sep. Prefers a lower bunk and a quiet corner.', balance: 48, currency: 'USD', folio: 'BK-2419' },
  { id: 'g2', name: 'Amara Okafor', country: 'Nigeria', phone: '+234 803 555 0142', email: 'amara.okafor@mail.com', stays: 3, nights: 11, lastStay: '2026-09-14', doc: 'Passport · A0 442 118', notes: 'Returning guest. Paid by card on arrival.', balance: 0, currency: 'USD', folio: 'BK-2417' },
  { id: 'g3', name: 'Lukas Meyer', country: 'Germany', phone: '+49 151 555 0198', email: 'l.meyer@mail.de', stays: 1, nights: 7, lastStay: '2026-09-12', doc: 'Passport · D 552 901', notes: 'Allergic to feather pillows.', balance: 0, currency: 'USD', folio: 'BK-2418' },
  { id: 'g4', name: 'Sofia Rossi', country: 'Italy', phone: '+39 333 555 0177', email: 'sofia.rossi@mail.it', stays: 1, nights: 3, lastStay: '2026-09-17', doc: 'ID card · IT 771 442', notes: 'Prepaid in full by card. No balance at the desk.', balance: 0, currency: 'USD', folio: 'BK-2420' },
  { id: 'g5', name: 'Priya Nair', country: 'India', phone: '+91 98 5555 0311', email: 'priya.nair@mail.in', stays: 1, nights: 6, lastStay: '2026-09-17', doc: 'Passport · IN 228 553', notes: 'Arriving 22:30 from Hawassa. Keep the gate light on.', balance: 84, currency: 'USD', folio: 'BK-2423' },
  { id: 'g6', name: 'Fatima Al-Sayed', country: 'Egypt', phone: '+20 100 555 0188', email: 'fatima.alsayed@mail.eg', stays: 1, nights: 2, lastStay: '2026-09-17', doc: 'Passport · EG 901 220', notes: 'Booked by phone, no deposit taken.', balance: 28, currency: 'USD', folio: 'BK-2425' },
  { id: 'g7', name: "James O'Brien", country: 'Ireland', phone: '+353 87 555 0166', email: 'j.obrien@mail.ie', stays: 2, nights: 8, lastStay: '2026-09-15', doc: 'Passport · IE 330 771', notes: 'Double room, two guests. Extra towel delivered.', balance: 0, currency: 'USD', folio: 'BK-2429' },
  { id: 'g8', name: 'Emma Weber', country: 'Austria', phone: '+43 660 555 019', email: 'emma.weber@mail.at', stays: 2, nights: 9, lastStay: '2026-09-13', doc: 'Passport · AT 118 002', notes: 'Extended once, already paid.', balance: 0, currency: 'USD', folio: 'BK-2424' },
  { id: 'g9', name: 'Daniel Kim', country: 'South Korea', phone: '+82 10 5555 0288', email: 'daniel.kim@mail.kr', stays: 1, nights: 7, lastStay: '2026-09-15', doc: 'Passport · KR 552 881', notes: 'Paying by card on departure.', balance: 0, currency: 'USD', folio: 'BK-2422' },
  { id: 'g10', name: 'Yuki Sato', country: 'Japan', phone: '+81 80 5555 0344', email: 'yuki.sato@mail.jp', stays: 3, nights: 14, lastStay: '2026-09-16', doc: 'Passport · JP 771 003', notes: 'Quiet guest, third stay.', balance: 0, currency: 'USD', folio: 'BK-2428' },
  { id: 'g11', name: 'Noor Haddad', country: 'Jordan', phone: '+962 79 555 0192', email: 'noor.haddad@mail.jo', stays: 1, nights: 4, lastStay: '2026-09-21', doc: 'Passport · JO 220 118', notes: 'Honeymoon — quiet room requested.', balance: 120, currency: 'USD', folio: 'BK-2430' },
  { id: 'g12', name: 'Eric Nsengimana', country: 'Rwanda', phone: '+250 788 555 061', email: 'eric.n@kigalifc.rw', stays: 1, nights: 3, lastStay: '2026-09-17', doc: 'Passport · RW 118 220', notes: 'Group leader for Kigali FC U19. Invoice to the club.', balance: 108, currency: 'USD', folio: 'BK-2432' },
  { id: 'g13', name: 'Chloe Martin', country: 'France', phone: '+33 6 55 55 01 27', email: 'chloe.martin@mail.fr', stays: 1, nights: 5, lastStay: '2026-09-19', doc: 'Passport · FR 552 118', notes: 'Requests bottom bunk.', balance: 70, currency: 'USD', folio: 'BK-2427' },
  { id: 'g14', name: 'Grace Wanjiru', country: 'Kenya', phone: '+254 712 555 101', email: 'grace.w@mail.ke', stays: 4, nights: 16, lastStay: '2026-09-15', doc: 'ID card · KE 771 220', notes: 'Regular guest at the Nairobi property.', balance: 0, currency: 'USD', folio: 'BK-3601' },
]



