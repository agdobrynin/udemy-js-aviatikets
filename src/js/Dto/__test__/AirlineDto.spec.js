import AirlineDto from "@/Dto/AirlineDto";

const obj = {
    code: "MSK",
    name: "Москва",
    nameEn: "Moscow",
};

const objNoRus = {
    name_translations: {
        en: "Moskwa",
    }
}

describe("Test Airline Dto class", () => {
    it("check russian name", ()=> {
        expect((new AirlineDto(obj)).name).toBe(obj.name);
    });

    it("check english name", ()=> {
        expect((new AirlineDto(obj)).nameEn).toBe(obj.nameEn);
    });

    it("check no russian name", ()=> {
        expect((new AirlineDto(objNoRus)).name).toBe(objNoRus.name_translations.en);
    });

    it("check empty input", ()=> {
        const dto = new AirlineDto({});
        expect(dto.code).toBe(undefined);
        expect(dto.name).toBe(undefined);
    });

    it("logo airline default", ()=> {
        const dto = new AirlineDto(obj);
        expect(dto.getLogoUrl()).toBe(`http://pics.avs.io/100/100/${obj.code}.png`);
    });

    it("logo airline with 150 pix , height 200 pix", ()=> {
        const dto = new AirlineDto(obj);
        expect(dto.getLogoUrl(150, 200)).toBe(`http://pics.avs.io/150/200/${obj.code}.png`);
    });

    it("logo airline on empty object", ()=> {
        const dto = new AirlineDto({});
        expect(dto.getLogoUrl()).toBe("");
    });
});
