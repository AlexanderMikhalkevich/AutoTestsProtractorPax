import qaHelper from '../utils/qaHelper';
import {$, browser, by, element} from "protractor";

class HomePage {
    elements = {
        addField: $('[placeholder="add new todo here"]'),
        checkedBox: element(by.model('todo.done')),
        addButton: $('[value="add"]'),
        createAccount: $('#open-register-modal'),
        createAccAndWalletBtn: $('#btn-register-modal'),
        registerEmail: $('#register_email'),
        registerEmailConfirmation: $('#register_email_confirmation'),
        registerUsername: $('#register_username'),
        registerPassword: $('#register_password'),
        notificationBell: $('i.icon-bell'),
        notificationBellFirst: $('a.notification-message'),
        viewAllNotifications: $('a.heading-sublink.pull-right'),
        homepageWidget: $('#main-widget'),
        widgetPaymentMethodsBtn: $('a.c-selectPaymentInput'),
        widgetPaymentMethodsModal: $('.modal-content.PaymentMethodPickerModal__content'),
        widgetPaymentMethodSelectBtn: element((by.cssContainingText('.PaymentMethodItem__name', 'iTunes Gift Card'))),
        widgetCurrencyPickerBtn: element(by.buttonText('Any currency')),
        widgetCurrencyPicker: element(by.cssContainingText('.CurrencyAmountPicker__currencyOption', 'US Dollar')),
        widgetSearchBtn: $('a.btnSearch__link'),
    };

    async go() {
        await browser.get(browser.params.baseUrl + '/'); //overrides baseURL
    }

    async checkPageLoaded() {
        throw new Error('here is no that element. fix the test');
        //await this.elements.titleText.isDisplayed();
    }

    async checkWidgetLoaded() {
        await this.elements.homepageWidget.isDisplayed();
    }

    async selectWidgetPaymentMethod() {
        await this.elements.widgetPaymentMethodsBtn.click();
        await browser.sleep(500);
        await this.elements.widgetPaymentMethodsModal.isDisplayed();
        await this.elements.widgetPaymentMethodSelectBtn.click();
        await browser.sleep(500);
    }

    async selectWidgetCurrency() {
        await this.elements.widgetCurrencyPickerBtn.click();
        await browser.sleep(500);
        await this.elements.widgetCurrencyPicker.isDisplayed();
        await this.elements.widgetCurrencyPicker.click();
    }

    async widgetSearch() {
        await this.elements.widgetSearchBtn.click();
        expect(await browser.getCurrentUrl()).toContain(browser.params.baseUrl + "/buy-bitcoin/");
    }

    async openCreateUserModal() {
        await this.elements.createAccount.click();
        await browser.sleep(5000);
    }

    async createUserModalLoaded() {
        await this.elements.createAccAndWalletBtn.isDisplayed();
    }

    //TODO change with faker data
    async fillAllFieldsForNewUser() {
        const elements = this.elements;

        const random = Math.floor((Math.random() * 100000) + 1);
        const email = 'test' + random + '@test.ee';
        const nick = 'test' + random;
        const password = email + nick;

        await elements.registerEmail.sendKeys(email);
        await elements.registerEmailConfirmation.sendKeys(email);
        await elements.registerUsername.sendKeys(nick);
        await elements.registerPassword.sendKeys(password);
    }

    async pressCreateAccAndWallet() {
        await this.elements.createAccAndWalletBtn.click();
        await qaHelper.urlIs('/dashboard',25000, 'not on dashboard');
    }

    async clickNotificationBell() {
        await this.elements.notificationBell.click();
    }

    async firstNotificationMessageToBe(message) {
        expect(await this.elements.notificationBellFirst.getText()).toBe(message);
    }

    async pressViewAllNotifications() {
        const elements = this.elements;
        await elements.notificationBell.click();
        await elements.viewAllNotifications.click();
    }
}

export default new HomePage();
