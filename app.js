module.exports = app => {
  app.once('server', server => {
    app.logger.info('启动完成');
  });
  app.on('error', (err, ctx) => {
    app.logger.error(err);
  });
  app.sessionStore = {
    async get(key) {
      const res = await app.redis.get(key);
      if (!res) return null;
      return JSON.parse(res);
    },

    async set(key, value, maxAge) {
      maxAge = typeof maxAge === 'number' ? maxAge : ONE_DAY;
      value = JSON.stringify(value);
      await app.redis.set(key, value, 'PX', maxAge);
    },

    async destroy(key) {
      await app.redis.del(key);
    }
  };
};
