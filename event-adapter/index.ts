import Events from "events";
import { RedisClientType } from "redis";

export default class RedisEventAdapter extends Events {
    
  public readonly adapter: RedisClientType;

  constructor(adapter: RedisClientType) {
    super(Events);
    this.adapter = adapter;

    const self = this;

    this.on("set-cache", async function (key: string, value: string) {
      await self.adapter.setEx(key, 3600, value);
    });
  }

  async get(key: string) {

    const value = await this.adapter.get(key);

    if (value == null) return Promise.reject();

    return value;

  }
}
