import FlightCardsUI from "@/views/FlightCardsUI";

export default class FavoriteUI {
    /**
     * @param {FavoritesStore} favoritesStore
     * @param {CurrenciesStore} currenciesStore
     * @param {Object} config
     * @param {Element} favoriteTicketsDiv
     */
    constructor(favoritesStore, currenciesStore, config, favoriteTicketsDiv) {
        this._favoritesStore = favoritesStore;
        this._currenciesStore = currenciesStore;
        this._config = config;
        this._favoriteTicketsDiv = favoriteTicketsDiv;
    }

    /**
     * @returns {Element}
     */
    getDestinationDiv() {
        return this._favoriteTicketsDiv;
    }

    update(callback) {
        this._favoriteTicketsDiv.innerHTML = "";

        if (this._favoritesStore.hasFlightCards()) {
            const flightCards = this._favoritesStore.getFavorites();

            flightCards.forEach(flightCard => {
                (new FlightCardsUI(flightCard, this._currenciesStore, this._config))
                    .insert(this._favoriteTicketsDiv);
            });
        }

        if (typeof callback === "function") {
            callback();
        }
    }
}
