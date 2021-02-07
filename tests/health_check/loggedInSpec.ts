import {$, browser} from "protractor";
import qaHelper from '../../utils/qaHelper';
import loginPage from '../../pages/loginPO';
import walletPage from '../../pages/walletPO';
import settingsPage from '../../pages/settingsPO';
import createOfferPage from '../../pages/createOfferPO';
import dashboardPage from '../../pages/dashboardPO';
import configHelper from "../../utils/configHelper";

describe('Logged in health check - ', () => {
    const admin = configHelper.getConfig().custom.admin;

    beforeAll(async () => {
        await qaHelper.activateEmail(admin.id, true);
        await qaHelper.activate2faGoogle(admin.id);
        await loginPage.logInAccount2faGoogle(admin.email, admin.password);
    });

    it('should navigate to the wallet page id5483', async () => {
        await walletPage.goLoggedIn();
        await walletPage.checkPageLoadedLoggedIn();
    });

    it('should navigate to the classic dashboard id5484', async () => {
        await dashboardPage.goClassicDashboardLoggedIn();
        await dashboardPage.classicDBPageLoadedLoggedIn();
    });

    it('should navigate to the vendor dashboard id5485', async () => {
        await dashboardPage.goVendorDashboardLoggedIn();
        await dashboardPage.vendorDBPageLoadedLoggedIn();
    });

    it('should navigate to the account settings id5486', async () => {
        await settingsPage.go();
        await settingsPage.checkPageLoadedLoggedIn();
    });

    it('should navigate to the create offer page id5487', async () => {
        await createOfferPage.navigateToCreateOfferPage();
        await createOfferPage.checkPageLoadedLoggedIn();
    });

    describe('Admin pages test - ', () => {
        const adminUrl = browser.params.baseUrl + '/admin108';

        [
            // Single pages
            ['/dashboard', 'Dashboard', 5488],
            [`/user/${admin.id}`, 'User Profile', 5489],
            ['/transactions', 'Transactions', 5490],
            ['/offers', 'Offers', 5491],

            // Pendings
            ['/reports', 'Pending Reports', 5492],
            ['/tags', 'Pending Tags', 5493],
            ['/verifications', 'Pending Vendor Verifications', 5494],

            // Trades
            ['/disputes', 'Trades Disputes', 5495],
            ['/trades/active', 'Active Trades', 5496],
            ['/trades/completed', 'Completed Trades', 5497],

            // Users
            ['/users', 'All Users', 5499],
            ['/affiliates', 'Affiliates', 5500],
            ['/merchants', 'Merchants', 5501],
            ['/account-manager/delete-requests', 'User Account Delete Requests', 5502],
            ['/account-manager/emails-blacklist', 'Email Black List', 5503],

            // Settings
            ['/freeway', 'Kiosk Settings', 5504],
            ['/landings', 'Country Landings', 5505],
            ['/fiat-currencies/list', 'Fiat Currency', 5506],
            ['/website-settings', 'Website Settings', 5507],
            ['/phishing-sites', 'Phishing Sites', 5508],

            // Paxful Core
            ['/balances', 'Balances', 5509],
            ['/core-wallet', 'Site Core', 5510],
            ['/email-lists', 'Email Lists', 5512],
            ['/forks', 'Crypto Currency Forks', 5513],
            ['/payment-methods', 'Pending Approval Payment Methods', 5514],
            ['/changelog', 'Entities With Changelog', 5515],

            // Statistics
            ['/merchant/dashboard', 'Partners Dashboard', 5516],
            ['/footprints', 'Footprints', 5517],
            ['/monthly-reports', 'Monthly Reports', 5518],
            ['/mod-stats', 'Mod Stats', 5520],
            ['/user/segments', 'User Segments', 5521],

            // User Operations
            ['/taint-analysis', 'Taint Analysis', 5522],
            ['/activity-log', 'Activity Log', 5523],
            ['/third-services', '3rd Part Services', 5524],
        ].forEach(([url, title, testCaseId]) => {
            it(`should navigate to the ${title} page id${testCaseId}`, async () => {
                const fullUrl = adminUrl + url;
                await browser.get(fullUrl);
                await qaHelper.toBeVisible($('#header-trade-search-form'), 15000, `Can't open the ${fullUrl} page`);
                expect((await browser.getCurrentUrl())).toEqual(fullUrl);
            });
        });

        describe('Admin Dashboard test', () => {
            beforeEach(async () => {
                await browser.get(adminUrl + '/dashboard');
                await qaHelper.toBeVisible($('#header-trade-search-form'), 15000, `Can't open Admin Dashboard page`);
            });

            it('loads Latest User Related Actions id5525', async () => {
                await $('#user-log-list > a').click();
                await qaHelper.toBeVisible($('#latest_admin_actions_table > thead > tr:first-child'), 15000, 'Can\'t load user related actions');
            });

            it('loads Latest Completed Disputes id5526', async () => {
                await $('#disputes-completed-list a').click();
                await qaHelper.toBeVisible($('#latest_completed_disputes_table > thead > tr:first-child'), 15000, 'Can\'t load completed disputes');
            });

            it('searches users by name id5527', async () => {
                await $('#user').sendKeys(admin.name);
                await $('input[name=find_by][value=username]').click();
                await qaHelper.toBeVisible($('.author > h4.title'), 15000, 'Can\'t search users by name');
            });
        });
    });
});
