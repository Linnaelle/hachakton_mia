const Queue = require('bull')
const redis = require('../config/redis')
const { sendNotification } = require('../../controllers/notificationController')

const notificationQueue = new Queue("notifications", {
  redis: { host: "127.0.0.1", port: 6379 },
})

notificationQueue.process(async (job) => {
  const { recipientId, message } = job.data
  sendNotification(recipientId, message)
})

module.exports = notificationQueue