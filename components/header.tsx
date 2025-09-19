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
    <header className="bg-white/70 py-5 sticky top-0 z-50 backdrop-blur-md">
      <Container className="flex items-center justify-between text-lightColor">
        <div className="w-auto md:w-1/3 flex items-center gap-2.5 justify-start md:gap-0">
          <MobileMenu />
          <Logo />
        </div>
        <HeaderMenu />
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
