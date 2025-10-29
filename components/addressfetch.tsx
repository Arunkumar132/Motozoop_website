import { useEffect, useState, useCallback } from "react";
import { useUser } from "@clerk/nextjs";
import { toast } from "react-hot-toast";

interface Address {
  id: string;
  userId: string;
  name: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  default: boolean;
}

export default function FetchAddresses() {
  const { user } = useUser();
  const currentUserId = user?.id;
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(false);

  const getAddresses = useCallback(async () => {
    if (!currentUserId) return;
    setLoading(true);

    try {
      const res = await fetch(`/api/address?userId=${currentUserId}`);
      const data: Address[] = await res.json();
      setAddresses(data);
    } catch (error) {
      console.error("Error fetching addresses:", error);
      toast.error("Failed to fetch addresses");
    } finally {
      setLoading(false);
    }
  }, [currentUserId]);

  useEffect(() => {
    getAddresses();
  }, [getAddresses]);

  return (
    <div>
      {loading && <p>Loading addresses...</p>}
      {addresses.map((address) => (
        <div key={address.id} className="mb-4">
          <p className="font-semibold">{address.name}</p>
          <p>
            {address.street}, {address.city}, {address.state} - {address.zip}
          </p>
          {address.default && <p className="text-green-600 text-sm">(Default)</p>}
        </div>
      ))}
    </div>
  );
}
