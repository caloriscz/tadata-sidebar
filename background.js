browser.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === "save-selection") {
    const selectedText = info.selectionText;
    if (selectedText) {
      const url = await browser.storage.local.get("apiUrl");
      const token = await browser.storage.local.get("jwtToken");
      if (url.apiUrl && token.jwtToken) {
        const response = await fetch(`${url.apiUrl}/Snippets`, {
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
            content: selectedText
          })
        });
        const result = await response.json();
        if (response.ok) {
          alert(`Text saved successfully! Link: ${url.apiUrl}/Snippets/${result}`);
        } else {
          alert("Failed to save text.");
        }
      } else {
        alert("Please log in to use this feature.");
      }
    }
  }
});
