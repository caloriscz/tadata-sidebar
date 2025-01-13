document.addEventListener("DOMContentLoaded", () => {
  const loginButton = document.getElementById("login-button");
  const logoutButton = document.getElementById("logout-button");
  const saveSnippetButton = document.getElementById("save-snippet-button");

  if (loginButton) {
    loginButton.addEventListener("click", async () => {
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
      const apiUrl = await browser.storage.local.get("apiUrl");

      if (apiUrl.apiUrl) {
        try {
          const response = await fetch(`${apiUrl.apiUrl}/Accounts/authenticate`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
          });

          const result = await response.json();
          if (response.ok && result.jwtToken) {
            await browser.storage.local.set({
              jwtToken: result.jwtToken,
              userInfo: { firstName: result.firstName, lastName: result.lastName }
            });

            document.getElementById("login-form").style.display = "none";
            document.getElementById("user-info").style.display = "block";
            document.getElementById("welcome-message").textContent = `Welcome, ${result.firstName} ${result.lastName}`;
          } else {
            alert("Login failed: " + (result.errorMessage || "Unknown error"));
          }
        } catch (error) {
          console.error("Error during login:", error);
          alert("An error occurred. Check the console for details.");
        }
      } else {
        alert("Please configure the API URL first.");
      }
    });
  }

  if (saveSnippetButton) {
    saveSnippetButton.addEventListener("click", async () => {
      const snippetContent = document.getElementById("snippet-content").value;
      if (!snippetContent.trim()) {
        alert("Snippet content cannot be empty.");
        return;
      }

      const apiUrl = await browser.storage.local.get("apiUrl");
      const token = await browser.storage.local.get("jwtToken");

      if (apiUrl.apiUrl && token.jwtToken) {
        try {
          const response = await fetch(`${apiUrl.apiUrl}/Snippets`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token.jwtToken}`
            },
            body: JSON.stringify({
              title: "Saved Snippet",
              elementsSyntaxCode: "",
              slug: "",
              published: true,
              content: snippetContent
            })
          });

          const result = await response.json();
          if (response.ok) {
            const linkElement = document.getElementById("snippet-link");
            linkElement.style.display = "block";
            linkElement.textContent = `Snippet saved! Link: ${apiUrl.apiUrl}/Snippets/${result}`;
            alert("Snippet saved successfully!");
          } else {
            alert("Failed to save snippet.");
          }
        } catch (error) {
          console.error("Error saving snippet:", error);
          alert("An error occurred while saving the snippet.");
        }
      } else {
        alert("Please log in to save snippets.");
      }
    });
  }

  if (logoutButton) {
    logoutButton.addEventListener("click", async () => {
      await browser.storage.local.remove(["jwtToken", "userInfo"]);
      document.getElementById("login-form").style.display = "block";
      document.getElementById("user-info").style.display = "none";
    });
  }

  // Initial setup
  (async () => {
    const token = await browser.storage.local.get("jwtToken");
    const userInfo = await browser.storage.local.get("userInfo");

    if (token.jwtToken && userInfo.userInfo) {
      document.getElementById("login-form").style.display = "none";
      document.getElementById("user-info").style.display = "block";
      document.getElementById("welcome-message").textContent = `Welcome, ${userInfo.userInfo.firstName} ${userInfo.userInfo.lastName}`;
    }
  })();
});
