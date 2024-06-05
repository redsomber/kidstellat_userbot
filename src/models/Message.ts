import { MessageData } from '../interfaces/messageData.js'
import { getModelForClass, modelOptions, prop } from '@typegoose/typegoose'

@modelOptions({ schemaOptions: { timestamps: true } })
export class UserMessage {
    @prop({ required: true, index: true })
    user_id!: number

    @prop({ required: true, index: true })
    group_id!: number

    @prop({ required: true })
    text!: string

    @prop({ required: false, type: String, default: null })
    keyword?: string
}

const UserMessageModel = getModelForClass(UserMessage)

export async function logUserMessage(messageData: MessageData) {
    const newMessage = new UserMessageModel(messageData)
    await newMessage.save()
}
// export function logUserMessage(messageData: MessageData) {
//     const { user_id, group_id, text, keyword } = messageData
//     return UserMessageModel.create({ user_id, group_id, text, keyword })
// }
