
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { generateCoverLetter } from '../services/gemini';
import { Language } from '../types';
import { Wand2, Download, Copy, CheckCircle2, AlertCircle } from 'lucide-react';
import { useToast } from '../components/Toast';
import { generatePdf } from '../utils/cvHelpers';

const CoverLetter: React.FC = () => {
    const { user } = useAuth(); // We might use user data if available
    const { showToast } = useToast();

    const [formData, setFormData] = useState({
        jobTitle: '',
        companyName: '',
        targetJobDescription: '',
        tone: 'professional' as 'professional' | 'enthusiastic' | 'confident',
        cvSummary: '' // In real app, might pre-fill from user profile
    });

    const [generatedLetter, setGeneratedLetter] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [activeStep, setActiveStep] = useState(0); // 0: Input, 1: Result

    const handleGenerate = async () => {
        if (!formData.jobTitle || !formData.companyName || !formData.cvSummary) {
            showToast('يرجى تعبئة كافة الحقول المطلوبة', 'error');
            return;
        }

        setIsGenerating(true);
        try {
            const result = await generateCoverLetter(
                formData.cvSummary,
                formData.jobTitle,
                formData.companyName,
                formData.tone,
                formData.targetJobDescription,
                Language.Arabic // Default to Arabic for now
            );
            setGeneratedLetter(result);
            setActiveStep(1);
            showToast('تم كتابة الخطاب بنجاح!', 'success');
        } catch (e) {
            showToast('فشل التوليد. حاول مرة أخرى.', 'error');
        } finally {
            setIsGenerating(false);
        }
    };

    const InputClass = "w-full p-4 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-white placeholder-gray-600 hover:border-white/20";
    const LabelClass = "block text-sm font-bold text-gray-400 mb-2";

    return (
        <div className="min-h-screen bg-dark pt-24 pb-20">
            <div className="container mx-auto px-4 max-w-4xl">

                <div className="text-center mb-12 animate-fade-up">
                    <h1 className="text-4xl font-black text-white mb-4">مولد خطاب التقديم الذكي</h1>
                    <p className="text-gray-400">دع الذكاء الاصطناعي يكتب لك خطاباً مقنعاً للشركات</p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 items-start">
                    {/* INPUT FORM */}
                    <div className={`space-y-6 bg-card p-8 rounded-3xl border border-white/5 shadow-2xl transition-opacity duration-500 ${activeStep === 1 && 'opacity-50 pointer-events-none md:opacity-100 md:pointer-events-auto'}`}>
                        <div className="flex items-center gap-2 mb-4 border-b border-white/5 pb-4">
                            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center font-bold text-white">1</div>
                            <h2 className="text-xl font-bold text-white">بيانات الوظيفة</h2>
                        </div>

                        <div>
                            <label className={LabelClass}>المسمى الوظيفي المستهدف</label>
                            <input
                                value={formData.jobTitle}
                                onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                                className={InputClass}
                                placeholder="مثال: مدير تسويق"
                            />
                        </div>

                        <div>
                            <label className={LabelClass}>اسم الشركة</label>
                            <input
                                value={formData.companyName}
                                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                                className={InputClass}
                                placeholder="مثال: أرامكو"
                            />
                        </div>

                        <div>
                            <label className={LabelClass}>وصف الوظيفة (اختياري)</label>
                            <textarea
                                value={formData.targetJobDescription}
                                onChange={(e) => setFormData({ ...formData, targetJobDescription: e.target.value })}
                                className={`${InputClass} h-32 text-sm`}
                                placeholder="الصق وصف الوظيفة هنا لزيادة دقة النتائج..."
                            />
                        </div>

                        <div>
                            <label className={LabelClass}>نبذة عنك (أو انسخ ملخص سيرتك)</label>
                            <textarea
                                value={formData.cvSummary}
                                onChange={(e) => setFormData({ ...formData, cvSummary: e.target.value })}
                                className={`${InputClass} h-32 text-sm`}
                                placeholder="خبرة 5 سنوات في التسويق..."
                            />
                        </div>

                        <div>
                            <label className={LabelClass}>نبرة الخطاب</label>
                            <div className="grid grid-cols-3 gap-2">
                                {['professional', 'enthusiastic', 'confident'].map((t) => (
                                    <button
                                        key={t}
                                        onClick={() => setFormData({ ...formData, tone: t as any })}
                                        className={`py-2 rounded-lg text-sm font-bold border transition-all ${formData.tone === t ? 'bg-primary border-primary text-white' : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'}`}
                                    >
                                        {t === 'professional' ? 'رسمي' : t === 'enthusiastic' ? 'حماسي' : 'واثق'}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button
                            onClick={handleGenerate}
                            disabled={isGenerating}
                            className="w-full py-4 bg-gradient-to-r from-primary to-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isGenerating ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Wand2 size={20} />}
                            {isGenerating ? 'جاري الكتابة...' : 'توليد الخطاب'}
                        </button>
                    </div>

                    {/* RESULT */}
                    <div className={`bg-white text-dark p-8 rounded-3xl shadow-2xl min-h-[500px] relative transition-all duration-500 transform ${activeStep === 0 ? 'translate-y-10 opacity-50 blur-sm' : 'translate-y-0 opacity-100 blur-0'}`}>
                        {activeStep === 0 && !isGenerating && (
                            <div className="absolute inset-0 flex items-center justify-center z-10">
                                <div className="text-center text-gray-400">
                                    <Wand2 size={48} className="mx-auto mb-4 opacity-20" />
                                    <p>املأ البيانات واضغط توليد</p>
                                </div>
                            </div>
                        )}

                        <div id="cover-letter-content" className="prose prose-lg max-w-none text-right" dir="rtl">
                            <div className="mb-8 pb-4 border-b border-gray-100 flex justify-between items-start">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900">{formData.jobTitle || 'المسمى الوظيفي'}</h2>
                                    <p className="text-gray-500">{formData.companyName || 'اسم الشركة'}</p>
                                </div>
                                <div className="text-xs text-gray-400 bg-gray-50 px-3 py-1 rounded-full">
                                    {new Date().toLocaleDateString('ar-SA')}
                                </div>
                            </div>

                            <textarea
                                value={generatedLetter}
                                onChange={(e) => setGeneratedLetter(e.target.value)}
                                className="w-full h-[400px] resize-none outline-none text-gray-700 leading-relaxed bg-transparent border-none p-0 focus:ring-0 text-base font-sans"
                                placeholder="سيظهر الخطاب هنا..."
                            />
                        </div>

                        {activeStep === 1 && (
                            <div className="flex gap-3 mt-6 pt-6 border-t border-gray-100">
                                <button
                                    onClick={() => { navigator.clipboard.writeText(generatedLetter); showToast('تم النسخ!', 'success'); }}
                                    className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors"
                                >
                                    <Copy size={18} /> نسخ
                                </button>
                                <button
                                    onClick={() => generatePdf('cover-letter-content', `Cover_Letter_${formData.companyName}`, Language.Arabic)}
                                    className="flex-1 py-3 bg-dark text-white hover:bg-black rounded-xl font-bold flex items-center justify-center gap-2 transition-colors"
                                >
                                    <Download size={18} /> تحميل PDF
                                </button>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default CoverLetter;
