import { UpdateFilter } from '@mtcute/dispatcher'
import { GroupModel } from '../models/Group.js'
import { Message } from '@mtcute/node'

export async function getGroupIdsFilter(): Promise<UpdateFilter<Message>> {
    try {
        const groups = await GroupModel.find({ turn_on: true })
            .select('group_id')
            .exec()
        const groupIds = groups.map((group) => group.group_id)
        console.log('Active group IDs:', groupIds)
        return (msg: Message) => groupIds.includes(msg.chat.id)
    } catch (error) {
        console.error('Failed to fetch group IDs:', error)
        // Return a filter that matches no groups in case of error
        return () => false
    }
}
