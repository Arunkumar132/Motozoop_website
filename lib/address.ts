import { client } from "@/sanity/lib/client";
import { Address } from "@/sanity.types";
import toast from "react-hot-toast";

// Define a proper interface for address input data
export interface AddressInput {
  name: string;
  email?: string;
  address: string;
  city: string;
  state: string;
  zip: string;
}

// Fetch all addresses
export const fetchAddresses = async (): Promise<Address[]> => {
  try {
    return await client.fetch<Address[]>(`*[_type== "address"] | order(_createdAt desc){
      _id, name, address, mobile, city, state, zipCode, default
    }`);
  } catch (error) {
    console.error("Error fetching addresses:", error);
    toast.error("Failed to fetch addresses.");
    return [];
  }
};

// Add new address
export const addAddressToSanity = async (
  addressData: AddressInput
): Promise<Address | null> => {
  try {
    const created = await client.create<Address>({
      _type: "address",
      name: addressData.name,
      email: addressData.email || "",
      address: addressData.address,
      city: addressData.city,
      state: addressData.state.toUpperCase().slice(0, 2),
      zipCode: addressData.zip,
      default: false,
      createdAt: new Date().toISOString(),
    });

    toast.success("Address added successfully!");
    return created;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error adding address:", error);
      toast.error("Failed to add address: " + error.message);
    } else {
      console.error("Unknown error adding address:", error);
      toast.error("Failed to add address.");
    }
    return null;
  }
};

// Delete address
export const deleteAddressFromSanity = async (id: string): Promise<void> => {
  try {
    await client.delete(id);
    toast.success("Address deleted successfully!");
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error deleting address:", error);
      toast.error("Failed to delete address: " + error.message);
    } else {
      console.error("Unknown error deleting address:", error);
      toast.error("Failed to delete address.");
    }
  }
};
