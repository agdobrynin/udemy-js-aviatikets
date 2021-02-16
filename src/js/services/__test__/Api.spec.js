import axios from "axios";
import cities from "@/__test__/moks/cities.json";
import countries from "@/__test__/moks/countries.json";
import airlines from "@/__test__/moks/airlines.json";
import priceCheap from "@/__test__/moks/prices.cheap.json";
import Api from "@/services/Api";
import config from "@/config/index";
import TicketsRequestDto from "@/Dto/TicketsRequestDto";

jest.mock("axios");

describe("Test API service", () => {
    let api;
    beforeEach(() => {
        api = new Api(config);
    });

    it("Success get cities", async () => {
        axios.get.mockReturnValueOnce({data: cities});
        const response = await api.cities();

        expect(axios.get).toBeCalledWith(`${config.endpoint}/cities`);
        expect(response).toEqual(cities);
    });

    it("Failure get cities", async () => {
        axios.get.mockRejectedValueOnce(new Error());
        await expect(api.cities()).rejects.toThrowError();
    });

    it("Success get countries", async () => {
        axios.get.mockReturnValueOnce({data: countries});
        const response = await api.countries();

        expect(axios.get).toBeCalledWith(`${config.endpoint}/countries`);
        expect(response).toEqual(countries);
    });

    it("Failure get countries", async () => {
        axios.get.mockRejectedValueOnce(new Error());
        await expect(api.countries()).rejects.toThrowError();
    });

    it("Success get airlines", async () => {
        axios.get.mockReturnValueOnce({data: airlines});
        const response = await api.airlines();

        expect(axios.get).toBeCalledWith(`${config.endpoint}/airlines`);
        expect(response).toEqual(airlines);
    });

    it("Failure get airlines", async () => {
        axios.get.mockRejectedValueOnce(new Error());
        await expect(api.airlines()).rejects.toThrowError();
    });

    it("Success get price cheap", async () => {
        axios.get.mockReturnValueOnce({data: priceCheap});
        const dto = new TicketsRequestDto(
            "KUF",
            "BAK",
            new Date("2021-02-18"),
            new Date("2021-03-18"),
            "usd"
        );
        const response = await api.prices(dto.getRequestParams());

        expect(axios.get).toBeCalledWith(
            `${config.endpoint}/prices/cheap`,
            {
                params: {
                    origin: "KUF",
                    destination: "BAK",
                    depart_date: "2021-02",
                    return_date: "2021-03",
                    currency: "usd",
                }
            }
        );

        expect(response).toEqual(priceCheap);
    });
});