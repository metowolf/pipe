const config = require('./config')

const Pipe = require(`./pipe/${config.public.pipe.type}`)
const crypto = require(`./crypto/${config.public.pipe.crypto}`)

const pipe = new Pipe.client({
  ...config.local,
  ...config.public,
  encrypt: crypto.encrypt,
  decrypt: crypto.decrypt,
})
