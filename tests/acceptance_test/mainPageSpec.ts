import {browser} from "protractor";
import MainPage from '../../pages/mainPagePO';

    
    // "mainWidjet" modal window -> "Payment methods" field functionality 
    // BTC Sell offer

    xdescribe('"Payment method" section, cryptoCurrency - BTC, Sell offer', () => {
        beforeEach(async () => {
            await MainPage.go();
            await MainPage.checkWidgetLoaded();
            await MainPage.selectSellOfferType();
            await browser.sleep(500);
            await MainPage.selectBtcCryptoCurrency();
            await browser.sleep(500);
            await MainPage.elements.widgetPaymentMethodsBtn.click();

        });
              
        
        it ('C62555 payment method according to the typed symbols in the "Search" field  is displayed at modal window', async () => {
 
            MainPage.elements.widgetSearchPaymentMethInput.sendKeys('bank');  
            await browser.sleep(500); 

            var checkedElement = MainPage.elements.widgetSearchResultBankTransferElement;
            await browser.sleep(500); 

            expect(await checkedElement.getText()).toEqual('Bank Transfer'); 
    
        })
    
        it ('C62543 "Payment method" input has value "All payment methods" when User clicks on "Select All" button at modal window ("All payment methods" section)', async () => {
 
            await MainPage.elements.widgetPaymentMethodsAllBtn.click();
                                            
            expect(await MainPage.elements.widgetPaymentMethodsInput.getAttribute('value')).toEqual('All Payment Methods');
    
        })

        it ('C62530 "Payment method" input has value "Bank transfer" when User choosed this one at modal window ("Popular section")', async () => {
     
            await MainPage.elements.widgetPaymentMethodSelectBtn.click();
            await MainPage.elements.widgetPaymentMethodPopularSelectBtn.click();
                                  
            expect(await MainPage.elements.widgetPaymentMethodsInput.getAttribute('value')).toEqual('Bank Transfer');
    
        })

        it ('C62542 "Payment method" input has value an element which User clicked on "Bank Transfers (Choise)" section at modal window', async () => {
    
            await MainPage.elements.widgetPaymentMethodSelectBtn.click();
            await browser.sleep(5000);
            await MainPage.elements.widgetPaymentMethodChoiseSection.click();
            await browser.sleep(5000);                  
            expect(await MainPage.elements.widgetPaymentMethodsInput.getAttribute('value')).toEqual('Bank Transfer');
    
        })

        it ('C62531 "Payment method" input has value "Bank transfer" when User clicked on "View offers for bank transfer" button at modal window ("Bank transfer section")', async () => {
    
            await MainPage.elements.widgetPaymentMethodSelectBtn.click();
            await MainPage.elements.widgetPaymentMethodsBanktranAllBtn.click();
            await browser.sleep(5000);
                                  
            expect(await MainPage.elements.widgetPaymentMethodsInput.getAttribute('value')).toEqual('Bank Transfers');
    
        })
    
    });  

    // "mainWidjet" modal window -> "Payment methods" field functionality 
    // Tether, Buy offer

    xdescribe('"Payment method" section, cryptoCurrency - Tether, Buy offer', () => {
        beforeEach(async () => {
            await MainPage.go();
            await MainPage.checkWidgetLoaded();
            await MainPage.selectBuyOfferType();
            await browser.sleep(500);
            await MainPage.selectTetherCryptoCurrency();
            await browser.sleep(500);
            await MainPage.elements.widgetPaymentMethodsBtn.click();

        });        
        
        it ('C62555 payment method according to the typed symbols in the "Search" field  is displayed at modal window', async () => {
 
            MainPage.elements.widgetSearchPaymentMethInput.sendKeys('bank');  
            await browser.sleep(500); 

            var checkedElement = MainPage.elements.widgetSearchResultBankTransferElement;
            await browser.sleep(500); 

            expect(await checkedElement.getText()).toEqual('Bank Transfer'); 
    
        })
    
        it ('C62543 "Payment method" input has value "All payment methods" when User clicks on "Select All" button at modal window ("All payment methods"  section)', async () => {
 
            await MainPage.elements.widgetPaymentMethodsAllBtn.click();
                                            
            expect(await MainPage.elements.widgetPaymentMethodsInput.getAttribute('value')).toEqual('All Payment Methods');
    
        })

        it ('C62530 "Payment method" input has value "Bank transfer" when User choosed this one at modal window ("Popular section")', async () => {
       
            await MainPage.elements.widgetPaymentMethodSelectBtn.click();
            await MainPage.elements.widgetPaymentMethodPopularSelectBtn.click();
                                  
            expect(await MainPage.elements.widgetPaymentMethodsInput.getAttribute('value')).toEqual('Bank Transfer');
    
        })

        it ('C62542 "Payment method" input has value an element which User clicked on "Bank Transfers (Choise)" section at modal window', async () => {
    
            await MainPage.elements.widgetPaymentMethodSelectBtn.click();
            await browser.sleep(500);
            await MainPage.elements.widgetPaymentMethodChoiseSection.click();
            await browser.sleep(500);                  
            expect(await MainPage.elements.widgetPaymentMethodsInput.getAttribute('value')).toEqual('Bank Transfer');
    
        })

        it ('C62531 "Payment method" input has value "Bank transfer" when User clicked on "View offers for bank transfer" button at modal window ("Bank transfer section")', async () => {
    
            await MainPage.elements.widgetPaymentMethodSelectBtn.click();
            await MainPage.elements.widgetPaymentMethodsBanktranAllBtn.click();
            await browser.sleep(500);
                                  
            expect(await MainPage.elements.widgetPaymentMethodsInput.getAttribute('value')).toEqual('Bank Transfers');
    
        })
    
    });  

    // "mainWidjet" modal window -> "Find offers" functionality
    
    describe('Offers on the offerList page displayed according to chosen parameters after User have clicked on "Find Offers" button', () => {
        beforeEach(async () => {
            await MainPage.go();
            await MainPage.checkWidgetLoaded();
        });
    
        // BTC Buy offer

        xit ('C62551 User is navigated on the page with adress according to chosen offer type and cryptocurrency (BTC Buy offer)', async () => {
    
            await MainPage.selectBuyOfferType();
            await browser.sleep(500);
            await MainPage.selectBtcCryptoCurrency();
            await browser.sleep(500);
            await MainPage.widgetSearch();
            await browser.sleep(500);
            expect(await browser.getCurrentUrl()).toContain(browser.params.baseUrl + "/buy-bitcoin/");
    
        })

        xit ('C62559 "Cryptocurrency" field contains chosen crypto', async () => {
    
            await MainPage.selectBuyOfferType();
            await browser.sleep(500);
            await MainPage.selectBtcCryptoCurrency();
            await browser.sleep(500);
            await MainPage.widgetSearch();
            await browser.sleep(500);
            expect(await MainPage.elements.BuySellSidebarCryptocurrencyDropDawn.getText()).toEqual('Bitcoin'); 
    
        })

        xit ('C66939 "Payment method" field contains chosen method', async () => {
    
            await MainPage.selectBuyOfferType();
            await browser.sleep(500);
            await MainPage.selectBtcCryptoCurrency();
            await browser.sleep(500);
            await MainPage.elements.widgetPaymentMethodsBtn.click();
            await MainPage.elements.widgetPaymentMethodSelectBtn.click();
            await MainPage.elements.widgetPaymentMethodsBanktranAllBtn.click();
            await browser.sleep(500);
            await MainPage.widgetSearch();
            await browser.sleep(500);

            expect(await MainPage.elements.BuySellSidebarPaymentMethod.getAttribute('value')).toEqual('Bank Transfers');
    
        })

        // BTC Sell offer

        it ('C62551 User is navigated on the page with adress according to chosen offer type and cryptocurrency (BTC Sell offer)', async () => {
    
            await MainPage.selectSellOfferType();
            await browser.sleep(500);
            await MainPage.selectBtcCryptoCurrency();
            await browser.sleep(500);
            await MainPage.widgetSearch();
            await browser.sleep(500);
            expect(await browser.getCurrentUrl()).toContain(browser.params.baseUrl + "/sell-bitcoin/");
    
        })


    
    });

    //ToDo

    xdescribe('Homepage Widget', () => {
        beforeEach(async () => {
            await MainPage.go();
            await MainPage.checkWidgetLoaded();
        });
    
    
        it ('fillInBuyOfferBTC', async () => {
    
            await MainPage.selectWidgetPaymentMethod();
            await MainPage.selectWidgetCurrency();
            await MainPage.fillInAnyAmount();
            await MainPage.widgetSearch();
            expect(await browser.getCurrentUrl()).toContain(browser.params.baseUrl + "/buy-bitcoin/");
    
        })
    
        it ('fillInBuyOfferTether', async () => {
    
            await MainPage.selectTetherCryptoCurrency();
            await MainPage.selectWidgetPaymentMethod();
            await MainPage.selectWidgetCurrency();
            await MainPage.fillInAnyAmount();
            await MainPage.widgetSearch();
            expect(await browser.getCurrentUrl()).toContain(browser.params.baseUrl + "/buy-tether/");
    
        })
    
        it ('fillInSellOfferBTC', async () => {
    
            await MainPage.selectSellOfferType();
            await MainPage.selectWidgetPaymentMethod();
            await MainPage.selectWidgetCurrency();
            await MainPage.fillInAnyAmount();
            await MainPage.widgetSearch();
            expect(await browser.getCurrentUrl()).toContain(browser.params.baseUrl + "/sell-bitcoin/");
    
        })
    
        it ('fillInSellOfferTether', async () => {
    
    
            await MainPage.selectSellOfferType();
            await MainPage.selectTetherCryptoCurrency();
            await MainPage.selectWidgetPaymentMethod();
            await MainPage.selectWidgetCurrency();
            await MainPage.fillInAnyAmount();
            await MainPage.widgetSearch();
            expect(await browser.getCurrentUrl()).toContain(browser.params.baseUrl + "/sell-tether/");
    
        })
    
    
    });



