import React from 'react';
import { Title } from '../Title';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';

const priceArray = [
  { title: "Under 200", value: "0-200" },
  { title: "200-500", value: "200-500" },
  { title: "500-1000", value: "500-1000" },
  { title: "1000-5000", value: "1000-5000" },
  { title: "Over 5000", value: "5000-100000" },
];

interface Props {
  selectedPrice?: string | null;
  setSelectedPrice: React.Dispatch<React.SetStateAction<string | null>>;
}

const PriceList = ({ selectedPrice, setSelectedPrice }: Props) => {
  return (
    <div className="w-full bg-white p-5">
      <Title className="text-sm font-black">Price</Title>

      <RadioGroup
        value={selectedPrice || ""}
        onValueChange={(val) => setSelectedPrice(val)}
        className="mt-2 space-y-2"
      >
        {priceArray.map((price) => (
          <label
            key={price.value}
            htmlFor={price.value}
            className="flex items-center space-x-2 cursor-pointer"
          >
            <RadioGroupItem
              value={price.value}
              id={price.value}
              className="h-4 w-4 rounded-sm border border-gray-400 checked:bg-shop_dark_green checked:border-shop_dark_green"
            />
            <span className="text-xs">{price.title}</span>
          </label>
        ))}
      </RadioGroup>

      {selectedPrice && (
        <button
          onClick={() => setSelectedPrice(null)}
          className="text-sm font-medium mt-2 underline underline-offset-2"
        >
          Reset selection
        </button>
      )}
    </div>
  );
};

export default PriceList;
