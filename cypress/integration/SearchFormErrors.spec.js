describe("Form Errors", () => {
    before(() => {
        cy.intercept('GET', "/countries", {fixture: "countries.json"}).as("getCountries");
        cy.intercept('GET', "/cities", {fixture: "cities.json"}).as("getCities");
        cy.intercept('GET', "/airlines", {fixture: "airlines.json"}).as("getAirlines");

        cy.visit("http://localhost:9000");
        cy.wait(["@getCountries", "@getCities", "@getAirlines"]);
    });

    it("Empty Cities", () => {
        cy.get("[data-hook=searchForm]").submit().then(() => {
            cy.get("#toast-container .toast").contains("Не установлен город");
        });
    });

    it("Not valid origin city", () => {
        cy.get("[name=city-departure]").as("originCity");

        cy.get("@originCity").clear().type("mmm");
        cy.get("[data-hook=searchForm]").submit().then(() => {
            cy.get("#toast-container .toast").contains("\"mmm\"");
        });
    });

    it("Not valid destination city", () => {
        cy.get("[name=city-departure]").as("originCity");
        cy.get("[name=city-destination]").as("destinationCity");

        cy.get("@originCity").clear().type("Самара, Россия");
        cy.get("@destinationCity").type("zzz");
        cy.get("[data-hook=searchForm]").submit().then(() => {
            cy.get("#toast-container .toast").contains("\"zzz\"");
        });
    });

    it("Flight not found", () => {
        cy.intercept('GET', "/prices/cheap", {fixture: "prices.cheap.empty.json"}).as("cheap");

        cy.get("[name=city-departure]").as("originCity");
        cy.get("[name=city-destination]").as("destinationCity");

        cy.get("@originCity").clear().type("Самара, Россия");
        cy.get("@destinationCity").clear().type("Баку, Азербайджан");
        cy.get("[data-hook=searchForm]").submit().then(() => {
            cy.wait("@cheap");
            cy.get("#toast-container .toast").contains("Рейсов не найдено");
        });
    });
});
