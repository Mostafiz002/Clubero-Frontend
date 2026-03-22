import { Link, NavLink, Outlet } from "react-router";
import LogoImg from "../assets/icons8-cloud-cross-48.png";
import {
  FiMenu,
  FiHome,
  FiGrid,
  FiUsers,
  FiUser,
  FiLogOut,
  FiCalendar,
  FiDollarSign,
  FiChevronDown,
} from "react-icons/fi";
import { MdOutlineReceiptLong, MdOutlineEventRepeat } from "react-icons/md";
import { HiOutlineTicket } from "react-icons/hi2";
import { LiaUsersCogSolid } from "react-icons/lia";
import { PiUsersThree } from "react-icons/pi";
import { LuUserCog } from "react-icons/lu";
import toast from "react-hot-toast";
import useAuth from "../hooks/useAuth";
import Swal from "sweetalert2";
import useRole from "../hooks/useRole";

const DashboardLayout = () => {
  const { user,setUser, logOut } = useAuth();
  const { role } = useRole();

  const handleLogout = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will be redirected to the login page.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ff4a79",
      cancelButtonColor: "#1f2937",
      confirmButtonText: "Yes, Logout",
    }).then((result) => {
      if (result.isConfirmed) {
        logOut()
          .then(() => {
            toast.success("Logged out successfully");
            setUser(null);
          })
          .catch((err) => console.log(err));
      }
    });
  };

 const navLinkClasses = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 transition-all duration-300 rounded-xl text-sm font-medium ${
      isActive
        ? "bg-gradient-to-r from-[#ff4a79] to-[#ff758c] text-white shadow-md shadow-[#ff4a79]/30"
        : "text-gray-500 hover:bg-white/50 hover:text-gray-900"
    }`;

  return (
    <div className="drawer lg:drawer-open font-sans min-h-screen bg-[#f8fafc]">
      <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />

      {/* Main Content Area */}
      <div className="drawer-content flex flex-col bg-linear-to-br from-slate-50 via-white to-blue-50/30">
        {/* Navbar */}
         <nav className="navbar sticky top-0 z-30 w-full bg-white/70 backdrop-blur-xl border-b border-gray-100 px-6 py-3 justify-between">
          <div className="flex items-center gap-2">
            <div className="flex-none lg:hidden">
              <label
                htmlFor="my-drawer-4"
                className="btn btn-square btn-ghost text-gray-600"
              >
                <FiMenu className="text-xl" />
              </label>
            </div>
            <div className="hidden lg:block">
              <h1 className="text-lg font-bold tracking-tight text-slate-800">
                Workspace
              </h1>
            </div>
          </div>

          {/* User Profile Info - Right Side */}
          <div className="flex items-center gap-4">
            <div className="dropdown dropdown-end">
              <div tabIndex={0} role="button" className="flex items-center gap-3 p-1">
                <div className="hidden md:block text-right">
                </div>
                <div className="avatar">
                  <div className="w-10 rounded-full border-2 border-[#ff4a79]/20 shadow-sm">
                    <img src={user?.photoURL || "https://i.ibb.co/mJR9fP9/avatar.png"} alt="profile" />
                  </div>
                </div>
                <FiChevronDown className="text-slate-400 hidden sm:block" />
              </div>
              <ul tabIndex={0} className="dropdown-content z-40 menu p-2 shadow-xl bg-white rounded-2xl w-52 mt-4 border border-slate-100">
                <li className="menu-title text-slate-400 text-[10px] uppercase font-bold tracking-widest px-4 py-2">Quick Access</li>
                <li><Link to="/dashboard/profile" className="flex items-center gap-3 py-3"><FiUser className="text-[#ff4a79] text-lg" /> Profile</Link></li>
                <hr className="my-1 border-slate-50" />
                <li><button onClick={handleLogout} className="flex items-center gap-3 py-3 text-rose-500 font-medium hover:bg-rose-50"><FiLogOut className="text-lg" /> Logout</button></li>
              </ul>
            </div>
          </div>
        </nav>

        {/* Outlet Content */}
        <main className="p-6 md:p-8 grow animate-in fade-in duration-500">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Sidebar */}
      <div className="drawer-side z-40">
        <label htmlFor="my-drawer-4" className="drawer-overlay"></label>

        <aside className="min-h-full w-72 flex flex-col bg-linear-to-b from-slate-50 to-slate-100 border-r border-gray-200/60 shadow-xl shadow-slate-200/50">
          <div className="h-20 flex items-center px-8">
            <Link
              to="/"
              onClick={() => {
                window.scrollTo(0, 0);
              }}
              className="flex items-center gap-3 font-bold text-2xl text-[#ff4a79] hover:opacity-80 transition-opacity"
            >
              <img className="w-9 drop-shadow-sm" src={LogoImg} alt="logo" />
              <span className="tracking-tighter">clubero</span>
            </Link>
          </div>

          {/* Sidebar Menu */}
          <div className="flex-1 overflow-y-auto py-4 px-4 space-y-6">
            {/* Main Group */}
            <div>
              <p className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-[2px] mb-3">
                Main Navigation
              </p>
              <div className="space-y-1">
                <NavLink
                  to="/"
                  onClick={() => {
                    window.scrollTo(0, 0);
                  }}
                  className={navLinkClasses}
                >
                  <FiHome className="text-lg" />
                  <span>Homepage</span>
                </NavLink>
                <NavLink to="/dashboard/overview" className={navLinkClasses}>
                  <FiGrid className="text-lg" />
                  <span>Overview</span>
                </NavLink>
              </div>
            </div>

            {/* Admin Section */}
            {role === "admin" && (
              <div>
                <p className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-[2px] mb-3">
                  Administration
                </p>
                <div className="space-y-1">
                  <NavLink
                    to="/dashboard/manage-users"
                    className={navLinkClasses}
                  >
                    <LuUserCog className="text-lg" />
                    <span>Manage Users</span>
                  </NavLink>
                  <NavLink
                    to="/dashboard/manage-clubs"
                    className={navLinkClasses}
                  >
                    <LiaUsersCogSolid className="text-lg" />
                    <span>Manage Clubs</span>
                  </NavLink>
                  <NavLink
                    to="/dashboard/transactions"
                    className={navLinkClasses}
                  >
                    <MdOutlineReceiptLong className="text-lg" />
                    <span>Transactions</span>
                  </NavLink>
                </div>
              </div>
            )}

            {/* Manager Section */}
            {role === "club-manager" && (
              <div>
                <p className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-[2px] mb-3">
                  Management
                </p>
                <div className="space-y-1">
                  <NavLink
                    to="/dashboard/manage-clubs"
                    className={navLinkClasses}
                  >
                    <LiaUsersCogSolid className="text-lg" />
                    <span>Club Settings</span>
                  </NavLink>
                  <NavLink
                    to="/dashboard/club-member"
                    className={navLinkClasses}
                  >
                    <PiUsersThree className="text-lg" />
                    <span>Club Members</span>
                  </NavLink>
                  <NavLink
                    to="/dashboard/event-management"
                    className={navLinkClasses}
                  >
                    <MdOutlineEventRepeat className="text-lg" />
                    <span>Event Management</span>
                  </NavLink>
                  <NavLink
                    to="/dashboard/event-registrations"
                    className={navLinkClasses}
                  >
                    <HiOutlineTicket className="text-lg" />
                    <span>Event Registrations</span>
                  </NavLink>
                </div>
              </div>
            )}

            {/* Personal Group */}
            <div>
              <p className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-[2px] mb-3">
                Account
              </p>
              <div className="space-y-1">
                <NavLink to="/dashboard/my-clubs" className={navLinkClasses}>
                  <FiUsers className="text-lg" />
                  <span>My Clubs</span>
                </NavLink>
                <NavLink to="/dashboard/my-events" className={navLinkClasses}>
                  <FiCalendar className="text-lg" />
                  <span>My Events</span>
                </NavLink>
                <NavLink
                  to="/dashboard/payment-history"
                  className={navLinkClasses}
                >
                  <FiDollarSign className="text-lg" />
                  <span>Payment History</span>
                </NavLink>
                <NavLink to="/dashboard/profile" className={navLinkClasses}>
                  <FiUser className="text-lg" />
                  <span>Profile</span>
                </NavLink>
              </div>
            </div>
          </div>

          {/* Sidebar Footer */}
          <div className="p-4 mt-auto">
            <button
              onClick={handleLogout}
              className="flex w-full cursor-pointer items-center gap-3 px-4 py-3 text-slate-500 hover:text-red-500 hover:bg-red-50/50 transition-all duration-300 rounded-xl font-medium border border-transparent hover:border-red-100"
            >
              <FiLogOut className="text-lg" />
              <span>Logout Session</span>
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default DashboardLayout;
