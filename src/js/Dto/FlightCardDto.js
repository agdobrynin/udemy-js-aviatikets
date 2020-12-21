import AirlineDto from "@/Dto/AirlineDto";
import CityDto from "@/Dto/CityDto";

export default class FlightCardDto {
    /**
     * @param {object} objFlight
     * @param {AirlineDto} airlineDto
     * @param {CityDto} departureCityDto
     * @param {CityDto} destinationCityDto
     * @param {String} currency
     */
    constructor(objFlight, airlineDto, departureCityDto, destinationCityDto, currency) {
        this.flightNumber = objFlight?.flight_number || objFlight?.flightNumber || undefined;
        this.price = objFlight.price;
        this.transfers = objFlight.transfers;
        this.currency = currency;

        if(!(airlineDto instanceof AirlineDto)) {
            throw new Error("Переданный параметр \"Авиакомпания\" не является AirlineDto");
        }
        this._airline = airlineDto;

        if(!(departureCityDto instanceof CityDto)) {
            throw new Error("Переданный параметр \"Город отправления\" не является CityDto");
        }
        this._cityDeparture = departureCityDto;

        if(!(destinationCityDto instanceof CityDto)) {
            throw new Error("Переданный параметр \"Город назначения\" не является CityDto");
        }
        this._cityDestination = destinationCityDto;

        this._dateDepartureAt = new Date(objFlight?.departure_at || objFlight?._dateDepartureAt || "");
        this._dateReturnAt = new Date(objFlight?.return_at || objFlight?._dateReturnAt || "");
        this._expiresAt = new Date(objFlight?.expires_at || objFlight?._expiresAt || "");
    }

    /**
     * @returns {String}
     */
    id() {
        const cities = `${this._cityDeparture.code}:${this._cityDestination.code}`;
        const dates = `${this._dateDepartureAt.toUTCString()}:${this._dateReturnAt.toUTCString()}`;
        const airline = `${this.flightNumber}:${this._airline.code}`;

        return `${airline}:${cities}:${dates}`;
    }

    /**
     * @returns {CityDto}
     */
    getDepartureCity() {
        return this._cityDeparture.getFullName();
    }

    /**
     * @returns {CityDto}
     */
    getDestinationCity() {
        return this._cityDestination.getFullName();
    }

    /**
     * @returns {Date}
     */
    getDepartureDate() {
        return this._dateDepartureAt;
    }

    /**
     * @returns {Date}
     */
    getReturnDate() {
        return this._dateReturnAt;
    }

    /**
     * @returns {Date}
     */
    getExpireDate() {
        return this._expiresAt;
    }

    /**
     * @returns {AirlineDto}
     */
    getAirLine() {
        return this._airline;
    }
}
