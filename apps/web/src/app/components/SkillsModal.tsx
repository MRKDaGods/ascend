import React, { useState, useEffect } from "react";

interface SkillsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (newSkills: Skill[]) => void;
}

interface Skill {
  id?: number;
  name: string;
}

const suggestedSkills = [
  "Training", "Presentations", "Customer Service", "Business Operations",
  "Business Management", "Education", "English", "Business"
];

const SkillsModal: React.FC<SkillsModalProps> = ({ isOpen, onClose, onSave }) => {
  const [skillsForm, setSkillsForm] = useState<Skill>({ name: "" });
  const [allSkills, setAllSkills] = useState<Skill[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(true);

  const handleSave = () => {
    if (!skillsForm.name.trim()) return;
    onSave([{ ...skillsForm, id: Date.now() }]);
    setSkillsForm({ name: "" });
    onClose();
  };

  const handleSuggestionClick = (skillName: string) => {
    setSkillsForm({ name: skillName });
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "rgba(0,0,0,0.3)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          width: "550px",
          background: "white",
          borderRadius: "8px",
          padding: "24px",
          boxShadow: "0px 4px 12px rgba(0,0,0,0.15)",
          fontFamily: "Arial, sans-serif",
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ margin: 0, fontSize: "18px", fontWeight: 600 }}>Add skill</h2>
          <button
            onClick={onClose}
            style={{
              fontSize: "22px",
              background: "none",
              border: "none",
              cursor: "pointer",
              lineHeight: 1,
            }}
          >
            ×
          </button>
        </div>

        {/* Input */}
        <label style={{ fontSize: "12px", marginTop: "20px", display: "block", color: "#666" }}>
          Skill*
        </label>
        <input
          type="text"
          value={skillsForm.name}
          onChange={(e) => setSkillsForm({ name: e.target.value })}
          placeholder="Skill (ex: Project Management)"
          style={{
            width: "100%",
            padding: "10px",
            marginTop: "5px",
            fontSize: "14px",
            border: "1px solid #ccc",
            borderRadius: "6px",
            outline: "none",
          }}
        />

        {/* Suggestions */}
        {showSuggestions && (
          <div
            style={{
              marginTop: "20px",
              padding: "16px",
              backgroundColor: "#f3f6f8",
              borderRadius: "8px",
              border: "1px solid #e0e0e0",
              position: "relative",
            }}
          >
            <div style={{ fontSize: "14px", fontWeight: 500, marginBottom: "10px" }}>
              Suggested based on your profile
            </div>
            <button
              onClick={() => setShowSuggestions(false)}
              style={{
                position: "absolute",
                top: "12px",
                right: "12px",
                background: "none",
                border: "none",
                fontSize: "16px",
                cursor: "pointer",
              }}
            >
              ×
            </button>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
              {suggestedSkills.map((skill) => (
                <button
                  key={skill}
                  onClick={() => handleSuggestionClick(skill)}
                  style={{
                    padding: "6px 14px",
                    fontSize: "13px",
                    border: "1px solid #666",
                    borderRadius: "20px",
                    background: "white",
                    cursor: "pointer",
                  }}
                >
                  {skill}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Save Button */}
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "20px" }}>
          <button
            onClick={handleSave}
            style={{
              backgroundColor: "#0a66c2",
              color: "white",
              border: "none",
              padding: "10px 20px",
              fontSize: "14px",
              borderRadius: "20px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default SkillsModal;
