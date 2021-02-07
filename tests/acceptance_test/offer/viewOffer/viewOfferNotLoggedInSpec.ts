import qaHelper from "../../../../utils/qaHelper";
import offerViewPage from "../../../../pages/offerViewPO";

let requireTrustedOffer, normalOffer;

describe("View Offer not logged in", () => {
    beforeAll(async () => {
        await qaHelper.resetState();

        const requireTrustedOfferOwner = await qaHelper.createRandomUser(true);
        await qaHelper.toggleKycVerification(requireTrustedOfferOwner.id, {id: true, document: false});
        requireTrustedOffer = await qaHelper.createSpecificOffer({
            user_id: requireTrustedOfferOwner.id,
            show_only_trusted_user: true,
        });

        const normalOfferOwner = await qaHelper.createRandomUser(true);
        await qaHelper.toggleKycVerification(normalOfferOwner.id, {id: true, document: false});
        normalOffer = await qaHelper.createSpecificOffer({user_id: normalOfferOwner.id});
    });

    it('should create account when "Create free account" button is pressed id5343', async () => {
        await qaHelper.navigateToUrl("/offer/" + normalOffer);
        await offerViewPage.elements.createAccountButton.click();
        await qaHelper.toBeVisible(
            offerViewPage.elements.email,
            5000,
            "Email field not visible on offer page",
        );
        const user = await qaHelper.getRandomUserData();
        await offerViewPage.elements.email.sendKeys(user.email);
        await offerViewPage.elements.password.sendKeys("xXxXxX1!");
        await offerViewPage.elements.registerAccountButton.click();
        await qaHelper.toBeVisible(
            offerViewPage.elements.headerUsername,
            15000,
            "username in the page header is not visible",
        );
        expect(await offerViewPage.elements.headerUsername.isPresent()).toBe(true);
    });

    xit('should say "Offer not found" id5338', async () => {
        await qaHelper.navigateToUrl("/offer/" + requireTrustedOffer, "/buy-bitcoin");
        await qaHelper.toBeVisible(
            offerViewPage.elements.errorMessage,
            5000,
            "Offer not found message not visible",
        );
        expect(await offerViewPage.elements.errorMessage.getText()).toBe("Offer not found");
    });
});
