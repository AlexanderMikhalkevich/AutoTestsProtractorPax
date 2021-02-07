import qaHelper from "../../../../utils/qaHelper";
import loginPO from "../../../../pages/loginPO";
import offerViewPO from "../../../../pages/offerViewPO";
import tradePO from "../../../../pages/trade/reactTradePO";
import { initUsersAndOffers, makeAUserExperienced, startTrade } from "../tradeTestBase";

let offerOwner, clientUser;
let offerId;

let id_hashed;

// passed
describe("Trade", () => {
    // destructive actions
    describe("Deferred escrow trade", () => {
        beforeEach(async () => {
            await init();
            await tradePO.openTrade(id_hashed);
            await tradePO.elements.helpTourSkipButton.click();
        });

        afterEach(async () => {
            await qaHelper.cancelTrade(id_hashed);
        });

        it("allows to cancel trade", async () => {
            await tradePO.cancelTrade();
            await offerViewPO.checkPageLoaded();
            await offerViewPO.checkIfSpecificOfferIsOpened(offerId);
            await tradePO.openTrade(id_hashed);
            await tradePO.checkPageLoaded();
        });
    });
});

async function init() {
    ({ offerOwner, clientUser, offerId } = await initUsersAndOffers("sell"));
    await qaHelper.depositBond(offerOwner.id);
    await qaHelper.enableDeferredEscrow(offerOwner.id);
    await qaHelper.addBalance(offerOwner.id, 0);
    await makeAUserExperienced(clientUser.id);
    id_hashed = await startTrade(clientUser.id, offerId);
    await loginPO.logInAccount(clientUser.email);
}
