"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
    PlayArrow,
    Pause,
    SkipNext,
    SkipPrevious,
    Shuffle,
    Repeat,
    MoreVert,
} from "@mui/icons-material";
import { useToast } from "../../../context/Toast";

const Main = ({ id }) => {
    const [sings, setSings] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isRandom, setIsRandom] = useState(false);
    const [isRepeat, setIsRepeat] = useState(false);
    const isFirstLoad = useRef(true);
    const audioRef = useRef(null);
    const progressRef = useRef(null);
    const playlistRef = useRef(null);
    const cdRef = useRef(null);
    const initialCDWidth = useRef(150);
    const { addToast } = useToast();
    const playedIndices = useRef([]);

    useEffect(() => {
        // Ẩn thanh cuộn và bottom navigation
        document.body.style.overflow = "hidden";
        const bottomNav = document.querySelector(".bottom-nav");
        if (bottomNav) {
            bottomNav.style.display = "none";
        }
        return () => {
            document.body.style.overflow = "auto";
            if (bottomNav) {
                bottomNav.style.display = "flex";
            }
        };
    }, []);

    useEffect(() => {
        if (sings.length > 0) {
            if (isFirstLoad.current) {
                loadCurrentSong(true); // First load
                isFirstLoad.current = false;
            } else {
                loadCurrentSong();
            }
            scrollToCurrentSong(currentIndex);
        }
    }, [sings, currentIndex]);

    // Lấy dữ liệu bài hát
    useEffect(() => {
        if (!id) return;
        const fetchThumbnails = async () => {
            /*const res = await fetch(`/api/manager/sings?parent=${id}`);
            const data = await res.json();
            if (!data.success) {
                return addToast({
                    type: "error",
                    title: "Sings",
                    description: data.error?.message || "Có lỗi xảy ra",
                });
            }*/
            setSings([
                //...data.Sings,
                {
                    _id: "67cd790bf7104024584b4df0",
                    singname: "na",
                    author: "au",
                    image_url:
                        "https://firebasestorage.googleapis.com/v0/b/hngoc-webdite.appspot.com/o/images%2F1741519113464-z6337101665245_877677cce500e5b6f4a8010e4750a4b3.jpg?alt=media&token=cd2a2e44-c1ee-4cf2-a69f-2f2fe52ac6b3",
                    audio_url:
                        "https://firebasestorage.googleapis.com/v0/b/hngoc-webdite.appspot.com/o/audio%2F1741519110152-0VVjyDAHz0KcvSQFQeZzq5iQCpWfvShW.mp3?alt=media&token=16486229-b790-46d8-9da8-b71031138213",
                    parent: "673b3dadb5cb13176c5f908e",
                    sing_path: "na",
                    createdAt: "2025-03-09T11:18:35.412Z",
                    updatedAt: "2025-03-09T11:18:35.412Z",
                    __v: 0,
                },
                {
                    _id: "67cd790bf7104024584b4df0",
                    singname: "na",
                    author: "au",
                    image_url:
                        "https://firebasestorage.googleapis.com/v0/b/hngoc-webdite.appspot.com/o/images%2F1741519113464-z6337101665245_877677cce500e5b6f4a8010e4750a4b3.jpg?alt=media&token=cd2a2e44-c1ee-4cf2-a69f-2f2fe52ac6b3",
                    audio_url:
                        "https://firebasestorage.googleapis.com/v0/b/hngoc-webdite.appspot.com/o/audio%2F1741519110152-0VVjyDAHz0KcvSQFQeZzq5iQCpWfvShW.mp3?alt=media&token=16486229-b790-46d8-9da8-b71031138213",
                    parent: "673b3dadb5cb13176c5f908e",
                    sing_path: "na",
                    createdAt: "2025-03-09T11:18:35.412Z",
                    updatedAt: "2025-03-09T11:18:35.412Z",
                    __v: 0,
                },
                {
                    _id: "67cd790bf7104024584b4df0",
                    singname: "na",
                    author: "au",
                    image_url:
                        "https://firebasestorage.googleapis.com/v0/b/hngoc-webdite.appspot.com/o/images%2F1741519113464-z6337101665245_877677cce500e5b6f4a8010e4750a4b3.jpg?alt=media&token=cd2a2e44-c1ee-4cf2-a69f-2f2fe52ac6b3",
                    audio_url:
                        "https://firebasestorage.googleapis.com/v0/b/hngoc-webdite.appspot.com/o/audio%2F1741519110152-0VVjyDAHz0KcvSQFQeZzq5iQCpWfvShW.mp3?alt=media&token=16486229-b790-46d8-9da8-b71031138213",
                    parent: "673b3dadb5cb13176c5f908e",
                    sing_path: "na",
                    createdAt: "2025-03-09T11:18:35.412Z",
                    updatedAt: "2025-03-09T11:18:35.412Z",
                    __v: 0,
                },
                {
                    _id: "67cd790bf7104024584b4df0",
                    singname: "na",
                    author: "au",
                    image_url:
                        "https://firebasestorage.googleapis.com/v0/b/hngoc-webdite.appspot.com/o/images%2F1741519113464-z6337101665245_877677cce500e5b6f4a8010e4750a4b3.jpg?alt=media&token=cd2a2e44-c1ee-4cf2-a69f-2f2fe52ac6b3",
                    audio_url:
                        "https://firebasestorage.googleapis.com/v0/b/hngoc-webdite.appspot.com/o/audio%2F1741519110152-0VVjyDAHz0KcvSQFQeZzq5iQCpWfvShW.mp3?alt=media&token=16486229-b790-46d8-9da8-b71031138213",
                    parent: "673b3dadb5cb13176c5f908e",
                    sing_path: "na",
                    createdAt: "2025-03-09T11:18:35.412Z",
                    updatedAt: "2025-03-09T11:18:35.412Z",
                    __v: 0,
                },
                {
                    _id: "67cd790bf7104024584b4df0",
                    singname: "na",
                    author: "au",
                    image_url:
                        "https://firebasestorage.googleapis.com/v0/b/hngoc-webdite.appspot.com/o/images%2F1741519113464-z6337101665245_877677cce500e5b6f4a8010e4750a4b3.jpg?alt=media&token=cd2a2e44-c1ee-4cf2-a69f-2f2fe52ac6b3",
                    audio_url:
                        "https://firebasestorage.googleapis.com/v0/b/hngoc-webdite.appspot.com/o/audio%2F1741519110152-0VVjyDAHz0KcvSQFQeZzq5iQCpWfvShW.mp3?alt=media&token=16486229-b790-46d8-9da8-b71031138213",
                    parent: "673b3dadb5cb13176c5f908e",
                    sing_path: "na",
                    createdAt: "2025-03-09T11:18:35.412Z",
                    updatedAt: "2025-03-09T11:18:35.412Z",
                    __v: 0,
                },
                {
                    _id: "67cd790bf7104024584b4df0",
                    singname: "na",
                    author: "au",
                    image_url:
                        "https://firebasestorage.googleapis.com/v0/b/hngoc-webdite.appspot.com/o/images%2F1741519113464-z6337101665245_877677cce500e5b6f4a8010e4750a4b3.jpg?alt=media&token=cd2a2e44-c1ee-4cf2-a69f-2f2fe52ac6b3",
                    audio_url:
                        "https://firebasestorage.googleapis.com/v0/b/hngoc-webdite.appspot.com/o/audio%2F1741519110152-0VVjyDAHz0KcvSQFQeZzq5iQCpWfvShW.mp3?alt=media&token=16486229-b790-46d8-9da8-b71031138213",
                    parent: "673b3dadb5cb13176c5f908e",
                    sing_path: "na",
                    createdAt: "2025-03-09T11:18:35.412Z",
                    updatedAt: "2025-03-09T11:18:35.412Z",
                    __v: 0,
                },
            ]);
        };
        fetchThumbnails();
    }, [id]);

    useEffect(() => {
        // Load config from localStorage
        const savedConfig = JSON.parse(localStorage.getItem('playerConfig'));
        if (savedConfig) {
            setCurrentIndex(savedConfig.currentIndex || 0);
            setIsRandom(savedConfig.isRandom || false);
            setIsRepeat(savedConfig.isRepeat || false);
        }
    }, []);

    useEffect(() => {
        // Save config to localStorage
        const config = {
            currentIndex,
            isRandom,
            isRepeat,
        };
        localStorage.setItem('playerConfig', JSON.stringify(config));
    }, [currentIndex, isRandom, isRepeat]);

    // Hàm helper lấy chỉ số random khác với bài hiện tại
    const getRandomIndex = (currentIdx, length) => {
        if (length === 0) return 0;
        if (playedIndices.current.length === length) {
            playedIndices.current = []; // Reset when all songs have been played
        }
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * length);
        } while (newIndex === currentIdx || playedIndices.current.includes(newIndex));
        playedIndices.current.push(newIndex);
        return newIndex;
    };

    // Hiệu ứng thu nhỏ CD khi cuộn playlist
    const handleScroll = () => {
        const playlistEl = playlistRef.current;
        const cdElement = cdRef.current;
        const scrollTop = playlistEl.scrollTop;
        const newWidth = Math.max(initialCDWidth.current - scrollTop, 0);
        cdElement.style.width = `${newWidth}px`;
        cdElement.style.opacity = newWidth / initialCDWidth.current;
        cdElement.style.zIndex = newWidth > 0 ? 10 : -1; // Ensure CD stays on top
        playlistEl.style.marginTop = `${newWidth + 170}px`; // Adjust margin-top based on CD width
        playlistEl.style.height = `calc(100vh - ${newWidth + 230}px)`; // Adjust height based on CD width
    };

    const loadCurrentSong = (isFirst = false) => {
        if (audioRef.current && sings[currentIndex]) {
            const audioUrl = sings[currentIndex].audio_url;
            audioRef.current.src = audioUrl;
            audioRef.current.load();
            // Reset currentTime của audio
            audioRef.current.currentTime = 0;
            if (!isFirst) {
                audioRef.current.play();
                setIsPlaying(true);
            } else {
                setIsPlaying(false);
            }
            if (progressRef.current) {
                progressRef.current.value = 0;
                progressRef.current.style.background = `linear-gradient(to right, #EC1F55 0%, #d3d3d3 0%)`;
            }
        }
    };

    const handlePlayPause = () => {
        if (!audioRef.current) return;
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            const playPromise = audioRef.current.play();
            if (playPromise !== undefined) {
                playPromise
                    .then(() => setIsPlaying(true))
                    .catch((error) => {
                        console.error("Error playing audio:", error);
                        addToast({
                            type: "error",
                            title: "Audio Error",
                            description: "Không thể phát audio. Vui lòng thử lại.",
                        });
                    });
            }
        }
    };

    // Tối ưu hàm next sử dụng useCallback và getRandomIndex
    const handleNext = useCallback(() => {
        const nextButton = document.querySelector('.next-button');
        nextButton.classList.add('text-red-500');
        setTimeout(() => nextButton.classList.remove('text-red-500'), 500);

        setCurrentIndex((prevIndex) => {
            const nextIndex = isRandom ? getRandomIndex(prevIndex, sings.length) : (prevIndex + 1) % sings.length;
            if (!isRandom) playedIndices.current = []; // Clear played indices if not in random mode
            return nextIndex;
        });
    }, [isRandom, sings.length]);

    const handlePrev = () => {
        const prevButton = document.querySelector('.prev-button');
        prevButton.classList.add('text-red-500');
        setTimeout(() => prevButton.classList.remove('text-red-500'), 500);

        setCurrentIndex((prev) => {
            const prevIndex = isRandom ? getRandomIndex(prev, sings.length) : (prev - 1 + sings.length) % sings.length;
            if (!isRandom) playedIndices.current = []; // Clear played indices if not in random mode
            return prev;
        });
    };

    const toggleRandom = () => setIsRandom((prev) => !prev);
    const toggleRepeat = () => setIsRepeat((prev) => !prev);

    const onAudioPlay = () => setIsPlaying(true);
    const onAudioPause = () => setIsPlaying(false);
    const onAudioEnded = () => {
        if (isRepeat) {
            audioRef.current.play();
        } else {
            handleNext();
        }
    };

    const onTimeUpdate = () => {
        if (audioRef.current && progressRef.current) {
            const progressPercent = Math.floor(
                (audioRef.current.currentTime / audioRef.current.duration) * 100
            );
            progressRef.current.value = progressPercent;
            progressRef.current.style.background = `linear-gradient(to right, #EC1F55 ${progressPercent}%, #d3d3d3 0%)`;
        }
    };

    const onProgressChange = (e) => {
        if (audioRef.current) {
            const seekTime = (audioRef.current.duration / 100) * e.target.value;
            audioRef.current.currentTime = seekTime;
        }
    };

    const handleSongClick = (index) => {
        setCurrentIndex(index);
    };

    const smoothScrollTo = (element, target, duration = 500) => {
        const start = element.scrollTop;
        const change = target - start;
        const startTime = performance.now();

        const animateScroll = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Hàm easing kiểu easeInOutQuad
            const ease = progress < 0.5
                ? 2 * progress * progress
                : -1 + (4 - 2 * progress) * progress;
            element.scrollTop = start + change * ease;
            if (elapsed < duration) {
                requestAnimationFrame(animateScroll);
            }
        };

        requestAnimationFrame(animateScroll);
    };

    const scrollToCurrentSong = (index) => {
        const playlistEl = playlistRef.current;
        const songEl = playlistEl.children[index];
        if (songEl) {
            const target = songEl.offsetTop - playlistEl.offsetTop;
            smoothScrollTo(playlistEl, target, 500);
        }
    };

    if (sings.length === 0) {
        return <div className="container mx-auto p-4">No songs available</div>;
    }

    return (
        <div className="relative max-w-[480px] mx-auto mt-[80px]">
            {/* Dashboard */}
            <div className="fixed top-[60px] w-full max-w-[480px] bg-white border-b border-gray-200 p-2 z-20">
                <header className="text-center mb-2">
                    <h4 className="text-sm text-[#EC1F55]">Now playing:</h4>
                    <h2 className="font-bold text-xl">{sings[currentIndex]?.singname || `String 57th & 9th`}</h2>
                </header>
                {/* CD */}
                <div ref={cdRef} className="mx-auto w-[150px]">
                    <div
                        className="w-full aspect-square rounded-full bg-cover bg-[#333] mx-auto"
                        style={{
                            backgroundImage: `url(${sings[currentIndex]?.image_url})`,
                            animation: isPlaying ? 'spin 5s linear infinite' : 'none',
                        }}
                    ></div>
                </div>
                {/* Control */}
                <div className="flex justify-around items-center py-2">
                    <button className="text-gray-600 p-4" onClick={toggleRepeat}>
                        <Repeat fontSize="medium" className={`${isRepeat ? 'text-red-500' : ''}`} />
                    </button>
                    <button className="text-gray-600 p-4 prev-button" onClick={handlePrev}>
                        <SkipPrevious fontSize="medium" />
                    </button>
                    <button
                        className="bg-[#EC1F55] text-white w-[40px] h-[40px] rounded-full flex items-center justify-center"
                        onClick={handlePlayPause}
                    >
                        {isPlaying ? (
                            <Pause fontSize="medium" />
                        ) : (
                            <PlayArrow fontSize="medium" />
                        )}
                    </button>
                    <button className="text-gray-600 p-4 next-button" onClick={handleNext}>
                        <SkipNext fontSize="medium" />
                    </button>
                    <button className="text-gray-600 p-4" onClick={toggleRandom}>
                        <Shuffle fontSize="medium" className={`${isRandom ? 'text-red-500' : ''}`} />
                    </button>
                </div>
                {/* Progress */}
                <input
                    type="range"
                    defaultValue={0}
                    onChange={onProgressChange}
                    ref={progressRef}
                    className="w-full h-[4px] opacity-70 rounded-lg appearance-none bg-gray-200"
                    style={{ background: `linear-gradient(to right, #EC1F55 0%, #d3d3d3 0%)` }}
                />
                {/* Audio element */}
                <audio
                    ref={audioRef}
                    onPlay={onAudioPlay}
                    onPause={onAudioPause}
                    onEnded={onAudioEnded}
                    onTimeUpdate={onTimeUpdate}
                    className="hidden"
                />
            </div>
            {/* Playlist */}
            <div
                ref={playlistRef}
                onScroll={handleScroll}
                className="p-3 overflow-auto scroll-smooth"
                style={{ marginTop: '320px', height: 'calc(100vh - 360px)' }}
            >
                {sings.map((sing, index) => (
                    <div
                        key={sing._id + index}
                        className={`flex items-center p-4 mb-3 rounded-lg shadow cursor-pointer ${index === currentIndex ? "bg-[#EC1F55] text-white" : "bg-white"}`}
                        onClick={() => handleSongClick(index)}
                    >
                        <div
                            className="w-[44px] h-[44px] rounded-full bg-cover mr-2"
                            style={{ backgroundImage: `url(${sing.image_url})` }}
                        ></div>
                        <div className="flex-1 px-4">
                            <h3 className="text-lg">{sing.singname}</h3>
                            <p className="text-sm">{sing.author}</p>
                        </div>
                        <div className="text-gray-600">
                            <MoreVert fontSize="large" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Main;
