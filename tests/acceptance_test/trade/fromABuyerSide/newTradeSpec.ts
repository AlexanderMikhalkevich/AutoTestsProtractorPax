import { browser } from "protractor";

import loginPO from "../../../../pages/loginPO";
import offersListPO from "../../../../pages/offersListPO";
import offerViewPO from "../../../../pages/offerViewPO";
import moreInfo from "../../../../pages/trade/moreInfoSidePanelComponent";
import tradeChatComponent from "../../../../pages/trade/tradeChatComponent";
import chatHeader from "../../../../pages/trade/tradeChatHeaderComponent";
import tradePO from "../../../../pages/trade/tradePO";
import tradePage from "../../../../pages/trade/tradePO";
import qaHelper from "../../../../utils/qaHelper";
import {
    amountFiat,
    checkMoreInfoPanelElements,
    currencyCode,
    expectedSellFeeAmount,
    expectedTestBtcPrice,
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

        it("shows a low reputation attention id6507", async () => {
            expect(await tradePO.elements.lowReputationWarning.getText()).toContain(
                "This user has poor reputation. Make sure",
            );
            expect(await tradePO.elements.lowReputationWarningCloseButton).toBeTruthy();
        });

        it("allows to close a low reputation attention id6508", async () => {
            await tradePO.elements.lowReputationWarningCloseButton.click();
            expect(await tradePO.elements.lowReputationWarning.isPresent()).toBeFalsy();
        });

        it("shows the Trade Started trade status id6509", async () => {
            expect(await tradePO.elements.tradeStatusLabel.getText()).toEqual("Trade Started");
        });

        it('shows the "please send * worth of *" header id6511', async () => {
            expect(await tradePO.elements.actionTitle.getText()).toEqual(
                `Please make a payment of ${amountFiat} ${currencyCode} using ${paymentMethodName}.`,
            );
        });

        it('shows the "* will be loaded to your Bitcoin wallet" header id6512', async () => {
            expect(await tradePO.elements.actionSub.getText()).toEqual(
                `Once the vendor has confirmed your payment, they will release ${expectedTradeBtcAmount} BTC to your Paxful wallet.`,
            );
        });

        it("shows the Paid button and its description id6513", async () => {
            expect(await tradePO.elements.paidButton.getText()).toContain("Paid");
            expect(await tradePO.elements.paidButtonDescription.getText()).toContain(
                "Once you’ve made the payment, be sure to click Paid within the given time limit.",
            );
        });

        it("allows to press the paid button and see instructions id6514", async () => {
            await tradePO.pressPaidButton();
            expect(await tradePO.elements.paymentModal.isDisplayed()).toBeTruthy();
            expect(await tradePO.elements.paymentModalHeader.getText()).toEqual("Self Declaration");
            expect(await tradePO.elements.paymentModalBody.getText()).toContain(
                "Please read the seller’s instructions below, if you have followed them all and paid, click Paid. If you have missed a step or haven’t paid click Back to chat to the seller.",
            );
            expect(await tradePO.elements.paymentModalTradeDetails.getText()).toEqual(
                "sell offer trade details",
            );
            expect(await tradePO.elements.paymentModalCloseButton.getText()).toEqual("Back");
            expect(await tradePO.elements.paymentModalConfirmButton.getText()).toEqual("Paid");
        });

        it("allows to cancel payment (close payment modal) id6515", async () => {
            await tradePO.pressPaidButton();
            await tradePO.pressCancelPaymentButton();
            expect(await tradePO.elements.paymentModal.isDisplayed()).toBeFalsy();
        });

        it("shows the Cancel button and its description id6516", async () => {
            expect(await tradePO.elements.cancelButton.getText()).toEqual("Cancel");
            expect(await tradePO.elements.cancelButtonDescription.getText()).toContain(
                "Click Cancel if you don’t want to continue with trade anymore.",
            );
        });

        it("allows to press the cancel button and see the confirmation dialog id6517", async () => {
            await tradePO.pressCancelButton();
            expect(await tradePO.elements.cancellationModal.isDisplayed()).toBeTruthy();
            expect(await tradePO.elements.cancellationModalHeader.getText()).toEqual("Hold on!");
            expect(await tradePO.elements.cancellationModalConfirmButton.getText()).toEqual(
                "Cancel trade",
            );
            expect(await tradePO.elements.cancellationModalCloseButton.getText()).toEqual("Back");
        });

        it("allows to close the cancellation modal id6518", async () => {
            await tradePO.pressCancelButton();
            await tradePO.closeCancellationModal();
            expect(await tradePO.elements.cancellationModal.isPresent()).toBeFalsy();
        });

        it('shows the "please follow user\'s instructions" header id6519', async () => {
            expect(await tradePO.elements.pleaseFollowInstructionsHeader.getText()).toEqual(
                `Please follow ${offerOwner.nick}'s instructions`,
            );
        });

        it("does not show tags (in case they are not set) id6520", async () => {
            expect(await tradePO.elements.tagsContainer.isPresent()).toBeFalsy();
        });

        it("shows trade instructions id6521", async () => {
            expect(await tradePO.elements.tradeInstructions.getText()).toEqual(
                "sell offer trade details",
            );
        });

        it("shows a countdown with time left to make payment id6522", async () => {
            expect(await tradePO.elements.paymentTimeCountdown.getText()).toMatch(
                /^Time left 00:(30|29|28):[0-5][0-9]$/,
            );
        });

        it('shows the "* BTC is being safely held in Paxful escrow id6523', async () => {
            expect(await tradePO.elements.escrowInfo.getText()).toEqual(
                `${roundTo8Digits(
                    expectedTradeBtcAmount + expectedSellFeeAmount,
                )} BTC has been reserved for this trade. This includes our fee of ${expectedSellFeeAmount} BTC.`,
            );
        });

        it("shows the rate id6524", async () => {
            expect(await tradePO.elements.rate.getText()).toEqual(
                `${(Math.round(expectedTestBtcPrice * 100) / 100).toLocaleString()} USD / BTC`,
            );
        });

        it("shows the trade id id6525", async () => {
            expect(await tradePO.elements.tradeId.getText()).toEqual(id_hashed);
        });

        it("shows how much time age the trade was started id6526", async () => {
            expect(await tradePO.elements.started.getText()).toMatch(
                /^(\d{1,2})|(a)|(a few) (minute)|(second)(s)? ago$/,
            );
        });

        it("does not show finished trade info (like Cancelled: an hour age) id6527", async () => {
            expect(await tradePO.elements.finishedTradeInfo.isDisplayed()).toBeFalsy();
        });

        it("shows the view offer link id6528", async () => {
            expect(await tradePO.elements.viewOfferLink.isDisplayed()).toBeTruthy();
        });

        it("allows to click the view offer link and see the offer page id6529", async () => {
            await tradePO.pressViewOfferLink();
            await offerViewPO.checkPageLoaded();
            await offerViewPO.checkIfSpecificOfferIsOpened(offerId); // check by url
        });

        it("shows trade partner's details in the chat header id6536", async () => {
            expect(await chatHeader.elements.userNick.getText()).toEqual(offerOwner.nick);
            expect(await chatHeader.elements.positiveFeedback.getText()).toMatch(/^\d$/);
            expect(await chatHeader.elements.negativeFeedback.getText()).toMatch(/^\d$/);
            expect(await chatHeader.getLocation()).toEqual("United States (USA)");
            expect(await chatHeader.elements.lastSeenWrapper.getText()).toMatch(
                /Seen (just now)|(\d{1,2} minute(s)? ago)/,
            );
            expect(await chatHeader.elements.phoneVerified.isDisplayed()).toBeTruthy();
            expect(await chatHeader.elements.idVerified.isDisplayed()).toBeTruthy();
            // expect(await chatHeader.elements.moreInfo.getText()).toEqual("More info");
        });

        it("shows the trade details as the second message in chat id6356", async () => {
            expect(await tradeChatComponent.getNthMessageText(2)).toEqual(
                "sell offer trade details",
            );
        });

        it("shows some additional trade info as the first message in chat id6357", async () => {
            const expectedText =
                "The buyer is paying 20 USD for 0.02 BTC (20 USD) via Amazon Gift Card. " +
                "0.0202 BTC (20.2 USD) is now in escrow. It is now safe " +
                "for the buyer to pay. The buyer will have 30 minutes to make their payment and click on " +
                'the "PAID" button before the trade expires.';
            expect(await tradeChatComponent.getFirstMessageText()).toEqual(expectedText);
        });

        it("allows to send a chat message id6358", async () => {
            const ownMessage = "Privet!";
            await tradeChatComponent.sendMessage(ownMessage);
            expect(await tradeChatComponent.getLastMessageText()).toBe(ownMessage);
        });

        it("shows opponent's chat messages id6359", async () => {
            const opponentMessage = "Hola!";
            await qaHelper.sendMessageInTradeChat(id_hashed, offerOwner.id, opponentMessage);
            await tradePO.openTrade(id_hashed); // just to refresh the page
            expect(await tradeChatComponent.getLastMessageText()).toBe(opponentMessage);
        });

        it("allows to see more info about the trade partner id6537", async () => {
            await moreInfo.open();
            await checkMoreInfoPanelElements(offerOwner.nick);
        });

        it("shows the report a problem link on a new trade page id6530", async () => {
            expect(await tradePO.elements.reportAProblemLink.getText()).toEqual("Report a problem");
        });

        it("shows the 'You can report a problem on this trade, once the payment is made.' tooltip if you try to report trade which is not paid yet id6621", async () => {
            await browser.sleep(1000); // TODO looks like here is a problem with jumping page so we need to wait a bit before clicking
            await tradePO.elements.reportAProblemLink.click();
            expect(await tradePO.getCommonTooltipText()).toEqual(
                "You can report a problem on this trade, once the payment is made.",
            );
        });
    });

    // destructive actions
    describe("New trade", () => {
        beforeEach(async () => {
            await init();
            await tradePO.openTrade(id_hashed); // just refresh trade
            await tradePage.elements.helpTourSkipButton.click();
        });

        afterEach(async () => {
            await qaHelper.cancelTrade(id_hashed);
        });

        it("allows to confirm payment id6538", async () => {
            await tradePO.pressPaidButton();
            await tradePO.confirmPaidWithCheckbox();
            expect(await tradePO.elements.tradeStatusLabel.getText()).toEqual(
                "Trade Marked as Paid",
            );
            expect(await tradePO.elements.alert.getText()).toContain(
                "Thanks for paying! Now it's the seller's turn to release your Bitcoin.",
            );
        });

        it("allows to cancel trade id6539", async () => {
            await tradePO.cancelTrade();
            await offerViewPO.checkPageLoaded();
            await offerViewPO.checkIfSpecificOfferIsOpened(offerId); // check by url
            expect(await offerViewPO.elements.alert.getText()).toEqual(
                "This trade has been cancelled and the Bitcoin has been released back to the seller. Back to trade page",
            );
            await offerViewPO.elements.alertLink.click();
            await tradePO.checkPageLoaded();
        });
    });
});

async function init() {
    ({ offerOwner, clientUser, offerId } = await initUsersAndOffers("sell"));
    await qaHelper.depositBond(offerOwner.id);
    await makeAUserExperienced(clientUser.id);
    id_hashed = await startTrade(clientUser.id, offerId);
    await loginPO.logInAccount(clientUser.email);
}
