import { createApp } from './lib/create-app'
import api from './api'

const app = createApp()

app.route('/api', api)

export default app
