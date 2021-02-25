describe("Form", () => {
    before(() => {
        cy.intercept('GET', "/countries", { fixture: "countries.json"}).as("getCountries");
        cy.intercept('GET', "/cities", { fixture: "cities.json"}).as("getCities");
        cy.intercept('GET', "/airlines", { fixture: "airlines.json"}).as("getAirlines");

        cy.visit("http://localhost:9000");
        cy.wait(["@getCountries", "@getCities", "@getAirlines"]);
    });

    it("Search form is visible", () => {
        cy.get("[data-hook=searchForm]").should("be.visible");
    });

    it("Favorite menu", () => {
        cy.get("[data-target=favorite-tickets]").click().then(() => {
            cy.get("#favorite-tickets").should("be.visible");
        });
    });

    it("Cities is available in autocomplete fields", () => {
        cy.get("[name=city-departure]").as("originCity");
        cy.get("[name=city-destination]").as("destinationCity");

        const cityOrigin = "Самара,";
        const foundCityOrigin = "Самара, Россия";
        cy.get("@originCity").type(cityOrigin).then((el) => {
            const autocompleteId = el.attr("data-target");

            cy.get(`ul#${autocompleteId} li span.highlight`)
                .should("contain.text", cityOrigin)
                .click();

            cy.get("@originCity").should("have.value", foundCityOrigin);
        });

        const destOrigin = "Баку,";
        const foundCityDestOrigin = "Баку, Азербайджан";
        cy.get("@destinationCity").type(destOrigin).then((el) => {
            const autocompleteId = el.attr("data-target");
            cy.get(`ul#${autocompleteId} li span.highlight`)
                .should("contain.text", destOrigin)
                .click();

            cy.get("@destinationCity").should("have.value", foundCityDestOrigin);
        });
    });

    it("Date picker test", () => {
        const dateToday = new Date();
        cy.get("[name=date-departure]").as("dateDeparture");
        cy.get("[name=date-return]").as("dateReturn");
        cy.get(".datepicker-modal").as("datePickerModal");

        cy.get("@datePickerModal").should("be.not.visible");
        cy.get("@dateDeparture").click().then(() => {
            cy.get("@datePickerModal").should("be.visible");
            cy.get("@datePickerModal")
                .get(`td[data-day=${dateToday.getDate()}]`)
                .should("have.class", "is-today")
                .should("have.class","is-selected");

            // Следующий месяц.
            cy.get("@datePickerModal").get(".month-next").click().then(() => {
                cy.get("@datePickerModal").get("button.datepicker-day-button").then((el) => {
                    // Первый день в следующем месяце
                    const firstDayInDatePicker = el[0];
                    // data-month аттрибут должен быть +1 от текущего месяца
                    expect(dateToday.getMonth() + 1 === +firstDayInDatePicker.dataset.month).to.be.true;
                    cy.get("@datePickerModal").then((elDatePicker) => {
                        const selectedMonth = elDatePicker[0].querySelector("select.orig-select-month option[selected]").text;
                        const dateAsString = `${selectedMonth}, ${firstDayInDatePicker.dataset.year}`;
                        // Выбрать дату на первом каледнаре
                        el.click();
                        cy.get("@datePickerModal").should("be.not.visible");

                        cy.get("@dateDeparture").then((el) => {
                            expect(el.val()).equal(dateAsString);
                        });

                        cy.get("@dateReturn").then((el) => {
                            expect(el.val()).equal(dateAsString);
                        });
                    });
                });
            });
        });
    });

    it("Currencies selector", () => {
        cy.get("[data-hook=currency] .dropdown-trigger").as("currencyMaterializeSelect");
        cy.get("[data-hook=currency] ul").as("currenciesDropDownList");
        cy.get("[data-hook=currency] select").as("currencySelect");
        const currenciesCode = {
            EUR: "Евро",
            RUB: "Рубль",
            USD: "Доллар США",
        };

        cy.get("@currencyMaterializeSelect").then((el) => {
            el.click();
            cy.get("@currenciesDropDownList").should("be.visible");

            Object.keys(currenciesCode).forEach((currencyCode) => {
                const currencyTitle = currenciesCode[currencyCode];

                cy.get("@currenciesDropDownList").get("li").contains(new RegExp(`^${currencyTitle}\$`)).click().then(() => {
                    expect(el.val()).equal(currencyTitle);
                    cy.get("@currencySelect").then((el) => expect(el.val()).equal(currencyCode));
                });
            });
        });
    });
});
