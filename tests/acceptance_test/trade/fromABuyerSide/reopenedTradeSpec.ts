import qaHelper from "../../../../utils/qaHelper";
import loginPO from "../../../../pages/loginPO";
import offerViewPO from "../../../../pages/offerViewPO";
import tradePO from "../../../../pages/trade/tradePO";
import {
    initUsersAndOffers,
    makeAUserExperienced,
    startTrade,
} from "../tradeTestBase";
import tradePage from "../../../../pages/trade/tradePO";

let offerOwner, clientUser;
let offerId;

let id_hashed;

describe("Trade", () => {
    // destructive actions
    describe("Reopened trade", () => {
        beforeEach(async () => {
            await init();
            await tradePO.openTrade(id_hashed);
            await tradePage.elements.helpTourSkipButton.click();
        });

        afterEach(async () => {
            await qaHelper.cancelTrade(id_hashed);
        });

        it("allows to cancel trade", async () => {
            await tradePO.cancelTrade();
            await offerViewPO.checkPageLoaded();
            await offerViewPO.checkIfSpecificOfferIsOpened(offerId); // check by url
            expect(await offerViewPO.elements.alert.getText()).toEqual(
                "This trade has been cancelled and the Bitcoin has been released back to the seller. Back to trade page",
            );
            await offerViewPO.elements.alertLink.click();
            await tradePO.checkPageLoaded();
            expect(await tradePO.elements.tradeStatusLabel.getText()).toEqual("Trade Cancelled by Buyer");
        });
    });
});

async function init() {
    ({ offerOwner, clientUser, offerId } = await initUsersAndOffers("sell"));
    await qaHelper.depositBond(offerOwner.id);
    await makeAUserExperienced(clientUser.id);
    id_hashed = await startTrade(clientUser.id, offerId);
    await qaHelper.cancelTrade(id_hashed);
    await qaHelper.reopenTrade(id_hashed);
    await loginPO.logInAccount(clientUser.email);
}
