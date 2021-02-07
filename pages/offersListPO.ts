import { $, $$, browser, by, element, ExpectedConditions as EC, protractor } from "protractor";

import qaHelper from "../utils/qaHelper";

class OffersListPage {
    elements = {
        pageTitle: $(".qa-viewOffersHeroTitle"),
        offersListHeader: $("#offers-table .qa-offer-list-header"),
        linkShowNonVerifiedOffers: element(
            by.xpath(".//span[contains(text(), 'Click to see them but be aware of the risks!')]"),
        ),
        offerNotActiveError: element(
            by.xpath(
                ".//div[contains(text(),'Offer is not active anymore. Please browse other offers for')]",
            ),
        ),
        offersListsContainer: $("#offer-list"),
        offersLists: $$(".qa-offers-list"),
        searchButton: $(".qa-offers-search-button:not([disabled])"),
        giveMeTheBestButton: $("#lucky-btn:not([disabled])"),
        loadingOffersMessage: element(
            by.xpath('//div[@id="offers-section"]//div[contains(text(), "Loading offers")]'),
        ),
        countrySelectorButton: $(".qa-search-country-cta"),
        countrySelectorSearchInput: $(".qa-search-country-cta").element(by.xpath("..//input")), //$("div:has(> .qa-search-country-cta) input"),
        helpTourSkipButton: $("#tour-skip-button"),
    };

    async waitForSearchResults() {
        await browser.wait(
            EC.visibilityOf(this.elements.searchButton),
            15000,
            "search button should be visible and enabled",
        );
        await browser.wait(
            EC.visibilityOf(this.elements.offersListsContainer),
            15000,
            "offers list should be visible",
        );
    }

    async goBuyBitcoin() {
        await browser.get(browser.params.baseUrl + "/buy-bitcoin");
        await qaHelper.scrollToTop();
        await this.waitForSearchResults();
        const skipTourBtn = this.elements.helpTourSkipButton;
        if (await skipTourBtn.isPresent()) {
            await skipTourBtn.click();
        }
    }

    async goSellBitcoin() {
        await browser.get(browser.params.baseUrl + "/sell-bitcoin");
        await qaHelper.scrollToTop();
        await this.waitForSearchResults();
        const skipTourBtn = this.elements.helpTourSkipButton;
        if (await skipTourBtn.isPresent()) {
            await skipTourBtn.click();
        }
    }
    async checkBuyBitcoinPageIsLoaded() {
        await qaHelper.toBeVisible(
            this.elements.pageTitle,
            15000,
            `Can't open the Buy Bitcoin page`,
        );
        expect(await this.elements.pageTitle.getText()).toContain("Buy Bitcoin");
    }

    async checkSellBitcoinPageIsLoaded() {
        await qaHelper.toBeVisible(
            this.elements.pageTitle,
            15000,
            `Can't open the Sell Bitcoin page`,
        );
        expect(await this.elements.pageTitle.getText()).toContain(
            "Sell Bitcoin (BTC)",
        );
    }

    async selectPaymentMethod(paymentMethod: string): Promise<void> {
        await $(".qa-paymentMethodInput").click();
        await browser.sleep(1000);
        await $(".qa-paymentMethodPickerModalSearch").sendKeys(paymentMethod);
        await $(`.qa-paymentMethodPickerModalItemName[title="${paymentMethod}"]`).click();
        console.log("${paymentMethod} :: ", paymentMethod);
        await browser.sleep(500);
        await this.waitForSearchResults();
    }

    async search(): Promise<void> {
        await browser.wait(
            EC.visibilityOf(this.elements.searchButton),
            15000,
            "search button should be visible and enabled",
        );
        await qaHelper.scrollToElement(this.elements.searchButton);
        await this.elements.searchButton.click();
        await this.waitForSearchResults();
    }

    async checkOfferWithLabelNotListed(label: string) {
        await browser.wait(
            EC.invisibilityOf(
                this.elements.offersLists
                    .first()
                    .element(by.cssContainingText(".qa-paymentMethodGroup", label)),
            ),
            1000,
            `Offer with "${label}" label should NOT be listed`,
        );
    }

    async checkOfferWithLabelIsListed(label: string) {
        await browser.wait(
            EC.visibilityOf(
                this.elements.offersLists
                    .first()
                    .element(by.cssContainingText(".qa-paymentMethodGroup", label)),
            ),
            1000,
            `Offer with "${label}" label should be listed`,
        );
    }

    async selectCountry(country: string) {
        await this.elements.countrySelectorButton.click();
        await this.elements.countrySelectorSearchInput.clear();
        await this.elements.countrySelectorSearchInput.sendKeys(country);
        await this.elements.countrySelectorSearchInput.sendKeys(protractor.Key.ENTER);
        await this.waitForSearchResults();
    }
}

export default new OffersListPage();
