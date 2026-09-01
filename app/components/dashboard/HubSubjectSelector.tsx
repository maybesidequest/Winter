import { useQuery } from "@tanstack/react-query";
import { Select } from "antd";
import { useState } from "react";
import { orpc } from "~/lib/orpc";

interface HubSubjectSelectorProps {
  hubId: string;
  value: string;
  onChange: (value: string) => void;
  id?: string;
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
  disabled = false,
  placeholder = "Search by name",
}: HubSubjectSelectorProps) {
  const [search, setSearch] = useState("");
  const [selectedOption, setSelectedOption] = useState<SelectedOption | undefined>();
  const normalizedSearch = search.trim();
  const query = useQuery({
    ...orpc.selectors.search.queryOptions({
      input: {
        type: "SELECTOR_TYPE_USER",
        query: normalizedSearch,
        parentId: hubId,
        limit: 25,
        cursor: "",
      },
    }),
    enabled: !disabled && normalizedSearch.length >= 2,
  });

  const options = (query.data?.options ?? []).map((option) => ({
    value: option.id,
    label: option.label,
    title: option.description || option.label,
    disabled: !option.selectable,
  }));
  if (selectedOption && !options.some((option) => option.value === selectedOption.value)) {
    options.unshift(selectedOption);
  }

  return (
    <Select
      showSearch
      allowClear
      id={id}
      className="w-full"
      value={value || undefined}
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
