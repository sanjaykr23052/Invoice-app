import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

const AdminLayout = () => {
  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Right Content Area */}
      <div className="flex-1 p-6 bg-gray-100 min-h-screen">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
