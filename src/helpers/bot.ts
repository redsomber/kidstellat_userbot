import { Dispatcher } from '@mtcute/dispatcher'
import { TelegramClient } from '@mtcute/node'
import env from './env.js'

const tg = new TelegramClient({
    apiId: env.API_ID,
    apiHash: env.API_HASH,
    storage: 'bot-data/session',
})

const dp = Dispatcher.for(tg)

export { dp, tg }
