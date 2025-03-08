// src/layouts/DashboardLayout.tsx
import React from "react";
import Header from "../components/layout/Header";
import Sidebar from "../components/layout/Sidebar";
import Footer from "../components/layout/Footer";

const DashboardLayout: React.FC = ({ children }) => {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1">
        <Header />
        <main>{children}</main>
        <Footer />
      </div>
    </div>
  );
};

export default DashboardLayout;
