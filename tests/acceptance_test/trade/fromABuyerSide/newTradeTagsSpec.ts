import qaHelper from "../../../../utils/qaHelper";
import loginPO from "../../../../pages/loginPO";
import tradePO from "../../../../pages/trade/tradePO";
import { initUsersAndOffers, startTrade } from "../tradeTestBase";

let offerOwner, clientUser;
let offerId;
let id_hashed;
let tag1, tag2;

describe("Trade", () => {
    describe("New trade. Offer with tags", () => {
        beforeAll(async () => {
            await init();
        });

        beforeEach(async () => {
            await tradePO.openTrade(id_hashed); // just refresh trade
        });

        afterAll(async () => {
            await qaHelper.cancelTrade(id_hashed);
        });

        it("shows tags id6542", async () => {
            expect(await tradePO.getTagsCount()).toEqual(2);
            expect(await tradePO.getNthTagsText(0)).toEqual(tag1.name);
            expect(await tradePO.getNthTagsText(1)).toEqual(tag2.name);
        });
    });
});

async function init() {
    tag1 = await qaHelper.addNewRandomTag();
    tag2 = await qaHelper.addNewRandomTag();
    ({ offerOwner, clientUser, offerId } = await initUsersAndOffers("sell", {
        tags: [tag1.id, tag2.id],
    }));
    await qaHelper.depositBond(offerOwner.id);
    id_hashed = await startTrade(clientUser.id, offerId);
    await qaHelper.payInTrade(id_hashed);
    await loginPO.logInAccount(clientUser.email);
}
