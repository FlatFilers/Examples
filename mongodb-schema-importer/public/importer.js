let config = DB_config
document.getElementById('config_output').value = JSON.stringify(config, null, 2)

const launchButton = document.getElementById('launch')
launchButton.addEventListener('click', function () {
  const robotImporter = new FlatfileImporter(license, config)
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

const sourceToggle = document.getElementById('source-toggle')
sourceToggle.addEventListener('change', function (event) {
  config = event.target.checked ? DB_config : Schema_config
  document.getElementById('config_output').value = JSON.stringify(config, null, 2)
})