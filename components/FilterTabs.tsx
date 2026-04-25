"use client";

import { FormType } from "@/lib/types";
import { FORM_LABELS, FILTER_COLORS } from "@/lib/constants";

interface FilterTabsProps {
  activeFilters: Set<FormType>;
  onToggle: (formType: FormType) => void;
}

export default function FilterTabs({ activeFilters, onToggle }: FilterTabsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {(Object.keys(FORM_LABELS) as FormType[]).map((formType) => {
        const isActive = activeFilters.has(formType);
        const colors = FILTER_COLORS[formType];
        return (
          <button
            key={formType}
            onClick={() => onToggle(formType)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
              isActive ? colors.active : colors.inactive
            }`}
          >
            {FORM_LABELS[formType]}
          </button>
        );
      })}
    </div>
  );
}
