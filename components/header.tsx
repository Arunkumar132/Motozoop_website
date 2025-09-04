import Container from "./Container";
import Logo from "./Logo";
import HeaderMenu from "./HeaderMenu";
import SearchBar from "./SearchBar";
import Carticon from "./Carticon";
import FavoriteButton from "./FavoriteButton";
import MobileMenu from "./MobileMenu";
import { currentUser } from "@clerk/nextjs/server";
import { ClerkLoaded, SignedIn, UserButton, SignedOut, SignInButton } from "@clerk/nextjs";

const Header = async () => {
  const user = await currentUser();

  return (
    <header className="bg-white py-5 border-b border-b-black/20">
      <Container className="flex items-center justify-between text-lightColor">
        {/* Left Side */}
        <div className="w-auto md:w-1/3 flex items-center gap-2.5 justify-start md:gap-0">
          <MobileMenu />
          <Logo />
        </div>

        {/* Center Menu */}
        <HeaderMenu />

        {/* Right Side */}
        <div className="w-auto md:w-1/3 flex items-center justify-end gap-5">
          <SearchBar />
          <Carticon />
          <FavoriteButton />

          <ClerkLoaded>
            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
            <SignedOut>
              <SignInButton mode="modal">
                <button >
                  Login
                </button>
              </SignInButton>
            </SignedOut>
          </ClerkLoaded>
        </div>
      </Container>
    </header>
  );
};

export default Header;
