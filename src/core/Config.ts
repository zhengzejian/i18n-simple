import { workspace, ConfigurationScope } from 'vscode';

const EXT_NAMESPACE = 'i18n-simple';

export const TRANSLATE_FILE_TYPE = ['javascript', 'typescript', 'html', 'vue', 'vue-html', 'plaintext'];

export class Config {
    static readonly reloadConfigs = [
        'localesPaths'
    ];
    static isDirty = true;

    private static getConfig<T = any>(key: string, scope?: ConfigurationScope | undefined): T | undefined {
        let config = workspace
            .getConfiguration(EXT_NAMESPACE, scope)
            .get<T>(key);
        return config;
    }

    static get localesPaths(): string | undefined {
        return this.getConfig('localesPaths');
    }

    static get color() {
        return this.getConfig('color');
    }
}