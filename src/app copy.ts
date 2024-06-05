import { filters } from '@mtcute/dispatcher'
import { dp, tg } from './helpers/bot.js'
import startMongo from './helpers/startMongo.js'
import { handleNewMessage } from './handlers/messageHangler.js'
import { fetchKeywordsAndCreateRegex } from './helpers/regexFilter.js'
import { getGroupIdsFilter } from './middlewares/filterGroup.js'

async function runApp() {
    console.log('Starting app...')
    try {
        // Mongo
        await startMongo()
        console.log('Mongo connected')

        // Fetch the custom filter
        const customGroupFilter = await getGroupIdsFilter()

        const regexPattern = await fetchKeywordsAndCreateRegex()

        if (!regexPattern) {
            console.error('No valid regex pattern created.')
            return
        }

        dp.onNewMessage(
            filters.and(
                customGroupFilter,
                filters.regex(regexPattern),
                filters.not(filters.me)
            ),
            handleNewMessage
        )

        // dp.onNewMessage(filters.me, async (msg) => {
        //     console.log(msg.chat.id)
        // })

        tg.run((user) => {
            console.log('Logged in as', user.username)
        })
    } catch (error) {
        console.error('Failed to start the app:', error)
    }
}

void runApp()
