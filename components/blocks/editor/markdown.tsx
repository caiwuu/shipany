import MDEditor from "@uiw/react-md-editor";
import React from "react";

export default function MarkdownEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="w-full md:w-[800px]">
      <MDEditor
        value={value}
        onChange={(val) => onChange(val || "")}
        height={600}
      />
      {/* <MDEditor.Markdown source={value} style={{ whiteSpace: "pre-wrap" }} /> */}
    </div>
  );
}
