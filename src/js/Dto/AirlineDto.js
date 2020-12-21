export default class AirlineDto {
    constructor(obj) {
        this.code = obj.code;
        this.name = obj?.name || obj?.name_translations?.en || "Неопределеное";
        this.nameEn = obj?.name_translations?.en || obj?.nameEn ||"Not defined english name";
    }

    getLogoUrl(width = 100, height = 100) {
        return `http://pics.avs.io/${width}/${height}/${this.code}.png`;
    }
}
