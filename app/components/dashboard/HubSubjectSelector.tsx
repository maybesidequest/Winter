import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { orpc } from "~/lib/orpc";
import { DashboardSelect } from "./DashboardSelect";

export interface HubSubjectSelectorProps {
  hubId: string;
  value?: string;
  onChange?: (value: string) => void;
  id?: string;
  selectorType?: "SELECTOR_TYPE_CHANNEL" | "SELECTOR_TYPE_ROLE" | "SELECTOR_TYPE_USER" | "SELECTOR_TYPE_SERVER";
  disabled?: boolean;
  placeholder?: string;
  "aria-label"?: string;
}

interface SelectedOption {
  value: string;
  label: string;
  title: string;
  disabled: boolean;
}

/** Searches canonical Hub subjects; IDs are submitted only after a named choice. */
export function HubSubjectSelector({
  hubId,
  value,
  onChange,
  id,
  selectorType = "SELECTOR_TYPE_USER",
  disabled = false,
  placeholder,
  "aria-label": ariaLabel,
}: HubSubjectSelectorProps) {
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedOption, setSelectedOption] = useState<SelectedOption | undefined>();

  // Debounced so fast typing fires one search RPC instead of one per keystroke.
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchInput.trim()), 250);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const normalizedSearch = debouncedSearch;
  const query = useQuery({
    ...orpc.selectors.search.queryOptions({
      input: {
        type: selectorType,
        query: normalizedSearch,
        parentId: hubId,
        limit: 25,
        cursor: "",
      },
    }),
    enabled: !disabled && Boolean(hubId) && normalizedSearch.length >= 2,
  });

  const resolvedQuery = useQuery({
    ...orpc.selectors.resolve.queryOptions({
      input: {
        type: selectorType,
        parentId: hubId,
        id: value || "",
      },
    }),
    enabled: !disabled && Boolean(hubId) && Boolean(value) && !selectedOption,
  });

  useEffect(() => {
    if (resolvedQuery.data && value) {
      setSelectedOption({
        value,
        label: resolvedQuery.data.label,
        title: resolvedQuery.data.description || resolvedQuery.data.label,
        disabled: !resolvedQuery.data.selectable,
      });
    }
  }, [resolvedQuery.data, value]);

  useEffect(() => {
    setSelectedOption(undefined);
    setSearchInput("");
    setDebouncedSearch("");
  }, [hubId, selectorType]);

  const options = (query.data?.options ?? []).map((option) => ({
    value: option.id,
    label: option.label,
    title: option.description || option.label,
    disabled: !option.selectable,
  }));
  if (selectedOption && !options.some((option) => option.value === selectedOption.value)) {
    options.unshift(selectedOption);
  }
  const visibleValue = selectedOption?.value === value ? value : undefined;

  const defaultPlaceholder = (() => {
    switch (selectorType) {
      case "SELECTOR_TYPE_CHANNEL":
        return "Search channels by name…";
      case "SELECTOR_TYPE_ROLE":
        return "Search roles to mention…";
      case "SELECTOR_TYPE_SERVER":
        return "Search connected servers…";
      case "SELECTOR_TYPE_USER":
      default:
        return "Search members by username or ID…";
    }
  })();
  const effectivePlaceholder = (!placeholder || placeholder === "Search by name") ? defaultPlaceholder : placeholder;

  const notFoundContent = (() => {
    if (!hubId) {
      return selectorType === "SELECTOR_TYPE_CHANNEL" || selectorType === "SELECTOR_TYPE_ROLE"
        ? "Select a source server first."
        : "Select a Hub first.";
    }
    if (query.isError) {
      return "Search failed. Check bot permissions or try again.";
    }
    if (query.isFetching) {
      return "Searching…";
    }
    if (normalizedSearch.length < 2) {
      switch (selectorType) {
        case "SELECTOR_TYPE_CHANNEL":
          return "Type 2 or more characters to search channels.";
        case "SELECTOR_TYPE_ROLE":
          return "Type 2 or more characters to search roles.";
        case "SELECTOR_TYPE_SERVER":
          return "Type 2 or more characters to search servers.";
        case "SELECTOR_TYPE_USER":
        default:
          return "Type 2 or more characters to search members.";
      }
    }
    switch (selectorType) {
      case "SELECTOR_TYPE_CHANNEL":
        return `No channels found matching "${normalizedSearch}".`;
      case "SELECTOR_TYPE_ROLE":
        return `No roles found matching "${normalizedSearch}".`;
      case "SELECTOR_TYPE_SERVER":
        return `No servers found matching "${normalizedSearch}".`;
      case "SELECTOR_TYPE_USER":
      default:
        return `No members found matching "${normalizedSearch}".`;
    }
  })();

  return (
    <DashboardSelect
      showSearch
      allowClear
      id={id}
      aria-label={ariaLabel || effectivePlaceholder}
      aria-busy={query.isFetching}
      status={query.isError ? "error" : undefined}
      className="w-full"
      value={visibleValue}
      disabled={disabled}
      filterOption={false}
      options={options}
      placeholder={effectivePlaceholder}
      loading={query.isFetching}
      notFoundContent={notFoundContent}
      onSearch={setSearchInput}
      onClear={() => {
        setSearchInput("");
        setDebouncedSearch("");
        setSelectedOption(undefined);
        onChange?.("");
      }}
      onChange={(nextValue, option) => {
        const picked = Array.isArray(option) ? option[0] : option;
        const label = picked?.label;
        if (nextValue && label !== undefined) {
          setSelectedOption({ value: nextValue, label: String(label), title: String(label), disabled: false });
        }
        onChange?.((nextValue as string) ?? "");
      }}
      onDropdownVisibleChange={(open) => {
        if (!open) {
          setSearchInput("");
          setDebouncedSearch("");
        }
      }}
    />
  );
}
