import { ReactEditor, RenderElementProps, useSlate } from "slate-react";
import React, { CSSProperties } from "react";
import { useToggleOnClick } from "../hooks/useToggleOnClick";
import { useCopyOnClick } from "../hooks/useCopyOnClick";
import {
  useSelectedProperties,
  useSetSelectedProperties,
} from "../contexts/selectedProperties";
import useDeepCompareEffect from "use-deep-compare-effect";

export const RenderElement = ({
  attributes,
  children,
  element,
}: RenderElementProps) => {
  let { type, devtools_depth: depth, devtools_id: id } = element;
  if (typeof type !== "string") {
    type = "normal";
  }

  const editor = useSlate();
  const path = ReactEditor.findPath(editor, element);

  const selectedProperties = useSelectedProperties();
  const setSelectedProperties = useSetSelectedProperties();
  const [shouldShowChildren, onClickToggle] = useToggleOnClick<HTMLDivElement>(
    false
  );

  const depthStyle: CSSProperties = {
    marginLeft: `${(depth as number) || 1 * 1.5}rem`,
  };

  const onClickCopy = useCopyOnClick(
    JSON.stringify(ReactEditor.findPath(editor, element))
  );

  const onClickUpdateSelectedProperties = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    e.preventDefault();
    setSelectedProperties({ node: element, path: path });
  };

  useDeepCompareEffect(() => {
    const {
      node: { devtools_id: selectedId },
    } = selectedProperties;

    if (id === selectedId) {
      setSelectedProperties({ node: element, path: path });
    }
  }, [selectedProperties, id, element, path]);

  return (
    <div {...attributes} style={{ ...depthStyle }} contentEditable={false}>
      <div className="flex gap-x-3">
        <div onClick={onClickToggle} className="cursor-pointer">
          +
        </div>
        <div onClick={onClickUpdateSelectedProperties}>{`<${type} />`}</div>
        <div onClick={onClickCopy} className="text-gray-500">
          C
        </div>
      </div>
      {shouldShowChildren ? children : null}
    </div>
  );
};