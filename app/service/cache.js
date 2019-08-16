'use strict';

const Service = require('egg').Service;


class CacheService extends Service {

  // 设置值的方法
  async set(key, value, seconds) {
    value = JSON.stringify(value);
    if (this.app.redis) {
      if (!seconds) {
        await this.app.redis.set(key, value);
      } else {
        await this.app.redis.set(key, value, 'EX', seconds);

      }
    }
  }

  // 获取值的方法
  async get(key) {

    if (this.app.redis) {
      const data = await this.app.redis.get(key);
      if (!data) return;
      return JSON.parse(data);
    }
    return;
  }


}

module.exports = CacheService;
