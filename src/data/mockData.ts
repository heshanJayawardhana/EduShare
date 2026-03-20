export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: "student" | "admin";
  studentId?: string;
  faculty?: string;
  year?: number;
  semester?: number;
  avatar?: string;
}

export interface Resource {
  id: string;
  title: string;
  description: string;
  faculty: string;
  year: number;
  semester: number;
  price: number;
  type: "notes" | "past-paper" | "tutorial";
  uploadedBy: string;
  status: "pending" | "verified" | "rejected";
  rating: number;
  ratingCount: number;
  downloads: number;
  createdAt: string;
  reviews: Review[];
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Transaction {
  id: string;
  date: string;
  resourceName: string;
  resourceId: string;
  amount: number;
  status: "pending" | "verified" | "paid";
  buyerId: string;
  sellerId: string;
}

export interface Notification {
  id: string;
  message: string;
  type: "purchase" | "payment" | "verification" | "info";
  read: boolean;
  date: string;
}

export interface CartItem {
  resourceId: string;
  quantity: number;
}

export const users: User[] = [
  {
    id: "u1",
    name: "Kavindu Perera",
    email: "student@test.com",
    password: "123456",
    role: "student",
    studentId: "STU-2024-0847",
    faculty: "Computing",
    year: 3,
    semester: 1,
  },
  {
    id: "u2",
    name: "Dr. Lakshan Silva",
    email: "admin@test.com",
    password: "123456",
    role: "admin",
  },
  {
    id: "u3",
    name: "Nimasha Fernando",
    email: "nimasha@test.com",
    password: "123456",
    role: "student",
    studentId: "STU-2024-1203",
    faculty: "Engineering",
    year: 2,
    semester: 2,
  },
  {
    id: "u4",
    name: "Tharindu Jayasinghe",
    email: "tharindu@test.com",
    password: "123456",
    role: "student",
    studentId: "STU-2023-0562",
    faculty: "Business",
    year: 4,
    semester: 1,
  },
];

export const resources: Resource[] = [
  {
    id: "r1",
    title: "Data Structures & Algorithms – Complete Notes",
    description: "Comprehensive lecture notes covering arrays, trees, graphs, sorting algorithms, and complexity analysis.",
    faculty: "Computing",
    year: 2,
    semester: 1,
    price: 750,
    type: "notes",
    uploadedBy: "u1",
    status: "verified",
    rating: 4.6,
    ratingCount: 23,
    downloads: 187,
    createdAt: "2024-08-15",
    reviews: [
      { id: "rv1", userId: "u3", userName: "Nimasha Fernando", rating: 5, comment: "Incredibly detailed and well-structured. Saved me during finals.", date: "2024-09-01" },
      { id: "rv2", userId: "u4", userName: "Tharindu Jayasinghe", rating: 4, comment: "Good coverage of graph algorithms. Could use more examples for DP.", date: "2024-09-10" },
    ],
  },
  {
    id: "r2",
    title: "Database Systems Past Papers 2019–2024",
    description: "Collection of 10 past papers with model answers for Database Systems module.",
    faculty: "Computing",
    year: 3,
    semester: 1,
    price: 500,
    type: "past-paper",
    uploadedBy: "u1",
    status: "verified",
    rating: 4.8,
    ratingCount: 41,
    downloads: 312,
    createdAt: "2024-07-20",
    reviews: [
      { id: "rv3", userId: "u3", userName: "Nimasha Fernando", rating: 5, comment: "The model answers are gold. Exactly what the examiners expect.", date: "2024-08-05" },
    ],
  },
  {
    id: "r3",
    title: "Calculus II – Video Tutorial Series",
    description: "12-part video tutorial covering integration techniques, series convergence, and multivariable calculus.",
    faculty: "Engineering",
    year: 1,
    semester: 2,
    price: 0,
    type: "tutorial",
    uploadedBy: "u3",
    status: "verified",
    rating: 4.3,
    ratingCount: 15,
    downloads: 94,
    createdAt: "2024-06-10",
    reviews: [],
  },
  {
    id: "r4",
    title: "Financial Accounting Fundamentals",
    description: "Detailed notes on double-entry bookkeeping, financial statements, and ratio analysis.",
    faculty: "Business",
    year: 1,
    semester: 1,
    price: 400,
    type: "notes",
    uploadedBy: "u4",
    status: "pending",
    rating: 0,
    ratingCount: 0,
    downloads: 0,
    createdAt: "2024-10-01",
    reviews: [],
  },
  {
    id: "r5",
    title: "Operating Systems – Mid Semester Notes",
    description: "Concise notes on process management, memory allocation, and file systems.",
    faculty: "Computing",
    year: 3,
    semester: 1,
    price: 350,
    type: "notes",
    uploadedBy: "u3",
    status: "verified",
    rating: 4.1,
    ratingCount: 8,
    downloads: 56,
    createdAt: "2024-09-15",
    reviews: [],
  },
  {
    id: "r6",
    title: "Thermodynamics Past Papers Collection",
    description: "Past papers from 2020 to 2024 with step-by-step solutions.",
    faculty: "Engineering",
    year: 2,
    semester: 1,
    price: 600,
    type: "past-paper",
    uploadedBy: "u3",
    status: "verified",
    rating: 4.5,
    ratingCount: 19,
    downloads: 142,
    createdAt: "2024-05-22",
    reviews: [],
  },
  {
    id: "r7",
    title: "Marketing Management Complete Guide",
    description: "Full semester coverage including case studies and frameworks.",
    faculty: "Business",
    year: 2,
    semester: 2,
    price: 550,
    type: "notes",
    uploadedBy: "u4",
    status: "rejected",
    rating: 0,
    ratingCount: 0,
    downloads: 0,
    createdAt: "2024-10-05",
    reviews: [],
  },
  {
    id: "r8",
    title: "Python for Data Science – Crash Course",
    description: "Beginner-friendly tutorial covering NumPy, Pandas, and Matplotlib.",
    faculty: "Computing",
    year: 1,
    semester: 2,
    price: 0,
    type: "tutorial",
    uploadedBy: "u1",
    status: "verified",
    rating: 4.7,
    ratingCount: 34,
    downloads: 267,
    createdAt: "2024-04-12",
    reviews: [],
  },
];

export const transactions: Transaction[] = [
  { id: "t1", date: "2024-10-15", resourceName: "Data Structures & Algorithms – Complete Notes", resourceId: "r1", amount: 750, status: "paid", buyerId: "u3", sellerId: "u1" },
  { id: "t2", date: "2024-10-14", resourceName: "Database Systems Past Papers 2019–2024", resourceId: "r2", amount: 500, status: "paid", buyerId: "u4", sellerId: "u1" },
  { id: "t3", date: "2024-10-12", resourceName: "Data Structures & Algorithms – Complete Notes", resourceId: "r1", amount: 750, status: "verified", buyerId: "u4", sellerId: "u1" },
  { id: "t4", date: "2024-10-10", resourceName: "Database Systems Past Papers 2019–2024", resourceId: "r2", amount: 500, status: "paid", buyerId: "u3", sellerId: "u1" },
  { id: "t5", date: "2024-10-08", resourceName: "Thermodynamics Past Papers Collection", resourceId: "r6", amount: 600, status: "paid", buyerId: "u1", sellerId: "u3" },
  { id: "t6", date: "2024-10-05", resourceName: "Operating Systems – Mid Semester Notes", resourceId: "r5", amount: 350, status: "pending", buyerId: "u4", sellerId: "u3" },
  { id: "t7", date: "2024-09-28", resourceName: "Data Structures & Algorithms – Complete Notes", resourceId: "r1", amount: 750, status: "paid", buyerId: "u3", sellerId: "u1" },
  { id: "t8", date: "2024-09-20", resourceName: "Database Systems Past Papers 2019–2024", resourceId: "r2", amount: 500, status: "paid", buyerId: "u4", sellerId: "u1" },
];

export const notifications: Notification[] = [
  { id: "n1", message: "Your resource 'Data Structures & Algorithms' was purchased. Rs. 750 added to your account.", type: "purchase", read: false, date: "2024-10-15" },
  { id: "n2", message: "Payment of Rs. 600 completed for 'Thermodynamics Past Papers Collection'.", type: "payment", read: false, date: "2024-10-08" },
  { id: "n3", message: "Your resource 'Database Systems Past Papers' has been verified by admin.", type: "verification", read: true, date: "2024-10-06" },
  { id: "n4", message: "Your resource 'Database Systems Past Papers' was purchased. Rs. 500 added to your account.", type: "purchase", read: true, date: "2024-10-05" },
];

export const monthlyEarnings = [
  { month: "May", earnings: 1200 },
  { month: "Jun", earnings: 800 },
  { month: "Jul", earnings: 2100 },
  { month: "Aug", earnings: 1750 },
  { month: "Sep", earnings: 2500 },
  { month: "Oct", earnings: 3250 },
];

export const downloadStats = [
  { resource: "DSA Notes", downloads: 187 },
  { resource: "DB Past Papers", downloads: 312 },
  { resource: "Python Tutorial", downloads: 267 },
  { resource: "OS Notes", downloads: 56 },
];

export const modules = [
  { id: "m1", name: "Data Structures & Algorithms", code: "CS2012", credits: 4 },
  { id: "m2", name: "Database Systems", code: "CS3021", credits: 3 },
  { id: "m3", name: "Operating Systems", code: "CS3015", credits: 4 },
  { id: "m4", name: "Software Engineering", code: "CS3030", credits: 3 },
  { id: "m5", name: "Computer Networks", code: "CS3018", credits: 3 },
];
