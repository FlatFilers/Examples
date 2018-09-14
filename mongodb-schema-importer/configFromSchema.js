module.exports =  function (schemas) {
  const config = {
    fields: [],
    type: ''
  }
  Object.keys(schemas).forEach((s) => {
    const schema = schemas[s].schema
    config.type = config.type || s
    schema.eachPath((name, type) => {
      if (name === '_id' || name === '__v')
        return
      const field = {
        key: name,
        validators: []
      }
      if (type.validators.length) {
        type.validators.forEach(v => {
          switch (v.type) {
            case 'required':
              field.validators.push({
                validate: 'required',
                error: v.message.replace('Path `{PATH}`', `'${name}'`)
              })
              break
            case 'regexp':
              field.validators.push({
                validate: 'regex_matches',
                error: v.message.replace('Path `{PATH}`', `'${name}'`),
                regex: v.regexp
              })
              break
            case 'enum':
              field.validators.push({
                validate: 'select',
                error: v.message.replace(/Path `{PATH}`/gi, `'${name}'`).replace('`{VALUE}`', 'The value')
              })
              field.type = 'select'
              field.options = v.enumValues
            default:
              // do nothing
          }
        })
      }
      switch (type.instance) {
        case 'Boolean':
          field.validators.push({
            validate: 'boolean',
            error: `'${name}' must be boolean.`
          })
          field.type = 'checkbox'
          break
        case 'Number':
          field.validators.push({
            validate: 'regex_matches',
            error: `'${name}' must be numeric.`,
            regex: /^(\d|\.)*$/
          })
          break
        default:
          // do nothing
      }
      if (type.instance === 'Boolean') {
      }
      config.fields.push(field)
    })
  })
  console.log(JSON.stringify(config, null, 2))
  return config
}