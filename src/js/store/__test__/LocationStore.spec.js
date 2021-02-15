import LocationStore, {LocationStore as LocationStoreClass} from "@/store/LocationStore";
import Api from "@/sevices/Api";

describe("Test LocationStore class", () => {
    it("Check is LocationStore", () => {
        expect(LocationStore).toBeInstanceOf(LocationStoreClass);
    });
});
