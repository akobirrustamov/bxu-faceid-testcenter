import React, { useEffect, useState } from "react";
import {useNavigate, useParams} from "react-router-dom";
import Sidebar from "./Sidebar";
import ApiCall, {baseUrl} from "../../config";
import html2pdf from 'html2pdf.js';
function GroupDetail() {
    const { groupId } = useParams();
    const navigate = useNavigate()
    const [students, setStudents] = useState([]);
    const [group, setGroup] = useState(null);
    const [loading, setLoading] = useState(false);
    const [exams, setExams] = useState([]);
    const [selectedExam, setSelectedExam] = useState(null);

    useEffect(() => {
        fetchGroup();
        fetchGroupStudents();
        fetchExam();
    }, []);

    const fetchGroup = async () => {
        try {
            const response = await ApiCall(`/api/v1/groups/${groupId}`, "GET", null, null, true);
            setGroup(response.data);
        } catch (error) {
            console.error("Error fetching group:", error);
        }
    };

    const fetchExam = async () => {
        try {
            const response = await ApiCall(`/api/v1/exam/${groupId}`, "GET", null, null, true);
            setExams(response.data);
        } catch (error) {
            console.error("Error fetching exams:", error);
        }
    };

    const fetchGroupStudents = async () => {
        try {
            const response = await ApiCall(`/api/v1/groups/students/${groupId}`, "GET", null, null, true);
            setStudents(response.data);
        } catch (error) {
            console.error("Error fetching students:", error);
        }
    };

    const updateGroupStudents = async () => {
        setLoading(true);
        try {
            const response = await ApiCall(`/api/v1/student/update/${groupId}`, "GET", null, null, true);
            setStudents(response.data);
        } catch (error) {
            console.error("Error updating students:", error);
        } finally {
            setLoading(false);
        }
    };

    const updateGroupExamList = async () => {
        setLoading(true);
        try {
            const response = await ApiCall(`/api/v1/exam/update/${groupId}`, "GET", null, null, true);
            setExams(response.data);
        } catch (error) {
            console.error("Error updating exams:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleExamSelect = (examId) => {
        setSelectedExam(examId === selectedExam ? null : examId);
    };

    const [examLoading, setExamLoading] = useState(false);
    const [examResults, setExamResults] = useState([]); // New state for exam results
    const [showModal, setShowModal] = useState(false); // Modal visibility state


    const openSelectedExam = async () => {
        if (!selectedExam) return;

        // Find the selected exam from the exams list
        const exam = exams.find(e => e.id === selectedExam);

        // // Check if exam exists and if it has ended
        // if (exam && new Date(exam.endTime) < new Date()) {
        //     alert("Imtihon tugagan!");
        //     return;
        // }

        setExamLoading(true);
        try {
            const response = await ApiCall(`/api/v1/exam/start/${selectedExam}`, "GET", null, null, true);
            setExamResults(response.data);
            setShowModal(true);
        } catch (error) {
            console.error("Error updating exams:", error);
            alert("Imtihon natijalarini yuklashda xatolik yuz berdi");
        } finally {
            setExamLoading(false);
        }
    };
    function download(){
        const totalStudents = examResults.length;
        const eligibleStudents = examResults.filter(
            result => result.isAttendance && result.isGrade && result.isContract
        ).length;

        const downloadAsPDF = () => {
            // Sana va vaqtni olish
            const now = new Date();
            const formattedDateTime = now.toLocaleString('uz-UZ', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            });

            // Container yaratish
            const container = document.createElement('div');
            container.style.width = '100%';
            container.style.fontFamily = 'Arial, sans-serif';
            container.style.overflow = 'hidden'; // Oldini olish uchun

            // Sana va vaqt qo'shish
            const dateTimeElement = document.createElement('p');
            dateTimeElement.textContent = `Sana va vaqt: ${formattedDateTime}`;
            dateTimeElement.style.textAlign = 'center';
            dateTimeElement.style.margin = '0 0 10px 0';
            dateTimeElement.style.fontSize = '14px';
            dateTimeElement.style.color = '#555555';
            container.appendChild(dateTimeElement);

            // Sarlavha
            const title = document.createElement('h1');
            title.textContent = `Imtihon natijalari - ${group?.name || ''}`;
            title.style.textAlign = 'center';
            title.style.fontSize = '20px';
            title.style.margin = '0 0 15px 0';
            title.style.fontWeight = '600';
            title.style.color = '#000000';
            container.appendChild(title);

            // Statistik ma'lumotlar

            let im=exams.filter(item=> item.id==selectedExam)[0];
            const fan = document.createElement('p');

            fan.textContent = `Fan: ${im.subjectName} `;
            fan.style.textAlign = 'center';
            fan.style.margin = '0 0 20px 0';
            fan.style.fontSize = '14px';
            fan.style.color = '#333333';
            container.appendChild(fan);
            const stats = document.createElement('p');

            stats.textContent = `Fan: ${im.subjectName}  Guruh talabalari soni: ${totalStudents} ta, ${eligibleStudents} tasi imtihonga qatnashishi mumkin`;
            stats.style.textAlign = 'center';
            stats.style.margin = '0 0 20px 0';
            stats.style.fontSize = '14px';
            stats.style.color = '#333333';
            container.appendChild(stats);

            // Jadval yaratish
            const table = document.createElement('table');
            table.style.width = '100%';
            table.style.fontSize = '12px';
            table.style.borderCollapse = 'collapse';

            // Jadval sarlavhasi
            const thead = document.createElement('thead');
            thead.innerHTML = `
        <tr style="background-color: #f8f9fa;">
            <th style="padding: 8px; border: 1px solid #dee2e6;">#</th>
            <th style="padding: 8px; border: 1px solid #dee2e6;">Talaba</th>
            <th style="padding: 8px; border: 1px solid #dee2e6;">Davomat</th>
            <th style="padding: 8px; border: 1px solid #dee2e6;">Baholar</th>
            <th style="padding: 8px; border: 1px solid #dee2e6;">Kontrakt</th>
            <th style="padding: 8px; border: 1px solid #dee2e6;">Holati</th>
        </tr>
    `;
            table.appendChild(thead);

            // Jadval tanasi
            const tbody = document.createElement('tbody');
            examResults.forEach((result, index) => {
                const row = document.createElement('tr');
                row.style.pageBreakInside = 'avoid';
                row.style.backgroundColor = index % 2 === 0 ? '#ffffff' : '#f8f9fa';

                row.innerHTML = `
            <td style="padding: 8px; border: 1px solid #dee2e6;">${index + 1}</td>
            <td style="padding: 8px; border: 1px solid #dee2e6;">${result.student.fullName}</td>
            <td style="padding: 8px; border: 1px solid #dee2e6;">${result.attendance} <br> 
                <span style="color: ${!result.isAttendance ? '#dc3545' : '#28a745'};">
                    ${!result.isAttendance ? "Qatnashmagan" : "Qatnashgan"}
                </span>
            </td>
            <td style="padding: 8px; border: 1px solid #dee2e6;">${result.grade} <br> 
                <span style="color: ${result.isGrade ? '#28a745' : '#dc3545'};">
                    ${result.isGrade ? "O'tdi" : "O'ta olmadi"}
                </span>
            </td>
            <td style="padding: 8px; border: 1px solid #dee2e6;">${result.contract} <br> 
                <span style="color: ${result.isContract ? '#28a745' : '#dc3545'};">
                    ${result.isContract ? "To'langan" : "To'lanmagan"}
                </span>
            </td>
            <td style="padding: 8px; border: 1px solid #dee2e6;">
                <span style="color: ${result.isAttendance && result.isGrade && result.isContract ? '#28a745' : '#dc3545'};">
                    ${result.isAttendance && result.isGrade && result.isContract ? "Imtihonga kirishi mumkin" : "Imtihonga kira olmaydi"}
                </span>
            </td>
        `;
                tbody.appendChild(row);
            });
            table.appendChild(tbody);
            container.appendChild(table);

            // PDF opsiyalarini o‘rnatish
            const opt = {
                margin: [15, 15, 15, 15],
                filename: `imtihon_natijalari_${group?.name || 'group'}.pdf`,
                image: {
                    type: 'jpeg',
                    quality: 1
                },
                html2canvas: {
                    scale: 2,
                    logging: false,
                    useCORS: true,
                    letterRendering: true,
                    allowTaint: true,
                    scrollX: 0,
                    scrollY: 0,
                    windowWidth: 1200
                },
                jsPDF: {
                    unit: 'mm',
                    format: 'a4',
                    orientation: 'landscape',
                    hotfixes: ['px_scaling'],
                    compress: false
                },
                pagebreak: {
                    mode: ['avoid-all', 'css', 'legacy']
                }
            };

            // PDF yaratish
            html2pdf()
                .set(opt)
                .from(container)
                .save()
                .then(() => {
                    container.remove();
                })
                .catch(error => {
                    console.error('PDF generation error:', error);
                    alert('PDF yaratishda xatolik yuz berdi. Iltimos, qayta urunib ko‘ring.');
                });
        };
        downloadAsPDF()
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[80vh] overflow-auto">
                    <div className="flex justify-between items-center mb-4">
                        <div>
                            <h2 className="text-xl font-bold">Imtihon natijalari</h2>
                            <p className="text-sm text-gray-600">
                                Guruh talabalari soni: {totalStudents} ta, {eligibleStudents} tasi imtihonga qatnashishi mumkin
                            </p>
                        </div>
                        <button
                            onClick={() => setShowModal(false)}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            ✕
                        </button>
                    </div>

                    {/* ... rest of your modal content ... */}

                    <div className="overflow-x-auto">
                        <table className="min-w-full border border-gray-200">
                            <thead>
                            <tr className="bg-gray-100">
                                <th className="p-2 border">#</th>
                                <th className="p-2 border">Talaba</th>
                                <th className="p-2 border">Rasm</th>
                                <th className="p-2 border">Davomat</th>
                                <th className="p-2 border">Baholar</th>
                                <th className="p-2 border">Kontrakt</th>
                                <th className="p-2 border">Holati</th>
                            </tr>
                            </thead>
                            <tbody>
                            {examResults.map((result, index) => (
                                <tr key={result.student.id} className="border hover:bg-gray-50">
                                    <td className="p-2 border">{index + 1}</td>
                                    <td className="p-2 border">{result.student.fullName}</td>
                                    <td className="p-2 border">
                                        <img
                                            src={`${baseUrl}/api/v1/file/getFile/${result.student.image_file?.id}`}
                                            className="w-10 h-10 rounded-full object-cover"
                                            alt="Student"
                                        />
                                    </td>
                                    <td className="p-2 border whitespace-pre-line">
                                        {result.attendance}
                                        <span className={`block mt-1 ${!result.isAttendance ? 'text-red-500' : 'text-green-500'}`}>
                                        {!result.isAttendance ? "Qatnashmagan" : "Qatnashgan"}
                                    </span>
                                    </td>
                                    <td className="p-2 border whitespace-pre-line">
                                        {result.grade}
                                        <span className={`block mt-1 ${result.isGrade ? 'text-green-500' : 'text-red-500'}`}>
                                        {result.isGrade ? "O'tdi" : "O'ta olmadi"}
                                    </span>
                                    </td>
                                    <td className="p-2 border">
                                        <div className="whitespace-pre-line">{result.contract}</div>
                                        <span className={`block mt-1 ${result.isContract ? 'text-green-500' : 'text-red-500'}`}>
                                        {result.isContract ? "To'langan" : "To'lanmagan"}
                                    </span>
                                    </td>
                                    <td className="p-2 border">
                                        {result.isAttendance && result.isGrade && result.isContract ? (
                                            <span className="text-green-500">Imtihonga kirishi mumkin</span>
                                        ) : (
                                            <span className="text-red-500">Imtihonga kira olmaydi</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-4 flex justify-end space-x-4">
                        <button
                            onClick={downloadAsPDF}
                            className="bg-green-600 text-white px-4 py-2 rounded flex items-center"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            PDF yuklab olish
                        </button>
                        <button
                            onClick={() => setShowModal(false)}
                            className="bg-blue-500 text-white px-4 py-2 rounded"
                        >
                            Yopish
                        </button>
                    </div>
                </div>
            </div>
        );

    }

    // Modal component
    // const ResultsModal = () => {
    //     if (!showModal) return null;
    //
    //     // Calculate statistics
    //     const totalStudents = examResults.length;
    //     const eligibleStudents = examResults.filter(
    //         result => result.isAttendance && result.isGrade && result.isContract
    //     ).length;
    //
    //     return (
    //         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    //             <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[80vh] overflow-auto">
    //                 <div className="flex justify-between items-center mb-4">
    //                     <div>
    //                         <h2 className="text-xl font-bold">Imtihon natijalari</h2>
    //                         <p className="text-sm text-gray-600">
    //                             Guruh talabalari soni: {totalStudents} ta, {eligibleStudents} tasi imtihonga qatnashishi mumkin
    //                         </p>
    //                     </div>
    //                     <button
    //                         onClick={() => setShowModal(false)}
    //                         className="text-gray-500 hover:text-gray-700"
    //                     >
    //                         ✕
    //                     </button>
    //                 </div>
    //
    //                 <div className="overflow-x-auto">
    //                     <table className="min-w-full border border-gray-200">
    //                         <thead>
    //                         <tr className="bg-gray-100">
    //                             <th className="p-2 border">#</th>
    //                             <th className="p-2 border">Talaba</th>
    //                             <th className="p-2 border">Rasm</th>
    //                             <th className="p-2 border">Davomat</th>
    //                             <th className="p-2 border">Baholar</th>
    //                             <th className="p-2 border">Kontrakt</th>
    //                             <th className="p-2 border">Holati</th>
    //                         </tr>
    //                         </thead>
    //                         <tbody>
    //                         {examResults.map((result, index) => (
    //                             <tr key={result.student.id} className="border hover:bg-gray-50">
    //                                 <td className="p-2 border">{index + 1}</td>
    //                                 <td className="p-2 border">{result.student.fullName}</td>
    //                                 <td className="p-2 border">
    //                                     <img
    //                                         src={`${baseUrl}/api/v1/file/getFile/${result.student.image_file?.id}`}
    //                                         className="w-10 h-10 rounded-full object-cover"
    //                                         alt="Student"
    //                                     />
    //                                 </td>
    //                                 <td className="p-2 border whitespace-pre-line">
    //                                     {result.attendance}
    //                                     <span className={`block mt-1 ${!result.isAttendance ? 'text-red-500' : 'text-green-500'}`}>
    //                                     {!result.isAttendance ? "Qatnashmagan" : "Qatnashgan"}
    //                                 </span>
    //                                 </td>
    //                                 <td className="p-2 border whitespace-pre-line">
    //                                     {result.grade}
    //                                     <span className={`block mt-1 ${result.isGrade ? 'text-green-500' : 'text-red-500'}`}>
    //                                     {result.isGrade ? "O'tdi" : "O'ta olmadi"}
    //                                 </span>
    //                                 </td>
    //                                 <td className="p-2 border">
    //                                     <div className="whitespace-pre-line">{result.contract}</div>
    //                                     <span className={`block mt-1 ${result.isContract ? 'text-green-500' : 'text-red-500'}`}>
    //                                     {result.isContract ? "To'langan" : "To'lanmagan"}
    //                                 </span>
    //                                 </td>
    //                                 <td className="p-2 border">
    //                                     {result.isAttendance && result.isGrade && result.isContract ? (
    //                                         <span className="text-green-500">Imtihonga kirishi mumkin</span>
    //                                     ) : (
    //                                         <span className="text-red-500">Imtihonga kira olmaydi</span>
    //                                     )}
    //                                 </td>
    //                             </tr>
    //                         ))}
    //                         </tbody>
    //                     </table>
    //                 </div>
    //
    //                 <div className="mt-4 flex justify-end">
    //                     <button
    //                         onClick={() => setShowModal(false)}
    //                         className="bg-blue-500 text-white px-4 py-2 rounded"
    //                     >
    //                         Yopish
    //                     </button>
    //                 </div>
    //             </div>
    //         </div>
    //     );
    // };
    const ResultsModal = () => {
        if (!showModal) return null;

        // Calculate statistics
        const totalStudents = examResults.length;
        const eligibleStudents = examResults.filter(
            result => result.isAttendance && result.isGrade && result.isContract
        ).length;

        const downloadAsPDF = () => {
            // Sana va vaqtni olish
            const now = new Date();
            const formattedDateTime = now.toLocaleString('uz-UZ', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            });

            // Container yaratish
            const container = document.createElement('div');
            container.style.width = '100%';
            container.style.fontFamily = 'Arial, sans-serif';
            container.style.overflow = 'hidden'; // Oldini olish uchun

            // Sana va vaqt qo'shish
            const dateTimeElement = document.createElement('p');
            dateTimeElement.textContent = `Sana va vaqt: ${formattedDateTime}`;
            dateTimeElement.style.textAlign = 'center';
            dateTimeElement.style.margin = '0 0 10px 0';
            dateTimeElement.style.fontSize = '14px';
            dateTimeElement.style.color = '#555555';
            container.appendChild(dateTimeElement);

            // Sarlavha
            const title = document.createElement('h1');
            title.textContent = `Imtihon natijalari - ${group?.name || ''}`;
            title.style.textAlign = 'center';
            title.style.fontSize = '20px';
            title.style.margin = '0 0 15px 0';
            title.style.fontWeight = '600';
            title.style.color = '#000000';
            container.appendChild(title);

            // Statistik ma'lumotlar

            let im=exams.filter(item=> item.id==selectedExam)[0];
            const fan = document.createElement('p');

            fan.textContent = `Fan: ${im.subjectName} `;
            fan.style.textAlign = 'center';
            fan.style.margin = '0 0 20px 0';
            fan.style.fontSize = '14px';
            fan.style.color = '#333333';
            container.appendChild(fan);
            const stats = document.createElement('p');

            stats.textContent = `Fan: ${im.subjectName}  Guruh talabalari soni: ${totalStudents} ta, ${eligibleStudents} tasi imtihonga qatnashishi mumkin`;
            stats.style.textAlign = 'center';
            stats.style.margin = '0 0 20px 0';
            stats.style.fontSize = '14px';
            stats.style.color = '#333333';
            container.appendChild(stats);

            // Jadval yaratish
            const table = document.createElement('table');
            table.style.width = '100%';
            table.style.fontSize = '12px';
            table.style.borderCollapse = 'collapse';

            // Jadval sarlavhasi
            const thead = document.createElement('thead');
            thead.innerHTML = `
        <tr style="background-color: #f8f9fa;">
            <th style="padding: 8px; border: 1px solid #dee2e6;">#</th>
            <th style="padding: 8px; border: 1px solid #dee2e6;">Talaba</th>
            <th style="padding: 8px; border: 1px solid #dee2e6;">Davomat</th>
            <th style="padding: 8px; border: 1px solid #dee2e6;">Baholar</th>
            <th style="padding: 8px; border: 1px solid #dee2e6;">Kontrakt</th>
            <th style="padding: 8px; border: 1px solid #dee2e6;">Holati</th>
        </tr>
    `;
            table.appendChild(thead);

            // Jadval tanasi
            const tbody = document.createElement('tbody');
            examResults.forEach((result, index) => {
                const row = document.createElement('tr');
                row.style.pageBreakInside = 'avoid';
                row.style.backgroundColor = index % 2 === 0 ? '#ffffff' : '#f8f9fa';

                row.innerHTML = `
            <td style="padding: 8px; border: 1px solid #dee2e6;">${index + 1}</td>
            <td style="padding: 8px; border: 1px solid #dee2e6;">${result.student.fullName}</td>
            <td style="padding: 8px; border: 1px solid #dee2e6;">${result.attendance} <br> 
                <span style="color: ${!result.isAttendance ? '#dc3545' : '#28a745'};">
                    ${!result.isAttendance ? "Qatnashmagan" : "Qatnashgan"}
                </span>
            </td>
            <td style="padding: 8px; border: 1px solid #dee2e6;">${result.grade} <br> 
                <span style="color: ${result.isGrade ? '#28a745' : '#dc3545'};">
                    ${result.isGrade ? "O'tdi" : "O'ta olmadi"}
                </span>
            </td>
            <td style="padding: 8px; border: 1px solid #dee2e6;">${result.contract} <br> 
                <span style="color: ${result.isContract ? '#28a745' : '#dc3545'};">
                    ${result.isContract ? "To'langan" : "To'lanmagan"}
                </span>
            </td>
            <td style="padding: 8px; border: 1px solid #dee2e6;">
                <span style="color: ${result.isAttendance && result.isGrade && result.isContract ? '#28a745' : '#dc3545'};">
                    ${result.isAttendance && result.isGrade && result.isContract ? "Imtihonga kirishi mumkin" : "Imtihonga kira olmaydi"}
                </span>
            </td>
        `;
                tbody.appendChild(row);
            });
            table.appendChild(tbody);
            container.appendChild(table);

            // PDF opsiyalarini o‘rnatish
            const opt = {
                margin: [15, 15, 15, 15],
                filename: `imtihon_natijalari_${group?.name || 'group'}.pdf`,
                image: {
                    type: 'jpeg',
                    quality: 1
                },
                html2canvas: {
                    scale: 2,
                    logging: false,
                    useCORS: true,
                    letterRendering: true,
                    allowTaint: true,
                    scrollX: 0,
                    scrollY: 0,
                    windowWidth: 1200
                },
                jsPDF: {
                    unit: 'mm',
                    format: 'a4',
                    orientation: 'landscape',
                    hotfixes: ['px_scaling'],
                    compress: false
                },
                pagebreak: {
                    mode: ['avoid-all', 'css', 'legacy']
                }
            };

            // PDF yaratish
            html2pdf()
                .set(opt)
                .from(container)
                .save()
                .then(() => {
                    container.remove();
                })
                .catch(error => {
                    console.error('PDF generation error:', error);
                    alert('PDF yaratishda xatolik yuz berdi. Iltimos, qayta urunib ko‘ring.');
                });
        };

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[80vh] overflow-auto">
                    <div className="flex justify-between items-center mb-4">
                        <div>
                            <h2 className="text-xl font-bold">Imtihon natijalari</h2>
                            <p className="text-sm text-gray-600">
                                Guruh talabalari soni: {totalStudents} ta, {eligibleStudents} tasi imtihonga qatnashishi mumkin
                            </p>
                        </div>
                        <button
                            onClick={() => setShowModal(false)}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            ✕
                        </button>
                    </div>

                    {/* ... rest of your modal content ... */}

                    <div className="overflow-x-auto">
                        <table className="min-w-full border border-gray-200">
                            <thead>
                            <tr className="bg-gray-100">
                                <th className="p-2 border">#</th>
                                <th className="p-2 border">Talaba</th>
                                <th className="p-2 border">Rasm</th>
                                <th className="p-2 border">Davomat</th>
                                <th className="p-2 border">Baholar</th>
                                <th className="p-2 border">Kontrakt</th>
                                <th className="p-2 border">Holati</th>
                            </tr>
                            </thead>
                            <tbody>
                            {examResults.map((result, index) => (
                                <tr key={result.student.id} className="border hover:bg-gray-50">
                                    <td className="p-2 border">{index + 1}</td>
                                    <td className="p-2 border">{result.student.fullName}</td>
                                    <td className="p-2 border">
                                        <img
                                            src={`${baseUrl}/api/v1/file/getFile/${result.student.image_file?.id}`}
                                            className="w-10 h-10 rounded-full object-cover"
                                            alt="Student"
                                        />
                                    </td>
                                    <td className="p-2 border whitespace-pre-line">
                                        {result.attendance}
                                        <span className={`block mt-1 ${!result.isAttendance ? 'text-red-500' : 'text-green-500'}`}>
                                        {!result.isAttendance ? "Qatnashmagan" : "Qatnashgan"}
                                    </span>
                                    </td>
                                    <td className="p-2 border whitespace-pre-line">
                                        {result.grade}
                                        <span className={`block mt-1 ${result.isGrade ? 'text-green-500' : 'text-red-500'}`}>
                                        {result.isGrade ? "O'tdi" : "O'ta olmadi"}
                                    </span>
                                    </td>
                                    <td className="p-2 border">
                                        <div className="whitespace-pre-line">{result.contract}</div>
                                        <span className={`block mt-1 ${result.isContract ? 'text-green-500' : 'text-red-500'}`}>
                                        {result.isContract ? "To'langan" : "To'lanmagan"}
                                    </span>
                                    </td>
                                    <td className="p-2 border">
                                        {result.isAttendance && result.isGrade && result.isContract ? (
                                            <span className="text-green-500">Imtihonga kirishi mumkin</span>
                                        ) : (
                                            <span className="text-red-500">Imtihonga kira olmaydi</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-4 flex justify-end space-x-4">
                        <button
                            onClick={downloadAsPDF}
                            className="bg-green-600 text-white px-4 py-2 rounded flex items-center"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            PDF yuklab olish
                        </button>
                        <button
                            onClick={() => setShowModal(false)}
                            className="bg-blue-500 text-white px-4 py-2 rounded"
                        >
                            Yopish
                        </button>
                    </div>
                </div>
            </div>
        );
    };
    return (
        <div className={" "}>
            <Sidebar />
            <div className="p-10 pb-1 sm:ml-64 ">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-semibold">Group Detail</h1>
                    <div>
                        <button
                            onClick={updateGroupStudents}
                            className="bg-blue-600 rounded-xl text-white px-4 py-2 mx-1 disabled:opacity-50"
                            disabled={loading}
                        >
                            {loading ? "Yuklanmoqda..." : "Talabalar ro'yxatini yangilash"}
                        </button>
                        <button
                            onClick={updateGroupExamList}
                            className="bg-blue-500 rounded-xl mx-1 text-white px-4 py-2 disabled:opacity-50"
                            disabled={loading}
                        >
                            {loading ? "Yuklanmoqda..." : "Imtihonlar ro'yxatini yangilash"}
                        </button>
                    </div>
                </div>
                <p className="mb-4 font-semibold">Group: {group?.name}</p>

                <div className="grid grid-cols-2 gap-6">
                    {/* Talabalar jadvali (2/3) */}
                    <div className="col-span-1">
                        <div className="overflow-x-auto">
                            <table className="min-w-full border border-gray-200 shadow-md rounded-lg">
                                <thead>
                                <tr className="bg-gray-100 text-left">
                                    <th className="p-2 border">#</th>
                                    <th className="p-2 border">Rasm</th>
                                    <th className="p-2 border">To'liq Ism</th>
                                </tr>
                                </thead>
                                <tbody>
                                {students.length > 0 ? (
                                    students.map((student, index) => (
                                        <tr  onClick={()=>navigate("/admin/student/"+student.id)} key={student.id} className="border hover:bg-gray-100">
                                            <td className="p-1 border">{index + 1}</td>
                                            <td className="p-1 border">
                                                <img
                                                    src={`${baseUrl}/api/v1/file/getFile/${student?.image_file?.id}`}
                                                    className="w-12 h-12 rounded-full object-cover mb-4"
                                                />
                                            </td>
                                            <td className="p-1 border">{student.fullName}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="3" className="text-center p-3 text-gray-500">
                                            Talabalar topilmadi
                                        </td>
                                    </tr>
                                )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Imtihonlar jadvali (1/3) */}
                    <div className={" justify-center"}>
                        <div className="overflow-x-auto">
                            <table className="min-w-full border border-gray-200 shadow-md rounded-lg">
                                <thead>
                                <tr className="bg-gray-100 text-left">
                                    <th className="text-[14px] p-1 border">Tanlash</th>
                                    <th className="text-[14px] p-1 border">#</th>
                                    <th className="text-[14px] p-1 border">Imtihon nomi</th>
                                    <th className="text-[14px] p-1 border">O'qituvchi</th>
                                    <th className="text-[14px] p-1 border">Boshlanish</th>
                                    <th className="text-[14px] p-1 border">Tugash</th>
                                </tr>
                                </thead>
                                <tbody>
                                {exams.length > 0 ? (
                                    exams.map((exam, index) => (
                                        <tr key={exam.id} className="border hover:bg-gray-100">
                                            <td className="text-center border">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedExam === exam.id}
                                                    onChange={() => handleExamSelect(exam.id)}
                                                    className="cursor-pointer"
                                                />
                                            </td>
                                            <td className="text-[13px] border">{index + 1}</td>
                                            <td className="border text-[13px]">{exam.subjectName}</td>
                                            <td className="border text-[13px]">{exam.employeeName}</td>
                                            <td className="border text-[13px]">
                                                {new Date(exam.startTime).toLocaleDateString("ru-RU")}{" "}
                                                {new Date(exam.startTime).toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" })}
                                            </td>
                                            <td className="border text-[13px]">
                                                {new Date(exam.endTime).toLocaleDateString("ru-RU")}{" "}
                                                {new Date(exam.endTime).toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" })}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="text-center p-3 text-gray-500">
                                            Imtihonlar topilmadi
                                        </td>
                                    </tr>
                                )}
                                </tbody>
                            </table>
                        </div>
                        <button
                            onClick={openSelectedExam}
                            className="mt-4 bg-green-600 text-white py-2 rounded-xl disabled:opacity-50 px-4"
                            disabled={!selectedExam || examLoading} // Disable when no exam selected or loading
                        >
                            {examLoading ? "Yuklanmoqda..." : "Imtihonni ochish"}
                        </button>
                        {/*<button*/}
                        {/*    onClick={openSelectedExam}*/}
                        {/*    className="mt-4 bg-green-600 text-white  py-2 rounded-xl  disabled:opacity-50 px-4  "*/}
                        {/*    disabled={!selectedExam}*/}
                        {/*>*/}
                        {/*    Imtihonni ochish*/}
                        {/*</button>*/}
                    </div>
                </div>
            </div>
            <ResultsModal />
        </div>
    );
}

export default GroupDetail;
