"use client";

import { useState, useMemo } from "react";
import { FormType, Evidence } from "@/lib/types";
import { ALL_FORM_TYPES } from "@/lib/constants";
import SearchBar from "./SearchBar";
import FilterTabs from "./FilterTabs";
import EvidenceCard from "./EvidenceCard";

function getSearchableText(item: Evidence): string {
  const values = Object.values(item).filter(
    (v) => typeof v === "string"
  ) as string[];
  return values.join(" ").toLowerCase();
}

interface DetectiveBoardProps {
  initialEvidence: Evidence[];
}

export default function DetectiveBoard({
  initialEvidence,
}: DetectiveBoardProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<Set<FormType>>(
    new Set(ALL_FORM_TYPES)
  );

  const toggleFilter = (formType: FormType) => {
    setActiveFilters((prev) => {
      const next = new Set(prev);
      if (next.has(formType)) {
        next.delete(formType);
      } else {
        next.add(formType);
      }
      return next;
    });
  };

  const handleTagClick = (name: string) => {
    setSearchQuery(name);
  };

  const filteredEvidence = useMemo(() => {
    return initialEvidence.filter((item) => {
      if (!activeFilters.has(item.formType)) {
        return false;
      }

      if (searchQuery.trim()) {
        const searchText = getSearchableText(item);
        const query = searchQuery.toLowerCase();
        if (!searchText.includes(query)) {
          return false;
        }
      }

      return true;
    });
  }, [initialEvidence, activeFilters, searchQuery]);

  return (
    <div>
      <SearchBar value={searchQuery} onChange={setSearchQuery} />
      <FilterTabs activeFilters={activeFilters} onToggle={toggleFilter} />

      <div className="text-sm text-gray-600 mb-4">
        {filteredEvidence.length} kanıt bulundu
      </div>

      {filteredEvidence.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            İpucu bulunamadı
          </h3>
          <p className="text-gray-500">
            Farklı bir arama terimi dene veya filtreleri değiştir.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredEvidence.map((item) => (
            <EvidenceCard key={item.id} item={item} onTagClick={handleTagClick} />
          ))}
        </div>
      )}
    </div>
  );
}
