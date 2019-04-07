const config = require('./config')

const Socks5 = require('@heroku/socksv5')

const Pipe = require(`./pipe/${config.public.pipe.type}`)
const crypto = require(`./crypto/${config.public.pipe.crypto}`)

const socks5 = Socks5.createServer()
socks5.useAuth(Socks5.auth.None())
socks5.listen(0, '127.0.0.1')

socks5.on('listening', () => {
  const address = socks5.address()
  const pipe = new Pipe.server({
    ...config.remote,
    ...config.public,
    remote_addr: address.address,
    remote_port: address.port,
    encrypt: crypto.encrypt,
    decrypt: crypto.decrypt,
  })
})
