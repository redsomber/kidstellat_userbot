import onNewMessage from '../handlers/onNewMessage.js'
import env from '../helpers/env.js'
import { RebootModel } from '../models/Reboot.js'

// Function to poll the database for changes
async function pollForRebootChange() {
    try {
        const rebootDocument = await RebootModel.findById(env.REBOOT).exec()
        if (rebootDocument && rebootDocument.value === true) {
            console.log('Reboot flag detected. Updating filters...')
            await onNewMessage()
            await RebootModel.updateOne(
                { _id: env.REBOOT },
                { $set: { value: false } }
            )
        }
    } catch (error) {
        console.error('Failed to check for reboot flag:', error)
    }
}

// Function to start polling at regular intervals
async function startPolling(interval: number) {
    setInterval(async () => {
        await pollForRebootChange()
    }, interval)
}

export default async function listenForReboot() {
    try {
        // Start polling every 5 seconds (10000 milliseconds)
        await startPolling(10000)
    } catch (error) {
        console.error('Failed to set up polling listener:', error)
    }
}
