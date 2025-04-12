import React, { useState, useEffect } from "react";
import ApiCall from "../../config/index";
import Sidebar from "./Sidebar";
import Rodal from "rodal";
import "rodal/lib/rodal.css";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const HemisToken = () => {
    const [ranks, setRanks] = useState([]);
    const [filteredRanks, setFilteredRanks] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [formData, setFormData] = useState({ name: "" });
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [toolNameFilter, setToolNameFilter] = useState("");
    const [timeAddedFilter, setTimeAddedFilter] = useState("");

    useEffect(() => {
        fetchRanks();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [ranks, toolNameFilter, timeAddedFilter]);

    const fetchRanks = async () => {
        try {
            const response = await ApiCall("/api/v1/token/hemis", "GET", null, null, true);
            setRanks(response.data);
        } catch (error) {
            console.error("Error fetching ranks:", error);
            setRanks([]);
            toast.error("Tokenlarni yuklashda xatolik yuz berdi");
        }
    };

    const applyFilters = () => {
        let filtered = ranks;

        if (toolNameFilter) {
            filtered = filtered.filter((rank) =>
                rank.name.toLowerCase().includes(toolNameFilter.toLowerCase())
            );
        }

        if (timeAddedFilter) {
            filtered = filtered.filter((rank) =>
                new Date(rank.createdAt).toLocaleDateString().includes(timeAddedFilter)
            );
        }

        setFilteredRanks(filtered);
    };

    const handleOpenModal = (rank = null) => {
        setModalVisible(true);
        if (rank) {
            setIsEditing(true);
            setEditingId(rank.id);
            setFormData({ name: rank.name });
        } else {
            setIsEditing(false);
            setFormData({ name: "" });
        }
    };

    const handleCloseModal = () => {
        setModalVisible(false);
        setIsEditing(false);
        setEditingId(null);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async () => {
        if (isEditing) {
            console.log("no edit");
            toast.warning("Tahrirlash funksiyasi hozircha mavjud emas");
        } else {
            try {
                const response = await ApiCall("/api/v1/token/hemis", "POST", formData, null, true);
                fetchRanks();
                handleCloseModal();
                toast.success("Token muvaffaqiyatli qo'shildi");
            } catch (error) {
                console.error("Error creating rank:", error);
                toast.error("Token qo'shishda xatolik yuz berdi");
            }
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Rostdan ham tokenni o'chirmoqchimisiz?")) {
            try {
                await ApiCall(`/api/v1/token/hemis/${id}`, "DELETE", null, null, true);
                fetchRanks();
                toast.success("Token muvaffaqiyatli o'chirildi");
            } catch (error) {
                console.error("Error deleting rank:", error);
                toast.error("Tokenni o'chirishda xatolik yuz berdi");
            }
        }
    };

    return (
        <div>
            <Sidebar />
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
            <div className=" ">
                <div className={"p-10 pb-1 sm:ml-64 flex flex-wrap items-center aling-center justify-between"}>
                    <h2 className="text-2xl font-bold text-gray-800 md:text-3xl xl:text-4xl">
                        Token
                    </h2>
                    <button
                        onClick={() => handleOpenModal()}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Token qo'shish
                    </button>
                </div>

                <div className="p-10 pt-10 sm:ml-64">
                    <table className="min-w-full table-auto border-collapse border border-gray-300">
                        <thead>
                        <tr className="bg-gray-200">
                            <th className="border border-gray-300 px-4 py-2">№</th>
                            <th className="border border-gray-300 px-4 py-2">Token</th>
                            <th className="border border-gray-300 px-4 py-2">Yaratilgan vaqti</th>
                            <th className="border border-gray-300 px-4 py-2"></th>
                        </tr>
                        </thead>
                        <tbody>
                        {filteredRanks.length > 0 ? (
                            filteredRanks.map((rank, index) => (
                                <tr key={rank.id} className="hover:bg-gray-100">
                                    <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
                                    <td className="border border-gray-300 px-4 py-2">{rank.name}</td>
                                    <td className="border border-gray-300 px-4 py-2">
                                        {new Date(rank.createdAt).toLocaleString()}
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2">
                                        <button
                                            onClick={() => handleDelete(rank.id)}
                                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded"
                                        >
                                            O'chirish
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="border border-gray-300 px-4 py-2 text-center">
                                    Tokenlar mavjud emas
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal for Add/Edit */}
            <Rodal visible={modalVisible} onClose={handleCloseModal} height={300}>
                <div>
                    <h2 className="text-lg font-bold mb-4">{isEditing ? "Tahrirlash" : "Token qo'shish"}</h2>
                    <form>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">Token</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            />
                        </div>

                        <button
                            type="button"
                            onClick={handleSubmit}
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        >
                            {isEditing ? "Yangilash" : "Saqlash"}
                        </button>
                    </form>
                </div>
            </Rodal>
        </div>
    );
};

export default HemisToken;