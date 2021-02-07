import qaHelper from "../../utils/qaHelper";
import loginPage from "../../pages/loginPO";
import offerViewPage from "../../pages/offerViewPO";
import suspendedPage from "../../pages/suspendedPO";

describe('Compomised status -', () => {
    let compromisedUser, notCompromisedUser;
    let sellOffer, buyOffer;

    const text = {
        compromisedErrorMessage: "We noticed a possible threat to your account and have locked it temporarily until we " +
            "can confirm that your account is safe. Contact our customer support team to unlock your account.",
    };

    beforeAll(async () => {
        compromisedUser = await qaHelper.createRandomUser(true, 2);
        await qaHelper.addBalance(compromisedUser.id, 100000000);

        sellOffer = await qaHelper.createOffer(compromisedUser.id, 'usd', 500, 1, 'sell');
        buyOffer = await qaHelper.createOffer(compromisedUser.id, 'usd', 500, 1, 'buy');
        await qaHelper.updateUserstatus(compromisedUser.id, 'compromised');

        notCompromisedUser = await qaHelper.createRandomUser(false, 1);
        await qaHelper.addBalance(notCompromisedUser.id, 100000000);
    });

    describe('compromised user', () => {
        beforeAll(async () => {
            await loginPage.logInAccount(compromisedUser.email, 'xXxXxX1!', true);
        });

        it('should not allow to login if user is compromised and warning message is shown id6600', async () => {
            expect(await loginPage.isNotLoggedIn()).toBeTruthy();
            expect(await loginPage.elements.errorMessageCompromised.getText()).toBe(text.compromisedErrorMessage);
        });
    });

    describe('not compromised user', () => {
        beforeAll(async () => {
            await loginPage.logInAccount(notCompromisedUser.email);
        });

        it('should not allow to start a trade with compromised sell offer owner id6601', async () => {
            await offerViewPage.openOfferPage(sellOffer);
            await offerViewPage.chooseLastOptionInFixedAmountList();
            await offerViewPage.clickStartTradeButton();
            expect(await offerViewPage.elements.alertCannotStartTrade.getText()).toBe(suspendedPage.text.cannotStartTradeMessage);
        });

        it('should not allow to start a trade with compromised buy offer owner id6602', async () => {
            await offerViewPage.openOfferPage(buyOffer);
            await offerViewPage.chooseLastOptionInFixedAmountList();
            await offerViewPage.clickStartTradeButton();
            expect(await offerViewPage.elements.alertCannotStartTrade.getText()).toBe(suspendedPage.text.cannotStartTradeMessage);
        });
    });
});
