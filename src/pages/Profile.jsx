import { useState } from "react";

export default function Profile() {
  const [name, setName] = useState("");
  const [skills, setSkills] = useState("");

  const saveProfile = () => {
    const profile = {

    name,

    skills: skills.split(",").map(s => s.trim().toLowerCase())

  };

  localStorage.setItem("syncup_profile", JSON.stringify(profile));

    alert("Profile saved 🚀");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Profile 👤</h1>

      <input
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <br /><br />

      <input
        placeholder="Skills"
        value={skills}
        onChange={(e) => setSkills(e.target.value)}
      />

      <br /><br />

      <button onClick={saveProfile}>
        Save Profile
      </button>
    </div>
  );
}