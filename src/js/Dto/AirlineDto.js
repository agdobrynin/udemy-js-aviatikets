export default class AirlineDto {
    constructor(obj) {
        this.code = obj?.code || undefined;
        this.name = obj?.name || obj?.name_translations?.en || undefined;
        this.nameEn = obj?.name_translations?.en || obj?.nameEn || undefined;
    }

    getLogoUrl(width = 100, height = 100) {
        if (undefined === this.code) {
            return "";
        }

        return `http://pics.avs.io/${width}/${height}/${this.code}.png`;
    }
}
