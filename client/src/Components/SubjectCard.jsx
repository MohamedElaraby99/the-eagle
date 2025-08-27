import React from "react";
import { Link } from "react-router-dom";
import { FaStar, FaUsers, FaClock, FaTag, FaPlay, FaGraduationCap } from "react-icons/fa";
import { generateImageUrl } from "../utils/fileUtils";
import { placeholderImages } from "../utils/placeholderImages";

const SubjectCard = ({ subject, showActions = false, onEdit, onDelete, onToggleFeatured }) => {

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300" dir="rtl">
      <div className="relative h-48 overflow-hidden">
        <img
          src={generateImageUrl(subject.image?.secure_url)}
          alt={subject.name}
          className="w-full h-32 object-cover rounded-t-lg"
          onError={(e) => {
            e.target.src = placeholderImages.course;
          }}
        />
        {/* Featured Badge */}
        {subject.featured && (
          <div className="absolute top-2 right-2">
            <span className="bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-medium">مميز</span>
          </div>
        )}
        {/* Play Button Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
          <div className="bg-white bg-opacity-90 rounded-full p-3 opacity-0 hover:opacity-100 transition-opacity duration-300">
            <FaPlay className="text-gray-800" />
          </div>
        </div>
      </div>
      {/* Content */}
      <div className="p-6">
        {/* Instructor Badge */}
        <div className="flex items-center gap-2 mb-3">
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
            <FaGraduationCap className="inline ml-1" />
            {subject.instructor?.name || 'المدرس غير محدد'}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2 line-clamp-2 text-right">
          {subject.title}
        </h3>
        {/* Description */}
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2 text-right">
          {subject.description}
        </p>

        {/* Instructor */}
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 text-right">
          بواسطة {subject.instructor?.name || 'فريق التدريس المتخصص'}
        </p>

        {/* Meta Info */}
        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">   
          {/* Rating */}
          <div className="flex items-center gap-1">
            <FaStar className="text-orange-500" />
            <span>{(subject.rating || 5).toFixed(1)}</span>
          </div>
        </div>
        {/* Price and Actions */}
        {showActions && (
          <div className="flex items-center justify-between">        
            <div className="flex gap-2">
              <button
                onClick={() => onEdit(subject)}
                className="px-3 py-1 bg-orange-600 hover:bg-orange-700 text-white rounded text-sm transition-colors"
              >
                تعديل
              </button>
              <button
                onClick={() => onToggleFeatured && onToggleFeatured(subject._id)}
                className={`px-3 py-1 rounded text-sm transition-colors ${
                  subject.featured ? 'bg-orange-600 hover:bg-orange-700 text-white' : 'bg-gray-600 hover:bg-gray-700 text-white'
                }`}
              >
                {subject.featured ? 'إلغاء التميز' : 'تمييز'}
              </button>
              <button
                onClick={() => onDelete(subject._id)}
                className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm transition-colors"
              >
                حذف
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubjectCard; 