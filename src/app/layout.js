import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import CustomCursor from "@/components/CustomCursor";
import WaterRippleBackground from "@/components/WaterRippleBackground";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";

export const metadata = {
  title: "AREARS SNEAKERS // Kinetic Footwear & Biomechanics",
  description:
    "Next-generation kinetic footwear engineered with nitrogen-infused ArearsFoam and 3K carbon propulsion shanks. Experience interactive 3D WebGL customization.",
  keywords: ["Arears Sneakers", "3D Footwear", "Running Shoes", "Kinetic Energy Return", "Three.js Sneaker"]
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen bg-[#f4fbf7] text-[#0f241a] flex flex-col selection:bg-emerald-200 selection:text-emerald-950 bg-grid-mint relative">
        <CustomCursor />
        <WaterRippleBackground />
        <AuthProvider>
          <CartProvider>
            <Navbar />
            <main className="flex-1 relative z-10">{children}</main>
            <CartDrawer />
            <Footer />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
