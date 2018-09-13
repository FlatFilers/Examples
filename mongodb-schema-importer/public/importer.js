const robotImporter = new FlatfileImporter(license, config)

const launchButton = document.getElementById('launch')
launchButton.addEventListener('click', function () {
  robotImporter
    .requestDataFromUser()
    .then(function (results) {
      console.info(results.validData)
      robotImporter.displayLoader()
      // display results in viewbox
      robotImporter.displaySuccess()
    })
    .catch(function (error) {
      console.info(error || 'window close')
    })
})