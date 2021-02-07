export enum EnvKeys {
    testRunId = 'protractorTestRailRunId',
}

class EnvDataKeeper {
    get(key : EnvKeys) : string {
        const value = process.env[key];

        if (!value)
            throw new Error(`Can't find the ${key} env variable`);

        return value;
    }

    set(key : EnvKeys, value : string) : void {
        process.env[key] = value;
    }
}

export default new EnvDataKeeper();