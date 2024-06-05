import { GroupData } from '../interfaces/groupData.js'
import { getModelForClass, modelOptions, prop } from '@typegoose/typegoose'

@modelOptions({ schemaOptions: { timestamps: true } })
export class Group {
    @prop({ required: true, index: true, unique: true })
    group_id!: number

    @prop({ required: false, type: String, default: null })
    group_username?: string | null

    @prop({ required: false, type: String, default: null })
    title?: string | null

    @prop({ required: true, default: 0 })
    catch_count!: number

    @prop({ required: true, default: true })
    turn_on!: boolean
}

const GroupModel = getModelForClass(Group)

function findOrCreateGroup(groupData: GroupData) {
    const { group_id, group_username, title } = groupData
    return GroupModel.findOneAndUpdate(
        { group_id },
        { $set: { group_username, title }, $inc: { catch_count: 1 } },
        { upsert: true, new: true, setDefaultsOnInsert: true }
    )
}

export { GroupModel, findOrCreateGroup }
