import React, { useState, useEffect } from "react";

interface SkillsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (newSkill: { name: string }) => void;
}

const SkillsModal: React.FC<SkillsModalProps> = ({ isOpen, onClose, onSave }) => {
  const [skill, setSkill] = useState<string>("");
  const [existingSkills, setExistingSkills] = useState<{ name: string }[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetch("http://localhost:3002/skills")
        .then((response) => {
          if (!response.ok) throw new Error("Failed to fetch skills");
          return response.json();
        })
        .then((data) => setExistingSkills(data))
        .catch((error) => setError(error.message));
    }
  }, [isOpen]);

  const handleSave = () => {
    if (!skill.trim()) {
      alert("Skill cannot be empty");
      return;
    }

    fetch("http://localhost:3002/skills", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: skill }),
    })
      .then((response) => {
        if (!response.ok) throw new Error("Failed to save skill");
        return response.json();
      })
      .then((newSkill) => {
        onSave(newSkill);
        setSkill("");
        onClose();
      })
      .catch((error) => setError(error.message));
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
        background: "rgba(0, 0, 0, 0.3)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          background: "white",
          padding: "20px",
          width: "500px",
          borderRadius: "10px",
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h2 style={{ margin: 0, fontSize: "20px" }}>Add a Skill</h2>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              fontSize: "24px",
              cursor: "pointer",
            }}
          >
            ×
          </button>
        </div>

        <label
          style={{
            fontSize: "14px",
            fontWeight: "bold",
            marginTop: "10px",
            display: "block",
          }}
        >
          Skill*
        </label>
        <input
          type="text"
          value={skill}
          onChange={(e) => setSkill(e.target.value)}
          placeholder="Skill (ex: Project Management)"
          style={{
            width: "100%",
            padding: "8px",
            marginTop: "5px",
            border: "1px solid #ccc",
            borderRadius: "5px",
          }}
        />

        {error && (
          <p style={{ color: "red", fontSize: "13px", marginTop: "5px" }}>{error}</p>
        )}

        <div
          style={{
            background: "#f3f2f0",
            padding: "10px",
            marginTop: "10px",
            borderRadius: "5px",
            position: "relative",
          }}
        >
          <strong style={{ display: "block", fontSize: "14px", marginBottom: "5px" }}>
            Consider adding your experience
          </strong>
          <p style={{ fontSize: "13px", margin: 0 }}>
            We recommend adding work experience to your profile, so you can show recruiters how you put your skill to use.
          </p>
          <button
            onClick={() => {}}
            style={{
              position: "absolute",
              top: "5px",
              right: "10px",
              border: "none",
              background: "none",
              fontSize: "18px",
              cursor: "pointer",
            }}
          >
            ×
          </button>
        </div>

        <button
          onClick={handleSave}
          style={{
            background: "#0073b1",
            color: "white",
            padding: "10px 16px",
            border: "none",
            borderRadius: "20px",
            fontSize: "14px",
            fontWeight: "bold",
            cursor: "pointer",
            marginTop: "15px",
          }}
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default SkillsModal;
