import { browser } from "protractor";

import qaHelper from "../../../../utils/qaHelper";
import loginPO from "../../../../pages/loginPO";
import tradePO from "../../../../pages/trade/tradePO";
import tradeChatComponent from "../../../../pages/trade/tradeChatComponent";
import walletPO from "../../../../pages/walletPO";
import publicReceiptPO from "../../../../pages/trade/publicReceiptPO";
import {
    amountFiat,
    currencyCode,
    expectedTradeBtcAmount,
    initUsersAndOffers,
    paymentMethodName,
    startTrade,
} from "../tradeTestBase";

let offerOwner, clientUser;
let offerId;
let id_hashed;

describe("Trade", () => {
    describe("Completed trade", () => {
        beforeAll(async () => {
            await init();
        });

        beforeEach(async () => {
            await tradePO.openTrade(id_hashed);
        });

        it("shows the TRADE COMPLETED trade status id6483", async () => {
            expect(await tradePO.elements.tradeStatusLabel.getText()).toEqual("Trade Completed");
        });

        it('shows the "* has been loaded to your wallet" header id6485', async () => {
            expect(await tradePO.elements.ctaContainerTitle.getText()).toEqual(
                `You received ${amountFiat} ${currencyCode} (${expectedTradeBtcAmount} BTC) onto your Paxful wallet`,
            );
        });

        it("shows a link to the wallet page in the SUCCESS header id6486", async () => {
            expect(await tradePO.elements.ctaContainerTitleLink.getText()).toEqual(`Paxful wallet`);
            await tradePO.elements.ctaContainerTitleLink.click();
            await walletPO.checkPageLoadedLoggedIn();
        });

        it("shows a link to add your trade partner to contacts list id6487", async () => {
            expect(
                await tradePO.elements.ctaContainerAddToContactsButton.getAttribute("value"),
            ).toEqual(
                `Add ${offerOwner.nick} to your contacts to quickly trade with them in the future.`,
            );
        });

        it("allows to add your trade partner to contacts list id6488", async () => {
            await tradePO.elements.ctaContainerAddToContactsButton.click();
            expect(await tradePO.elements.ctaContainerAddToContactsButton.isPresent()).toBeFalsy();
            expect(await tradePO.getInfoMessageBlockText()).toContain(
                "User added as your trusted contact. You can find all your trusted contacts under Trade Partners",
            );
        });

        it("allows to open /account/contacts via new trusted partner confirmation message");

        it("does not show a link to add your trade partner to contacts list in case he is already there id6489", async () => {
            expect(await tradePO.elements.ctaContainerAddToContactsButton.isPresent()).toBeFalsy();
        });

        it('shows the "please consider leaving a feedback" title id6490', async () => {
            expect(await tradePO.elements.feedbackTitle.getText()).toEqual(
                `Leave feedback for ${offerOwner.nick}`,
            );
        });

        it("does not show a negative feedback tooltip in case negative feedback is not selected id6491", async () => {
            expect(await tradePO.elements.commonTooltip.isPresent()).toBeFalsy();
            await tradePO.elements.negativeFeedbackButton.click();
            await tradePO.elements.positiveFeedbackButton.click();
            await browser.sleep(100);
            expect(await tradePO.elements.commonTooltip.isPresent()).toBeFalsy();
        });

        it("shows a tooltip in case negative feedback is selected id6492", async () => {
            await tradePO.elements.negativeFeedbackButton.click();
            await browser.sleep(100);
            expect(await tradePO.elements.commonTooltip.getText()).toContain(
                "Before you leave this please understand negative feedback really hurts the trader.",
            );
        });

        it('shows the "* has not left you feedback yet" label in case here is no feedback id6493', async () => {
            expect(await tradePO.elements.receivedFeedbackContainer.getText()).toEqual(
                `${offerOwner.nick} has not left you feedback`,
            );
        });

        it('shows the "you have sent over * worth of *" header id6497', async () => {
            expect(await tradePO.elements.actionTitle.getText()).toEqual(
                `You paid ${amountFiat} ${currencyCode} with ${paymentMethodName}.`,
            );
        });

        it("does not show the Cancel button and its description id6498", async () => {
            expect(await tradePO.elements.cancelButton.isPresent()).toBeFalsy(
                "Cancel button shuold not be shown",
            );
            expect(await tradePO.elements.cancelButtonDescription.isPresent()).toBeFalsy(
                "Cancel button description should not be shown",
            );
        });

        it("does not show the Dispute button and its description id6499", async () => {
            expect(await tradePO.elements.disputeButton.isPresent()).toBeFalsy(
                "Dispute button shuold not be shown",
            );
            expect(await tradePO.elements.disputeButtonDescription.isPresent()).toBeFalsy(
                "Dispute button description should not be shown",
            );
        });

        it("does not show the Paid button and its description id6500", async () => {
            expect(await tradePO.elements.paidButton.isPresent()).toBeFalsy(
                "Paid button shuold not be shown",
            );
            expect(await tradePO.elements.paidButtonDescription.isPresent()).toBeFalsy(
                "Paid button description should not be shown",
            );
        });

        it("does not show a countdown with time left to make payment id6501", async () => {
            expect(await tradePO.elements.paymentTimeCountdown.isPresent()).toBeFalsy(
                "Countdown label should not be shown",
            );
        });

        it('shows the "Success! Seller has released Bitcoin to buyers wallet." message in the chat id6355', async () => {
            expect(await tradeChatComponent.getLastMessageText()).toEqual(
                "Success! Your trade partner has released Bitcoin to your wallet. Be sure to leave feedback.",
            );
        });

        it("shows the public receipt link id6502", async () => {
            expect(await tradePO.elements.publicReceiptLink.isDisplayed()).toBeTruthy();
        });

        it("allows to open the public receipt id6503", async () => {
            await tradePO.elements.publicReceiptLink.click();
            await qaHelper.switchToNewTab();
            await publicReceiptPO.checkPageLoaded();
        });
    });
});

async function init() {
    ({ offerOwner, clientUser, offerId } = await initUsersAndOffers("sell"));
    await qaHelper.depositBond(offerOwner.id);
    id_hashed = await startTrade(clientUser.id, offerId);
    await qaHelper.releaseInTrade(id_hashed);
    await loginPO.logInAccount(clientUser.email);
}
