'use client';
import { useGlobalAudio } from '../context/GlobalAudioContext';
import { PlayArrow, Pause, SkipPrevious, SkipNext, Close, OpenInFull } from '@mui/icons-material';
import { useEffect, useState, useRef } from 'react';
import { useAudio } from '../context/AudioContext';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

const FloatingAudioPlayer = () => {
    const router = useRouter();
    const { globalAudioState, setGlobalAudioState, audioRef } = useGlobalAudio();
    const { currentIndex, setCurrentIndex, sings, isRepeat, isRandom } = useAudio();
    const [isVisible, setIsVisible] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: typeof window !== 'undefined' ? window.innerHeight - 96 : 0 }); // Initial position higher up
    const [dragging, setDragging] = useState(false);
    const [rel, setRel] = useState(null);
    const playedIndices = useRef([]);
    const pathname = usePathname();
    const [isDragging, setIsDragging] = useState(false);
    const [wasDragged, setWasDragged] = useState(false);
    const [titleCurrent, setTitleCurrent] = useState('');
    const [isExpanded, setIsExpanded] = useState(true); // State to manage expanded/collapsed state

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
        if (e && e.stopPropagation) e.stopPropagation(); // Ngăn chặn event bubbling

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
                            console.log("Không thể phát audio:", error);
                            alert("Không thể phát nhạc. Vui lòng thử lại.");
                        });
                }
            }
        }
    };

    const handleNext = (e) => {
        if (e && e.stopPropagation) e.stopPropagation(); // Ngăn chặn event bubbling
        const isRepeat = (JSON.parse(localStorage.getItem('playerConfig')) || {}).isRepeat;
        const isRandom = (JSON.parse(localStorage.getItem('playerConfig')) || {}).isRandom;
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
                    console.log("Không thể phát audio:", error);
                });
            }
        }
    };

    const handlePrev = (e) => {
        if (e && e.stopPropagation) e.stopPropagation(); // Ngăn chặn event bubbling
        setCurrentIndex((prevIndex) => (prevIndex - 1 + sings.length) % sings.length);
        if (audioRef.current) {
            audioRef.current.src = sings[(currentIndex - 1 + sings.length) % sings.length].audio_url; // Cập nhật src
            audioRef.current.play().catch(error => {
                console.log("Không thể phát audio:", error);
            });
        }
    };

    // Hàm để lấy chỉ số bài hát ngẫu nhiên không trùng với bài hiện tại
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

        if (audioRef.current) {
            audioRef.current.addEventListener('timeupdate', checkCurrentTime);
        }

        return () => {
            if (audioRef.current) {
                audioRef.current.removeEventListener('timeupdate', checkCurrentTime);
            }
        };
    }, [audioRef, handleNext]);

    useEffect(() => {
        if (titleCurrent && document.title !== titleCurrent) {
            document.title = titleCurrent;
        }
    }, [document.title, titleCurrent, pathname]);

    useEffect(() => {
        if (sings && sings[currentIndex] && sings[currentIndex]._id) {
            setTitleCurrent(sings[currentIndex].singname + ` - ${sings[currentIndex].author}`);
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
    }, [currentIndex, sings, handlePlayPause, handlePrev, handleNext]);
    useEffect(() => {
        if (audioRef.current) {
            const currentSongUrl = sings[currentIndex]?.audio_url;
            if (audioRef.current.src !== currentSongUrl) {
                audioRef.current.src = currentSongUrl;
                audioRef.current.play().catch(error => {
                    console.error("Không thể phát audio:", error);
                });
            }
        }
    }, [currentIndex, sings]);
    const handleMouseDown = (e) => {
        if (e.button !== 0) return;
        setRel({
            x: e.clientX - position.x, // Use clientX for accurate relative position
            y: e.clientY - position.y
        });
        setDragging(true);
        setWasDragged(false);
        e.stopPropagation();
        e.preventDefault();
    };

    const handleMouseUp = () => {
        setDragging(false);
        setIsDragging(false);
    };

    const handleMouseMove = (e) => {
        if (!dragging) return;
        let newX = e.clientX - rel.x; // Use clientX for consistent dragging
        let newY = e.clientY - rel.y;

        // Calculate boundaries
        const playerWidth = isExpanded ? 420 : 48; // Adjust width as needed
        const playerHeight = 48; // Adjust height as needed
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;

        // Check if player is outside the screen boundaries
        const isOutsideLeft = newX + playerWidth < 0;
        const isOutsideRight = newX > screenWidth;
        const isOutsideTop = newY + playerHeight < 0;
        const isOutsideBottom = newY > screenHeight;

        if (isOutsideLeft || isOutsideRight || isOutsideTop || isOutsideBottom) {
            setIsVisible(false); // Hide the player if dragged outside
        } else {
            setIsVisible(true); // Show the player if within boundaries
        }

        // Update position while keeping it within the screen
        if (newX < -playerWidth) newX = -playerWidth;
        if (newY < -playerHeight) newY = -playerHeight;
        if (newX > screenWidth) newX = screenWidth;
        if (newY > screenHeight) newY = screenHeight;

        setPosition({ x: newX, y: newY });
        setWasDragged(true);

        e.stopPropagation();
        e.preventDefault();
    };

    const handleTouchStart = (e) => {
        if (e.touches.length !== 1) return;
        const pos = e.target.getBoundingClientRect();
        setRel({
            x: e.touches[0].clientX - pos.left,
            y: e.touches[0].clientY - pos.top
        });
        setDragging(true);
        setWasDragged(false);
        e.stopPropagation();
        // Avoid preventDefault unless absolutely necessary
    };

    const handleTouchMove = (e) => {
        if (!dragging || e.touches.length !== 1) return;
        let newX = e.touches[0].clientX - rel.x;
        let newY = e.touches[0].clientY - rel.y;

        // Dynamically calculate boundaries based on screen size
        const playerWidth = isExpanded ? (window.innerWidth < 768 ? 280 : 420) : 48; // Adjust width for small screens
        const playerHeight = 48; // Adjust height as needed
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;

        if (newX < 0) newX = 0; // Prevent sticking to the left
        if (newY < 0) newY = 0; // Prevent sticking to the top
        if (newX > screenWidth - playerWidth) newX = screenWidth - playerWidth; // Prevent sticking to the right
        if (newY > screenHeight - playerHeight) newY = screenHeight - playerHeight; // Prevent sticking to the bottom

        setPosition({ x: newX, y: newY });
        setWasDragged(true);

        e.stopPropagation();
        // Avoid preventDefault unless absolutely necessary
    };

    const handleClick = (e) => {
        if (!wasDragged && isExpanded) {
            setIsExpanded(false);
            router.back();
        }
    };

    const handleToggleExpand = (e) => {
        if (e && e.stopPropagation) e.stopPropagation();
        if (isExpanded) {
            setIsExpanded(false);
        } else {
            setIsExpanded(true);
        }
    };

    useEffect(() => {
        const handleScroll = () => {
            // Remove scroll-based y update to keep the player fixed
            setPosition((prevPosition) => ({
                ...prevPosition,
                y: prevPosition.y // Keep y unchanged
            }));
        };

        if (typeof window !== 'undefined') {
            window.addEventListener('scroll', handleScroll);
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
            document.addEventListener('touchstart', handleTouchStart, { passive: true }); // Set passive: true for better performance
            document.addEventListener('touchmove', handleTouchMove, { passive: true }); // Set passive: true for better performance
            document.addEventListener('touchend', handleMouseUp);
        }
        return () => {
            if (typeof window !== 'undefined') {
                window.removeEventListener('scroll', handleScroll);
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
                document.removeEventListener('touchstart', handleTouchStart, { passive: true }); // Set passive: true for better performance
                document.removeEventListener('touchmove', handleTouchMove, { passive: true }); // Set passive: true for better performance
                document.removeEventListener('touchend', handleMouseUp);
            }
        };
    }, [dragging]);

    // Nếu không hiển thị, return null để không render gì
    if (!sings.length || !isVisible) {
        return null;
    }

    // Vị trí hiển thị khác nhau tùy thuộc vào thiết bị
    const positionClass = `fixed z-[1000] ${isExpanded ? `min-w-[280px] md:min-w-[320px] lg:min-w-[420px]` : `w-[48px] h-[48px]`} ${isExpanded ? `bg-white` : `bg-transparent`} p-${!isExpanded ? 0 : 4} shadow-lg rounded-lg flex items-center cursor-pointer floating-audio-player overflow-hidden`;

    return (
        <div
            className={positionClass}
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
            onClick={handleClick}
            style={{
                top: `${position.y}px`,
                left: `${position.x}px`,
                position: 'fixed',
                clipPath: isVisible ? 'inset(0)' : 'inset(100%)', // Dynamically hide player
                touchAction: 'none', // Disable default touch gestures
            }}
        >
            <button onClick={(e) => handleToggleExpand(e)} className={`z-10 ${!isExpanded ? `p-0` : `ml-2`}`} aria-label="Toggle">
                {isExpanded ? <Close className='mr-2 ml-[-4px]' /> : <Image src={`/api/proxy-image?url=${encodeURIComponent(sings[currentIndex]?.image_url)}`} alt="Open" className="z-20 w-[48px] h-[48px] rounded-full" width={48} height={48} />}
            </button>
            {isExpanded && (
                <>
                    <div className="mr-4">
                        <Image
                            src={`/api/proxy-image?url=${encodeURIComponent(sings[currentIndex]?.image_url)}`}
                            alt={sings[currentIndex]?.singname}
                            className="w-12 h-12 rounded-full"
                            width={48}
                            height={48}
                            loading="lazy"
                        />
                    </div>
                    <div className="flex-1">
                        <h4 className="text-sm font-bold truncate max-w-[120px] md:max-w-[150px] lg:max-w-[180px]">
                            {sings[currentIndex]?.singname}
                        </h4>
                        <p className="text-xs truncate max-w-[120px] md:max-w-[150px] lg:max-w-[180px]">
                            {sings[currentIndex]?.author}
                        </p>
                    </div>
                    <button onClick={handlePrev} className="ml-2 z-20" aria-label="Previous">
                        <SkipPrevious />
                    </button>
                    <button onClick={handlePlayPause} className="ml-2 z-20" aria-label={globalAudioState.isPlaying ? "Pause" : "Play"}>
                        {globalAudioState.isPlaying ? <Pause /> : <PlayArrow />}
                    </button>
                    <button onClick={handleNext} className="ml-2 z-20" aria-label="Next">
                        <SkipNext />
                    </button>
                </>
            )}
            <style jsx>{`
                @media (max-width: 768px) {
                    .floating-audio-player {
                        min-width: 280px; /* Reduce width for small screens */
                        padding: 2px; /* Adjust padding */
                    }
                }
            `}</style>
        </div>
    );
};

export default FloatingAudioPlayer;
