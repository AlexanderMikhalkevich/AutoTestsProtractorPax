import { browser } from "protractor";

import qaHelper from "../../../../utils/qaHelper";
import loginPO from "../../../../pages/loginPO";
import tradePO from "../../../../pages/trade/reactTradePO";
import dashboardPO from "../../../../pages/dashboardPO";
import { initUsersAndOffers, makeAUserExperienced, startTrade } from "../tradeTestBase";

let offerOwner, clientUser;
let offerId;
let id_hashed;

// passed
describe("Trade", () => {
    describe("Cancelled by buyer trade", () => {
        beforeAll(async () => {
            await init();
        });

        beforeEach(async () => {
            await tradePO.openTrade(id_hashed); // just refresh trade
        });

        it('shows the "...IF YOU HAVE COLLECTED PAYMENT THEN YOU MUST REOPEN ESCROW..." header id6367', async () => {
            expect(await tradePO.elements.ctaContainer.getText()).toContain(
                "Check your completed trades in Classic Dashboard. If you have collected payment for this trade, you must reopen escrow and release Bitcoin.",
            );
        });
        it('shows the "Reopen Trade" button under the "...IF YOU HAVE COLLECTED PAYMENT THEN YOU MUST REOPEN ESCROW..." header id6369', async () => {
            expect(await tradePO.elements.reopenEscrowButton.getText()).toEqual("Reopen Trade");
        });

        it("allows to press the Reopen escrow button and see the confirmation dialog id6370", async () => {
            await tradePO.pressReopenEscrowButton();
            expect(await tradePO.elements.reopenEscrowModal.isDisplayed()).toBeTruthy();
            expect(await tradePO.elements.reopenEscrowModalHeader.getText()).toEqual(
                "Reopen an Escrow?",
            );
            expect(await tradePO.elements.reopenEscrowModalContent.getText()).toEqual(
                "Fund trade again for same Bitcoin amount.",
            );
            expect(await tradePO.elements.reopenEscrowModalConfirmButton.getText()).toEqual("Yes");
            expect(await tradePO.elements.reopenEscrowModalCloseButton.getText()).toEqual("No");
        });

        it("allows to close the Reopen escrow confirmation modal id6371", async () => {
            await tradePO.pressReopenEscrowButton();
            await tradePO.closeReopenEscrowModal();
            expect(await tradePO.elements.reopenEscrowModal.isPresent()).toBeFalsy();
        });
    });

    // destructive actions
    describe("Cancelled by buyer trade", () => {
        beforeAll(async () => {
            await init();
        });

        beforeEach(async () => {
            await tradePO.openTrade(id_hashed); // just refresh trade
        });

        afterAll(async () => {
            await qaHelper.cancelTrade(id_hashed); // cancel reopened in test trade
        });

        it('allows to reopen escrow by clicking the "Reopen escrow" button under the "...IF YOU HAVE COLLECTED PAYMENT THEN YOU MUST REOPEN ESCROW..." header id6372', async () => {
            await tradePO.pressReopenEscrowButton();
            await tradePO.confirmReopenEscrow();
            await tradePO.openTrade(id_hashed); // just refresh trade
            expect(await tradePO.elements.releaseBitcoinsButton.isDisplayed()).toBeTruthy();
        });
    });
});

async function init() {
    ({ offerOwner, clientUser, offerId } = await initUsersAndOffers("buy"));
    id_hashed = await startTrade(clientUser.id, offerId);
    await makeAUserExperienced(clientUser.id);
    await qaHelper.cancelTrade(id_hashed);
    await loginPO.logInAccount(clientUser.email);
}
