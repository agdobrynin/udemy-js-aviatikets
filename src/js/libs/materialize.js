import "materialize-css/dist/css/materialize.min.css";
import "materialize-css/dist/js/materialize.min.js";
import config from "@/config";

const prefixCache = "cities-autocomplete:";
const ttlCacheCityDefault = 86400000;

/**
 * @param {HTMLInputElement} input 
 * @returns {String}
 */
function cacheKey(input) {
    return `${prefixCache}${input.name}`;
}

/**
 * 
 * @param {Cache} cache 
 */
export function initMaterialize(cache) {
    const selects = document.querySelectorAll("select");
    M.FormSelect.init(selects);

    const autocomplites = document.querySelectorAll(".autocomplete");
    M.Autocomplete.init(autocomplites, {
        limit: 10,
        minLength: 3,
        onAutocomplete: function () {
            cache.setValue(cacheKey(this.el), this.el.value, ttlCacheCityDefault);
        }
    });

    Array.from(autocomplites).forEach(input => {
        const cacheItem = cache.getItem(cacheKey(input));
        if (!cache.isExpired(cacheItem)) {
            input.value = cacheItem.value;
        }
    });

    const dates = document.querySelectorAll('.datepicker');
    M.Datepicker.init(dates, {
        i18n: config.datePickerI18n || {},
        showClearBtn: true,
        format: "mmmm, yyyy",
        minDate: new Date(),
        setDefaultDate: true,
        defaultDate: new Date(),
        autoClose: true,
        onSelect: function (date) {
            if (this.el.name === "date-departure") {
                const dateReturn = getDatepickerInstance(document.querySelector("[name='date-return']"));
                dateReturn.options.minDate = date;
                dateReturn.setDate(date);
                dateReturn.setInputValue();
            }
        }
    });

    M.Sidenav.init(document.querySelector('#favorite-tickets'));

    const tooltips = document.querySelectorAll('.tooltipped');
    M.Tooltip.init(tooltips);
}

export function getAutocompleteInstance(elem) {
    return M.Autocomplete.getInstance(elem);
}

export function getDatepickerInstance(elem) {
    return M.Datepicker.getInstance(elem);
}
