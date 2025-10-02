import NoAccessToCart from "@/components/NoAccessToCart";
import WishListProducts from "@/components/WishListProductsts";
import { currentUser } from "@clerk/nextjs/server";

const WishlistPage = async () => {
  const user = await currentUser();

  return (
    <>
      {user ? (
        <WishListProducts/>
      ) : (
        <NoAccessToCart details="Login to view your wishlist items. Don't miss out on your cart products to make the payment!" />
      )}
    </>
  );
};

export default WishlistPage;