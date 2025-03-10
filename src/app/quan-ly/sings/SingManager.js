'use client';
import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, Select, InputLabel, FormControl, CircularProgress } from '@mui/material';
import { useToast } from '../../../context/Toast';

const SingManager = () => {
    const { addToast } = useToast();
    const [sings, setSings] = useState([]);
    const [thumbnails, setThumbnails] = useState([]);
    const [selectedThumbnail, setSelectedThumbnail] = useState('');
    const [open, setOpen] = useState(false);
    const [singData, setSingData] = useState({ singname: '', author: '', audio_url: '', image_url: '', parent: '' });
    const [editMode, setEditMode] = useState(false);
    const [currentSingId, setCurrentSingId] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchThumbnails();
    }, []);

    useEffect(() => {
        if (selectedThumbnail) {
            fetchSings(selectedThumbnail);
        }
    }, [selectedThumbnail]);

    const fetchThumbnails = async () => {
        setLoading(true);
        try {
            const response = await fetch(`/api/manager/thumbnails`);
            const data = await response.json();
            setThumbnails(data.thumbnails);
        } catch (error) {
            console.error('Không thể lấy dữ liệu thumbnails', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchSings = async (thumbnailId) => {
        setLoading(true);
        try {
            const response = await fetch(`/api/manager/sings?parent=${thumbnailId}`);
            const data = await response.json();
            setSings(data.Sings);
        } catch (error) {
            console.error('Không thể lấy dữ liệu sings', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteSing = async (singId) => {
        setLoading(true);
        try {
            const response = await fetch(`/api/manager/sings?id=${singId}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                addToast({ type: 'success', title: 'Thành công', description: 'Xóa sing thành công' });
                fetchSings(selectedThumbnail);
            } else {
                addToast({ type: 'error', title: 'Thất bại', description: 'Xóa sing thất bại' });
            }
        } catch (error) {
            console.error('Xóa sing thất bại', error);
            addToast({ type: 'error', title: 'Thất bại', description: 'Xóa sing thất bại' });
        } finally {
            setLoading(false);
        }
    };

    const handleOpenDialog = () => {
        setOpen(true);
    };

    const handleCloseDialog = () => {
        setOpen(false);
        setSingData({ singname: '', author: '', audio_url: '', image_url: '', parent: '' });
        setEditMode(false);
        setCurrentSingId(null);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSingData({ ...singData, [name]: value });
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        setSingData({ ...singData, [name]: files[0] });
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const method = editMode ? 'PUT' : 'POST';
            const url = editMode ? `/api/manager/sings?id=${currentSingId}` : '/api/manager/sings';
            const formData = new FormData();
            formData.append('singname', singData.singname);
            formData.append('author', singData.author);
            formData.append('parent', editMode ? singData.parent : selectedThumbnail);
            if (singData.audio instanceof File) {
                formData.append('audio', singData.audio);
            }
            if (singData.image instanceof File) {
                formData.append('image', singData.image);
            }

            const response = await fetch(url, {
                method,
                body: formData,
            });
            if (response.ok) {
                addToast({ type: 'success', title: 'Thành công', description: editMode ? 'Cập nhật sing thành công' : 'Tạo sing thành công' });
                fetchSings(selectedThumbnail);
                handleCloseDialog();
            } else {
                addToast({ type: 'error', title: 'Thất bại', description: editMode ? 'Cập nhật sing thất bại' : 'Tạo sing thất bại' });
            }
        } catch (error) {
            console.error(editMode ? 'Cập nhật sing thất bại' : 'Tạo sing thất bại', error);
            addToast({ type: 'error', title: 'Thất bại', description: editMode ? 'Cập nhật sing thất bại' : 'Tạo sing thất bại' });
        } finally {
            setLoading(false);
        }
    };

    const handleEditSing = (sing) => {
        setSingData({
            singname: sing.singname || '',
            author: sing.author || '',
            audio_url: sing.audio_url || '',
            image_url: sing.image_url || '',
            parent: sing.parent || ''
        });
        setEditMode(true);
        setCurrentSingId(sing._id);
        handleOpenDialog();
    };

    const handleThumbnailChange = (event) => {
        setSelectedThumbnail(event.target.value);
    };

    const handleParentChange = (event) => {
        setSingData({ ...singData, parent: event.target.value });
    };

    const handlePlayPause = (e) => {
        const audio = e.target.closest('.audio-container').querySelector('audio');
        if (audio.paused) {
            audio.play();
            e.target.textContent = 'Pause';
        } else {
            audio.pause();
            e.target.textContent = 'Play';
        }
    };

    return (
        <Paper>
            <FormControl fullWidth margin="normal">
                <InputLabel id="thumbnail-select-label">Chọn Thumbnail</InputLabel>
                <Select
                    labelId="thumbnail-select-label"
                    value={selectedThumbnail}
                    onChange={handleThumbnailChange}
                    disabled={loading}
                >
                    {thumbnails.map((thumbnail) => (
                        <MenuItem key={thumbnail._id} value={thumbnail._id}>
                            {thumbnail.title}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <Button variant="contained" color="primary" onClick={handleOpenDialog} disabled={!selectedThumbnail || loading}>
                Thêm Sing
            </Button>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>STT</TableCell>
                            <TableCell>Tiêu đề</TableCell>
                            <TableCell>Nghệ sĩ</TableCell>
                            <TableCell>Hình ảnh</TableCell>
                            <TableCell>Audio</TableCell>
                            <TableCell>Hành động</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={6} align="center">
                                    <CircularProgress />
                                </TableCell>
                            </TableRow>
                        ) : (
                            sings && sings.map((sing, index) => (
                                <TableRow key={sing._id}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{sing.singname}</TableCell>
                                    <TableCell>{sing.author}</TableCell>
                                    <TableCell>
                                        <img src={sing.image_url} alt={sing.singname} width="100" />
                                    </TableCell>
                                    <TableCell>
                                        <div className="audio-container relative w-full h-10 bg-gray-200 rounded-lg overflow-hidden flex items-center justify-center">
                                            <audio className="hidden">
                                                <source src={sing.audio_url} type="audio/mpeg" />
                                                Your browser does not support the audio element.
                                            </audio>
                                            <button onClick={handlePlayPause} className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 w-20">
                                                Play
                                            </button>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Button variant="contained" color="secondary" onClick={() => handleEditSing(sing)} disabled={loading}>
                                            Sửa
                                        </Button>
                                        <Button variant="contained" color="secondary" onClick={() => handleDeleteSing(sing._id)} disabled={loading}>
                                            Xóa
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            <Dialog open={open} onClose={handleCloseDialog}>
                <DialogTitle>{editMode ? 'Cập nhật Sing' : 'Thêm Sing'}</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        name="singname"
                        label="Tiêu đề"
                        type="text"
                        fullWidth
                        value={singData.singname}
                        onChange={handleInputChange}
                        disabled={loading}
                    />
                    <TextField
                        margin="dense"
                        name="author"
                        label="Nghệ sĩ"
                        type="text"
                        fullWidth
                        value={singData.author}
                        onChange={handleInputChange}
                        disabled={loading}
                    />
                    <TextField
                        margin="dense"
                        name="audio_url"
                        label="URL Audio"
                        type="text"
                        fullWidth
                        value={singData.audio_url}
                        onChange={handleInputChange}
                        disabled={loading}
                    />
                    <input
                        type="file"
                        name="audio"
                        onChange={handleFileChange}
                        disabled={loading}
                    />
                    <TextField
                        margin="dense"
                        name="image_url"
                        label="URL Hình ảnh"
                        type="text"
                        fullWidth
                        value={singData.image_url}
                        onChange={handleInputChange}
                        disabled={loading}
                    />
                    <input
                        type="file"
                        name="image"
                        onChange={handleFileChange}
                        disabled={loading}
                    />
                    {editMode && (
                        <FormControl fullWidth margin="normal">
                            <InputLabel id="parent-select-label">Chọn Parent</InputLabel>
                            <Select
                                labelId="parent-select-label"
                                value={singData.parent}
                                onChange={handleParentChange}
                                disabled={loading}
                            >
                                {thumbnails.map((thumbnail) => (
                                    <MenuItem key={thumbnail._id} value={thumbnail._id}>
                                        {thumbnail.title}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary" disabled={loading}>
                        Hủy
                    </Button>
                    <Button onClick={handleSubmit} color="primary" disabled={loading}>
                        {editMode ? 'Cập nhật' : 'Thêm'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Paper>
    );
};

export default SingManager;
