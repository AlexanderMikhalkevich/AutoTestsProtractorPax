import qaHelper from "../../../../utils/qaHelper";
import loginPage from "../../../../pages/loginPO";
import createOfferPage from "../../../../pages/createOfferPO";
import { browser } from "protractor";

describe("Create buy offer by ID verified user", () => {
    beforeAll(async () => {
        const user = await qaHelper.createRandomUser();
        await qaHelper.toggleKycVerification(user.id, {id: true, document: false});
        await loginPage.logInAccount(user.email);
        await createOfferPage.navigateToCreateOfferPage();
        await createOfferPage.switchToBuyOffer();
    });

    it('should not display "verify your ID" alert on the step 1 id5468', async () => {
        expect(await createOfferPage.elements.topAlert.isPresent()).toBeFalsy();
    });

    describe("Step 2", () => {
        beforeAll(async () => {
            await createOfferPage.elements.paymentMethodsShowAllButton.click();
            await qaHelper.scrollToElement(createOfferPage.elements.cashDeposits);
            await createOfferPage.elements.cashDeposits.click();
            await createOfferPage.selectPaymentMethod("Western Union");
            await createOfferPage.navigateToStep2();
        });

        it('should display "deposit at least 0.02 btc" alert id5408', async () => {
            expect(
                await createOfferPage.elements.depositAtLeast002BTCAlert.isDisplayed(),
            ).toBeTruthy();
        });

        describe("Step 3", () => {
            beforeAll(async () => {
                await createOfferPage.elements.rangeMin.clear();
                await createOfferPage.elements.rangeMin.sendKeys("10");
                await createOfferPage.elements.rangeMax.clear();
                await createOfferPage.elements.rangeMax.sendKeys("100");
                await createOfferPage.navigateToStep3();
                await createOfferPage.elements.offerTerms.sendKeys(
                    createOfferPage.constants.offerTermsText,
                );
                await createOfferPage.elements.tradeInstructions.sendKeys(
                    createOfferPage.constants.tradeDetailsText,
                );
            });

            it("should finish creating offer and redirect to dashboard id5359", async () => {
                await createOfferPage.elements.nextStep.click();
                await qaHelper.urlIs(
                    "/vendor/dashboard?action=save",
                    30000,
                    "url did not change to the correct one",
                );
                expect(await browser.getCurrentUrl()).toEqual(
                    browser.params.baseUrl + "/vendor/dashboard?action=save",
                );
            });

            //TODO: I believe here should be "selling to you" instead of "buying from you"
            it("should wait for success message modal after successfully creating offer id5470", async () => {
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
    });
});
