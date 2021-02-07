import {browser} from "protractor";
import homePage from '../../pages/homePagePO';

describe('Homepage Widget', () => {
    beforeAll(async () => {
        await homePage.go();
    });

    it('should check widget loaded', async () => {
        await homePage.checkWidgetLoaded();
    });

    it('should open widget payment methods modal window and select payment method', async () => {
        await homePage.selectWidgetPaymentMethod();
    });

    it('should open widget currency picker and select currency', async () => {
        await homePage.selectWidgetCurrency();
    });

    it('should search buy offers', async () => {
        await homePage.widgetSearch();
    });
});
