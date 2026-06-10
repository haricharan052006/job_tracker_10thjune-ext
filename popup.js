chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const activeTab = tabs ? tabs[0] : null;
    
    let detectedRole = "Software Engineer";
    let detectedCompany = "Unknown Company";

    // Guard clause: If activeTab or its title isn't ready, skip parsing and use defaults
    if (activeTab && activeTab.title) {
        const pageTitle = activeTab.title;
        // 1. Internshala Format Check
        if (pageTitle.includes(" at ") && pageTitle.includes("|")) {
            const primaryPart = pageTitle.split("|")[0].trim();
            const parts = primaryPart.split(" at ");
            detectedRole = parts[0].trim();
            detectedCompany = parts[1].trim();
        }
        // 2. LinkedIn Format Check
        else if (pageTitle.includes(" at ")) {
            const parts = pageTitle.split(" at ");
            detectedRole = parts[0].trim();
            detectedCompany = parts[1].split("|")[0].split("-")[0].trim();
        } 
        else if (pageTitle.includes(" hiring ")) {
            const parts = pageTitle.split(" hiring ");
            detectedCompany = parts[0].trim();
            detectedRole = parts[1].split("|")[0].split("-")[0].trim();
        }
        // 3. Fallback Layout
        else {
            detectedRole = pageTitle.split("|")[0].split("-")[0].trim();
        }
    }
    // Instantly pre-fill your HTML input boxes
    document.getElementById("company").value = detectedCompany;
    document.getElementById("role").value = detectedRole;
});
// Fire POST request to your local Next.js server app
document.getElementById("saveBtn").addEventListener("click", async () => {
    const company = document.getElementById("company").value;
    const role = document.getElementById("role").value;
    const statusDiv = document.getElementById("status");
    statusDiv.innerText = "Saving to cloud...";
    try {
        const response = await fetch("http://127.0.0.1:3000/api/jobs/extension", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ company, role })
        });
        const data = await response.json();
        if (data.success) {
            statusDiv.style.color = "#4ade80";
            statusDiv.innerText = "Logged Successfully! 🎉";
        } else {
            statusDiv.style.color = "#f87171";
            statusDiv.innerText = "Server configuration error.";
        }
    } catch (err) {
        statusDiv.style.color = "#f87171";
        statusDiv.innerText = "Error connecting to app.";
    }
});