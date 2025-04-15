import React, { useState, useEffect } from "react";

interface SkillsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (newSkills: Skill[]) => void;
}

interface Skill {
  id?: number; // Optional id for each skill
  name: string;
}

const SkillsModal: React.FC<SkillsModalProps> = ({ isOpen, onClose, onSave }) => {
  const [skillsForm, setSkillsForm] = useState<Skill[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetch("http://localhost:3002/skills")
        .then((response) => {
          if (!response.ok) throw new Error("Failed to fetch skills");
          return response.json();
        })
        .then((data: Skill[]) => setSkillsForm(data))
        .catch((error) => setError(error.message));
    }
  }, [isOpen]);

  const handleAddSkill = () => {
    const newSkill: Skill = { name: "" };
    setSkillsForm([...skillsForm, newSkill]);
  };

  const handleUpdateSkill = (index: number, value: string) => {
    const updatedSkills = [...skillsForm];
    updatedSkills[index].name = value;
    setSkillsForm(updatedSkills);
  };

  const handleRemoveSkill = (index: number) => {
    const updatedSkills = [...skillsForm];
    updatedSkills.splice(index, 1);
    setSkillsForm(updatedSkills);
  };

  const handleSave = () => {
    if (skillsForm.some((skill) => !skill.name.trim())) {
      alert("All skills must have a name.");
      return;
    }

    onSave(skillsForm.map((skill, index) => ({ ...skill, id: skill.id || index + 1 }))); // Ensure each skill has an id
    setSkillsForm([]);
    onClose();
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
      id="skills-modal-overlay"
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
        id="skills-modal"
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h2 style={{ margin: 0, fontSize: "20px" }} id="skills-modal-title">
            Manage Skills
          </h2>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              fontSize: "24px",
              cursor: "pointer",
            }}
            id="skills-modal-close-button"
          >
            ×
          </button>
        </div>

        {error && (
          <p
            style={{ color: "red", fontSize: "13px", marginTop: "5px" }}
            id="skills-modal-error"
          >
            {error}
          </p>
        )}

        <div id="skills-list">
          {skillsForm.map((skill, index) => (
            <div
              key={index}
              style={{
                marginBottom: "10px",
                padding: "10px",
                border: "1px solid #eee",
                display: "flex",
                alignItems: "center",
              }}
              id={`skill-item-${index}`}
            >
              <input
                type="text"
                id={`skill-input-${index}`}
                value={skill.name}
                onChange={(e) => handleUpdateSkill(index, e.target.value)}
                placeholder="Skill name"
                style={{ flex: 1, padding: "8px", marginRight: "10px" }}
              />
              <button
                onClick={() => handleRemoveSkill(index)}
                style={{
                  color: "red",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
                id={`remove-skill-button-${index}`}
              >
                Remove
              </button>
            </div>
          ))}

          <button
            onClick={handleAddSkill}
            style={{
              padding: "8px 15px",
              background: "#4CAF50",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              marginTop: "10px",
            }}
            id="add-skill-button"
          >
            Add Skill
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
          id="save-skills-button"
        >
          Save All
        </button>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [isSkillsOpen, setIsSkillsOpen] = useState(false);

  return (
    <div>
      <button
        className="add-skills-button"
        onClick={() => setIsSkillsOpen(true)}
        id="open-skills-modal-button"
      >
        Add skills
      </button>
      <SkillsModal
        isOpen={isSkillsOpen}
        onClose={() => setIsSkillsOpen(false)}
        onSave={(skills) => console.log("Saved skills:", skills)}
      />
    </div>
  );
};

export default SkillsModal;