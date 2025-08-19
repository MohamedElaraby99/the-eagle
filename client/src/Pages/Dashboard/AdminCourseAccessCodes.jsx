import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Layout from "../../Layout/Layout";
import { getAllCourses } from "../../Redux/Slices/CourseSlice";
import { getAllStages } from "../../Redux/Slices/StageSlice";
import { adminGenerateCourseAccessCodes, adminListCourseAccessCodes } from "../../Redux/Slices/CourseAccessSlice";

export default function AdminCourseAccessCodes() {
  const dispatch = useDispatch();
  const { courses } = useSelector((s) => s.course);
  const { stages } = useSelector((s) => s.stage);
  const { admin, error } = useSelector((s) => s.courseAccess);

  const [form, setForm] = useState({ stageId: "", courseId: "", quantity: 1, accessStartAt: "", accessEndAt: "" });
  const [searchTerm, setSearchTerm] = useState("");
  const [showOnlyUsed, setShowOnlyUsed] = useState(false);

  useEffect(() => {
    dispatch(getAllCourses());
    dispatch(getAllStages({ page: 1, limit: 100 }));
  }, [dispatch]);

  useEffect(() => {
    dispatch(adminListCourseAccessCodes({ courseId: form.courseId || undefined }));
  }, [dispatch, form.courseId]);

  // Initialize default date range (now -> now + 7 days) if empty
  useEffect(() => {
    const toLocalInputValue = (d) => {
      const pad = (n) => String(n).padStart(2, '0');
      const year = d.getFullYear();
      const month = pad(d.getMonth() + 1);
      const day = pad(d.getDate());
      const hours = pad(d.getHours());
      const minutes = pad(d.getMinutes());
      return `${year}-${month}-${day}T${hours}:${minutes}`;
    };
    if (!form.accessStartAt || !form.accessEndAt) {
      const now = new Date();
      const end = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      setForm((p) => ({
        ...p,
        accessStartAt: p.accessStartAt || toLocalInputValue(now),
        accessEndAt: p.accessEndAt || toLocalInputValue(end)
      }));
    }
  }, []);

  const onChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const onGenerate = async (e) => {
    e.preventDefault();
    if (!form.courseId) return;
    const payload = {
      courseId: form.courseId,
      quantity: Number(form.quantity)
    };
    const toLocalInputValue = (d) => {
      const pad = (n) => String(n).padStart(2, '0');
      const year = d.getFullYear();
      const month = pad(d.getMonth() + 1);
      const day = pad(d.getDate());
      const hours = pad(d.getHours());
      const minutes = pad(d.getMinutes());
      return `${year}-${month}-${day}T${hours}:${minutes}`;
    };
    if (!form.accessStartAt || !form.accessEndAt) {
      const now = new Date();
      const end = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      payload.accessStartAt = toLocalInputValue(now);
      payload.accessEndAt = toLocalInputValue(end);
    } else {
      payload.accessStartAt = form.accessStartAt;
      payload.accessEndAt = form.accessEndAt;
    }
    if (new Date(payload.accessEndAt) <= new Date(payload.accessStartAt)) {
      alert('تاريخ النهاية يجب أن يكون بعد تاريخ البداية');
      return;
    }
    console.log('📤 Generating course access codes with payload:', payload);
    await dispatch(adminGenerateCourseAccessCodes(payload));
    dispatch(adminListCourseAccessCodes({ courseId: form.courseId }));
  };

  // Filter codes based on search term and used filter
  const filteredCodes = admin.codes.filter(code => {
    const courseName = code.courseId?.title || courses.find(c => c._id === code.courseId)?.title || '';
    const userEmail = code.usedBy?.email || '';
    const matchesSearch = code.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         userEmail.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesUsedFilter = !showOnlyUsed || code.isUsed;
    return matchesSearch && matchesUsedFilter;
  });

  const exportCodesToCSV = () => {
    const headers = [
      'code',
      'course',
      'accessStartAt',
      'accessEndAt',
      'isUsed',
      'usedBy',
      'usedAt',
      'codeExpiresAt'
    ];
    const getCourseName = (code) => {
      if (typeof code.courseId === 'object' && code.courseId?.title) {
        return code.courseId.title;
      }
      return courses.find(c => c._id === code.courseId)?.title || code.courseId || '';
    };
    const getUserEmail = (code) => {
      if (typeof code.usedBy === 'object' && code.usedBy?.email) {
        return code.usedBy.email;
      }
      return code.usedBy || '';
    };
    const rows = filteredCodes.map(c => ([
      c.code,
      getCourseName(c),
      c.accessStartAt ? new Date(c.accessStartAt).toISOString() : '',
      c.accessEndAt ? new Date(c.accessEndAt).toISOString() : '',
      c.isUsed ? 'yes' : 'no',
      getUserEmail(c),
      c.usedAt ? new Date(c.usedAt).toISOString() : '',
      c.codeExpiresAt ? new Date(c.codeExpiresAt).toISOString() : ''
    ]));
    const csvContent = [headers, ...rows]
      .map(r => r.map(v => {
        const s = String(v ?? '');
        // Escape quotes and wrap with quotes if contains comma/newline/quote
        const needsWrap = /[",\n]/.test(s);
        const escaped = s.replace(/"/g, '""');
        return needsWrap ? `"${escaped}"` : escaped;
      }).join(','))
      .join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const ts = new Date().toISOString().slice(0,19).replace(/[:T]/g,'-');
    a.download = `course-access-codes-${ts}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getCourseName = (code) => {
    try {
      if (typeof code.courseId === 'object' && code.courseId?.title) {
        return String(code.courseId.title);
      }
      const courseTitle = courses.find(c => c._id === code.courseId)?.title;
      return courseTitle ? String(courseTitle) : (code.courseId ? String(code.courseId) : '');
    } catch (error) {
      console.error('Error in getCourseName:', error, code);
      return '';
    }
  };
  
  const getUserEmail = (code) => {
    try {
      if (typeof code.usedBy === 'object' && code.usedBy?.email) {
        return String(code.usedBy.email);
      }
      return code.usedBy ? String(code.usedBy) : '';
    } catch (error) {
      console.error('Error in getUserEmail:', error, code);
      return '';
    }
  };

  // Debug: Log the first code to see its structure
  if (filteredCodes.length > 0) {
    console.log('First code structure:', filteredCodes[0]);
    console.log('CourseId type:', typeof filteredCodes[0].courseId, filteredCodes[0].courseId);
    console.log('UsedBy type:', typeof filteredCodes[0].usedBy, filteredCodes[0].usedBy);
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto p-6" dir="rtl">
        <h1 className="text-3xl font-bold mb-6">أكواد الوصول للكورسات</h1>
        <form onSubmit={onGenerate} className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 mb-6 grid grid-cols-1 md:grid-cols-6 gap-4" dir="rtl">
          <div>
            <label className="block text-sm mb-1">المرحلة</label>
            <select name="stageId" value={form.stageId} onChange={(e)=>{onChange(e); setForm(p=>({...p, courseId: ""}));}} className="w-full p-2 rounded border dark:bg-gray-700">
              <option value="">اختر المرحلة</option>
              {stages.map((st) => (
                <option key={st._id} value={st._id}>{st.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm mb-1">الكورس</label>
            <select name="courseId" value={form.courseId} onChange={onChange} className="w-full p-2 rounded border dark:bg-gray-700" disabled={!form.stageId}>
              <option value="">{form.stageId ? 'اختر كورس' : 'اختر المرحلة أولاً'}</option>
              {courses
                .filter((c) => !form.stageId || c.stage?._id === form.stageId)
                .map((c) => (
                  <option key={c._id} value={c._id}>{c.title}</option>
                ))}
            </select>
          </div>
          <div>
            <label className="block text-sm mb-1">تاريخ البداية</label>
            <input name="accessStartAt" type="datetime-local" required value={form.accessStartAt} onChange={onChange} className="w-full p-2 rounded border dark:bg-gray-700" />
          </div>
          <div>
            <label className="block text-sm mb-1">تاريخ النهاية</label>
            <input name="accessEndAt" type="datetime-local" required min={form.accessStartAt} value={form.accessEndAt} onChange={onChange} className="w-full p-2 rounded border dark:bg-gray-700" />
          </div>
          <div>
            <label className="block text-sm mb-1">العدد</label>
            <input name="quantity" type="number" min="1" max="200" value={form.quantity} onChange={onChange} className="w-full p-2 rounded border dark:bg-gray-700" />
          </div>
          <div className="flex items-end">
            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">توليد الأكواد</button>
          </div>
        </form>

        {error && <div className="text-red-600 mb-4">{String(error)}</div>}

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-semibold">الأكواد المُنشأة</h2>
            <div className="flex items-center gap-3">
              <input
                type="text"
                placeholder="البحث في الأكواد..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded text-sm"
              />
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={showOnlyUsed}
                  onChange={(e) => setShowOnlyUsed(e.target.checked)}
                  className="rounded"
                />
                الأكواد المُستخدمة فقط
              </label>
              {admin.listing && <span className="text-sm text-gray-500">جاري التحميل...</span>}
              <button onClick={exportCodesToCSV} className="px-3 py-1 rounded bg-green-600 hover:bg-green-700 text-white text-sm">تصدير CSV</button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-right">
              <thead>
                <tr className="text-sm text-gray-500">
                  <th className="p-2">الكود</th>
                  <th className="p-2">المادة</th>
                  <th className="p-2">الفترة</th>
                  <th className="p-2">الحالة</th>
                  <th className="p-2">المُستخدم</th>
                  <th className="p-2">تاريخ الاستخدام</th>
                  <th className="p-2">انتهاء صلاحية الكود</th>
                </tr>
              </thead>
              <tbody>
                {filteredCodes.map((c) => (
                  <tr key={c._id || c.id} className="border-t border-gray-200 dark:border-gray-700">
                    <td className="p-2 font-mono">
                      <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">{String(c.code || '')}</span>
                    </td>
                    <td className="p-2">{getCourseName(c)}</td>
                    <td className="p-2">{c.accessStartAt && c.accessEndAt ? `${new Date(c.accessStartAt).toLocaleString('ar-EG')} ← ${new Date(c.accessEndAt).toLocaleString('ar-EG')}` : '-'}</td>
                    <td className="p-2">
                      <span className={`px-2 py-1 rounded text-xs ${c.isUsed ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                        {c.isUsed ? "مُستخدم" : "متاح"}
                      </span>
                    </td>
                    <td className="p-2">{getUserEmail(c)}</td>
                    <td className="p-2">{c.usedAt ? new Date(c.usedAt).toLocaleString('ar-EG') : '-'}</td>
                    <td className="p-2">{c.codeExpiresAt ? new Date(c.codeExpiresAt).toLocaleString('ar-EG') : '-'}</td>
                  </tr>
                ))}
                {filteredCodes.length === 0 && (
                  <tr>
                    <td colSpan="7" className="p-4 text-center text-gray-500">
                      {admin.listing ? 'جاري التحميل...' : 'لا توجد أكواد'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
}


