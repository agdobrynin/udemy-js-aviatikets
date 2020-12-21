import FlightCardDto from "@/Dto/FlightCardDto";
import AirlineDto from "@/Dto/AirlineDto";
import CityDto from "@/Dto/CityDto";

export default class FavoritesStore {

    constructor(config, cache) {
        this._cacheKey = "favorites";

        this._config = config;
        this._cache = cache;
        this._favorites = {}
    }

    async init() {
        const sourceData = await Promise
            .resolve(this._cache.getValue(this._cacheKey, () => {
                return {};
            }, this._config.cache.ttl));
        Object.keys(sourceData).forEach(id => {
            const airlineDto = new AirlineDto(sourceData[id]._airline);
            const departureCityDto = new CityDto(sourceData[id]._cityDeparture);
            const destinationCityDto = new CityDto(sourceData[id]._cityDestination);
            const flightCard = new FlightCardDto(sourceData[id], airlineDto, departureCityDto, destinationCityDto, sourceData[id].currency);
            this._favorites[flightCard.id()] = flightCard;
        });
    }

    getFavorites() {
        return Object.values(this._favorites);
    }

    hasFlightCards() {
        return Boolean(Object.keys(this._favorites).length);
    }

    /**
     * @param {FlightCardDto} flightCardDto
     */
    add(flightCardDto) {
        const id = flightCardDto.id();
        if (this._favorites[id]) {
            throw Error("Рейс уже содержится в избранных");
        }
        this._favorites[id] = flightCardDto;
        this._cache.setValue(this._cacheKey, this._favorites, this._config.cache.ttl);
    }

    has(id) {
        return Boolean(this._favorites[id]);
    }

    remove(id) {
        if (this._favorites[id]) {
            delete this._favorites[id];
            this._cache.setValue(this._cacheKey, this._favorites, this._config.cache.ttl);
        }
    }
}