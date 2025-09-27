import { Toaster } from "react-hot-toast";
import "./globals.css";
import { backIn } from "framer-motion";
const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">    
        <body className="font-poppins antialiased">{children}
            <Toaster
                position="bottom-right"
                toastOptions={{
                    style: {
                        background: "#000000",
                        color: "#fff",
                    },
                }} 
            />
        </body>
    </html>
  );
};    
export default RootLayout;