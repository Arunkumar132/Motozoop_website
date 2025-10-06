import { useState, useEffect } from "react";
import { Address } from "@/sanity.types";
import * as AddressService from "@/services/addressService";

export const useAddresses = () => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [loading, setLoading] = useState(false);

  const loadAddresses = async () => {
    setLoading(true);
    const data = await AddressService.fetchAddresses();
    setAddresses(data);
    const defaultAddr = data.find((a) => a.default) || data[0] || null;
    setSelectedAddress(defaultAddr || null);
    setLoading(false);
  };

  const addNewAddress = async (addressData: Omit<Address, "_id">) => {
    setLoading(true);
    const created = await AddressService.addAddress(addressData);
    if (created) {
      setAddresses((prev) => [created, ...prev]);
      setSelectedAddress(created);
    }
    setLoading(false);
  };

  const deleteExistingAddress = async (id: string) => {
    setLoading(true);
    const success = await AddressService.deleteAddress(id);
    if (success) {
      setAddresses((prev) => prev.filter((a) => a._id !== id));
      if (selectedAddress?._id === id) setSelectedAddress(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadAddresses();
  }, []);

  return {
    addresses,
    selectedAddress,
    setSelectedAddress,
    addNewAddress,
    deleteExistingAddress,
    loading,
    reloadAddresses: loadAddresses,
  };
};
