import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import GroupGateway from "./pages/GroupGateway";
import AdminPage from "./pages/AdminPage";
import CustomCursor from "./components/CustomCursor";
import KalhareLayout from "./pages/kalhare/KalhareLayout";
import KalhareHome from "./pages/kalhare/KalhareHome";
import KalhareAbout from "./pages/kalhare/KalhareAbout";
import KalhareProducts from "./pages/kalhare/KalhareProducts";
import KalhareCustom from "./pages/kalhare/KalhareCustom";
import KalhareContact from "./pages/kalhare/KalhareContact";
import KalhareTestProduct from "./pages/kalhare/KalhareTestProduct";
import PressmachLayout from "./pages/pressmach/PressmachLayout";
import PressmachHome from "./pages/pressmach/PressmachHome";
import PressmachAbout from "./pages/pressmach/PressmachAbout";
import PressmachMachines from "./pages/pressmach/PressmachMachines";
import PressmachCustom from "./pages/pressmach/PressmachCustom";
import PressmachContact from "./pages/pressmach/PressmachContact";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, filter: "blur(4px)" }}
        animate={{ opacity: 1, filter: "blur(0px)" }}
        exit={{ opacity: 0, filter: "blur(4px)" }}
        transition={{ duration: 0.35, ease: EASE }}
      >
        <Routes location={location}>
          <Route path="/" element={<GroupGateway />} />
          <Route path="/admin" element={<AdminPage />} />

          <Route path="/kalhare" element={<KalhareLayout />}>
            <Route index element={<KalhareHome />} />
            <Route path="about" element={<KalhareAbout />} />
            <Route path="products" element={<KalhareProducts />} />
            <Route path="custom" element={<KalhareCustom />} />
            <Route path="contact" element={<KalhareContact />} />
            <Route path="testproduct" element={<KalhareTestProduct />} />
          </Route>

          <Route path="/pressmach" element={<PressmachLayout />}>
            <Route index element={<PressmachHome />} />
            <Route path="about" element={<PressmachAbout />} />
            <Route path="machines" element={<PressmachMachines />} />
            <Route path="custom" element={<PressmachCustom />} />
            <Route path="contact" element={<PressmachContact />} />
          </Route>
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <CustomCursor />      <AnimatedRoutes />
    </BrowserRouter>
  );
}
