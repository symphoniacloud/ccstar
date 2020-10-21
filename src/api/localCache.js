const nodeCache = require('node-cache')

class NodeCacheCache {
    constructor(underlyingDataSource, ttl, logger) {
        this.underlyingDataSource = underlyingDataSource
        this.cache = new nodeCache({ stdTTL: ttl })
        this.cacheKey = "cacheKey"
        this.logger = logger
    }

    async getValue() {
        const cached = this.cache.get(this.cacheKey)
        if (cached === undefined) {
            this.logger.debugLog("Cache miss - generating new response")
            const newData = await this.underlyingDataSource.getLatest()
            this.cache.set(this.cacheKey, newData)
            return newData
        }
        this.logger.debugLog("Using cached response")
        return cached
    }
}

class Passthrough {
    constructor(underlyingDataSource) {
        this.underlyingDataSource = underlyingDataSource
    }

    async getValue() {
        return this.underlyingDataSource.getLatest()
    }
}

function createCache(underlyingDataSource, config, logger) {
    if (config.useLocalCache) {
        const ttl = config.localCacheTTL
        logger.debugLog(`Using local cache with TTL of ${ttl} seconds`)
        return new NodeCacheCache(underlyingDataSource, ttl, logger)
    }
    else {
        logger.debugLog("Not using any local cache")
        return new Passthrough(underlyingDataSource)
    }
}

exports.createCache = createCache
