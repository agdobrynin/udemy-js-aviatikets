import AirlineDto from "@/Dto/AirlineDto";
import airlines from "@/__test__/mocks/airlines.json";

describe("Test Airline Dto class", () => {

    it("check no russian name", ()=> {
        const obj = airlines[0];
        const dto = new AirlineDto(obj);

        expect(dto).toBeInstanceOf(AirlineDto);
        expect(dto.name).toBe(obj.name_translations.en);
        expect(dto.code).toBe(obj.code);
    });

    it("check russian name", ()=> {
        const obj = airlines[1];
        const dto = new AirlineDto(obj);

        expect(dto).toBeInstanceOf(AirlineDto);
        expect(dto.name).toBe(obj.name);
        expect(dto.code).toBe(obj.code);
    });

    it("check empty input", ()=> {
        const dto = new AirlineDto({});

        expect(dto).toBeInstanceOf(AirlineDto);
        expect(dto.code).toBe(undefined);
        expect(dto.name).toBe(undefined);
    });

    it("logo airline default", ()=> {
        const obj = airlines[0];
        const dto = new AirlineDto(obj);

        expect(dto.getLogoUrl()).toBe(`http://pics.avs.io/100/100/${obj.code}.png`);
    });

    it("logo airline with 150 pix , height 200 pix", ()=> {
        const obj = airlines[1];
        const dto = new AirlineDto(obj);

        expect(dto.getLogoUrl(150, 200)).toBe(`http://pics.avs.io/150/200/${obj.code}.png`);
    });

    it("logo airline on empty object", ()=> {
        const dto = new AirlineDto({});

        expect(dto.getLogoUrl()).toBe("");
    });
});
