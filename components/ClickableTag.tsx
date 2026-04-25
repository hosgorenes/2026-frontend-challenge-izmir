"use client";

interface ClickableTagProps {
  name: string;
  onTagClick: (name: string) => void;
}

export default function ClickableTag({ name, onTagClick }: ClickableTagProps) {
  return (
    <button
      onClick={() => onTagClick(name)}
      className="font-medium text-blue-600 hover:text-blue-800 hover:underline"
    >
      {name}
    </button>
  );
}
