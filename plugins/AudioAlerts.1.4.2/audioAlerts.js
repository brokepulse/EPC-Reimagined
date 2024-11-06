const settings = {
  audioSource: '/plugins/AudioAlerts.1.4.2/alert_0.mp3',
  // available audios: /plugins/AudioAlerts.1.4.2/alert_0.mp3 & /plugins/AudioAlerts.1.4.2/alert_0.mp3 (default)
  repeat: 3,
  volume: 0.5,
  delay: 250,
  voice: 0,
}

const audio = new Audio(settings.audioSource)

function playAlertSound() {
  let i = 0
  audio.play()
  audio.volume = settings.volume
  audio.addEventListener('ended', function () {
    if (i < settings.repeat - 1) {
      audio.play()
    }
    i++
  })
}

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

let voiceAvailable = false
const oldUpdateCalloutPage = updateCalloutPage
updateCalloutPage = async function () {
  const oldCalloutData = document.querySelector('.content .calloutPage').dataset
    .calloutData
  await oldUpdateCalloutPage.apply(this)
  if (
    oldCalloutData !=
      document.querySelector('.content .calloutPage').dataset.calloutData &&
    JSON.parse(
      document.querySelector('.content .calloutPage').dataset.calloutData
    ).acceptanceState == 'Pending'
  ) {
    await sleep(settings.delay)
    const calloutData = JSON.parse(
      document.querySelector('.content .calloutPage').dataset.calloutData
    )
    for (const calloutDataItem of Object.keys(calloutData)) {
      calloutData[calloutDataItem] = calloutData[calloutDataItem].replace(
        /~(.*?)~/g,
        ''
      )
    }
    const language = await getLanguage()
    const text = `${calloutData.message} ${calloutData.advisory} ${
      calloutData.postal
    } ${calloutData.street} Respond ${
      calloutData.priority == 'default'
        ? language.content.calloutPage.defaultPriority
        : calloutData.priority
    }`
    if (!voiceAvailable) {
      window.speechSynthesis.addEventListener('voiceschanged', function () {
        speakText(text)
      })
    } else {
      speakText(text)
    }
  }
}

window.speechSynthesis.addEventListener('voiceschanged', function () {
  voiceAvailable = true
})

function speakText(text) {
  const synth = window.speechSynthesis
  const voices = synth.getVoices()
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.voice = voices[settings.voice]
  synth.speak(utterance)
}
