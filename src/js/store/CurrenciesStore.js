export default class CurrenciesStore {
    /**
     * @param {Object} config
     * @param {Element} selectElement
     * @param {Cache} cache
     */
    constructor(config, selectElement, cache) {
        this.code = {
            USD: "Доллар США",
            EUR: "Евро",
            RUB: "Рубль",
        };
        this._locale = config.locale || "ru-RU";
        this._cache = cache;

        this._selectElement = selectElement;
        Object.keys(this.code).forEach(currencyCode => {
            this._selectElement.insertAdjacentHTML("beforeend", `<option value="${currencyCode}">${this.code[currencyCode]}</option>`);
        });

        const cacheKey = "currency";
        const ttl = config.cache.ttl;

        const cacheItem = this._cache.getItem(cacheKey);
        if (!this._cache.isExpired(cacheItem)) {
            this._selectElement.value = cacheItem.value;
        }

        this._selectElement.addEventListener("change", (event) => {
            this._cache.setValue(cacheKey, event.target.value, ttl);
        });
    }

    getCurrentCurrency() {
        return this._selectElement.value;
    }

    /**
     * @param {Number} price
     * @param {String} currencyCode
     * @returns {String}
     */
    getFormatPrice(price, currencyCode) {
        return price.toLocaleString(this._locale, { style: "currency", currency: currencyCode });
    }
}
