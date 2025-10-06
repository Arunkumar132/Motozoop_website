import { client } from "@/sanity/lib/client";
import { Address } from "@/sanity.types";
import toast from "react-hot-toast";

export const fetchAddresses = async (): Promise<Address[]> => {
  try {
    const query = `*[_type == "address"] | order(_createdAt desc){
      _id, name, address, mobile, city, state, zip, default
    }`;
    return await client.fetch(query);
  } catch (error) {
    console.error("Error fetching addresses:", error);
    toast.error("Failed to fetch addresses.");
    return [];
  }
};

export const addAddress = async (addressData: Omit<Address, "_id">) => {
  try {
    const created = await client.create({
      _type: "address",
      ...addressData,
    });
    toast.success("Address added successfully!");
    return created;
  } catch (error) {
    console.error("Error adding address:", error);
    toast.error("Failed to add address.");
    return null;
  }
};

export const deleteAddress = async (id: string) => {
  try {
    await client.delete(id);
    toast.success("Address deleted successfully!");
    return true;
  } catch (error) {
    console.error("Error deleting address:", error);
    toast.error("Failed to delete address.");
    return false;
  }
};
