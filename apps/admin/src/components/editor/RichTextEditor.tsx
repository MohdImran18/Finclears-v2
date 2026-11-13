"use client";

import { useEffect, useRef, useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import Image from "@tiptap/extension-image";
import { uploadServiceDescriptionImage } from "@/lib/api/services/serviceApi";

interface Props {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const buttonStyle: React.CSSProperties = {
  border: "1px solid #cbd5e1",
  background: "#fff",
  color: "#1e293b",
  borderRadius: 6,
  padding: "7px 10px",
  fontSize: 13,
  fontWeight: 600,
  cursor: "pointer",
};

export default function RichTextEditor({
  value,
  onChange,
  disabled = false,
}: Props) {
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Image.configure({
        inline: false,
        allowBase64: false,
        HTMLAttributes: {
          class: "finclears-description-image",
        },
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          rel: "noopener noreferrer",
          target: "_blank",
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ],
    content: value || "",
    editable: !disabled,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "finclears-rich-editor",
        "aria-label": "Full service description",
      },
    },
  });

  useEffect(() => {
    if (!editor) return;

    editor.setEditable(!disabled);
  }, [editor, disabled]);

  useEffect(() => {
    if (!editor) return;

    const normalizedValue =
      value && value.replace(/<p>(?:<br\s*\/?>|\s|&nbsp;)*<\/p>/gi, "").trim()
        ? value
        : "";

    const currentContent = editor.getHTML();

    if (normalizedValue !== currentContent) {
      editor.commands.setContent(normalizedValue, {
        emitUpdate: false,
      });
    }
  }, [editor, value]);

  if (!editor) {
    return (
      <div style={{ padding: 16, border: "1px solid #cbd5e1", borderRadius: 8 }}>
        Loading editor...
      </div>
    );
  }

  const run = (action: () => void) => {
    if (disabled) return;
    action();
  };

  const addLink = () => {
    const existing = editor.getAttributes("link").href || "";
    const url = window.prompt("Enter link URL (https://...)", existing);

    if (url === null) return;

    if (!url.trim()) {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    if (!/^https?:\/\/|^mailto:/i.test(url.trim())) {
      window.alert("Please enter a valid https://, http:// or mailto: URL.");
      return;
    }

    editor
      .chain()
      .focus()
      .extendMarkRange("link")
      .setLink({ href: url.trim() })
      .run();
  };

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const input = event.currentTarget;
    const file = input.files?.[0];
    if (!file || !editor) return;

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
    ];

    if (!allowedTypes.includes(file.type)) {
      window.alert("Please choose a JPG, PNG, WEBP or GIF image.");
      input.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      window.alert("Image size must be 5 MB or less.");
      input.value = "";
      return;
    }

    setUploadingImage(true);
    try {
      const imageUrl = await uploadServiceDescriptionImage(file);
      editor.chain().focus().setImage({
        src: imageUrl,
        alt: file.name.replace(/\.[^.]+$/, ""),
      }).run();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Image upload failed.";
      window.alert(message);
    } finally {
      setUploadingImage(false);
      input.value = "";
    }
  };

  const buttons = [
    {
      label: "B",
      title: "Bold",
      active: editor.isActive("bold"),
      action: () => editor.chain().focus().toggleBold().run(),
    },
    {
      label: "I",
      title: "Italic",
      active: editor.isActive("italic"),
      action: () => editor.chain().focus().toggleItalic().run(),
    },
    {
      label: "U",
      title: "Underline",
      active: editor.isActive("underline"),
      action: () => editor.chain().focus().toggleUnderline().run(),
    },
    {
      label: "H2",
      title: "Heading 2",
      active: editor.isActive("heading", { level: 2 }),
      action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
    },
    {
      label: "H3",
      title: "Heading 3",
      active: editor.isActive("heading", { level: 3 }),
      action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
    },
    {
      label: "• List",
      title: "Bullet list",
      active: editor.isActive("bulletList"),
      action: () => editor.chain().focus().toggleBulletList().run(),
    },
    {
      label: "1. List",
      title: "Numbered list",
      active: editor.isActive("orderedList"),
      action: () => editor.chain().focus().toggleOrderedList().run(),
    },
    {
      label: "↔ Left",
      title: "Align left",
      active: editor.isActive({ textAlign: "left" }),
      action: () => editor.chain().focus().setTextAlign("left").run(),
    },
    {
      label: "↔ Centre",
      title: "Align center",
      active: editor.isActive({ textAlign: "center" }),
      action: () => editor.chain().focus().setTextAlign("center").run(),
    },
    {
      label: "↔ Right",
      title: "Align right",
      active: editor.isActive({ textAlign: "right" }),
      action: () => editor.chain().focus().setTextAlign("right").run(),
    },
  ];

  return (
    <div
      style={{
        border: "1px solid #cbd5e1",
        borderRadius: 10,
        overflow: "hidden",
        background: "#fff",
      }}
    >
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 6,
          padding: 10,
          background: "#f8fafc",
          borderBottom: "1px solid #e2e8f0",
        }}
      >
        {buttons.map((button) => (
          <button
            key={button.title}
            type="button"
            title={button.title}
            disabled={disabled}
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => run(button.action)}
            style={{
              ...buttonStyle,
              background: button.active ? "#dbeafe" : "#fff",
              borderColor: button.active ? "#60a5fa" : "#cbd5e1",
              opacity: disabled ? 0.6 : 1,
            }}
          >
            {button.label}
          </button>
        ))}

        <button
          type="button"
          disabled={disabled}
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => run(addLink)}
          style={buttonStyle}
        >
          Link
        </button>

        <button
          type="button"
          disabled={disabled || uploadingImage}
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => fileInputRef.current?.click()}
          style={{
            ...buttonStyle,
            opacity: disabled || uploadingImage ? 0.6 : 1,
          }}
        >
          {uploadingImage ? "Uploading image..." : "Image Upload / Insert"}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          hidden
          onChange={handleImageUpload}
        />

        <button
          type="button"
          disabled={disabled}
          onMouseDown={(event) => event.preventDefault()}
          onClick={() =>
            run(() => editor.chain().focus().unsetAllMarks().clearNodes().run())
          }
          style={buttonStyle}
        >
          Clear formatting
        </button>
      </div>

      <EditorContent editor={editor} />

      <style jsx global>{`
        .finclears-rich-editor {
          min-height: 280px;
          padding: 18px;
          outline: none;
          color: #334155;
          font-size: 15px;
          line-height: 1.8;
          overflow-wrap: anywhere;
        }

        .finclears-rich-editor p {
          margin: 0 0 12px;
        }

        .finclears-rich-editor .finclears-description-image {
          display: block;
          max-width: 100%;
          height: auto;
          margin: 18px auto;
          border-radius: 8px;
        }

        .finclears-rich-editor h2 {
          margin: 22px 0 10px;
          font-size: 1.5rem;
          line-height: 1.35;
          font-weight: 700;
          color: #0f172a;
        }

        .finclears-rich-editor h3 {
          margin: 18px 0 8px;
          font-size: 1.2rem;
          line-height: 1.4;
          font-weight: 700;
          color: #0f172a;
        }

        .finclears-rich-editor ul {
          list-style: disc;
          padding-left: 24px;
          margin: 8px 0 16px;
        }

        .finclears-rich-editor ol {
          list-style: decimal;
          padding-left: 24px;
          margin: 8px 0 16px;
        }

        .finclears-rich-editor a {
          color: #2563eb;
          text-decoration: underline;
        }

        .finclears-rich-editor:focus {
          outline: none;
        }
      `}</style>
    </div>
  );
}
