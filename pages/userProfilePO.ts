import {$, $$, browser, by, element, ExpectedConditions as EC} from "protractor";

import qaHelper from "../utils/qaHelper";

class UserProfilePage {
    elements = {
        pageTitle: $('#page-title'),
        amountFiatField: $('#amount_fiat'),
        dropDownValue: $('[value="25"]'),
        startTradeButton: $('#start-trade-btn'),
        trustButton: $('#btn-trust'),
        blockButton: $('#btn-block'),
        flushMessage: $('.qa-session-message'),
        activeTradesTable: $('.qa-active-trades-table'),
        pastTradesTable: $('.qa-past-trades-table'),
        bio: $('.qa-profile-bio-description'),
        activeOffers: {
            sellCryptocurrencyTabButton: element(by.cssContainingText('.qa-active-offers-tabs > button', 'Sell cryptocurrency')),
            buyCryptocurrencyTabButton: element(by.cssContainingText('.qa-active-offers-tabs > button', 'Buy cryptocurrency')),
            buyCryptocurrencyTabContent: $('.qa-active-offers-buy-tab'),
            sellCryptocurrencyTabContent: $('.qa-active-offers-sell-tab'),
            offersList: $$('.qa-active-offer'),
        }
    };

    text = {
        trustMessage: 'We\'ve added',
        untrustMessage: 'We\'ve removed',
        untrustButton: 'Untrust',
        trustButton: 'Trust',
        blockMessage: 'You have blocked',
        unblockMessage: 'You have unblocked',
        blockButton: 'Block',
        unblockButton: 'Unblock',
        bio: 'bio',
        cantBlockMessage: 'You need to be ID Verified or have completed at least one trade with this person on Paxful to be able to block them.'
    };

    async go(username: string): Promise<void> {
        await browser.get(`${browser.params.baseUrl}/user/${username}`);
        await this.checkThatPageIsLoaded(username);
    }

    async checkThatPageIsLoaded(username: string) {
        expect(await browser.getCurrentUrl()).toContain(`${browser.params.baseUrl}/user/${username}`);
    }

    async switchActiveOffersToSellCryptocurrencyTab() {
        await browser.wait(EC.elementToBeClickable(this.elements.activeOffers.sellCryptocurrencyTabButton), 10000, '"Sell cryptocurrency" tab button should be visible');
        await this.elements.activeOffers.sellCryptocurrencyTabButton.click();
        await browser.wait(EC.visibilityOf(this.elements.activeOffers.sellCryptocurrencyTabContent), 10000, '"Sell cryptocurrency" tab content should be visible');
    }

    async switchActiveOffersToBuyCryptocurrencyTab() {
        await browser.wait(EC.elementToBeClickable(this.elements.activeOffers.buyCryptocurrencyTabButton), 10000, '"Buy cryptocurrency" tab button should be visible');
        await this.elements.activeOffers.buyCryptocurrencyTabButton.click();
        await browser.wait(EC.visibilityOf(this.elements.activeOffers.buyCryptocurrencyTabContent), 10000, '"Buy cryptocurrency" tab content should be visible');
    }

    async getActiveOffersCount() {
        return await this.elements.activeOffers.offersList.count();
    }

    async clickBuyOfferWithLabel(name) {
        await element(by.xpath(".//strong/span[text()='" + name + "']/../../../td/a[text()='Buy']")).click();
    }

    async clickSellOfferWithLabel(name) {
        await element(by.xpath(".//strong/span[text()='" + name + "']/../../../td/a[text()='Sell']")).click();
    }

    async pressTrustButton() {
        await this.elements.trustButton.click();
        await qaHelper.toBeVisible(this.elements.flushMessage, 1000, "Success message is not visible");
    }

    async pressBlockButton() {
        await this.elements.blockButton.click();
        await qaHelper.toBeVisible(this.elements.flushMessage, 1000, "Success message is not visible");
    }
}

export default new UserProfilePage();
