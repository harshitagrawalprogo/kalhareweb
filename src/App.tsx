import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import GroupGateway from "./pages/GroupGateway";
import KalhareLayout from "./pages/kalhare/KalhareLayout";
import KalhareHome from "./pages/kalhare/KalhareHome";
import KalhareAbout from "./pages/kalhare/KalhareAbout";
import KalhareProducts from "./pages/kalhare/KalhareProducts";
import KalhareCustom from "./pages/kalhare/KalhareCustom";
import KalhareContact from "./pages/kalhare/KalhareContact";
import PressmachLayout from "./pages/pressmach/PressmachLayout";
import PressmachHome from "./pages/pressmach/PressmachHome";
import PressmachAbout from "./pages/pressmach/PressmachAbout";
import PressmachMachines from "./pages/pressmach/PressmachMachines";
import PressmachCustom from "./pages/pressmach/PressmachCustom";
import PressmachContact from "./pages/pressmach/PressmachContact";

export default function App() {
  return (
    <BrowserRouter>
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<GroupGateway />} />

          <Route path="/kalhare" element={<KalhareLayout />}>
            <Route index element={<KalhareHome />} />
            <Route path="about" element={<KalhareAbout />} />
            <Route path="products" element={<KalhareProducts />} />
            <Route path="custom" element={<KalhareCustom />} />
            <Route path="contact" element={<KalhareContact />} />
          </Route>

          <Route path="/pressmach" element={<PressmachLayout />}>
            <Route index element={<PressmachHome />} />
            <Route path="about" element={<PressmachAbout />} />
            <Route path="machines" element={<PressmachMachines />} />
            <Route path="custom" element={<PressmachCustom />} />
            <Route path="contact" element={<PressmachContact />} />
          </Route>
        </Routes>
      </AnimatePresence>
    </BrowserRouter>
  );
}
