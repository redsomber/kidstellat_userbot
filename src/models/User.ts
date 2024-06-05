import { UserData } from '../interfaces/userData.js'
import { getModelForClass, modelOptions, prop } from '@typegoose/typegoose'

@modelOptions({ schemaOptions: { timestamps: true } })
export class User {
    @prop({ required: true, index: true, unique: true })
    user_id!: number

    @prop({ required: true, default: 'en' })
    language!: string

    @prop({ required: false, type: String, default: null })
    username?: string

    @prop({ required: false, type: String, default: null })
    firstName?: string

    @prop({ required: false, type: String, default: null })
    lastName?: string

    @prop({ required: true, default: 0 })
    catchCount!: number
}

const UserModel = getModelForClass(User)

export function findOrCreateUser(userData: UserData) {
    const { user_id, username, firstName, lastName } = userData
    return UserModel.findOneAndUpdate(
        { user_id },
        {
            $set: { username, firstName, lastName },
            $inc: { catchCount: 1 },
        },
        {
            upsert: true,
            new: true,
            setDefaultsOnInsert: true,
        }
    )
}
