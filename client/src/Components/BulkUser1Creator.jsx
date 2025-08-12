import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import { FaUsers, FaDownload, FaSpinner, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { getAllStages } from '../Redux/Slices/StageSlice';
import { axiosInstance } from '../Helpers/axiosInstance';

const BulkUser1Creator = ({ onClose, onSuccess }) => {
    const dispatch = useDispatch();
    const { stages, loading: stagesLoading } = useSelector((state) => state.stage);
    const [formData, setFormData] = useState({
        count: 1,
        stageId: ''
    });
    const [isCreating, setIsCreating] = useState(false);
    const [createdUsers, setCreatedUsers] = useState([]);
    const [showResults, setShowResults] = useState(false);

    useEffect(() => {
        dispatch(getAllStages());
    }, [dispatch]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.stageId) {
            toast.error('يرجى اختيار المرحلة');
            return;
        }

        if (formData.count < 1 || formData.count > 100) {
            toast.error('عدد الحسابات يجب أن يكون بين 1 و 100');
            return;
        }

        setIsCreating(true);
        try {
            const response = await axiosInstance.post('/admin/users/bulk-user1', formData);

            if (response.data.success) {
                setCreatedUsers(response.data.data.createdUsers);
                setShowResults(true);
                toast.success(`تم إنشاء ${response.data.data.totalCreated} حساب بنجاح`);
                if (onSuccess) onSuccess();
            } else {
                toast.error(response.data.message || 'حدث خطأ أثناء إنشاء الحسابات');
            }
        } catch (error) {
            console.error('Error creating bulk users:', error);
            toast.error(error.response?.data?.message || 'حدث خطأ في الاتصال');
        } finally {
            setIsCreating(false);
        }
    };

    const exportToExcel = () => {
        if (createdUsers.length === 0) return;

        // Create CSV content
        const headers = ['Email', 'Password', 'Stage', 'Full Name', 'Phone Number', 'Username'];
        const csvContent = [
            headers.join(','),
            ...createdUsers.map(user => [
                user.email,
                user.password,
                user.stage,
                user.fullName,
                user.phoneNumber,
                user.username
            ].join(','))
        ].join('\n');

        // Create and download file
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `user1_accounts_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleClose = () => {
        setShowResults(false);
        setCreatedUsers([]);
        setFormData({ count: 1, stageId: '' });
        if (onClose) onClose();
    };

    if (showResults) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                            تم إنشاء الحسابات بنجاح
                        </h2>
                        <button
                            onClick={handleClose}
                            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        >
                            <FaTimesCircle size={24} />
                        </button>
                    </div>

                    <div className="mb-6">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="flex items-center gap-2 text-green-600">
                                <FaCheckCircle />
                                <span className="font-medium">تم إنشاء {createdUsers.length} حساب</span>
                            </div>
                            <button
                                onClick={exportToExcel}
                                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
                            >
                                <FaDownload />
                                تصدير إلى Excel
                            </button>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white dark:bg-gray-700 rounded-lg overflow-hidden">
                            <thead className="bg-gray-50 dark:bg-gray-600">
                                <tr>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        البريد الإلكتروني
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        كلمة المرور
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        المرحلة
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        الاسم الكامل
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        رقم الهاتف
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-gray-700 divide-y divide-gray-200 dark:divide-gray-600">
                                {createdUsers.map((user, index) => (
                                    <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-600">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                            {user.email}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900 dark:text-white">
                                            {user.password}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                            {user.stage}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                            {user.fullName}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                            {user.phoneNumber}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-6 flex justify-end">
                        <button
                            onClick={handleClose}
                            className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg transition-colors"
                        >
                            إغلاق
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                        إنشاء حسابات  متعددة 
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                        <FaTimesCircle size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            عدد الحسابات
                        </label>
                        <input
                            type="number"
                            name="count"
                            value={formData.count}
                            onChange={handleInputChange}
                            min="1"
                            max="100"
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                            placeholder="أدخل عدد الحسابات"
                        />
                        <p className="text-xs text-gray-500 mt-1">الحد الأقصى: 100 حساب</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            المرحلة
                        </label>
                        <select
                            name="stageId"
                            value={formData.stageId}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                            required
                        >
                            <option value="">اختر المرحلة</option>
                            {stages.map((stage) => (
                                <option key={stage._id} value={stage._id}>
                                    {stage.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="submit"
                            disabled={isCreating || stagesLoading}
                            className="flex-1 flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-700 disabled:bg-orange-400 text-white px-4 py-2 rounded-lg transition-colors"
                        >
                            {isCreating ? (
                                <>
                                    <FaSpinner className="animate-spin" />
                                    جاري الإنشاء...
                                </>
                            ) : (
                                <>
                                    <FaUsers />
                                    إنشاء الحسابات
                                </>
                            )}
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                            إلغاء
                        </button>
                    </div>
                </form>

                {stagesLoading && (
                    <div className="mt-4 text-center text-sm text-gray-500">
                        جاري تحميل المراحل...
                    </div>
                )}
            </div>
        </div>
    );
};

export default BulkUser1Creator;
