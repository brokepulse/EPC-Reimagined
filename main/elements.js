const elements = {
  // Information label container
  informationLabelContainer: function (informationLabels) {
    const element = document.createElement('div');
    element.classList.add('informationLabelContainer');
    informationLabels.forEach(label => element.appendChild(label));
    return element;
  },

  // Information label with optional click and context menu actions
  informationLabel: function (key, value, onClick = null, classList = null, onContextMenu = null) {
    const element = document.createElement('div');
    element.classList.add('informationLabel');
    const keyEl = document.createElement('div');
    keyEl.classList.add('key');
    keyEl.innerHTML = key;
    const valueEl = document.createElement('div');
    valueEl.classList.add('value');
    valueEl.innerHTML = value;
    element.appendChild(keyEl);
    element.appendChild(valueEl);
    if (onClick) {
      element.classList.add('informationLabelWithOnClick');
      element.addEventListener('click', onClick);
    }
    if (onContextMenu) {
      element.classList.add('informationLabelWithOnClick');
      element.addEventListener('contextmenu', onContextMenu);
    }
    classList?.forEach(classItem => element.classList.add(classItem));
    return element;
  },

  // New window with focus and drag functionality
  newWindow: function (url, size, offset) {
    const el = document.createElement('div');
    el.classList.add('newWindow');
    el.style.width = `${size[0]}px`;
    el.style.height = `${size[1]}px`;
    el.style.left = `${offset[0]}px`;
    el.style.top = `${offset[1]}px`;
    
    const focusWindow = () => {
      document.querySelectorAll('.overlay .windows *').forEach(win => win.style.zIndex = '');
      el.style.zIndex = '3';
    };
    el.addEventListener('mousedown', focusWindow);
    
    const iframe = document.createElement('iframe');
    iframe.src = url;
    const header = document.createElement('div');
    header.classList.add('windowHeader');
    
    let x, y;
    header.addEventListener('mousedown', function (e) {
      e.preventDefault();
      x = e.clientX - el.offsetLeft;
      y = e.clientY - el.offsetTop;
      document.onmouseup = () => (document.onmouseup = document.onmousemove = null);
      document.onmousemove = function (e) {
        if (e.clientX < 0 || e.clientY < 0 || e.clientX > window.innerWidth || e.clientY > window.innerHeight) document.onmouseup();
        el.style.left = `${e.clientX - x}px`;
        el.style.top = `${e.clientY - y}px`;
      };
    });
    
    const title = document.createElement('div');
    title.classList.add('title');
    iframe.addEventListener('load', function () {
      title.innerHTML = iframe.contentDocument.title;
      new MutationObserver(() => title.innerHTML = iframe.contentDocument.title)
        .observe(iframe.contentDocument.querySelector('title'), { childList: true });
      iframe.contentDocument.body.addEventListener('mousedown', focusWindow);
    });

    const close = document.createElement('div');
    close.classList.add('close');
    close.innerHTML = '&#10006;';
    close.addEventListener('click', () => el.remove());
    
    header.appendChild(title);
    header.appendChild(close);
    el.appendChild(header);
    el.appendChild(iframe);
    focusWindow();
    return el;
  }
};

// Time display function
function updateTime() {
  const timeDisplay = document.getElementById("timeDisplay");
  const now = new Date();
  timeDisplay.textContent = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
}

// Initial time setup and interval update
setInterval(updateTime, 1000);
updateTime();

// Local storage functions for user data
function readData() {
  return JSON.parse(localStorage.getItem("users")) || {};
}
function writeData(data) {
  localStorage.setItem("users", JSON.stringify(data));
}

// Profile creation function
function createProfile() {
  const users = readData();
  const username = document.getElementById("new-username").value.trim();
  const password = document.getElementById("new-password").value.trim();
  const characterName = document.getElementById("character-name").value.trim();
  const badgeNumber = document.getElementById("badge-number").value.trim();

  if (!username || !password || !characterName || !badgeNumber) {
    showError("All fields are required to create a profile.");
    return;
  }
  if (users[username]) {
    showError("Username already exists! Please choose another.");
    return;
  }

  users[username] = { password, characterName, badgeNumber };
  writeData(users);
  alert("Profile created successfully! You can now log in.");
  document.getElementById("new-username").value = "";
  document.getElementById("new-password").value = "";
  document.getElementById("character-name").value = "";
  document.getElementById("badge-number").value = "";
  showLogin();
}

// Login function
function login() {
  const users = readData();
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  if (users[username] && users[username].password === password) {
    localStorage.setItem("currentUser", username);
    localStorage.setItem("lastPage", "welcome"); // Set default page on login
    checkSession(); // Run session check to navigate to welcome page
  } else {
    showError("Invalid username or password!");
  }
  document.getElementById("username").value = "";
  document.getElementById("password").value = "";
}

// Logout function
function logout() {
  localStorage.removeItem("currentUser");
  localStorage.removeItem("lastPage"); // Clear lastPage on logout
  document.getElementById("login-screen").style.display = "block";
  document.getElementById("main-content").style.display = "none";
  document.getElementById("user-info").textContent = "";
  navigateToPage("login-screen"); // Navigate to login screen
}

// Main content display on login
function displayMainContent(characterName, badgeNumber) {
  hideError();
  document.getElementById("login-screen").style.display = "none";
  document.getElementById("main-content").style.display = "block";
  document.getElementById("user-info").textContent = `Logged in as #${badgeNumber}`;
  document.getElementById("user-name").textContent = `${characterName}`;
  document.getElementById("user-badge").textContent = `#${badgeNumber}`;
  hideAllOtherScreens();
  document.addEventListener('DOMContentLoaded', () => {
    goToPage('welcome'); // This will trigger rendering of shift data on the welcome page
  });
  
}

// Hide all screens
function hideAllOtherScreens() {
  document.querySelectorAll(".content > div").forEach(page => page.classList.add("hidden"));
}


// Error display functions
function showError(message) {
  const errorBox = document.getElementById('errorBox');
  errorBox.innerText = message;
  errorBox.classList.remove('hidden');
}
function hideError() {
  document.getElementById('errorBox').classList.add('hidden');
}

// Screen toggles between login and profile creation
function showCreateProfile() {
  document.getElementById("login-screen").style.display = "none";
  document.getElementById("create-profile-screen").style.display = "block";
  hideError();
}
function showLogin() {
  document.getElementById("create-profile-screen").style.display = "none";
  document.getElementById("login-screen").style.display = "block";
  hideError();
}

function navigateToPage(pageId) {
  const fullPageId = `${pageId}`;
  console.log(`Navigating to page: ${fullPageId}`);
  
  // Hide all content sections
  document.querySelectorAll(".content > div").forEach(page => page.classList.add("hidden"));

  if (pageId === "shift") {
    checkAndOpenIncidents(); // Ensure this only runs for the shift page
  } // <-- ADD THIS CLOSING BRACKET

  // Show the requested page if it exists
  const pageElement = document.getElementById(fullPageId);
  if (pageElement) {
    pageElement.classList.remove("hidden");
  } else {
    console.error(`Page with id "${fullPageId}" not found.`);
    return;
  }

  // Highlight the selected tab
  highlightTab(pageId);

  // Save the last visited page to localStorage
  localStorage.setItem("lastPage", pageId);
  console.log(`Saved lastPage as: ${pageId}`);

  // Display data if on the welcome page
  if (pageId === "welcome") {
    displayData();
  }
}



function checkSession() {
  const users = readData();
  const currentUser = localStorage.getItem("currentUser");
  const lastPage = localStorage.getItem("lastPage");

  if (currentUser && users[currentUser]) {
    const characterName = users[currentUser].characterName;
    const badgeNumber = users[currentUser].badgeNumber;
    displayMainContent(characterName, badgeNumber);
    
    // Navigate to the last page or default to welcomePage
    navigateToPage(lastPage || "welcome");
    highlightTab(lastPage || "welcome");
  } else {
    navigateToPage("login-screen"); // Show login screen if no user session is found
  }
}

function highlightTab(pageId) {
  // Remove selected class from all tabs
  document.querySelectorAll(".main-button").forEach(button => button.classList.remove("selected"));

  // Add selected class to the active tab
  const activeTab = document.querySelector(`[onclick="navigateToPage('${pageId}')"]`);
  if (activeTab) {
    activeTab.classList.add("selected");
  }
}


// Function to load data from a .data file
async function loadData(filePath) {
  try {
      const response = await fetch(filePath);
      if (!response.ok) {
          throw new Error(`File not found: ${filePath}`);
      }
      const data = await response.json();
      return data;
  } catch (error) {
      console.error("Error loading data:", error);
      return null;
  }
}

// Function to calculate total hours worked
function calculateTotalHours(shiftsData) {
  let totalMilliseconds = 0;

  // Iterate through each shift and add up the duration
  shiftsData.shifts.forEach(shift => {
      if (shift.start && shift.end) {
          totalMilliseconds += (shift.end - shift.start);
      }
  });

  // Convert milliseconds to hours
  const totalHours = totalMilliseconds / (1000 * 60 * 60);
  return totalHours.toFixed(1); // Returns total hours with two decimal places
}

async function displayData() {
  console.log("Running displayData"); // Debugging log
  try {
    const shiftsData = await loadData('/data/shift');
    const courtCasesData = await loadData('/data/court');

    if (shiftsData && courtCasesData) {
      console.log("Data loaded:", shiftsData, courtCasesData); // Debugging log

      // Display Officer Name and Badge
      const currentUser = localStorage.getItem("currentUser");
      const users = readData();
      const officerName = users[currentUser].characterName;
      const badgeNumber = users[currentUser].badgeNumber;
      
      const officerNameEl = document.getElementById('officer-name');
      if (officerNameEl) officerNameEl.textContent = `${officerName} (#${badgeNumber})`;

      // Update duty status
      const dutyStatusEl = document.getElementById('duty-status');
      const currentShift = shiftsData.currentShift;
      const createIncidentDiv = document.getElementById('createincident');

      if (currentShift) {
        dutyStatusEl.textContent = "On Duty";
        dutyStatusEl.style.color = "var(--warning-color-green)"; // Optional: color change for visual effect

        // Enable createincident div and reset style
        if (createIncidentDiv) {
          createIncidentDiv.style.pointerEvents = "auto";
          createIncidentDiv.style.opacity = "1"; // Full opacity
          createIncidentDiv.style.cursor = "pointer";
        }
      } else {
        dutyStatusEl.textContent = "Off Duty";
        dutyStatusEl.style.color = "var(--warning-color)"; // Optional: color change for visual effect

        // Gray out the createincident div and disable interaction
        if (createIncidentDiv) {
          createIncidentDiv.style.pointerEvents = "none";
          createIncidentDiv.style.opacity = "0.5"; // Reduced opacity to gray out
          createIncidentDiv.style.cursor = "not-allowed";
        }
      }

      // Display Shift Summary
      const numShifts = shiftsData.shifts.length;
      const totalHoursWorked = calculateTotalHours(shiftsData);
      const shiftCountEl = document.getElementById('shift-count');
      if (shiftCountEl) shiftCountEl.textContent = numShifts;

      const totalHoursEl = document.getElementById('total-hours');
      if (totalHoursEl) totalHoursEl.textContent = `${totalHoursWorked}hrs`;

      // Display Court Cases Count
      const numCourtCases = courtCasesData.length;
      const courtCaseCountEl = document.getElementById('court-case-count');
      if (courtCaseCountEl) courtCaseCountEl.textContent = numCourtCases;

      // Count and display total incidents
      const totalIncidents = shiftsData.shifts.reduce((acc, shift) => acc + shift.incidents.length, 0);
      const incidentCountEl = document.getElementById('incident-count');
      if (incidentCountEl) incidentCountEl.textContent = `${totalIncidents}`;
      
      // Get the summary heading element and the border container
      const shiftSummaryHeadingEl = document.querySelector('.horizontal .subtitle');
      const shiftSummaryBoxEl = document.querySelector('.horizontal .subtext.main-color.box');

      // Check for current shift
      if (currentShift) {
        shiftSummaryHeadingEl.textContent = "Current Shift Summary";
        shiftSummaryBoxEl.style.borderColor = "var(--warning-color-green)";
        
        // Display current shift details
        const lastShiftStartEl = document.getElementById('last-shift-start');
        if (lastShiftStartEl) lastShiftStartEl.textContent = new Date(currentShift.start).toLocaleString();

        const lastShiftEndEl = document.getElementById('last-shift-end');
        if (lastShiftEndEl) lastShiftEndEl.textContent = "Ongoing";

        const lastShiftIncidentsEl = document.getElementById('last-shift-incidents');
        if (lastShiftIncidentsEl) lastShiftIncidentsEl.textContent = currentShift.incidents.length;

        const lastShiftCourtCasesEl = document.getElementById('last-shift-court-cases');
        if (lastShiftCourtCasesEl) lastShiftCourtCasesEl.textContent = currentShift.courtCases.length;
      } else {
        shiftSummaryHeadingEl.textContent = "Last Shift Summary";
        shiftSummaryBoxEl.style.borderColor = "";

        const lastShift = shiftsData.shifts[numShifts - 1];
        if (lastShift) {
          const lastShiftStartEl = document.getElementById('last-shift-start');
          if (lastShiftStartEl) lastShiftStartEl.textContent = new Date(lastShift.start).toLocaleString();

          const lastShiftEndEl = document.getElementById('last-shift-end');
          if (lastShiftEndEl) lastShiftEndEl.textContent = new Date(lastShift.end).toLocaleString();

          const lastShiftIncidentsEl = document.getElementById('last-shift-incidents');
          if (lastShiftIncidentsEl) lastShiftIncidentsEl.textContent = lastShift.incidents.length;

          const lastShiftCourtCasesEl = document.getElementById('last-shift-court-cases');
          if (lastShiftCourtCasesEl) lastShiftCourtCasesEl.textContent = lastShift.courtCases.length;
        }
      }

      const createincidentcontainer = document.getElementById('createincident');

      createincidentcontainer.addEventListener('click', function() {
        console.log("Redirecting to shiftPage by clicking the Shift tab"); // Debugging log

        // Set flag to open recent incidents overlay after navigation
        localStorage.setItem("openCreateIncident", "true");
        localStorage.setItem("cameFromWelcomePage", "true");

        // Simulate click on the Shift tab in the header
        document.getElementById('shift-tab').click();
    });

      // Collect all incidents across all shifts, limit to most recent 4
      const allIncidents = shiftsData.shifts.flatMap(shift => shift.incidents);
      const recentIncidents = allIncidents.slice(-4).reverse(); // Get the last 4 incidents and reverse the order for display

      // Display recent incidents as a clickable label
      const recentIncidentsLabel = recentIncidents
          .map(incident => `• ${incident.number}`)
          .join('<br>');
      const recentIncidentsContainer = document.getElementById('recent-incidents');
      recentIncidentsContainer.innerHTML = recentIncidentsLabel || "No recent incidents";

      // Add click event listener to simulate shift tab click
      recentIncidentsContainer.addEventListener('click', function() {
          console.log("Redirecting to shiftPage by clicking the Shift tab"); // Debugging log

          // Set flag to open recent incidents overlay after navigation
          localStorage.setItem("openRecentIncidents", "true");
          localStorage.setItem("cameFromWelcomePage", "true");

          // Simulate click on the Shift tab in the header
          document.getElementById('shift-tab').click();
      });
    }
  } catch (error) {
    console.error("Error loading data:", error);
  }
}





async function checkForNewAlerts() {
  try {
    // Load the shift data
    const shiftsData = await loadData('/data/shift');

    // Get current shift data
    const currentShift = shiftsData.currentShift;
    if (!currentShift) return; // Exit if there's no active shift

    // Retrieve stored incidents and court cases from localStorage
    const prevIncidents = JSON.parse(localStorage.getItem('prevIncidents')) || [];
    const prevCourtCases = JSON.parse(localStorage.getItem('prevCourtCases')) || [];

    // Get current incidents and court cases
    const currentIncidents = currentShift.incidents.map(incident => incident.number);
    const currentCourtCases = currentShift.courtCases;

    // Find new incidents and court cases
    const newIncidents = currentIncidents.filter(incident => !prevIncidents.includes(incident));
    const newCourtCases = currentCourtCases.filter(courtCase => !prevCourtCases.includes(courtCase));

    let alertMessage = '';

    // If there are new incidents or court cases, create an alert message
    if (newIncidents.length > 0) {
      alertMessage = 'New incident(s) available.';
      localStorage.setItem('prevIncidents', JSON.stringify(currentIncidents));
    }

    if (newCourtCases.length > 0) {
      alertMessage = 'New court case(s) available.';
      localStorage.setItem('prevCourtCases', JSON.stringify(currentCourtCases));
    }

    // Display the alert if a new incident or court case is found
    if (alertMessage) {
      updateAlertBox(alertMessage);
      showAlertNotification();
    }
  } catch (error) {
    console.error("Error checking for new alerts:", error);
  }
}

// Function to show the alert notification
function showAlertNotification() {
  const alertNotification = document.getElementById('alert-notification');
  alertNotification.classList.remove('hidden');

  // Check if the `isAudioAlertsEnabled` variable or function exists
  if (typeof isAudioAlertsEnabled !== 'undefined' && isAudioAlertsEnabled) {
    playNotificationSound(); // Play sound only if the audio plugin is active
  }

  // Hide the alert after 15 seconds
  setTimeout(() => {
    alertNotification.classList.add('hidden');
  }, 15000);
}

// Check for new alerts every 5 seconds
setInterval(checkForNewAlerts, 5000);


function displayStoredAlerts() {
  // Retrieve the last alert message from localStorage
  const storedAlert = localStorage.getItem('lastAlertMessage');
  
  // Find the alert box element
  const alertBox = document.getElementById('alert-box');
  
  // Display the stored alert message if it exists, otherwise display "Alerts: None"
  if (storedAlert) {
    alertBox.textContent = storedAlert;
  } else {
    alertBox.textContent = 'None';
  }
}

function updateAlertBox(message) {
  // Find the alert box element
  const alertBox = document.getElementById('alert-box');
  
  // Update the alert box content
  alertBox.textContent = message;

  // Store the alert message in localStorage
  localStorage.setItem('lastAlertMessage', message);
}

// Function to check if the shift has ended
async function checkIfShiftEnded() {
  try {
    // Load the shift data
    const shiftsData = await loadData('/data/shift');

    // Check if the current shift has ended
    const currentShift = shiftsData.currentShift;
    if (!currentShift || currentShift.status === 'ended') {
      clearAlerts(); // Clear alerts if the shift has ended
    }
  } catch (error) {
    console.error("Error checking if shift ended:", error);
  }
}

// Call `checkIfShiftEnded` every 5 seconds to check for shift end
setInterval(checkIfShiftEnded, 5000);

function clearAlerts() {
  // Remove the alert message from localStorage
  localStorage.removeItem('lastAlertMessage');
  localStorage.removeItem('prevIncidents');
  localStorage.removeItem('prevCourtCases');

  // Update the alert box to show "None"
  const alertBox = document.getElementById('alert-box');
  alertBox.textContent = 'None';
}











window.onload = () => {
  checkSession(); // Ensure existing functionality runs
  displayStoredAlerts(); // Display alerts from localStorage
};
