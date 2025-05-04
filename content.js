(function () {
    // Only run on LinkedIn profile pages
    if (!window.location.pathname.startsWith("/in/")) return;

    // Prevent multiple overlays
    if (document.getElementById("linkflirt-overlay")) return;

    // Select name and profile photo using stable selectors
    // const nameElement = document.querySelector("h1");
    const nameElement = document.querySelector('h1[class*="v-align-middle"]');
    const photoElement = document.querySelector('img[width="200"][height="200"][id^="ember"]');

    const name = nameElement ? nameElement.textContent.trim() : "Unknown User";
    const photo = photoElement ? photoElement.src : "";

    // Create the floating overlay
    const overlay = document.createElement("div");
    overlay.id = "linkflirt-overlay";
    overlay.style.position = "fixed";
    overlay.style.bottom = "20px";
    overlay.style.right = "20px";
    overlay.style.width = "250px";
    overlay.style.background = "#fff";
    overlay.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
    overlay.style.borderRadius = "12px";
    overlay.style.padding = "16px";
    overlay.style.zIndex = "9999";
    overlay.style.fontFamily = "Arial, sans-serif";
    overlay.style.textAlign = "center";

    overlay.innerHTML = `
      <img src="${photo}" alt="Profile photo of ${name}" style="width: 80px; height: 80px; border-radius: 50%; object-fit: cover; margin-bottom: 12px;">
      <div style="font-size: 16px; font-weight: bold; margin-bottom: 12px;">${name}</div>
      <button id="flirt-btn" style="margin-right: 8px; background: #ff69b4; color: white; border: none; padding: 8px 12px; border-radius: 8px; cursor: pointer;">
        Flirt 💖
      </button>
      <button id="pass-btn" style="background: #e0e0e0; color: #333; border: none; padding: 8px 12px; border-radius: 8px; cursor: pointer;">
        Pass ❌
      </button>
    `;

    document.body.appendChild(overlay);

    // Create and show toast
    function showToast(message) {
        const toast = document.createElement("div");
        toast.textContent = message;
        toast.style.position = "fixed";
        toast.style.bottom = "100px";
        toast.style.right = "20px";
        toast.style.padding = "10px 16px";
        toast.style.background = "#333";
        toast.style.color = "#fff";
        toast.style.borderRadius = "8px";
        toast.style.zIndex = "10000";
        toast.style.opacity = "0";
        toast.style.transition = "opacity 0.3s ease";

        document.body.appendChild(toast);
        setTimeout(() => {
            toast.style.opacity = "1";
        }, 50);

        setTimeout(() => {
            toast.style.opacity = "0";
            setTimeout(() => toast.remove(), 300);
        }, 2000);
    }

    // Save flirt to chrome.storage.local if it's not already saved
    function saveFlirt(profile) {
        chrome.runtime.sendMessage({ type: "saveFlirt", profile }, (response) => {
            if (response && response.status === "saved") {
                showToast(`You flirted with ${profile.name}!`);
            } else if (response && response.status === "duplicate") {
                showToast(`Already flirted with ${profile.name}`);
            }
        });
    }

    function savePass(name) {
        chrome.runtime.sendMessage({ type: "savePass", name });
    }

    let lastUrl = window.location.href;

    function checkUrlChange() {
        if (window.location.href !== lastUrl) {
            lastUrl = window.location.href;
            chrome.runtime.sendMessage({ type: "urlChanged" });
        }
    }

    // Check for URL changes every 500ms
    setInterval(checkUrlChange, 500);


    function playSound(action) {
        const audio = new Audio();
        if (action === "flirt") {
          audio.src = chrome.runtime.getURL("assets/flirt-sound.mp3");
        } else if (action === "pass") {
          audio.src = chrome.runtime.getURL("assets/pass-sound.mp3");
        }
        audio.volume = 0.6; // Optional
        audio.play().catch((err) => {
          console.error("Audio playback failed:", err);
        });
      }
      


    // Handle flirt
    document.getElementById("flirt-btn").addEventListener("click", () => {
        const profile = {
            name,
            photo,
            timestamp: new Date().toISOString()
        };
        saveFlirt(profile);
        playSound("flirt");
    });

    // Handle pass
    document.getElementById("pass-btn").addEventListener("click", () => {
        savePass(name);
        playSound("pass");
        document.getElementById("linkflirt-overlay").remove();
    });
})();
