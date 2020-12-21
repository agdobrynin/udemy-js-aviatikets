export default class CountryDto {
    constructor(obj) {
        this.code = obj.code;
        this.name = obj?.name || obj?.name_translations?.en || obj.code;
    }
}
