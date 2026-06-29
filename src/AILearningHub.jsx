import React, { useState, useEffect } from "react";
import { useAuth } from "./hooks/useAuth.js";
import api from "./services/api.js";
import "./AILearningHub.css";

function AILearningHub() {
  const { user, updateProfile } = useAuth();
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("prompts");
  const [searchQuery, setSearchQuery] = useState("");
  const [roles, setRoles] = useState([]);
  const [industries, setIndustries] = useState([]);
  const [departments, setDepartments] = useState([]);

  // Load options and profile
  useEffect(() => {
    const loadOptions = async () => {
      try {
        const response = await api.getProfileOptions();
        if (response.data) {
          setRoles(response.data.roles || []);
          setIndustries(response.data.industries || []);
          setDepartments(response.data.departments || []);
        }
      } catch (error) {
        console.error("Failed to load options:", error);
      }
    };
    loadOptions();
  }, []);

  // Load content based on user profile and filters
  useEffect(() => {
    const loadContent = async () => {
      if (!user?.profile) return;

      setLoading(true);
      try {
        let response;
        if (searchQuery) {
          response = await api.searchContent(searchQuery);
        } else {
          const filters = {
            type: activeTab === "prompts" ? "prompt" : activeTab === "tutorials" ? "tutorial" : "caseStudy",
            role: user.profile.role,
            industry: user.profile.industry,
          };
          response = await api.listContent(filters);
        }
        setContent(response.data || []);
      } catch (error) {
        console.error("Failed to load content:", error);
        setContent([]);
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, [user?.profile, activeTab, searchQuery]);

  const handleChangeProfile = () => {
    // Show profile selector
    // For now, just reload - could be a modal
    updateProfile(user.profile.role, user.profile.industry, user.profile.department);
  };

  if (!user?.profile) {
    return (
      <RoleSelector
        roles={roles}
        industries={industries}
        departments={departments}
        onSave={updateProfile}
      />
    );
  }

  return (
    <div className="ai-learning-hub">
      <header className="hub-header">
        <div className="header-content">
          <div>
            <h1>AI for Work</h1>
            <p className="subtitle">
              {user.profile.role} • {user.profile.industry}
            </p>
          </div>
          <button className="btn-secondary" onClick={handleChangeProfile}>
            Change Role
          </button>
        </div>
      </header>

      <div className="hub-container">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search prompts, tutorials, case studies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="tabs">
          <button
            className={`tab ${activeTab === "prompts" ? "active" : ""}`}
            onClick={() => setActiveTab("prompts")}
          >
            Prompts
          </button>
          <button
            className={`tab ${activeTab === "tutorials" ? "active" : ""}`}
            onClick={() => setActiveTab("tutorials")}
          >
            Tutorials
          </button>
          <button
            className={`tab ${activeTab === "cases" ? "active" : ""}`}
            onClick={() => setActiveTab("cases")}
          >
            Case Studies
          </button>
        </div>

        {loading ? (
          <div className="loading">Loading content...</div>
        ) : (
          <div className="content-grid">
            {content.length === 0 ? (
              <div className="empty-state">
                <p>No content found for your search.</p>
              </div>
            ) : (
              content.map((item) => (
                <ContentCard key={item.id} item={item} type={activeTab} />
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function RoleSelector({ roles, industries, departments, onSave }) {
  const [selections, setSelections] = useState({
    role: roles[0] || "",
    industry: industries[0] || "",
    department: departments[0] || "",
  });

  const handleNext = () => {
    if (selections.role && selections.industry && selections.department) {
      onSave(selections.role, selections.industry, selections.department);
    }
  };

  return (
    <div className="role-selector">
      <div className="selector-card">
        <h2>AI for Work</h2>
        <p className="selector-subtitle">Select your role to get started</p>

        <div className="selector-form">
          <div className="form-group">
            <label>Your Role</label>
            <div className="options-grid">
              {roles.map((role) => (
                <button
                  key={role}
                  className={`option ${selections.role === role ? "selected" : ""}`}
                  onClick={() =>
                    setSelections({ ...selections, role })
                  }
                >
                  {role}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Your Industry</label>
            <div className="options-grid">
              {industries.map((ind) => (
                <button
                  key={ind}
                  className={`option ${selections.industry === ind ? "selected" : ""}`}
                  onClick={() =>
                    setSelections({ ...selections, industry: ind })
                  }
                >
                  {ind}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Your Department</label>
            <div className="options-grid">
              {departments.map((dept) => (
                <button
                  key={dept}
                  className={`option ${selections.department === dept ? "selected" : ""}`}
                  onClick={() =>
                    setSelections({ ...selections, department: dept })
                  }
                >
                  {dept}
                </button>
              ))}
            </div>
          </div>

          <button
            className="btn-primary"
            onClick={handleNext}
            disabled={!selections.role || !selections.industry || !selections.department}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}

function ContentCard({ item }) {
  const [showDetail, setShowDetail] = useState(false);

  if (showDetail) {
    return <ContentDetail item={item} onBack={() => setShowDetail(false)} />;
  }

  return (
    <div
      className="content-card"
      onClick={() => setShowDetail(true)}
    >
      <div className="card-header">
        <h3>{item.title}</h3>
        <span className="difficulty">{item.difficulty || "beginner"}</span>
      </div>
      <p className="card-description">{item.description}</p>
      <div className="card-footer">
        <span className="time">
          {item.estimated_time || "5 min"}
        </span>
        {item.tags && item.tags[0] && <span className="tag">{item.tags[0]}</span>}
      </div>
    </div>
  );
}

function ContentDetail({ item, onBack }) {
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const checkSaved = async () => {
      try {
        const response = await api.isSaved(item.id);
        setSaved(response.data?.saved || false);
      } catch (error) {
        console.error("Failed to check saved status:", error);
      }
    };
    checkSaved();
  }, [item.id]);

  const handleCopy = async () => {
    if (item.content?.prompt) {
      navigator.clipboard.writeText(item.content.prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSave = async () => {
    try {
      if (saved) {
        await api.unsaveContent(item.id);
      } else {
        await api.saveContent(item.id);
      }
      setSaved(!saved);
    } catch (error) {
      console.error("Failed to save:", error);
    }
  };

  return (
    <div className="content-detail-overlay">
      <div className="detail-card">
        <button className="close-btn" onClick={onBack}>
          ✕
        </button>

        <div className="detail-header">
          <h2>{item.title}</h2>
          <p className="detail-meta">
            {item.estimated_time} •{" "}
            {item.difficulty ? item.difficulty.charAt(0).toUpperCase() + item.difficulty.slice(1) : "Beginner"}
          </p>
        </div>

        {item.type === "prompt" && (
          <div className="detail-content">
            <p className="description">{item.description}</p>

            {item.content?.prompt && (
              <div className="prompt-box">
                <pre>{item.content.prompt}</pre>
              </div>
            )}

            {item.content?.tips && (
              <div className="tips-box">
                <strong>💡 Pro tip:</strong> {item.content.tips}
              </div>
            )}

            <div className="detail-actions">
              <button
                className="btn-primary"
                onClick={handleCopy}
              >
                {copied ? "Copied!" : "Copy Prompt"}
              </button>
              <button className="btn-secondary" onClick={handleSave}>
                {saved ? "Unsave" : "Save for later"}
              </button>
            </div>
          </div>
        )}

        {item.type === "tutorial" && (
          <div className="detail-content">
            <div className="steps">
              {item.content?.steps?.map((step, idx) => (
                <div key={idx} className="step">
                  <div className="step-number">{idx + 1}</div>
                  <div>
                    <h4>{step.title}</h4>
                    <p>{step.content}</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="btn-primary">Start Tutorial</button>
          </div>
        )}

        {item.type === "caseStudy" && (
          <div className="detail-content">
            <div className="case-section">
              <h4>Challenge</h4>
              <p>{item.content?.challenge}</p>
            </div>
            <div className="case-section">
              <h4>Solution</h4>
              <p>{item.content?.solution}</p>
            </div>
            <div className="case-section">
              <h4>Results</h4>
              <p className="results-highlight">{item.content?.results}</p>
            </div>
            <div className="case-section">
              <h4>Key Takeaway</h4>
              <p>{item.content?.keyTakeaway}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AILearningHub;
