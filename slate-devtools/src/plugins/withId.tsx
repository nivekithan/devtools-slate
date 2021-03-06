import { Editor, Node, Transforms } from "slate";
import { ReactEditor } from "slate-react";
import { nanoid } from "nanoid";

/**
 * This is plugin will make sure that each node will have a devtools_id field and its
 * value will be an unique id
 *
 * This is used to identify the node
 */

export const withId = (editor: ReactEditor): ReactEditor => {
  const { normalizeNode } = editor;

  editor.normalizeNode = (entry) => {
    const [node, path] = entry;

    if (!Editor.isEditor(node) && !hasValidId(node)) {
      Transforms.setNodes(editor, { devtools_id: nanoid() }, { at: path });
    }

    normalizeNode(entry);
  };

  return editor;
};

const hasValidId = (node: Node): boolean => {
  const { devtools_id } = node;

  // If there is no devtools_id then return false
  if (!devtools_id) return false;

  // If the devtools_id is not of type string then return false

  if (typeof devtools_id !== "string") return false;

  return true;
};
