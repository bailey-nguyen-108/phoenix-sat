// Sample data for the prototype. Vietnamese student names, bilingual-friendly copy.

const DASHBOARD = {
  name: "Linh",
  streak: 12,
  sessions: 47,
  avgAccuracy: 0.78,
  estScore: 1340,
  scoreDelta: 40,
  weakTopics: [
    { tag: "Linear equations", accuracy: 0.42, subject: "Math" },
    { tag: "Data inferences",  accuracy: 0.48, subject: "R&W" },
    { tag: "Circle theorems",  accuracy: 0.55, subject: "Math" },
    { tag: "Transitions",      accuracy: 0.58, subject: "R&W" },
    { tag: "Ratios & rates",   accuracy: 0.61, subject: "Math" },
  ],
  recent: [
    { date: "Wed",  subject: "Math", correct: 14, total: 18 },
    { date: "Tue",  subject: "R&W",  correct: 11, total: 15 },
    { date: "Sun",  subject: "Math", correct: 16, total: 20 },
    { date: "Sat",  subject: "R&W",  correct: 9,  total: 12 },
  ],
};

// A Bluebook-esque Reading & Writing question
const QUESTION = {
  index: 7,
  total: 15,
  subject: "Reading & Writing",
  topic: "Transitions",
  passage: (
    <>
      The Vietnamese áo dài underwent a dramatic transformation in the 1930s,
      when the artist <strong>Nguyễn Cát Tường</strong> reimagined it as a
      form-fitting, two-panel garment. Earlier versions had been loose and
      layered, worn over trousers by both men and women. ______ the redesigned
      áo dài quickly became associated specifically with femininity and with a
      distinctly modern Vietnamese identity.
    </>
  ),
  prompt: "Which choice completes the text with the most logical transition?",
  choices: [
    { k: "A", text: "However," },
    { k: "B", text: "As a result," },
    { k: "C", text: "For instance," },
    { k: "D", text: "In the same way," },
  ],
  correct: "B",
};

// Results breakdown
const RESULT = {
  score: 11,
  total: 15,
  accuracy: 0.733,
  duration: "22:14",
  subject: "Reading & Writing · Medium",
  rows: [
    { n:1,  topic:"Central idea",       ok:true  },
    { n:2,  topic:"Word in context",    ok:true  },
    { n:3,  topic:"Transitions",        ok:false,
      userPick:"A", correct:"B",
      why:"“However” signals contrast, but the sentence describes a consequence — the redesign caused the new association. “As a result,” links cause to effect, which matches the passage’s logic." },
    { n:4,  topic:"Rhetorical synthesis", ok:true },
    { n:5,  topic:"Data inferences",    ok:false,
      userPick:"D", correct:"C",
      why:"The table only reports values for 2018 and 2022. The claim about a steady yearly increase isn’t supported — choice C sticks to what the data actually shows." },
    { n:6,  topic:"Boundaries (punctuation)", ok:true },
    { n:7,  topic:"Central idea",       ok:true  },
    { n:8,  topic:"Transitions",        ok:false,
      userPick:"B", correct:"A",
      why:"Here the second sentence qualifies the first rather than extending it. A contrast word (“However”) is needed." },
    { n:9,  topic:"Command of evidence", ok:true },
    { n:10, topic:"Word in context",    ok:true  },
    { n:11, topic:"Transitions",        ok:false,
      userPick:"C", correct:"D",
      why:"The author is adding a parallel example, not introducing a new one. “In the same way,” mirrors the comparison set up in the previous sentence." },
    { n:12, topic:"Text structure",     ok:true  },
    { n:13, topic:"Boundaries",         ok:true  },
    { n:14, topic:"Rhetorical synthesis", ok:true },
    { n:15, topic:"Central idea",       ok:true  },
  ],
};

// Question bank table
const BANK = [
  { id:"Q-1084", subject:"Math", difficulty:"Hard",   topic:"Quadratics",        status:"live",    updated:"2d ago",  author:"Minh Trần" },
  { id:"Q-1083", subject:"R&W",  difficulty:"Medium", topic:"Transitions",       status:"pending", updated:"2d ago",  author:"AI · Claude" },
  { id:"Q-1082", subject:"Math", difficulty:"Easy",   topic:"Linear equations",  status:"live",    updated:"3d ago",  author:"Hoa Lê" },
  { id:"Q-1081", subject:"R&W",  difficulty:"Hard",   topic:"Command of evidence", status:"live",  updated:"3d ago",  author:"Minh Trần" },
  { id:"Q-1080", subject:"Math", difficulty:"Medium", topic:"Circle theorems",   status:"pending", updated:"4d ago",  author:"AI · Claude" },
  { id:"Q-1079", subject:"R&W",  difficulty:"Easy",   topic:"Word in context",   status:"live",    updated:"5d ago",  author:"Hoa Lê" },
  { id:"Q-1078", subject:"Math", difficulty:"Medium", topic:"Ratios & rates",    status:"live",    updated:"5d ago",  author:"Minh Trần" },
  { id:"Q-1077", subject:"R&W",  difficulty:"Medium", topic:"Text structure",    status:"pending", updated:"6d ago",  author:"AI · Claude" },
  { id:"Q-1076", subject:"Math", difficulty:"Hard",   topic:"Exponentials",      status:"live",    updated:"1w ago",  author:"Minh Trần" },
  { id:"Q-1075", subject:"R&W",  difficulty:"Easy",   topic:"Central idea",      status:"live",    updated:"1w ago",  author:"Hoa Lê" },
];

// AI review queue
const REVIEW = [
  {
    id: "AI-2041",
    subject: "R&W", topic: "Transitions", difficulty: "Medium",
    generated: "3 hours ago", confidence: 0.92,
    text: "The Mekong Delta has long supported one of the densest populations of freshwater fish species in Southeast Asia. ______ recent surveys show that more than a third of those species are now in decline, largely due to upstream damming and saltwater intrusion.",
    answers: [
      { k:"A", t:"Moreover,",     correct:false },
      { k:"B", t:"Nevertheless,", correct:true  },
      { k:"C", t:"For example,",  correct:false },
      { k:"D", t:"Similarly,",    correct:false },
    ],
    rationale: "The first sentence establishes abundance; the second reverses that picture. A contrastive transition fits best.",
  },
  {
    id: "AI-2040",
    subject: "Math", topic: "Linear equations", difficulty: "Easy",
    generated: "4 hours ago", confidence: 0.88,
    text: "If 3x − 7 = 2x + 5, what is the value of x?",
    answers: [
      { k:"A", t:"−2",  correct:false },
      { k:"B", t:"5",   correct:false },
      { k:"C", t:"12",  correct:true  },
      { k:"D", t:"−12", correct:false },
    ],
    rationale: "Subtracting 2x from both sides gives x − 7 = 5, so x = 12.",
  },
  {
    id: "AI-2039",
    subject: "Math", topic: "Circle theorems", difficulty: "Hard",
    generated: "5 hours ago", confidence: 0.71,
    text: "A circle in the xy-plane has equation x² + y² − 6x + 4y − 12 = 0. What is the radius of the circle?",
    answers: [
      { k:"A", t:"3",   correct:false },
      { k:"B", t:"4",   correct:false },
      { k:"C", t:"5",   correct:true  },
      { k:"D", t:"√12", correct:false },
    ],
    rationale: "Completing the square: (x−3)² + (y+2)² = 25, so r = 5.",
  },
  {
    id: "AI-2038",
    subject: "R&W", topic: "Word in context", difficulty: "Medium",
    generated: "yesterday", confidence: 0.84,
    text: "As used in the passage, the word “______” most nearly means ‘carefully considered’ — the committee’s deliberate approach to the reform was unusual in a political climate that generally rewarded speed.",
    answers: [
      { k:"A", t:"hesitant",  correct:false },
      { k:"B", t:"methodical", correct:true  },
      { k:"C", t:"ambitious",  correct:false },
      { k:"D", t:"reluctant",  correct:false },
    ],
    rationale: "“Methodical” captures the sense of carefully-planned action; the other options carry different connotations.",
  },
];

Object.assign(window, { DASHBOARD, QUESTION, RESULT, BANK, REVIEW });
