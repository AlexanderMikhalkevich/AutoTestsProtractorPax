import qaHelper from '../utils/qaHelper';
import {$, browser, by, element} from "protractor";

class MainPage {
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
        
        titleText: $('title'), 

        homepageWidget: $('#mainWidget'),

        widgetBuyOfferTypeBtn: $('button[tabid="0"]'), 
        
        widgetSellOfferTypeBtn: $('button[tabid="1"]'), 

        widgetPaymentMethodsBtn: element(by.buttonText('Show all')),

        widgetPaymentMethodsAllBtn: element(by.buttonText('Select All')),

        widgetPaymentMethodsBanktranAllBtn: element(by.buttonText('View offers for bank transfers')),

        //Search field
        widgetSearchPaymentMethInput: $('.qa-paymentMethodPickerModalSearch'), 

        widgetSearchResultBankTransferElement: $('.qa-paymentMethodPickerModalItemName'),

        widgetPaymentMethodsInput: element(
            by.xpath('//*[@id="mainWidget"]/div[4]/div/input')
        ), 

        widgetPaymentMethodsModal: $('.PaymentMethodPickerModal__content'),  
        
        //Bank Transfer
        widgetPaymentMethodSelectBtn:  $('.Tabs__inner button:nth-child(2)'),

        // Section Choises (Bank Transfer->First element)
        widgetPaymentMethodChoiseSection: $('.modal-body > div:nth-child(5) > button:nth-child(1)'),       

        widgetPaymentMethodPopularSelectBtn:  $('.modal-body div:nth-child(3) button:nth-child(1)'),     
        
        widgetCurrencyPickerBtn: element(by.buttonText('Any currency')),
      
        widgetCurrencyPicker: element(
            by.xpath('//div[text()="British Pound"]/../..')
        ),

        widgetCurrencyAmount: $('#mainWidgetForm_AmountYouPay_Field'),
        
        widgetSearchBtn: element(by.buttonText('Find Offers')),

        widgetCryptoCurrencyTetherBtn: $('.MainWidgetBody__widget>div:nth-child(2) button:nth-child(2)'),

        widgetCryptoCurrencyBTCBtn: $('.MainWidgetBody__widget>div:nth-child(2) button:nth-child(1)'),

        //Elements on the <host>/{buy/sell-bitcoin/tether} page
        

        //BuySellSidebar - Cryptocurrency field
        BuySellSidebarCryptocurrencyDropDawn: element(
            by.xpath('//*[@id="tour-filters"]/div[1]/div[1]/div/div/button')
        ),

        //BuySellSidebar -Payment method input
        BuySellSidebarPaymentMethod: element(
            by.xpath('//*[@id="tour-filters"]/div[1]/div[2]/div/input')
        ),

        
    };
    
    async go() {
        await browser.get(browser.params.baseUrl + '/'); //overrides baseURL
    }

    async checkPageLoaded() {
        await this.elements.titleText.isDisplayed(); 
    }

    async checkWidgetLoaded() {
        await this.elements.homepageWidget.isDisplayed();
    }


    // Select offers
    async selectSellOfferType() {
        await this.elements.widgetSellOfferTypeBtn.click();
    }

    async selectBuyOfferType() {
        await this.elements.widgetBuyOfferTypeBtn.click();
    }



    // Select CryptoCurrency
    
    async selectTetherCryptoCurrency() {
        await this.elements.widgetCryptoCurrencyTetherBtn.click();
    }

    async selectBtcCryptoCurrency() {
        await this.elements.widgetCryptoCurrencyBTCBtn.click();
    }



    async selectWidgetPaymentMethod() {
        await this.elements.widgetPaymentMethodsBtn.click();
        await this.elements.widgetPaymentMethodsModal.isDisplayed();
        await this.elements.widgetPaymentMethodSelectBtn.click();
        await this.elements.widgetPaymentMethodPopularSelectBtn.click();
        
    }

    
    async selectWidgetCurrency() {
        await this.elements.widgetCurrencyPickerBtn.click();
        await this.elements.widgetCurrencyPicker.isDisplayed();
        await this.elements.widgetCurrencyPicker.click();
                
    }

    async fillInAnyAmount() {
        await this.elements.widgetCurrencyAmount.sendKeys('50');
                
    }  


    async widgetSearch() {
        await this.elements.widgetSearchBtn.click();
        
    }

       
    
    // Payment method section - BTC, Sell offer

    async selectWidgetPaymentMethodAll() {
        await this.elements.widgetPaymentMethodsBtn.click();
        await this.elements.widgetPaymentMethodsModal.isDisplayed();
        await this.elements.widgetPaymentMethodsAllBtn.click();       
    }

    
    
    
    
    //ToDo


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

export default new MainPage();