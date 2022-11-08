import { window, Range, TextEditorDecorationType, TextEditor } from 'vscode';
import { TRANSLATE_FILE_TYPE, Config } from './Config';
import { SourceData } from './SourceData';
const { i18nRe, getValByPath, debounce } = require('./utils');

export class Translator {
    static decorationsMap = new Map<TextEditor, TextEditorDecorationType[]>();

    static translate() {
        window.visibleTextEditors.forEach(editor => {
            let { document } = editor;
            if (!TRANSLATE_FILE_TYPE.includes(document.languageId)) return;
            Translator.resetDecoration(editor, Translator.decorationsMap.get(editor));
            Translator.decorationsMap.delete(editor);
            let content = document.getText();
            Translator.setTip(editor, content);
        });
    }

    static setTip(editor: TextEditor, content: string) {
        while (i18nRe.test(content)) {
            let endStart = i18nRe.lastIndex - 4;
            let contentPart = content.substring(0, i18nRe.lastIndex);
            while (![`"`, `'`].includes(contentPart[endStart])) { endStart--; }
            let translateKey = content.slice(endStart + 1, i18nRe.lastIndex - 2);

            let text = getValByPath(translateKey, SourceData.translateDataMap);
            if (text) {
                let decoration = window.createTextEditorDecorationType({
                    before: {
                        color: Config.color,
                        margin: '5px',
                        contentText: text,
                        textDecoration: 'none'
                    }
                });
                if (!Translator.decorationsMap.has(editor)) Translator.decorationsMap.set(editor, []);
                Translator.decorationsMap.get(editor)!.push(decoration);

                let startPos = editor.document.positionAt(endStart + 1);
                let endPos = editor.document.positionAt(i18nRe.lastIndex - 1);
                const range = new Range(startPos, endPos);
                editor.setDecorations(decoration, [range]);
            }
        }
    }

    static resetDecoration(editor: TextEditor, decorationArr: TextEditorDecorationType[] = []) {
        decorationArr.forEach(item => editor.setDecorations(item, []));
    }
}

export let debounceTranslate = debounce(Translator.translate, 500);