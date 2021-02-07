import {$, browser, by, element} from "protractor";

class AdminPage {
    elements = {
        pendingSection: $('#pending-submenu'),
        tradesSection: $('#trade-submenu'),
        usersSection: $('#users-submenu'),
        searchFieldHeader: element(by.name('search_string')),
        paxfulCoreSubMenu: $('a.admin-menu.collapsed'),
        paymentMethodsPaxfulCore: element(by.linkText('Payment Methods')),
        selectAmazonGiftCardPaymentMethod: element (by.linkText('Amazon Gift Card')),
        vendorFeeField: element(by.name('PaymentMethod[vendor_escrow_fee_percentage]')),
        descriptionLong: element(by.name('PaymentMethod[description_long]')),
        updatePaymentMethod: element(by.buttonText('Update')),
    };

    async goToDashboard() {
        await browser.get(browser.params.baseUrl + '/admin108/dashboard');
    }

    async goToPaymentMethods() {
        await browser.get(browser.params.baseUrl + '/admin108/payment-methods');
    }

    async clickOnPaxfulCore() {
        await this.elements.paxfulCoreSubMenu.click();
        await browser.sleep(3000);
    }

    async clickOnPaymentMethods() {
        await this.elements.paymentMethodsPaxfulCore.click();
        await browser.sleep(3000);
    }

    async clickOnAmazonGiftCardPaymentMethod() {
        await this.elements.selectAmazonGiftCardPaymentMethod.click();
    }

    async changeVendorFee(amount) {
        const elements = this.elements;
        const vendorFee = elements.vendorFeeField;
        await vendorFee.clear();
        await vendorFee.sendKeys(amount);
        await elements.descriptionLong.clear();
        await elements.descriptionLong.sendKeys('Fee is changed. AutoTest');
        await elements.updatePaymentMethod.click();
        await browser.sleep(2000);
        expect(await vendorFee.getAttribute('value')).toBe(amount);
    }
}

export default new AdminPage();