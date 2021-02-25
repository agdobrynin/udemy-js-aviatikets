describe("Form search success", () => {
    beforeEach(() => {
        cy.intercept('GET', "/countries", {fixture: "countries.json"}).as("getCountries");
        cy.intercept('GET', "/cities", {fixture: "cities.json"}).as("getCities");
        cy.intercept('GET', "/airlines", {fixture: "airlines.json"}).as("getAirlines");
        cy.intercept('GET', "/prices/cheap", {fixture: "prices.cheap.json"}).as("cheap");

        cy.visit("http://localhost:9000");
        cy.wait(["@getCountries", "@getCities", "@getAirlines"]);
    });

    it("Success search and Flight Cards is correct", () => {

        const originCityTitle = "Самара, Россия";
        const destinationCityTitle = "Баку, Азербайджан";

        cy.get("[name=city-departure]").as("originCity");
        cy.get("[name=city-destination]").as("destinationCity");
        cy.get("#aviatikets-search-result").as("searchResult");

        cy.get("@originCity").type(originCityTitle);
        cy.get("@destinationCity").type(destinationCityTitle);
        cy.get("[data-hook=searchForm]").submit().then(async () => {
            cy.wait("@cheap");
            cy.get("@searchResult").get(".flightCard").then((flightCards) => {
                cy.wrap(flightCards).its('length').should("equal", 3);

                Array.from(flightCards).forEach((flightCard) => {
                    // Не пустой заголовок авиа компании.
                    const airlineTitle = flightCard.querySelector(".airline-title h4");
                    expect(airlineTitle.innerText !== "").true;

                    // Есть лого авиа компании.
                    const airlineLogo = flightCard.querySelector(".airline-title .airline-logo img");
                    expect(/\/\w\w\.png$/.test(airlineLogo.src)).true;

                    // Города вылета
                    const cityDeparture = flightCard.querySelector(".card-content .col div:first-child").innerText;
                    const cityDestination = flightCard.querySelector(".card-content .col div:last-child").innerText;
                    expect(cityDeparture === originCityTitle).true;
                    expect(cityDestination === destinationCityTitle).true;

                    // Цена рейса
                    const price = flightCard.querySelector(".airline-action .ticket-price").innerText;
                    expect(parseFloat(price) > 0).true;

                    // Детали рейса
                    const flightDetailsLis = flightCard.querySelectorAll("ul.flight-details li");
                    expect(flightDetailsLis.length >= 3).true;
                });
            });
        });
    });

    it("Success search and Favorite", () => {

        const originCityTitle = "Самара, Россия";
        const destinationCityTitle = "Баку, Азербайджан";

        cy.get("[name=city-departure]").as("originCity");
        cy.get("[name=city-destination]").as("destinationCity");
        cy.get("#aviatikets-search-result").as("searchResult");
        cy.get("[data-target=favorite-tickets]").as("favorites")
        cy.get("#favorite-tickets").as("favoritesResult")

        cy.get("@originCity").type(originCityTitle);
        cy.get("@destinationCity").type(destinationCityTitle);

        // Фавориты пусто.
        cy.get("@favorites").get(".flightCard").should("not.exist");

        cy.get("[data-hook=searchForm]").submit().then(async () => {
            cy.wait("@cheap");
            cy.get("@searchResult").get(".flightCard:first .add-to-favorite-icon").click();

            // В фавориты добавлена карточка.
            cy.get("#toast-container .toast:first").contains("Рейс добавлен в избранное");
            cy.get("@favorites").get(".flightCard").should("exist");

            // Убрать из фаворитов первую карточку.
            cy.get("@favorites").click();
            cy.get("@favoritesResult").should("be.visible");
            cy.get("@favoritesResult").find(".flightCard:first .remove-from-favorite-icon").click();
            cy.get("@favoritesResult").find(".flightCard").should("not.exist");
            cy.get("#toast-container .toast").contains("Рейс удален из избранного");
            cy.get(".sidenav-overlay").click();
            cy.get("@favoritesResult").should("be.not.visible");
        });
    });
});
