import { MessageContext } from '@mtcute/dispatcher'
import { findOrCreateUser } from '../models/User.js'
import { findOrCreateGroup } from '../models/Group.js'
import { logUserMessage } from '../models/Message.js'
import { messagePattern } from '../helpers/messagePattern.js'
import { fetchKeywordsAndCreateRegex } from '../helpers/regexFilter.js'
import { RecipientModel } from '../models/Recipient.js'
import { KeywordModel } from '../models/Keyword.js'

function delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function handleNewMessage(msg: MessageContext) {
    try {
        const regexPattern = await fetchKeywordsAndCreateRegex()

        if (!regexPattern) {
            console.error(
                'Failed to create regex pattern from database keywords.'
            )
            return
        }
        const match = msg.text.match(regexPattern)
        const matchedKeyword = match ? match[1] : null

        if (matchedKeyword) {
            // Increment the catch count for the matched keyword in a case-insensitive manner
            const keywordRegex = new RegExp(`^${matchedKeyword}$`, 'i')
            await KeywordModel.findOneAndUpdate(
                { word: { $regex: keywordRegex } },
                { $inc: { catch_count: 1 } }
            )
        } else {
            console.log('No keyword matched.')
            return // Early return if matchedKeyword is null
        }

        await findOrCreateUser({
            user_id: msg.sender.id,
            username: msg.sender.username,
            firstName: msg.sender.firstName,
            lastName: msg.sender.lastName,
            firstContact: msg.chat.id,
        })

        await findOrCreateGroup({
            group_id: msg.chat.id,
            group_username: msg.chat.username,
            title: msg.chat.title,
        })

        await logUserMessage({
            user_id: msg.sender.id,
            group_id: msg.chat.id,
            text: msg.text,
            keyword: matchedKeyword,
        })

        const recipients = await RecipientModel.find().select('user_id -_id')

        const messageText = messagePattern(
            msg.chat.title,
            msg.chat.username,
            msg.text,
            msg.sender.username,
            matchedKeyword
        )
        for (const recipient of recipients) {
            try {
                await msg.client.sendText(recipient.user_id, messageText)
            } catch {
                console.error(
                    `Failed to send message to user ${recipient.user_id}`
                )
            }
            await delay(300)
        }
    } catch (error) {
        console.error('Failed to handle new message:', error)
    }
}
