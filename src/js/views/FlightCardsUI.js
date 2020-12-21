export default class FlightCardsUI {

  /**
   * @param {FlightCardDto} flightCard
   * @param {CurrenciesStore} currenciesStore
   * @param {Object} config
   */
  constructor(flightCard, currenciesStore, config) {
    this._flightCard = flightCard;
    this._currenciesStore = currenciesStore;
    this._config = config;
  }

  /**
   * @param {Element} divContainer
   */
  insert(divContainer) {
    divContainer.insertAdjacentHTML('beforeend', this._renderFlightCard());
  }

  /**
   * 
   * @param {Date} date 
   * @returns {String}
   */
  formatDate(date) {
    const locale = this._config.locale || "";
    const options = this._config.dateConfig || {};

    return date.toLocaleString(locale, options);
  }

  _renderFlightCard() {
    return `
      <div class="col s12 m6 flightCard">
        <div class="card hoverable">
          <div class="card-title airline-title">
            <div class="row valign-wrapper">
              <div class="col s8 center-align">
                <h4 class="truncate tooltipped" data-position="bottom" data-tooltip="${this._flightCard.getAirLine().name.replace("\"", "&quot;")}">
                  ${this._flightCard.getAirLine().name}
                </h4>
              </div>
              <div class="col s4 airline-logo center-align">
                <img src="${this._flightCard.getAirLine().getLogoUrl()}" class="responsive-img valign" alt="${this._flightCard.getAirLine().name}">
              </div>
            </div>
          </div>
          <div class="card-content">
            <div class="row">
              <div class="col s6 center-align">
                <div>${this._flightCard.getDepartureCity()}</div>
                <div><i class="small material-icons">arrow_downward</i></div>
                <div>${this._flightCard.getDestinationCity()}</div>
              </div>
              <div class="col s6 center-align">
                <div>${this._flightCard.getDestinationCity()}</div>
                <div class="center-align"><i class="small material-icons">arrow_downward</i></div>
                <div>${this._flightCard.getDepartureCity()}</div>
              </div>
              <div class="col s6 center-align">${this.formatDate(this._flightCard.getDepartureDate())}</div>
              <div class="col s6 center-align">${this.formatDate(this._flightCard.getReturnDate())}</div>
              <div class="col s12">
                <ul class="flight-details">
                  <li><i class="material-icons">transfer_within_a_station</i> <span>Пересадок</span>: <b>${this._flightCard.transfers}</b></li>
                  <li><i class="material-icons">event_available</i> <span>Номер рейса</span>: <b>${this._flightCard.flightNumber}</b></li>
                  <li><i class="material-icons">block</i> <span>Актуален до</span>: <b>${this.formatDate(this._flightCard.getExpireDate())}</b></li>
                </ul>
              </div>
            </div>
          </div>
          <div class="card-action airline-action">
            <div class="row valign-wrapper">
              <div class="col s6">
                <h5 class="teal lighten-2 white-text ticket-price center-align">
                  ${this._currenciesStore.getFormatPrice(this._flightCard.price, this._flightCard.currency)}
                </h5>
              </div>
              <div class="col s6">
                <a class="add-to-favorite-icon btn-floating btn-small waves-effect waves-light right tooltipped" data-position="top"
                  data-tooltip="Add to favorite">
                  <i class="material-icons add-to-favorite" data-id="${this._flightCard.id()}">favorite</i>
                </a>
                <a class="remove-from-favorite-icon btn-floating btn-small waves-effect waves-light right tooltipped" data-position="top"
                  data-tooltip="Remove from favorite">
                  <i class="material-icons remove-from-favorite" data-id="${this._flightCard.id()}">favorite_border</i>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      `;
  }
}
