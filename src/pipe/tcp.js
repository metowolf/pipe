const net = require('net')
const Frap = require('frap')

class TcpServer {

    constructor(options) {
      this.options = options
      this._createServer()
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

      let remote = net.connect(this.options.remote_port, this.options.remote_addr)
      remote.setTimeout(this.options.timeout)

      let wrapper = new Frap(local)

      wrapper.on('data', data => {
        data = this.options.decrypt(data)
        if (remote.writable) remote.write(data)
      })

      remote.on('data', data => {
        data = this.options.encrypt(data)
        if (local.writable) wrapper.write(data)
      })

      local.on('close', () => {
        if (remote) remote.end()
      })
      remote.on('close', () => {
        if (local) local.end()
      })

      local.on('end', () => {
        if (remote) {
          remote.end()
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

class TcpClient {

  constructor(options) {
    this.options = options
    this._createServer()
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

    let remote = net.connect(this.options.remote_port, this.options.remote_addr)
    remote.setTimeout(this.options.timeout)

    let wrapper = new Frap(remote)

    local.on('data', data => {
      data = this.options.encrypt(data)
      if (!remote.destroyed) wrapper.write(data)
    })
    wrapper.on('data', data => {
      data = this.options.decrypt(data)
      if (!local.destroyed) local.write(data)
    })

    local.on('close', () => {
      if (remote) remote.end()
    })
    remote.on('close', () => {
      if (local) local.end()
    })

    local.on('end', () => {
      if (remote) {
        remote.end()
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

module.exports.server = TcpServer
module.exports.client = TcpClient
