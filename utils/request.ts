import * as request from 'request-promise-native';
import configHelper from "./configHelper";

export async function get(url : string, qs? : object) : Promise<any> {
    let res, error;
    const conf = configHelper.getConfig();
    const options : any = {
        baseUrl: conf.params.baseUrl,
        url,
        json: true,
        strictSSL: false,
        qs
    };

    if (conf.custom.enableBaseAuth) {
        options.auth = conf.custom.baseAuth;
    }

    try {
        res = await request.get(options);
    } catch (e) {
        error = e;
    }

    if (error || res.status !== 'success' || res.error) {
        const errorText = `Request to ${url} with following query string params:\n` +
            JSON.stringify(qs, null, '\t') +
            `\nhas been failed with following ${error ? 'error message' : 'response'}:\n` +
            JSON.stringify(error || res, null, '\t');
        throw new Error(errorText);
    }

    return res;
}