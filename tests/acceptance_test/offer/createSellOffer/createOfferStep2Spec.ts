import qaHelper from "../../../../utils/qaHelper";
import loginPage from "../../../../pages/loginPO";
import createOfferPage from "../../../../pages/createOfferPO";

describe("Create sell offer - Step 2", () => {
    beforeAll(async () => {
        const user = await qaHelper.createRandomUser();
        await qaHelper.toggleKycVerification(user.id, { id: true, document: false });
        await loginPage.logInAccount(user.email);
        await createOfferPage.navigateToCreateOfferPage();
        await createOfferPage.elements.paymentMethodsShowAllButton.click();
        await createOfferPage.elements.cashDeposits.click();
        await createOfferPage.selectPaymentMethod("Western Union");
        await createOfferPage.navigateToStep2();
    });

    it('shows the "You will earn..." text for a positive margin id5478', async () => {
        await createOfferPage.elements.margin.clear();
        await createOfferPage.elements.margin.sendKeys("10");

        expect(await createOfferPage.elements.marginText.getText()).toBe(
            "You will earn 10% on every sale",
        );
    });

    it('shows the "You will lose..." text for a negative margin id5479', async () => {
        await createOfferPage.elements.margin.clear();
        await createOfferPage.elements.margin.sendKeys("-10");

        expect(await createOfferPage.elements.marginText.getText()).toBe(
            "You will lose 10% on every sale",
        );
    });

    it('shows the "Minimum/Maximum range should be between ..." error message in case of wrong amount range id5480', async () => {
        await createOfferPage.elements.rangeMin.clear();
        await createOfferPage.elements.rangeMin.sendKeys("1");
        await createOfferPage.elements.rangeMax.clear();
        await createOfferPage.elements.rangeMax.sendKeys("100000");
        await createOfferPage.elements.nextStep.click();

        expect(await createOfferPage.elements.minAmountError.getText()).toBe(
            "Minimum range should be between 10 and 10,000 USD.",
        );
        expect(await createOfferPage.elements.maxAmountError.getText()).toBe(
            "Currently you can set the maximum to be between 10 and 10,000 USD. If you want higher limits for your offer, contact us and we’ll help you with it.",
        );
    });

    it('shows the "You accept trades between ..." message in case of correct amount range id5481', async () => {
        await createOfferPage.elements.rangeMin.clear();
        await createOfferPage.elements.rangeMin.sendKeys("10");
        await createOfferPage.elements.rangeMax.clear();
        await createOfferPage.elements.rangeMax.sendKeys("100");
        expect(await createOfferPage.elements.amountText.getText()).toBe(
            "You accept trades between 10 USD and 100 USD",
        );
    });

    it('verifies that the "Advanced mode" for a user is available id37404', async () => {
        await createOfferPage.switchToAdvancedMode();
        expect(await createOfferPage.elements.sourcePriceDropdown.getText()).toEqual(
            createOfferPage.constants.sourcePriceText,
        );
        expect(await createOfferPage.elements.pricePointDropdown.getText()).toEqual(
            createOfferPage.constants.pricePointText,
        );
    });
    //TODO fix
    // it("shows drop down with paxful as bitcoin price source", async () => {
    //     await createOfferPage.elements.advancedMode.click();
    //     expect(await createOfferPage.elements.priceEquationsSourceName.getText()).toBe("Paxful");
    // });
    // it("shows drop down with bitfinex as bitcoin price source", async () => {
    //     await createOfferPage.selectCustomPriceSource("bitfinex");
    //     expect(await createOfferPage.elements.priceEquationsSourceName.getText()).toBe("Bitfinex");
    // });
    // it("shows drop down with bitstamp as bitcoin price source", async () => {
    //     await createOfferPage.selectCustomPriceSource("bitstamp");
    //     expect(await createOfferPage.elements.priceEquationsSourceName.getText()).toBe("Bitstamp");
    // });
    // it("shows drop down with coinbase pro as bitcoin price source", async () => {
    //     await createOfferPage.selectCustomPriceSource("coinbase");
    //     expect(await createOfferPage.elements.priceEquationsSourceName.getText()).toBe("Coinbase Pro");
    // });
    // it("shows drop down with kraken as bitcoin price source", async () => {
    //     await createOfferPage.selectCustomPriceSource("kraken");
    //     expect(await createOfferPage.elements.priceEquationsSourceName.getText()).toBe("Kraken");
    // });
    // it("shows drop down with gemini as bitcoin price source", async () => {
    //     await createOfferPage.selectCustomPriceSource("gemini");
    //     expect(await createOfferPage.elements.priceEquationsSourceName.getText()).toBe("Gemini");
    // });
});
