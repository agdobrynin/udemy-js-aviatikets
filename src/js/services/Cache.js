export default class Cache {
    constructor() {
        // TODO придумай проверку если не поддерживает localStorage
        this.localStorage = window?.localStorage;
    }

    /**
     * @param {String} key 
     * @returns {CacheItem}
     */
    getItem(key) {
        const item = this.localStorage.getItem(key);
        if (null === item) {
            return new CacheItem();
        }

        return new CacheItem(JSON.parse(item));
    }

    /**
     * @param {CacheItem} cacheItem 
     */
    isExpired(cacheItem) {
        return Date.now() > cacheItem.expireAt;
    }

    async getValue(key, callback, ttl = 60000) {

        const cacheTtl = parseInt(ttl) || 0;

        if (0 === cacheTtl) {
            return Promise.resolve(await callback());
        }

        const cacheItem = this.getItem(key);

        if (!this.isExpired(cacheItem)) {
            return Promise.resolve(cacheItem.value);
        }

        const response = await callback();
        this.setValue(key, response, cacheTtl);

        return Promise.resolve(response);
    }

    setValue(key, value, ttl = 60000) {
        const cacheTtl = parseInt(ttl) || 0;
        if (0 === cacheTtl) {
            throw new Error(`Can't set cache with ttl value = ${cacheTtl}`);
        }

        const cacheItem = new CacheItem();
        cacheItem.expireAt = Date.now() + cacheTtl;
        cacheItem.value = value;

        this.localStorage.setItem(key, JSON.stringify(cacheItem.getItem()));
    }
}

class CacheItem {
    constructor(obj = {}) {
        this.expireAt = obj?.expireAt || 0;
        this.value = obj?.value || {};
    }

    setValue(value) {
        this.value = value;
    }

    getItem() {
        return {
            expireAt: this.expireAt,
            value: this.value,
        }
    }
}
