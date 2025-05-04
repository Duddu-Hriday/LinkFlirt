// Listen for the message to refresh data
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "urlChanged") {
    renderMatches(); // Re-render the matches list when the URL changes
  }
});

// Function to render the list of flirted profiles
function renderMatches() {
  const matchesList = document.getElementById("matches-list");
  matchesList.innerHTML = ''; // Clear previous content

  // Retrieve the flirted profiles from chrome.storage.local
  chrome.storage.local.get("flirts", (data) => {
    const flirts = data.flirts || [];

    if (flirts.length === 0) {
      matchesList.innerHTML = "<p>No matches yet!</p>";
    } else {
      // Loop through the list of flirted profiles and create card-like elements
      flirts.forEach((profile) => {
        const matchCard = document.createElement("div");
        matchCard.classList.add("match-card");

        matchCard.innerHTML = `
          <img src="${profile.photo}" alt="Profile photo" />
          <span>${profile.name}</span>
        `;

        matchesList.appendChild(matchCard);
      });
    }
  });
}

// When popup is opened, render the matches list
document.addEventListener("DOMContentLoaded", renderMatches);

// // Function to render the list of flirted profiles
// function renderMatches() {
//   const matchesList = document.getElementById("matches-list");
//   matchesList.innerHTML = ''; // Clear previous content

//   // Retrieve the flirted profiles from chrome.storage.local
//   chrome.storage.local.get("flirts", (data) => {
//     const flirts = data.flirts || [];

//     if (flirts.length === 0) {
//       matchesList.innerHTML = "<p>No matches yet!</p>";
//     } else {
//       // Loop through the list of flirted profiles and create card-like elements
//       flirts.forEach((profile) => {
//         const matchCard = document.createElement("div");
//         matchCard.classList.add("match-card");

//         matchCard.innerHTML = `
//           <img src="${profile.photo}" alt="Profile photo" />
//           <span>${profile.name}</span>
//         `;

//         matchesList.appendChild(matchCard);
//       });
//     }
//   });
// }

// Function to clear all stored matches
function clearMatches() {
  chrome.storage.local.remove("flirts", () => {
    console.log("All matches cleared.");
    renderMatches(); // Re-render matches after clearing
  });
}

// Event listener for the "Clear All Matches" button
document.getElementById("clearMatchesBtn").addEventListener("click", clearMatches);

// When popup is opened, render the matches list
document.addEventListener("DOMContentLoaded", renderMatches);
