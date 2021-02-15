import LocationStore, {LocationStore as LocationStoreClass} from "@/store/LocationStore";
import Cache from "@/services/Cache";
import Api from "@/services/Api";
import cities from "@/__test__/moks/cities.json";
import countries from "@/__test__/moks/countries.json";
import airlines from "@/__test__/moks/airlines.json";
import CountryDto from "@/Dto/CountryDto";
import CityDto from "@/Dto/CityDto";
import AirlineDto from "@/Dto/AirlineDto";


describe("Test LocationStore class base function", () => {

    let locationStore;

    beforeEach(() => {
        locationStore = new LocationStoreClass(Api, {}, new Cache());
    });

    it("Check is LocationStore", () => {
        expect(LocationStore).toBeInstanceOf(LocationStoreClass);
    });

    it("Check is class LocationStore created success", () => {
        expect(locationStore.countries).toBe(null);
        expect(locationStore.cities).toBe(null);
        expect(locationStore.citiesForAutocomplete).toEqual({});
        expect(locationStore.config).toEqual({});
        expect(locationStore.cache).toBeInstanceOf(Cache);
    });

    it("Check first init method, expect throw error", () => {
        expect(() => locationStore.getCities()).toThrow();
        expect(() => locationStore.getAirlines()).toThrow();
        expect(() => locationStore.getCountries()).toThrow();
    });

    it("Check countries, cities, airlines serialize", () => {
        locationStore.countries = locationStore._serializeCountries(countries);
        expect(locationStore.countries["AZ"]).toBeInstanceOf(CountryDto);
        expect(locationStore.countries["AZ"].name).toBe("Азербайджан");
        expect(locationStore.countries["AZ"].nameEn).toBe("Azerbaijan");

        locationStore.cities = locationStore._serializeCities(cities);
        expect(locationStore.cities["BAK"]).toBeInstanceOf(CityDto);
        expect(locationStore.cities["BAK"].name).toBe("Баку");
        expect(locationStore.cities["BAK"].nameEn).toBe("Baku")
        expect(locationStore.cities["BAK"].countryName).toBe("Азербайджан");

        locationStore.airlines = locationStore._serializeAirlines(airlines);
        expect(locationStore.airlines["B2"]).toBeInstanceOf(AirlineDto);
        expect(locationStore.airlines["B2"].name).toBe("Белавиа");

        // Получение кода города вылета по полному имени "Город, Страна".
        const departureFullName = Object.keys(locationStore.getCitiesForAutocomplete())[0];
        expect(locationStore.getCityCodeByAutocompleteName(departureFullName)).toBe("BAK");
    });
});

describe("Test async init method", () => {
    const api = {
        cities: ()  => Promise.resolve(cities),
        countries: () => Promise.resolve(countries),
        airlines: () => Promise.resolve(airlines),
    };

    const store = new LocationStoreClass(api);

    it("compare result DTOs", async ()=> {
        await store.init();

        const countryRu = store.getCountries()["RU"];

        expect(countryRu.code).toBe("RU");
        expect(countryRu.name).toBe("Россия");
        expect(countryRu.nameEn).toBe("Russia");

        const cityDto = store.getCities()["KUF"];

        expect(cityDto.getFullName()).toBe(`${cityDto.name}, ${cityDto.countryName}`);
        expect(cityDto.code).toBe("KUF");
        expect(cityDto.name).toBe("Самара");
        expect(cityDto.countryName).toBe("Россия");

        const airlineDto = store.getAirlines()["SU"];

        expect(airlineDto.code).toBe("SU");
        expect(airlineDto.name).toBe("Аэрофлот");
        expect(airlineDto.nameEn).toBe("Aeroflot");
        expect(airlineDto.getLogoUrl()).toEqual(expect.stringMatching(/\/100\/100\/SU\.png$/));
    });
})