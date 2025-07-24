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
    Checkbox,
    FormControlLabel,
    Typography,
    Paper,
    Alert,
    Stack
} from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';

import Swal from 'sweetalert2';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import DialogContentText from '@mui/material/DialogContentText';

import BookTypeService from '../../services/BookTypeService';

const booktypeservice = new BookTypeService();


const BookType = () => {

    const [data, setData] = useState([]);
    const [createbooktype, setcreatebooktype] = useState([]);
    const [openeditdialog, setOpeneditdialog] = useState(false);
    const [editdata, setEditdata] = useState({
        id: null,
        aciklama: null
    });


    const columns = [
        {
            field: 'id',
            headerName: 'Kitap Tür Kodu',
            width: 150,
            editable: false,

        },
        {
            field: 'aciklama',
            headerName: 'Açıklama',
            width: 150,
            editable: true,
        },
        {
            field: 'İşlemler',
            headerName: 'İşlemler',
            sortable: false,
            width: 269,
            editable: false,
            renderCell: (params) => (
                <Stack direction="row" spacing={1} justifyContent="left" alignItems="center">
                    <Button
                        variant="contained"
                        size="large"
                        color="error"
                        startIcon={<DeleteIcon />}
                        sx={{ backgroundColor: 'red' }}
                        onClick={() => handleDelete(params.row.id)}
                    >
                        Sil
                    </Button>
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
        getbooktype();
    }, [])


    const handleDelete = async (id) => {
        try {
            const response = await booktypeservice.deletebooktype(id);
            if (response) {
                Swal.fire({
                    icon: 'success',
                    title: 'Başarılı',
                    text: response?.message || 'Kitap türü başarıyla silindi',
                })
                getbooktype();
            }
        }
        catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Hata',
                text: error?.response?.data?.message || 'Kitap türü silinemedi',
            })
            console.error(error);
        }
    }



    const handleEditClick = async (row) => {
        try {
            const response = await booktypeservice.getbooktypebyid(row.id);
            if (response) {
                const data = response.data.data[0]
                setEditdata({
                    id: data.kitap_tur_kodu,
                    aciklama: data.aciklama
                });
                console.log(editdata);
                console.log(data);
                setOpeneditdialog(true);
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Hata',
                text: error?.response?.data?.message || 'Kitap türü bilgileri alınamadı',
            });
        }
    };

    const disabledbuttonandinput = () => {
        if (createbooktype.aciklama === "" || createbooktype.aciklama === null) {
            return true;
        }
        else {
            return false
        }
    }



    const handleEditSubmit = async () => {
        try {
            const response = await booktypeservice.booktypeupdatebyid(
                {
                    kitap_tur_kodu: editdata.id,
                    aciklama: editdata.aciklama
                }
            );
            if (response) {
                Swal.fire({
                    icon: 'success',
                    title: 'Başarılı',
                    text: 'Kitap türü başarıyla güncellendi',
                });
                setOpeneditdialog(false);
                getbooktype();
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Hata',
                text: error?.response?.data?.message || 'Kitap türü güncellenirken bir hata oluştu',
            });
        }
    };

    const createbooktyperequest = async () => {
        if (!createbooktype.aciklama) {
            Swal.fire({
                icon: 'error',
                title: 'Hata',
                text: 'Açıklama alanı boş olamaz',
            });
            return;
        }
        try {
            const response = await booktypeservice.createbooktype({
                aciklama: createbooktype.aciklama
            })
            if (response) {
                Swal.fire({
                    icon: 'success',
                    title: 'Başarılı',
                    text: response?.message || 'Kitap türü başarıyla eklendi',
                });
                setcreatebooktype({
                    aciklama: ''
                });
                getbooktype();
            }
        }
        catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Hata',
                text: error?.response?.data?.message || 'Kitap türü eklenirken bir hata oluştu',
            });
        }
    }

    const getbooktype = async () => {
        try {
            const response = await booktypeservice.getbooktypes();
            if (response) {
                const formattedData = response.data.data.map(element => ({
                    id: element.kitap_tur_kodu,
                    aciklama: element.aciklama
                }));
                setData(formattedData);
            }
        }
        catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Hata',
                text: error?.response?.data?.message || 'Kitap türü bilgileri alınamadı' || error,
            })
        }
    }



    return (
        <>
            <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
                <Box sx={{ width: '100%', mb: 4, textAlign: 'center' }}>
                    <Typography variant="h4" component="h1" gutterBottom>
                        Kitap Türü Listesi
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary">
                        Kütüphanedeki tüm kitap türlerini buradan yönetebilirsiniz.
                    </Typography>
                </Box>
                <Paper elevation={3} sx={{ width: '50%', mb: 4, p: 2, mx: 'auto' }}>
                    <Stack direction="row" spacing={2} justifyContent="center" alignItems="center" sx={{ mb: 2 }}>
                        <TextField
                            label="Açıklama"
                            variant="outlined"
                            value={createbooktype.aciklama}
                            onChange={(e) => setcreatebooktype({ ...createbooktype, aciklama: e.target.value })}
                            sx={{ width: '100%' }}
                        />
                    </Stack>
                    <Button variant="contained"
                        onClick={createbooktyperequest}
                        disabled={disabledbuttonandinput()}
                    >Kitap Türü Ekle</Button>
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
                open={openeditdialog}
                onClose={() => setOpeneditdialog(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>
                    <DialogContentText>
                        Kitap Türü Düzenle
                    </DialogContentText>
                </DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Açıklama"
                        value={editdata.aciklama}
                        onChange={(e) => setEditdata({ ...editdata, aciklama: e.target.value })}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpeneditdialog(false)}>İptal</Button>
                    <Button onClick={handleEditSubmit} variant="contained" color="primary">
                        Kaydet
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}



export default BookType;