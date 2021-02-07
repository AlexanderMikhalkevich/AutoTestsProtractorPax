import { browser } from "protractor";

import qaHelper from "../../../../utils/qaHelper";
import loginPO from "../../../../pages/loginPO";
import tradePO from "../../../../pages/trade/tradePO";
import { initUsersAndOffers, startTrade } from "../tradeTestBase";

let offerOwner, clientUser;
let offerId;
let id_hashed;

describe("Trade", () => {
    describe("New trade by inexperienced trader", () => {
        beforeAll(async () => {
            ({ offerOwner, clientUser, offerId } = await initUsersAndOffers("buy"));
            id_hashed = await startTrade(clientUser.id, offerId);
            await loginPO.logInAccount(clientUser.email);
        });

        beforeEach(async () => {
            await tradePO.openTrade(id_hashed); // just refresh trade
            await browser.sleep(1000);
        });

        afterAll(async () => {
            await qaHelper.cancelTrade(id_hashed);
        });

        it("shows the Protect your Bitcoins warning modal id6391", async () => {
            expect(await tradePO.elements.protectYourBitcoinsWarning.isDisplayed()).toBeTruthy();
            expect(await tradePO.elements.protectYourBitcoinsWarningHeader.getText()).toEqual(
                "Protect your Bitcoin",
            );
            expect(await tradePO.elements.protectYourBitcoinsWarningBody.getText()).toContain(
                "Share your email or phone number with a buyer only if it’s needed to complete a payment.",
            );
            expect(await tradePO.elements.protectYourBitcoinsWarningCloseButton.getText()).toEqual(
                "I understand",
            );
        });
    });
});
