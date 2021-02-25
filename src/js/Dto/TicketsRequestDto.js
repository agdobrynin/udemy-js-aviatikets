export default class TicketsRequestDto {
    /**
     * @param {String} cityDepartureCode
     * @param {String} cityDestinationCode
     * @param {Date} dateDeparture
     * @param {Date} dateReturn
     * @param {String} currency
     */
    constructor(cityDepartureCode, cityDestinationCode, dateDeparture, dateReturn, currency) {
        this._cityDepartureCode = cityDepartureCode;
        this._cityDestinationCode = cityDestinationCode;
        this._dateDeparture = dateDeparture;
        this._dateReturn = dateReturn;
        this._currency = currency;
    }

    getRequestParams() {

        const [dateDeparture, dateReturn] = [this._dateDeparture ||  new Date(), this._dateReturn || new Date()];

        const [monthDeparture, monthReturn] = [
            `${dateDeparture.getMonth() + 1}`.padStart(2, "0"),
            `${dateReturn.getMonth() + 1}`.padStart(2, "0")
        ];

        return {
            origin: this._cityDepartureCode,
            destination: this._cityDestinationCode,
            depart_date: `${dateDeparture.getFullYear()}-${monthDeparture}`,
            return_date: `${dateReturn.getFullYear()}-${monthReturn}`,
            currency: this._currency,
        };
    }
}
