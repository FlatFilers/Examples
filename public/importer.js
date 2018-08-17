const robotImporter = new FlatfileImporter(
  '923fe2e0-7967-11e8-914e-619390d70355',
  {
    fields: [
      {
        label: 'Robot Name',
        key: 'name',
        isRequired: true,
        description: 'The designation of the robot',
        validators: [
          {
            validate: 'required_without',
            fields: ['id', 'shield-color'],
            error: 'must be present if no id or shield color'
          }
        ]
      },
      {
        label: 'Shield Color',
        key: 'shield-color',
        description: 'Chromatic value',
        validator: {
          validate: 'regex_matches',
          regex: /^[a-zA-Z]+$/,
          error: 'Not alphabet only'
        }
      },
      {
        label: 'Robot Helmet Style',
        key: 'helmet-style',
        options: ['square', 'round', 'triangle']
      },
      {
        label: 'Call Sign',
        key: 'sign',
        alternates: ['nickname', 'wave'],
        validators: [
          {
            validate: 'regex_matches',
            regex: /^[a-zA-Z]{4}$/,
            error: 'must be 4 characters exactly'
          },
          {
            validate: 'regex_excludes',
            regex: /test/,
            error: 'must not include the word "test"'
          }
        ],
        isRequired: true
      },
      {
        label: 'Robot ID Code',
        key: 'id',
        description: 'Digital identity',
        validators: [
          {
            validate: 'regex_matches',
            regex: 'numeric',
            error: 'must be numeric'
          },
          {
            validate: 'required_without',
            fields: ['name'],
            error: 'ID must be present if name is absent'
          }
        ]
      }
    ],
    type: 'Robot',
    allowInvalidSubmit: true,
    managed: true,
    allowCustom: true,
    disableManualInput: false
  }
)


const launchButton = document.getElementById('launch')
launchButton.addEventListener('click', function () {
  robotImporter
    .requestDataFromUser()
    .then(function (results) {
      console.info(results.validData)
      robotImporter.displayLoader()
      const file = Papa.unparse(results.validData)
      uploadToS3(file)
    })
    .catch(function (error) {
      console.info(error || 'window close')
    })
})

function uploadToS3 (file) {
  console.log(signedRequest, url, file)
  const xhr = new XMLHttpRequest()
  xhr.open('PUT', signedRequest)
  xhr.setRequestHeader('Content-Type', 'text/csv')
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        document.getElementById('raw_output').value = url
      } else {
        alert('Could not upload file.')
      }
    }
  }
  xhr.send(file)
}