// ============================================================================
// SCHOLARIO-OS — Landing Page Engine Data
// Configurable school website data + CMS content
// ============================================================================

export interface SchoolWebsiteConfig {
  schoolId: string
  schoolName: string
  shortName: string
  motto: string
  logo: string
  template: "modern" | "traditional"
  theme: {
    primaryColor: string
    secondaryColor: string
    accentColor: string
    fontFamily: string
    borderRadius: string
    darkMode: boolean
  }
  contact: {
    address: string
    phone: string
    email: string
    website: string
    mapEmbed: string
  }
  social: {
    facebook: string
    instagram: string
    youtube: string
    twitter: string
    linkedin: string
  }
  admission: {
    open: boolean
    session: string
    deadline: string
    classes: string[]
    process: string[]
    feeStructure: { class: string; amount: number }[]
  }
  academic: {
    board: string
    established: string
    affiliation: string
    medium: string
    timings: string
  }
  stats: { label: string; value: string }[]
  principal: {
    name: string
    message: string
    photo: string
    qualification: string
  }
  facilities: { name: string; icon: string; desc: string }[]
  achievements: { title: string; desc: string; year: string; icon: string }[]
  gallery: { title: string; category: string }[]
  faculty: { name: string; role: string; subject: string; qualification: string }[]
  testimonials: { name: string; role: string; text: string; rating: number }[]
  events: { title: string; date: string; desc: string; type: string }[]
  news: { title: string; date: string; excerpt: string; category: string }[]
  seo: {
    metaTitle: string
    metaDescription: string
    keywords: string[]
    ogImage: string
    favicon: string
  }
}

export const SCHOOL_WEBSITE: SchoolWebsiteConfig = {
  schoolId: "s1",
  schoolName: "Sri Vidya Mandir Senior Secondary School",
  shortName: "SVM",
  motto: "Vidya Dadati Vinayam — Knowledge Bestows Humility",
  logo: "S",
  template: "modern",
  theme: {
    primaryColor: "#10b981",
    secondaryColor: "#0d9488",
    accentColor: "#f59e0b",
    fontFamily: "Inter",
    borderRadius: "0.75rem",
    darkMode: false,
  },
  contact: {
    address: "42, Education City Road, Sector 18, Pune, Maharashtra 411014",
    phone: "+91 20 2456 7890",
    email: "office@srividya-mandir.edu.in",
    website: "www.srividya-mandir.edu.in",
    mapEmbed: "Pune, Maharashtra, India",
  },
  social: {
    facebook: "facebook.com/srividya-mandir",
    instagram: "instagram.com/srividya-mandir",
    youtube: "youtube.com/@srividya-mandir",
    twitter: "",
    linkedin: "",
  },
  admission: {
    open: true,
    session: "2026-2027",
    deadline: "31st March 2026",
    classes: ["Nursery", "LKG", "UKG", "Grade 1-10", "Grade 11-12 (Sci & Comm)"],
    process: [
      "Fill the online application form",
      "Submit required documents (birth certificate, previous school records, photos)",
      "Attend interaction/assessment session",
      "Receive admission confirmation within 7 days",
      "Complete fee payment and enrollment",
    ],
    feeStructure: [
      { class: "Nursery - UKG", amount: 32000 },
      { class: "Grade 1-5", amount: 42000 },
      { class: "Grade 6-8", amount: 48000 },
      { class: "Grade 9-10", amount: 58000 },
      { class: "Grade 11-12", amount: 68000 },
    ],
  },
  academic: {
    board: "CBSE",
    established: "1994",
    affiliation: "Affiliation No. 1130456",
    medium: "English",
    timings: "8:00 AM – 3:15 PM",
  },
  stats: [
    { label: "Students", value: "1,004" },
    { label: "Teachers", value: "68" },
    { label: "Years of Excellence", value: "31" },
    { label: "Board Results", value: "100%" },
  ],
  principal: {
    name: "Dr. Anjali Deshpande",
    message: "At Sri Vidya Mandir, we believe every child is unique and capable of extraordinary things. For over three decades, we have nurtured young minds with a perfect blend of traditional values and modern education. Our mission is not just to educate, but to inspire — to create lifelong learners who will shape the future of our nation. We invite you to join our family and experience the difference that genuine care and excellence in education can make.",
    photo: "AD",
    qualification: "Ph.D. in Education, M.A., M.Ed.",
  },
  facilities: [
    { name: "Smart Classrooms", icon: "📚", desc: "60+ tech-enabled classrooms with interactive panels" },
    { name: "Science Labs", icon: "🔬", desc: "Well-equipped Physics, Chemistry & Biology labs" },
    { name: "Computer Lab", icon: "💻", desc: "100+ computers with high-speed internet & latest software" },
    { name: "Library", icon: "📖", desc: "15,000+ books, digital library & reading rooms" },
    { name: "Sports Complex", icon: "⚽", desc: "Cricket, football, basketball, athletics & indoor games" },
    { name: "Music & Arts", icon: "🎵", desc: "Dedicated rooms for music, dance, art & craft" },
    { name: "Transport", icon: "🚌", desc: "Safe GPS-enabled bus fleet covering 25+ routes" },
    { name: "Medical Room", icon: "🏥", desc: "Full-time nurse & medical room with first-aid" },
  ],
  achievements: [
    { title: "100% Board Results", desc: "Consistent 100% pass rate in CBSE Class 10 & 12", year: "2025", icon: "🏆" },
    { title: "State Topper", desc: "Diya Patel — State Rank 3 in CBSE Class 10", year: "2025", icon: "🥇" },
    { title: "National Science Olympiad", desc: "12 students qualified for national level", year: "2024", icon: "🔬" },
    { title: "Inter-School Sports Champion", desc: "Winners in cricket & athletics", year: "2024", icon: "🏏" },
    { title: "Best School Award", desc: "Recognized by CBSE for innovation in education", year: "2023", icon: "🌟" },
    { title: "Cultural Excellence", desc: "Winners at state-level music & dance competition", year: "2023", icon: "🎭" },
  ],
  gallery: [
    { title: "Annual Day 2025", category: "Events" },
    { title: "Science Exhibition", category: "Academics" },
    { title: "Sports Day", category: "Sports" },
    { title: "Independence Day", category: "Events" },
    { title: "Art & Craft Fair", category: "Cultural" },
    { title: "Graduation Ceremony", category: "Events" },
    { title: "Robotics Workshop", category: "Academics" },
    { title: "Field Trip", category: "Activities" },
    { title: "Library Reading Week", category: "Academics" },
    { title: "Teacher's Day", category: "Events" },
    { title: "Diwali Celebration", category: "Cultural" },
    { title: "Investiture Ceremony", category: "Events" },
  ],
  faculty: [
    { name: "Dr. Anjali Deshpande", role: "Principal", subject: "Physics", qualification: "Ph.D., M.Ed." },
    { name: "Rajesh Kulkarni", role: "Senior PGT", subject: "Mathematics", qualification: "M.Sc., B.Ed." },
    { name: "Meera Nair", role: "PGT", subject: "English", qualification: "M.A., B.Ed." },
    { name: "Lakshmi Iyer", role: "PGT", subject: "Chemistry", qualification: "M.Sc., B.Ed." },
    { name: "Suresh Patil", role: "TGT", subject: "Science", qualification: "M.Sc., B.Ed." },
    { name: "Priya Sharma", role: "TGT", subject: "Social Science", qualification: "M.A., B.Ed." },
    { name: "Amit Verma", role: "TGT", subject: "Computer Science", qualification: "MCA, B.Ed." },
    { name: "Arjun Reddy", role: "PGT", subject: "Commerce", qualification: "M.Com., B.Ed." },
  ],
  testimonials: [
    { name: "Suresh Sharma", role: "Parent of Aarav (Grade 10)", text: "SVM has transformed my son's learning journey. The teachers are incredibly dedicated and the platform keeps us connected every day. Best decision we made!", rating: 5 },
    { name: "Priya Iyer", role: "Parent of Diya (Grade 10)", text: "The attention to each child's growth is remarkable. Diya went from being shy to a confident state topper. Thank you SVM!", rating: 5 },
    { name: "Rahul Mehta", role: "Parent of Vivaan (Grade 9)", text: "The balance of academics, sports and values is perfect. The communication from teachers is prompt and helpful.", rating: 5 },
    { name: "Anita Desai", role: "Alumni Parent", text: "Both my children graduated from SVM and are doing extremely well. The foundation they got here is invaluable.", rating: 5 },
  ],
  events: [
    { title: "Annual Sports Day", date: "2025-12-18", desc: "31st Annual Sports Day — field events, track & cultural performances", type: "Sports" },
    { title: "Winter Break", date: "2025-12-24", desc: "School closed for winter break. Classes resume 2nd January.", type: "Holiday" },
    { title: "Pre-Board Examinations", date: "2026-01-12", desc: "Pre-board exams for Grade 10 & 12 begin", type: "Exam" },
    { title: "Republic Day", date: "2026-01-26", desc: "Flag hoisting & cultural program", type: "Event" },
    { title: "Annual Day", date: "2026-02-15", desc: "Grand annual celebration with performances & awards", type: "Event" },
  ],
  news: [
    { title: "Diya Patel Tops CBSE Class 10 — State Rank 3", date: "2025-05-15", excerpt: "Our student Diya Patel achieved State Rank 3 in CBSE Class 10 examinations with 98.4% marks.", category: "Achievement" },
    { title: "New STEM Lab Inaugurated", date: "2025-07-20", excerpt: "State-of-the-art STEM lab with robotics, 3D printing and AI learning tools now open for students.", category: "Infrastructure" },
    { title: "Inter-School Quiz Championship Winners", date: "2025-09-10", excerpt: "Our team won the Pune Inter-School General Knowledge Quiz Championship 2025.", category: "Achievement" },
    { title: "Admissions Open for 2026-27", date: "2025-11-01", excerpt: "Applications now being accepted for all classes. Limited seats available.", category: "Admissions" },
    { title: "Annual Science Exhibition", date: "2025-12-11", excerpt: "Students showcase innovative projects on renewable energy & sustainability.", category: "Events" },
  ],
  seo: {
    metaTitle: "Sri Vidya Mandir School — Best CBSE School in Pune | Admissions Open 2026-27",
    metaDescription: "Sri Vidya Mandir Senior Secondary School, Pune — 31 years of excellence in CBSE education. Smart classrooms, experienced faculty, 100% board results. Admissions open for 2026-27.",
    keywords: ["CBSE school Pune", "best school in Pune", "Sri Vidya Mandir", "school admission Pune", "CBSE admissions 2026"],
    ogImage: "",
    favicon: "",
  },
}

// Traditional template variant data (same structure, different content style)
export const SCHOOL_WEBSITE_TRADITIONAL: SchoolWebsiteConfig = {
  ...SCHOOL_WEBSITE,
  template: "traditional",
  schoolName: "Bharat Vidya Bhavan",
  shortName: "BVB",
  motto: "Satyam Shivam Sundaram — Truth, Goodness, Beauty",
  principal: {
    ...SCHOOL_WEBSITE.principal,
    name: "Dr. Ramesh Acharya",
    message: "Bharat Vidya Bhavan stands as a beacon of holistic education, blending the timeless wisdom of Indian culture with contemporary learning methodologies. For decades, we have been committed to nurturing not just academicians, but responsible citizens of tomorrow. Our students carry forward the values of integrity, excellence and service.",
    photo: "RA",
    qualification: "Ph.D. in Educational Leadership",
  },
}
