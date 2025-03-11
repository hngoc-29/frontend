"use client"
import React, { useState, useContext, useEffect } from 'react';
import { loadingContext } from '../context/Loading';
import { useToast } from '../context/Toast';

const StartServer = () => {
    const [serverStatus, setServerStatus] = useState('stopped');
    const { setLoading } = useContext(loadingContext);
    const { addToast } = useToast();

    useEffect(() => {
        const handleStartServer = async () => {
            if (serverStatus === 'stopped') {
                setLoading(true);
                try {
                    const response = await fetch('/api/start-server', { method: 'POST' });
                    if (response.ok) {
                        setServerStatus('running');
                        console.log('Máy chủ đã khởi động');
                    } else {
                        addToast({ type: 'error', title: 'Lỗi', description: 'Không thể khởi động máy chủ' });
                        console.error('Không thể khởi động máy chủ');
                    }
                } catch (error) {
                    addToast({ type: 'error', title: 'Lỗi', description: 'Lỗi khi khởi động máy chủ' });
                    console.error('Lỗi khi khởi động máy chủ:', error);
                } finally {
                    setLoading(false);
                }
            }
        };
        const interval = setInterval(() => {
            if (serverStatus === 'stopped') {
                handleStartServer();
            } else {
                clearInterval(interval);
            }
        }, 1000 * 60 * 14); // Khởi động lại máy chủ sau 14 phút
        return () => clearInterval(interval);
    }, []);

    return (
        <></>
    );
};

export default StartServer;
