import { connect } from 'mongoose'
import env from './env.js'

function startMongo() {
    return connect(env.MONGO)
}

export default startMongo
