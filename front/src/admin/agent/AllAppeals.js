import React, { useEffect, useState } from 'react';
import Sidebar from "./Sidebar";
import ApiCall from "../../config";
import 'react-responsive-modal/styles.css';
import { Modal } from 'react-responsive-modal';

function Appeals() {
    const [appeals, setAppeals] = useState([]);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editData, setEditData] = useState({
        passportPin: "",
        passportNumber: "",
        firstName: "",
        lastName: "",
        fatherName: "",
    });

    useEffect(() => {
        fetchAbuturient();
    }, []);

    const fetchAbuturient = async () => {
        try {
            const response = await ApiCall(`/api/v1/admin/appeals`, 'GET', null, null, true);
            setAppeals(response.data);
        } catch (error) {
            console.error("Error fetching appeals:", error);
        }
    };

    const handleEditClick = (appeal) => {
        setEditData({
            id: appeal.id,
            passportPin: appeal.passportPin || "",
            passportNumber: appeal.passportNumber || "",
            firstName: appeal.firstName || "",
            lastName: appeal.lastName || "",
            fatherName: appeal.fatherName || "",
        });
        setEditModalOpen(true);
    };




    const handleInputChange = (e) => {
        const { name, value } = e.target;

        // Passport Pin validation (14 numeric characters)
        if (name === "passportPin") {
            const numericValue = value.replace(/\D/g, ""); // Remove non-numeric characters
            if (numericValue.length <= 14) {
                setEditData((prev) => ({ ...prev, [name]: numericValue }));
            }
            return;
        }

        // Passport Number validation (2 capital letters + 9 numbers)
        if (name === "passportNumber") {
            const formattedValue = value.toUpperCase(); // Convert to uppercase
            const letters = formattedValue.slice(0, 2).replace(/[^A-Z]/g, ""); // First 2 capital letters
            const numbers = formattedValue.slice(2).replace(/\D/g, ""); // Remaining numeric characters
            const passportNumber = `${letters}${numbers.slice(0, 7)}`; // Combine letters and up to 9 numbers
            setEditData((prev) => ({ ...prev, [name]: passportNumber }));
            return;
        }

        // General case for other fields
        setEditData((prev) => ({ ...prev, [name]: value }));
    };
    const validateInputs = () => {
        if (
            editData.passportPin.length !== 14 ||
            !/^[A-Z]{2}\d{7}$/.test(editData.passportNumber) || // 2 capital letters + 9 digits
            !editData.firstName.trim() ||
            !editData.lastName.trim() ||
            !editData.fatherName.trim()
        ) {
            alert("Please ensure all fields are filled out correctly.");
            return false;
        }
        return true;
    };

    const handleEditSubmit = async () => {
        if (!validateInputs()) return;

        try {
            // Make an API call to update the appeal
            await ApiCall(`/api/v1/admin/appeals/${editData.id}`, 'PUT', editData, null, true);
            setEditModalOpen(false);
            fetchAbuturient(); // Refresh the appeals list
        } catch (error) {
            console.error("Error updating appeal:", error);
        }
    };


    return (
        <div>
            <Sidebar />
            <div className="p-10 sm:ml-64">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-3xl md:text-4xl xl:text-5xl">Kelib tushgan arizalar</h2>
                </div>

                <div className="mt-4">
                    <table className="min-w-full table-auto border-collapse border border-gray-300">
                        <thead>
                        <tr className="bg-gray-200">
                            <th className="border border-gray-300 px-2 py-2">N%</th>
                            <th className="border border-gray-300 px-2 py-2">FIO</th>
                            <th className="border border-gray-300 px-1 py-2">Passport</th>
                            <th className="border border-gray-300 px-1 py-2">Phone</th>
                            <th className="border border-gray-300 px-1 py-2">Appeal Type</th>
                            <th className="border border-gray-300 px-1 py-2">Education Field</th>
                            <th className="border border-gray-300 px-1 py-2">Agent</th>
                            <th className="border border-gray-300 px-1 py-2">sana</th>
                            <th className="border border-gray-300 px-1 py-2">Status</th>
                            <th className="border border-gray-300 px-1 py-2"></th>
                        </tr>
                        </thead>
                        <tbody>
                        {appeals.map((appeal, index) => (
                            <tr key={index}>
                                <td className="border border-gray-300 px-1 py-1">{index + 1}</td>
                                <td className="border border-gray-300 px-1 py-1 text-[12px]">{appeal.lastName} {appeal.firstName} {appeal.fatherName}</td>
                                <td className="border border-gray-300 px-1 py-1 text-[12px]">{appeal.passportPin}, {appeal.passportNumber}</td>
                                <td className="border border-gray-300 px-1 py-1 text-[12px]">{appeal.phone}</td>
                                <td className="border border-gray-300 px-1 py-1 text-[12px]">{appeal.appealType?.name || ""}</td>
                                <td className="border border-gray-300 px-1 py-1 text-[12px]">{appeal.educationField?.name || ""}</td>
                                <td className="border border-gray-300 px-1 py-1 text-[12px]">{appeal.agent?.name || ""}</td>
                                <td className="border border-gray-300 px-1 py-1 text-[12px]">
                                    {new Date(appeal.createdAt).toLocaleString('en-GB', {
                                        day: '2-digit',
                                        month: '2-digit',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        hour12: false,
                                    })}
                                </td>
                                <td className="border border-gray-300 px-1 py-1 text-[12px]">{appeal.status}</td>
                                <td className="border border-gray-300 px-1 py-1 text-[12px]">
                                    <button
                                        className="p-1 bg-blue-600 rounded text-white"
                                        onClick={() => handleEditClick(appeal)}
                                    >
                                        Edit
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>


                <Modal
                open={editModalOpen} onClose={() => setEditModalOpen(false)} animationDuration={700} center>
                    <h2>Tahrirlash</h2>
                    <div className="flex flex-col  "
                         style={{
                             width: "500px",
                             height: "400px",
                         }}
                    >
                        <label className={"text-gray-500"}>Ism</label>
                        <input
                            type="text"
                            name="firstName"
                            placeholder="First Name"
                            value={editData.firstName}
                            onChange={handleInputChange}
                            className="border border-gray-300 rounded p-1"
                        />
                        <label className={"text-gray-500 mt-1 "}>Familya</label>

                        <input
                            type="text"
                            name="lastName"
                            placeholder="Last Name"
                            value={editData.lastName}
                            onChange={handleInputChange}
                            className="border border-gray-300 rounded p-2"
                        />
                        <label className={"text-gray-500 mt-1 "}>Sharif</label>

                        <input
                            type="text"
                            name="fatherName"
                            placeholder="Father Name"
                            value={editData.fatherName}
                            onChange={handleInputChange}
                            className="border border-gray-300 rounded p-2"
                        />

                        <label className={"text-gray-500 mt-1 "}>JSHR</label>

                        <input
                            type="text"
                            name="passportPin"
                            placeholder="Passport Pin (14 digits)"
                            value={editData.passportPin}
                            onChange={handleInputChange}
                            className="border border-gray-300 rounded p-2"
                            required
                        />

                        <label className={"text-gray-500 mt-1 "}>Passport raqami</label>

                        <input
                            type="text"
                            name="passportNumber"
                            placeholder="Passport Number (e.g., AB123456789)"
                            value={editData.passportNumber}
                            onChange={handleInputChange}
                            className="border border-gray-300 rounded p-2"
                            required
                        />

                        <button
                            className="p-2 bg-green-600 text-white rounded my-2"
                            onClick={handleEditSubmit}
                        >
                            Save
                        </button>
                    </div>
                </Modal>
            </div>
        </div>
    );
}

export default Appeals;
