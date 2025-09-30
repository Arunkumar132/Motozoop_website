import React from 'react';
"use client";
import { Title } from '../Title';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';

interface Props {
  categories: Category[];
  selectedCategory?: string | null;
  setSelectedCategory: React.Dispatch<React.SetStateAction<string | null>>;
}

const CategoryList = ({ categories, selectedCategory, setSelectedCategory }: Props) => {
  return (
    <div className="w-full bg-white p-5">
      <Title className="text-sm font-black">Product Categories</Title>

      <RadioGroup
        value={selectedCategory || ""}
        onValueChange={(val) => setSelectedCategory(val)}
        className="mt-2 space-y-2"
      >
        {categories?.map((category) => (
          <div
            key={category?._id}
            className="flex items-center space-x-2 hover:cursor-pointer"
          >
            <RadioGroupItem
              value={category?.slug?.current as string}
              id={category?.slug?.current}
              className="h-4 w-4 rounded-sm"
            />
            <Label
              htmlFor={category?.slug?.current}
              className={`${
                selectedCategory === category?.slug?.current
                  ? "font-semibold text-shop_dark_green"
                  : "font-normal"
              } text-xs`}
            >
              {category?.title}
            </Label>
          </div>
        ))}
      </RadioGroup>
      {selectedCategory && (
        <button
          onClick={() => setSelectedCategory(null)}
          className="text-sm font-medium mt-2 underline underline-offset-2"
        >
          Reset selection
        </button>
      )}
    </div>
  );
};

export default CategoryList;
