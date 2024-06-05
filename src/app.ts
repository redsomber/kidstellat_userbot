import { MessageContext, NewMessageHandler, filters } from '@mtcute/dispatcher'
import { dp, tg } from './helpers/bot.js'
import startMongo from './helpers/startMongo.js'
import { handleNewMessage } from './handlers/messageHangler.js'
import { fetchKeywordsAndCreateRegex } from './helpers/regexFilter.js'
import { getGroupIdsFilter } from './middlewares/filterGroup.js'
import onNewMessage from './handlers/onNewMessage.js'
import listenForReboot from './middlewares/listenForReboot.js'

async function runApp() {
    console.log('Starting app...')
    try {
        // Mongo
        await startMongo()
        console.log('Mongo connected')

        await onNewMessage()

        await listenForReboot()

        tg.run((user) => {
            console.log('Logged in as', user.username)
        })
    } catch (error) {
        console.error('Failed to start the app:', error)
    }
}

void runApp()
