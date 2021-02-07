import { browser } from "protractor";
import qaHelper from "../../../../utils/qaHelper";
import loginPage from "../../../../pages/loginPO";
import createOfferPage from "../../../../pages/createOfferPO";

describe("Create sell offer - Step 3", () => {
    beforeAll(async () => {
        const user = await qaHelper.createRandomUser();
        await qaHelper.toggleKycVerification(user.id, { id: true, document: false });
        await loginPage.logInAccount(user.email);
        await createOfferPage.navigateToCreateOfferPage();
        await createOfferPage.elements.paymentMethodsShowAllButton.click();
        await createOfferPage.elements.cashDeposits.click();
        await createOfferPage.selectPaymentMethod("Western Union");
        await createOfferPage.navigateToStep2();
        await createOfferPage.elements.rangeMin.clear();
        await createOfferPage.elements.rangeMin.sendKeys("10");
        await createOfferPage.elements.rangeMax.clear();
        await createOfferPage.elements.rangeMax.sendKeys("100");
        await createOfferPage.navigateToStep3();
    });

    it("should verify show offer only to users in your trusted list id989", async () => {
        await createOfferPage.elements.trustedList.click();

        expect(await createOfferPage.elements.trustedAndMinTradesText.getText()).toBe(
            "Only trusted users can begin a trade with you.",
        );
        await createOfferPage.elements.trustedList.click();
    });

    it("should verify show offer only to users with min trades required id990", async () => {
        await createOfferPage.elements.minTradeRequired.clear();
        await createOfferPage.elements.minTradeRequired.sendKeys("10");

        expect(await createOfferPage.elements.trustedAndMinTradesText.getText()).toBe(
            "Only users that meet your required minimum number of trades can begin a trade with you.",
        );
        await createOfferPage.elements.minTradeRequired.clear();
        await createOfferPage.elements.minTradeRequired.sendKeys("0");
    });

    it("should verify show offer only to users with min trades required and in the trusted list id5475", async () => {
        await createOfferPage.elements.minTradeRequired.clear();
        await createOfferPage.elements.minTradeRequired.sendKeys("10");
        await createOfferPage.elements.trustedList.click();

        expect(await createOfferPage.elements.trustedAndMinTradesText.getText()).toBe(
            "Only trusted users that meet your required minimum number of trades can begin a trade with you.",
        );
    });

    it("should verify limitations by country id991", async () => {
        await createOfferPage.elements.allowedCountries.click();

        expect(await createOfferPage.elements.countryLImitations.getText()).toBe(
            "You have set country limitations",
        );
    });

    //TODO separate adding to fields and put normal terms and trade instruction text
    it("should enter offer terms id982", async () => {
        await createOfferPage.elements.offerTerms.sendKeys(
            createOfferPage.constants.offerTermsText,
        );
        expect(await createOfferPage.elements.offerTerms.getAttribute("value")).toBe(
            createOfferPage.constants.offerTermsText,
        );
    });

    it("should enter trade instructions id983", async () => {
        await createOfferPage.elements.tradeInstructions.sendKeys(
            createOfferPage.constants.tradeDetailsText,
        );
        expect(await createOfferPage.elements.tradeInstructions.getAttribute("value")).toBe(
            createOfferPage.constants.tradeDetailsText,
        );
    });

    it("should press create offer and deny offer terms id5477", async () => {
        await qaHelper.toBeVisible(
            createOfferPage.elements.nextStep,
            10000,
            "vendor terms did not appear in 10 seconds",
        );
        await createOfferPage.elements.nextStep.click();
        await qaHelper.toBeVisible(
            createOfferPage.elements.vendorTermsModal,
            10000,
            "vendor terms did not appear in 10 seconds",
        );
        await browser.sleep(200);
        await createOfferPage.elements.denyVendorTerms.click();
        await qaHelper.toBeInvisible(
            createOfferPage.elements.vendorTermsModal,
            10000,
            "vendor terms did not appear in 10 seconds",
        );
        expect(await createOfferPage.elements.denyTermsMessage.getText()).toBe(
            "You did not accept vendor terms. You can not create or change your sell offers. In future you can accept vendor terms on create offer page.",
        );
    });

    it("should finish creating offer and redirect to dashboard id5476", async () => {
        await qaHelper.toBeVisible(
            createOfferPage.elements.nextStep,
            15000,
            "vendor terms did not appear in 10 seconds",
        );
        await createOfferPage.elements.nextStep.click();
        await qaHelper.toBeVisible(
            createOfferPage.elements.vendorTermsModal,
            14000,
            "vendor terms did not appear in 10 seconds",
        );
        await browser.sleep(200);
        await createOfferPage.elements.agreeVendorTerms.click();

        await qaHelper.urlIs(
            "/vendor/dashboard?action=save",
            30000,
            "url did not change to the correct one",
        );
        expect(await browser.getCurrentUrl()).toEqual(
            browser.params.baseUrl + "/vendor/dashboard?action=save",
        );
    });

    it("should wait for success message modal after successfully creating offer id5471", async () => {
        await qaHelper.toBeVisible(
            createOfferPage.elements.successModal,
            30000,
            "successfully created an offer modal did not appear in 20 seconds",
        );

        expect(await createOfferPage.elements.successModal.getText()).toBe(
            "You have successfully created an offer!\n" +
                "Now that your offer has been created, go ahead share it with anybody who would be interested buying from you!\n" +
                "or copy this link and share directly:\n" +
                "Copy",
        );
    });
});
