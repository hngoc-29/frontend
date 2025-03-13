import React, { createContext, useContext, useState } from 'react';

const AudioContext = createContext();

export const AudioProvider = ({ children }) => {
    const [sings, setSings] = useState([]); // Danh sách bài hát
    const [currentIndex, setCurrentIndex] = useState(0); // Chỉ số bài hát hiện tại

    return (
        <AudioContext.Provider value={{ sings, setSings, currentIndex, setCurrentIndex }}>
            {children}
        </AudioContext.Provider>
    );
};

export const useAudio = () => useContext(AudioContext);