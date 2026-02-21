export type QuestionType = "text" | "email" | "textarea" | "radio" | "checkbox";

export type QuestionCondition = {
  field: string;
  value?: string;
  values?: string[];
};

export type Question = {
  id: string;
  text: string;
  type: QuestionType;
  options: string[] | null;
  required: boolean;
  limit?: number;
  condition?: QuestionCondition;
  helperText?: string;
};

export type Section = {
  id: string;
  title: string;
  required?: boolean;
  conditional?: string;
};

export type SurveyAnswers = Record<string, string | string[] | undefined>;

const Q = (
  id: string,
  text: string,
  type: QuestionType,
  options: string[] | null,
  o: Partial<Question> = {}
): Question => ({
  id,
  text,
  type,
  options,
  required: o.required ?? false,
  limit: o.limit,
  condition: o.condition,
  helperText: o.helperText,
});

export const SECTIONS: Section[] = [
  { id: "A", title: "Basic Information", required: true },
  { id: "B", title: "Member Profile & Identity" },
  { id: "C", title: "How You Want to Engage" },
  { id: "D", title: "Priority Areas" },
  { id: "E", title: "Ideas, Concepts & Partnerships" },
  { id: "F", title: "Financing & Venture Experience" },
  { id: "G", title: "Business Growth & Capital" },
  { id: "H", title: "What You Want From SLINT" },
  { id: "I", title: "Student Questions", conditional: "Student" },
  { id: "J", title: "Government & Policy", conditional: "Government / Public Sector Official" },
  { id: "K", title: "Professional Standards" },
  { id: "L", title: "Corporate & Employer", conditional: "Corporate Employer / HR Decision Maker" },
  { id: "M", title: "Engagement & Participation" },
  { id: "N", title: "Time Commitment" },
  { id: "O", title: "Expo, Awards & Innovation" },
  { id: "P", title: "Willingness to Contribute" },
  { id: "Q", title: "National Constraints" },
  { id: "R", title: "Strategic Input" },
];

export const QUESTIONS: Record<string, Question[]> = {
  A: [
    Q("A1", "Full Name", "text", null, { required: true }),
    Q("A2", "Email Address", "email", null, { required: true }),
    Q("A3", "Phone Number", "text", null),
    Q("A4", "Location (City & Country)", "text", null),
    Q("A5", "Are you currently a registered SLINT member?", "radio", ["Yes", "No (I plan to register)"]),
    Q("A6", "Years of experience in tech-related fields", "radio", [
      "Under 2 years",
      "2-5 years",
      "5-10 years",
      "10+ years",
    ]),
  ],
  B: [
    Q(
      "B1",
      "Which best describes you currently?",
      "checkbox",
      [
        "Student",
        "Business Owner / Entrepreneur",
        "Startup Founder (Pre-revenue or Early Stage)",
        "Industry Professional (Private Sector)",
        "Government / Public Sector Official",
        "Academic / Researcher",
        "Investor / Venture Capital / Angel Investor",
        "Development / NGO Professional",
        "Diaspora Professional",
        "Corporate Employer / HR Decision Maker",
        "Not currently active in tech but interested",
      ],
      { helperText: "Select all that apply" }
    ),
  ],
  C: [
    Q("C1", "How would you like to participate in SLINT during this term?", "checkbox", [
      "Committee member",
      "Committee lead or co-lead",
      "Mentor / Advisor",
      "Speaker / Trainer",
      "Startup / Entrepreneur support",
      "Policy / Government engagement",
      "Academia / Research collaboration",
      "Private sector / Industry partnerships",
      "Student / Youth engagement",
      "Member business promotion",
      "General volunteer",
      "Not sure yet - open to discussion",
    ]),
  ],
  D: [
    Q(
      "D1",
      "Which areas should SLINT prioritize?",
      "checkbox",
      [
        "AI & Emerging Technologies",
        "Cybersecurity",
        "Software & Digital Services",
        "Tech Education & Academia",
        "Tech Entrepreneurship & Startups",
        "Innovation & R&D",
        "ICT Policy & Government Collaboration",
        "Trade, Export & Market Access",
        "Diaspora-Home Collaboration",
        "Mentorship & Leadership Development",
      ],
      { limit: 3 }
    ),
  ],
  E: [
    Q("E1", "Briefly describe what you would like to work on or help expand.", "textarea", null, {
      helperText: "This can be an idea, a program, a partnership, or a problem you want SLINT to help address.",
    }),
    Q(
      "E2",
      "Are there Sierra Leonean or global organizations SLINT should affiliate or collaborate with?",
      "textarea",
      null
    ),
    Q("E3", "Would you like to submit a more detailed concept or proposal?", "radio", [
      "Yes (please follow up with me)",
      "Not at this time",
    ]),
  ],
  F: [
    Q("F1", "Do you have experience in financing, venture capital, or investment?", "checkbox", [
      "Angel investing",
      "Venture capital",
      "Private equity",
      "Startup fundraising",
      "Business financing (loans, credit, grants)",
      "Educational financing / scholarships / student funding",
      "Diaspora investment structures",
      "Trade finance",
      "Government or multilateral funding programs",
      "I do not have financing experience",
      "Interested in learning about venture financing",
    ]),
  ],
  G: [
    Q("G1", "Are you currently operating a business?", "radio", ["Yes", "No", "Planning to start"]),
    Q("G2", "How long have you been in business?", "radio", [
      "Pre-revenue / Idea stage",
      "0-1 year (Startup stage)",
      "1-3 years (Early growth)",
      "3-7 years (Scaling stage)",
      "7+ years (Established business)",
    ], { condition: { field: "G1", value: "Yes" } }),
    Q("G3", "Industry / Sector of your business", "text", null, { condition: { field: "G1", value: "Yes" } }),
    Q("G6", "Do you currently have a funding need?", "radio", ["Yes", "No", "Possibly within 12 months"]),
    Q("G7", "What type of funding are you seeking?", "checkbox", [
      "Seed funding",
      "Angel investment",
      "Venture capital",
      "Grant funding",
      "Bank financing",
      "Government-backed financing",
      "Diaspora investment",
      "Trade finance",
      "Export financing",
      "Equipment financing",
      "Educational funding",
      "Working capital",
    ], { condition: { field: "G6", values: ["Yes", "Possibly within 12 months"] } }),
    Q("G8", "What funding range are you targeting?", "radio", [
      "Under $10,000",
      "$10,000 - $50,000",
      "$50,000 - $100,000",
      "$100,000 - $250,000",
      "$250,000 - $500,000",
      "$500,000 - $1M",
      "$1M+",
    ], { condition: { field: "G6", values: ["Yes", "Possibly within 12 months"] } }),
  ],
  H: [
    Q("H1", "What would you like from the SLINT community?", "checkbox", [
      "Access to investors",
      "Venture funding introductions",
      "Business financing guidance",
      "Startup incubation",
      "Mentorship",
      "Partnerships",
      "Government access",
      "Market access (local or international)",
      "Skill development",
      "Policy influence",
      "Visibility / promotion",
      "Research collaboration",
      "Speaking opportunities",
      "Diaspora engagement",
      "Community networking",
      "Educational scholarships",
      "Internship or job placement support",
      "Access to grants",
      "Corporate sponsorship connections",
      "Nothing specific - open to collaboration",
    ], { limit: 5 }),
  ],
  I: [
    Q("I1", "What is your area of study?", "text", null),
    Q("I2", "Level of Study", "radio", ["Undergraduate", "Postgraduate", "PhD", "Professional certification", "Vocational / Technical"]),
  ],
  J: [Q("J1", "Would you be interested in supporting SLINT's engagement with government?", "radio", ["Yes", "Maybe", "No"])],
  K: [
    Q("K1", "Do you believe Sierra Leone needs a recognized professional technology association with enforceable standards?", "radio", [
      "Yes - urgently",
      "Yes - but gradual implementation",
      "Neutral",
      "Not necessary",
    ]),
    Q("K5", "If SLINT issues a physical barcoded membership card with digital verification, would you:", "radio", [
      "Register immediately",
      "Register if recognized by employers",
      "Register if linked to professional benefits",
      "Not interested",
    ]),
  ],
  L: [Q("L1", "Would your organization recognize SLINT membership as:", "checkbox", ["A hiring advantage", "A preferred candidate indicator", "A required qualification for certain roles", "A professional credibility signal", "Not currently"])],
  M: [Q("M1", "In professional associations, what factors most influence participation?", "checkbox", ["Clear strategic direction", "Defined roles & responsibilities", "Measurable impact", "Regular communication", "Recognition & professional benefit", "Time-efficient meetings"], { limit: 3 })],
  N: [
    Q("N1", "How much time could you realistically contribute per year?", "radio", [
      "5-10 hours per year",
      "10-25 hours",
      "25-50 hours",
      "50-100 hours",
      "100+ hours",
      "Committee-level involvement",
    ]),
    Q("N2", "Preferred months of engagement in 2026", "checkbox", [
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ]),
  ],
  O: [Q("O1", "Should SLINT host:", "radio", ["Annual Tech Excellence Awards (separate from Expo)", "Awards integrated into Expo", "Both (Local Awards + Global Recognition)", "Not necessary"])],
  P: [Q("P1", "Would you be willing to:", "checkbox", ["Mentor startups", "Serve on an advisory board", "Invest in SL tech startups", "Lead a financing working group", "Sponsor a program"])],
  Q: [
    Q("Q1", "What are the biggest constraints preventing growth in Sierra Leone's tech sector?", "checkbox", [
      "Access to capital",
      "Regulatory uncertainty",
      "Procurement barriers",
      "Skills gap",
      "Infrastructure",
      "Limited investor presence",
      "Trust / credibility issues",
      "Lack of certification standards",
      "Weak diaspora coordination",
      "Limited export readiness",
      "Corruption / ethical risks",
    ], { limit: 5 }),
  ],
  R: [
    Q("R1", "What structural improvements would most strengthen SLINT's long-term institutional credibility?", "textarea", null),
    Q("R2", "If SLINT were to launch one high-impact initiative in the next 12 months, what should it be?", "textarea", null),
    Q("R3", "Anything else you would like the SLINT leadership to know?", "textarea", null),
  ],
};

export function getVisibleSections(answers: SurveyAnswers): Section[] {
  const profiles = (answers.B1 as string[] | undefined) ?? [];
  return SECTIONS.filter((section) => {
    if (!section.conditional) {
      return true;
    }
    if (section.conditional === "Student") {
      return profiles.includes("Student");
    }
    if (section.conditional === "Government / Public Sector Official") {
      return profiles.includes("Government / Public Sector Official");
    }
    if (section.conditional === "Corporate Employer / HR Decision Maker") {
      return profiles.includes("Corporate Employer / HR Decision Maker") || profiles.includes("Business Owner / Entrepreneur");
    }
    return true;
  });
}

export function isQuestionVisible(question: Question, answers: SurveyAnswers): boolean {
  if (!question.condition) {
    return true;
  }

  const answer = answers[question.condition.field];
  if (question.condition.value) {
    return answer === question.condition.value;
  }
  if (question.condition.values && typeof answer === "string") {
    return question.condition.values.includes(answer);
  }
  return true;
}

export function getCluster(answers: SurveyAnswers): string[] {
  const profiles = (answers.B1 as string[] | undefined) ?? [];
  const businessStage = typeof answers.G2 === "string" ? answers.G2 : "";
  const cluster: string[] = [];

  if (profiles.includes("Student")) cluster.push("Student");
  if (profiles.includes("Startup Founder (Pre-revenue or Early Stage)") || businessStage.includes("Pre-revenue") || businessStage.includes("0-1")) cluster.push("Startup");
  if (businessStage.includes("1-3")) cluster.push("Early Growth");
  if (businessStage.includes("3-7") || businessStage.includes("7+")) cluster.push("Scaling");
  if (profiles.includes("Government / Public Sector Official")) cluster.push("Government");
  if (profiles.includes("Investor / Venture Capital / Angel Investor")) cluster.push("Investor");
  if (profiles.includes("Diaspora Professional")) cluster.push("Diaspora");
  if (profiles.includes("Corporate Employer / HR Decision Maker")) cluster.push("Corporate");
  if (profiles.includes("Academic / Researcher")) cluster.push("Academic");
  if (cluster.length === 0) cluster.push("General");

  return cluster;
}
