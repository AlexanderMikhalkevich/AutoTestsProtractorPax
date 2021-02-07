class Converter {
    btcToSatoshi(btc : number) {
        const result = btc * 100000000;
        if (result !== Math.round(result))
            throw new Error('BTC value should have not more than 8 digits after point');

        return result;
    }

    satoshiToBtc(satoshi: number) {
        if (Math.round(satoshi) !== satoshi)
            throw new Error('Satoshi value should be integer');

        return satoshi / 100000000;
    }
}

export default new Converter();