import qaHelper from "../../../../utils/qaHelper";
import loginPO from "../../../../pages/loginPO";
import tradePO from "../../../../pages/trade/tradePO";
import {
    initUsersAndOffers,
    makeAUserExperienced,
    startTrade,
} from "../tradeTestBase";

let offerOwner, clientUser;
let offerId;

let id_hashed;

describe("Trade", () => {
    // destructive actions
    describe("Deferred escrow trade", () => {
        beforeEach(async () => {
            await init();
            await tradePO.openTrade(id_hashed);
        });

        afterEach(async () => {
            await qaHelper.cancelTrade(id_hashed);
        });

        it("allows to cancel trade", async () => {
            await tradePO.cancelTrade();
            await tradePO.checkPageLoaded();
            expect(await tradePO.elements.tradeStatusLabel.getText()).toEqual("Trade Cancelled by Seller");
            expect(await tradePO.elements.alert.getText()).toContain("Trade cancelled.");
        });
    });
});

async function init() {
    ({ offerOwner, clientUser, offerId } = await initUsersAndOffers("sell"));
    await qaHelper.depositBond(offerOwner.id);
    await qaHelper.enableDeferredEscrow(offerOwner.id);
    await qaHelper.addBalance(offerOwner.id, 0);
    await makeAUserExperienced(offerOwner.id);
    id_hashed = await startTrade(clientUser.id, offerId);
    await loginPO.logInAccount(offerOwner.email);
}
