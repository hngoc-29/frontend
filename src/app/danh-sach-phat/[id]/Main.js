"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
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
import { checkToken } from "../../../components/TokenRefresher";
import { useGlobalAudio } from '../../../context/GlobalAudioContext';
import AudioPlayer from '../../../components/AudioPlayer';
import { useAudio } from '../../../context/AudioContext';

const Main = ({ id }) => {
    const router = useRouter();
    const { addToast } = useToast();
    const { globalAudioState, setGlobalAudioState, audioRef } = useGlobalAudio();
    const { sings, setSings, currentIndex, setCurrentIndex } = useAudio();
    const hasFetched = useRef(false);

    // Thêm ref để lưu trữ chỉ số bài hát trước đó
    const previousIndex = useRef(null);

    // Đảm bảo currentIndex được khởi tạo từ URL params trước tiên
    const [isPlaying, setIsPlaying] = useState(globalAudioState.isPlaying);
    const [isRandom, setIsRandom] = useState(() => {
        if (typeof window === `undefined`) return false;
        const savedConfig = JSON.parse(localStorage.getItem("playerConfig")) || {};
        return savedConfig.isRandom === true; // Khôi phục từ localStorage
    });
    const [isRepeat, setIsRepeat] = useState(() => {
        if (typeof window === `undefined`) return false;
        const savedConfig = JSON.parse(localStorage.getItem("playerConfig")) || {};
        return savedConfig.isRepeat === true; // Khôi phục từ localStorage
    });

    // Đồng bộ isPlaying với globalAudioState
    useEffect(() => {
        setIsPlaying(globalAudioState.isPlaying);
    }, [globalAudioState.isPlaying]);

    // Các ref dùng để truy cập DOM và lưu trạng thái
    const isFirstLoad = useRef(true);
    const progressRef = useRef(null);
    const playlistRef = useRef(null);
    const cdRef = useRef(null);
    const initialCDWidth = useRef(150);
    const playedIndices = useRef([]);

    // Ẩn thanh cuộn và bottom navigation khi component mount
    useEffect(() => {
        if (typeof window !== `undefined`) {
            document.body.style.overflow = "hidden";
            const bottomNav = document.querySelector(".bottom-nav");
            if (bottomNav) {
                bottomNav.style.display = "none";
            }
        }
        return () => {
            document.body.style.overflow = "auto";
            const bottomNav = document.querySelector(".bottom-nav");
            if (bottomNav) {
                bottomNav.style.display = "flex";
            }
        };
    }, []);

    // Lưu trạng thái trước khi rời khỏi trang
    useEffect(() => {
        const handleBeforeUnload = () => {
            if (audioRef.current) {
                setGlobalAudioState(prev => ({
                    ...prev,
                    currentTime: audioRef.current.currentTime,
                    isPlaying: !audioRef.current.paused,
                }));
            }
        };

        if (typeof window !== `undefined`) window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            if (typeof window !== `undefined`) window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [audioRef]);

    // Phương thức này chạy khi component unmount dù vì lý do gì
    useEffect(() => {
        return () => {
            // Đặt timeout để đảm bảo FloatingAudioPlayer hiển thị sau khi trang đã chuyển
            // và Main component đã unmount
            setTimeout(() => {
                const floatingPlayer = document.querySelector('.floating-audio-player');
                const isAudioPlaying = audioRef.current && !audioRef.current.paused;

                if (floatingPlayer && isAudioPlaying) {
                    floatingPlayer.style.display = 'flex';
                }
            }, 200);
        };
    }, []);

    // Khi danh sách bài hát hoặc chỉ số bài thay đổi, load bài và cuộn đến bài đó
    useEffect(() => {
        if (sings.length > 0) {
            if (isFirstLoad.current) {
                loadCurrentSong(true); // Load lần đầu, không tự động phát
                isFirstLoad.current = false;
            } else {
                // Chỉ cuộn nếu currentIndex thực sự thay đổi
                if (previousIndex.current !== currentIndex) {
                    loadCurrentSong();
                    scrollToCurrentSong(currentIndex);
                    if (audioRef.current && sings[currentIndex] && sings[currentIndex].audio_url) {
                        audioRef.current.src = sings[currentIndex].audio_url; // Cập nhật src
                        audioRef.current.play().catch(error => {
                            console.error("Không thể phát audio:", error);
                        });
                    }
                }
            }
        }
        previousIndex.current = currentIndex;
    }, [sings, currentIndex]);

    // Lấy dữ liệu bài hát (ở đây sử dụng dữ liệu mẫu)
    useEffect(() => {
        if (hasFetched.current) return;
        hasFetched.current = true;
        if (!id) return;
        const fetchThumbnails = async () => {
            try {
                await checkToken();
                const response = await fetch(`/api/manager/sings?parent=${id}`, {
                    headers: {
                        'plusview': id !== `all` ? true : false,
                    },
                    method: 'GET',
                });
                const data = await response.json();
                if (!response.ok) {
                    throw new Error(data.message || "Fetch Error");
                }
                setSings(data.Sings);
            } catch (error) {
                setSings([]);
                addToast({
                    type: "error",
                    title: "Lỗi tải dữ liệu",
                    description: error.message,
                });
            }
        };
        fetchThumbnails();
    }, [id]);

    // Load cấu hình player từ localStorage khi component mount
    useEffect(() => {
        if (typeof window === `undefined`) return
        const savedConfig = JSON.parse(localStorage.getItem("playerConfig")) || null;
        if (savedConfig) {
            setIsRandom(savedConfig.isRandom || false);
            setIsRepeat(savedConfig.isRepeat || false);
        }
    }, []);

    // Đảm bảo currentIndex được cập nhật đúng trong globalAudioState
    useEffect(() => {
        const updateCurrentIndex = () => {
            const numIndex = Math.max(0, Number(currentIndex));
            setGlobalAudioState(prev => ({
                ...prev,
                currentIndex: numIndex,
            }));
        };

        updateCurrentIndex();
    }, [currentIndex]);

    // Đảm bảo currentIndex không nhảy giữa các giá trị không hợp lệ


    // Sửa useEffect lưu cấu hình để đảm bảo luôn lưu số nguyên dương
    useEffect(() => {
        const config = {
            currentIndex: Math.max(0, Number(currentIndex)),
            isRandom,
            isRepeat
        };
        if (typeof window !== `undefined`) localStorage.setItem("playerConfig", JSON.stringify(config));
    }, [currentIndex, isRandom, isRepeat]);

    // Thêm useEffect để ngăn chặn việc cập nhật currentIndex không hợp lệ từ globalAudioState


    // Hàm helper để lấy chỉ số bài hát ngẫu nhiên không trùng với bài hiện tại
    const getRandomIndex = (currentIdx, length) => {
        if (length === 0) return 0;
        if (playedIndices.current.length === length) {
            playedIndices.current = []; // Reset khi tất cả bài đã được phát
        }
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * length);
            if (newIndex === currentIdx) {
                newIndex = (newIndex + 1) % length; // Đảm bảo không trùng với bài hiện tại
            }
        } while (playedIndices.current.includes(newIndex));
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
        cdElement.style.zIndex = newWidth > 0 ? 10 : -1;
        playlistEl.style.marginTop = `${newWidth + 170}px`;
        playlistEl.style.height = `calc(100vh - ${newWidth + 230}px)`;
    };

    // Load bài hát hiện tại và cập nhật trạng thái audio toàn cục
    const loadCurrentSong = (isFirst = false) => {
        if (audioRef.current && sings[currentIndex]) {
            const audioUrl = sings[currentIndex].audio_url;
            const currentSong = sings[currentIndex];

            const isAudioActuallyPlaying = audioRef.current && !audioRef.current.paused;
            const isSameSong = audioRef.current.src && audioRef.current.src.endsWith(audioUrl.split('/').pop());

            if (!isSameSong) {
                if (isAudioActuallyPlaying) {
                    audioRef.current.pause();
                }
                audioRef.current.src = audioUrl;
                audioRef.current.load();
                audioRef.current.currentTime = 0;
            }

            setGlobalAudioState(prev => ({
                ...prev,
                isPlaying: isAudioActuallyPlaying,
                currentSong,
                currentIndex,
                audioUrl,
                id
            }));

            router.push(`${id}?sing=${currentIndex}`, undefined, { shallow: true });

            if (progressRef.current) {
                progressRef.current.value = 0;
                progressRef.current.style.background = `linear-gradient(to right, #EC1F55 0%, #d3d3d3 0%)`;
            }

            const floatingPlayer = document.querySelector('.floating-audio-player');
            if (floatingPlayer) {
                floatingPlayer.style.display = 'none';
            }
        }
    };

    // Xử lý phát/tạm dừng audio, thêm toast khi không thể phát
    const handlePlayPause = () => {
        if (audioRef.current) {
            const isAudioActuallyPlaying = !audioRef.current.paused;

            if (isAudioActuallyPlaying) {
                audioRef.current.pause();
                setIsPlaying(false);
                setGlobalAudioState(prev => ({ ...prev, isPlaying: false }));
            } else {
                const playPromise = audioRef.current.play();
                if (playPromise) {
                    playPromise
                        .then(() => {
                            setIsPlaying(true);
                            setGlobalAudioState(prev => ({ ...prev, isPlaying: true }));
                        })
                        .catch(error => {
                            addToast({
                                type: "error",
                                title: "Lỗi phát nhạc",
                                description: "Không thể phát bài hát này, vui lòng thử lại sau.",
                            });
                        });
                }
            }
        }
    };

    // Hàm chuyển bài tiếp theo, sử dụng useCallback để tối ưu
    const handleNext = useCallback(() => {
        // Hiệu ứng nhấn nút next (có thể thay đổi màu sắc tạm thời)
        const nextButton = document.querySelector(".next-button");
        if (nextButton) {
            nextButton.classList.add("text-red-500");
            setTimeout(() => nextButton.classList.remove("text-red-500"), 200);
        }
        setCurrentIndex((prevIndex) => {
            const nextIndex = isRandom
                ? getRandomIndex(prevIndex, sings.length)
                : (prevIndex + 1) % sings.length;
            if (!isRandom) playedIndices.current = []; // Reset played indices khi không random
            return nextIndex;
        });
    }, [isRandom, sings.length]);

    // Hàm chuyển bài trước đó
    const handlePrev = useCallback(() => {
        const prevButton = document.querySelector(".prev-button");
        if (prevButton) {
            prevButton.classList.add("text-red-500");
            setTimeout(() => prevButton.classList.remove("text-red-500"), 200);
        }
        setCurrentIndex((prev) => {
            const prevIndex = isRandom
                ? getRandomIndex(prev, sings.length)
                : (prev - 1 + sings.length) % sings.length;
            if (!isRandom) playedIndices.current = [];
            return prevIndex;
        });
    }, [isRandom, sings.length]);

    const toggleRandom = () => {
        const newRandomState = !isRandom;
        setIsRandom(newRandomState);
        const config = {
            currentIndex: Math.max(0, Number(currentIndex)),
            isRandom: newRandomState,
            isRepeat
        };
        if (typeof window !== `undefined`) localStorage.setItem("playerConfig", JSON.stringify(config));
    };

    const toggleRepeat = () => {
        const newRepeatState = !isRepeat;
        setIsRepeat(newRepeatState);
        const config = {
            currentIndex: Math.max(0, Number(currentIndex)),
            isRandom,
            isRepeat: newRepeatState
        };
        if (typeof window !== `undefined`) localStorage.setItem("playerConfig", JSON.stringify(config));
    };

    const onAudioPlay = () => {
        setIsPlaying(true);
        // Cập nhật trạng thái global
        setGlobalAudioState(prev => ({ ...prev, isPlaying: true }));
    };

    const onAudioPause = () => {
        setIsPlaying(false);
        // Cập nhật trạng thái global
        setGlobalAudioState(prev => ({ ...prev, isPlaying: false }));
    };

    // Khi audio kết thúc, nếu chế độ repeat bật thì phát lại, ngược lại chuyển bài tiếp theo
    const onAudioEnded = () => {
        if (isRepeat) {
            audioRef.current.currentTime = 0; // Reset thời gian về 0
            audioRef.current.play(); // Phát lại bài hát
        } else {
            handleNext(); // Chuyển sang bài tiếp theo
        }
    };

    // Cập nhật thanh tiến độ khi audio chạy
    const onTimeUpdate = () => {
        if (audioRef.current && progressRef.current) {
            const progressPercent = Math.floor(
                (audioRef.current.currentTime / audioRef.current.duration) * 100
            );
            progressRef.current.value = progressPercent;
            progressRef.current.style.background = `linear-gradient(to right, #EC1F55 ${progressPercent}%, #d3d3d3 0%)`;
        }
    };

    // Xử lý thay đổi thanh tiến độ khi người dùng kéo
    const onProgressChange = (e) => {
        if (audioRef.current) {
            const seekTime = (audioRef.current.duration / 100) * e.target.value;
            audioRef.current.currentTime = seekTime;
        }
    };

    // Khi người dùng click vào bài hát trong playlist
    const handleSongClick = (index) => {
        setCurrentIndex(index);
    };

    // Hàm cuộn mượt tới bài hát hiện tại trong playlist
    const smoothScrollTo = (element, target, duration = 500) => {
        const start = element.scrollTop;
        const change = target - start;
        const startTime = performance.now();

        const animateScroll = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Hàm easing kiểu easeInOutQuad
            const ease =
                progress < 0.5 ? 2 * progress * progress : -1 + (4 - 2 * progress) * progress;
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
            const target = Math.max(0, songEl.offsetTop - playlistEl.offsetTop);
            smoothScrollTo(playlistEl, target, 500);
        }
    };

    useEffect(() => {
        const savedTime = sessionStorage.getItem("audioCurrentTime");
        if (savedTime && progressRef.current) {
            const progressPercent = (parseFloat(savedTime) / (audioRef.current?.duration || 1)) * 100;
            progressRef.current.value = progressPercent;
            progressRef.current.style.background = `linear-gradient(to right, #EC1F55 ${progressPercent}%, #d3d3d3 0%)`;
        }
    }, [audioRef, progressRef]);

    useEffect(() => {
        const updateCurrentTime = () => {
            if (audioRef.current) {
                setGlobalAudioState(prev => ({
                    ...prev,
                    currentTime: audioRef.current.currentTime,
                }));
            }
        };

        if (audioRef.current) {
            audioRef.current.addEventListener('timeupdate', updateCurrentTime);
        }

        return () => {
            if (audioRef.current) {
                audioRef.current.removeEventListener('timeupdate', updateCurrentTime);
            }
        };
    }, [audioRef, setGlobalAudioState]);

    useEffect(() => {
        // Khôi phục trạng thái isPlaying từ sessionStorage
        const savedIsPlaying = sessionStorage.getItem('isPlaying') === 'true';
        if (savedIsPlaying) {
            setIsPlaying(true);
            if (audioRef.current) {
                audioRef.current.play().catch(error => {
                    console.error("Không thể phát audio:", error);
                });
            }
        }
    }, []);

    // Đồng bộ audioRef với globalAudioState
    useEffect(() => {
        if (audioRef.current && sings[currentIndex] && sings[currentIndex].audio_url) {
            if (globalAudioState.isPlaying) {
                audioRef.current.play().catch(error => {
                    console.error("Không thể phát audio:", error);
                });
            } else {
                audioRef.current.pause();
            }
        }
    }, [globalAudioState.isPlaying]);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.addEventListener('ended', handleNext); // Tự động chuyển bài khi kết thúc
        }

        return () => {
            if (audioRef.current) {
                audioRef.current.removeEventListener('ended', handleNext);
            }
        };
    }, [audioRef]);

    if (sings.length === 0) {
        return <div className="container mx-auto p-4">Không có bài hát nào</div>;
    }

    return (
        <div className="relative max-w-[480px] mx-auto mt-[80px]">
            <AudioPlayer progressRef={progressRef} />
            {/* Dashboard */}
            <div className="fixed top-[60px] w-full max-w-[480px] bg-white border-b border-gray-200 p-2 z-20">
                <header className="text-center mb-2">
                    <h4 className="text-sm text-[#EC1F55]">Đang phát:</h4>
                    <h2 className="font-bold text-xl">
                        {sings[currentIndex]?.singname || "Bài hát mặc định"}
                    </h2>
                </header>
                {/* CD */}
                <div ref={cdRef} className="mx-auto w-[150px]">
                    <div
                        className="w-full aspect-square rounded-full bg-cover bg-[#333] mx-auto"
                        style={{
                            backgroundImage: `url(${sings[currentIndex]?.image_url})`,
                            animation: isPlaying ? "spin 5s linear infinite" : "none",
                        }}
                    ></div>
                </div>
                {/* Control */}
                <div className="flex justify-around items-center py-2">
                    <button className="text-gray-600 p-4" onClick={toggleRepeat} aria-label="Toggle Repeat">
                        <Repeat fontSize="medium" className={`${isRepeat ? "text-red-500" : ""}`} />
                    </button>
                    <button className="text-gray-600 p-4 prev-button" onClick={handlePrev} aria-label="Previous Song">
                        <SkipPrevious fontSize="medium" />
                    </button>
                    <button
                        className="bg-[#EC1F55] text-white w-[40px] h-[40px] rounded-full flex items-center justify-center"
                        onClick={handlePlayPause}
                        aria-label={isPlaying ? "Pause" : "Play"}
                    >
                        {isPlaying ? (
                            <Pause fontSize="medium" />
                        ) : (
                            <PlayArrow fontSize="medium" />
                        )}
                    </button>
                    <button className="text-gray-600 p-4 next-button" onClick={handleNext} aria-label="Next Song">
                        <SkipNext fontSize="medium" />
                    </button>
                    <button className="text-gray-600 p-4" onClick={toggleRandom} aria-label="Toggle Shuffle">
                        <Shuffle fontSize="medium" className={`${isRandom ? "text-red-500" : ""}`} />
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
            </div>
            {/* Playlist */}
            <div
                ref={playlistRef}
                onScroll={handleScroll}
                className="p-3 overflow-auto scroll-smooth"
                style={{ marginTop: "320px", height: "calc(100vh - 360px)" }}
            >
                {sings.map((sing, index) => (
                    <div
                        key={sing._id + index}
                        className={`flex items-center p-4 mb-3 rounded-lg shadow cursor-pointer ${index === currentIndex ? "bg-[#C21845] text-white" : "bg-gray-100 text-gray-800"
                            }`}
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