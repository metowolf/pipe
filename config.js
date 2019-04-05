require('dotenv').config()

module.exports = {
  public: {
    password: process.env.PASSWORD || 'metowolf/pipe',
    timeout: parseInt(process.env.TIMEOUT || '60', 10) * 1000,
    pipe: {
      type: process.env.PIPE_TYPE || 'tcp',
      crypto: process.env.PIPE_CRYPTO || 'aes',
    },
    websocket: {
      protocol: process.env.WS_PROTOCOL || 'ws',
      path: process.env.WS_PATH || '/',
    },
  },
  local: {
    bind_addr: process.env.LOCAL_BIND_ADDR || process.env.BIND_ADDR || '127.0.0.1',
    bind_port: process.env.LOCAL_BIND_PORT || process.env.BIND_PORT || '1080',
    remote_addr: process.env.LOCAL_REMOTE_ADDR || process.env.REMOTE_ADDR || '127.0.0.1',
    remote_port: process.env.LOCAL_REMOTE_PORT || process.env.REMOTE_PORT || '8838',
  },
  remote: {
    bind_addr: process.env.REMOTE_BIND_ADDR || process.env.BIND_ADDR || '0.0.0.0',
    bind_port: process.env.REMOTE_BIND_PORT || process.env.BIND_PORT || '8838',
  },
  relay: {
    bind_addr: process.env.RELAY_BIND_ADDR || process.env.BIND_ADDR || '0.0.0.0',
    bind_port: process.env.RELAY_BIND_PORT || process.env.BIND_PORT || '8838',
    remote_addr: process.env.RELAY_REMOTE_ADDR || process.env.REMOTE_ADDR || '127.0.0.1',
    remote_port: process.env.RELAY_REMOTE_PORT || process.env.REMOTE_PORT || '1083',
  },
}
