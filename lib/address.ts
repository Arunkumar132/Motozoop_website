import { client } from "@/sanity/lib/client";
import { Address } from "@/sanity.types";
import toast from "react-hot-toast";

// Fetch all addresses
export const fetchAddresses = async (): Promise<Address[]> => {
  try {
    return await client.fetch(`*[_type== "address"] | order(_createdAt desc){
      _id, name, address, mobile, city, state, zipCode, default
    }`);
  } catch (error) {
    console.error("Error fetching addresses:", error);
    toast.error("Failed to fetch addresses.");
    return [];
  }
};

// Add new address
export const addAddressToSanity = async (addressData: any): Promise<Address | null> => {
  try {
    const created = await client.create({
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
  } catch (error: any) {
    console.error("Error adding address:", error);
    toast.error("Failed to add address: " + error.message);
    return null;
  }
};

// Delete address
export const deleteAddressFromSanity = async (id: string) => {
  try {
    await client.delete(id);
    toast.success("Address deleted successfully!");
  } catch (error: any) {
    console.error("Error deleting address:", error);
    toast.error("Failed to delete address: " + error.message);
  }
};
