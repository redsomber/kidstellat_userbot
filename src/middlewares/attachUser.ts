import { UserData } from '../interfaces/userData.js'
import { findOrCreateUser } from '../models/User.js'

const user = {
    id: 123,
    username: 'john_doe',
    firstName: 'John',
    lastName: 'Doe',
}

export default async function attachUser(users: UserData) {
    if (!users) {
        throw new Error('No from field found')
    }
    const user = await findOrCreateUser(users)
    if (!user) {
        throw new Error('User not found')
    }
}
