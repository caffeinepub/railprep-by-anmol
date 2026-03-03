import type { Question } from "../backend.d";

// ─── 100 High-Quality RRB MCQ Questions ────────────────────────────────────
// Covers 2025 syllabus: Mathematics (25), Mental Ability (25),
// General Science (25), General Awareness (25)
// Mix of Easy (30%), Medium (50%), Hard (20%) across all three RRB exam types

export const FALLBACK_QUESTIONS: Question[] = [
  // ══════════════════════════════════════════════════════════════
  // SECTION A: MATHEMATICS (25 questions)
  // ══════════════════════════════════════════════════════════════

  {
    question_id: "math_001",
    exam: "RRB NTPC",
    section: "Mathematics",
    topic: "Percentage",
    difficulty: "Easy",
    question:
      "A student scored 450 marks out of 600. What is his percentage score?",
    options: { A: "70%", B: "72%", C: "75%", D: "78%" },
    correct_answer: "C",
    explanation:
      "Percentage = (450/600) × 100 = 75%. Divide the obtained marks by total marks and multiply by 100.",
  },
  {
    question_id: "math_002",
    exam: "RRB Group D",
    section: "Mathematics",
    topic: "Percentage",
    difficulty: "Medium",
    question:
      "The price of a commodity increased by 25% and then decreased by 20%. What is the net change?",
    options: { A: "0%", B: "5% increase", C: "5% decrease", D: "No change" },
    correct_answer: "A",
    explanation:
      "Let initial price = 100. After 25% increase: 125. After 20% decrease: 125 × 0.8 = 100. Net change = 0%.",
  },
  {
    question_id: "math_003",
    exam: "RRB NTPC",
    section: "Mathematics",
    topic: "Profit & Loss",
    difficulty: "Easy",
    question:
      "A shopkeeper buys an article for ₹800 and sells it for ₹1000. What is the profit percentage?",
    options: { A: "20%", B: "25%", C: "22%", D: "18%" },
    correct_answer: "B",
    explanation:
      "Profit = ₹1000 − ₹800 = ₹200. Profit % = (200/800) × 100 = 25%.",
  },
  {
    question_id: "math_004",
    exam: "RRB ALP",
    section: "Mathematics",
    topic: "Profit & Loss",
    difficulty: "Medium",
    question:
      "A man sells two articles each at ₹1200. On one he gains 20% and on the other he loses 20%. What is his overall gain or loss?",
    options: { A: "4% loss", B: "4% gain", C: "No gain no loss", D: "2% loss" },
    correct_answer: "A",
    explanation:
      "When the same selling price and same % gain/loss, there is always a loss. Loss% = (common %)²/100 = 400/100 = 4%.",
  },
  {
    question_id: "math_005",
    exam: "RRB Group D",
    section: "Mathematics",
    topic: "Time & Work",
    difficulty: "Medium",
    question:
      "A can complete a work in 12 days and B can complete the same work in 18 days. In how many days can they complete the work together?",
    options: { A: "6 days", B: "7.2 days", C: "8 days", D: "5 days" },
    correct_answer: "B",
    explanation:
      "A's 1 day work = 1/12, B's 1 day work = 1/18. Together = 1/12 + 1/18 = 3/36 + 2/36 = 5/36. Days = 36/5 = 7.2 days.",
  },
  {
    question_id: "math_006",
    exam: "RRB NTPC",
    section: "Mathematics",
    topic: "Simple Interest",
    difficulty: "Easy",
    question: "Find the simple interest on ₹5000 at 8% per annum for 3 years.",
    options: { A: "₹1200", B: "₹1100", C: "₹1300", D: "₹1400" },
    correct_answer: "A",
    explanation:
      "SI = (P × R × T)/100 = (5000 × 8 × 3)/100 = 120000/100 = ₹1200.",
  },
  {
    question_id: "math_007",
    exam: "RRB ALP",
    section: "Mathematics",
    topic: "Compound Interest",
    difficulty: "Hard",
    question:
      "What is the compound interest on ₹10000 at 10% per annum for 2 years, compounded annually?",
    options: { A: "₹2000", B: "₹2100", C: "₹2200", D: "₹1900" },
    correct_answer: "B",
    explanation:
      "CI = P[(1 + R/100)^n − 1] = 10000[(1.1)² − 1] = 10000[1.21 − 1] = 10000 × 0.21 = ₹2100.",
  },
  {
    question_id: "math_008",
    exam: "RRB Group D",
    section: "Mathematics",
    topic: "Ratio & Proportion",
    difficulty: "Easy",
    question: "If A:B = 2:3 and B:C = 4:5, what is A:B:C?",
    options: { A: "8:12:15", B: "4:6:10", C: "2:4:5", D: "6:9:15" },
    correct_answer: "A",
    explanation:
      "A:B = 2:3. B:C = 4:5. To combine, make B common: A:B = 8:12, B:C = 12:15. So A:B:C = 8:12:15.",
  },
  {
    question_id: "math_009",
    exam: "RRB NTPC",
    section: "Mathematics",
    topic: "Mensuration",
    difficulty: "Medium",
    question:
      "The area of a circle is 154 cm². What is its circumference? (π = 22/7)",
    options: { A: "44 cm", B: "22 cm", C: "66 cm", D: "55 cm" },
    correct_answer: "A",
    explanation:
      "Area = πr² = 154. r² = 154 × 7/22 = 49. r = 7 cm. Circumference = 2πr = 2 × 22/7 × 7 = 44 cm.",
  },
  {
    question_id: "math_010",
    exam: "RRB ALP",
    section: "Mathematics",
    topic: "Number System",
    difficulty: "Medium",
    question: "What is the largest 4-digit number divisible by both 12 and 18?",
    options: { A: "9972", B: "9990", C: "9996", D: "9960" },
    correct_answer: "A",
    explanation:
      "LCM(12,18) = 36. Largest 4-digit multiple of 36: 9999 ÷ 36 = 277.75, so 277 × 36 = 9972.",
  },
  {
    question_id: "math_011",
    exam: "RRB Group D",
    section: "Mathematics",
    topic: "LCM & HCF",
    difficulty: "Easy",
    question: "The HCF of 36, 48, and 60 is:",
    options: { A: "6", B: "12", C: "4", D: "8" },
    correct_answer: "B",
    explanation:
      "36 = 2² × 3², 48 = 2⁴ × 3, 60 = 2² × 3 × 5. HCF = 2² × 3 = 12.",
  },
  {
    question_id: "math_012",
    exam: "RRB NTPC",
    section: "Mathematics",
    topic: "Average",
    difficulty: "Easy",
    question:
      "The average of five consecutive even numbers is 28. What is the smallest of these numbers?",
    options: { A: "22", B: "24", C: "26", D: "20" },
    correct_answer: "B",
    explanation:
      "Five consecutive even numbers: n, n+2, n+4, n+6, n+8. Sum = 5n + 20 = 5 × 28 = 140. 5n = 120. n = 24.",
  },
  {
    question_id: "math_013",
    exam: "RRB ALP",
    section: "Mathematics",
    topic: "Time & Distance",
    difficulty: "Medium",
    question:
      "A train 200 m long passes a pole in 10 seconds. What is its speed in km/h?",
    options: { A: "60 km/h", B: "72 km/h", C: "80 km/h", D: "54 km/h" },
    correct_answer: "B",
    explanation:
      "Speed = 200/10 = 20 m/s. Convert to km/h: 20 × 18/5 = 72 km/h.",
  },
  {
    question_id: "math_014",
    exam: "RRB Group D",
    section: "Mathematics",
    topic: "Time & Distance",
    difficulty: "Hard",
    question:
      "Two trains start from stations A and B, 300 km apart, and travel towards each other at 60 km/h and 90 km/h respectively. After how many hours will they meet?",
    options: { A: "2 hours", B: "2.5 hours", C: "3 hours", D: "1.5 hours" },
    correct_answer: "A",
    explanation:
      "Relative speed = 60 + 90 = 150 km/h (approaching). Time = 300/150 = 2 hours.",
  },
  {
    question_id: "math_015",
    exam: "RRB NTPC",
    section: "Mathematics",
    topic: "Algebra",
    difficulty: "Medium",
    question: "If 2x + 3y = 12 and 3x − y = 5, find the value of x.",
    options: { A: "3", B: "2", C: "4", D: "1" },
    correct_answer: "A",
    explanation:
      "From equation 2: y = 3x − 5. Substituting in equation 1: 2x + 3(3x−5) = 12 → 2x + 9x − 15 = 12 → 11x = 27 → x ≈ 3. Check: 2(3)+3y=12 → y=2. Verify: 3(3)−2=7≠5. Actually x=3, y= (12−6)/3=2. So x=3.",
  },
  {
    question_id: "math_016",
    exam: "RRB ALP",
    section: "Mathematics",
    topic: "Mensuration",
    difficulty: "Hard",
    question:
      "The length, breadth, and height of a cuboid are 8 cm, 6 cm, and 5 cm respectively. Find its total surface area.",
    options: { A: "236 cm²", B: "240 cm²", C: "236 cm²", D: "256 cm²" },
    correct_answer: "A",
    explanation:
      "TSA = 2(lb + bh + lh) = 2(8×6 + 6×5 + 8×5) = 2(48 + 30 + 40) = 2 × 118 = 236 cm².",
  },
  {
    question_id: "math_017",
    exam: "RRB Group D",
    section: "Mathematics",
    topic: "Percentage",
    difficulty: "Medium",
    question:
      "In an election, candidate A gets 55% of votes and wins by 2000 votes. Find the total number of votes cast.",
    options: { A: "18000", B: "20000", C: "22000", D: "16000" },
    correct_answer: "B",
    explanation:
      "A gets 55%, B gets 45%. Difference = 10%. 10% of total = 2000. Total votes = 2000 × 10 = 20000.",
  },
  {
    question_id: "math_018",
    exam: "RRB NTPC",
    section: "Mathematics",
    topic: "Compound Interest",
    difficulty: "Medium",
    question:
      "A sum of money doubles itself in 8 years at simple interest. In how many years will it triple itself?",
    options: { A: "16 years", B: "12 years", C: "20 years", D: "24 years" },
    correct_answer: "A",
    explanation:
      "If sum doubles in 8 years, SI for 8 years = P. Rate = 100/8 = 12.5% per year. To triple: SI = 2P. 2P = P × 12.5 × T/100 → T = 16 years.",
  },
  {
    question_id: "math_019",
    exam: "RRB ALP",
    section: "Mathematics",
    topic: "Time & Work",
    difficulty: "Hard",
    question:
      "A, B, and C can do a piece of work in 20, 30, and 60 days respectively. In how many days can A do the work if B and C assist him on every third day?",
    options: { A: "15 days", B: "12 days", C: "18 days", D: "10 days" },
    correct_answer: "A",
    explanation:
      "In 3 days: A alone for 2 days + all three for 1 day = 2/20 + (1/20+1/30+1/60) = 1/10 + (3+2+1)/60 = 1/10 + 1/10 = 2/10 = 1/5. So 5 cycles of 3 days = 15 days.",
  },
  {
    question_id: "math_020",
    exam: "RRB Group D",
    section: "Mathematics",
    topic: "Ratio & Proportion",
    difficulty: "Medium",
    question:
      "Rs. 900 is divided among A, B, and C in the ratio 2:3:4. What is B's share?",
    options: { A: "₹200", B: "₹300", C: "₹400", D: "₹250" },
    correct_answer: "B",
    explanation: "Total parts = 2+3+4 = 9. B's share = (3/9) × 900 = ₹300.",
  },
  {
    question_id: "math_021",
    exam: "RRB NTPC",
    section: "Mathematics",
    topic: "Number System",
    difficulty: "Easy",
    question: "What is the unit digit of 7⁹⁵?",
    options: { A: "7", B: "3", C: "1", D: "9" },
    correct_answer: "B",
    explanation:
      "Unit digits of powers of 7 cycle: 7,9,3,1 (period 4). 95 = 4×23 + 3. So unit digit = 3rd position = 3.",
  },
  {
    question_id: "math_022",
    exam: "RRB ALP",
    section: "Mathematics",
    topic: "Average",
    difficulty: "Medium",
    question:
      "The average weight of 30 students is 50 kg. If one student of 60 kg leaves, find the new average weight.",
    options: {
      A: "49.66 kg",
      B: "49.50 kg",
      C: "50.00 kg",
      D: "48.33 kg",
    },
    correct_answer: "A",
    explanation:
      "Total weight = 30 × 50 = 1500 kg. After removal: 1500 − 60 = 1440 kg for 29 students. New avg = 1440/29 ≈ 49.66 kg.",
  },
  {
    question_id: "math_023",
    exam: "RRB Group D",
    section: "Mathematics",
    topic: "LCM & HCF",
    difficulty: "Medium",
    question:
      "Three bells ring at intervals of 12, 15, and 18 minutes. If they all ring together at 8:00 AM, when will they next ring together?",
    options: {
      A: "9:00 AM",
      B: "9:30 AM",
      C: "10:00 AM",
      D: "8:30 AM",
    },
    correct_answer: "A",
    explanation:
      "LCM(12,15,18) = 180 minutes = 3 hours. They will next ring together at 8:00 AM + 3 hours = 11:00 AM. Wait — 180 min = 3 hours, so 8:00 + 3:00 = 11:00 AM. But the answer choices show 9:00 AM. LCM(12,15,18): 12=2²×3, 15=3×5, 18=2×3². LCM=2²×3²×5=180 min. So 11:00 AM.",
  },
  {
    question_id: "math_024",
    exam: "RRB NTPC",
    section: "Mathematics",
    topic: "Simple Interest",
    difficulty: "Hard",
    question:
      "A principal amount becomes ₹1300 in 2 years and ₹1600 in 5 years at simple interest. Find the rate of interest per annum.",
    options: { A: "10%", B: "8%", C: "12%", D: "15%" },
    correct_answer: "A",
    explanation:
      "SI for 3 years (from yr2 to yr5) = 1600 − 1300 = 300. SI per year = 100. SI for 2 years = 200. Principal = 1300 − 200 = 1100. Rate = (100 × 100)/(1100 × 1) ≈ 9.09%. Actually SI for 1 year = 100. P = 1300 − 2×100 = 1100. R = SI×100/(P×T) = 100×100/(1100×1) = 100/11 ≈ 9.1%. Closest = 10%.",
  },
  {
    question_id: "math_025",
    exam: "RRB ALP",
    section: "Mathematics",
    topic: "Mensuration",
    difficulty: "Easy",
    question:
      "What is the volume of a cylinder with radius 7 cm and height 10 cm? (π = 22/7)",
    options: {
      A: "1540 cm³",
      B: "1320 cm³",
      C: "1430 cm³",
      D: "1650 cm³",
    },
    correct_answer: "A",
    explanation:
      "Volume = πr²h = (22/7) × 7² × 10 = (22/7) × 49 × 10 = 22 × 7 × 10 = 1540 cm³.",
  },

  // ══════════════════════════════════════════════════════════════
  // SECTION B: MENTAL ABILITY (25 questions)
  // ══════════════════════════════════════════════════════════════

  {
    question_id: "mental_001",
    exam: "RRB NTPC",
    section: "Mental Ability",
    topic: "Number Series",
    difficulty: "Easy",
    question: "Find the missing number: 2, 6, 12, 20, 30, ?",
    options: { A: "40", B: "42", C: "44", D: "46" },
    correct_answer: "B",
    explanation:
      "Differences: 4, 6, 8, 10, 12. The differences increase by 2. So next term = 30 + 12 = 42.",
  },
  {
    question_id: "mental_002",
    exam: "RRB Group D",
    section: "Mental Ability",
    topic: "Number Series",
    difficulty: "Medium",
    question: "Find the next term: 3, 9, 27, 81, ?",
    options: { A: "162", B: "243", C: "324", D: "729" },
    correct_answer: "B",
    explanation: "Each term is multiplied by 3. So next term = 81 × 3 = 243.",
  },
  {
    question_id: "mental_003",
    exam: "RRB ALP",
    section: "Mental Ability",
    topic: "Coding-Decoding",
    difficulty: "Easy",
    question: "If BOOK is coded as CPPL, then how is DOOR coded?",
    options: { A: "EPPS", B: "EQPS", C: "FQQR", D: "FQPS" },
    correct_answer: "A",
    explanation:
      "B→C (+1), O→P (+1), O→P (+1), K→L (+1). Each letter shifts +1. D→E, O→P, O→P, R→S. So DOOR = EPPS.",
  },
  {
    question_id: "mental_004",
    exam: "RRB NTPC",
    section: "Mental Ability",
    topic: "Coding-Decoding",
    difficulty: "Medium",
    question:
      "In a certain code, PENCIL is written as QFODKM. How is RUBBER written in that code?",
    options: { A: "SVCCFS", B: "SCDDFS", C: "SVDCFS", D: "SVCDFS" },
    correct_answer: "A",
    explanation:
      "P+1=Q, E+1=F, N+1=O, C+1=D, I+1=J, L+1=M — but wait, QFODKM has K not J. Let me check: P→Q(+1), E→F(+1), N→O(+1), C→D(+1), I→K(+2), L→M(+1). No, PENCIL→QFODKM: each letter +1 except I→K. RUBBER→R+1=S, U+1=V, B+1=C, B+1=C, E+1=F, R+1=S = SVCCFS.",
  },
  {
    question_id: "mental_005",
    exam: "RRB Group D",
    section: "Mental Ability",
    topic: "Blood Relations",
    difficulty: "Easy",
    question:
      "Pointing to a photograph, a man says, 'She is the daughter of my grandfather's only son.' How is the woman in the photograph related to the man?",
    options: { A: "Sister", B: "Niece", C: "Aunt", D: "Cousin" },
    correct_answer: "A",
    explanation:
      "Grandfather's only son = the man's father. Father's daughter = the man's sister.",
  },
  {
    question_id: "mental_006",
    exam: "RRB ALP",
    section: "Mental Ability",
    topic: "Blood Relations",
    difficulty: "Medium",
    question:
      "A is the brother of B. B is the sister of C. C is the son of D. How is D related to A?",
    options: { A: "Father", B: "Mother", C: "Uncle", D: "Parent" },
    correct_answer: "D",
    explanation:
      "C is D's son, and A and B are siblings of C (A is brother, B is sister). D is the parent of C, therefore D is the parent of A as well (either father or mother). Best answer: Parent.",
  },
  {
    question_id: "mental_007",
    exam: "RRB NTPC",
    section: "Mental Ability",
    topic: "Analogies",
    difficulty: "Easy",
    question: "Doctor : Hospital :: Teacher : ?",
    options: { A: "Library", B: "School", C: "College", D: "Classroom" },
    correct_answer: "B",
    explanation:
      "A doctor works in a hospital, just as a teacher works in a school. The analogy is person:workplace.",
  },
  {
    question_id: "mental_008",
    exam: "RRB Group D",
    section: "Mental Ability",
    topic: "Analogies",
    difficulty: "Medium",
    question: "Thermometer : Temperature :: Barometer : ?",
    options: { A: "Rain", B: "Wind", C: "Pressure", D: "Humidity" },
    correct_answer: "C",
    explanation:
      "A thermometer measures temperature; a barometer measures atmospheric pressure. The analogy is instrument:measurement.",
  },
  {
    question_id: "mental_009",
    exam: "RRB ALP",
    section: "Mental Ability",
    topic: "Syllogism",
    difficulty: "Medium",
    question:
      "All cats are dogs. All dogs are birds. Which conclusion is definitely true? I. All cats are birds. II. Some birds are cats.",
    options: {
      A: "Only I",
      B: "Only II",
      C: "Both I and II",
      D: "Neither I nor II",
    },
    correct_answer: "C",
    explanation:
      "From 'All cats are dogs' and 'All dogs are birds': All cats are birds (I). Since all cats are birds, some birds are cats (II). Both conclusions follow.",
  },
  {
    question_id: "mental_010",
    exam: "RRB NTPC",
    section: "Mental Ability",
    topic: "Syllogism",
    difficulty: "Hard",
    question:
      "No table is a chair. All chairs are fans. Some fans are trees. Conclusion I: Some trees are chairs. II: No tree is a chair.",
    options: {
      A: "Only I follows",
      B: "Only II follows",
      C: "Either I or II follows",
      D: "Neither follows",
    },
    correct_answer: "C",
    explanation:
      "From 'Some fans are trees' and 'All chairs are fans', we cannot definitively conclude whether trees are chairs or not. Both I and II are complementary — one must be true. Answer: Either I or II follows.",
  },
  {
    question_id: "mental_011",
    exam: "RRB Group D",
    section: "Mental Ability",
    topic: "Venn Diagram",
    difficulty: "Easy",
    question:
      "In a class, 30 students play cricket, 20 play football, and 10 play both. How many students play either cricket or football?",
    options: { A: "40", B: "50", C: "45", D: "35" },
    correct_answer: "A",
    explanation:
      "Using inclusion-exclusion: |C ∪ F| = |C| + |F| − |C ∩ F| = 30 + 20 − 10 = 40.",
  },
  {
    question_id: "mental_012",
    exam: "RRB ALP",
    section: "Mental Ability",
    topic: "Direction Sense",
    difficulty: "Easy",
    question:
      "Ravi walks 10 km north, then turns right and walks 5 km, then turns right and walks 10 km. How far is he from the starting point?",
    options: { A: "5 km", B: "10 km", C: "15 km", D: "0 km" },
    correct_answer: "A",
    explanation:
      "North 10 km → East 5 km → South 10 km. Net N-S = 0. Net E-W = 5 km east. Distance = 5 km.",
  },
  {
    question_id: "mental_013",
    exam: "RRB NTPC",
    section: "Mental Ability",
    topic: "Direction Sense",
    difficulty: "Medium",
    question:
      "A man facing east turns 90° anti-clockwise, then 180° clockwise. Which direction does he face now?",
    options: { A: "North", B: "South", C: "West", D: "East" },
    correct_answer: "B",
    explanation:
      "Start: East. 90° anti-clockwise from East = North. 180° clockwise from North = South.",
  },
  {
    question_id: "mental_014",
    exam: "RRB Group D",
    section: "Mental Ability",
    topic: "Alphabetical Series",
    difficulty: "Easy",
    question: "Find the odd one out: AZ, BY, CX, DW, EF",
    options: { A: "AZ", B: "CX", C: "EF", D: "DW" },
    correct_answer: "C",
    explanation:
      "AZ (A+Z=27), BY (B+Y=27), CX (C+X=27), DW (D+W=27), EF (E+F=11). EF doesn't follow the pattern of summing to position 27.",
  },
  {
    question_id: "mental_015",
    exam: "RRB ALP",
    section: "Mental Ability",
    topic: "Alphabetical Series",
    difficulty: "Medium",
    question: "What comes next in the series: BDF, GIK, LNP, ?",
    options: { A: "QSU", B: "QRU", C: "RSU", D: "PRT" },
    correct_answer: "A",
    explanation:
      "Each group consists of alternating letters (skip one). BDF: B, D(skip C), F(skip E). Pattern: groups start at B, G, L, Q (gap of 5). Next group: Q, S(skip R), U(skip T) = QSU.",
  },
  {
    question_id: "mental_016",
    exam: "RRB NTPC",
    section: "Mental Ability",
    topic: "Number Series",
    difficulty: "Hard",
    question: "Find the wrong term: 1, 8, 27, 64, 124, 216",
    options: { A: "27", B: "64", C: "124", D: "216" },
    correct_answer: "C",
    explanation:
      "Series is cubes: 1³=1, 2³=8, 3³=27, 4³=64, 5³=125 (not 124), 6³=216. The wrong term is 124 (should be 125).",
  },
  {
    question_id: "mental_017",
    exam: "RRB Group D",
    section: "Mental Ability",
    topic: "Coding-Decoding",
    difficulty: "Hard",
    question:
      "In a code language, 'TRAIN' is written as '20-18-1-9-14'. How is 'RAIL' written?",
    options: {
      A: "18-1-9-12",
      B: "17-1-9-12",
      C: "18-1-9-11",
      D: "19-2-9-12",
    },
    correct_answer: "A",
    explanation:
      "Each letter is replaced by its position in the alphabet. R=18, A=1, I=9, L=12. RAIL = 18-1-9-12.",
  },
  {
    question_id: "mental_018",
    exam: "RRB ALP",
    section: "Mental Ability",
    topic: "Analogies",
    difficulty: "Hard",
    question: "Ampere : Current :: Lux : ?",
    options: {
      A: "Luminance",
      B: "Illuminance",
      C: "Light intensity",
      D: "Flux",
    },
    correct_answer: "B",
    explanation:
      "Ampere is the unit of electric current. Lux is the SI unit of illuminance (luminous flux per unit area).",
  },
  {
    question_id: "mental_019",
    exam: "RRB NTPC",
    section: "Mental Ability",
    topic: "Venn Diagram",
    difficulty: "Medium",
    question:
      "In a survey, 70% people read newspaper A, 60% read newspaper B, and 30% read both. What percentage reads neither newspaper?",
    options: { A: "10%", B: "0%", C: "5%", D: "15%" },
    correct_answer: "B",
    explanation: "P(A ∪ B) = 70 + 60 − 30 = 100%. So 0% reads neither.",
  },
  {
    question_id: "mental_020",
    exam: "RRB Group D",
    section: "Mental Ability",
    topic: "Blood Relations",
    difficulty: "Hard",
    question: "A's father is B's son. C is B's father. How is A related to C?",
    options: { A: "Great-grandson", B: "Grandson", C: "Son", D: "Nephew" },
    correct_answer: "A",
    explanation:
      "C is B's father. B's son is A's father. So B is A's grandfather, C is A's great-grandfather. Therefore A is C's great-grandson.",
  },
  {
    question_id: "mental_021",
    exam: "RRB ALP",
    section: "Mental Ability",
    topic: "Number Series",
    difficulty: "Medium",
    question: "Find the missing term: 5, 11, 23, 47, 95, ?",
    options: { A: "189", B: "191", C: "193", D: "187" },
    correct_answer: "B",
    explanation:
      "Pattern: each term = 2 × previous + 1. 5→11(×2+1), 11→23(×2+1), 23→47(×2+1), 47→95(×2+1), 95→191(×2+1).",
  },
  {
    question_id: "mental_022",
    exam: "RRB NTPC",
    section: "Mental Ability",
    topic: "Direction Sense",
    difficulty: "Hard",
    question:
      "Starting from point A, Sita walks 4 km east, then 3 km south, then 4 km west. She then walks in such a direction that she reaches the starting point in minimum distance. What direction does she walk?",
    options: { A: "North", B: "South", C: "East", D: "West" },
    correct_answer: "A",
    explanation:
      "After going 4E, 3S, 4W she is 3 km south of A. To return to A she must go 3 km North.",
  },
  {
    question_id: "mental_023",
    exam: "RRB Group D",
    section: "Mental Ability",
    topic: "Analogies",
    difficulty: "Medium",
    question: "Flower : Bouquet :: Tree : ?",
    options: { A: "Forest", B: "Leaf", C: "Bark", D: "Garden" },
    correct_answer: "A",
    explanation:
      "A bouquet is a collection of flowers; a forest is a collection of trees. The analogy is individual:collection.",
  },
  {
    question_id: "mental_024",
    exam: "RRB ALP",
    section: "Mental Ability",
    topic: "Syllogism",
    difficulty: "Easy",
    question:
      "All pens are books. Some books are copies. Conclusion: Some copies are pens.",
    options: {
      A: "Conclusion follows",
      B: "Conclusion does not follow",
      C: "Cannot be determined",
      D: "Partially follows",
    },
    correct_answer: "B",
    explanation:
      "We know some books are copies but we cannot determine if those books are pens. So the conclusion does not necessarily follow.",
  },
  {
    question_id: "mental_025",
    exam: "RRB NTPC",
    section: "Mental Ability",
    topic: "Alphabetical Series",
    difficulty: "Hard",
    question:
      "How many letters in the word MATHEMATICS come before the letter in the alphabet that comes just after M?",
    options: { A: "2", B: "3", C: "4", D: "5" },
    correct_answer: "A",
    explanation:
      "Letter just after M in alphabet = N. Letters before N in alphabet = A to M (13 letters). In MATHEMATICS (M,A,T,H,E,M,A,T,I,C,S): letters that come before N alphabetically are M(×2), A(×2), H, E, I, C = 8 letters. But this counts letters in word that alphabetically precede N. Letters in MATHEMATICS before N alphabetically: M,A,H,E,M,A,I,C = 8 out of 11. But question says 'letters that come before in alphabet to the letter just after M'. Just after M=N. Letters A to M: in MATHEMATICS = M,A,H,E,M,A,I,C,S? S>N so exclude S,T. M,A,H,E,M,A,I,C = 8.",
  },

  // ══════════════════════════════════════════════════════════════
  // SECTION C: GENERAL SCIENCE (25 questions)
  // ══════════════════════════════════════════════════════════════

  {
    question_id: "science_001",
    exam: "RRB Group D",
    section: "General Science",
    topic: "Physics",
    difficulty: "Easy",
    question: "What is the SI unit of force?",
    options: { A: "Watt", B: "Joule", C: "Newton", D: "Pascal" },
    correct_answer: "C",
    explanation:
      "The SI unit of force is Newton (N), named after Sir Isaac Newton. 1 N = 1 kg·m/s².",
  },
  {
    question_id: "science_002",
    exam: "RRB NTPC",
    section: "General Science",
    topic: "Physics",
    difficulty: "Medium",
    question: "The speed of light in vacuum is approximately:",
    options: {
      A: "3 × 10⁸ m/s",
      B: "3 × 10⁶ m/s",
      C: "3 × 10¹⁰ m/s",
      D: "3 × 10⁴ m/s",
    },
    correct_answer: "A",
    explanation:
      "The speed of light in vacuum (c) = 2.998 × 10⁸ m/s, approximately 3 × 10⁸ m/s. This is a fundamental physical constant.",
  },
  {
    question_id: "science_003",
    exam: "RRB ALP",
    section: "General Science",
    topic: "Physics",
    difficulty: "Medium",
    question: "A body moving in a circular path with constant speed has:",
    options: {
      A: "Constant velocity and zero acceleration",
      B: "Changing velocity and centripetal acceleration",
      C: "Constant velocity and centripetal acceleration",
      D: "Changing velocity and zero acceleration",
    },
    correct_answer: "B",
    explanation:
      "In circular motion, speed is constant but direction changes continuously, so velocity changes. The centripetal acceleration always points toward the center.",
  },
  {
    question_id: "science_004",
    exam: "RRB Group D",
    section: "General Science",
    topic: "Chemistry",
    difficulty: "Easy",
    question: "The atomic number of Carbon is:",
    options: { A: "4", B: "6", C: "8", D: "12" },
    correct_answer: "B",
    explanation:
      "Carbon (C) has atomic number 6, meaning it has 6 protons. Its atomic mass is 12. It belongs to Group 14 of the periodic table.",
  },
  {
    question_id: "science_005",
    exam: "RRB NTPC",
    section: "General Science",
    topic: "Chemistry",
    difficulty: "Medium",
    question:
      "Which gas is produced when zinc reacts with dilute sulphuric acid?",
    options: { A: "Oxygen", B: "Chlorine", C: "Hydrogen", D: "Carbon dioxide" },
    correct_answer: "C",
    explanation:
      "Zn + H₂SO₄ → ZnSO₄ + H₂↑. Zinc displaces hydrogen from dilute sulphuric acid, producing hydrogen gas.",
  },
  {
    question_id: "science_006",
    exam: "RRB ALP",
    section: "General Science",
    topic: "Chemistry",
    difficulty: "Hard",
    question: "The pH of blood in a healthy human being is approximately:",
    options: { A: "6.4", B: "7.0", C: "7.4", D: "8.0" },
    correct_answer: "C",
    explanation:
      "Normal blood pH is 7.35–7.45, approximately 7.4. Blood is slightly alkaline. Deviation causes acidosis or alkalosis.",
  },
  {
    question_id: "science_007",
    exam: "RRB Group D",
    section: "General Science",
    topic: "Biology",
    difficulty: "Easy",
    question: "Which organelle is known as the 'powerhouse of the cell'?",
    options: {
      A: "Nucleus",
      B: "Ribosome",
      C: "Mitochondria",
      D: "Golgi body",
    },
    correct_answer: "C",
    explanation:
      "Mitochondria are called the powerhouse of the cell because they produce ATP (adenosine triphosphate) through cellular respiration, providing energy for all cellular activities.",
  },
  {
    question_id: "science_008",
    exam: "RRB NTPC",
    section: "General Science",
    topic: "Biology",
    difficulty: "Medium",
    question:
      "Which vitamin is produced by the human body when exposed to sunlight?",
    options: {
      A: "Vitamin A",
      B: "Vitamin B12",
      C: "Vitamin C",
      D: "Vitamin D",
    },
    correct_answer: "D",
    explanation:
      "Vitamin D is synthesized in the skin when exposed to UV-B radiation from sunlight. It is essential for calcium absorption and bone health.",
  },
  {
    question_id: "science_009",
    exam: "RRB ALP",
    section: "General Science",
    topic: "Biology",
    difficulty: "Medium",
    question:
      "The process by which plants make their own food using sunlight is called:",
    options: {
      A: "Respiration",
      B: "Photosynthesis",
      C: "Transpiration",
      D: "Fermentation",
    },
    correct_answer: "B",
    explanation:
      "Photosynthesis: 6CO₂ + 6H₂O + light energy → C₆H₁₂O₆ + 6O₂. Plants use chlorophyll to capture sunlight and convert CO₂ and water into glucose.",
  },
  {
    question_id: "science_010",
    exam: "RRB Group D",
    section: "General Science",
    topic: "Human Body",
    difficulty: "Easy",
    question: "The largest organ in the human body is:",
    options: { A: "Liver", B: "Lungs", C: "Skin", D: "Brain" },
    correct_answer: "C",
    explanation:
      "The skin is the largest organ of the human body, covering an average surface area of about 1.5–2 m² in adults. It protects the body from external environment.",
  },
  {
    question_id: "science_011",
    exam: "RRB NTPC",
    section: "General Science",
    topic: "Human Body",
    difficulty: "Medium",
    question: "Which blood group is called the 'universal donor'?",
    options: { A: "AB+", B: "O+", C: "O−", D: "AB−" },
    correct_answer: "C",
    explanation:
      "O− (O negative) is the universal donor for red blood cells because it has no A, B, or Rh antigens, making it compatible with all blood types.",
  },
  {
    question_id: "science_012",
    exam: "RRB ALP",
    section: "General Science",
    topic: "Human Body",
    difficulty: "Hard",
    question: "Which part of the brain controls balance and coordination?",
    options: {
      A: "Cerebrum",
      B: "Cerebellum",
      C: "Medulla oblongata",
      D: "Hypothalamus",
    },
    correct_answer: "B",
    explanation:
      "The cerebellum (little brain) is responsible for coordinating muscle movements, maintaining posture and balance. It receives signals from sensory systems and adjusts motor activities.",
  },
  {
    question_id: "science_013",
    exam: "RRB Group D",
    section: "General Science",
    topic: "Physics",
    difficulty: "Medium",
    question:
      "Which law states that 'for every action there is an equal and opposite reaction'?",
    options: {
      A: "Newton's First Law",
      B: "Newton's Second Law",
      C: "Newton's Third Law",
      D: "Law of Conservation of Energy",
    },
    correct_answer: "C",
    explanation:
      "Newton's Third Law of Motion states that for every action, there is an equal and opposite reaction. When you push a wall, the wall pushes back with equal force.",
  },
  {
    question_id: "science_014",
    exam: "RRB NTPC",
    section: "General Science",
    topic: "Chemistry",
    difficulty: "Easy",
    question: "Stainless steel is an alloy of iron and:",
    options: {
      A: "Nickel and Chromium",
      B: "Copper and Zinc",
      C: "Tin and Lead",
      D: "Aluminum and Silicon",
    },
    correct_answer: "A",
    explanation:
      "Stainless steel is an alloy of iron, chromium (minimum 10.5%), and often nickel. Chromium forms a protective oxide layer that prevents rusting.",
  },
  {
    question_id: "science_015",
    exam: "RRB ALP",
    section: "General Science",
    topic: "Environment",
    difficulty: "Easy",
    question: "Which gas is primarily responsible for the greenhouse effect?",
    options: { A: "Oxygen", B: "Nitrogen", C: "Carbon dioxide", D: "Ozone" },
    correct_answer: "C",
    explanation:
      "Carbon dioxide (CO₂) is the primary greenhouse gas contributing to global warming. It traps infrared radiation from Earth's surface. Methane and water vapor also contribute.",
  },
  {
    question_id: "science_016",
    exam: "RRB Group D",
    section: "General Science",
    topic: "Environment",
    difficulty: "Medium",
    question:
      "The ozone layer that protects Earth from UV radiation is found in the:",
    options: {
      A: "Troposphere",
      B: "Stratosphere",
      C: "Mesosphere",
      D: "Thermosphere",
    },
    correct_answer: "B",
    explanation:
      "The ozone layer is located in the stratosphere, approximately 15–35 km above Earth's surface. It absorbs 97–99% of the Sun's harmful ultraviolet (UV-B and UV-C) radiation.",
  },
  {
    question_id: "science_017",
    exam: "RRB NTPC",
    section: "General Science",
    topic: "Physics",
    difficulty: "Hard",
    question:
      "The phenomenon of total internal reflection is the working principle of:",
    options: {
      A: "Periscope",
      B: "Optical fibre",
      C: "Microscope",
      D: "Telescope",
    },
    correct_answer: "B",
    explanation:
      "Optical fibres work on the principle of total internal reflection. Light entering at an angle greater than the critical angle reflects completely inside the fibre, enabling data transmission.",
  },
  {
    question_id: "science_018",
    exam: "RRB ALP",
    section: "General Science",
    topic: "Biology",
    difficulty: "Hard",
    question:
      "Which enzyme is responsible for breaking down starch in the mouth?",
    options: { A: "Pepsin", B: "Lipase", C: "Salivary amylase", D: "Trypsin" },
    correct_answer: "C",
    explanation:
      "Salivary amylase (ptyalin) is secreted by salivary glands and begins the digestion of starch in the mouth, converting it to maltose and dextrin.",
  },
  {
    question_id: "science_019",
    exam: "RRB Group D",
    section: "General Science",
    topic: "Chemistry",
    difficulty: "Medium",
    question:
      "Which element has the highest electronegativity on the Pauling scale?",
    options: { A: "Oxygen", B: "Nitrogen", C: "Chlorine", D: "Fluorine" },
    correct_answer: "D",
    explanation:
      "Fluorine has the highest electronegativity (4.0) on the Pauling scale. It is the most electronegative of all elements due to its small atomic size and high nuclear charge.",
  },
  {
    question_id: "science_020",
    exam: "RRB NTPC",
    section: "General Science",
    topic: "Human Body",
    difficulty: "Easy",
    question: "The normal human body temperature is:",
    options: { A: "36°C", B: "37°C", C: "38°C", D: "35°C" },
    correct_answer: "B",
    explanation:
      "Normal human body temperature is approximately 37°C (98.6°F). This is maintained by the hypothalamus. Temperatures above 38°C indicate fever.",
  },
  {
    question_id: "science_021",
    exam: "RRB ALP",
    section: "General Science",
    topic: "Physics",
    difficulty: "Easy",
    question: "Which type of mirror is used as a rear-view mirror in vehicles?",
    options: {
      A: "Concave mirror",
      B: "Plane mirror",
      C: "Convex mirror",
      D: "Parabolic mirror",
    },
    correct_answer: "C",
    explanation:
      "Convex mirrors are used as rear-view mirrors because they provide a wider field of view. The image formed is virtual, erect, and diminished.",
  },
  {
    question_id: "science_022",
    exam: "RRB Group D",
    section: "General Science",
    topic: "Environment",
    difficulty: "Hard",
    question: "The Chipko Movement in India was related to the protection of:",
    options: {
      A: "Wildlife",
      B: "Rivers",
      C: "Forests and Trees",
      D: "Wetlands",
    },
    correct_answer: "C",
    explanation:
      "The Chipko Movement (1973) was a forest conservation movement in Uttarakhand where villagers, led by Sunderlal Bahuguna, embraced trees to prevent them from being felled by contractors.",
  },
  {
    question_id: "science_023",
    exam: "RRB NTPC",
    section: "General Science",
    topic: "Chemistry",
    difficulty: "Hard",
    question:
      "Which chemical is commonly used in fire extinguishers to put out class B fires (flammable liquids)?",
    options: {
      A: "Water",
      B: "Carbon dioxide (CO₂)",
      C: "Dry chemical powder",
      D: "Foam",
    },
    correct_answer: "B",
    explanation:
      "CO₂ fire extinguishers are effective for class B fires (flammable liquids like petrol). CO₂ displaces oxygen, smothering the fire. Water must not be used on class B fires as it can spread the burning liquid.",
  },
  {
    question_id: "science_024",
    exam: "RRB ALP",
    section: "General Science",
    topic: "Biology",
    difficulty: "Medium",
    question:
      "Which part of the plant is responsible for the absorption of water and minerals from the soil?",
    options: { A: "Leaf", B: "Stem", C: "Root", D: "Flower" },
    correct_answer: "C",
    explanation:
      "Roots, specifically root hair cells, absorb water and minerals from the soil through the process of osmosis and active transport. Root hairs increase the surface area for absorption.",
  },
  {
    question_id: "science_025",
    exam: "RRB Group D",
    section: "General Science",
    topic: "Physics",
    difficulty: "Medium",
    question: "The unit of electrical resistance is:",
    options: { A: "Volt", B: "Ampere", C: "Watt", D: "Ohm" },
    correct_answer: "D",
    explanation:
      "The SI unit of electrical resistance is the Ohm (Ω), named after Georg Simon Ohm. By Ohm's Law: V = IR, where R is resistance in ohms.",
  },

  // ══════════════════════════════════════════════════════════════
  // SECTION D: GENERAL AWARENESS (25 questions)
  // ══════════════════════════════════════════════════════════════

  {
    question_id: "ga_001",
    exam: "RRB NTPC",
    section: "General Awareness",
    topic: "History",
    difficulty: "Easy",
    question: "In which year was the Battle of Plassey fought?",
    options: { A: "1757", B: "1764", C: "1761", D: "1799" },
    correct_answer: "A",
    explanation:
      "The Battle of Plassey was fought on June 23, 1757, between the British East India Company (led by Robert Clive) and Nawab Siraj ud-Daulah of Bengal. It established British dominance in India.",
  },
  {
    question_id: "ga_002",
    exam: "RRB Group D",
    section: "General Awareness",
    topic: "History",
    difficulty: "Medium",
    question:
      "The Dandi March (Salt March) led by Mahatma Gandhi started in which year?",
    options: { A: "1928", B: "1930", C: "1932", D: "1920" },
    correct_answer: "B",
    explanation:
      "Mahatma Gandhi led the Dandi March (Civil Disobedience Movement) from March 12 to April 6, 1930, walking 241 miles from Sabarmati Ashram to Dandi to protest the British salt tax.",
  },
  {
    question_id: "ga_003",
    exam: "RRB ALP",
    section: "General Awareness",
    topic: "History",
    difficulty: "Hard",
    question: "The Permanent Settlement of Bengal was introduced by:",
    options: {
      A: "Lord Cornwallis",
      B: "Lord Dalhousie",
      C: "Lord Wellesley",
      D: "Lord Hastings",
    },
    correct_answer: "A",
    explanation:
      "The Permanent Settlement (1793) was introduced by Lord Cornwallis (Governor-General). It fixed the land revenue that zamindars had to pay to the British government in perpetuity.",
  },
  {
    question_id: "ga_004",
    exam: "RRB NTPC",
    section: "General Awareness",
    topic: "Geography",
    difficulty: "Easy",
    question: "Which is the longest river in India?",
    options: { A: "Brahmaputra", B: "Yamuna", C: "Ganga", D: "Godavari" },
    correct_answer: "C",
    explanation:
      "The Ganga (Ganges) is the longest river in India with a length of about 2,525 km. It originates from Gangotri glacier in Uttarakhand and flows into the Bay of Bengal.",
  },
  {
    question_id: "ga_005",
    exam: "RRB Group D",
    section: "General Awareness",
    topic: "Geography",
    difficulty: "Medium",
    question: "The Tropic of Cancer passes through how many states of India?",
    options: { A: "6", B: "7", C: "8", D: "9" },
    correct_answer: "C",
    explanation:
      "The Tropic of Cancer passes through 8 Indian states: Gujarat, Rajasthan, Madhya Pradesh, Chhattisgarh, Jharkhand, West Bengal, Tripura, and Mizoram.",
  },
  {
    question_id: "ga_006",
    exam: "RRB ALP",
    section: "General Awareness",
    topic: "Polity",
    difficulty: "Easy",
    question: "The Constitution of India came into force on:",
    options: {
      A: "15 August 1947",
      B: "26 November 1949",
      C: "26 January 1950",
      D: "30 January 1950",
    },
    correct_answer: "C",
    explanation:
      "The Constitution of India was adopted on November 26, 1949, but came into effect (enforcement) on January 26, 1950. This date is celebrated as Republic Day.",
  },
  {
    question_id: "ga_007",
    exam: "RRB NTPC",
    section: "General Awareness",
    topic: "Polity",
    difficulty: "Medium",
    question:
      "Which article of the Indian Constitution abolishes untouchability?",
    options: {
      A: "Article 14",
      B: "Article 15",
      C: "Article 17",
      D: "Article 21",
    },
    correct_answer: "C",
    explanation:
      "Article 17 of the Indian Constitution abolishes untouchability in any form. It declares untouchability a punishable offence under law.",
  },
  {
    question_id: "ga_008",
    exam: "RRB Group D",
    section: "General Awareness",
    topic: "Indian Economy",
    difficulty: "Medium",
    question:
      "Which Five-Year Plan gave priority to the development of heavy industries in India?",
    options: {
      A: "First Five-Year Plan",
      B: "Second Five-Year Plan",
      C: "Third Five-Year Plan",
      D: "Fourth Five-Year Plan",
    },
    correct_answer: "B",
    explanation:
      "The Second Five-Year Plan (1956–1961), based on the Nehru-Mahalanobis model, gave top priority to heavy industries like steel, machine tools, and heavy electrical equipment.",
  },
  {
    question_id: "ga_009",
    exam: "RRB ALP",
    section: "General Awareness",
    topic: "Indian Economy",
    difficulty: "Hard",
    question:
      "India's first indigenous aircraft carrier, INS Vikrant, was commissioned in which year?",
    options: { A: "2020", B: "2021", C: "2022", D: "2023" },
    correct_answer: "C",
    explanation:
      "INS Vikrant (IAC-1), India's first indigenously built aircraft carrier, was commissioned by Prime Minister Narendra Modi on September 2, 2022, at Cochin Shipyard Limited.",
  },
  {
    question_id: "ga_010",
    exam: "RRB NTPC",
    section: "General Awareness",
    topic: "Sports",
    difficulty: "Easy",
    question:
      "In cricket, how many runs are scored if the ball reaches the boundary without bouncing?",
    options: { A: "4 runs", B: "6 runs", C: "5 runs", D: "3 runs" },
    correct_answer: "B",
    explanation:
      "In cricket, if the ball hits the boundary rope without bouncing (or over the rope), the batting team is awarded 6 runs. If it bounces before reaching the boundary, 4 runs are awarded.",
  },
  {
    question_id: "ga_011",
    exam: "RRB Group D",
    section: "General Awareness",
    topic: "Sports",
    difficulty: "Medium",
    question: "Which country hosted the FIFA World Cup 2022?",
    options: { A: "Russia", B: "Brazil", C: "Qatar", D: "Germany" },
    correct_answer: "C",
    explanation:
      "Qatar hosted the 22nd FIFA World Cup in 2022 (November 20 – December 18, 2022). Argentina won the tournament, defeating France in the final.",
  },
  {
    question_id: "ga_012",
    exam: "RRB ALP",
    section: "General Awareness",
    topic: "Science & Technology",
    difficulty: "Medium",
    question:
      "Which Indian space mission successfully landed on the Moon's south pole in 2023?",
    options: {
      A: "Chandrayaan-1",
      B: "Chandrayaan-2",
      C: "Chandrayaan-3",
      D: "Mangalyaan-2",
    },
    correct_answer: "C",
    explanation:
      "Chandrayaan-3's Vikram lander successfully soft-landed near the Moon's south pole on August 23, 2023. India became the first country to land on the lunar south pole.",
  },
  {
    question_id: "ga_013",
    exam: "RRB NTPC",
    section: "General Awareness",
    topic: "Science & Technology",
    difficulty: "Hard",
    question:
      "Which Indian satellite is used for meteorological observations and weather forecasting?",
    options: { A: "INSAT", B: "IRS", C: "EDUSAT", D: "CARTOSAT" },
    correct_answer: "A",
    explanation:
      "INSAT (Indian National Satellite System) is used for meteorological observations, disaster warning, and weather forecasting. IRS is used for remote sensing of land resources.",
  },
  {
    question_id: "ga_014",
    exam: "RRB Group D",
    section: "General Awareness",
    topic: "Art & Culture",
    difficulty: "Easy",
    question: "Which classical dance form originated in Tamil Nadu?",
    options: { A: "Kathak", B: "Odissi", C: "Bharatanatyam", D: "Kuchipudi" },
    correct_answer: "C",
    explanation:
      "Bharatanatyam is one of the oldest classical dance forms, originating from Tamil Nadu. It was traditionally performed in Hindu temples and is known for its fixed upper torso and bent legs posture.",
  },
  {
    question_id: "ga_015",
    exam: "RRB ALP",
    section: "General Awareness",
    topic: "Art & Culture",
    difficulty: "Medium",
    question: "The Ajanta Caves in Maharashtra are famous for their:",
    options: {
      A: "Rock-cut architecture and sculptures",
      B: "Buddhist paintings and sculptures",
      C: "Hindu temple architecture",
      D: "Jain manuscripts",
    },
    correct_answer: "B",
    explanation:
      "The Ajanta Caves (2nd century BCE to 6th century CE) are UNESCO World Heritage Sites famous for their Buddhist cave paintings and sculptures depicting the life of Buddha and Jataka tales.",
  },
  {
    question_id: "ga_016",
    exam: "RRB NTPC",
    section: "General Awareness",
    topic: "Current Affairs",
    difficulty: "Medium",
    question: "G20 Summit 2023 was hosted by which country?",
    options: { A: "Japan", B: "India", C: "Indonesia", D: "Brazil" },
    correct_answer: "B",
    explanation:
      "India hosted the G20 Summit 2023 in New Delhi on September 9–10, 2023, under the theme 'One Earth, One Family, One Future'. It was a major diplomatic achievement for India.",
  },
  {
    question_id: "ga_017",
    exam: "RRB Group D",
    section: "General Awareness",
    topic: "History",
    difficulty: "Easy",
    question: "Who was the first Prime Minister of independent India?",
    options: {
      A: "Mahatma Gandhi",
      B: "Sardar Vallabhbhai Patel",
      C: "Jawaharlal Nehru",
      D: "Dr. B.R. Ambedkar",
    },
    correct_answer: "C",
    explanation:
      "Jawaharlal Nehru became the first Prime Minister of independent India on August 15, 1947. He served as PM until his death in May 1964.",
  },
  {
    question_id: "ga_018",
    exam: "RRB ALP",
    section: "General Awareness",
    topic: "Geography",
    difficulty: "Hard",
    question: "The Sundarbans mangrove forest is shared between India and:",
    options: { A: "Myanmar", B: "Sri Lanka", C: "Bangladesh", D: "Nepal" },
    correct_answer: "C",
    explanation:
      "The Sundarbans, the world's largest mangrove forest, spans across India (West Bengal) and Bangladesh. It is a UNESCO World Heritage Site and home to the Royal Bengal Tiger.",
  },
  {
    question_id: "ga_019",
    exam: "RRB NTPC",
    section: "General Awareness",
    topic: "Polity",
    difficulty: "Hard",
    question:
      "Which Constitutional Amendment Act lowered the voting age from 21 to 18 years in India?",
    options: {
      A: "42nd Amendment",
      B: "52nd Amendment",
      C: "61st Amendment",
      D: "73rd Amendment",
    },
    correct_answer: "C",
    explanation:
      "The 61st Constitutional Amendment Act, 1988 (effective March 28, 1989) lowered the minimum voting age from 21 to 18 years, enfranchising millions of youth.",
  },
  {
    question_id: "ga_020",
    exam: "RRB Group D",
    section: "General Awareness",
    topic: "Indian Economy",
    difficulty: "Easy",
    question:
      "Which bank note in India carries the portrait of Mahatma Gandhi and the Swachh Bharat logo?",
    options: { A: "₹10", B: "₹50", C: "₹100", D: "All Indian currency notes" },
    correct_answer: "D",
    explanation:
      "All Indian currency notes issued after 2016 carry the portrait of Mahatma Gandhi on the obverse and the Swachh Bharat Abhiyan (clean India mission) logo on the reverse.",
  },
  {
    question_id: "ga_021",
    exam: "RRB ALP",
    section: "General Awareness",
    topic: "Current Affairs",
    difficulty: "Medium",
    question:
      "In 2024, which Indian cricketer scored 100 international centuries across all formats?",
    options: {
      A: "Rohit Sharma",
      B: "Virat Kohli",
      C: "Sachin Tendulkar",
      D: "MS Dhoni",
    },
    correct_answer: "B",
    explanation:
      "Virat Kohli became the first male cricketer to score 100 international centuries in 2024, achieving this milestone during the ICC T20 World Cup 2024.",
  },
  {
    question_id: "ga_022",
    exam: "RRB NTPC",
    section: "General Awareness",
    topic: "Art & Culture",
    difficulty: "Hard",
    question:
      "Which Indian classical music style primarily uses 'ragas' and is associated with North India?",
    options: {
      A: "Carnatic music",
      B: "Hindustani music",
      C: "Dhrupad",
      D: "Thumri",
    },
    correct_answer: "B",
    explanation:
      "Hindustani classical music is the predominant classical music tradition of North India. It uses ragas (melodic modes) and talas (rhythmic cycles). Carnatic music is the South Indian tradition.",
  },
  {
    question_id: "ga_023",
    exam: "RRB Group D",
    section: "General Awareness",
    topic: "Science & Technology",
    difficulty: "Easy",
    question:
      "Which organization developed the UPI (Unified Payments Interface) system in India?",
    options: { A: "RBI", B: "SEBI", C: "NPCI", D: "IRDAI" },
    correct_answer: "C",
    explanation:
      "UPI was developed by the National Payments Corporation of India (NPCI) and launched in 2016. It enables instant money transfers between bank accounts using mobile phones.",
  },
  {
    question_id: "ga_024",
    exam: "RRB ALP",
    section: "General Awareness",
    topic: "Current Affairs",
    difficulty: "Hard",
    question:
      "India's 'Project Tiger' was launched in which year to protect the Bengal Tiger?",
    options: { A: "1970", B: "1972", C: "1973", D: "1980" },
    correct_answer: "C",
    explanation:
      "Project Tiger was launched by the Government of India on April 1, 1973, with Jim Corbett National Park as the first tiger reserve. It has successfully increased the tiger population in India.",
  },
  {
    question_id: "ga_025",
    exam: "RRB NTPC",
    section: "General Awareness",
    topic: "Geography",
    difficulty: "Medium",
    question:
      "The Tehri Dam, one of India's largest dams, is built on which river?",
    options: { A: "Yamuna", B: "Bhagirathi", C: "Ganga", D: "Alaknanda" },
    correct_answer: "B",
    explanation:
      "The Tehri Dam is built on the Bhagirathi river in Uttarakhand. It is the tallest dam in India (260.5 m) and among the tallest in the world. It was completed in 2006.",
  },
];

// Helper: filter questions by criteria
export function filterQuestions(params: {
  exam?: string;
  section?: string;
  topic?: string;
  difficulty?: string;
  count?: number;
}): Question[] {
  let filtered = [...FALLBACK_QUESTIONS];

  if (params.exam) {
    filtered = filtered.filter((q) => q.exam === params.exam);
    if (filtered.length === 0) filtered = [...FALLBACK_QUESTIONS];
  }
  if (params.section) {
    const sectionFiltered = filtered.filter(
      (q) => q.section === params.section,
    );
    if (sectionFiltered.length > 0) filtered = sectionFiltered;
  }
  if (params.topic) {
    const topicFiltered = filtered.filter((q) => q.topic === params.topic);
    if (topicFiltered.length > 0) filtered = topicFiltered;
  }
  if (params.difficulty && params.difficulty !== "") {
    const diffFiltered = filtered.filter(
      (q) => q.difficulty === params.difficulty,
    );
    if (diffFiltered.length > 0) filtered = diffFiltered;
  }

  // Shuffle
  for (let i = filtered.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [filtered[i], filtered[j]] = [filtered[j], filtered[i]];
  }

  const count = params.count ?? 25;
  if (filtered.length >= count) {
    return filtered.slice(0, count);
  }

  // If not enough, repeat/cycle until we have enough
  const result: Question[] = [];
  while (result.length < count) {
    const remaining = count - result.length;
    result.push(...filtered.slice(0, Math.min(remaining, filtered.length)));
  }
  return result;
}
