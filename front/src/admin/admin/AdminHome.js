import React, { useState, useEffect } from 'react';
import ApiCall from "../../config";
import Sidebar from "./Sidebar";
import 'rodal/lib/rodal.css';
import { Link, useNavigate } from "react-router-dom";

const AdminHome = () => {
    const [messages, setMessages] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
    }, []);
    const fetchMessages = async () => {
        try {
            const response = await ApiCall('/api/v1/message', 'GET', null, null, true);
            setMessages(response.data);
            console.log(response.data)
        } catch (error) {
            setMessages([]);
            console.error("Error fetching news:", error);
        }
    };


    return (
        <div>
            <Sidebar />
            <div className="p-10 sm:ml-64">
              <h1>Bosh sahifa</h1>
            </div>
        </div>
    );
};

export default AdminHome;
