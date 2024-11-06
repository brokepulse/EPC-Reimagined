const tenCodes = new Map([
  ['Code 4', 'No further units needed'],
  ['Code 5', 'Felony stop'],
  ['Code 6', 'Investigating'],
  ['10-1', 'Lost visual'],
  ['10-2', 'Radio check'],
  ['10-4', 'Acknowledgment'],
  ['10-5', 'Meal break'],
  ['10-6', 'Busy'],
  ['10-8', 'In service'],
  ['10-10', 'Fight in progress'],
  ['10-11', 'Traffic stop'],
  ['10-15', 'Prisoner in custody'],
  ['10-16', 'Prisoner transport needed'],
  ['10-19', 'Returning to the station'],
  ['10-23', 'Arrived at the scene'],
  ['10-27', "Driver's license check"],
  ['10-28', 'Vehicle registration check'],
  ['10-32', 'Backup needed'],
  ['10-41', 'Beginning tour of duty'],
  ['10-42', 'Ending tour of duty'],
  ['10-51', 'Wrecker needed'],
  ['10-52', 'Ambulance needed'],
  ['10-53', 'Fire needed'],
  ['10-79', 'Coroner needed'],
  ['10-80', 'Chase in progress'],
  ['10-97', 'En route'],
  ['11-44', 'Person deceased'],
  ['11-47', 'Person injured'],
])

// Select the Ten Codes button and the Ten Codes page
const tenCodesButton = document.querySelector('.tenCodes.main-button');
const tenCodesPage = document.querySelector('.tenCodesPage');

// Event listener to show the Ten Codes page when the button is clicked
tenCodesButton.addEventListener('click', function () {
  // Hide all content pages
  document.querySelectorAll('.content > *').forEach((page) => {
    page.classList.add('hidden');
  });

  // Remove selected class from all main buttons
  document.querySelectorAll('.header .main-button').forEach((button) => {
    button.classList.remove('selected');
  });

  // Show the Ten Codes page and mark the tab as selected
  tenCodesPage.classList.remove('hidden');
  tenCodesButton.classList.add('selected');
});

// Populate the Ten Codes and Actions dynamically
const codeList = document.getElementById('codeList');
const actionList = document.getElementById('actionList');

tenCodes.forEach((value, key) => {
  const codeItem = document.createElement('div');
  codeItem.classList.add('item');
  codeItem.innerHTML = key;
  codeList.appendChild(codeItem);

  const actionItem = document.createElement('div');
  actionItem.classList.add('item');
  actionItem.innerHTML = value;
  actionList.appendChild(actionItem);
});
