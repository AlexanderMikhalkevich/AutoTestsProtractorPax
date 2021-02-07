import testRail from "./testRail";

const wipStr = 'WIP: ';

class TestRailHelper {
    async createTestRun(name : string = 'Acceptance tests - Staging', description : string = '(╯°□°）╯︵ ┻━┻') : Promise<number> {
        return (await testRail.addRun(1, {
            suite_id: 8,
            include_all: true,
            name: wipStr + name,
            description,
            milestone_id: null,
            assignedto_id: null,
            case_ids: [],
        })).body.id;
    }

    async removeWIP(testRunId : number) : Promise<void> {
        const runData = (await testRail.getRun(testRunId)).body;
        const runName = runData.name;

        if (runName.startsWith(wipStr)) {
            await testRail.updateRun(testRunId, {
                ...runData,
                case_ids: [],
                name: runName.slice(wipStr.length),
            });
        }
    }
}

export default new TestRailHelper();