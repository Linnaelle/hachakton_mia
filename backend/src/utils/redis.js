const redis = require('redis')
// const client = redis.createClient();

const redisClient = redis.createClient()

redisClient.connect().catch(console.error)

redisClient.on('connect', () => {
    console.log('Connected to Redis')
});

redisClient.on('error', (err) => {
    console.error('Redis error:', err)
});

module.exports = redisClient;