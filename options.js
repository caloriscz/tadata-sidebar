document.addEventListener("DOMContentLoaded", () => {
    const saveButton = document.getElementById("save-button");
    const apiUrlInput = document.getElementById("api-url");
  
    saveButton.addEventListener("click", async () => {
      const apiUrl = apiUrlInput.value;
      if (!apiUrl) {
        alert("API URL is required.");
        return;
      }
  
      await browser.storage.local.set({ apiUrl });
      alert("API URL saved!");
    });
  
    (async () => {
      const stored = await browser.storage.local.get("apiUrl");
      if (stored.apiUrl) {
        apiUrlInput.value = stored.apiUrl;
      }
    })();
  });  
