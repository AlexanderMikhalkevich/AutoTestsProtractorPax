import * as fs from "fs";
import * as minimist from "minimist";

class ConfigHelper {
    private profilesDirName = 'profiles';
    private profilesDirPath = `../${this.profilesDirName}`;
    private defaultProfileName = 'develop';
    private unavailableProfiles = ['base'];

    private getSelectedProfileName() : string {
        return minimist(process.argv.slice(2)).profile || this.defaultProfileName;
    }

    private getAvailableProfilesList() : string[] {
        return fs.readdirSync(this.profilesDirName)
            .map(fileName => fileName.split('.')[0])
            .filter(fileName => !this.unavailableProfiles.includes(fileName));
    }

    private isSelectedProfileAvailable() : boolean {
        return this.getAvailableProfilesList().includes(this.getSelectedProfileName());
    }

    getConfig() : any {
        if (this.isSelectedProfileAvailable())
            return require(`${this.profilesDirPath}/${this.getSelectedProfileName()}`).default;

        throw new Error('wrong test profile name');
    }
}

export default new ConfigHelper();
