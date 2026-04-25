"use client";

interface ClickableTagProps {
  name: string;
  onTagClick: (name: string) => void;
}

export default function ClickableTag({ name, onTagClick }: ClickableTagProps) {
  return (
    <button
      onClick={() => onTagClick(name)}
      className="font-medium text-yellow-500 hover:text-yellow-400 hover:underline transition-colors"
    >
      {name}
    </button>
  );
}
