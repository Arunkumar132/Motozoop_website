import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs"; // Clerk hook to get signed-in user
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

export default function fetchAddresses() {
  const { user } = useUser(); // get signed-in user
  const currentUserId = user?.id;
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchAddresses = async () => {
    if (!currentUserId) return;

    setLoading(true);
    try {
      // Pass the Clerk userId as a query or in body to your API
      const res = await fetch(`/api/address?userId=${currentUserId}`);
      const data: Address[] = await res.json();

      // Only addresses of the signed-in user will be returned
      setAddresses(data);

      // Select default or first address
      const defaultAddress = data.find((addr) => addr.default);
      if (defaultAddress) setSelectedAddress(defaultAddress);
      else if (data.length > 0) setSelectedAddress(data[0]);
    } catch (error) {
      console.error("Error fetching addresses:", error);
      toast.error("Failed to fetch addresses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, [currentUserId]);

  return (
    <div>
      {loading && <p>Loading addresses...</p>}
      {selectedAddress && (
        <div>
          <p>{selectedAddress.name}</p>
          <p>
            {selectedAddress.street}, {selectedAddress.city}, {selectedAddress.state} -{" "}
            {selectedAddress.zip}
          </p>
        </div>
      )}
    </div>
  );
}
