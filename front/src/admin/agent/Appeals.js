import React, { useEffect, useState } from 'react';
import Sidebar from "./Sidebar";
import ApiCall from "../../config";
import 'react-responsive-modal/styles.css';
import {useNavigate} from "react-router-dom";

function Appeals() {
    const [appeals, setAppeals] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchAgent()
    }, []);

    const fetchAgent = async ()=>{
        const token = localStorage.getItem("access_token");
        try {
            const response = await ApiCall('/api/v1/agent/appeals/'+token, 'GET', null, null, true);
            setAppeals(response.data);
        } catch (error) {
            console.error("Error fetching news:", error);
        }
    }


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
                            <th className="border border-gray-300 px-4 py-2">N%</th>
                            <th className="border border-gray-300 px-4 py-2">First Name</th>
                            <th className="border border-gray-300 px-4 py-2">Last Name</th>
                            <th className="border border-gray-300 px-4 py-2">Father Name</th>
                            <th className="border border-gray-300 px-4 py-2">Phone</th>
                            <th className="border border-gray-300 px-4 py-2">Appeal Type</th>
                            <th className="border border-gray-300 px-4 py-2">Education Field</th>
                            <th className="border border-gray-300 px-4 py-2">Agent</th>
                            <th className="border border-gray-300 px-4 py-2">Status</th>
                        </tr>
                        </thead>
                        <tbody>
                        {appeals.map((appeal, index) => (
                            <tr key={index}>
                                <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
                                <td className="border border-gray-300 px-4 py-2">{appeal.firstName}</td>
                                <td className="border border-gray-300 px-4 py-2">{appeal.lastName}</td>
                                <td className="border border-gray-300 px-4 py-2">{appeal.fatherName}</td>
                                <td className="border border-gray-300 px-4 py-2">{appeal.phone}</td>
                                <td className="border border-gray-300 px-4 py-2">{appeal.appealType?.name || ""}</td>
                                <td className="border border-gray-300 px-4 py-2">{appeal.educationField?.name || ""}</td>
                                <td className="border border-gray-300 px-4 py-2">{appeal.agent?.name || ""}</td>
                                <td className="border border-gray-300 px-4 py-2">{appeal.status}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default Appeals;
