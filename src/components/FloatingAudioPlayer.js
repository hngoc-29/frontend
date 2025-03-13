'use client';
import { useGlobalAudio } from '../context/GlobalAudioContext';
import { PlayArrow, Pause, SkipPrevious, SkipNext } from '@mui/icons-material';
import { useEffect, useState, useRef } from 'react';
import { useAudio } from '../context/AudioContext';
import { useRouter } from 'next/navigation';

const FloatingAudioPlayer = () => {
    const router = useRouter();
    const { globalAudioState, setGlobalAudioState, audioRef } = useGlobalAudio();
    const { currentIndex, setCurrentIndex, sings, isRepeat, isRandom } = useAudio();
    const [isVisible, setIsVisible] = useState(false);

    // Refs để theo dõi trạng thái
    const isMounted = useRef(false);

    // Xử lý hiển thị component khi mount và khi trạng thái thay đổi
    useEffect(() => {
        isMounted.current = true;

        // Kiểm tra hiển thị
        const checkVisibility = () => {
            if (!sings.length) {
                setIsVisible(false);
                return;
            }
            setIsVisible(true);
        };

        checkVisibility();

        return () => {
            isMounted.current = false;
        };
    }, [sings]);

    // Hàm xử lý phát/dừng
    const handlePlayPause = (e) => {
        e.stopPropagation(); // Ngăn chặn event bubbling

        if (audioRef.current) {
            const isAudioActuallyPlaying = !audioRef.current.paused;

            if (isAudioActuallyPlaying) {
                audioRef.current.pause();
                setGlobalAudioState(prev => ({ ...prev, isPlaying: false }));
            } else {
                const playPromise = audioRef.current.play();
                if (playPromise) {
                    playPromise
                        .then(() => {
                            setGlobalAudioState(prev => ({ ...prev, isPlaying: true }));
                        })
                        .catch(error => {
                            console.error("Không thể phát audio:", error);
                            alert("Không thể phát nhạc. Vui lòng thử lại.");
                        });
                }
            }
        }
    };

    const handleNext = (e) => {
        e.stopPropagation(); // Ngăn chặn event bubbling
        const isRepeat = localStorage.getItem('isRepeat') === 'true' ? true : false;
        const isRandom = localStorage.getItem('isRandom') === 'true' ? true : false;
        if (isRepeat) {
            // Nếu đang ở chế độ lặp lại, phát lại bài hiện tại
            audioRef.current.currentTime = 0; // Reset thời gian về 0
            audioRef.current.play(); // Phát lại bài hát
        } else {
            // Chuyển sang bài tiếp theo
            setCurrentIndex((prevIndex) => {
                let nextIndex;
                if (isRandom) {
                    nextIndex = getRandomIndex(prevIndex, sings.length);
                } else {
                    nextIndex = (prevIndex + 1) % sings.length;
                }
                return nextIndex;
            });
            if (audioRef.current) {
                audioRef.current.src = sings[(currentIndex + 1) % sings.length].audio_url; // Cập nhật src
                audioRef.current.play().catch(error => {
                    console.error("Không thể phát audio:", error);
                });
            }
        }
    };

    const handlePrev = (e) => {
        e.stopPropagation(); // Ngăn chặn event bubbling
        setCurrentIndex((prevIndex) => (prevIndex - 1 + sings.length) % sings.length);
        if (audioRef.current) {
            audioRef.current.src = sings[(currentIndex - 1 + sings.length) % sings.length].audio_url; // Cập nhật src
            audioRef.current.play().catch(error => {
                console.error("Không thể phát audio:", error);
            });
        }
    };

    // Hàm để lấy chỉ số bài hát ngẫu nhiên không trùng với bài hiện tại
    const getRandomIndex = (currentIdx, length) => {
        if (length === 0) return 0;
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * length);
        } while (newIndex === currentIdx);
        return newIndex;
    };

    // Kiểm tra currentTime và gọi handleNext nếu cần
    useEffect(() => {
        const checkCurrentTime = () => {
            if (audioRef.current) {
                const currentTime = audioRef.current.currentTime;
                const duration = audioRef.current.duration;

                if (currentTime >= duration) {
                    handleNext(); // Gọi hàm next nếu currentTime >= duration
                }
            }
        };

        const interval = setInterval(checkCurrentTime, 1000); // Kiểm tra mỗi giây

        return () => clearInterval(interval); // Dọn dẹp interval khi unmount
    }, [audioRef, handleNext]);

    // Nếu không hiển thị, return null để không render gì
    if (!sings.length || !isVisible) {
        return null;
    }

    // Vị trí hiển thị khác nhau tùy thuộc vào thiết bị
    const positionClass = "fixed bottom-15 right-4 bg-white p-4 shadow-lg rounded-lg flex items-center cursor-pointer floating-audio-player";

    return (
        <div className={positionClass} onClick={() => router.push(`/${globalAudioState.id}`)}>
            <div className="mr-4">
                <img
                    src={sings[currentIndex]?.image_url}
                    alt={sings[currentIndex]?.singname}
                    className="w-12 h-12 rounded-full"
                    loading="lazy"
                />
            </div>
            <div className="flex-1">
                <h4 className="text-sm font-bold">{sings[currentIndex]?.singname}</h4>
                <p className="text-xs">{sings[currentIndex]?.author}</p>
            </div>
            <button onClick={handlePrev} className="ml-2" aria-label="Previous">
                <SkipPrevious />
            </button>
            <button onClick={handlePlayPause} className="ml-2" aria-label={globalAudioState.isPlaying ? "Pause" : "Play"}>
                {globalAudioState.isPlaying ? <Pause /> : <PlayArrow />}
            </button>
            <button onClick={handleNext} className="ml-2" aria-label="Next">
                <SkipNext />
            </button>
        </div>
    );
};

export default FloatingAudioPlayer;
