import CityDto from "@/Dto/CityDto";
import cities from "@/__test__/moks/cities.json";

describe("Test City Dto class", () => {
    let city, obj;

    beforeEach(() => {
        obj = cities[0];
        city = new CityDto(cities[0]);
    });

    it("check City Dto", ()=> {
        expect(city).toBeInstanceOf(CityDto);
        expect(city.name).toBe(obj.name);
        expect(city.code).toBe(obj.code);
        expect(city.countryCode).toBe(obj.country_code);
    });

    it("check City with Country name", ()=> {
        city.setCountryName("Индия");

        expect(city.getFullName()).toBe(`${city.name}, ${city.countryName}`);
    });
});
