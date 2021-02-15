import Api from "@/sevices/Api";
import AirlineDto from "@/Dto/AirlineDto";
import Cache from "@/sevices/Cache";
import CityDto from "@/Dto/CityDto";
import CountryDto from "@/Dto/CountryDto";
import FlightCardDto from "@/Dto/FlightCardDto";
import Config from "@/config";

export class LocationStore {
    /**
     *
     * @param {Api} api
     * @param {object} config
     * @param {Cache} cache
     */
    constructor(api, config = {}, cache = null) {
        this.api = api;
        this.config = config;
        this.cache = cache;
        this.countryCacheKey = "countries";
        this.countries = null;
        this.citiesCacheKey = "cities";
        this.cities = null;
        this.citiesForAutocomplete = {};
        this.airlinesCacheKey = "airlines";
        this._searchResultWithFlightCards = {};
    }

    async init() {
        const ttlDefault = this.config?.cache?.ttl || 0;
        const ttlAirlines = this.config?.cache?.ttlAirlines || 0;

        const response = await Promise.all([
            this.cache?.getValue(this.countryCacheKey, () => this.api.countries(), ttlDefault) || this.api.countries(),
            this.cache?.getValue(this.citiesCacheKey, () => this.api.cities(), ttlDefault) || this.api.cities(),
            this.cache?.getValue(this.airlinesCacheKey, () => this.api.airlines(), ttlAirlines) || this.api.airlines(),
        ]);

        const [countries, cities, airlines] = response;

        // Первым инициализируем страны так как нам нужны коды стран для городов
        this.countries = this._serializeCountries(countries);
        this.cities = this._serializeCities(cities);
        this.airlines = this._serializeAirlines(airlines);

        return response;
    }

    _serializeCountries(countries) {
        return countries.reduce((acc, country) => {
            const objCountry = new CountryDto(country);
            acc[objCountry.code] = objCountry;
            return acc;
        }, {});
    }

    _serializeCities(cities) {
        return cities.reduce((acc, city) => {
            const objCity = new CityDto(city);
            objCity.setCountryName(this.countries[objCity.countryCode]?.name);
            acc[objCity.code] = objCity;

            return acc;
        }, {});
    }

    _serializeAirlines(airlines) {
        return airlines.reduce((acc, airline) => {
            const airlineObj = new AirlineDto(airline);
            if (airlineObj.code) {
                acc[airlineObj.code] = airlineObj;
            }

            return acc;
        }, {});
    }

    getCities() {
        if (null === this.cities) {
            throw new Error("First call LocalStore.init()");
        }

        return this.cities;
    }

    getAirlines() {
        if (null === this.cities) {
            throw new Error("First call LocalStore.init()");
        }

        return this.airlines;
    }

    /**
     * @param {TicketsRequestDto} TicketsRequestDto
     * @returns {Promise<FlightCardDto[]>}
     */
    async fetchTickets(TicketsRequestDto) {
        const prices = await this.api.prices(TicketsRequestDto.getRequestParams());

        this._searchResultWithFlightCards = {};
        const flightCards = Object.values(prices.data).map(flightItem => {
            const airline = this.getAirlines()[flightItem.airline];
            const departureCity = this.getCities()[flightItem.origin];
            const destinationCity = this.getCities()[flightItem.destination];

            const flightCard = new FlightCardDto(flightItem, airline, departureCity, destinationCity, prices.currency);
            this._searchResultWithFlightCards[flightCard.id()] = flightCard;

            return flightCard;
        });

        return Promise.resolve(flightCards);
    }

    getSearchResultWithFlightCards() {
        return this._searchResultWithFlightCards;
    }

    getCountries() {
        if (null === this.countries) {
            throw new Error("First call LocalStore.init()");
        }

        return this.countries;
    }

    getCitiesForAutocomplete() {
        return Object.values(this.cities).reduce((acc, objCity) => {
            acc[objCity.getFullName()] = null;
            return acc;
        }, {});
    }

    getCityCodeByAutocompleteName(fullName) {

        if ("" === fullName.trim()) {
            throw new Error("Не установлен город");
        }

        if (null === this.cities) {
            throw new Error("Dictionary cities not loaded from API. First initialize the app");
        }

        const findObjCity = Object.values(this.cities).find(cityDto => cityDto.getFullName() === fullName);

        if (!(findObjCity instanceof CityDto)) {
            throw new Error(`City CODE not found by full name "${fullName}"`);
        }

        return findObjCity.code;
    }
}

export default new LocationStore(new Api(Config), Config, new Cache());
