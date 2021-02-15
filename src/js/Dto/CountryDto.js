export default class CountryDto {
    constructor(obj) {
        this.code = obj.code || undefined;
        this.name = obj?.name || obj?.name_translations?.en || obj.code || undefined;
        this.nameEn = obj?.name_translations?.en || obj.code;
    }
}
