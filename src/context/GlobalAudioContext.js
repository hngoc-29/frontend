'use client';
import { createContext, useContext, useRef, useState, useEffect } from 'react';
import { AudioProvider } from './AudioContext';
import { useToast } from './Toast';

const GlobalAudioContext = createContext();

export const GlobalAudioProvider = ({ children }) => {
    const { addToast } = useToast();
    const [globalAudioState, setGlobalAudioState] = useState({
        isPlaying: false,
        currentSong: null,
        currentIndex: null,
        audioUrl: '',
        id: '',
        currentPage: '',
    });

    // Đảm bảo chỉ có một instance audio
    const audioRef = useRef(null);

    useEffect(() => {
        // Khởi tạo audio trong useEffect để đảm bảo chạy ở phía client
        if (!audioRef.current && typeof window !== 'undefined') {
            audioRef.current = new Audio();
        }
    }, []);

    // Flag để đánh dấu đã khởi tạo
    const isInitialized = useRef(false);
    // Sử dụng ref để theo dõi nếu đang chuyển trang
    const isNavigating = useRef(false);
    // Flag để đánh dấu có tương tác người dùng chưa
    const hasUserInteracted = useRef(false);

    // Khôi phục trạng thái khi ứng dụng load lại
    useEffect(() => {

        // Thiết lập audio khi component mount
        if (!audioRef.current && typeof window !== 'undefined') {
            audioRef.current = new Audio();
        }

        if (audioRef.current) {
            // Xử lý khi audio kết thúc
            audioRef.current.onended = () => {
                setGlobalAudioState(prev => ({ ...prev, isPlaying: false }));
            };

            // Lắng nghe các sự kiện play/pause để đồng bộ trạng thái
            audioRef.current.addEventListener('play', () => {
                setGlobalAudioState(prev => {
                    if (prev.isPlaying) return prev;
                    return { ...prev, isPlaying: true };
                });
            });

            audioRef.current.addEventListener('pause', () => {
                const keepPlaying = sessionStorage?.getItem("keepPlaying") === "true";

                if (!keepPlaying) {
                    setGlobalAudioState(prev => {
                        if (!prev.isPlaying) return prev;
                        return { ...prev, isPlaying: false };
                    });
                }
            });
        }

        // Đánh dấu tương tác người dùng khi có click vào document
        const handleUserInteraction = () => {
            hasUserInteracted.current = true;
            document.removeEventListener('click', handleUserInteraction);
        };

        document.addEventListener('click', handleUserInteraction);

        // Khôi phục trạng thái từ session storage
        const restoreState = () => {
            try {
                const savedState = sessionStorage?.getItem("previousState");
                const savedTime = sessionStorage?.getItem("audioCurrentTime");
                const savedIsPlaying = sessionStorage?.getItem("isAudioPlaying") === "true";
                const keepPlaying = sessionStorage?.getItem("keepPlaying") === "true";

                if (savedState) {
                    const parsedState = JSON.parse(savedState);
                    const { isPlaying, currentSong, id } = parsedState || {};

                    if (!currentSong) return;

                    const isAudioActuallyPlaying = audioRef.current && !audioRef.current.paused;
                    const shouldPlay = (keepPlaying || savedIsPlaying || isPlaying) && !isAudioActuallyPlaying;

                    const pathname = window.location.pathname || '';
                    const isCorrectPage = id && pathname.includes(`/${id}`);

                    setGlobalAudioState(prev => ({
                        ...prev,
                        isPlaying: isAudioActuallyPlaying || (shouldPlay && isCorrectPage),
                        currentSong,
                        id,
                        currentPage: pathname
                    }));

                    if (audioRef.current && currentSong.audio_url) {
                        if (audioRef.current.src !== currentSong.audio_url) {
                            if (isAudioActuallyPlaying) {
                                audioRef.current.pause();
                            }
                            audioRef.current.src = currentSong.audio_url;
                        }

                        if (savedTime && !isNaN(parseFloat(savedTime))) {
                            if (!isAudioActuallyPlaying || Math.abs(audioRef.current.currentTime - parseFloat(savedTime)) > 1) {
                                audioRef.current.currentTime = parseFloat(savedTime);
                            }
                            sessionStorage?.removeItem("audioCurrentTime");
                        }

                        if (shouldPlay && hasUserInteracted.current && !isAudioActuallyPlaying && isCorrectPage) {
                            try {
                                const playPromise = audioRef.current.play();
                                if (playPromise) {
                                    playPromise.catch(error => {
                                        setGlobalAudioState(prev => ({ ...prev, isPlaying: false }));
                                        addToast({
                                            type: "error",
                                            title: "Lỗi phát nhạc",
                                            description: "Không thể phát bài hát này, vui lòng thử lại sau.",
                                        });
                                    });
                                }
                            } catch (err) {
                                addToast({
                                    type: "error",
                                    title: "Lỗi phát nhạc",
                                    description: "Không thể phát bài hát này, vui lòng thử lại sau.",
                                });
                            }
                        }
                    }
                }

                sessionStorage?.removeItem("keepPlaying");
            } catch (error) {
                addToast({
                    type: "error",
                    title: "Lỗi khôi phục trạng thái",
                    description: "Không thể khôi phục trạng thái phát nhạc, vui lòng thử lại sau.",
                });
            }
        };

        restoreState();

        // Hàm hiển thị FloatingAudioPlayer
        const showFloatingPlayer = () => {
            if (!globalAudioState.currentSong) return;

            const pathname = window.location.pathname;
            const isPlayerPage = globalAudioState.id && pathname.includes(`/${globalAudioState.id}`);
            const shouldShowPlayer = globalAudioState.currentSong && !isPlayerPage;

            // Kiểm tra trạng thái phát trực tiếp từ audio element
            const isAudioPlaying = audioRef.current && !audioRef.current.paused;

            // Thêm điều kiện: phải có audio đang phát hoặc đã có trạng thái phát
            if (shouldShowPlayer && (isAudioPlaying || globalAudioState.isPlaying)) {
                setTimeout(() => {
                    const floatingPlayer = document.querySelector('.floating-audio-player');
                    if (floatingPlayer) {
                        floatingPlayer.style.display = 'flex';
                    }
                }, 50);

                // Đồng bộ trạng thái nếu cần
                if (isAudioPlaying !== globalAudioState.isPlaying) {
                    setGlobalAudioState(prev => ({ ...prev, isPlaying: isAudioPlaying }));
                }
            }
        };

        // Xử lý chuyển trang
        const handleRouteChange = () => {
            isNavigating.current = true;

            // Lưu trạng thái hiện tại
            if (audioRef.current && globalAudioState.currentSong) {
                // Kiểm tra trạng thái phát trực tiếp từ audio element
                const isAudioPlaying = !audioRef.current.paused;

                sessionStorage.setItem("audioCurrentTime", audioRef.current.currentTime);
                sessionStorage.setItem("isAudioPlaying", isAudioPlaying.toString());
                sessionStorage.setItem("previousState", JSON.stringify({
                    isPlaying: isAudioPlaying, // Sử dụng trạng thái thực tế
                    currentSong: globalAudioState.currentSong,
                    id: globalAudioState.id
                }));

                // Đặt keepPlaying để không pause audio
                if (isAudioPlaying) {
                    sessionStorage.setItem("keepPlaying", "true");
                    // Đặt cờ hiển thị floating player
                    sessionStorage.setItem("showFloatingPlayer", "true");
                }
            }

            // Cập nhật trạng thái trang
            const pathname = window.location.pathname;
            setGlobalAudioState(prev => {
                // Không thay đổi isPlaying, chỉ cập nhật currentPage

                if (prev.currentPage === pathname) return prev;
                return { ...prev, currentPage: pathname };
            });

            // Hiển thị floating player
            setTimeout(() => {
                showFloatingPlayer();
                isNavigating.current = false;
            }, 100);
        };

        // Lắng nghe sự kiện popstate (back/forward)
        window.addEventListener('popstate', handleRouteChange);

        // Thêm MutationObserver để theo dõi thay đổi DOM
        const observer = new MutationObserver((mutations) => {
            // Chỉ xử lý khi có thay đổi đáng kể trong DOM
            if (mutations.some(mutation => mutation.addedNodes.length > 0)) {
                if (!isNavigating.current) {
                    showFloatingPlayer();
                }
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // Kiểm tra và hiển thị floating player ban đầu
        showFloatingPlayer();

        // Lưu trạng thái khi tab bị đóng hoặc refresh
        window.addEventListener('beforeunload', () => {
            if (audioRef.current && globalAudioState.currentSong) {
                // Kiểm tra trạng thái phát trực tiếp từ audio element
                const isAudioPlaying = !audioRef.current.paused;

                sessionStorage.setItem("audioCurrentTime", audioRef.current.currentTime);
                sessionStorage.setItem("isAudioPlaying", isAudioPlaying.toString());
                sessionStorage.setItem("previousState", JSON.stringify({
                    isPlaying: isAudioPlaying, // Sử dụng trạng thái thực tế
                    currentSong: globalAudioState.currentSong,
                    id: globalAudioState.id
                }));
            }
        });

        // Lưu trạng thái khi app chuyển sang nền
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'hidden' && audioRef.current && globalAudioState.currentSong) {
                // Kiểm tra trạng thái phát trực tiếp từ audio element
                const isAudioPlaying = !audioRef.current.paused;

                sessionStorage.setItem("audioCurrentTime", audioRef.current.currentTime);
                sessionStorage.setItem("isAudioPlaying", isAudioPlaying.toString());
                sessionStorage.setItem("previousState", JSON.stringify({
                    isPlaying: isAudioPlaying, // Sử dụng trạng thái thực tế
                    currentSong: globalAudioState.currentSong,
                    id: globalAudioState.id
                }));
            }
        });

        // Cleanup khi unmount
        return () => {
            window.removeEventListener('popstate', handleRouteChange);
            document.removeEventListener('click', handleUserInteraction);
            observer.disconnect();

            if (audioRef.current) {
                // Xóa event listeners
                const clonedRef = audioRef.current;
                audioRef.current.onended = null;
                clonedRef.removeEventListener('play', () => { });
                clonedRef.removeEventListener('pause', () => { });
            }

            // QUAN TRỌNG: KHÔNG dừng audio khi provider unmount
            // Vì nó sẽ làm gián đoạn việc phát nhạc khi chuyển trang

            // Lưu trạng thái
            if (audioRef.current && globalAudioState.currentSong) {
                // Kiểm tra trạng thái phát trực tiếp từ audio element
                const isAudioPlaying = !audioRef.current.paused;

                sessionStorage.setItem("audioCurrentTime", audioRef.current.currentTime);
                sessionStorage.setItem("isAudioPlaying", isAudioPlaying.toString());
                sessionStorage.setItem("previousState", JSON.stringify({
                    isPlaying: isAudioPlaying, // Sử dụng trạng thái thực tế
                    currentSong: globalAudioState.currentSong,
                    id: globalAudioState.id
                }));

                // Đảm bảo audio không bị dừng
                if (isAudioPlaying) {
                    sessionStorage.setItem("keepPlaying", "true");
                    sessionStorage.setItem("showFloatingPlayer", "true");
                }
            }
        };
    }, []); // Chỉ chạy một lần khi mount

    // Sử dụng useEffect riêng để xử lý thay đổi trạng thái globalAudioState
    useEffect(() => {
        if (!isInitialized.current) return;

        // Cập nhật hiển thị FloatingAudioPlayer mỗi khi state thay đổi
        const pathname = window.location.pathname;
        const isPlayerPage = globalAudioState.id && pathname.includes(`/${globalAudioState.id}`);
        const shouldShowPlayer = globalAudioState.currentSong && !isPlayerPage;

        // Kiểm tra trạng thái phát trực tiếp từ audio element
        const isAudioActuallyPlaying = audioRef.current && !audioRef.current.paused;

        // Đồng bộ trạng thái audio với globalAudioState
        if (audioRef.current && globalAudioState.currentSong) {
            // Đồng bộ trạng thái phát
            if (globalAudioState.isPlaying && audioRef.current.paused) {
                // Chỉ phát khi đã có tương tác người dùng
                if (hasUserInteracted.current) {
                    const playPromise = audioRef.current.play();
                    if (playPromise) {
                        playPromise.catch(error => {
                            setGlobalAudioState(prev => ({ ...prev, isPlaying: false }));
                            addToast({
                                type: "error",
                                title: "Lỗi phát nhạc",
                                description: "Không thể phát bài hát này, vui lòng thử lại sau.",
                            });
                        });
                    }
                }
            } else if (!globalAudioState.isPlaying && !audioRef.current.paused) {
                // Nếu không đang trong quá trình chuyển trang
                const keepPlaying = sessionStorage.getItem("keepPlaying") === "true";
                if (!keepPlaying) {
                    audioRef.current.pause();
                }
            } else if (isAudioActuallyPlaying !== globalAudioState.isPlaying) {
                // Đồng bộ trạng thái nếu không khớp
                setGlobalAudioState(prev => ({ ...prev, isPlaying: isAudioActuallyPlaying }));
            }
        }

        // Cập nhật hiển thị FloatingAudioPlayer
        if (shouldShowPlayer && (globalAudioState.isPlaying || isAudioActuallyPlaying)) {
            const floatingPlayer = document.querySelector('.floating-audio-player');
            if (floatingPlayer) {
                floatingPlayer.style.display = 'flex';
            }
        }
    }, [globalAudioState]);

    return (
        <AudioProvider>
            <GlobalAudioContext.Provider value={{ globalAudioState, setGlobalAudioState, audioRef, hasUserInteracted }}>
                {children}
            </GlobalAudioContext.Provider>
        </AudioProvider>
    );
};

export const useGlobalAudio = () => useContext(GlobalAudioContext);
