import { useQuery } from "@tanstack/react-query";
import { Select } from "antd";
import { useEffect, useState } from "react";
import { orpc } from "~/lib/orpc";

interface HubSubjectSelectorProps {
  hubId: string;
  value?: string;
  onChange: (value: string) => void;
  id?: string;
  selectorType?: "SELECTOR_TYPE_CHANNEL" | "SELECTOR_TYPE_ROLE" | "SELECTOR_TYPE_USER" | "SELECTOR_TYPE_SERVER";
  disabled?: boolean;
  placeholder?: string;
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
  placeholder = "Search by name",
}: HubSubjectSelectorProps) {
  const [search, setSearch] = useState("");
  const [selectedOption, setSelectedOption] = useState<SelectedOption | undefined>();
  const normalizedSearch = search.trim();
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
    enabled: !disabled && normalizedSearch.length >= 2,
  });
  const resolvedQuery = useQuery({
    ...orpc.selectors.resolve.queryOptions({
      input: {
        type: selectorType,
        parentId: hubId,
        id: value || "",
      },
    }),
    enabled: !disabled && Boolean(value) && !selectedOption,
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
    setSearch("");
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

  return (
    <Select
      showSearch
      allowClear
      id={id}
      className="w-full"
      value={visibleValue}
      disabled={disabled}
      filterOption={false}
      options={options}
      placeholder={placeholder}
      loading={query.isFetching}
      notFoundContent={
        query.isError
          ? "Search is temporarily unavailable."
          : normalizedSearch.length < 2
            ? "Type at least 2 characters."
            : "No matching members."
      }
      onSearch={setSearch}
      onClear={() => {
        setSearch("");
        setSelectedOption(undefined);
        onChange("");
      }}
      onChange={(nextValue, option) => {
        const picked = Array.isArray(option) ? option[0] : option;
        const label = picked?.label;
        if (nextValue && label !== undefined) {
          setSelectedOption({ value: nextValue, label: String(label), title: String(label), disabled: false });
        }
        onChange(nextValue ?? "");
      }}
      onDropdownVisibleChange={(open) => {
        if (!open) setSearch("");
      }}
    />
  );
}
