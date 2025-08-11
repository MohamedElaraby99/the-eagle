import React, { useEffect, useState } from 'react';
import { FaArrowRight, FaPlay, FaStar, FaUsers, FaGraduationCap, FaAward, FaRocket, FaGlobe } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import mr from '../assets/mr.png';

const AnimatedHero = ({ onGetStarted }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const stats = [
    { icon: FaUsers, number: "10K+", label: "طلاب مسجلين", color: "text-blue-600" },
    { icon: FaGraduationCap, number: "100+", label: "مواد متاحة", color: "text-green-600" },
    { icon: FaStar, number: "4.9", label: "متوسط التقييم", color: "text-yellow-600" },
    { icon: FaAward, number: "50+", label: "مدربين خبراء", color: "text-purple-600" }
  ];

  const handleExploreCourses = () => {
    // Navigate to courses page
    window.location.href = '/courses';
  };

  return (
         <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-amber-50 via-white to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900" dir="rtl">
       {/* Animated Background Elements */}
       <div className="absolute inset-0">
         {/* Large Gold Shape - Main Background Element */}
         <div className="absolute top-0 left-0 w-[400px] h-[400px] md:w-[600px] md:h-[600px] lg:w-[800px] lg:h-[800px] bg-gradient-to-br from-amber-600 via-yellow-500 to-orange-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
         
         {/* Secondary Gold Shapes */}
         <div className="absolute top-20 right-20 w-48 h-48 md:w-96 md:h-96 bg-amber-400 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-blob"></div>
         <div className="absolute bottom-20 left-40 w-40 h-40 md:w-80 md:h-80 bg-yellow-400 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-blob animation-delay-2000"></div>
         
         {/* Floating Geometric Elements */}
         <div className="absolute top-1/4 right-1/4 animate-float">
           <div className="w-4 h-4 md:w-6 md:h-6 bg-amber-500 rounded-full opacity-40"></div>
         </div>
         <div className="absolute top-1/3 left-1/4 animate-float animation-delay-2000">
           <div className="w-6 h-6 md:w-8 md:h-8 bg-yellow-500 rounded-full opacity-40"></div>
         </div>
         <div className="absolute bottom-1/4 right-1/3 animate-float animation-delay-4000">
           <div className="w-3 h-3 md:w-4 md:h-4 bg-amber-400 rounded-full opacity-40"></div>
         </div>
       </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          
          {/* Right Side - Content (RTL) */}
          <div className={`order-2 lg:order-1 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
            <div className="space-y-4 md:space-y-6 text-right">
                             {/* Badge */}
               <div className="inline-flex items-center gap-2 px-3 py-2 md:px-4 md:py-2 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded-full text-xs md:text-sm font-medium font-sans">
                 <FaRocket className="w-3 h-3 md:w-4 md:h-4" />
                 <span>منصة التعليم الرائدة</span>
               </div>

                             {/* Main Heading */}
               <h1 className="text-3xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 dark:text-white leading-tight font-sans">
                 <span className="text-amber-600">منصة</span>
                 <br />
                 <span className="bg-gradient-to-r from-amber-600 via-yellow-500 to-orange-500 bg-clip-text text-transparent">
                   للتعليم الذكي
                 </span>
                 <br />
                 <span className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl text-gray-700 dark:text-gray-300">
                   اكتشف عالم المعرفة
                 </span>
               </h1>
               
               {/* Description */}
               <p className="text-base md:text-lg lg:text-xl text-gray-600 dark:text-gray-400 leading-relaxed max-w-lg font-sans">
                 انضم إلى آلاف المتعلمين حول العالم وقم بتحويل حياتك المهنية من خلال دوراتنا الشاملة عبر الإنترنت المصممة من قبل خبراء الصناعة.
               </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 md:gap-4 pt-4 justify-end">
                                 <button 
                   onClick={onGetStarted}
                   className="group relative px-6 py-3 md:px-8 md:py-4 bg-gradient-to-r from-amber-600 to-yellow-500 text-white font-semibold rounded-full text-base md:text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 font-sans"
                 >
                   <span className="flex items-center gap-2 justify-center">
                     ابدأ التعلم
                     <FaArrowRight className="group-hover:translate-x-1 transition-transform duration-300" />
                   </span>
                 </button>
                 
                 <button 
                   onClick={handleExploreCourses}
                   className="group px-6 py-3 md:px-8 md:py-4 border-2 border-amber-600 text-amber-600 dark:text-amber-400 font-semibold rounded-full text-base md:text-lg hover:bg-amber-600 hover:text-white transition-all duration-300 font-sans"
                 >
                   <span className="flex items-center gap-2 justify-center">
                     <FaPlay className="group-hover:scale-110 transition-transform duration-300" />
                     استكشف الدورات
                   </span>
                 </button>
              </div>
            </div>
          </div>

          {/* Left Side - Image with Blue Shape Effect (RTL) */}
          <div className={`order-1 lg:order-2 relative transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
                         {/* Gold Shape Container */}
             <div className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] flex items-center justify-center">
               {/* Large Gold Circle Background */}
               <div className="absolute w-[300px] h-[300px] md:w-[400px] md:h-[400px] lg:w-[500px] lg:h-[500px] bg-gradient-to-br from-amber-600 via-yellow-500 to-orange-500 rounded-full shadow-2xl animate-pulse"></div>
               
               {/* Secondary Gold Ring */}
               <div className="absolute w-[270px] h-[270px] md:w-[360px] md:h-[360px] lg:w-[450px] lg:h-[450px] bg-gradient-to-br from-amber-400 to-yellow-400 rounded-full opacity-30 animate-spin-slow"></div>
              
              {/* Image Container - Appears to come out from the blue shape */}
              <div className="relative z-10 w-[200px] h-[240px] md:w-[250px] md:h-[320px] lg:w-[300px] lg:h-[400px] flex items-center justify-center">
                <img 
                  src={mr} 
                  alt="the eagle" 
                  className="w-full h-full object-contain drop-shadow-2xl transform hover:scale-105 transition-transform duration-500"
                />
                
                {/* Floating Elements Around Image */}
                <div className="absolute -top-2 -left-2 md:-top-4 md:-left-4 w-4 h-4 md:w-6 md:h-6 bg-yellow-400 rounded-full animate-bounce"></div>
                <div className="absolute -bottom-2 -right-2 md:-bottom-4 md:-right-4 w-3 h-3 md:w-4 md:h-4 bg-pink-400 rounded-full animate-pulse"></div>
                <div className="absolute top-1/2 -left-4 md:-left-8 w-2 h-2 md:w-3 md:h-3 bg-green-400 rounded-full animate-float"></div>
                <div className="absolute top-1/2 -right-4 md:-right-8 w-2 h-2 md:w-3 md:h-3 bg-purple-400 rounded-full animate-float animation-delay-2000"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

             {/* Additional Floating Elements */}
       <div className="absolute bottom-10 right-10 animate-float">
         <div className="w-3 h-3 md:w-4 md:h-4 bg-amber-500 rounded-full opacity-30"></div>
       </div>
       <div className="absolute top-10 left-10 animate-float animation-delay-4000">
         <div className="w-4 h-4 md:w-6 md:h-6 bg-yellow-500 rounded-full opacity-30"></div>
       </div>
    </section>
  );
};

export default AnimatedHero; 