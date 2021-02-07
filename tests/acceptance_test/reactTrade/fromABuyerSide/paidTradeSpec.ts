import { browser } from "protractor";

import qaHelper from "../../../../utils/qaHelper";
import loginPO from "../../../../pages/loginPO";
import tradePO from "../../../../pages/trade/reactTradePO";
import tradeChatComponent from "../../../../pages/trade/tradeChatComponent";
import {
    amountFiat,
    currencyCode,
    initUsersAndOffers,
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
        });

        beforeEach(async () => {
            await tradePO.openTrade(id_hashed);
        });

        afterAll(async () => {
            await qaHelper.cancelTrade(id_hashed);
        });

        it("shows the TRADE PAID trade status id6543", async () => {
            expect(await tradePO.elements.tradeStatusLabel.getText()).toEqual("Trade Paid");
        });

        it('shows the "you have sent over * worth of *" header id6545', async () => {
            expect(await tradePO.elements.actionTitle.getText()).toEqual(
                `You paid ${amountFiat} ${currencyCode} with ${paymentMethodName}.`,
            );
        });

        it("shows the Cancel button and its description id6546", async () => {
            expect(await tradePO.elements.cancelButton.getText()).toEqual("Cancel Trade");
        });

        it("shows the Dispute button and its descriptions id6547", async () => {
            expect(await tradePO.elements.disputeButton.getText()).toContain("Dispute");
            expect(await tradePO.elements.disputeButtonCountdown.getText()).toMatch(
                /Available in 02:5[7-9]:[0-5][0-9]/,
            );
            expect(await tradePO.elements.disputeButtonDescription.getText()).toContain(
                "Click Dispute to report an unresponsive trade partner or any other issue you may have.",
            );
        });

        it("does not show the Paid button and its description id6548", async () => {
            expect(await tradePO.elements.paidButton.isPresent()).toBeFalsy(
                "Paid button should not be shown",
            );
            expect(await tradePO.elements.paidButtonDescription.isPresent()).toBeFalsy(
                "Paid button description should not be shown",
            );
        });

        it("does not show a countdown with time left to make payment id6549", async () => {
            expect(await tradePO.elements.paymentTimeCountdown.isPresent()).toBeFalsy(
                "Countdown label should not be shown",
            );
        });

        it('shows the "vendor is now verifying your payment" message in the chat id6360', async () => {
            expect(await tradeChatComponent.getLastMessageText()).toEqual(
                "The Vendor is now verifying your payment. Once the vendor confirms payment, Bitcoin will be released to your Paxful wallet.",
            );
        });

        it("shows the report a problem link on a paid trade page id6622", async () => {
            expect(
                await tradePO.elements.reportAProblemBlock.reportAProblemDefaultReportButton.getText(),
            ).toEqual("Report");
        });

        it("allows to click the report a problem link and see the report modal id6531", async () => {
            await tradePO.pressReportAProblemLink();
            expect(await tradePO.elements.reportTradeModal.isDisplayed()).toBeTruthy();
            expect(await tradePO.elements.reportTradeModalHeader.getText()).toEqual("Report trade");
            expect(await tradePO.elements.reportTradeModalTypeSelect.isDisplayed()).toBeTruthy();
            expect(await tradePO.elements.reportTradeModalTypeSelectInputSearch.getText()).toEqual(
                "Select your exact problem",
            );
            expect(await tradePO.elements.reportTradeModalTypeDescription.isPresent()).toBeFalsy();
            expect(await tradePO.elements.reportTradeModalTypeSelectError.isPresent()).toBeFalsy();
            expect(
                await tradePO.elements.reportTradeModalDescriptionArea.getAttribute("placeholder"),
            ).toEqual("Describe the issue in as much detail as possible");
            expect(
                await tradePO.elements.reportTradeModalDescriptionArea.getAttribute("value"),
            ).toEqual("");
            expect(
                await tradePO.elements.reportTradeModalDescriptionAreaError.isPresent(),
            ).toBeFalsy();
            expect(await tradePO.elements.reportTradeModalCloseButton.getText()).toEqual("Close");
            expect(await tradePO.elements.reportTradeModalConfirmButton.getText()).toEqual(
                "Report",
            );
        });

        it("allows to see some additional info about trade report types id6532", async () => {
            await tradePO.pressReportAProblemLink();
            await tradePO.elements.reportTradeModalTypeSelect.click();
            await qaHelper.toBeVisible(
                tradePO.elements.reportTradeModalTypeSelectOption,
                15000,
                "Report type option is not visible",
            );
            await tradePO.elements.reportTradeModalTypeSelectOptionAbusiveLanguage.click();
            expect(await tradePO.elements.reportTradeModalTypeDescription.getText()).toEqual(
                "User is using abusive language in chat.",
            );
            await tradePO.elements.reportTradeModalTypeSelect.click();
            await qaHelper.toBeVisible(
                tradePO.elements.reportTradeModalTypeSelectOption,
                15000,
                "Report type option is not visible",
            );
            await tradePO.elements.reportTradeModalTypeSelectOptionRipper.click();
            expect(await tradePO.elements.reportTradeModalTypeDescription.getText()).toEqual(
                "User ripped me off.",
            );
        });

        it("allows to close the report a problem modal id6533", async () => {
            await tradePO.pressReportAProblemLink();
            await tradePO.closeReportAProblemModal();
            expect(await tradePO.elements.reportTradeModal.isPresent()).toBeFalsy();
        });

        it("does not allow to report the trade in case the report type is not selected id6534", async () => {
            await tradePO.pressReportAProblemLink();
            await tradePO.elements.reportTradeModalDescriptionArea.sendKeys(
                "here is a description",
            );
            await tradePO.confirmReportAProblem();
            expect(await tradePO.elements.reportTradeModal.isDisplayed()).toBeTruthy();
            expect(await tradePO.elements.reportTradeModalTypeSelectError.getText()).toEqual(
                "Invalid type",
            );
        });

        it("does not allow to report the trade in case the report description is not filled id6535", async () => {
            await tradePO.pressReportAProblemLink();
            await tradePO.elements.reportTradeModalTypeSelect.click();
            await qaHelper.toBeVisible(
                tradePO.elements.reportTradeModalTypeSelectOption,
                15000,
                "Report type option is not visible",
            );
            await tradePO.elements.reportTradeModalTypeSelectOptionAbusiveLanguage.click();
            await tradePO.confirmReportAProblem();
            expect(await tradePO.elements.reportTradeModal.isDisplayed()).toBeTruthy();
            expect(await tradePO.elements.reportTradeModalDescriptionAreaError.getText()).toEqual(
                "Description required",
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

        it("allows to report the trade. Normal reason id6540", async () => {
            await tradePO.pressReportAProblemLink();
            await tradePO.elements.reportTradeModalTypeSelect.click();
            await qaHelper.toBeVisible(
                tradePO.elements.reportTradeModalTypeSelectOption,
                15000,
                "Report type option is not visible",
            );
            await tradePO.elements.reportTradeModalTypeSelectOptionRipper.click();
            await tradePO.elements.reportTradeModalDescriptionArea.sendKeys("bla bla bla");
            await tradePO.confirmReportAProblem();
            await tradePO.openTrade(id_hashed); // refresh page
            expect(await tradePO.elements.reportAProblemLink.isPresent()).toBeFalsy();
            expect(await tradePO.elements.reportStatus.getText()).toEqual(
                "Thank you for reporting this.",
            );
            expect(await tradeChatComponent.getLastMessageText()).toContain(
                'Problem reported: Ripper. Buyers please ALWAYS click the "PAID" button when you have made payment as requested. ',
            );
        });

        //Pay attention: https://paxful.atlassian.net/browse/PBT-559
        it("allows to report the trade. Auto archiving reason id6541", async () => {
            await tradePO.pressReportAProblemLink();
            await tradePO.elements.reportTradeModalTypeSelect.click();
            await qaHelper.toBeVisible(
                tradePO.elements.reportTradeModalTypeSelectOption,
                15000,
                "Report type option is not visible",
            );
            await tradePO.elements.reportTradeModalTypeSelectOptionAbusiveLanguage.click();
            await tradePO.elements.reportTradeModalDescriptionArea.sendKeys("bla bla bla");
            await tradePO.confirmReportAProblem();
            await tradePO.openTrade(id_hashed); // refresh page
            expect(await tradePO.elements.reportAProblemLink.isPresent()).toBeFalsy();
            expect(await tradePO.elements.reportStatus.getText()).toEqual(
                "Thank you, we've reviewed this report.",
            );
            expect(await tradeChatComponent.getLastMessageText()).toContain(
                "Problem reported: Abusive language. Paxful has a zero tolerance policy for abuse of any kind.",
            );
        });
    });
});

async function init() {
    ({ offerOwner, clientUser, offerId } = await initUsersAndOffers("sell"));
    await qaHelper.depositBond(offerOwner.id);
    id_hashed = await startTrade(clientUser.id, offerId);
    await qaHelper.payInTrade(id_hashed);
    await loginPO.logInAccount(clientUser.email);
}
