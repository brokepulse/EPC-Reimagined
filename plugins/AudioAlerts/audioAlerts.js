const settings = {
  audioSource: '/plugins/AudioAlerts/alert_0.mp3',
  notificationSource: '/plugins/AudioAlerts/notification.mp3',
  repeat: 3,
  volume: 0.5,
  delay: 250,
  voice: 0,
};

const audio = new Audio(settings.audioSource);
const notificationAudio = new Audio(settings.notificationSource);

function playAlertSound() {
  let i = 0;
  audio.volume = settings.volume;
  audio.play();
  audio.addEventListener('ended', function () {
    if (i < settings.repeat - 1) {
      audio.play();
    }
    i++;
  });
}

function playNotificationSound() {
  const audio = new Audio('/plugins/AudioAlerts/notification.mp3');
  audio.volume = 0.5; // Adjust the volume as needed
  audio.play().catch(error => {
    console.error("Error playing notification sound:", error);
  });
}

// Indicate that the plugin is active
const isAudioAlertsEnabled = true; // Ensure this is accessible globally or exported if using modules


// Attach the function to the window object to make it globally accessible
window.playNotificationSound = playNotificationSound;

reassignEventListener('.searchPedPage .pedBtn', 'click', function () {
  renderPedSearchWithAlert()
})

reassignEventListener('.searchPedPage .pedInp', 'keydown', function (e) {
  if (e.key == 'Enter') {
    renderPedSearchWithAlert()
  }
})

async function renderPedSearchWithAlert() {
  await renderPedSearch()
  const language = await getLanguage()
  const informationLabels = document.querySelectorAll(
    '.searchPedPage .resultContainer .informationLabel'
  )
  for (const informationLabel of informationLabels) {
    const key = informationLabel.querySelector('.key').innerHTML
    const value = informationLabel.querySelector('.value').innerHTML
    if (
      (key == language.content.searchPedPage.resultContainer.licenseStatus &&
        (value.includes(language.content.values.suspended) ||
          value.includes(language.content.values.revoked))) ||
      (key == language.content.searchPedPage.resultContainer.warrant &&
        value != language.content.values.none) ||
      ((key == language.content.searchPedPage.resultContainer.probation ||
        key == language.content.searchPedPage.resultContainer.parole) &&
        value.includes(language.content.values.yes))
    ) {
      await sleep(settings.delay)
      playAlertSound()
      return
    }
  }
}

reassignEventListener('.searchCarPage .carBtn', 'click', function () {
  renderCarSearchWithAlert()
})

reassignEventListener('.searchCarPage .carInp', 'keydown', function (e) {
  if (e.key == 'Enter') {
    renderCarSearchWithAlert()
  }
})

async function renderCarSearchWithAlert() {
  await renderCarSearch()
  const language = await getLanguage()
  const informationLabels = document.querySelectorAll(
    '.searchCarPage .resultContainer .informationLabel'
  )
  for (const informationLabel of informationLabels) {
    const key = informationLabel.querySelector('.key').innerHTML
    const value = informationLabel.querySelector('.value').innerHTML
    if (
      ((key == language.content.searchCarPage.resultContainer.registration ||
        key == language.content.searchCarPage.resultContainer.insurance) &&
        value.includes(language.content.values.none)) ||
      value.includes(language.content.values.expired) ||
      (key == language.content.searchCarPage.resultContainer.stolen &&
        value.includes(language.content.values.yes))
    ) {
      await sleep(settings.delay)
      playAlertSound()
      return
    }
  }
}

