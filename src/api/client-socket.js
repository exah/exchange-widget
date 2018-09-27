import config from 'config'
import io from 'socket.io-client'

const socket = io(config.public.siteUrl)

export default socket
