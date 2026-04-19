import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import Products from "../pages/Products";
import Stock from "../pages/Stock";
import Promotions from "../pages/Promotions";
import Layout from "../components/Layout";

function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/" replace />;
}

function PrivateLayout({ children }) {
  return (
    <PrivateRoute>
      <Layout>{children}</Layout>
    </PrivateRoute>
  );
}

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={
          <PrivateLayout>
            <p className="text-stone-400 text-sm">Dashboard em construção 🚧</p>
          </PrivateLayout>
        } />
        <Route path="/products" element={
          <PrivateLayout><Products /></PrivateLayout>
        } />
        <Route path="/stock" element={
          <PrivateLayout><Stock /></PrivateLayout>
        } />
        <Route path="/promotions" element={
          <PrivateLayout><Promotions /></PrivateLayout>
        } />
      </Routes>
    </BrowserRouter>
  );
}