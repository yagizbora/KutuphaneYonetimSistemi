import React, { useState, useEffect } from 'react';
import {
    Container,
    Box,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Typography,
    Paper,
    Stack,
    DialogContentText
} from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';

import Swal from 'sweetalert2';
import EditIcon from '@mui/icons-material/Edit';

import BookTypeGroupService from '../../services/BookTypeGroupService';

const bookTypeGroupService = new BookTypeGroupService();

const BookTypeGroup = () => {

    const [data, setData] = useState([]);
    const [createGroup, setCreateGroup] = useState({
        book_types_group: ''
    });
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [editData, setEditData] = useState({
        id: null,
        book_types_group: ''
    });

    const columns = [
        {
            field: 'id',
            headerName: 'ID',
            width: 150,
            editable: false,
        },
        {
            field: 'book_types_group',
            headerName: 'Kitap Tür Grubu',
            width: 300,
            editable: true,
        },
        {
            field: 'İşlemler',
            headerName: 'İşlemler',
            sortable: false,
            width: 150,
            editable: false,
            renderCell: (params) => (
                <Stack direction="row" spacing={1} justifyContent="left" alignItems="center">
                    <Button
                        variant="contained"
                        size="large"
                        color="primary"
                        startIcon={<EditIcon />}
                        onClick={() => handleEditClick(params.row)}
                    >
                        Düzenle
                    </Button>
                </Stack>
            )
        }
    ];

    useEffect(() => {
        getGroups();
    }, []);

    const getGroups = async () => {
        try {
            const response = await bookTypeGroupService.GetBookTypeGroup();
            if (response && response.data) {
                const sourceData = Array.isArray(response.data) ? response.data : (response.data.data || []);
                const formattedData = sourceData.map(element => ({
                    id: element.id,
                    book_types_group: element.book_types_group
                }));
                setData(formattedData);
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Hata',
                text: error?.response?.data?.message || 'Kitap tür grupları alınamadı',
            });
        }
    };

    const handleEditClick = (row) => {
        setEditData({
            id: row.id,
            book_types_group: row.book_types_group
        });
        setOpenEditDialog(true);
    };

    const handleEditSubmit = async () => {
        if (!editData.book_types_group) {
            Swal.fire({
                icon: 'warning',
                title: 'Uyarı',
                text: 'Kitap tür grubu alanı boş olamaz',
            });
            return;
        }
        try {
            const response = await bookTypeGroupService.UpdateBookTypeGroup({
                id: editData.id,
                book_types_group: editData.book_types_group
            });
            if (response) {
                Swal.fire({
                    icon: 'success',
                    title: 'Başarılı',
                    text: 'Kitap tür grubu başarıyla güncellendi',
                });
                setOpenEditDialog(false);
                getGroups();
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Hata',
                text: error?.response?.data?.message || 'Güncellenirken bir hata oluştu',
            });
        }
    };

    const createGroupRequest = async () => {
        if (!createGroup.book_types_group) {
            Swal.fire({
                icon: 'warning',
                title: 'Uyarı',
                text: 'Kitap tür grubu alanı boş olamaz',
            });
            return;
        }
        try {
            const response = await bookTypeGroupService.AddBookTypeGroup({
                book_types_group: createGroup.book_types_group
            });
            if (response) {
                Swal.fire({
                    icon: 'success',
                    title: 'Başarılı',
                    text: 'Kitap tür grubu başarıyla eklendi',
                });
                setCreateGroup({ book_types_group: '' });
                getGroups();
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Hata',
                text: error?.response?.data?.message || 'Eklenirken bir hata oluştu',
            });
        }
    };

    const disabledButtonAndInput = () => {
        return !createGroup.book_types_group || createGroup.book_types_group.trim() === "";
    };

    return (
        <>
            <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
                <Box sx={{ width: '100%', mb: 4, textAlign: 'center' }}>
                    <Typography variant="h4" component="h1" gutterBottom>
                        Kitap Tür Grupları Listesi
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary">
                        Kütüphanedeki tüm kitap tür gruplarını buradan yönetebilirsiniz.
                    </Typography>
                </Box>
                <Paper elevation={3} sx={{ width: '50%', mb: 4, p: 2, mx: 'auto' }}>
                    <Stack direction="row" spacing={2} justifyContent="center" alignItems="center" sx={{ mb: 2 }}>
                        <TextField
                            label="Kitap Tür Grubu Adı"
                            variant="outlined"
                            value={createGroup.book_types_group}
                            onChange={(e) => setCreateGroup({ ...createGroup, book_types_group: e.target.value })}
                            sx={{ width: '100%' }}
                        />
                    </Stack>
                    <Button 
                        variant="contained"
                        onClick={createGroupRequest}
                        disabled={disabledButtonAndInput()}
                    >
                        Kitap Tür Grubu Ekle
                    </Button>
                </Paper>

                <Paper elevation={3} sx={{ width: '50%', mb: 4, p: 2, mx: 'auto' }}>
                    <Stack direction="row" spacing={2} justifyContent="center" alignItems="center">
                        <Box sx={{ height: 600, width: '100%' }}>
                            <DataGrid
                                rows={data}
                                columns={columns}
                                pageSize={10}
                                rowsPerPageOptions={[10, 25, 50]}
                                disableSelectionOnClick
                                resize
                                disableColumnSorting
                                components={{
                                    Toolbar: GridToolbar,
                                }}
                            />
                        </Box>
                    </Stack>
                </Paper>
            </Container>

            <Dialog
                open={openEditDialog}
                onClose={() => setOpenEditDialog(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>
                    <DialogContentText>
                        Kitap Tür Grubu Düzenle
                    </DialogContentText>
                </DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Kitap Tür Grubu Adı"
                        value={editData.book_types_group}
                        onChange={(e) => setEditData({ ...editData, book_types_group: e.target.value })}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenEditDialog(false)}>İptal</Button>
                    <Button onClick={handleEditSubmit} variant="contained" color="primary">
                        Kaydet
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default BookTypeGroup;