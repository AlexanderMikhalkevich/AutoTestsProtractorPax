import qaHelper from "../../../../utils/qaHelper";
import loginPage from "../../../../pages/loginPO";
import createOfferPage from "../../../../pages/createOfferPO";

describe("Create buy offer by not verified user", () => {
    beforeAll(async () => {
        const user = await qaHelper.createRandomUser();
        await loginPage.logInAccount(user.email);
        await createOfferPage.navigateToCreateOfferPage();
    });

    it('should display "verify your ID" alert on the step 1 id5363', async () => {
        expect(await createOfferPage.elements.topAlert.getText()).toContain("To create an offer on Paxful, please take a few minutes and complete your identity verification.");
    });

    it("does not allow to create a sell (does not allow to go to the 2nd step) id6647", async () => {
        expect(await createOfferPage.elements.nextStep.isDisplayed()).toBeTruthy();
        expect(await isClickable(createOfferPage.elements.nextStep)).toBeFalsy();
    });
});

async function isClickable(element) {
    let isClickable = true;
    try {
        await element.click();
    } catch (e) {
        isClickable = false;
    }
    return isClickable;
}
