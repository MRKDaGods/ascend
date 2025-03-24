import React, { useState, useEffect } from "react";
import "./SkillsModal.css";

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
          if (!response.ok) {
            throw new Error("Failed to fetch skills");
          }
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
        if (!response.ok) {
          throw new Error("Failed to save skill");
        }
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
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Add a Skill</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <label>Skill*</label>
        <input
          type="text"
          value={skill}
          onChange={(e) => setSkill(e.target.value)}
          placeholder="Skill (ex: Project Management)"
        />

        {error && <p className="error-message">{error}</p>}

        <div className="suggestion-box">
          <strong>Consider adding your experience</strong>
          <p>
            We recommend adding work experience to your profile, so you can show recruiters how you put your skill to use.
          </p>
          <button className="close-suggestion">×</button>
        </div>

        <button className="save-button" onClick={handleSave}>Save</button>
      </div>
    </div>
  );
};

export default SkillsModal;