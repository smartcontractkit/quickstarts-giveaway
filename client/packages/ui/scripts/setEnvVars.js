const fs = require('fs').promises
const cheerio = require('/usr/local/lib/node_modules/cheerio/lib')

async function readFile(filePath) {
  try {
    const data = await fs.readFile(filePath)
    return data.toString()
  } catch (error) {
    console.error(`Got an error trying to read the file: ${error.message}`)
  }
}

function strip(key) {
  return key.replace('\n', '').trim()
}

async function setEnvVars() {
  const path = '/usr/share/nginx/html/index.html'

  const prefix = 'UI'
  const envVarKeys = [
    `${prefix}_GIVEAWAY_MANAGER_CONTRACT_ADDRESS`,
    `${prefix}_LINK_TOKEN_CONTRACT_ADDRESS`,
    `${prefix}_KEEPER_REGISTRY_CONTRACT_ADDRESS`
  ]

  const envVars = envVarKeys
    .map((key) => `\t\tvar GLOBAL_${key}="${process.env[key]}";`)
    .join('\n\t')
  const script = `<script id="env-vars">\n\t${envVars}\n\t\t</script>`

  const index = await readFile(path)
  const $ = cheerio.load(index)
  $('#env-vars').replaceWith(script)
  const updatedIndex = $.html()
  await fs.writeFile(path, updatedIndex)
}

setEnvVars()
