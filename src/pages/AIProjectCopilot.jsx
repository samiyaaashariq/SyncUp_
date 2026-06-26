const generateProject = async (isRefine = false) => {
    const currentIdea = isRefine ? (generatedProject?.idea || idea) : idea;
    if (!currentIdea.trim()) {
      alert("Please enter an idea first!");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ 
              parts: [{ 
                text: improvedPrompt(currentIdea, isRefine ? refinePrompt : "") 
              }] 
            }],
            generationConfig: { temperature: 0.8, maxOutputTokens: 1000 },
          })
        }
      );

      const data = await res.json();

      if (data.error) {
        throw new Error(data.error.message || "API Error");
      }

      const aiText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!aiText) {
        throw new Error("AI returned empty response");
      }

      const newProject = {
        title: currentIdea.slice(0, 65) + (currentIdea.length > 65 ? "..." : ""),
        fullBrief: aiText,
        idea: currentIdea,
        createdBy: auth.currentUser?.email,
        members: [auth.currentUser?.uid],
        status: "planning",
        aiGenerated: true,
      };

      setGeneratedProject(newProject);
      setTimeout(() => document.getElementById("result-section")?.scrollIntoView({ behavior: "smooth" }), 100);
    } catch (err) {
      console.error("Full Error:", err);
      alert(`Generation failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };
