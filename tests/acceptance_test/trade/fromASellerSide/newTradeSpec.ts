import { browser } from "protractor";

import qaHelper from "../../../../utils/qaHelper";
import loginPO from "../../../../pages/loginPO";
import tradePO from "../../../../pages/trade/tradePO";
import moreInfo from "../../../../pages/trade/moreInfoSidePanelComponent";
import {
    amountFiat,
    checkMoreInfoPanelElements,
    currencyCode,
    expectedSellFeeAmount,
    expectedTradeBtcAmount,
    initUsersAndOffers,
    makeAUserExperienced,
    paymentMethodName,
    roundTo8Digits,
    startTrade,
} from "../tradeTestBase";

let offerOwner, clientUser;
let offerId;
let id_hashed;

describe("Trade", () => {
    describe("New trade", () => {
        beforeAll(async () => {
            await init();
        });

        beforeEach(async () => {
            await tradePO.openTrade(id_hashed); // just refresh trade
        });

        afterAll(async () => {
            await qaHelper.cancelTrade(id_hashed);
        });

        it('shows the "you are selling * btc using *" header id6392', async () => {
            expect(await tradePO.elements.actionTitle.getText()).toEqual(
                `You are selling ${expectedTradeBtcAmount} BTC for ${Math.round(amountFiat * 100) /
                    100} ${currencyCode} using ${paymentMethodName}`,
            );
        });

        it("does not show an action sub header id6393", async () => {
            expect(await tradePO.elements.actionSub.isPresent()).toBeFalsy();
        });

        it("does not show the Paid button and its description id6394", async () => {
            expect(await tradePO.elements.paidButton.isPresent()).toBeFalsy();
            expect(await tradePO.elements.paidButtonDescription.isPresent()).toBeFalsy();
        });

        it("does not show the Cancel button and its description id6395", async () => {
            expect(await tradePO.elements.cancelButton.isPresent()).toBeFalsy();
            expect(await tradePO.elements.cancelButtonDescription.isPresent()).toBeFalsy();
        });

        it("does not show the Dispute button and its description id6396", async () => {
            expect(await tradePO.elements.disputeButton.isDisplayed()).toBeFalsy();
            expect(await tradePO.elements.disputeButtonDescription.isDisplayed()).toBeFalsy();
        });

        it("shows the Release Bitcoins button id6397", async () => {
            expect(await tradePO.elements.releaseBitcoinsButton.getText()).toEqual(
                "Release Bitcoin",
            );
        });

        it("does not show the Release Bitcoins button description id6398", async () => {
            expect(await tradePO.elements.releaseBitcoinsButtonDescription.isPresent()).toBeFalsy();
        });

        it('shows the "Buyer has not paid yet" warning near the the Release Bitcoin button id6399', async () => {
            expect(await tradePO.elements.releaseBitcoinsButtonWarning.getText()).toEqual(
                "It’s not safe to release the Bitcoin if you’ve not been paid.",
            );
        });

        it("allows to press the Release Bitcoins button and see the release confirmation dialog id6400", async () => {
            await tradePO.pressReleaseBitcoinsButton();
            expect(await tradePO.elements.releaseBitcoinsModal.isDisplayed()).toBeTruthy();
            expect(await tradePO.elements.releaseBitcoinsModalHeader.getText()).toContain(
                `Please confirm release of ${expectedTradeBtcAmount} BTC (${amountFiat} ${currencyCode}) from escrow to the buyer's wallet.`,
            );
            expect(await tradePO.elements.releaseBitcoinsModalConfirmButton.getText()).toEqual(
                "Release Bitcoin",
            );
            expect(await tradePO.elements.releaseBitcoinsModalCloseButton.getText()).toEqual(
                "Cancel",
            );
        });

        it('shows the "Buyer has not paid yet" warning in the confirmation dialog id6401', async () => {
            await tradePO.pressReleaseBitcoinsButton();
            expect(await tradePO.elements.releaseBitcoinsModalHeader.getText()).toContain(
                "Buyer has not paid yet",
            );
        });

        it("allows to close the release confirmation modal id6402", async () => {
            await tradePO.pressReleaseBitcoinsButton();
            expect(await tradePO.elements.releaseBitcoinsModal.isDisplayed()).toBeTruthy();
            await tradePO.closeReleaseBitcoinsModal();
            expect(await tradePO.elements.releaseBitcoinsModal.isDisplayed()).toBeFalsy();
        });

        it("shows a countdown with time left to make payment id6403", async () => {
            expect(await tradePO.elements.paymentTimeCountdown.getText()).toMatch(
                /^Payment deadline for buyer\n00:(30|29|28):[0-5][0-9]$/,
            );
        });

        it('shows the "* BTC plus * BTC fee is being safely held in Paxful escrow id6404', async () => {
            expect(await tradePO.elements.escrowInfo.getText()).toEqual(
                `${roundTo8Digits(
                    expectedTradeBtcAmount + expectedSellFeeAmount,
                )} BTC has been reserved for this trade. This includes our fee of ${expectedSellFeeAmount} BTC.`,
            );
        });

        it("allows to see more info about the trade partner id6405", async () => {
            await moreInfo.open();
            await checkMoreInfoPanelElements(offerOwner.nick);
        });

        it("shows the 'You can report a problem on this trade, once it’s marked as paid.' tooltip if you try to report trade which is not paid yet id6623", async () => {
            await browser.sleep(1000); // TODO looks like here is a problem with jumping page so we need to wait a bit before clicking
            await tradePO.elements.reportAProblemLink.click();
            expect(await tradePO.getCommonTooltipText()).toEqual(
                "You can report a problem on this trade, once it’s marked as paid.",
            );
        });
    });

    // destructive actions
    describe("New trade", () => {
        beforeEach(async () => {
            await init();
            await tradePO.openTrade(id_hashed); // just refresh trade
        });

        afterEach(async () => {
            await qaHelper.cancelTrade(id_hashed);
        });

        it("allows to release bitcoins id6406", async () => {
            await tradePO.pressReleaseBitcoinsButton();
            await tradePO.confirmReleaseBitcoins();
            expect(await tradePO.elements.tradeStatusLabel.getText()).toEqual("Trade Completed");
            expect(await tradePO.elements.alert.getText()).toContain(
                `Success! You’ve released Bitcoin to ${offerOwner.nick}. Don’t forget to leave your feedback.`,
            );
        });
    });
});

async function init() {
    ({ offerOwner, clientUser, offerId } = await initUsersAndOffers("buy"));
    id_hashed = await startTrade(clientUser.id, offerId);
    await makeAUserExperienced(clientUser.id);
    await loginPO.logInAccount(clientUser.email);
}
