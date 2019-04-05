const ws = require('ws')
const net = require('net')
const http = require('http')

class WebsocketServer {

  constructor(options) {
    this.options = options
    this._createServer()
  }

  _createServer() {
    this.httpserver = http.createServer((req, res) => {
      res.writeHead(200)
      res.end(`<html><head><meta http-equiv="Content-Type" content="text/html; charset=utf-8"></head><body><p>哔哩哔哩 (゜-゜)つロ 干杯~</p><p>v7.0</p></body></html>`)
    })
    this.httpserver.on('listening', () => this._listening())
    this.httpserver.on('error', error => this._error(error))
    this.server = new ws.Server({
      server: this.httpserver,
      path: this.options.websocket.path,
    })
    this.server.on('connection', socket => this._socket(socket))
    this.httpserver.listen(this.options.bind_port, this.options.bind_host)
  }

  _listening() {
    let addr = this.server.address()
    console.log(`[pipe] listening at ${addr.address}:${addr.port}`)
  }

  _error(error) {
    console.log('[pipe] error:', error.message)
  }

  _socket(local) {
    let remote = net.connect(this.options.remote_port, this.options.remote_addr)
    remote.setTimeout(this.options.timeout)

    local.on('ping', () => {
      if (local.readyState === ws.OPEN) local.pong('')
    })

    local.on('message', data => {
      data = this.options.decrypt(data)
      if (!remote.destroyed) remote.write(data)
    })

    remote.on('data', data => {
      data = this.options.encrypt(data)
      if (local.readyState === ws.OPEN) local.send(data)
    })

    local.on('close', () => {
      if (remote) remote.end()
    })
    remote.on('close', () => {
      if (local) local.terminate()
    })

    local.on('end', () => {
      if (remote) {
        remote.end()
        remote.removeAllListeners()
      }
    })
    remote.on('end', () => {
      if (local) {
        local.terminate()
        local.removeAllListeners()
      }
    })

    local.on('error', error => {
      console.log('[local] error:', error.message)
    })
    remote.on('error', error => {
      console.log('[remote] error:', error.message)
    })
  }

}

class WebsocketClient {

  constructor(options) {
    this._init(options)
    this._createServer()
  }

  _init(options) {
    this.options = {
      bind_host: options.bind_host,
      bind_port: options.bind_port,
      remote_url: `${options.websocket.protocol}://${options.remote_addr}:${options.remote_port}${options.websocket.path}`,
      encrypt: options.encrypt,
      decrypt: options.decrypt,
    }
  }

  _createServer() {
    this.server = net.createServer()
    this.server.on('listening', () => this._listening())
    this.server.on('error', error => this._error(error))
    this.server.on('connection', socket => this._socket(socket))
    this.server.listen(this.options.bind_port, this.options.bind_host)
  }

  _listening() {
    let addr = this.server.address()
    console.log(`[pipe] listening at ${addr.address}:${addr.port}`)
  }

  _error(error) {
    console.log('[pipe] error:', error.message)
  }

  _socket(local) {

    local.pause()

    let remote = new ws(this.options.remote_url)

    remote.on('open', () => {
      local.resume()
      remote.heart = setInterval(() => {
        if (remote.readyState === ws.OPEN) remote.ping('')
      }, 30 * 1000)
    })

    local.on('data', data => {
      data = this.options.encrypt(data)
      if (remote.readyState === ws.OPEN) remote.send(data)
    })

    remote.on('message', data => {
      data = this.options.decrypt(data)
      if (!local.destroyed) local.write(data)
    })

    local.on('close', () => {
      if (remote) {
        clearInterval(remote.heart)
        remote.terminate()
      }
    })
    remote.on('close', () => {
      if (local) local.end()
    })

    local.on('end', () => {
      if (remote) {
        remote.terminate()
        remote.removeAllListeners()
      }
    })
    remote.on('end', () => {
      if (local) {
        local.end()
        local.removeAllListeners()
      }
    })

    local.on('error', error => {
      console.log('[local] error:', error.message)
    })
    remote.on('error', error => {
      console.log('[remote] error:', error.message)
    })
  }

}

module.exports.server = WebsocketServer
module.exports.client = WebsocketClient
