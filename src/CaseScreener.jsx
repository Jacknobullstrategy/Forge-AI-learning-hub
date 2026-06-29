import { useState } from "react";

const PRACTICE_AREAS = [
  "Personal Injury", "Employment Law", "Family Law",
  "Criminal Defense", "Immigration", "Real Estate",
  "Intellectual Property", "Contract Dispute", "Other"
];

const SYSTEM_PROMPT = `You are a senior legal case screening assistant at a law firm. Your role is to evaluate potential client cases and provide a structured assessment.

Analyze the case details provided and return a JSON object with this exact structure:
{
  "viabilityScore": <number 0-100>,
  "viabilityLabel": <"Strong" | "Moderate" | "Weak" | "Not Viable">,
  "summary": <2-3 sentence plain-english summary of the case>,
  "keyIssues": [<array of 3-5 key legal issues identified>],
  "strengths": [<array of 2-4 case strengths>],
  "risks": [<array of 2-4 risks or weaknesses>],
  "missingInfo": [<array of 2-4 critical missing information items>],
  "recommendedAction": <"Accept", "Further Investigation", "Refer Out", or "Decline">,
  "actionReason": <1-2 sentence explanation of the recommendation>,
  "urgencyFlags": [<array of any time-sensitive issues like statutes of limitations, or empty array>]
}

Be objective, thorough, and practical. Focus on legal merit, not sympathy. Return ONLY the JSON object, no other text.`;

const ScoreRing = ({ score, label }) => {
  const color = score >= 70 ? "#22c55e" : score >= 40 ? "#f59e0b" : "#ef4444";
  const circumference = 2 * Math.PI * 40;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
      <svg width="100" height="100" style={{ transform: "rotate(-90deg)" }}>
        <circle cx="50" cy="50" r="40" fill="none" stroke="#1e293b" strokeWidth="8" />
        <circle
          cx="50" cy="50" r="40" fill="none"
          stroke={color} strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 1s ease" }}
        />
      </svg>
      <div style={{ marginTop: "-70px", textAlign: "center", zIndex: 1 }}>
        <div style={{ fontSize: "24px", fontWeight: "800", color, fontFamily: "'Playfair Display', serif" }}>{score}</div>
        <div style={{ fontSize: "10px", color: "#94a3b8", letterSpacing: "0.1em", textTransform: "uppercase" }}>viability</div>
      </div>
      <div style={{
        marginTop: "8px",
        padding: "4px 12px",
        background: color + "22",
        border: `1px solid ${color}44`,
        borderRadius: "20px",
        fontSize: "12px",
        fontWeight: "700",
        color,
        letterSpacing: "0.05em"
      }}>{label}</div>
    </div>
  );
};

const Tag = ({ text, type }) => {
  const colors = {
    strength: { bg: "#052e16", border: "#166534", text: "#86efac" },
    risk: { bg: "#2d0a0a", border: "#7f1d1d", text: "#fca5a5" },
    issue: { bg: "#0c1a2e", border: "#1e3a5f", text: "#93c5fd" },
    missing: { bg: "#1c1208", border: "#78350f", text: "#fcd34d" },
    urgent: { bg: "#2d0a2d", border: "#6b21a8", text: "#d8b4fe" },
  };
  const c = colors[type] || colors.issue;
  return (
    <span style={{
      display: "inline-block",
      padding: "4px 10px",
      background: c.bg,
      border: `1px solid ${c.border}`,
      borderRadius: "6px",
      fontSize: "12px",
      color: c.text,
      margin: "3px",
      lineHeight: "1.4"
    }}>{text}</span>
  );
};

const Section = ({ title, items, type, icon }) => {
  if (!items || items.length === 0) return null;
  return (
    <div style={{ marginBottom: "20px" }}>
      <div style={{ fontSize: "11px", fontWeight: "700", color: "#64748b", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "8px" }}>
        {icon} {title}
      </div>
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {items.map((item, i) => <Tag key={i} text={item} type={type} />)}
      </div>
    </div>
  );
};

export default function CaseScreener() {
  const [form, setForm] = useState({
    practiceArea: "",
    jurisdiction: "",
    clientName: "",
    incidentDate: "",
    facts: "",
    damages: "",
    opposingParty: "",
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const update = (field, val) => setForm(prev => ({ ...prev, [field]: val }));

  const handleScreen = async () => {
    if (!form.facts.trim() || !form.practiceArea) {
      setError("Please fill in at least the practice area and case facts.");
      return;
    }
    setError(null);
    setLoading(true);
    setResult(null);

    const userMessage = `
Practice Area: ${form.practiceArea}
Jurisdiction: ${form.jurisdiction || "Not specified"}
Client Name: ${form.clientName || "Confidential"}
Incident/Event Date: ${form.incidentDate || "Not specified"}
Opposing Party: ${form.opposingParty || "Not specified"}
Claimed Damages: ${form.damages || "Not specified"}

Case Facts:
${form.facts}
    `.trim();

    try {
      const response = await fetch("/api/anthropic/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: SYSTEM_PROMPT,
          messages: [{ role: "user", content: userMessage }]
        })
      });

      const data = await response.json();
      const text = data.content?.map(b => b.text || "").join("") || "";
      const clean = text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      setResult(parsed);
    } catch (err) {
      setError("Screening failed. Please check your input and try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%",
    background: "#0f172a",
    border: "1px solid #1e293b",
    borderRadius: "8px",
    color: "#e2e8f0",
    padding: "10px 14px",
    fontSize: "14px",
    fontFamily: "inherit",
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.2s",
  };

  const labelStyle = {
    display: "block",
    fontSize: "11px",
    fontWeight: "700",
    color: "#64748b",
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    marginBottom: "6px",
  };

  const actionColors = {
    "Accept": "#22c55e",
    "Further Investigation": "#f59e0b",
    "Refer Out": "#60a5fa",
    "Decline": "#ef4444",
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#020817",
      fontFamily: "'IBM Plex Mono', 'Courier New', monospace",
      color: "#e2e8f0",
      padding: "40px 20px",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=IBM+Plex+Mono:wght@400;500;700&display=swap');
        input:focus, select:focus, textarea:focus { border-color: #3b82f6 !important; }
        input::placeholder, textarea::placeholder { color: #334155; }
        select option { background: #0f172a; }
        * { box-sizing: border-box; }
      `}</style>

      <div style={{ maxWidth: "760px", margin: "0 auto" }}>

        {/* Header */}
        <div style={{ marginBottom: "40px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
            <div style={{
              width: "36px", height: "36px",
              background: "linear-gradient(135deg, #1e3a5f, #3b82f6)",
              borderRadius: "8px",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "18px"
            }}>⚖️</div>
            <div>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "22px", fontWeight: "800", letterSpacing: "-0.02em" }}>
                Case Screener
              </div>
              <div style={{ fontSize: "11px", color: "#475569", letterSpacing: "0.1em" }}>AI-POWERED INTAKE ASSESSMENT</div>
            </div>
          </div>
          <div style={{ height: "1px", background: "linear-gradient(90deg, #1e3a5f, transparent)", marginTop: "16px" }} />
        </div>

        {/* Form */}
        <div style={{
          background: "#0a1628",
          border: "1px solid #1e293b",
          borderRadius: "12px",
          padding: "28px",
          marginBottom: "24px"
        }}>
          <div style={{ fontSize: "12px", fontWeight: "700", color: "#3b82f6", letterSpacing: "0.1em", marginBottom: "20px" }}>
            INTAKE FORM
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
            <div>
              <label style={labelStyle}>Practice Area *</label>
              <select style={inputStyle} value={form.practiceArea} onChange={e => update("practiceArea", e.target.value)}>
                <option value="">Select area...</option>
                {PRACTICE_AREAS.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Jurisdiction</label>
              <input style={inputStyle} placeholder="e.g. California, Federal" value={form.jurisdiction} onChange={e => update("jurisdiction", e.target.value)} />
            </div>
            <div>
              <label style={labelStyle}>Client Name</label>
              <input style={inputStyle} placeholder="Optional" value={form.clientName} onChange={e => update("clientName", e.target.value)} />
            </div>
            <div>
              <label style={labelStyle}>Incident Date</label>
              <input style={{ ...inputStyle, colorScheme: "dark" }} type="date" value={form.incidentDate} onChange={e => update("incidentDate", e.target.value)} />
            </div>
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label style={labelStyle}>Opposing Party</label>
            <input style={inputStyle} placeholder="Person, company, or entity" value={form.opposingParty} onChange={e => update("opposingParty", e.target.value)} />
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label style={labelStyle}>Claimed Damages / Relief Sought</label>
            <input style={inputStyle} placeholder="e.g. $250,000 medical bills, lost wages, injunctive relief" value={form.damages} onChange={e => update("damages", e.target.value)} />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={labelStyle}>Case Facts *</label>
            <textarea
              style={{ ...inputStyle, minHeight: "140px", resize: "vertical", lineHeight: "1.6" }}
              placeholder="Describe the key facts: what happened, when, who was involved, what harm occurred, any prior legal action..."
              value={form.facts}
              onChange={e => update("facts", e.target.value)}
            />
          </div>

          {error && (
            <div style={{ background: "#2d0a0a", border: "1px solid #7f1d1d", borderRadius: "8px", padding: "10px 14px", color: "#fca5a5", fontSize: "13px", marginBottom: "16px" }}>
              {error}
            </div>
          )}

          <button
            onClick={handleScreen}
            disabled={loading}
            style={{
              width: "100%",
              padding: "14px",
              background: loading ? "#1e293b" : "linear-gradient(135deg, #1e3a5f, #2563eb)",
              border: "none",
              borderRadius: "8px",
              color: loading ? "#475569" : "#fff",
              fontSize: "13px",
              fontWeight: "700",
              letterSpacing: "0.1em",
              cursor: loading ? "not-allowed" : "pointer",
              fontFamily: "inherit",
              transition: "all 0.2s",
            }}
          >
            {loading ? "⟳  ANALYZING CASE..." : "⚖  RUN CASE SCREEN"}
          </button>
        </div>

        {/* Results */}
        {result && (
          <div style={{
            background: "#0a1628",
            border: "1px solid #1e3a5f",
            borderRadius: "12px",
            padding: "28px",
            animation: "fadeIn 0.4s ease"
          }}>
            <style>{`@keyframes fadeIn { from { opacity:0; transform:translateY(8px) } to { opacity:1; transform:translateY(0) } }`}</style>

            <div style={{ fontSize: "12px", fontWeight: "700", color: "#3b82f6", letterSpacing: "0.1em", marginBottom: "24px" }}>
              SCREENING REPORT
            </div>

            {/* Score + Action */}
            <div style={{ display: "flex", alignItems: "center", gap: "32px", marginBottom: "28px", padding: "20px", background: "#060e1f", borderRadius: "10px", border: "1px solid #1e293b" }}>
              <ScoreRing score={result.viabilityScore} label={result.viabilityLabel} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "11px", color: "#475569", letterSpacing: "0.1em", marginBottom: "6px" }}>RECOMMENDED ACTION</div>
                <div style={{
                  fontSize: "20px",
                  fontWeight: "800",
                  fontFamily: "'Playfair Display', serif",
                  color: actionColors[result.recommendedAction] || "#e2e8f0",
                  marginBottom: "8px"
                }}>{result.recommendedAction}</div>
                <div style={{ fontSize: "13px", color: "#94a3b8", lineHeight: "1.6" }}>{result.actionReason}</div>
              </div>
            </div>

            {/* Summary */}
            <div style={{ marginBottom: "24px", padding: "16px", background: "#0c1a2e", borderRadius: "8px", borderLeft: "3px solid #3b82f6" }}>
              <div style={{ fontSize: "11px", color: "#3b82f6", fontWeight: "700", letterSpacing: "0.1em", marginBottom: "8px" }}>SUMMARY</div>
              <div style={{ fontSize: "13px", color: "#cbd5e1", lineHeight: "1.7" }}>{result.summary}</div>
            </div>

            {/* Urgency flags */}
            {result.urgencyFlags && result.urgencyFlags.length > 0 && (
              <div style={{ marginBottom: "20px", padding: "14px", background: "#1a0a2e", borderRadius: "8px", border: "1px solid #6b21a8" }}>
                <div style={{ fontSize: "11px", color: "#d8b4fe", fontWeight: "700", letterSpacing: "0.1em", marginBottom: "8px" }}>⚠ URGENCY FLAGS</div>
                <div style={{ display: "flex", flexWrap: "wrap" }}>
                  {result.urgencyFlags.map((f, i) => <Tag key={i} text={f} type="urgent" />)}
                </div>
              </div>
            )}

            <Section title="Key Legal Issues" items={result.keyIssues} type="issue" icon="§" />
            <Section title="Strengths" items={result.strengths} type="strength" icon="↑" />
            <Section title="Risks & Weaknesses" items={result.risks} type="risk" icon="↓" />
            <Section title="Missing Information Needed" items={result.missingInfo} type="missing" icon="?" />

            <div style={{ marginTop: "20px", paddingTop: "16px", borderTop: "1px solid #1e293b", fontSize: "11px", color: "#334155", lineHeight: "1.6" }}>
              This screening is AI-generated and for informational purposes only. It does not constitute legal advice and should be reviewed by a licensed attorney before any action is taken.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
