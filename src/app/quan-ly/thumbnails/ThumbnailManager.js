'use client';
import React, { useState, useEffect, useContext } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { useToast } from '../../../context/Toast';

const ThumbnailManager = () => {
    const { addToast } = useToast();
    const [thumbnails, setThumbnails] = useState([]);
    const [open, setOpen] = useState(false);
    const [thumbnailData, setThumbnailData] = useState({ title: '', image_url: '', description: '' });
    const [editMode, setEditMode] = useState(false);
    const [currentThumbnailId, setCurrentThumbnailId] = useState(null);

    useEffect(() => {
        fetchThumbnails();
    }, []);

    const fetchThumbnails = async () => {
        try {
            const response = await fetch(`/api/manager/thumbnails`);
            const data = await response.json();
            setThumbnails(data.thumbnails);
        } catch (error) {
            console.error('Không thể lấy dữ liệu thumbnails', error);
        }
    };

    const handleDeleteThumbnail = async (thumbnailId) => {
        try {
            const response = await fetch(`/api/manager/thumbnails?id=${thumbnailId}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                addToast({ type: 'success', title: 'Thành công', description: 'Xóa thumbnail thành công' });
                fetchThumbnails();
            } else {
                addToast({ type: 'error', title: 'Thất bại', description: 'Xóa thumbnail thất bại' });
            }
        } catch (error) {
            console.error('Xóa thumbnail thất bại', error);
            addToast({ type: 'error', title: 'Thất bại', description: 'Xóa thumbnail thất bại' });
        }
    };

    const handleOpenDialog = () => {
        setOpen(true);
    };

    const handleCloseDialog = () => {
        setOpen(false);
        setThumbnailData({ title: '', image_url: '', description: '' });
        setEditMode(false);
        setCurrentThumbnailId(null);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setThumbnailData({ ...thumbnailData, [name]: value });
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        setThumbnailData({ ...thumbnailData, [name]: files[0] });
    };

    const handleSubmit = async () => {
        try {
            const method = editMode ? 'PUT' : 'POST';
            const url = editMode ? `/api/manager/thumbnails?id=${currentThumbnailId}` : '/api/manager/thumbnails';
            const formData = new FormData();
            formData.append('title', thumbnailData.title);
            formData.append('description', thumbnailData.description);
            if (thumbnailData.image_url instanceof File) {
                formData.append('image', thumbnailData.image_url);
            } else {
                formData.append('image_url', thumbnailData.image_url);
            }

            const response = await fetch(url, {
                method,
                body: formData,
            });
            if (response.ok) {
                addToast({ type: 'success', title: 'Thành công', description: editMode ? 'Cập nhật thumbnail thành công' : 'Tạo thumbnail thành công' });
                fetchThumbnails();
                handleCloseDialog();
            } else {
                addToast({ type: 'error', title: 'Thất bại', description: editMode ? 'Cập nhật thumbnail thất bại' : 'Tạo thumbnail thất bại' });
            }
        } catch (error) {
            console.error(editMode ? 'Cập nhật thumbnail thất bại' : 'Tạo thumbnail thất bại', error);
            addToast({ type: 'error', title: 'Thất bại', description: editMode ? 'Cập nhật thumbnail thất bại' : 'Tạo thumbnail thất bại' });
        }
    };

    const handleEditThumbnail = (thumbnail) => {
        setThumbnailData({
            title: thumbnail.title || '',
            image_url: thumbnail.image_url || '',
            description: thumbnail.description || ''
        });
        setEditMode(true);
        setCurrentThumbnailId(thumbnail._id);
        handleOpenDialog();
    };

    return (
        <Paper>
            <Button variant="contained" color="primary" onClick={handleOpenDialog}>
                Thêm Thumbnail
            </Button>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Tiêu đề</TableCell>
                            <TableCell>Hình ảnh</TableCell>
                            <TableCell>Mô tả</TableCell>
                            <TableCell>Hành động</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {thumbnails && thumbnails.map((thumbnail) => (
                            <TableRow key={thumbnail._id}>
                                <TableCell>{thumbnail._id}</TableCell>
                                <TableCell>{thumbnail.title}</TableCell>
                                <TableCell>
                                    <img src={thumbnail.image_url || null} alt={thumbnail.title} width="100" />
                                </TableCell>
                                <TableCell>{thumbnail.description}</TableCell>
                                <TableCell>
                                    <Button variant="contained" color="secondary" onClick={() => handleEditThumbnail(thumbnail)}>
                                        Sửa
                                    </Button>
                                    <Button variant="contained" color="secondary" onClick={() => handleDeleteThumbnail(thumbnail._id)}>
                                        Xóa
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Dialog open={open} onClose={handleCloseDialog}>
                <DialogTitle>{editMode ? 'Cập nhật Thumbnail' : 'Thêm Thumbnail'}</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        name="title"
                        label="Tiêu đề"
                        type="text"
                        fullWidth
                        value={thumbnailData.title}
                        onChange={handleInputChange}
                    />
                    <TextField
                        margin="dense"
                        name="description"
                        label="Mô tả"
                        type="text"
                        fullWidth
                        value={thumbnailData.description}
                        onChange={handleInputChange}
                    />
                    <TextField
                        margin="dense"
                        name="image_url"
                        label="URL Hình ảnh"
                        type="text"
                        fullWidth
                        value={thumbnailData.image_url}
                        onChange={handleInputChange}
                    />
                    <input
                        type="file"
                        name="image"
                        onChange={handleFileChange}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary">
                        Hủy
                    </Button>
                    <Button onClick={handleSubmit} color="primary">
                        {editMode ? 'Cập nhật' : 'Thêm'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Paper>
    );
};

export default ThumbnailManager;
