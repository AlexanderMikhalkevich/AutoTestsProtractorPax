import qaHelper from "../../../../utils/qaHelper";
import loginPO from "../../../../pages/loginPO";
import tradePO from "../../../../pages/trade/reactTradePO";
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

// all passed
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
            expect(await tradePO.elements.tradeStatusLabel.getText()).toEqual("Trade Paid");
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

        it('shows the "Buyer has not paid yet" warning near the the Release Bitcoin button id6399', async () => {
            expect(await tradePO.elements.releaseBitcoinsWarningBuyerHasPaid.getText()).toEqual(
                "Buyer has made the payment.",
            );
        });

        it('shows the "Buyer has not paid yet" warning description near the the Release Bitcoin button id6399_1', async () => {
            expect(
                await tradePO.elements.releaseBitcoinsWarningBuyerHasPaidDescription.getText(),
            ).toEqual(
                "Only release Bitcoin if the buyer has paid you. If they ask you to release before they have paid - decline politely and wait for the moderator.",
            );
        });

        it("shows the Dispute button and its descriptions id6415", async () => {
            await tradePO.elements.disputeCollapseToggler.click();
            await qaHelper.toBeVisible(
                tradePO.elements.disputeCollapseContent,
                15000,
                "Collapse content is not visible",
            );
            expect(await tradePO.elements.disputeButton.getText()).toContain("Dispute");
            expect(await tradePO.elements.disputeButtonCountdown.getText()).toMatch(
                /Available in \d{2}:\d{2}/,
            );
            expect(await tradePO.elements.disputeButtonDescription.getText()).toContain(
                "Click Dispute to get in contact with the moderator.",
            );
        });

        it("does not show a countdown with time left to make payment id6416", async () => {
            expect(await tradePO.elements.paymentTimeCountdown.isPresent()).toBeFalsy(
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
            await qaHelper.toBeVisible(
                tradePO.elements.reportTradeModalTypeSelectOption,
                15000,
                "Report type option is not visible",
            );
            await tradePO.elements.reportTradeModalTypeSelectOptionCoinlocker.click();
            await tradePO.elements.reportTradeModalDescriptionArea.sendKeys("bla bla bla");
            await tradePO.confirmReportAProblem();
            await tradePO.openTrade(id_hashed); // refresh page
            expect(await tradePO.elements.reportStatus.getText()).toEqual(
                "Thank you for reporting this.",
            );
            expect(
                await tradePO.elements.reportAProblemBlock.reportAProblemDefaultReportButton.isPresent(),
            ).toBeFalsy();
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
