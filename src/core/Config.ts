import { workspace, ConfigurationScope } from 'vscode';

const EXT_NAMESPACE = 'i18n-simple';

export class Config {
    static readonly reloadConfigs = [
        'localesPaths'
    ];

    private static getConfig<T = any>(key: string, scope?: ConfigurationScope | undefined): T | undefined {
        let config = workspace
            .getConfiguration(EXT_NAMESPACE, scope)
            .get<T>(key);
        return config;
    }

    static get _localesPaths(): string | undefined {
        return this.getConfig('localesPaths');
    }
}