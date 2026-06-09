const redis = require('redis');
const logger = require('./logger');

const redisClient = redis.createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
});

redisClient.on('error', (err) => logger.error('Redis Client Error', err));
redisClient.on('connect', () => logger.info('Redis Client Connected'));

(async () => {
  try {
    await redisClient.connect();
  } catch (err) {
    logger.error('Could not connect to Redis', err);
  }
})();

const getCache = async (key) => {
  try {
    const value = await redisClient.get(key);
    return value ? JSON.parse(value) : null;
  } catch (err) {
    logger.error(`Error getting cache for key ${key}`, err);
    return null;
  }
};

const setCache = async (key, value, duration = 3600) => {
  try {
    await redisClient.set(key, JSON.stringify(value), {
      EX: duration,
    });
  } catch (err) {
    logger.error(`Error setting cache for key ${key}`, err);
  }
};

const deleteCache = async (key) => {
  try {
    await redisClient.del(key);
  } catch (err) {
    logger.error(`Error deleting cache for key ${key}`, err);
  }
};

module.exports = {
  redisClient,
  getCache,
  setCache,
  deleteCache,
};
