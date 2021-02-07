import qaHelper from "../../../../utils/qaHelper";
import loginPO from "../../../../pages/loginPO";
import tradePO from "../../../../pages/trade/reactTradePO";
import dashboardPO from "../../../../pages/dashboardPO";
import {
    amountFiat,
    currencyCode,
    expectedTradeBtcAmount,
    initSatoshiBalance,
    initUsersAndOffers,
    makeAUserExperienced,
    startTrade,
} from "../tradeTestBase";

let offerOwner, clientUser;
let offerId;
let id_hashed;

// passed all
describe("Trade", () => {
    describe("Completed trade", () => {
        beforeAll(async () => {
            await init();
        });

        beforeEach(async () => {
            await tradePO.openTrade(id_hashed);
        });

        it('shows the "* has been loaded to your wallet" header id6373', async () => {
            expect(await tradePO.elements.ctaContainerTitle.getText()).toEqual(
                `You sold ${expectedTradeBtcAmount} BTC`,
            );
        });

        it('shows the "Go to classic dashboard" link id6374', async () => {
            await tradePO.elements.viewOrRepeatTradeButton.click();
            expect(await tradePO.elements.viewOrRepeatTradeDropDown.isDisplayed()).toBeTruthy();
            expect(await tradePO.elements.goToClassicDashboardLink.getText()).toEqual(
                "Go to classic dashboard",
            );
            await tradePO.elements.viewOrRepeatTradeButton.click();
        });

        it('allows to go to classic dashboard by clicking the "Go to classic dashboard" link id6375', async () => {
            await tradePO.elements.viewOrRepeatTradeButton.click();
            expect(await tradePO.elements.viewOrRepeatTradeDropDown.isDisplayed()).toBeTruthy();
            await tradePO.elements.goToClassicDashboardLink.click();
            await dashboardPO.classicDBPageLoadedLoggedIn();
        });

        it("shows the seller info in the feedback section id6376", async () => {
            expect(await tradePO.elements.feedbackSectionLeftUserInfoBlockNick.getText()).toEqual(
                offerOwner.nick,
            );
            expect(await tradePO.elements.feedbackSectionLeftUserInfoBlock.getText()).toContain(
                "Purchased",
            );
            expect(
                await tradePO.elements.feedbackSectionLeftUserInfoBlockBtcAmount.getText(),
            ).toEqual(`${expectedTradeBtcAmount} BTC`);
            expect(
                await tradePO.elements.feedbackSectionLeftUserInfoBlockFiatAmount.getText(),
            ).toEqual(`${Math.round(amountFiat * 100) / 100} ${currencyCode}`);
        });

        it("shows the buyer info in the feedback section id6377", async () => {
            expect(await tradePO.elements.feedbackSectionRightUserInfoBlockNick.getText()).toEqual(
                clientUser.nick,
            );
            expect(await tradePO.elements.feedbackSectionRightUserInfoBlock.getText()).toContain(
                "Sold",
            );
            expect(
                await tradePO.elements.feedbackSectionRightUserInfoBlockBtcAmount.getText(),
            ).toEqual(`${expectedTradeBtcAmount} BTC`);
            expect(
                await tradePO.elements.feedbackSectionRightUserInfoBlockFiatAmount.getText(),
            ).toEqual(`${Math.round(amountFiat * 100) / 100} ${currencyCode}`);
        });

        it("does not show the Release Bitcoins button id6379", async () => {
            expect(await tradePO.elements.releaseBitcoinsButton.isPresent()).toBeFalsy();
        });

        it('shows the "Report scam" link id6380', async () => {
            expect(
                await tradePO.elements.reportAProblemBlock.reportAProblemDefaultReportButton.getText(),
            ).toEqual("Report");
        });

        it('allows to click the "Report a problem" link and see the modal id6381', async () => {
            await tradePO.pressReportAProblemLink();
            expect(await tradePO.elements.reportTradeModal.isDisplayed()).toBeTruthy();
            expect(await tradePO.elements.reportTradeModalHeader.getText()).toEqual("Report trade");
            expect(await tradePO.elements.reportTradeModalTypeSelect.isDisplayed()).toBeTruthy();
            expect(await tradePO.elements.reportTradeModalTypeSelectInputSearch.getText()).toEqual(
                "Select your exact problem",
            );
            expect(await tradePO.elements.reportTradeModalTypeDescription.isPresent()).toBeFalsy();
            expect(await tradePO.elements.reportTradeModalTypeSelectError.isPresent()).toBeFalsy(
                "Type selector validation error should not be shown",
            );

            expect(
                await tradePO.elements.reportTradeModalDescriptionArea.getAttribute("placeholder"),
            ).toEqual("Describe the issue in as much detail as possible");
            expect(
                await tradePO.elements.reportTradeModalDescriptionArea.getAttribute("value"),
            ).toEqual("");
            expect(
                await tradePO.elements.reportTradeModalDescriptionAreaError.isPresent(),
            ).toBeFalsy("Description validation error should not be shown");

            expect(await tradePO.elements.reportTradeModalCloseButton.getText()).toEqual("Close");
            expect(await tradePO.elements.reportTradeModalConfirmButton.getText()).toEqual(
                "Report",
            );
        });

        it("allows to see some additional info about trade report types id6382", async () => {
            await tradePO.pressReportAProblemLink();
            await tradePO.elements.reportTradeModalTypeSelect.click();
            await qaHelper.toBeVisible(
                tradePO.elements.reportTradeModalTypeSelectOption,
                15000,
                "Report type option is not visible",
            );
            await tradePO.elements.reportScamModalTypeSelectOptionChargeback.click();
            expect(await tradePO.elements.reportTradeModalDescription.getText()).toContain(
                "If you think you have been scammed by a buyer, use the form below to report it.",
            );
            expect(await tradePO.elements.reportScamModalUploadButtonLabel.getText()).toEqual(
                "Add supporting files",
            );
            expect(await tradePO.elements.reportScamModalUploadButton.getText()).toEqual("Upload");
            expect(await tradePO.elements.reportTradeModalTypeDescription.getText()).toEqual(
                "Buyer has charged back their payment.",
            );
        });

        it('allows to close the "Report a problem" modal id6383', async () => {
            await tradePO.pressReportAProblemLink();
            await tradePO.elements.reportTradeModalCloseButton.click();
            expect(await tradePO.elements.reportScamModal.isPresent()).toBeFalsy();
        });

        it("does not allow to report a problem in case the report type is not selected id6384", async () => {
            await tradePO.pressReportAProblemLink();
            await tradePO.elements.reportTradeModalDescriptionArea.sendKeys(
                "here is a description",
            );
            expect(await tradePO.elements.reportTradeModalTypeSelectError.isPresent()).toBeFalsy();
            await tradePO.confirmReportScam();
            expect(await tradePO.elements.reportTradeModal.isPresent()).toBeTruthy();
            expect(
                await tradePO.elements.reportTradeModalTypeSelectError.isDisplayed(),
            ).toBeTruthy();
            expect(await tradePO.elements.reportTradeModalTypeSelectError.getText()).toEqual(
                "Invalid type",
            );
        });

        it("does not allow to report a problem in case the report description is not filled id6385", async () => {
            await tradePO.pressReportAProblemLink();
            await tradePO.elements.reportTradeModalTypeSelect.click();
            await qaHelper.toBeVisible(
                tradePO.elements.reportTradeModalTypeSelectOption,
                15000,
                "Report type option is not visible",
            );
            await tradePO.elements.reportScamModalTypeSelectOptionUsedGiftCard.click();
            expect(
                await tradePO.elements.reportTradeModalDescriptionAreaError.isPresent(),
            ).toBeFalsy();
            await tradePO.confirmReportScam();
            expect(await tradePO.elements.reportTradeModal.isDisplayed()).toBeTruthy();
            expect(
                await tradePO.elements.reportTradeModalDescriptionAreaError.isDisplayed(),
            ).toBeTruthy();
            expect(await tradePO.elements.reportTradeModalDescriptionAreaError.getText()).toEqual(
                "Description required",
            );
        });

        it("allows to report a problem as scam of used giftcard and then as chargeback id6387", async () => {
            await tradePO.pressReportAProblemLink();
            await tradePO.elements.reportTradeModalTypeSelect.click();
            await qaHelper.toBeVisible(
                tradePO.elements.reportTradeModalTypeSelectOption,
                15000,
                "Report type option is not visible",
            );
            await tradePO.elements.reportScamModalTypeSelectOptionUsedGiftCard.click();
            await tradePO.elements.reportTradeModalDescriptionArea.sendKeys(
                "here is a description",
            );
            await tradePO.confirmReportScam();
            await tradePO.openTrade(id_hashed); // refresh page
            expect(await tradePO.elements.reportStatus.getText()).toEqual(
                "Thank you for reporting this.",
            );

            //possibility of chargeback report after submitting a trade report

            await tradePO.pressReportAProblemLink();
            await tradePO.elements.reportTradeModalTypeSelect.click();
            await qaHelper.toBeVisible(
                tradePO.elements.reportTradeModalTypeSelectOption,
                15000,
                "Report type option is not visible",
            );
            await tradePO.elements.reportScamModalTypeSelectOptionChargeback.click();
            await tradePO.elements.reportTradeModalDescriptionArea.sendKeys(
                "here is a description",
            );
            await tradePO.confirmReportScam();

            await tradePO.openTrade(id_hashed); // refresh page
            expect(await tradePO.elements.reportStatusTitle.getText()).toEqual(
                "CHARGEBACK REPORT STATUS",
            );
            expect(await tradePO.elements.reportStatus.getText()).toEqual("Pending");
            expect(await tradePO.elements.reportScamStatusText.getText()).toEqual(
                "here is a description",
            );
        });
    });

    describe("Completed trade", () => {
        beforeAll(async () => {
            await initVendor();
            await tradePO.openTrade(id_hashed);
        });

        it('shows the "View in Dashboard" link id6389', async () => {
            await tradePO.elements.viewOrRepeatTradeButton.click();
            expect(await tradePO.elements.viewOrRepeatTradeDropDown.isDisplayed()).toBeTruthy();
            expect(await tradePO.elements.goToDashboardLink.getText()).toEqual("View in Dashboard");
            await tradePO.elements.viewOrRepeatTradeButton.click();
        });

        it('allows to go to classic dashboard by clicking the "Go to vendor dashboard" link id6390', async () => {
            await qaHelper.scrollToElement(tradePO.elements.viewOrRepeatTradeButton);
            await tradePO.elements.viewOrRepeatTradeButton.click();
            expect(await tradePO.elements.viewOrRepeatTradeDropDown.isDisplayed()).toBeTruthy();
            await tradePO.elements.goToDashboardLink.click();
            await dashboardPO.vendorDBPageLoadedLoggedIn();
        });
    });
});

async function init() {
    ({ offerOwner, clientUser, offerId } = await initUsersAndOffers("buy", { payment_method: 1 }));
    id_hashed = await startTrade(clientUser.id, offerId);
    await makeAUserExperienced(clientUser.id);
    await qaHelper.payInTrade(id_hashed);
    await qaHelper.releaseInTrade(id_hashed);
    await loginPO.logInAccount(clientUser.email);
}

async function initVendor() {
    ({ offerOwner, offerId } = await initUsersAndOffers("buy"));
    const clientVendorUser = await qaHelper.createRandomUser(true);
    await qaHelper.addBalance(clientVendorUser.id, initSatoshiBalance);
    await qaHelper.activateEmail(clientVendorUser.id);
    await qaHelper.togglePhoneVerification(clientVendorUser.id, "+3726000013");
    await qaHelper.enableNewTradeForUser(clientVendorUser.id);

    id_hashed = await startTrade(clientVendorUser.id, offerId);
    await makeAUserExperienced(clientVendorUser.id);
    await qaHelper.releaseInTrade(id_hashed);
    await loginPO.logInAccount(clientVendorUser.email);
}
