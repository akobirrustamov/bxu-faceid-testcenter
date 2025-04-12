import React, { useEffect, useState } from "react";
import ApiCall from "../../config";
import Sidebar from "./Sidebar";
import {useNavigate} from "react-router-dom";

function Groups() {
    const navigate = useNavigate()
    const [allGroups, setAllGroups] = useState([]);
    const [groups, setGroups] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState(
        localStorage.getItem("selectedDepartment") || ""
    );
    const [search, setSearch] = useState("");

    useEffect(() => {
        fetchGroups();
    }, []);

    const fetchGroups = async () => {
        try {
            const response = await ApiCall("/api/v1/groups", "GET", null, null, true);
            setAllGroups(response.data);

            const uniqueDepartments = [...new Set(response.data.map(group => group.departmentName))];
            setDepartments(uniqueDepartments);

            if (!selectedDepartment || !uniqueDepartments.includes(selectedDepartment)) {
                setSelectedDepartment(uniqueDepartments[0]);
                localStorage.setItem("selectedDepartment", uniqueDepartments[0]);
                filterByDepartment(uniqueDepartments[0], response.data);
            } else {
                filterByDepartment(selectedDepartment, response.data);
            }
        } catch (error) {
            console.error("Error fetching groups:", error);
            setAllGroups([]);
            setGroups([]);
            setDepartments([]);
        }
    };

    const filterByDepartment = (departmentName, data = allGroups) => {
        const filtered = data.filter(group => group.departmentName === departmentName);
        setGroups(filtered);
        setSelectedDepartment(departmentName);
        localStorage.setItem("selectedDepartment", departmentName);
    };

    const filteredGroups = groups.filter(group =>
        group.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div>
            <Sidebar />
            <div className="p-10 pb-1 sm:ml-64">
                <h1 className="text-2xl font-bold mb-4">Guruhlar</h1>

                {/* Bo‘lim tugmalari */}
                <div className="flex gap-2 mb-4">
                    {departments.map(dept => (
                        <button
                            key={dept}
                            onClick={() => filterByDepartment(dept)}
                            className={`px-4 py-2 rounded ${
                                selectedDepartment === dept ? "bg-blue-600 text-white" : "bg-gray-300"
                            }`}
                        >
                            {dept}
                        </button>
                    ))}
                </div>

                {/* Qidirish input */}
                <input
                    type="text"
                    placeholder="Guruh nomini qidiring..."
                    className="w-full mb-4 p-2 border border-gray-300 rounded"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />

                {/* Guruhlar kartalari */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-4">
                    {filteredGroups?.length === 0 ? (
                        <p className="text-gray-500 col-span-5">Bu bo‘limda hech qanday guruh topilmadi.</p>
                    ) : (
                        filteredGroups?.map(group => (
                            <div key={group.id}
                                 onClick={()=>navigate("/admin/group/"+group.id)}
                                 className="  shadow-md rounded-lg p-1 pb-0 flex flex-col items-center hover:bg-blue-600 hover:text-white">
                                <svg
                                    className="w-10 h-10  mb-1 hover:text-white"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M14.6144 7.19994c.3479.48981.5999 1.15357.5999 1.80006 0 1.6569-1.3432 3-3 3-1.6569 0-3.00004-1.3431-3.00004-3 0-.67539.22319-1.29865.59983-1.80006M6.21426 6v4m0-4 6.00004-3 6 3-6 2-2.40021-.80006M6.21426 6l3.59983 1.19994M6.21426 19.8013v-2.1525c0-1.6825 1.27251-3.3075 2.95093-3.6488l3.04911 2.9345 3-2.9441c1.7026.3193 3 1.9596 3 3.6584v2.1525c0 .6312-.5373 1.1429-1.2 1.1429H7.41426c-.66274 0-1.2-.5117-1.2-1.1429Z"
                                    />
                                </svg>
                                <p className="text-lg font-semibold">{group.name}</p>
                                <p className="text-[10px]">{group.specialtyName}</p>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

export default Groups;
