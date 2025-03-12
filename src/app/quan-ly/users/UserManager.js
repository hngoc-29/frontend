'use client';
import React, { useState, useEffect, useContext } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination, Button, CircularProgress } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { useToast } from '../../../context/Toast';
import { checkToken } from '../../../components/TokenRefresher';

const UserManager = () => {
    const { addToast } = useToast();
    const [users, setUsers] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [totalUsers, setTotalUsers] = useState(0);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        fetchUsers();
    }, [page, rowsPerPage]);
    const fetchUsers = async () => {
        setLoading(true);
        try {
            await checkToken(); // Check and refresh token if needed
            const response = await fetch(`/api/manager/getuser?page=${page + 1}&limit=${rowsPerPage}`);
            const data = await response.json();
            setUsers(data.users);
            setTotalUsers(data.totalUsers);
        } catch (error) {
            console.error('Không thể lấy dữ liệu người dùng', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteUser = async (userId) => {
        setLoading(true);
        try {
            await checkToken(); // Check and refresh token if needed
            const response = await fetch(`/api/manager/deleteuser?id=${userId}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                addToast({ type: 'success', title: 'Thành công', description: 'Xóa người dùng thành công' });
                fetchUsers();
            } else {
                addToast({ type: 'error', title: 'Thất bại', description: 'Xóa người dùng thất bại' });
            }
        } catch (error) {
            console.error('Xóa người dùng thất bại', error);
            addToast({ type: 'error', title: 'Thất bại', description: 'Xóa người dùng thất bại' });
        } finally {
            setLoading(false);
        }
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    return (
        <Paper>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Vai trò</TableCell>
                            <TableCell>Xác thực</TableCell>
                            <TableCell>Hành động</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={5} align="center">
                                    <CircularProgress />
                                </TableCell>
                            </TableRow>
                        ) : (
                            users && users.map((user) => (
                                <TableRow key={user._id}>
                                    <TableCell>{user._id}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>{user.role}</TableCell>
                                    <TableCell>{user.verify ? <CheckIcon color="success" /> : <CloseIcon color="error" />}</TableCell>
                                    <TableCell>
                                        <Button variant="contained" color="secondary" onClick={() => handleDeleteUser(user._id)} disabled={loading}>
                                            Xóa
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={totalUsers}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Paper>
    );
};

export default UserManager;
