import React, { useEffect, useState } from "react";
import { StringInputProps, useClient, useFormValue, set, unset } from "sanity";
import { Stack, Text, Select } from "@sanity/ui";

interface SubCategory {
  title: string;
  slug?: {
    current?: string;
  };
}

export function SubCategorySelect(props: StringInputProps) {
  const { onChange, value } = props;
  const client = useClient({ apiVersion: "2025-01-01" });
  const categoryRef = useFormValue(["category"]) as { _ref?: string } | undefined;

  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!categoryRef?._ref) {
      setSubCategories([]);
      return;
    }

    setLoading(true);
    setError(null);

    client
      .fetch(
        `*[_type == "category" && _id == $id][0]{ subCategories[]{ title, slug } }`,
        { id: categoryRef._ref }
      )
      .then((category) => {
        if (category?.subCategories && Array.isArray(category.subCategories)) {
          setSubCategories(category.subCategories);
        } else {
          setSubCategories([]);
        }
      })
      .catch((err) => {
        console.error("Error fetching subcategories:", err);
        setError("Failed to load subcategories");
        setSubCategories([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [categoryRef?._ref, client]);

  if (!categoryRef?._ref) {
    return (
      <Stack space={2}>
        <Text size={1} muted>
          Please select a main category first to see available subcategories.
        </Text>
      </Stack>
    );
  }

  if (loading) {
    return (
      <Stack space={2}>
        <Text size={1} muted>
          Loading subcategories...
        </Text>
      </Stack>
    );
  }

  if (error) {
    return (
      <Stack space={2}>
        <Text size={1} style={{ color: "#f03e2f" }}>
          {error}
        </Text>
      </Stack>
    );
  }

  if (subCategories.length === 0) {
    return (
      <Stack space={2}>
        <Text size={1} muted>
          No subcategories available. Please add subcategories to the selected category first.
        </Text>
      </Stack>
    );
  }

  return (
    <Stack space={2}>
      <Select
        fontSize={2}
        padding={3}
        radius={2}
        value={value || ""}
        onChange={(event) => {
          const newValue = event.currentTarget.value;
          if (newValue) {
            onChange(set(newValue)); // ✅ Correct Sanity patch event
          } else {
            onChange(unset()); // ✅ Removes value if user selects "empty"
          }
        }}
      >
        <option value="">-- Select a subcategory --</option>
        {subCategories.map((subCat, index) => (
          <option key={subCat.slug?.current || index} value={subCat.title}>
            {subCat.title}
          </option>
        ))}
      </Select>

      {value && (
        <Text size={1} muted>
          Selected: {value}
        </Text>
      )}
    </Stack>
  );
}
