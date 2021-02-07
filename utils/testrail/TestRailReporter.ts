import testRail from "./testRail";

class TestRailReporter {
    private testRunId: number;

    constructor(testRunId : number) {
        this.testRunId = testRunId;
    }

    async specDone(result) {
        const descr = result.description;
        const regex = /id(\d+)$/;
        const m = descr.match(regex);
        if (m) {
            const caseId = descr.match(regex)[1];
            const status = result.status;
            const isPassed = status === 'passed';
            await testRail.addResultForCase(this.testRunId, caseId, {
                status_id: isPassed ? 1 : 4,
                comment: isPassed ? 'ok' : `${result.description}\n\n${result.failedExpectations[0].message}\n\n${result.failedExpectations[0].stack}`
            });
        }
    }
}

export default TestRailReporter;