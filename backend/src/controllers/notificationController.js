const notificationQueue = require('../queues/notificationQueue')

const sendNotification = async (userId, message) => {
  await notificationQueue.add({ userId, message }, { attempts: 3 })
}

module.exports = { sendNotification }