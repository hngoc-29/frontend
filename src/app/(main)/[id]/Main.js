"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
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

const Main = ({ id }) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { addToast } = useToast();

    // State khởi tạo danh sách bài hát và chỉ số bài hiện tại (lấy từ query 'sing' nếu có)
    const [sings, setSings] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(searchParams.get("sing") || 0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isRandom, setIsRandom] = useState(false);
    const [isRepeat, setIsRepeat] = useState(false);

    // Các ref dùng để truy cập DOM và lưu trạng thái
    const isFirstLoad = useRef(true);
    const audioRef = useRef(null);
    const progressRef = useRef(null);
    const playlistRef = useRef(null);
    const cdRef = useRef(null);
    const initialCDWidth = useRef(150);
    const playedIndices = useRef([]);

    // Ẩn thanh cuộn và bottom navigation khi component mount
    useEffect(() => {
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

    // Khi danh sách bài hát hoặc chỉ số bài thay đổi, load bài và cuộn đến bài đó
    useEffect(() => {
        if (sings.length > 0) {
            if (isFirstLoad.current) {
                loadCurrentSong(true); // Load lần đầu, không tự động phát
                isFirstLoad.current = false;
            } else {
                loadCurrentSong();
            }
            scrollToCurrentSong(currentIndex);
        }
        if ('mediaSession' in navigator) {
            const artworkUrl = sings[currentIndex]?.image_url || 'fallback-image-url.png';
            navigator.mediaSession.metadata = new MediaMetadata({
                title: sings[currentIndex]?.singname || "Default Song",
                artist: sings[currentIndex]?.author || "Unknown Artist",
                album: "Album Name",
                artwork: [
                    { src: artworkUrl, sizes: '96x96', type: 'image/png' },
                    { src: artworkUrl, sizes: '128x128', type: 'image/png' },
                    { src: artworkUrl, sizes: '192x192', type: 'image/png' },
                    { src: artworkUrl, sizes: '256x256', type: 'image/png' },
                    { src: artworkUrl, sizes: '384x384', type: 'image/png' },
                    { src: artworkUrl, sizes: '512x512', type: 'image/png' },
                ]
            });

            navigator.mediaSession.setActionHandler('play', handlePlayPause);
            navigator.mediaSession.setActionHandler('pause', handlePlayPause);
            navigator.mediaSession.setActionHandler('previoustrack', handlePrev);
            navigator.mediaSession.setActionHandler('nexttrack', handleNext);
        }
    }, [sings, currentIndex]);

    // Lấy dữ liệu bài hát (ở đây sử dụng dữ liệu mẫu)
    useEffect(() => {
        if (!id) return;
        const fetchThumbnails = async () => {
            try {
                await checkToken();
                const response = await fetch(`/api/manager/sings?parent=${id}`);
                const data = await response.json();
                if (!response.ok) {
                    throw new Error(data.message || "Fetch Error");
                }
                setSings(data.Sings);
            } catch (error) {
                addToast({
                    type: "error",
                    title: "Fetch Error",
                    description: error.message,
                });
            }
        };
        fetchThumbnails();
    }, [id]);

    // Load cấu hình player từ localStorage khi component mount
    useEffect(() => {
        const savedConfig = JSON.parse(localStorage.getItem("playerConfig"));
        if (savedConfig) {
            setCurrentIndex(savedConfig.currentIndex || 0);
            setIsRandom(savedConfig.isRandom || false);
            setIsRepeat(savedConfig.isRepeat || false);
        }
    }, []);

    // Lưu cấu hình player vào localStorage mỗi khi các trạng thái thay đổi
    useEffect(() => {
        const config = { currentIndex, isRandom, isRepeat };
        localStorage.setItem("playerConfig", JSON.stringify(config));
    }, [currentIndex, isRandom, isRepeat]);

    // Hàm helper để lấy chỉ số bài hát ngẫu nhiên không trùng với bài hiện tại
    const getRandomIndex = (currentIdx, length) => {
        if (length === 0) return 0;
        if (playedIndices.current.length === length) {
            playedIndices.current = []; // Reset khi tất cả bài đã được phát
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
        cdElement.style.zIndex = newWidth > 0 ? 10 : -1;
        playlistEl.style.marginTop = `${newWidth + 170}px`;
        playlistEl.style.height = `calc(100vh - ${newWidth + 230}px)`;
    };

    // Hàm load bài hát hiện tại, nếu isFirst=true thì không tự động phát
    const loadCurrentSong = (isFirst = false) => {
        if (audioRef.current && sings[currentIndex]) {
            const audioUrl = sings[currentIndex].audio_url;
            audioRef.current.src = audioUrl;
            audioRef.current.load();
            audioRef.current.currentTime = 0;
            if (!isFirst) {
                audioRef.current.play();
                setIsPlaying(true);
            } else {
                setIsPlaying(false);
            }
            // Cập nhật query vào URL (shallow routing để không reload trang)
            router.push(`${id}?sing=${currentIndex}`, undefined, { shallow: true });
            if (progressRef.current) {
                progressRef.current.value = 0;
                progressRef.current.style.background = `linear-gradient(to right, #EC1F55 0%, #d3d3d3 0%)`;
            }
        }
    };

    // Xử lý phát/tạm dừng audio, thêm toast khi không thể phát
    const handlePlayPause = () => {
        if (!audioRef.current) return;
        if (isPlaying) {
            audioRef.current.pause();
            setIsPlaying(false);
        } else {
            const playPromise = audioRef.current.play();
            if (playPromise !== undefined) {
                playPromise
                    .then(() => {
                        setIsPlaying(true);
                    })
                    .catch((error) => {
                        // Thông báo lỗi bằng toast thay vì console.error
                        addToast({
                            type: "error",
                            title: "Audio Error",
                            description: "Không thể phát audio. Vui lòng thử lại.",
                        });
                    });
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
    const handlePrev = () => {
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
    };

    const toggleRandom = () => setIsRandom((prev) => !prev);
    const toggleRepeat = () => setIsRepeat((prev) => !prev);

    const onAudioPlay = () => setIsPlaying(true);
    const onAudioPause = () => setIsPlaying(false);

    // Khi audio kết thúc, nếu chế độ repeat bật thì phát lại, ngược lại chuyển bài tiếp theo
    const onAudioEnded = () => {
        if (isRepeat) {
            audioRef.current.play();
        } else {
            handleNext();
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
                    <h2 className="font-bold text-xl">
                        {sings[currentIndex]?.singname || "Default Song"}
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
                    <button className="text-gray-600 p-4" onClick={toggleRepeat}>
                        <Repeat fontSize="medium" className={`${isRepeat ? "text-red-500" : ""}`} />
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
                style={{ marginTop: "320px", height: "calc(100vh - 360px)" }}
            >
                {sings.map((sing, index) => (
                    <div
                        key={sing._id + index}
                        className={`flex items-center p-4 mb-3 rounded-lg shadow cursor-pointer ${index === currentIndex ? "bg-[#EC1F55] text-white" : "bg-white"
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
