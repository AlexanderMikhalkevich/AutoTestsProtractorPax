import qaHelper from "../../../../utils/qaHelper";
import loginPO from "../../../../pages/loginPO";
import tradePO from "../../../../pages/trade/tradePO";
import tradeChatComponent from "../../../../pages/trade/tradeChatComponent";
import {
    amountFiat,
    currencyCode,
    expectedTradeBtcAmount,
    initUsersAndOffers,
    makeAUserExperienced,
    paymentMethodName,
    startTrade,
} from "../tradeTestBase";

let offerOwner, clientUser;
let offerId;
let id_hashed;

describe("Trade", () => {
    describe("Paid trade", () => {
        beforeAll(async () => {
            await init();
            await loginPO.logInAccount(clientUser.email);
            await tradePO.openTrade(id_hashed);
        });

        afterAll(async () => {
            await qaHelper.cancelTrade(id_hashed);
        });

        it("shows the TRADE PAID trade status id6407", async () => {
            expect(await tradePO.elements.tradeStatusLabel.getText()).toEqual("Trade Marked as Paid");
        });

        it('shows the "you are selling * btc for *" header id6409', async () => {
            expect(await tradePO.elements.actionTitle.getText()).toEqual(
                `You are selling ${expectedTradeBtcAmount} BTC for ${amountFiat} ${currencyCode} using ${paymentMethodName}`,
            );
        });

        it("does not show the Paid button and its description id6410", async () => {
            expect(await tradePO.elements.paidButton.isPresent()).toBeFalsy();
            expect(await tradePO.elements.paidButtonDescription.isPresent()).toBeFalsy();
        });

        it("does not show the Cancel button and its description id6411", async () => {
            expect(await tradePO.elements.cancelButton.isPresent()).toBeFalsy();
            expect(await tradePO.elements.cancelButtonDescription.isPresent()).toBeFalsy();
        });

        it("shows the Release Bitcoins button id6412", async () => {
            expect(await tradePO.elements.releaseBitcoinsButton.getText()).toEqual(
                "Release Bitcoin",
            );
        });

        it('does not show the "Buyer has not paid yet" warning near the the Release Bitcoins button id6413', async () => {
            expect(await tradePO.elements.releaseBitcoinsButtonWarning.isPresent()).toBeFalsy();
        });

        it("shows the Release Bitcoins button description id6414", async () => {
            expect(await tradePO.elements.releaseBitcoinsButtonDescription.getText()).toContain(
                "Only release Bitcoin if the buyer has paid you. If they ask you to release before they have paid - decline politely and wait for the moderator.",
            );
        });

        it("shows the Dispute button and its descriptions id6415", async () => {
            expect(await tradePO.elements.disputeButton.getText()).toMatch(
                /Dispute available in \d{2}:\d{2}/,
            );
            expect(await tradePO.elements.disputeButtonDescription.getText()).toContain(
                "Click Dispute to get help from a Paxful moderator.",
            );
        });

        it("does not show a countdown with time left to make payment id6416", async () => {
            expect(await tradePO.elements.paymentTimeCountdown.isDisplayed()).toBeFalsy(
                "Countdown label should not be shown",
            );
        });

        it('shows the "Buyer has marked this trade as paid" message in the chat id6362', async () => {
            expect(await tradeChatComponent.getLastMessageText()).toEqual(
                `${offerOwner.nick} has marked this trade as paid. Check if you’ve received the payment and release the Bitcoin.`,
            );
        });
    });

    // destructive actions
    describe("Paid trade", () => {
        beforeEach(async () => {
            await init();
            await tradePO.openTrade(id_hashed);
        });

        afterEach(async () => {
            await qaHelper.cancelTrade(id_hashed);
        });

        it("allows to report the trade id6624", async () => {
            await tradePO.pressReportAProblemLink();
            await tradePO.elements.reportTradeModalTypeSelect.click();
            await tradePO.elements.reportTradeModalTypeSelectOptionCoinlocker.click();
            await tradePO.elements.reportTradeModalDescriptionArea.sendKeys("bla bla bla");
            await tradePO.confirmReportAProblem();
            expect(await tradePO.elements.reportSuccessMessage.getText()).toEqual("Thank you for reporting this trade.");
            await tradePO.openTrade(id_hashed); // refresh page
            expect(await tradePO.elements.reportStatus.getText()).toEqual("Thank you for reporting this.");
            expect(await tradePO.elements.reportAProblemLink.isPresent()).toBeFalsy();
        });
    });
});

async function init() {
    ({ offerOwner, clientUser, offerId } = await initUsersAndOffers("buy"));
    id_hashed = await startTrade(clientUser.id, offerId);
    await makeAUserExperienced(clientUser.id);
    await qaHelper.payInTrade(id_hashed);
    await loginPO.logInAccount(clientUser.email);
}
