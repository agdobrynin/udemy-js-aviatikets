import { getDatepickerInstance, getAutocompleteInstance } from "@/libs/materialize";

export default class FormUI {
    /**
     * @param {HTMLFormElement} form 
     * @param {HTMLInputElement} inputDeparture 
     * @param {HTMLInputElement} inputDestination 
     * @param {HTMLInputElement} inputDateDeparture 
     * @param {HTMLInputElement} inputDateReturn 
     */
    constructor(form, inputDeparture, inputDestination, inputDateDeparture, inputDateReturn) {
        this._form = form;
        this._buttons = Array.from(form.querySelectorAll("button"));

        this._inputDeparture = inputDeparture;
        this._inputDestination = inputDestination;
        this._inputDateDeparture = inputDateDeparture;
        this._inputDateReturn = inputDateReturn;

        this._fields = [
            this._inputDeparture,
            this._inputDestination,
            this._inputDateDeparture,
            this._inputDateReturn,
        ];
    }

    setCurrencySelect(selectElement) {
        this._currencySelect = selectElement;
    }

    getCurrencyValue() {
        return this._currencySelect?.value || "USD";
    }

    /**
     * @returns {HTMLFormElement}
     */
    getForm() {
        return this._form;
    }

    disableForm() {
        [...this._fields, ...this._buttons].forEach(field => {
            field.setAttribute("disabled", "disabled");
        });
    }

    undisableForm() {
        [...this._fields, ...this._buttons].forEach(field => {
            field.removeAttribute("disabled");
        });
    }

    /**
     * @param {Boolean} isLoading
     * @param {Element} loaderDiv
     */
    loading(isLoading = true, loaderDiv) {
        if (isLoading) {
            loaderDiv.classList.remove("hide")
        } else {
            loaderDiv.classList.add("hide");
        }
    }

    /**
     * @returns {String}
     */
    getCityDeparture() {
        return this._inputDeparture.value;
    }

    /**
     * @returns {String}
     */
    getCityDestination() {
        return this._inputDestination.value;
    }

    /**
     * @returns {Date}
     */
    getDateDeparture() {
        return getDatepickerInstance(this._inputDateDeparture).date;
    }

    /**
     * @returns {Date}
     */
    getDateReturn() {
        return getDatepickerInstance(this._inputDateReturn).date;
    }

    setAutocompliteData(data) {
        getAutocompleteInstance(this._inputDeparture).updateData(data);
        getAutocompleteInstance(this._inputDestination).updateData(data);
    }
}
