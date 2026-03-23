import { useState, useEffect, useCallback, useRef } from "react";

const FONTS_LINK = "https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,500;0,9..144,700;1,9..144,400&family=Outfit:wght@300;400;500;600;700&display=swap";

// ─── Theme ───────────────────────────────────────────────────────────────────
const T = {
  pink:    "#E4607A",
  pinkLt:  "#F9D1D8",
  pinkPale:"#FFF0F3",
  brown:   "#5C3425",
  brownMd: "#8B6552",
  brownLt: "#C4A68F",
  cream:   "#FFF8F5",
  creamDk: "#F5E6DD",
  white:   "#FFFFFF",
  text:    "#3A201A",
  textMd:  "#6B4E44",
  textLt:  "#A08478",
  green:   "#4CAF7D",
  red:     "#E05555",
  yellow:  "#F0B95A",
  blue:    "#5B8DEF",
};

// ─── Styles ──────────────────────────────────────────────────────────────────
const S = {
  app: { fontFamily:"'Outfit',sans-serif", background:`linear-gradient(170deg, ${T.cream} 0%, ${T.pinkPale} 40%, ${T.creamDk} 100%)`, minHeight:"100vh", color:T.text },
  heading: { fontFamily:"'Fraunces',serif", fontWeight:700 },
  subheading: { fontFamily:"'Fraunces',serif", fontWeight:500, fontStyle:"italic" },
  card: { background:T.white, borderRadius:20, boxShadow:"0 2px 20px rgba(92,52,37,0.07)", border:`1px solid ${T.creamDk}` },
  btn: (bg=T.pink, c=T.white) => ({ background:bg, color:c, border:"none", borderRadius:12, padding:"12px 28px", fontFamily:"'Outfit',sans-serif", fontWeight:600, fontSize:15, cursor:"pointer", transition:"all .2s", display:"inline-flex", alignItems:"center", gap:8 }),
  btnSm: (bg=T.pink, c=T.white) => ({ ...S.btn(bg,c), padding:"8px 18px", fontSize:13, borderRadius:10 }),
  input: { width:"100%", padding:"14px 18px", borderRadius:14, border:`2px solid ${T.creamDk}`, fontFamily:"'Outfit',sans-serif", fontSize:15, outline:"none", transition:"border .2s", background:T.white, boxSizing:"border-box" },
  textarea: { width:"100%", padding:"16px 18px", borderRadius:14, border:`2px solid ${T.creamDk}`, fontFamily:"'Outfit',sans-serif", fontSize:15, outline:"none", resize:"vertical", minHeight:200, background:T.white, boxSizing:"border-box", lineHeight:1.6 },
  badge: (bg=T.pinkLt, c=T.pink) => ({ background:bg, color:c, padding:"4px 12px", borderRadius:20, fontSize:12, fontWeight:600, display:"inline-block" }),
  tag: { background:T.creamDk, color:T.brownMd, padding:"4px 10px", borderRadius:8, fontSize:11, fontWeight:600 },
  progress: (pct, color=T.pink) => ({ width:"100%", height:8, background:T.creamDk, borderRadius:8, overflow:"hidden", position:"relative" }),
  progressFill: (pct, color=T.pink) => ({ width:`${pct}%`, height:"100%", background:color, borderRadius:8, transition:"width .6s ease" }),
};

// ─── Icons (inline SVG) ─────────────────────────────────────────────────────
const Icon = ({ name, size=20, color=T.textMd }) => {
  const icons = {
    upload: <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></>,
    brain: <><path d="M9.5 2a3.5 3.5 0 0 0-3 5.25A3.5 3.5 0 0 0 5 10.5a3.5 3.5 0 0 0 2.5 3.35V21h2V6.5a3.5 3.5 0 0 0-2-3.16"/><path d="M14.5 2a3.5 3.5 0 0 1 3 5.25A3.5 3.5 0 0 1 19 10.5a3.5 3.5 0 0 1-2.5 3.35V21h-2V6.5a3.5 3.5 0 0 1 2-3.16"/></>,
    quiz: <><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 12l2 2 4-4"/></>,
    chart: <><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></>,
    flash: <><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></>,
    star: <><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></>,
    clock: <><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></>,
    check: <><polyline points="20 6 9 17 4 12"/></>,
    x: <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>,
    arrow: <><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></>,
    back: <><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></>,
    home: <><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></>,
    target: <><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></>,
    refresh: <><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></>,
    book: <><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></>,
    fire: <><path d="M12 2c0 4-4 6-4 10a4 4 0 0 0 8 0c0-4-4-6-4-10z"/></>,
    settings: <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></>,
    trophy: <><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 22V10.174a2 2 0 0 1 .586-1.414l1-1a.5.5 0 0 1 .828.172l.586 1.756a2 2 0 0 0 1.9 1.372H16"/><rect x="6" y="2" width="12" height="7" rx="1"/></>,
    sparkle: <><path d="M12 3l1.5 5.5L19 10l-5.5 1.5L12 17l-1.5-5.5L5 10l5.5-1.5L12 3z"/></>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{icons[name]}</svg>;
};

// ─── AI API Call ─────────────────────────────────────────────────────────────
async function callAI(systemPrompt, userPrompt) {
  try {
    const r = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        system: systemPrompt,
        messages: [{ role: "user", content: userPrompt }],
      }),
    });
    const data = await r.json();
    return data.content?.map(b => b.text || "").join("\n") || "";
  } catch (e) {
    console.error("AI call failed:", e);
    return null;
  }
}

// ─── Quiz Generation ─────────────────────────────────────────────────────────
async function generateQuiz(notes, difficulty="medium", questionCount=8, focusTopics=[], missedConcepts=[]) {
  const system = `You are Quizify, an expert educational quiz generator. Generate quizzes from student notes.
RESPOND ONLY with valid JSON array (no markdown, no backticks). Each element:
{
  "type": "mcq" | "true_false" | "short_answer",
  "question": "string",
  "options": ["A","B","C","D"] (only for mcq),
  "correct_answer": "string (for mcq use the letter like 'A', for true_false use 'True' or 'False', for short_answer the expected answer)",
  "explanation": "Detailed step-by-step explanation of the correct answer",
  "topic": "topic tag string",
  "difficulty": "easy" | "medium" | "hard"
}
Generate exactly ${questionCount} questions. Mix types: ~50% mcq, ~25% true_false, ~25% short_answer.
Difficulty level: ${difficulty}.
${focusTopics.length ? `Focus on these topics: ${focusTopics.join(", ")}` : ""}
${missedConcepts.length ? `IMPORTANT: Include questions about these previously missed concepts to reinforce learning: ${missedConcepts.join("; ")}` : ""}`;

  const result = await callAI(system, `Generate a quiz from these notes:\n\n${notes.substring(0, 6000)}`);
  if (!result) return null;
  try {
    let cleaned = result.replace(/```json\s?/g, "").replace(/```/g, "").trim();
    const start = cleaned.indexOf("[");
    const end = cleaned.lastIndexOf("]");
    if (start !== -1 && end !== -1) {
      cleaned = cleaned.substring(start, end + 1);
    }
    return JSON.parse(cleaned);
  } catch (e) {
    console.error("Parse error:", e, "Raw:", result);
    return null;
  }
}

async function generateExplanation(question, userAnswer, correctAnswer, mode="normal") {
  const toneMap = { eli5: "Explain like I'm 5 years old. Use simple analogies, everyday examples, and very basic language.", normal: "Give a clear, detailed step-by-step explanation suitable for a student.", detailed: "Provide an extremely thorough academic explanation with examples, edge cases, and related concepts." };
  const system = `You are a patient, encouraging tutor. ${toneMap[mode]} Be concise but thorough. Use plain text only, no markdown.`;
  const prompt = `Question: ${question}\nStudent answered: ${userAnswer}\nCorrect answer: ${correctAnswer}\n\nExplain why the correct answer is right and why the student's answer was wrong. Help them understand the concept.`;
  return await callAI(system, prompt);
}

async function generateFlashcards(notes) {
  const system = `You are a study aid. Generate flashcards from notes. RESPOND ONLY with valid JSON array (no markdown, no backticks). Each element: {"front":"question/term","back":"answer/definition","topic":"tag"}. Generate 10-15 flashcards covering key concepts.`;
  const result = await callAI(system, `Create flashcards from:\n\n${notes.substring(0, 5000)}`);
  if (!result) return null;
  try {
    let cleaned = result.replace(/```json\s?/g, "").replace(/```/g, "").trim();
    const start = cleaned.indexOf("[");
    const end = cleaned.lastIndexOf("]");
    if (start !== -1 && end !== -1) cleaned = cleaned.substring(start, end + 1);
    return JSON.parse(cleaned);
  } catch { return null; }
}

async function askFollowUp(question, explanation, followUpQ) {
  const system = "You are a helpful tutor. Answer the student's follow-up question about a quiz question they got wrong. Be clear and encouraging. Plain text only.";
  const prompt = `Original question: ${question}\nPrevious explanation: ${explanation}\nStudent asks: ${followUpQ}`;
  return await callAI(system, prompt);
}

// ─── Data Helpers ────────────────────────────────────────────────────────────
function getStreak(history) {
  let streak = 0;
  const days = [...new Set(history.map(h => new Date(h.date).toDateString()))].sort((a,b) => new Date(b)-new Date(a));
  if (days.length === 0) return 0;
  const today = new Date().toDateString();
  const yesterday = new Date(Date.now()-86400000).toDateString();
  if (days[0] !== today && days[0] !== yesterday) return 0;
  for (let i = 0; i < days.length-1; i++) {
    const diff = (new Date(days[i]) - new Date(days[i+1])) / 86400000;
    if (diff <= 1) streak++; else break;
  }
  return streak + 1;
}

function getTopicMastery(history) {
  const topics = {};
  history.forEach(h => {
    h.questions?.forEach(q => {
      if (!topics[q.topic]) topics[q.topic] = { correct:0, total:0 };
      topics[q.topic].total++;
      if (q.isCorrect) topics[q.topic].correct++;
    });
  });
  return Object.entries(topics).map(([t,v]) => ({ topic:t, mastery: Math.round(v.correct/v.total*100), correct:v.correct, total:v.total })).sort((a,b) => a.mastery - b.mastery);
}

function getMissedConcepts(history) {
  const missed = {};
  history.forEach(h => {
    h.questions?.forEach(q => {
      if (!q.isCorrect) {
        const key = q.topic || "General";
        if (!missed[key]) missed[key] = [];
        missed[key].push({ question: q.question, correct: q.correct_answer, userAnswer: q.userAnswer, explanation: q.explanation, date: h.date });
      }
    });
  });
  return missed;
}

// ─── Animated Counter ────────────────────────────────────────────────────────
function AnimNum({ value, suffix="" }) {
  const [disp, setDisp] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = Math.max(1, Math.ceil(value / 30));
    const timer = setInterval(() => {
      start += step;
      if (start >= value) { setDisp(value); clearInterval(timer); }
      else setDisp(start);
    }, 30);
    return () => clearInterval(timer);
  }, [value]);
  return <span>{disp}{suffix}</span>;
}

// ─── Spinner ─────────────────────────────────────────────────────────────────
function Spinner({ text="Loading..." }) {
  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:16, padding:40 }}>
      <div style={{ width:48, height:48, borderRadius:"50%", border:`4px solid ${T.creamDk}`, borderTopColor:T.pink, animation:"spin 1s linear infinite" }} />
      <p style={{ color:T.textMd, fontWeight:500 }}>{text}</p>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

// ─── Navigation ──────────────────────────────────────────────────────────────
function Nav({ page, setPage, streak }) {
  const items = [
    { id:"home", icon:"home", label:"Home" },
    { id:"upload", icon:"upload", label:"Notes" },
    { id:"progress", icon:"chart", label:"Progress" },
    { id:"weak", icon:"target", label:"Weak Areas" },
    { id:"flashcards", icon:"flash", label:"Flashcards" },
  ];
  return (
    <nav style={{ position:"fixed", top:0, left:0, right:0, zIndex:100, background:"rgba(255,248,245,0.85)", backdropFilter:"blur(20px)", borderBottom:`1px solid ${T.creamDk}`, padding:"0 24px" }}>
      <div style={{ maxWidth:1200, margin:"0 auto", display:"flex", alignItems:"center", justifyContent:"space-between", height:64 }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, cursor:"pointer" }} onClick={() => setPage("home")}>
          <div style={{ width:36, height:36, borderRadius:10, background:`linear-gradient(135deg, ${T.pink}, ${T.brownMd})`, display:"flex", alignItems:"center", justifyContent:"center" }}>
            <Icon name="sparkle" size={20} color={T.white} />
          </div>
          <span style={{ ...S.heading, fontSize:22, color:T.brown }}>Quizify</span>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:4 }}>
          {items.map(it => (
            <button key={it.id} onClick={() => setPage(it.id)} style={{ background: page===it.id ? T.pinkPale : "transparent", border:"none", borderRadius:10, padding:"8px 14px", cursor:"pointer", display:"flex", alignItems:"center", gap:6, transition:"all .2s" }}>
              <Icon name={it.icon} size={18} color={page===it.id ? T.pink : T.textLt} />
              <span style={{ fontSize:13, fontWeight:page===it.id ? 600 : 500, color:page===it.id ? T.pink : T.textLt, display: window.innerWidth < 640 ? "none" : "inline" }}>{it.label}</span>
            </button>
          ))}
          {streak > 0 && (
            <div style={{ ...S.badge(T.creamDk, T.brownMd), display:"flex", alignItems:"center", gap:4, marginLeft:8 }}>
              <Icon name="fire" size={14} color="#F0825A" />{streak}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

// ─── Home Page ───────────────────────────────────────────────────────────────
function HomePage({ setPage, history, notes }) {
  const totalQuizzes = history.length;
  const totalQ = history.reduce((s,h) => s + (h.questions?.length||0), 0);
  const totalCorrect = history.reduce((s,h) => s + (h.questions?.filter(q=>q.isCorrect).length||0), 0);
  const accuracy = totalQ ? Math.round(totalCorrect/totalQ*100) : 0;
  const streak = getStreak(history);

  return (
    <div style={{ padding:"100px 24px 40px", maxWidth:900, margin:"0 auto" }}>
      <div style={{ textAlign:"center", marginBottom:48 }}>
        <div style={{ ...S.heading, fontSize:48, lineHeight:1.1, marginBottom:12, background:`linear-gradient(135deg, ${T.pink}, ${T.brown})`, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
          Study smarter,<br/>not harder.
        </div>
        <p style={{ ...S.subheading, fontSize:20, color:T.textMd, marginBottom:32 }}>Upload your notes. Let AI create personalized quizzes that adapt to you.</p>
        <button onClick={() => setPage("upload")} style={{ ...S.btn(), fontSize:17, padding:"16px 36px", borderRadius:16, background:`linear-gradient(135deg, ${T.pink}, #D44A6A)`, boxShadow:`0 8px 24px ${T.pink}44` }}>
          <Icon name="sparkle" size={20} color={T.white} /> Get Started
        </button>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(180px, 1fr))", gap:16, marginBottom:40 }}>
        {[
          { label:"Quizzes Taken", value:totalQuizzes, icon:"quiz", color:T.pink },
          { label:"Accuracy", value:accuracy, suffix:"%", icon:"target", color:T.green },
          { label:"Questions", value:totalQ, icon:"brain", color:T.blue },
          { label:"Day Streak", value:streak, icon:"fire", color:"#F0825A" },
        ].map((s,i) => (
          <div key={i} style={{ ...S.card, padding:24, textAlign:"center" }}>
            <div style={{ width:44, height:44, borderRadius:12, background:`${s.color}15`, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 12px" }}>
              <Icon name={s.icon} size={22} color={s.color} />
            </div>
            <div style={{ ...S.heading, fontSize:32, color:T.brown }}><AnimNum value={s.value} suffix={s.suffix||""} /></div>
            <div style={{ fontSize:13, color:T.textLt, fontWeight:500 }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(260px, 1fr))", gap:16 }}>
        {[
          { icon:"upload", title:"Upload Notes", desc:"Paste or upload your study materials", action:() => setPage("upload"), color:T.pink },
          { icon:"target", title:"Weak Areas", desc:"Review and strengthen missed concepts", action:() => setPage("weak"), color:T.red },
          { icon:"flash", title:"Flashcards", desc:"Auto-generated cards from your notes", action:() => setPage("flashcards"), color:T.yellow },
          { icon:"chart", title:"Progress", desc:"Track your growth over time", action:() => setPage("progress"), color:T.blue },
        ].map((c,i) => (
          <div key={i} onClick={c.action} style={{ ...S.card, padding:24, cursor:"pointer", transition:"all .2s", display:"flex", gap:16, alignItems:"flex-start" }}
            onMouseEnter={e => e.currentTarget.style.transform="translateY(-2px)"} onMouseLeave={e => e.currentTarget.style.transform="none"}>
            <div style={{ width:44, height:44, borderRadius:12, background:`${c.color}15`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
              <Icon name={c.icon} size={22} color={c.color} />
            </div>
            <div>
              <div style={{ fontWeight:600, fontSize:16, marginBottom:4 }}>{c.title}</div>
              <div style={{ fontSize:13, color:T.textLt }}>{c.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Upload Notes Page ───────────────────────────────────────────────────────
function UploadPage({ notes, setNotes, onStartQuiz, setPage, history }) {
  const [text, setText] = useState(notes);
  const [difficulty, setDifficulty] = useState("medium");
  const [count, setCount] = useState(8);
  const [mode, setMode] = useState("practice");
  const [timeLimit, setTimeLimit] = useState(15);
  const [loading, setLoading] = useState(false);
  const [includeWeak, setIncludeWeak] = useState(true);
  const fileRef = useRef();

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type === "text/plain" || file.name.endsWith(".md") || file.name.endsWith(".txt")) {
      const content = await file.text();
      setText(content);
    } else {
      alert("Currently supports .txt and .md files. For PDFs, please copy-paste the text content.");
    }
  };

  const handleStart = async () => {
    if (!text.trim()) return;
    setNotes(text);
    setLoading(true);
    const missed = getMissedConcepts(history);
    const missedConcepts = includeWeak ? Object.entries(missed).flatMap(([topic, qs]) => qs.slice(-2).map(q => `${topic}: ${q.question}`)).slice(0, 4) : [];
    const quiz = await generateQuiz(text, difficulty, count, [], missedConcepts);
    setLoading(false);
    if (quiz) {
      onStartQuiz({ questions: quiz, mode, timeLimit: mode==="timed" ? timeLimit : null, difficulty });
    } else {
      alert("Failed to generate quiz. Please try again.");
    }
  };

  if (loading) return (
    <div style={{ padding:"100px 24px 40px", maxWidth:700, margin:"0 auto", textAlign:"center" }}>
      <div style={{ ...S.card, padding:60 }}>
        <Spinner text="Crafting your personalized quiz..." />
        <p style={{ color:T.textLt, fontSize:13, marginTop:12 }}>Analyzing notes & generating questions</p>
      </div>
    </div>
  );

  return (
    <div style={{ padding:"100px 24px 40px", maxWidth:760, margin:"0 auto" }}>
      <div style={{ marginBottom:32 }}>
        <h1 style={{ ...S.heading, fontSize:32, marginBottom:8 }}>Your Study Notes</h1>
        <p style={{ color:T.textMd }}>Paste your notes below or upload a file, then configure your quiz.</p>
      </div>
      <div style={{ ...S.card, padding:28, marginBottom:20 }}>
        <textarea value={text} onChange={e => setText(e.target.value)} placeholder="Paste your notes here... The more detailed, the better the quiz!" style={S.textarea} onFocus={e => e.target.style.borderColor=T.pink} onBlur={e => e.target.style.borderColor=T.creamDk} />
        <div style={{ display:"flex", gap:12, marginTop:12, alignItems:"center" }}>
          <input ref={fileRef} type="file" accept=".txt,.md" style={{ display:"none" }} onChange={handleFile} />
          <button onClick={() => fileRef.current?.click()} style={S.btnSm(T.creamDk, T.brownMd)}>
            <Icon name="upload" size={16} color={T.brownMd} /> Upload File
          </button>
          <span style={{ fontSize:12, color:T.textLt }}>{text.length > 0 ? `${text.split(/\s+/).length} words` : "No content yet"}</span>
        </div>
      </div>

      <div style={{ ...S.card, padding:28, marginBottom:20 }}>
        <h3 style={{ ...S.heading, fontSize:18, marginBottom:20 }}>Quiz Settings</h3>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20 }}>
          <div>
            <label style={{ fontSize:13, fontWeight:600, color:T.textMd, display:"block", marginBottom:8 }}>Difficulty</label>
            <div style={{ display:"flex", gap:8 }}>
              {["easy","medium","hard"].map(d => (
                <button key={d} onClick={() => setDifficulty(d)} style={{ ...S.btnSm(difficulty===d ? T.pink : T.creamDk, difficulty===d ? T.white : T.textMd), textTransform:"capitalize", flex:1 }}>{d}</button>
              ))}
            </div>
          </div>
          <div>
            <label style={{ fontSize:13, fontWeight:600, color:T.textMd, display:"block", marginBottom:8 }}>Questions: {count}</label>
            <input type="range" min={4} max={20} value={count} onChange={e => setCount(+e.target.value)} style={{ width:"100%", accentColor:T.pink }} />
          </div>
          <div>
            <label style={{ fontSize:13, fontWeight:600, color:T.textMd, display:"block", marginBottom:8 }}>Study Mode</label>
            <div style={{ display:"flex", gap:8 }}>
              {[{id:"practice",label:"Practice",icon:"book"},{id:"timed",label:"Timed",icon:"clock"}].map(m => (
                <button key={m.id} onClick={() => setMode(m.id)} style={{ ...S.btnSm(mode===m.id ? T.pink : T.creamDk, mode===m.id ? T.white : T.textMd), flex:1, justifyContent:"center" }}>
                  <Icon name={m.icon} size={14} color={mode===m.id ? T.white : T.textMd} /> {m.label}
                </button>
              ))}
            </div>
          </div>
          {mode === "timed" && (
            <div>
              <label style={{ fontSize:13, fontWeight:600, color:T.textMd, display:"block", marginBottom:8 }}>Time per question: {timeLimit}min</label>
              <input type="range" min={1} max={5} value={timeLimit} onChange={e => setTimeLimit(+e.target.value)} style={{ width:"100%", accentColor:T.pink }} />
            </div>
          )}
        </div>
        {Object.keys(getMissedConcepts(history)).length > 0 && (
          <label style={{ display:"flex", alignItems:"center", gap:10, marginTop:20, cursor:"pointer", fontSize:14, color:T.textMd }}>
            <input type="checkbox" checked={includeWeak} onChange={e => setIncludeWeak(e.target.checked)} style={{ accentColor:T.pink, width:18, height:18 }} />
            <span>Include questions from weak areas (spaced repetition)</span>
            <span style={S.badge()}>Recommended</span>
          </label>
        )}
      </div>

      <button onClick={handleStart} disabled={!text.trim()} style={{ ...S.btn(), width:"100%", justifyContent:"center", fontSize:17, padding:"16px 36px", borderRadius:16, opacity: text.trim() ? 1 : 0.5, background:`linear-gradient(135deg, ${T.pink}, #D44A6A)`, boxShadow: text.trim() ? `0 8px 24px ${T.pink}44` : "none" }}>
        <Icon name="sparkle" size={20} color={T.white} /> Generate Quiz
      </button>
    </div>
  );
}

// ─── Quiz Page ───────────────────────────────────────────────────────────────
function QuizPage({ quizData, onFinish }) {
  const { questions, mode, timeLimit } = quizData;
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [shortAns, setShortAns] = useState("");
  const [timer, setTimer] = useState(timeLimit ? timeLimit * 60 : null);
  const [showImmediate, setShowImmediate] = useState(null);

  useEffect(() => {
    if (timer === null || timer <= 0) return;
    const int = setInterval(() => setTimer(t => { if (t <= 1) { clearInterval(int); handleFinish(); return 0; } return t-1; }), 1000);
    return () => clearInterval(int);
  }, [timer]);

  const q = questions[current];
  const isAnswered = answers[current] !== undefined;

  const selectAnswer = (ans) => {
    if (isAnswered && mode === "practice") return;
    const newAns = { ...answers, [current]: ans };
    setAnswers(newAns);
    if (mode === "practice") {
      const correct = q.type === "mcq" ? ans === q.correct_answer : q.type === "true_false" ? ans === q.correct_answer : ans.toLowerCase().trim() === q.correct_answer.toLowerCase().trim();
      setShowImmediate(correct ? "correct" : "wrong");
    }
  };

  const handleFinish = () => {
    const results = questions.map((q, i) => {
      const ua = answers[i] || "(no answer)";
      let isCorrect;
      if (q.type === "short_answer") isCorrect = ua.toLowerCase().trim() === q.correct_answer.toLowerCase().trim();
      else isCorrect = ua === q.correct_answer;
      return { ...q, userAnswer: ua, isCorrect };
    });
    onFinish(results);
  };

  const goNext = () => {
    setShowImmediate(null);
    setShortAns("");
    if (current < questions.length - 1) setCurrent(current + 1);
    else handleFinish();
  };

  const formatTime = (s) => `${Math.floor(s/60)}:${(s%60).toString().padStart(2,"0")}`;

  return (
    <div style={{ padding:"100px 24px 40px", maxWidth:720, margin:"0 auto" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:24 }}>
        <div>
          <span style={{ ...S.badge(T.creamDk, T.brownMd) }}>Question {current+1} of {questions.length}</span>
          <span style={{ ...S.tag, marginLeft:8 }}>{q.topic}</span>
          <span style={{ ...S.badge(q.difficulty==="easy" ? "#E8F5E9" : q.difficulty==="hard" ? "#FFEBEE" : "#FFF8E1", q.difficulty==="easy" ? T.green : q.difficulty==="hard" ? T.red : T.yellow), marginLeft:8 }}>
            {q.difficulty}
          </span>
        </div>
        {timer !== null && (
          <div style={{ display:"flex", alignItems:"center", gap:6, color: timer < 60 ? T.red : T.brownMd, fontWeight:600 }}>
            <Icon name="clock" size={18} color={timer < 60 ? T.red : T.brownMd} />
            {formatTime(timer)}
          </div>
        )}
      </div>

      <div style={{ width:"100%", height:6, background:T.creamDk, borderRadius:6, marginBottom:28 }}>
        <div style={{ width:`${((current+1)/questions.length)*100}%`, height:"100%", background:`linear-gradient(90deg, ${T.pink}, #D44A6A)`, borderRadius:6, transition:"width .4s ease" }} />
      </div>

      <div style={{ ...S.card, padding:32, marginBottom:24 }}>
        <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4 }}>
          <span style={{ fontSize:11, fontWeight:600, color:T.textLt, textTransform:"uppercase", letterSpacing:1 }}>
            {q.type === "mcq" ? "Multiple Choice" : q.type === "true_false" ? "True or False" : "Short Answer"}
          </span>
        </div>
        <h2 style={{ ...S.heading, fontSize:22, lineHeight:1.4, marginBottom:24, color:T.brown }}>{q.question}</h2>

        {q.type === "mcq" && (
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {q.options.map((opt, i) => {
              const letter = ["A","B","C","D"][i];
              const selected = answers[current] === letter;
              const isCorrectOpt = letter === q.correct_answer;
              let bg = T.white, border = T.creamDk, textColor = T.text;
              if (showImmediate && selected && !isCorrectOpt) { bg = "#FFEBEE"; border = T.red; textColor = T.red; }
              else if (showImmediate && isCorrectOpt) { bg = "#E8F5E9"; border = T.green; textColor = T.green; }
              else if (selected) { bg = T.pinkPale; border = T.pink; textColor = T.pink; }
              return (
                <button key={i} onClick={() => selectAnswer(letter)} disabled={!!showImmediate}
                  style={{ display:"flex", alignItems:"center", gap:14, padding:"14px 18px", borderRadius:14, border:`2px solid ${border}`, background:bg, cursor: showImmediate ? "default" : "pointer", transition:"all .2s", textAlign:"left" }}>
                  <span style={{ width:32, height:32, borderRadius:8, background: selected ? (showImmediate && !isCorrectOpt ? T.red : showImmediate && isCorrectOpt ? T.green : T.pink) : T.creamDk, color: selected ? T.white : T.textMd, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:700, fontSize:14, flexShrink:0 }}>
                    {showImmediate && isCorrectOpt ? "✓" : letter}
                  </span>
                  <span style={{ fontSize:15, color:textColor, fontWeight: selected ? 600 : 400 }}>{opt}</span>
                </button>
              );
            })}
          </div>
        )}

        {q.type === "true_false" && (
          <div style={{ display:"flex", gap:12 }}>
            {["True","False"].map(v => {
              const selected = answers[current] === v;
              const isCorrectOpt = v === q.correct_answer;
              let bg = T.white, border = T.creamDk;
              if (showImmediate && selected && !isCorrectOpt) { bg = "#FFEBEE"; border = T.red; }
              else if (showImmediate && isCorrectOpt) { bg = "#E8F5E9"; border = T.green; }
              else if (selected) { bg = T.pinkPale; border = T.pink; }
              return (
                <button key={v} onClick={() => selectAnswer(v)} disabled={!!showImmediate}
                  style={{ flex:1, padding:"16px", borderRadius:14, border:`2px solid ${border}`, background:bg, cursor: showImmediate ? "default" : "pointer", fontWeight:600, fontSize:16, transition:"all .2s", color: selected ? T.pink : T.text }}>
                  {v}
                </button>
              );
            })}
          </div>
        )}

        {q.type === "short_answer" && (
          <div>
            <input value={isAnswered ? answers[current] : shortAns} disabled={!!showImmediate}
              onChange={e => setShortAns(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter" && shortAns.trim()) selectAnswer(shortAns.trim()); }}
              placeholder="Type your answer..."
              style={{ ...S.input, ...(showImmediate === "correct" ? { borderColor: T.green, background:"#E8F5E9" } : showImmediate === "wrong" ? { borderColor: T.red, background:"#FFEBEE" } : {}) }}
              onFocus={e => { if (!showImmediate) e.target.style.borderColor = T.pink; }}
              onBlur={e => { if (!showImmediate) e.target.style.borderColor = T.creamDk; }}
            />
            {!isAnswered && shortAns.trim() && (
              <button onClick={() => selectAnswer(shortAns.trim())} style={{ ...S.btnSm(), marginTop:10 }}>Submit</button>
            )}
          </div>
        )}

        {showImmediate && (
          <div style={{ marginTop:20, padding:16, borderRadius:12, background: showImmediate === "correct" ? "#E8F5E9" : "#FFF3E0", border:`1px solid ${showImmediate === "correct" ? "#C8E6C9" : "#FFE0B2"}` }}>
            <div style={{ fontWeight:700, fontSize:14, color: showImmediate === "correct" ? T.green : "#E65100", marginBottom:6 }}>
              {showImmediate === "correct" ? "✓ Correct!" : `✗ Incorrect — Answer: ${q.correct_answer}`}
            </div>
            <div style={{ fontSize:13, color:T.textMd, lineHeight:1.6 }}>{q.explanation}</div>
          </div>
        )}
      </div>

      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <div style={{ display:"flex", gap:6 }}>
          {questions.map((_, i) => (
            <div key={i} style={{ width: i===current ? 24 : 8, height:8, borderRadius:4, background: answers[i] !== undefined ? T.pink : i===current ? T.brownLt : T.creamDk, transition:"all .3s" }} />
          ))}
        </div>
        {mode === "practice" && showImmediate ? (
          <button onClick={goNext} style={S.btn()}>
            {current < questions.length-1 ? "Next" : "Finish"} <Icon name="arrow" size={16} color={T.white} />
          </button>
        ) : mode === "timed" ? (
          <div style={{ display:"flex", gap:10 }}>
            {current > 0 && <button onClick={() => setCurrent(current-1)} style={S.btnSm(T.creamDk, T.brownMd)}><Icon name="back" size={14} color={T.brownMd} /> Back</button>}
            {current < questions.length-1 ? (
              <button onClick={() => { setCurrent(current+1); setShortAns(""); }} style={S.btn()}>Next <Icon name="arrow" size={16} color={T.white} /></button>
            ) : (
              <button onClick={handleFinish} style={S.btn()}>Finish <Icon name="check" size={16} color={T.white} /></button>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}

// ─── Results Page ────────────────────────────────────────────────────────────
function ResultsPage({ results, onRetry, onHome, notes, onStartQuiz, history }) {
  const correct = results.filter(r => r.isCorrect).length;
  const total = results.length;
  const pct = Math.round(correct/total*100);
  const [expandedExpl, setExpandedExpl] = useState({});
  const [explMode, setExplMode] = useState({});
  const [customExpl, setCustomExpl] = useState({});
  const [loadingExpl, setLoadingExpl] = useState({});
  const [followUp, setFollowUp] = useState({});
  const [followUpResp, setFollowUpResp] = useState({});
  const [loadingFU, setLoadingFU] = useState({});

  const getExplanation = async (idx, mode) => {
    const q = results[idx];
    setLoadingExpl(p => ({ ...p, [idx]: true }));
    const expl = await generateExplanation(q.question, q.userAnswer, q.correct_answer, mode);
    setLoadingExpl(p => ({ ...p, [idx]: false }));
    if (expl) {
      setCustomExpl(p => ({ ...p, [`${idx}-${mode}`]: expl }));
      setExplMode(p => ({ ...p, [idx]: mode }));
    }
  };

  const askFU = async (idx) => {
    const q = results[idx];
    const fuQ = followUp[idx];
    if (!fuQ?.trim()) return;
    setLoadingFU(p => ({ ...p, [idx]: true }));
    const resp = await askFollowUp(q.question, q.explanation, fuQ);
    setLoadingFU(p => ({ ...p, [idx]: false }));
    if (resp) setFollowUpResp(p => ({ ...p, [idx]: [...(p[idx]||[]), { q: fuQ, a: resp }] }));
    setFollowUp(p => ({ ...p, [idx]: "" }));
  };

  const handleRevisionQuiz = async () => {
    const wrongQs = results.filter(r => !r.isCorrect);
    if (wrongQs.length === 0) return;
    const missedConcepts = wrongQs.map(q => `${q.topic}: ${q.question}`);
    const quiz = await generateQuiz(notes, "medium", Math.min(wrongQs.length + 4, 12), [], missedConcepts);
    if (quiz) onStartQuiz({ questions: quiz, mode: "practice", timeLimit: null, difficulty: "medium" });
  };

  return (
    <div style={{ padding:"100px 24px 40px", maxWidth:760, margin:"0 auto" }}>
      <div style={{ ...S.card, padding:40, textAlign:"center", marginBottom:28, background:`linear-gradient(135deg, ${T.pinkPale}, ${T.creamDk})` }}>
        <div style={{ width:100, height:100, borderRadius:"50%", background:T.white, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 20px", boxShadow:`0 4px 20px ${T.pink}22` }}>
          <span style={{ ...S.heading, fontSize:36, color: pct >= 70 ? T.green : pct >= 40 ? T.yellow : T.red }}>{pct}%</span>
        </div>
        <h1 style={{ ...S.heading, fontSize:28, color:T.brown, marginBottom:8 }}>
          {pct >= 90 ? "Outstanding!" : pct >= 70 ? "Great work!" : pct >= 50 ? "Good effort!" : "Keep practicing!"}
        </h1>
        <p style={{ color:T.textMd, fontSize:15 }}>You got <strong>{correct}</strong> out of <strong>{total}</strong> questions correct</p>
        <div style={{ display:"flex", gap:12, justifyContent:"center", marginTop:24 }}>
          <button onClick={onHome} style={S.btnSm(T.creamDk, T.brownMd)}><Icon name="home" size={16} color={T.brownMd} /> Home</button>
          <button onClick={onRetry} style={S.btnSm(T.creamDk, T.brownMd)}><Icon name="refresh" size={16} color={T.brownMd} /> New Quiz</button>
          {results.some(r => !r.isCorrect) && (
            <button onClick={handleRevisionQuiz} style={S.btnSm()}><Icon name="target" size={16} color={T.white} /> Revision Quiz</button>
          )}
        </div>
      </div>

      <h2 style={{ ...S.heading, fontSize:22, marginBottom:16 }}>Review Answers</h2>
      {results.map((r, i) => {
        const expanded = expandedExpl[i];
        const curMode = explMode[i] || "normal";
        return (
          <div key={i} style={{ ...S.card, padding:24, marginBottom:14, borderLeft:`4px solid ${r.isCorrect ? T.green : T.red}` }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:8 }}>
              <span style={{ ...S.tag }}>{r.topic}</span>
              <span style={{ ...S.badge(r.isCorrect ? "#E8F5E9" : "#FFEBEE", r.isCorrect ? T.green : T.red) }}>
                {r.isCorrect ? "✓ Correct" : "✗ Incorrect"}
              </span>
            </div>
            <p style={{ fontWeight:600, fontSize:15, marginBottom:8, lineHeight:1.5 }}>{r.question}</p>
            <div style={{ fontSize:13, color:T.textMd, marginBottom:4 }}>Your answer: <span style={{ fontWeight:600, color: r.isCorrect ? T.green : T.red }}>{r.userAnswer}</span></div>
            {!r.isCorrect && <div style={{ fontSize:13, color:T.green, fontWeight:600 }}>Correct: {r.correct_answer}</div>}

            {!r.isCorrect && (
              <div style={{ marginTop:12 }}>
                <button onClick={() => setExpandedExpl(p => ({ ...p, [i]: !expanded }))} style={{ ...S.btnSm(T.pinkPale, T.pink), fontSize:12 }}>
                  <Icon name="brain" size={14} color={T.pink} /> {expanded ? "Hide" : "Show"} Explanation
                </button>
                {expanded && (
                  <div style={{ marginTop:12, padding:16, borderRadius:12, background:T.pinkPale, border:`1px solid ${T.pinkLt}` }}>
                    <div style={{ display:"flex", gap:6, marginBottom:12 }}>
                      {["eli5","normal","detailed"].map(m => (
                        <button key={m} onClick={() => getExplanation(i, m)} style={{ ...S.btnSm(curMode===m ? T.pink : T.white, curMode===m ? T.white : T.textMd), fontSize:11, padding:"4px 12px" }}>
                          {m === "eli5" ? "ELI5" : m === "normal" ? "Normal" : "Detailed"}
                        </button>
                      ))}
                    </div>
                    {loadingExpl[i] ? <Spinner text="Generating explanation..." /> : (
                      <p style={{ fontSize:14, lineHeight:1.7, color:T.text, whiteSpace:"pre-wrap" }}>
                        {customExpl[`${i}-${curMode}`] || r.explanation}
                      </p>
                    )}
                    <div style={{ marginTop:14, borderTop:`1px solid ${T.pinkLt}`, paddingTop:12 }}>
                      {(followUpResp[i] || []).map((fu, fi) => (
                        <div key={fi} style={{ marginBottom:12, fontSize:13 }}>
                          <div style={{ fontWeight:600, color:T.pink, marginBottom:4 }}>Q: {fu.q}</div>
                          <div style={{ color:T.text, lineHeight:1.6, whiteSpace:"pre-wrap" }}>{fu.a}</div>
                        </div>
                      ))}
                      <div style={{ display:"flex", gap:8 }}>
                        <input value={followUp[i] || ""} onChange={e => setFollowUp(p => ({ ...p, [i]: e.target.value }))}
                          placeholder="Ask a follow-up question..."
                          onKeyDown={e => { if (e.key === "Enter") askFU(i); }}
                          style={{ ...S.input, padding:"8px 14px", fontSize:13, flex:1 }} />
                        <button onClick={() => askFU(i)} disabled={loadingFU[i]} style={S.btnSm()}>
                          {loadingFU[i] ? "..." : "Ask"}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Progress Page ───────────────────────────────────────────────────────────
function ProgressPage({ history }) {
  const mastery = getTopicMastery(history);
  const recent = history.slice(-10).reverse();
  const totalQ = history.reduce((s,h) => s + (h.questions?.length||0), 0);
  const totalC = history.reduce((s,h) => s + (h.questions?.filter(q=>q.isCorrect).length||0), 0);

  return (
    <div style={{ padding:"100px 24px 40px", maxWidth:800, margin:"0 auto" }}>
      <h1 style={{ ...S.heading, fontSize:32, marginBottom:8 }}>Your Progress</h1>
      <p style={{ color:T.textMd, marginBottom:32 }}>Track your learning journey and see how you're improving.</p>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(160px,1fr))", gap:14, marginBottom:32 }}>
        {[
          { label:"Total Quizzes", val:history.length, color:T.pink },
          { label:"Questions Answered", val:totalQ, color:T.blue },
          { label:"Correct Answers", val:totalC, color:T.green },
          { label:"Overall Accuracy", val:`${totalQ ? Math.round(totalC/totalQ*100) : 0}%`, color:T.yellow },
        ].map((s,i) => (
          <div key={i} style={{ ...S.card, padding:20, textAlign:"center" }}>
            <div style={{ ...S.heading, fontSize:28, color:s.color }}>{s.val}</div>
            <div style={{ fontSize:12, color:T.textLt, fontWeight:500, marginTop:4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {mastery.length > 0 && (
        <div style={{ ...S.card, padding:28, marginBottom:24 }}>
          <h3 style={{ ...S.heading, fontSize:20, marginBottom:20 }}>Topic Mastery</h3>
          {mastery.map((t,i) => (
            <div key={i} style={{ marginBottom:16 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
                <span style={{ fontSize:14, fontWeight:500 }}>{t.topic}</span>
                <span style={{ fontSize:13, fontWeight:600, color: t.mastery >= 70 ? T.green : t.mastery >= 40 ? T.yellow : T.red }}>{t.mastery}%</span>
              </div>
              <div style={S.progress(t.mastery)}>
                <div style={S.progressFill(t.mastery, t.mastery >= 70 ? T.green : t.mastery >= 40 ? T.yellow : T.red)} />
              </div>
              <div style={{ fontSize:11, color:T.textLt, marginTop:4 }}>{t.correct}/{t.total} correct</div>
            </div>
          ))}
        </div>
      )}

      {recent.length > 0 && (
        <div style={{ ...S.card, padding:28 }}>
          <h3 style={{ ...S.heading, fontSize:20, marginBottom:20 }}>Recent Quizzes</h3>
          {recent.map((h,i) => {
            const c = h.questions?.filter(q=>q.isCorrect).length || 0;
            const t = h.questions?.length || 0;
            const p = t ? Math.round(c/t*100) : 0;
            return (
              <div key={i} style={{ display:"flex", alignItems:"center", gap:14, padding:"12px 0", borderBottom: i < recent.length-1 ? `1px solid ${T.creamDk}` : "none" }}>
                <div style={{ width:40, height:40, borderRadius:10, background: p >= 70 ? "#E8F5E9" : p >= 40 ? "#FFF8E1" : "#FFEBEE", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:700, fontSize:14, color: p >= 70 ? T.green : p >= 40 ? T.yellow : T.red }}>
                  {p}%
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontWeight:500, fontSize:14 }}>{c}/{t} correct</div>
                  <div style={{ fontSize:12, color:T.textLt }}>{new Date(h.date).toLocaleDateString()}{h.difficulty ? ` • ${h.difficulty}` : ""}</div>
                </div>
                <div style={{ display:"flex", gap:4, flexWrap:"wrap" }}>
                  {[...new Set(h.questions?.map(q => q.topic))].slice(0,3).map((tag,j) => (
                    <span key={j} style={S.tag}>{tag}</span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {history.length === 0 && (
        <div style={{ ...S.card, padding:48, textAlign:"center" }}>
          <Icon name="chart" size={48} color={T.creamDk} />
          <p style={{ color:T.textLt, marginTop:12 }}>Take your first quiz to see your progress here!</p>
        </div>
      )}
    </div>
  );
}

// ─── Weak Areas Page ─────────────────────────────────────────────────────────
function WeakAreasPage({ history, notes, onStartQuiz }) {
  const missed = getMissedConcepts(history);
  const topics = Object.entries(missed);
  const [loading, setLoading] = useState(false);

  const startRevision = async (topic) => {
    setLoading(true);
    const concepts = missed[topic].slice(-4).map(q => `${topic}: ${q.question}`);
    const quiz = await generateQuiz(notes, "medium", 8, [topic], concepts);
    setLoading(false);
    if (quiz) onStartQuiz({ questions: quiz, mode: "practice", timeLimit: null, difficulty: "medium" });
  };

  if (loading) return (
    <div style={{ padding:"100px 24px 40px", maxWidth:700, margin:"0 auto", textAlign:"center" }}>
      <div style={{ ...S.card, padding:60 }}><Spinner text="Creating revision quiz..." /></div>
    </div>
  );

  return (
    <div style={{ padding:"100px 24px 40px", maxWidth:800, margin:"0 auto" }}>
      <h1 style={{ ...S.heading, fontSize:32, marginBottom:8 }}>Weak Areas</h1>
      <p style={{ color:T.textMd, marginBottom:32 }}>Focus on concepts you've struggled with. Spaced repetition will help reinforce these topics.</p>

      {topics.length === 0 ? (
        <div style={{ ...S.card, padding:48, textAlign:"center" }}>
          <Icon name="star" size={48} color={T.yellow} />
          <p style={{ color:T.textLt, marginTop:12 }}>No weak areas yet — keep taking quizzes!</p>
        </div>
      ) : topics.map(([topic, qs], i) => (
        <div key={i} style={{ ...S.card, padding:24, marginBottom:16 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
            <div>
              <h3 style={{ ...S.heading, fontSize:18 }}>{topic}</h3>
              <span style={{ fontSize:12, color:T.textLt }}>{qs.length} missed question{qs.length > 1 ? "s" : ""}</span>
            </div>
            <button onClick={() => startRevision(topic)} style={S.btnSm()}>
              <Icon name="refresh" size={14} color={T.white} /> Practice
            </button>
          </div>
          {qs.slice(-3).map((q, j) => (
            <div key={j} style={{ padding:"10px 14px", borderRadius:10, background:T.pinkPale, marginBottom:8, fontSize:13 }}>
              <div style={{ fontWeight:500, marginBottom:4, lineHeight:1.5 }}>{q.question}</div>
              <div style={{ color:T.textLt }}>
                Your answer: <span style={{ color:T.red, fontWeight:600 }}>{q.userAnswer}</span> → Correct: <span style={{ color:T.green, fontWeight:600 }}>{q.correct}</span>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

// ─── Flashcards Page ─────────────────────────────────────────────────────────
function FlashcardsPage({ notes }) {
  const [cards, setCards] = useState(null);
  const [loading, setLoading] = useState(false);
  const [current, setCurrent] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState(new Set());

  const generate = async () => {
    if (!notes) return;
    setLoading(true);
    const fc = await generateFlashcards(notes);
    setLoading(false);
    if (fc) { setCards(fc); setCurrent(0); setFlipped(false); setKnown(new Set()); }
  };

  useEffect(() => { if (notes && !cards) generate(); }, [notes]);

  if (!notes) return (
    <div style={{ padding:"100px 24px 40px", maxWidth:600, margin:"0 auto", textAlign:"center" }}>
      <div style={{ ...S.card, padding:48 }}>
        <Icon name="book" size={48} color={T.creamDk} />
        <p style={{ color:T.textLt, marginTop:12 }}>Upload notes first to generate flashcards!</p>
      </div>
    </div>
  );

  if (loading) return (
    <div style={{ padding:"100px 24px 40px", maxWidth:600, margin:"0 auto", textAlign:"center" }}>
      <div style={{ ...S.card, padding:60 }}><Spinner text="Creating flashcards..." /></div>
    </div>
  );

  if (!cards) return (
    <div style={{ padding:"100px 24px 40px", maxWidth:600, margin:"0 auto", textAlign:"center" }}>
      <div style={{ ...S.card, padding:48 }}>
        <p style={{ color:T.textLt, marginBottom:16 }}>Ready to generate flashcards from your notes?</p>
        <button onClick={generate} style={S.btn()}><Icon name="flash" size={16} color={T.white} /> Generate</button>
      </div>
    </div>
  );

  const card = cards[current];
  const remaining = cards.length - known.size;

  return (
    <div style={{ padding:"100px 24px 40px", maxWidth:560, margin:"0 auto" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:24 }}>
        <h1 style={{ ...S.heading, fontSize:28 }}>Flashcards</h1>
        <div style={{ display:"flex", gap:8, alignItems:"center" }}>
          <span style={S.badge(T.creamDk, T.brownMd)}>{remaining} remaining</span>
          <button onClick={generate} style={S.btnSm(T.creamDk, T.brownMd)}><Icon name="refresh" size={14} color={T.brownMd} /></button>
        </div>
      </div>

      <div onClick={() => setFlipped(!flipped)} style={{ ...S.card, padding:0, minHeight:280, cursor:"pointer", overflow:"hidden", perspective:1000, marginBottom:20 }}>
        <div style={{ position:"relative", width:"100%", minHeight:280, display:"flex", alignItems:"center", justifyContent:"center", padding:40, boxSizing:"border-box",
          background: flipped ? `linear-gradient(135deg, ${T.pinkPale}, ${T.creamDk})` : T.white, transition:"all .3s ease" }}>
          <div style={{ textAlign:"center" }}>
            <span style={{ ...S.tag, marginBottom:12, display:"inline-block" }}>{card.topic}</span>
            <div style={{ ...S.heading, fontSize: flipped ? 18 : 22, lineHeight:1.5, color:T.brown }}>
              {flipped ? card.back : card.front}
            </div>
            <p style={{ fontSize:12, color:T.textLt, marginTop:16 }}>{flipped ? "← Tap to see question" : "Tap to reveal answer →"}</p>
          </div>
        </div>
      </div>

      <div style={{ display:"flex", gap:10, justifyContent:"center" }}>
        <button onClick={() => { setCurrent((current - 1 + cards.length) % cards.length); setFlipped(false); }} style={S.btnSm(T.creamDk, T.brownMd)}>
          <Icon name="back" size={16} color={T.brownMd} />
        </button>
        <button onClick={() => { const nk = new Set(known); nk.add(current); setKnown(nk); let next = (current+1)%cards.length; while(nk.has(next) && nk.size < cards.length) next = (next+1)%cards.length; setCurrent(next); setFlipped(false); }}
          style={S.btnSm(T.green, T.white)}>
          <Icon name="check" size={16} color={T.white} /> Got it
        </button>
        <button onClick={() => { setCurrent((current + 1) % cards.length); setFlipped(false); }} style={S.btnSm(T.creamDk, T.brownMd)}>
          <Icon name="arrow" size={16} color={T.brownMd} />
        </button>
      </div>

      <div style={{ textAlign:"center", marginTop:16, fontSize:13, color:T.textLt }}>
        Card {current+1} of {cards.length}
      </div>
    </div>
  );
}

// ─── Main App ────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("home");
  const [notes, setNotes] = useState(() => {
    try { return localStorage.getItem("quizify_notes") || ""; } catch { return ""; }
  });
  const [quizData, setQuizData] = useState(null);
  const [results, setResults] = useState(null);
  const [history, setHistory] = useState(() => {
    try { return JSON.parse(localStorage.getItem("quizify_history")) || []; } catch { return []; }
  });

  useEffect(() => {
    try { localStorage.setItem("quizify_notes", notes); } catch {}
  }, [notes]);

  useEffect(() => {
    try { localStorage.setItem("quizify_history", JSON.stringify(history)); } catch {}
  }, [history]);

  const startQuiz = (data) => { setQuizData(data); setResults(null); setPage("quiz"); };

  const finishQuiz = (res) => {
    setResults(res);
    const entry = { date: new Date().toISOString(), questions: res, difficulty: quizData?.difficulty };
    setHistory(prev => [...prev, entry]);
    setPage("results");
  };

  const streak = getStreak(history);

  return (
    <div style={S.app}>
      <link href={FONTS_LINK} rel="stylesheet" />
      <style>{`
        * { margin:0; padding:0; box-sizing:border-box; }
        body { margin:0; }
        ::selection { background:${T.pinkLt}; color:${T.brown}; }
        input:focus, textarea:focus { border-color:${T.pink} !important; }
        button:hover { opacity:0.92; }
        ::-webkit-scrollbar { width:6px; }
        ::-webkit-scrollbar-thumb { background:${T.brownLt}; border-radius:3px; }
      `}</style>
      <Nav page={page} setPage={setPage} streak={streak} />
      {page === "home" && <HomePage setPage={setPage} history={history} notes={notes} />}
      {page === "upload" && <UploadPage notes={notes} setNotes={setNotes} onStartQuiz={startQuiz} setPage={setPage} history={history} />}
      {page === "quiz" && quizData && <QuizPage quizData={quizData} onFinish={finishQuiz} />}
      {page === "results" && results && <ResultsPage results={results} onRetry={() => setPage("upload")} onHome={() => setPage("home")} notes={notes} onStartQuiz={startQuiz} history={history} />}
      {page === "progress" && <ProgressPage history={history} />}
      {page === "weak" && <WeakAreasPage history={history} notes={notes} onStartQuiz={startQuiz} />}
      {page === "flashcards" && <FlashcardsPage notes={notes} />}
    </div>
  );
}