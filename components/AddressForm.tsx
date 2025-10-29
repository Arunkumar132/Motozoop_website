"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";

// ✅ Define a proper Address interface
export interface Address {
  id?: string;
  name: string;
  address: string;
  mobile: string;
  city: string;
  state: string;
  zip: string;
}

// ✅ Use the Address type in props
interface AddressFormProps {
  onClose: () => void;
  onAddressAdded: (address: Address) => void;
}

export default function AddressForm({ onClose, onAddressAdded }: AddressFormProps) {
  const [loading, setLoading] = useState(false);
  const [newAddress, setNewAddress] = useState<Address>({
    name: "",
    address: "",
    mobile: "",
    city: "",
    state: "",
    zip: "",
  });

  const handleSave = async () => {
    const { name, address, mobile, city, state, zip } = newAddress;
    if (!name || !address || !mobile || !city || !state || !zip) {
      toast.error("All fields are required!");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/address/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newAddress),
      });

      if (!res.ok) throw new Error("Failed to save address");

      const created: Address = await res.json();
      onAddressAdded(created);

      setNewAddress({
        name: "",
        address: "",
        mobile: "",
        city: "",
        state: "",
        zip: "",
      });

      toast.success("Address added successfully!");
      onClose();
    } catch (error) {
      console.error("Error saving address:", error);
      toast.error("Failed to save address");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-2">
      <Input
        placeholder="Name"
        value={newAddress.name}
        onChange={(e) => setNewAddress((prev) => ({ ...prev, name: e.target.value }))}
      />
      <Input
        placeholder="Mobile Number"
        value={newAddress.mobile}
        onChange={(e) => setNewAddress((prev) => ({ ...prev, mobile: e.target.value }))}
      />
      <Input
        placeholder="City"
        value={newAddress.city}
        onChange={(e) => setNewAddress((prev) => ({ ...prev, city: e.target.value }))}
      />
      <Input
        placeholder="State"
        value={newAddress.state}
        onChange={(e) => setNewAddress((prev) => ({ ...prev, state: e.target.value }))}
      />
      <Input
        placeholder="Zip Code"
        value={newAddress.zip}
        onChange={(e) => setNewAddress((prev) => ({ ...prev, zip: e.target.value }))}
      />
      <Textarea
        placeholder="Address"
        value={newAddress.address}
        onChange={(e) => setNewAddress((prev) => ({ ...prev, address: e.target.value }))}
        className="md:col-span-2"
      />
      <Button className="md:col-span-2" onClick={handleSave} disabled={loading}>
        {loading ? "Saving..." : "Save Address"}
      </Button>
    </div>
  );
}
