import qaHelper from "../../../../utils/qaHelper";
import loginPO from "../../../../pages/loginPO";
import tradePO from "../../../../pages/trade/reactTradePO";
import { initUsersAndOffers, startTrade } from "../tradeTestBase";

let offerOwner, clientUser;
let offerId;
let id_hashed;

// passed
describe("Trade", () => {
    describe("New trade by inexperienced trader", () => {
        beforeAll(async () => {
            await init();
        });

        beforeEach(async () => {
            await tradePO.openTrade(id_hashed); // just refresh trade
        });

        afterAll(async () => {
            await qaHelper.cancelTrade(id_hashed);
        });

        it("does not show a low reputation attention in case of good reputation id6505", async () => {
            expect(await tradePO.elements.lowReputationWarning.isPresent()).toBeFalsy();
        });
    });
});

async function init() {
    ({ offerOwner, clientUser, offerId } = await initUsersAndOffers("sell"));
    await qaHelper.depositBond(offerOwner.id);
    await makeAVendorHaveGoodReputation(offerOwner.id);
    id_hashed = await startTrade(clientUser.id, offerId);
    await loginPO.logInAccount(clientUser.email);
}

// https://paxful.atlassian.net/browse/BRAVO-586
async function makeAVendorHaveGoodReputation(userId: number): Promise<void> {
    await qaHelper.updateUserStats(userId, 28, 14, 10, 20);
}
