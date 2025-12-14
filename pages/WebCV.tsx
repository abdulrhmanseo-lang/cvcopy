
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { CVData } from '../types';
import { Mail, Phone, MapPin, Linkedin, Globe, Download, ExternalLink, Briefcase, GraduationCap, Code } from 'lucide-react';
import { generatePdf } from '../utils/cvHelpers';

const WebCV: React.FC = () => {
    const { id } = useParams();
    const [cv, setCv] = useState<CVData | null>(null);

    useEffect(() => {
        // In a real app, fetch by ID from DB.
        // Here we simulate by reading local storage regardless of ID
        const saved = localStorage.getItem('cv_data');
        if (saved) {
            setCv(JSON.parse(saved));
        }
    }, [id]);

    if (!cv) return <div className="min-h-screen bg-dark flex items-center justify-center text-white">Loading...</div>;

    return (
        <div className="min-h-screen bg-[#050505] text-gray-300 font-sans selection:bg-primary selection:text-white pb-20">

            {/* HERO SECTION */}
            <header className="relative h-[400px] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-primary/20 to-[#050505] z-0"></div>
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 z-0"></div>

                <div className="relative z-10 text-center px-4 animate-fade-up">
                    <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-primary to-indigo-600 p-1 rounded-full shadow-2xl">
                        <div className="w-full h-full bg-black rounded-full flex items-center justify-center text-4xl font-bold text-white border-4 border-black">
                            {cv.fullName.charAt(0)}
                        </div>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-white mb-4 tracking-tight">{cv.fullName}</h1>
                    <p className="text-xl md:text-2xl text-primary font-medium">{cv.jobTitle}</p>
                </div>
            </header>

            <div className="container mx-auto px-4 max-w-5xl -mt-20 relative z-20">

                {/* CONTACT CARD */}
                <div className="bg-card border border-white/5 rounded-3xl p-6 md:p-8 shadow-2xl backdrop-blur-xl mb-12 flex flex-wrap justify-center gap-6 md:gap-12 animate-fade-in delay-200">
                    {cv.email && <a href={`mailto:${cv.email}`} className="flex items-center gap-3 hover:text-primary transition-colors"><div className="p-3 bg-white/5 rounded-full"><Mail size={20} /></div> <span>{cv.email}</span></a>}
                    {cv.phone && <a href={`tel:${cv.phone}`} className="flex items-center gap-3 hover:text-primary transition-colors"><div className="p-3 bg-white/5 rounded-full"><Phone size={20} /></div> <span dir="ltr">{cv.phone}</span></a>}
                    {cv.location && <div className="flex items-center gap-3 hover:text-primary transition-colors"><div className="p-3 bg-white/5 rounded-full"><MapPin size={20} /></div> <span>{cv.location}</span></div>}
                </div>

                <div className="grid md:grid-cols-3 gap-8">

                    {/* MAIN CONTENT */}
                    <div className="md:col-span-2 space-y-12">

                        {/* ABOUT */}
                        <section className="animate-fade-up delay-300">
                            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2"><span className="w-8 h-1 bg-primary rounded-full"></span>نبذة عني</h2>
                            <p className="text-lg leading-relaxed text-gray-400">{cv.summary}</p>
                        </section>

                        {/* EXPERIENCE */}
                        <section className="animate-fade-up delay-400">
                            <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-2"><span className="w-8 h-1 bg-primary rounded-full"></span>الخبرات العملية</h2>
                            <div className="space-y-8 border-r-2 border-white/5 pr-6 relative">
                                {cv.experience.map((exp, i) => (
                                    <div key={i} className="relative group">
                                        <div className="absolute -right-[31px] top-1 w-4 h-4 rounded-full bg-dark border-2 border-primary group-hover:bg-primary transition-colors"></div>
                                        <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors">{exp.title}</h3>
                                        <div className="text-sm text-gray-500 mb-2">{exp.company} • {exp.startDate} - {exp.endDate}</div>
                                        <p className="text-gray-400 leading-relaxed">{exp.description}</p>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* EDUCATION */}
                        <section className="animate-fade-up delay-500">
                            <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-2"><span className="w-8 h-1 bg-primary rounded-full"></span>التعليم</h2>
                            <div className="grid gap-4">
                                {cv.education.map((edu, i) => (
                                    <div key={i} className="bg-white/5 p-6 rounded-2xl border border-white/5 hover:border-white/10 transition-colors">
                                        <h3 className="text-lg font-bold text-white">{edu.degree}</h3>
                                        <div className="text-gray-400">{edu.school}</div>
                                        <div className="text-sm text-primary mt-1">{edu.year}</div>
                                    </div>
                                ))}
                            </div>
                        </section>

                    </div>

                    {/* SIDEBAR */}
                    <div className="space-y-8 animate-fade-in delay-500">

                        {/* ACTIONS */}
                        <div className="bg-gradient-to-br from-indigo-900/50 to-primary/20 p-6 rounded-3xl border border-primary/20 text-center">
                            <h3 className="text-white font-bold mb-4">هل أعجبك ملفي؟</h3>
                            <button
                                onClick={() => generatePdf('web-cv-root', cv.fullName, cv.language)}
                                className="w-full py-3 bg-white text-dark rounded-xl font-bold hover:scale-105 transition-transform flex items-center justify-center gap-2"
                            >
                                <Download size={18} /> تحميل CV
                            </button>
                            <button className="w-full mt-3 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary-dark transition-colors flex items-center justify-center gap-2">
                                <Mail size={18} /> تواصل معي
                            </button>
                        </div>

                        {/* SKILLS */}
                        <div>
                            <h3 className="text-xl font-bold text-white mb-4">المهارات</h3>
                            <div className="flex flex-wrap gap-2">
                                {cv.skills.map((skill, i) => (
                                    <span key={i} className="px-3 py-1.5 bg-white/5 text-gray-300 rounded-lg text-sm border border-white/5 hover:border-primary/50 hover:text-white transition-colors cursor-default">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default WebCV;
