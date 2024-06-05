import { MessageContext, NewMessageHandler, filters } from '@mtcute/dispatcher'
import { handleNewMessage } from './messageHangler.js'
import { dp } from '../helpers/bot.js'
import { getGroupIdsFilter } from '../middlewares/filterGroup.js'
import { fetchKeywordsAndCreateRegex } from '../helpers/regexFilter.js'

export default async function onNewMessage() {
    // Fetch the custom filter
    const customGroupFilter = await getGroupIdsFilter()

    const regexPattern = await fetchKeywordsAndCreateRegex()
    console.log(`regex: ${regexPattern}`)

    if (!regexPattern) {
        console.error('No valid regex pattern created.')
        return
    }

    const handler: NewMessageHandler<MessageContext> = {
        name: 'new_message',
        callback: handleNewMessage,
        check: filters.and(
            customGroupFilter,
            filters.regex(regexPattern),
            filters.not(filters.me)
        ),
    }
    dp.removeUpdateHandler(handler)
    dp.addUpdateHandler(handler)

    // setTimeout(() => {
    //     dp.removeUpdateHandler(handler)
    //     console.log('Message handler removed after 10 seconds')
    // }, 10000)
}
