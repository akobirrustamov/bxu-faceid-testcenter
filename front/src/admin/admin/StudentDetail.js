import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "./Sidebar";
import ApiCall, { baseUrl } from "../../config";

function StudentDetail() {
    const { studentId } = useParams();

    const [student, setStudent] = useState({});
    const [loading, setLoading] = useState(false);
    const [exams, setExams] = useState([]);
    const [selectedExam, setSelectedExam] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [examDetails, setExamDetails] = useState([]); // State to hold additional exam details

    useEffect(() => {
        fetchStudent();
    }, []);

    const fetchStudent = async () => {
        try {
            const response = await ApiCall(`/api/v1/student/${studentId}`, "GET", null, null, true);
            setStudent(response.data);
            await fetchExam(response.data?.group?.id); // Fetch exams after student data is loaded
        } catch (error) {
            console.error("Error fetching student:", error);
        }
    };

    const fetchExam = async (groupId) => {
        try {
            const response = await ApiCall(`/api/v1/exam/${groupId}`, "GET", null, null, true);
            setExams(response.data);
            response.data.map(exam=>{
                handleExamSelect(exam.id)
            })
        } catch (error) {
            console.error("Error fetching exams:", error);
        }
    };

    const handleExamSelect = async (examId) => {
        setSelectedExam(examId === selectedExam ? null : examId);

        if (examId !== selectedExam) {
            try {
                // Fetch additional details for the selected exam
                const response = await ApiCall(`/api/v1/exam/student-status/${examId}/${studentId}`, "GET", null, null, true);
                setExamDetails((prevDetails) => ({
                    ...prevDetails,
                    [examId]: response.data, // Store details for the selected exam
                }));
            } catch (error) {
                console.error("Error fetching exam details:", error);
            }
        }
    };

    const openSelectedExam = async () => {
        if (selectedExam) {
            try {
                const response = await ApiCall(`/api/v1/exam/start/${selectedExam}`, "GET", null, null, true);
            } catch (error) {
                console.error("Error updating exams:", error);
            } finally {
                setLoading(false);
            }
        }
    };

    const uploadImage = async (image, prefix) => {
        const formData = new FormData();
        formData.append('photo', image);
        formData.append('prefix', prefix);

        try {
            const response = await ApiCall('/api/v1/file/upload', 'POST', formData, null, true);
            return response.data; // Return the UUID of the uploaded image
        } catch (error) {
            console.error("Error uploading image:", error);
            throw error;
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type === "image/jpeg") {
            setImageFile(file); // Set the selected image file
        } else {
            // alert("Faqat .jpg formatidagi rasm yuklanishi mumkin.");
        }
    };

    const handleChangeStudentImage = async () => {
        if (imageFile) {
            try {
                const prefix = "/" + student.group?.name || "student"; // Use group name as prefix or fallback to "student"
                const mainPhotoUuid = await uploadImage(imageFile, prefix);

                // Update student's image in the backend
                const response = await ApiCall(`/api/v1/student/${studentId}/${mainPhotoUuid}`, "POST", null, null, true);
                setStudent(response.data); // Update student state with new image
                setImageFile(null); // Reset the image file state
            } catch (error) {
                console.error("Error updating student image:", error);
            }
        }
    };

    return (
        <div className="bg-gray-200 min-h-screen">
            <Sidebar />
            <div className="p-24 pt-10 sm:ml-64">
                <div className="flex flex-col items-center justify-center mb-8">
                    <div className="flex flex-col items-center relative">
                        <img
                            src={`${baseUrl}/api/v1/file/getFile/${student?.image_file?.id}`}
                            className="w-32 h-32 rounded-full object-cover mb-4"
                        />
                        <label
                            htmlFor="image-upload"
                            className="absolute bottom-15 right-20 bg-blue-500 text-white p-2 rounded-full cursor-pointer hover:bg-blue-600"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                                />
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                            </svg>
                        </label>
                        <input
                            id="image-upload"
                            type="file"
                            accept=".jpg"
                            className="hidden"
                            onChange={handleImageChange}
                        />
                        <p className="text-lg font-semibold">Talaba: {student?.fullName}</p>
                        {imageFile && (
                            <button
                                onClick={handleChangeStudentImage}
                                className="mt-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                            >
                                Rasmni yangilash
                            </button>
                        )}
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Talaba ma'lumotlari</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <p><span className="font-semibold">To'liq ismi:</span> {student.fullName}</p>
                            <p><span className="font-semibold">Talaba ID raqami:</span> {student.studentIdNumber}</p>
                            <p><span className="font-semibold">Kurs:</span> {student.level}</p>
                            <p><span className="font-semibold">Semestr:</span> {student.semesterName}</p>
                        </div>
                        <div className="space-y-2">
                            <p><span className="font-semibold">Ta'lim turi:</span> {student.educationalType}</p>
                            <p><span className="font-semibold">Guruh nomi:</span> {student.group?.name}</p>
                            <p><span className="font-semibold">Bo'lim nomi:</span> {student.group?.departmentName}</p>
                            <p><span className="font-semibold">Mutaxassislik nomi:</span> {student.group?.specialtyName}</p>
                        </div>
                    </div>
                </div>

                <div className="flex justify-center pt-8">
                    <div className="w-full max-w-4xl">
                        <div className="overflow-x-auto">
                            <p className="text-lg font-semibold">Imtihonlar jadvali:</p>
                            <table className="min-w-full border border-gray-500 shadow-md rounded-lg">
                                <thead>
                                <tr className="bg-white text-left">
                                    <th className="text-[14px] p-1 border">#</th>
                                    <th className="text-[14px] p-1 border">Imtihon nomi</th>
                                    <th className="text-[14px] p-1 border">O'qituvchi</th>
                                    <th className="text-[14px] p-1 border">Boshlanish</th>
                                    <th className="text-[14px] p-1 border">Tugash</th>
                                    <th className="text-[14px] p-1 border">Davomat</th>
                                    <th className="text-[14px] p-1 border">Kontrakt</th>
                                    <th className="text-[14px] p-1 border">Baholari</th>
                                </tr>
                                </thead>
                                <tbody>
                                {exams.length > 0 ? (
                                    exams.map((exam, index) => (
                                        <tr key={exam.id} className="bg-white border hover:bg-gray-100 p-1">

                                            <td className="text-[13px] border p-1">{index + 1}</td>
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
                                            <td
                                                className={
                                                    "bg-white border hover:bg-gray-100 text-[12px] " +
                                                    (examDetails[exam.id]?.isAttendance ? "" : "bg-red-300")
                                                }
                                            >
                                                {examDetails[exam.id]?.attendance || "Ma'lumot yo'q"}
                                            </td>
                                            <td
                                                className={
                                                    "bg-white border hover:bg-gray-100 text-[12px] " +
                                                    (examDetails[exam.id]?.isContract ? "" : "bg-red-300")
                                                }
                                            >
                                                {examDetails[exam.id]?.contract || "Ma'lumot yo'q"}
                                            </td>
                                            <td
                                                className={
                                                    "bg-white border hover:bg-gray-100 text-[12px] " +
                                                    (examDetails[exam.id]?.isGrade ? "bg-red-300" : "")
                                                }
                                            >
                                                {examDetails[exam.id]?.grade || "Ma'lumot yo'q"}
                                            </td>

                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="8" className="text-center p-3 text-gray-500">
                                            Imtihonlar topilmadi
                                        </td>
                                    </tr>
                                )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default StudentDetail;