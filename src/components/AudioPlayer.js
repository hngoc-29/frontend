import { useEffect } from 'react';
import { useGlobalAudio } from '../context/GlobalAudioContext';

const AudioPlayer = ({ progressRef }) => {
    const { globalAudioState, setGlobalAudioState, audioRef } = useGlobalAudio();

    useEffect(() => {
        if (!audioRef.current && typeof window !== 'undefined') {
            audioRef.current = new Audio();
        }

        const handlePlay = () => {
            setGlobalAudioState(prev => ({ ...prev, isPlaying: true }));
        };

        const handlePause = () => {
            setGlobalAudioState(prev => ({ ...prev, isPlaying: false }));
        };

        const handleEnded = () => {
            setGlobalAudioState(prev => ({ ...prev, isPlaying: false }));
        };

        if (audioRef.current) {
            audioRef.current.addEventListener('play', handlePlay);
            audioRef.current.addEventListener('pause', handlePause);
            audioRef.current.addEventListener('ended', handleEnded);
        }

        return () => {
            if (audioRef.current) {
                audioRef.current.removeEventListener('play', handlePlay);
                audioRef.current.removeEventListener('pause', handlePause);
                audioRef.current.removeEventListener('ended', handleEnded);
            }
        };
    }, [audioRef, setGlobalAudioState]);

    useEffect(() => {
        const updateProgress = () => {
            if (audioRef.current && progressRef?.current) {
                const progressPercent = (audioRef.current.currentTime / audioRef.current.duration) * 100;
                progressRef.current.value = progressPercent;
                progressRef.current.style.background = `linear-gradient(to right, #EC1F55 ${progressPercent}%, #d3d3d3 0%)`;
            }
        };

        if (audioRef.current) {
            audioRef.current.addEventListener('timeupdate', updateProgress);
        }

        return () => {
            if (audioRef.current) {
                audioRef.current.removeEventListener('timeupdate', updateProgress);
            }
        };
    }, [audioRef, progressRef]);

    // Đặt lại thời gian khi reload
    useEffect(() => {
        const handleBeforeUnload = () => {
            if (audioRef.current) {
                audioRef.current.currentTime = 0;
            }
        };

        if (typeof window !== `undefined`) window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            if (typeof window !== `undefined`) window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [audioRef]);

    return null;
};

export default AudioPlayer; 