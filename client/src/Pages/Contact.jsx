import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { axiosInstance } from "../Helpers/axiosInstance";
import { isEmail } from "../Helpers/regexMatcher";
import InputBox from "../Components/InputBox/InputBox";
import TextArea from "../Components/InputBox/TextArea";
import Layout from "../Layout/Layout";
import { 
  FaPhone, 
  FaFacebook, 
  FaInstagram, 
  FaLinkedin, 
  FaYoutube,
  FaWhatsapp,
  FaGlobe,
  FaUser,
  FaComments
} from "react-icons/fa";

export default function Contact() {
  const [isLoading, setIsLoading] = useState(false);
  const [userInput, setUserInput] = useState({
    name: "",
    email: "",
    message: "",
  });

  function handleInputChange(e) {
    const { name, value } = e.target;
    setUserInput({
      ...userInput,
      [name]: value,
    });
  }

  async function onFormSubmit(e) {
    e.preventDefault();
    if (!userInput.email || !userInput.name || !userInput.message) {
      toast.error("جميع الحقول مطلوبة");
      return;
    }

    if (!isEmail(userInput.email)) {
      toast.error("بريد إلكتروني غير صحيح");
      return;
    }

    setIsLoading(true);
    const loadingMessage = toast.loading("جاري إرسال الرسالة...");
    try {
      const res = await axiosInstance.post("/contact", userInput);
      toast.success(res?.data?.message, { id: loadingMessage });
      setUserInput({
        name: "",
        email: "",
        message: "",
      });
    } catch (error) {
      toast.error("فشل إرسال الرسالة! حاول مرة أخرى", { id: loadingMessage });
    } finally {
      setIsLoading(false);
    }
  }

  const contactInfo = {
    phone: "+201143982522",
    whatsapp: "+201143982522",
    whatsapp1: "+966547803289",
    email: "softwarefikra@gmail.com",
    support: "softwarefikra@gmail.com",
    address: "Mansoura, 18 Street Torel, Egypt",
    website: "https://fikra.solutions/",
    workingHours: "Monday - Friday: 9:00 AM - 6:00 PM"
  };

  const socialMedia = [
    { name: "Facebook", icon: FaFacebook, url: "https://www.facebook.com/ali.alyan.92", color: "hover:text-blue-600" },
    { name: "LinkedIn", icon: FaLinkedin, url: "https://www.linkedin.com/in/%D8%B9%D9%84%D9%8A-%D9%85%D8%AD%D9%85%D8%AF-%D9%85%D8%B9%D9%84%D9%8A%D8%A7%D9%86-a42859105/", color: "hover:text-blue-700" },
    { name: "Instagram", icon: FaInstagram, url: "https://www.instagram.com/ali23121982/", color: "hover:text-pink-500" },
    { name: "YouTube", icon: FaYoutube, url: "https://www.youtube.com/@%D8%A3.%D8%B9%D9%84%D9%8A%D9%85%D8%AD%D9%85%D8%AF%D8%B9%D9%84%D9%8A%D8%A7%D9%86", color: "hover:text-red-500" },
    { name: "WhatsApp", icon: FaWhatsapp, url: `https://wa.me/${contactInfo.whatsapp.replace('+', '')}`, color: "hover:text-green-500" },
    { name: "WhatsApp 2", icon: FaWhatsapp, url: `https://wa.me/${contactInfo.whatsapp1.replace('+', '')}`, color: "hover:text-green-500" }
  ];

  return (
    <Layout>
      <section className="min-h-screen py-12 px-4 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              تواصل معنا
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              لديك أسئلة؟ نحب أن نسمع منك. أرسل لنا رسالة وسنرد عليك في أقرب وقت ممكن.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            {/* Contact Information */}
            <div className="space-y-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                  معلومات الاتصال
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  تواصل معنا من خلال أي من هذه القنوات. نحن هنا لمساعدتك!
                </p>
              </div>

              {/* Contact Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Phone */}
                <div className="flex items-center p-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mr-4">
                    <FaPhone className="text-blue-600 dark:text-blue-400 text-xl" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">الهاتف</h3>
                    <a href={`tel:${contactInfo.phone}`} className="text-blue-600 dark:text-blue-400 hover:underline">
                      {contactInfo.phone}
                    </a>
                  </div>
                </div>

                {/* WhatsApp */}
                <div className="flex items-center p-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <div className="flex-shrink-0 w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mr-4">
                    <FaWhatsapp className="text-green-600 dark:text-green-400 text-xl" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">واتساب</h3>
                    <a href={`https://wa.me/${contactInfo.whatsapp.replace('+', '')}`} className="text-green-600 dark:text-green-400 hover:underline">
                      {contactInfo.whatsapp}
                    </a>
                  </div>
                </div>

                {/* WhatsApp 2 */}
                <div className="flex items-center p-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <div className="flex-shrink-0 w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mr-4">
                    <FaWhatsapp className="text-green-600 dark:text-green-400 text-xl" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">واتساب 2</h3>
                    <a href={`https://wa.me/${contactInfo.whatsapp1.replace('+', '')}`} className="text-green-600 dark:text-green-400 hover:underline">
                      {contactInfo.whatsapp1}
                    </a>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div className="mt-12">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                    أرسل لنا رسالة
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    املأ النموذج أدناه وسنرد عليك في أقرب وقت ممكن
                  </p>
                </div>
                
                <form onSubmit={onFormSubmit} className="max-w-2xl mx-auto space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      الاسم *
                    </label>
                    <InputBox
                      id="name"
                      name="name"
                      type="text"
                      placeholder="أدخل اسمك"
                      value={userInput.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      البريد الإلكتروني *
                    </label>
                    <InputBox
                      id="email"
                      name="email"
                      type="email"
                      placeholder="أدخل بريدك الإلكتروني"
                      value={userInput.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      الرسالة *
                    </label>
                    <TextArea
                      id="message"
                      name="message"
                      placeholder="أدخل رسالتك"
                      value={userInput.message}
                      onChange={handleInputChange}
                      rows={5}
                      required
                    />
                  </div>
                  
                  <div className="text-center">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                    >
                      {isLoading ? 'جاري الإرسال...' : 'إرسال الرسالة'}
                    </button>
                  </div>
                </form>
              </div>

              {/* Social Media */}
              <div className="mt-12 text-center">
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-8">
                  تابعنا
                </h3>
                <div className="flex flex-wrap justify-center gap-6 max-w-md mx-auto">
                  {socialMedia.map((social, index) => (
                    <a
                      key={index}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`group flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 ${social.color} hover:scale-105`}
                      title={social.name}
                    >
                      <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-2 group-hover:bg-opacity-80 transition-colors">
                        <social.icon className="text-2xl" />
                      </div>
                      <span className="text-xs font-medium text-gray-600 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                        {social.name}
                      </span>
                </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-16 text-center">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                لماذا تختار منصتنا؟
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaUser className="text-2xl text-blue-600 dark:text-blue-400" />
                  </div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">دعم متخصص</h4>
                  <p className="text-gray-600 dark:text-gray-300">
                    دعم العملاء على مدار الساعة لمساعدتك في أي أسئلة
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaGlobe className="text-2xl text-green-600 dark:text-green-400" />
                  </div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">مجتمع عالمي</h4>
                  <p className="text-gray-600 dark:text-gray-300">
                    تواصل مع المتعلمين من جميع أنحاء العالم
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaComments className="text-2xl text-purple-600 dark:text-purple-400" />
                  </div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">استجابة سريعة</h4>
                  <p className="text-gray-600 dark:text-gray-300">
                    احصل على إجابات لأسئلتك خلال 24 ساعة
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
