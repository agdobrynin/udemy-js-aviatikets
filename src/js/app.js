import "@styles/main.css";

import { initMaterialize } from "@/libs/materialize";
import store from "@/store/LocationStore";
import FormUI from "@/views/FormUI";
import TicketsRequestDto from "@/Dto/TicketsRequestDto";
import FlightCardsUI from "@/views/FlightCardsUI";
import config from "@/config";
import CurrenciesStore from "@/store/CurrenciesStore";
import Cache from "@/sevices/Cache";
import FavoritesStore from "@/store/FavoritesStore";
import FavoriteUI from "@/views/FavoriteUI";


document.addEventListener("DOMContentLoaded", async () => {
    const form = document.forms["search-tickets"];
    const selectCurrency = document.querySelector("select[name='currency']");
    const ticketsResultSearch = document.querySelector("div#aviatikets-search-result");
    const favoriteTicketsDiv = document.querySelector("#favorite-tickets");
    const preloaderDiv =  document.querySelector("#loader");

    // Инициализация
    const cache = new Cache();
    const favoriteStore = new FavoritesStore(config, cache);
    const currencies = new CurrenciesStore(config, selectCurrency, cache);

    const formUI = new FormUI(form, form["city-departure"], form["city-destination"], form["date-departure"], form["date-return"]);
    const favoriteUI = new FavoriteUI(favoriteStore, currencies, config, favoriteTicketsDiv);

    initApp(formUI, favoriteUI);
    initMaterialize(cache);

    // Events
    form.addEventListener("submit", (event) => {
        event.preventDefault();
        onFormSubmit(formUI);
    });
    ticketsResultSearch.addEventListener("click", addToFavorite);
    favoriteTicketsDiv.addEventListener("click", removeFromFavorite);

    // Handles
    /**
     * @param {FormUI} formUI
     * @param {FavoriteUI} favoriteUI
     */
    async function initApp(formUI, favoriteUI) {
        try {
            formUI.disableForm();
            formUI.loading(true, preloaderDiv);
            await store.init()
            formUI.setAutocompliteData(store.getCitiesForAutocomplete());
            await favoriteStore.init();
            favoriteUI.update(() =>
                M.Tooltip.init(favoriteUI.getDestinationDiv().querySelectorAll(".tooltipped"))
            );
            formUI.undisableForm();
        } catch (error) {
            //TODO сделать обработку ошибки
            M.toast({ html: error.message, classes: 'red', displayLength: 10000 });
        } finally {
            formUI.loading(false, preloaderDiv);
        }
    }

    /**
     * @param {Event} event
     */
    function addToFavorite(event) {
        if (event.target?.classList.contains("add-to-favorite")) {
            const flightCardId = event.target?.dataset?.id || "";
            if (flightCardId) {
                try {
                    favoriteStore.add(store.getSearchResultWithFlightCards()[flightCardId]);
                    M.toast({ html: "Рейс добавлен в избранное", classes: "blue"});
                    favoriteUI.update(() =>
                        M.Tooltip.init(favoriteUI.getDestinationDiv().querySelectorAll(".tooltipped"))
                    );
                } catch (e) {
                    M.toast({ html: e.message, classes: "red"});
                }
            }
        }
    }

    /**
     * @param {Event} event
     */
    function removeFromFavorite(event) {
        if (event.target?.classList.contains("remove-from-favorite")) {
            const flightCardId = event.target?.dataset?.id || "";
            if (flightCardId) {
                favoriteStore.remove(flightCardId);
                M.Tooltip.getInstance(event.target.closest("a")).destroy();
                M.toast({ html: "Рейс удален из избранного", classes: "teal lighten-2"});
                favoriteUI.update(() =>
                    M.Tooltip.init(favoriteUI.getDestinationDiv().querySelectorAll(".tooltipped"))
                );
            }
        }
    }
    /**
     * @param {FormUI} formUI
     */
    async function onFormSubmit(formUI) {
        try {
            formUI.loading(true, preloaderDiv);
            const ticketsRequestDto = new TicketsRequestDto(
                store.getCityCodeByAutocompleteName(formUI.getCityDeparture()),
                store.getCityCodeByAutocompleteName(formUI.getCityDestination()),
                formUI.getDateDeparture(),
                formUI.getDateReturn(),
                currencies.getCurrentCurrency(),
            );
            formUI.disableForm();
            const flightCards = await store.fetchTickets(ticketsRequestDto);

            ticketsResultSearch.innerHTML = "";
            if (0 === flightCards.length) {
                M.toast({ html: "Рейсов не найдено.", classes: "blue", displayLength: 5000 });
            }

            flightCards.forEach(flightCard => {
                (new FlightCardsUI(flightCard, currencies, config)).insert(ticketsResultSearch);
                M.Tooltip.init(ticketsResultSearch.querySelectorAll(".tooltipped"));
            });

            formUI.undisableForm();
        } catch (error) {
            //TODO сделать обработку ошибки
            M.toast({ html: error.message, classes: 'red', displayLength: 10000 });
        } finally {
            formUI.loading(false, preloaderDiv);
        }
    }
});
