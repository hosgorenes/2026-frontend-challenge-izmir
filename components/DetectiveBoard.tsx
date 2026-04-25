"use client";

import { useState, useMemo } from "react";
import { FormType, Evidence } from "@/lib/types";
import { ALL_FORM_TYPES } from "@/lib/constants";
import { sortByTimestamp } from "@/lib/utils";
import SearchBar from "./SearchBar";
import FilterTabs from "./FilterTabs";
import EvidenceCard from "./EvidenceCard";
import Timeline from "./Timeline";
import EvidenceMap from "./EvidenceMap";

type ViewMode = "cards" | "timeline" | "map";

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
  const [viewMode, setViewMode] = useState<ViewMode>("cards");

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
    const filtered = initialEvidence.filter((item) => {
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

    if (viewMode === "timeline") {
      return sortByTimestamp(filtered, true);
    }

    return filtered;
  }, [initialEvidence, activeFilters, searchQuery, viewMode]);

  const renderContent = () => {
    if (viewMode === "map") {
      return <EvidenceMap items={filteredEvidence} onTagClick={handleTagClick} />;
    }

    if (viewMode === "timeline") {
      return <Timeline items={filteredEvidence} onTagClick={handleTagClick} />;
    }

    if (filteredEvidence.length === 0) {
      return (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            İpucu bulunamadı
          </h3>
          <p className="text-gray-500">
            Farklı bir arama terimi dene veya filtreleri değiştir.
          </p>
        </div>
      );
    }

    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredEvidence.map((item) => (
          <EvidenceCard key={item.id} item={item} onTagClick={handleTagClick} />
        ))}
      </div>
    );
  };

  return (
    <div>
      <SearchBar value={searchQuery} onChange={setSearchQuery} />

      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <FilterTabs activeFilters={activeFilters} onToggle={toggleFilter} />

        <div className="flex gap-2">
          <button
            onClick={() => setViewMode("cards")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              viewMode === "cards"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Kartlar
          </button>
          <button
            onClick={() => setViewMode("timeline")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              viewMode === "timeline"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Timeline
          </button>
          <button
            onClick={() => setViewMode("map")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              viewMode === "map"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Harita
          </button>
        </div>
      </div>

      <div className="text-sm text-gray-600 mb-4">
        {filteredEvidence.length} kanıt bulundu
      </div>

      {renderContent()}
    </div>
  );
}
