import { useState } from "react";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Layout from "../Layout/Layout";
import { login } from "../Redux/Slices/AuthSlice";
import InputBox from "../Components/InputBox/InputBox";
import { generateDeviceFingerprint, getDeviceType, getBrowserInfo, getOperatingSystem } from "../utils/deviceFingerprint";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaSignInAlt, FaGraduationCap } from "react-icons/fa";
import logo from "../assets/logo.png";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  function handleUserInput(e) {
    const { name, value } = e.target;
    setLoginData({
      ...loginData,
      [name]: value,
    });
  }

  async function onLogin(event) {
    event.preventDefault();
    if (!loginData.email || !loginData.password) {
      toast.error("Please fill all the details");
      return;
    }

    setIsLoading(true);
    
    // Generate device information for fingerprinting
    const deviceInfo = {
      platform: getDeviceType(),
      screenResolution: `${screen.width}x${screen.height}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      additionalInfo: {
        browser: getBrowserInfo().browser,
        browserVersion: getBrowserInfo().version,
        os: getOperatingSystem(),
        language: navigator.language,
        colorDepth: screen.colorDepth,
        touchSupport: 'ontouchstart' in window,
      }
    };

    const Data = { 
      email: loginData.email, 
      password: loginData.password,
      deviceInfo: deviceInfo
    };

    // dispatch create account action
    const response = await dispatch(login(Data));
    if (response?.payload?.success) {
      setLoginData({
        email: "",
        password: "",
      });
      navigate("/");
    }
    setIsLoading(false);
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8" dir="rtl">
        <div className="max-w-md w-full space-y-8">
          {/* Enhanced Header with Logo */}
          <div className="text-center">
            {/* Modern Logo Container */}
            <div className="flex justify-center items-center mb-8">
              <div className="relative">
                {/* Glowing Background Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-orange-400 via-orange-500 to-yellow-600 rounded-full blur-2xl opacity-30 animate-pulse"></div>
                
                {/* Logo Container */}
                <div className="relative bg-white dark:bg-gray-800 rounded-full p-4 shadow-2xl border-4 border-orange-200 dark:border-orange-700 transform hover:scale-110 transition-all duration-500">
                  <img 
                    src={logo} 
                    alt="منصة مستر مايكل Logo" 
                    className="w-16 h-16 object-contain drop-shadow-lg"
                  />
                </div>
                
                {/* Floating Decorative Elements */}
                <div className="absolute -top-2 -right-2 w-4 h-4 bg-yellow-400 rounded-full animate-bounce z-10 shadow-lg"></div>
                <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-orange-400 rounded-full animate-pulse z-10 shadow-lg"></div>
              </div>
            </div>
            
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-3 bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent">
              مرحباً بعودتك
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              سجل دخولك إلى حسابك لمتابعة التعلم
            </p>
          </div>

          {/* Enhanced Modern Form */}
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-orange-200/50 dark:border-orange-700/50 transform hover:scale-[1.02] transition-all duration-500">
            <form onSubmit={onLogin} className="space-y-6">
              {/* Email Field */}
              <div className="group">
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 text-right">
                  البريد الإلكتروني
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                    <FaEnvelope className="h-5 w-5 text-orange-500 group-focus-within:text-orange-600 transition-colors duration-200" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="block w-full pr-12 pl-4 py-4 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-300 text-right shadow-sm hover:shadow-md"
                    placeholder="أدخل بريدك الإلكتروني"
                    value={loginData.email}
                    onChange={handleUserInput}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="group">
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 text-right">
                  كلمة المرور
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                    <FaLock className="h-5 w-5 text-orange-500 group-focus-within:text-orange-600 transition-colors duration-200" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    className="block w-full pr-12 pl-12 py-4 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-300 text-right shadow-sm hover:shadow-md"
                    placeholder="أدخل كلمة المرور"
                    value={loginData.password}
                    onChange={handleUserInput}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <FaEyeSlash className="h-5 w-5" />
                    ) : (
                      <FaEye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Enhanced Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-4 px-6 border border-transparent text-lg font-semibold rounded-xl text-white bg-gradient-to-r from-orange-600 via-orange-500 to-yellow-600 hover:from-orange-700 hover:via-orange-600 hover:to-yellow-700 focus:outline-none focus:ring-4 focus:ring-orange-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl shadow-lg overflow-hidden"
              >
                {/* Button Background Glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-orange-600 via-orange-500 to-yellow-600 rounded-xl blur opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <span className="relative flex items-center gap-3">
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      جاري تسجيل الدخول...
                    </>
                  ) : (
                    <>
                      <FaSignInAlt className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                      تسجيل الدخول
                    </>
                  )}
                </span>
                
                {/* Creative Button Border Animation */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-orange-400 via-orange-500 to-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
              </button>
            </form>

            {/* Enhanced Divider */}
            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t-2 border-gray-200 dark:border-gray-600" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 font-medium">
                    جديد في منصة مستر مايكل؟
                  </span>
                </div>
              </div>
            </div>

            {/* Enhanced Sign Up Link */}
            <div className="mt-6 text-center">
              <Link
                to="/signup"
                className="inline-flex items-center gap-2 font-semibold text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 transition-all duration-200 hover:scale-105"
              >
                <span>إنشاء حسابك</span>
                <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Enhanced Footer */}
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full border border-gray-200 dark:border-gray-700">
              <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
              <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                بتسجيل الدخول، أنت توافق على{" "}
                <Link to="/terms" className="text-orange-600 dark:text-orange-400 hover:underline font-semibold">
                  شروط الخدمة
                </Link>{" "}
                و{" "}
                <Link to="/privacy" className="text-orange-600 dark:text-orange-400 hover:underline font-semibold">
                  سياسة الخصوصية
                </Link>
              </p>
              <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse animation-delay-1000"></div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
