import { Link } from "react-router-dom";
import { FaTachometerAlt, FaMoneyBill, FaThList, FaUser, FaExclamationTriangle, FaFileAlt } from "react-icons/fa";

const Sidebar = () => {
  return (
    <div className="bg-gray-900 text-white w-64 min-h-screen p-4">
      <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <FaTachometerAlt /> Admin Panel
      </h2>
      <ul className="space-y-2">
        <li>
        <Link to="/admin" className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-gray-700">
            <FaTachometerAlt /> Dashboard
          </Link>
        </li>
        <li>
          <Link to="/admin/dashboard/payment" className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-gray-700">
            <FaMoneyBill /> Payment Form
          </Link>
        </li>
        {/* <li>
          <Link to="/admin/ui-elements" className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-gray-700">
            <FaThList /> UI Elements
          </Link>
        </li> */}
        <li>
          <Link to="/admin/dashboard/invoice" className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-gray-700">
            <FaThList /> Invoice
          </Link>
        </li>
        <li>
          <Link to="/admin/dashboard/user-pages" className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-gray-700">
            <FaUser /> User Pages
          </Link>
        </li>
        {/* <li>
          <Link to="/admin/error-pages" className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-gray-700">
            <FaExclamationTriangle /> Error Pages
          </Link>
        </li> */}
        <li>
          <Link to="/admin/dashboard/documentation" className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-gray-700">
            <FaFileAlt /> Documentation
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;

