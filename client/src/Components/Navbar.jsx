import React, { useEffect, useState } from "react";
import { FaSun, FaMoon, FaBars, FaHome, FaUser, FaGraduationCap, FaBlog, FaQuestionCircle, FaSignOutAlt, FaPlus, FaList, FaInfoCircle, FaPhone, FaHistory, FaLightbulb, FaRocket } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../Redux/Slices/AuthSlice";
import viteLogo from "../assets/images/vite.svg.png";
import logo from "../assets/logo.png";
import useScrollToTop from "../Helpers/useScrollToTop";

export default function Navbar() {
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "light" ? false : true
  );
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { data: user, role } = useSelector((state) => state.auth);
  const location = useLocation();
  const dispatch = useDispatch();

  // Debug: Simple check to see what's happening
  console.log("🔍 Navbar - User state:", { user, role, hasUser: !!user?.fullName });

  // Use scroll to top utility
  useScrollToTop();

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  const toggleMenu = () => {
    // Trigger the Sidebar drawer instead of mobile menu
    const drawerToggle = document.getElementById('sidebar-drawer');
    
    if (drawerToggle) {
      console.log("Navbar burger clicked - toggling drawer");
      drawerToggle.checked = !drawerToggle.checked;
    } else {
      console.log("Drawer element not found");
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    setIsMenuOpen(false);
  };

  const handleLogoClick = () => {
    // Navigate to home page and scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const element = document.querySelector("html");
    element.classList.remove("light", "dark");
    if (darkMode) {
      element.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      element.classList.add("light");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  // Set dark mode as default on first load
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (!savedTheme) {
      setDarkMode(true);
      localStorage.setItem("theme", "dark");
    }
  }, []);

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMenuOpen && !event.target.closest('.mobile-menu-container')) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  const menuItems = [
    { name: "الرئيسية", path: "/", icon: FaHome },
    { name: "الكورسات ", path: "/subjects", icon: FaGraduationCap },
    { name: "الدورات", path: "/courses", icon: FaList },
    
    { name: "المدونة", path: "/blogs", icon: FaBlog },
    { name: "الأسئلة والأجوبة", path: "/qa", icon: FaQuestionCircle },
    { name: "تاريخ الامتحانات", path: "/exam-history", icon: FaHistory },
    { name: "حول", path: "/about", icon: FaInfoCircle },
    { name: "اتصل بنا", path: "/contact", icon: FaPhone },
  ];

  const adminMenuItems = [
    { name: "لوحة التحكم", path: "/admin", icon: FaUser },
    
    { name: "إدارة المستخدمين", path: "/admin/users", icon: FaUser },
    { name: "إدارة المدونة", path: "/admin/blogs", icon: FaBlog },
    { name: "إدارة الأسئلة والأجوبة", path: "/admin/qa", icon: FaQuestionCircle },
    { name: "إدارة المواد", path: "/admin/subjects", icon: FaGraduationCap },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                 <div className="flex justify-between items-center h-16 md:h-20">
          {/* Modern Logo */}
                     <Link to="/" onClick={handleLogoClick} className="flex items-center space-x-2 md:space-x-4 group logo-hover">
        
            <div className="relative">
              {/* Logo Image */}
              <img 
                src={logo} 
                alt="منصة" 
                className="w-14 h-14 object-contain group-hover:scale-110 transition-transform duration-300 dark:drop-shadow-[0_0_15px_rgba(255,255,255,0.3)] dark:group-hover:drop-shadow-[0_0_20px_rgba(255,255,255,0.5)]"
              />
            </div>

            <div className="flex flex-col">
              <span className="oi-regular text-2xl font-bold text-amber-600 group-hover:text-amber-700 transition-colors duration-300 dark:text-amber-400 dark:group-hover:text-amber-300 dark:drop-shadow-[0_0_20px_rgba(217,119,6,0.5)] dark:group-hover:drop-shadow-[0_0_25px_rgba(217,119,6,0.7)]">
                The Eagle
              </span>
              
            </div>
          
          </Link>

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2.5 md:p-3 rounded-xl bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 hover:from-blue-100 hover:to-purple-100 dark:hover:from-blue-900 dark:hover:to-purple-900 transition-all duration-300 group shadow-lg hover:shadow-xl"
            >
              {darkMode ? (
                <FaSun className="w-4 h-4 md:w-5 md:h-5 text-yellow-500 group-hover:scale-110 transition-transform duration-300" />
              ) : (
                <FaMoon className="w-4 h-4 md:w-5 md:h-5 text-gray-700 group-hover:scale-110 transition-transform duration-300" />
              )}
            </button>

            {/* Sign Up Button - ONLY show when NO user is logged in */}
            {!user?.fullName && (
              <Link
                to="/signup"
                className="px-2 py-1 md:px-4 md:py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-semibold text-sm md:text-base transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                سجل الآن
              </Link>
            )}

{!user?.fullName && (
              <Link
                to="/login"
                className="px-2 py-1 md:px-4 md:py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-semibold text-sm md:text-base transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                تسجيل الدخول
              </Link>
            )}

            {/* Menu Button - Visible on all devices */}
            <div className="flex items-center space-x-3">  
              {/* Burger Menu Button */}
              <button
                onClick={toggleMenu}
                className="p-2.5 md:p-3 rounded-xl bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 hover:from-blue-100 hover:to-purple-100 dark:hover:from-blue-900 dark:hover:to-purple-900 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <FaBars className="w-4 h-4 md:w-5 md:h-5 text-gray-700 dark:text-gray-300" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu - Enhanced Design */}
        <div
          className={`md:hidden mobile-menu-container transition-all duration-500 ease-in-out overflow-hidden ${
            isMenuOpen
              ? "max-h-screen opacity-100 visible"
              : "max-h-0 opacity-0 invisible"
          }`}
        >
          <div className="py-8 space-y-6 border-t border-gray-200/50 dark:border-gray-700/50 bg-gradient-to-b from-gray-50/95 to-white/95 dark:from-gray-800/95 dark:to-gray-900/95 backdrop-blur-xl">
            {/* Navigation Links */}
            <div className="space-y-3">
              <div className="px-6 py-3">
                <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  التنقل
                </p>
              </div>
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-4 px-6 py-4 mx-4 rounded-2xl font-medium transition-all duration-300 mobile-menu-item ${
                    location.pathname === item.path
                      ? "text-blue-600 dark:text-blue-400 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 shadow-lg"
                      : "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50 dark:hover:from-gray-800 dark:hover:to-blue-900/20"
                  }`}
                >
                  <div className={`p-3 rounded-xl shadow-lg ${
                    location.pathname === item.path
                      ? "bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30"
                      : "bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800"
                  }`}>
                    <item.icon className="w-5 h-5" />
                  </div>
                  <span className="font-semibold">{item.name}</span>
                </Link>
              ))}
            </div>

            {/* User Menu Items */}
            {user && (
              <>
                <div className="border-t border-gray-200/50 dark:border-gray-700/50 pt-6">
                  <div className="px-6 py-4 mx-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl shadow-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-14 h-14 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl">
                        <span className="text-white font-bold text-lg">
                          {user.fullName?.charAt(0)?.toUpperCase() || "U"}
                        </span>
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-gray-900 dark:text-white text-lg">
                          {user.fullName}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {user.email}
                        </p>
                        <p className="text-xs text-blue-600 dark:text-blue-400 font-semibold uppercase tracking-wider">
                          {user.role}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Admin Menu */}
                {user.role === "ADMIN" && (
                  <div className="space-y-3">
                    <div className="px-6 py-3">
                      <p className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider">
                        لوحة الإدارة
                      </p>
                    </div>
                    {adminMenuItems.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        className={`flex items-center space-x-4 px-6 py-4 mx-4 rounded-2xl font-medium transition-all duration-300 mobile-menu-item ${
                          location.pathname === item.path
                            ? "text-purple-600 dark:text-purple-400 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 shadow-lg"
                            : "text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-gradient-to-r hover:from-gray-50 hover:to-purple-50 dark:hover:from-gray-800 dark:hover:to-purple-900/20"
                        }`}
                      >
                        <div className={`p-3 rounded-xl shadow-lg ${
                          location.pathname === item.path
                            ? "bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30"
                            : "bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800"
                        }`}>
                          <item.icon className="w-5 h-5" />
                        </div>
                        <span className="font-semibold">{item.name}</span>
                      </Link>
                    ))}
                  </div>
                )}

                {/* User Actions */}
                <div className="space-y-3">
                  <div className="px-6 py-3">
                    <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      الحساب
                    </p>
                  </div>
                  <Link
                    to="/profile"
                    className="flex items-center space-x-4 px-6 py-4 mx-4 rounded-2xl font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50 dark:hover:from-gray-800 dark:hover:to-blue-900/20 transition-all duration-300 mobile-menu-item"
                  >
                    <div className="p-3 rounded-xl shadow-lg bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800">
                      <FaUser className="w-5 h-5" />
                    </div>
                    <span className="font-semibold">الملف الشخصي</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-4 px-6 py-4 mx-4 rounded-2xl font-medium text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 dark:hover:from-red-900/20 dark:hover:to-pink-900/20 transition-all duration-300 w-full text-left mobile-menu-item"
                  >
                    <div className="p-3 rounded-xl shadow-lg bg-gradient-to-r from-red-100 to-pink-100 dark:from-red-900/30 dark:to-pink-900/30">
                      <FaSignOutAlt className="w-5 h-5" />
                    </div>
                    <span className="font-semibold">تسجيل الخروج</span>
                  </button>
                </div>
              </>
            )}

            {/* Guest Actions */}
            {!user && (
              <div className="space-y-4 px-6">
                <div className="text-center mb-4">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                    انضم إلينا الآن
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    ابدأ رحلة التعلم مع The Eagle
                  </p>
                </div>
                
                <Link
                  to="/login"
                  className="flex items-center justify-center gap-3 w-full px-8 py-4 text-center bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-2xl font-bold transition-all duration-300 transform hover:scale-105 mobile-menu-item shadow-lg hover:shadow-xl"
                >
                  <FaUser className="w-5 h-5" />
                  تسجيل الدخول
                </Link>
                <Link
                  to="/signup"
                  className="flex items-center justify-center gap-3 w-full px-8 py-4 text-center border-2 border-blue-600 text-blue-600 dark:text-blue-400 hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 hover:text-white rounded-2xl font-bold transition-all duration-300 mobile-menu-item shadow-lg hover:shadow-xl"
                >
                  <FaPlus className="w-5 h-5" />
                  إنشاء حساب جديد
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
