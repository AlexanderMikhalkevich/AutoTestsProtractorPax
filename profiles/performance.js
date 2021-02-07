module.exports = {
    base: {
        env: {
            'K6_DURATION': '1m',
            'K6_BASE_URL': 'https://127.0.0.1',
            'K6_AVG_THRESHOLD': '600', //set to x2 since pipes are slowing down
            'K6_95TH_THRESHOLD': '1400', //set to x2 since pipes are slowing down
        },
        file: 'tests/performance_test/base.spec.js'
    }
}
