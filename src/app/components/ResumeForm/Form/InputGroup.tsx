import { useState, useEffect } from "react";
import ContentEditable from "react-contenteditable";
import { useAutosizeTextareaHeight } from "lib/hooks/useAutosizeTextareaHeight";

interface InputProps<K extends string, V extends string | string[]> {
  label: string;
  labelClassName?: string;
  name: K;
  value?: V;
  placeholder: string;
  onChange: (name: K, value: V) => void;
}

export const InputGroupWrapper = ({
  label,
  className,
  children,
}: {
  label: string;
  className?: string;
  children?: React.ReactNode;
}) => (
  <label className={`text-base font-medium text-[var(--text-secondary)] ${className}`}>
    {label}
    {children}
  </label>
);

export const INPUT_CLASS_NAME =
  "mt-1 px-3 py-2 block w-full resume-input text-base font-normal outline-none";

export const Input = <K extends string>({
  name,
  value = "",
  placeholder,
  onChange,
  label,
  labelClassName,
}: InputProps<K, string>) => {
  return (
    <InputGroupWrapper label={label} className={labelClassName}>
      <input
        type="text"
        name={name}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(name, e.target.value)}
        className={INPUT_CLASS_NAME}
      />
    </InputGroupWrapper>
  );
};

export const Textarea = <T extends string>({
  label,
  labelClassName: wrapperClassName,
  name,
  value = "",
  placeholder,
  onChange,
}: InputProps<T, string>) => {
  const textareaRef = useAutosizeTextareaHeight({ value });

  return (
    <InputGroupWrapper label={label} className={wrapperClassName}>
      <textarea
        ref={textareaRef}
        name={name}
        className={`${INPUT_CLASS_NAME} resize-none overflow-hidden`}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(name, e.target.value)}
      />
    </InputGroupWrapper>
  );
};

import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

export const BulletListTextarea = <T extends string>({
  label,
  labelClassName: wrapperClassName,
  name,
  value: bulletListStrings = [],
  placeholder,
  onChange,
}: InputProps<T, string[]> & { showBulletPoints?: boolean }) => {
  // Convert old string array format to HTML string if necessary
  const htmlValue = bulletListStrings.length > 0 
    ? (bulletListStrings.length === 1 && bulletListStrings[0].startsWith("<") 
        ? bulletListStrings[0] 
        : `<ul>${bulletListStrings.map(s => `<li>${s}</li>`).join("")}</ul>`)
    : "";

  const handleChange = (content: string) => {
    // If it's effectively empty, save empty array
    if (content === "<p><br></p>" || content === "") {
      onChange(name, []);
    } else {
      onChange(name, [content]);
    }
  };

  const modules = {
    toolbar: [
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ align: [] }],
      ["link", "clean"],
    ],
  };

  return (
    <InputGroupWrapper label={label} className={wrapperClassName}>
      <div className="mt-1 bg-white">
        <ReactQuill
          theme="snow"
          value={htmlValue}
          onChange={handleChange}
          placeholder={placeholder}
          modules={modules}
          className="resume-input-quill"
        />
      </div>
      <style jsx global>{`
        .resume-input-quill .ql-container {
          border-bottom-left-radius: 0.375rem;
          border-bottom-right-radius: 0.375rem;
          font-family: inherit;
          font-size: 1rem;
        }
        .resume-input-quill .ql-toolbar {
          border-top-left-radius: 0.375rem;
          border-top-right-radius: 0.375rem;
          background: #f9fafb;
        }
        .resume-input-quill .ql-editor {
          min-height: 100px;
        }
      `}</style>
    </InputGroupWrapper>
  );
};