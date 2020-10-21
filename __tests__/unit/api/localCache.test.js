const {test, expect} = require("@jest/globals"),
    localCache = require('../../../src/api/localCache.js'),
    utils = require('../../../src/common/utils')

const logger = new utils.Logger()

class stubDataSource {
    constructor() {
        this.callCount = 0;
    }

    getLatest() {
        return `Hello ${this.callCount++}`
    }
}

test("dont cache", async () => {
    const cache = localCache.createCache(new stubDataSource(), {useLocalCache: false}, logger)

    expect(await cache.getValue()).toEqual("Hello 0")
    expect(await cache.getValue()).toEqual("Hello 1")
})

test("cache with long TTL", async () => {
    const cache = localCache.createCache(new stubDataSource(), {useLocalCache: true, localCacheTTL: 10}, logger)

    expect(await cache.getValue()).toEqual("Hello 0")
    expect(await cache.getValue()).toEqual("Hello 0")
})

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

test("cache with short TTL", async () => {
    const cache = localCache.createCache(new stubDataSource(), {useLocalCache: true, localCacheTTL: 1}, logger)

    expect(await cache.getValue()).toEqual("Hello 0")
    await sleep(2000)
    expect(await cache.getValue()).toEqual("Hello 1")
})

