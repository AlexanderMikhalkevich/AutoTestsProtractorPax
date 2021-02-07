import qaHelper from "../../utils/qaHelper";
import { $, $$, browser, by, element } from "protractor";

class KioskLandingPage {
    elements = {
        registerKiosk: $("#header-cta"),
        emailField: $("#email"),
        emailConfirmation: $("#email-confirmation"),
        affiliateNameField: $("#affiliate_name"),
        passwordField: $("#password"),
        createAccountButton: $("#create-account-btn"),
        customizeYourKioskLink: $("#customisationKiosk"),
        amountInFiatField: $("#widget_amount"),
        selectACurrencyField: $("#widget_currency"),
        selectACurrencyFieldSelect: $("#select2-widget_currency-container"),
        selectACurrencyFieldSearch: $("input.select2-search__field"),
        selectACurrencyFieldResults: $$("#select2-widget_currency-results li"),
        paymentTypeField: $("#widget_paymenttype"),
        paymentTypeFieldSelect: $("#select2-widget_paymenttype-container"),
        paymentTypeFieldSearch: $("input.select2-search__field"),
        paymentTypeFieldResults: $$("#select2-widget_paymenttype-results li"),
        paymentMethodField: $("#widget_paymentmethod"),
        paymentMethodFieldSelect: $("#select2-widget_paymentmethod-container"),
        paymentMethodFieldSearch: $("input.select2-search__field"),
        paymentMethodFieldResults: $$("#select2-widget_paymentmethod-results li"),
        specificOfferField: $("#select2-widget_offer-container"),
        specificOfferFieldSearch: $("input.select2-search__field"),
        specificOfferFieldResults: $$("#select2-widget_offer-results li"),
        offerField: $("#widget_offer"),
        kioskLink: $("input#widget_link"),
    };

    async go() {
        await browser.get(browser.params.baseUrl + "/buy-bitcoin-kiosk"); //overrides baseURL
    }

    async checkPageLoaded() {
        await qaHelper.toBeVisible(this.elements.registerKiosk, 15000, `Can't open the Kiosk page`);
    }

    async goToAdvancedCustomization() {
        await browser.get(browser.params.baseUrl + "/buy-bitcoin-kiosk#customizationAccordion"); //overrides baseURL
    }
}
export default new KioskLandingPage();
