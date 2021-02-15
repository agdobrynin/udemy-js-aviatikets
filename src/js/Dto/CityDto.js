export default class CityDto {
    constructor(city, countryName = "") {
        this.code = city.code || undefined;
        this.countryCode = city?.country_code || city?.countryCode || undefined;
        this.name = city?.name || city?.name_translations?.en || city.code;
        this.nameEn = city?.name_translations?.en || city.name;
        this.countryName = countryName || city?.countryName || undefined;
    }

    setCountryName(countryName) {
        this.countryName = countryName;
    }

    getFullName() {
        return `${this.name}, ${this.countryName}`;
    }
}
