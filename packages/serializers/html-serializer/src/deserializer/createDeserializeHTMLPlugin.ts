import { isBlockAboveEmpty, setNodes } from '@udecode/plate-common';
import {
  getInlineTypes,
  getPlatePluginWithOverrides,
  PlatePlugin,
  SPEditor,
  WithOverride,
} from '@udecode/plate-core';
import { Editor, Transforms } from 'slate';
import { ReactEditor } from 'slate-react';
import { deserializeHTMLToDocumentFragment } from './utils/deserializeHTMLToDocumentFragment';
import { insertDeserializedFragment } from '@udecode/slate-plugins-serializer';

export interface WithDeserializeHTMLOptions<
  T extends SPEditor = SPEditor & ReactEditor
> {
  plugins?: PlatePlugin<T>[];
}

/**
 * Enables support for deserializing inserted content from HTML format to Slate format.
 */
export const withDeserializeHTML = <
  T extends ReactEditor & SPEditor = ReactEditor & SPEditor
>({ plugins = [] }: WithDeserializeHTMLOptions<T> = {}): WithOverride<T> => (
  editor
) => {
  const { insertData } = editor;

  editor.insertData = (data: DataTransfer) => {
    const html = data.getData('text/html');

    if (html) {
      const { body } = new DOMParser().parseFromString(html, 'text/html');

      const fragment = deserializeHTMLToDocumentFragment(editor, {
        plugins,
        element: body,
      });

      if (fragment.length) {
        return insertDeserializedFragment(editor, { fragment, plugins });
      }
    }

    insertData(data);
  };

  return editor;
};

/**
 * @see {@link withDeserializeHTML}
 */
export const createDeserializeHTMLPlugin = getPlatePluginWithOverrides(
  withDeserializeHTML
);
