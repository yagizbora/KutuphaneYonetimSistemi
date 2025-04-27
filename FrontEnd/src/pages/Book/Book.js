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
import BookService from '../../services/BookService';
import Swal from 'sweetalert2';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const bookService = new BookService();

const Book = () => {
    const [data, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [selectedBook, setSelectedBook] = useState(null);
    const [editedBook, setEditedBook] = useState(null);

    useEffect(() => {
        getBooks();
    }, []);

    const getBooks = async () => {
        try {
            setLoading(true);
            const response = await bookService.getBooks();
            if (Array.isArray(response)) {
                setBooks(response);
            } else if (response && Array.isArray(response.data)) {
                setBooks(response.data);
            } else {
                setError("API yanıtı beklenen formatta değil");
                setBooks([]);
            }
        } catch (error) {
            setError("Kitaplar yüklenirken bir hata oluştu.");
            setBooks([]);
        } finally {
            setLoading(false);
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedBook(null);
        setEditedBook(null);
    };

    const handleShowModal = async (bookData) => {
        try {
            const bookDetails = await bookService.getbooksbyid(bookData.id);
            const selectedBookData = bookDetails[0];
            setSelectedBook(selectedBookData);
            setEditedBook(selectedBookData);
            setShowModal(true);
        } catch (error) {
            Swal.fire({
                title: 'Hata',
                text: error?.response?.message,
                icon: 'error'
            });
        }
    };

    const handleInputChange = (e) => {
        const { name, value, checked } = e.target;
        setEditedBook(prev => ({
            ...prev,
            [name]: name === 'durum' ? checked : value
        }));
    };

    const handleUpdate = async () => {
        try {
            const response = await bookService.updateBook(editedBook.id, editedBook);
            if (response.status === 200 || response) {
                Swal.fire({
                    title: 'Başarılı',
                    text: response?.message || 'Kitap başarıyla güncellendi!',
                    icon: 'success'
                });
                await getBooks();
                handleCloseModal();
            }
        } catch (error) {
            Swal.fire({
                title: 'Hata',
                text: error?.response?.data?.message || 'Güncelleme sırasında bir hata oluştu!',
                icon: 'error'
            });
        }
    };

    const handleDelete = async (id) => {
        try {
            const result = await Swal.fire({
                title: 'Emin misiniz?',
                text: "Bu kitabı silmek istediğinize emin misiniz?",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Evet, sil!',
                cancelButtonText: 'İptal'
            });

            if (result.isConfirmed) {
                const response = await bookService.deleteBook(id);
                await getBooks();

                Swal.fire({
                    title: 'Başarılı!',
                    text: response?.message || 'Kitap başarıyla silindi!',
                    icon: 'success'
                });
            }
        } catch (error) {
            Swal.fire({
                title: 'Hata!',
                text: error?.response?.data?.message || 'Silme işlemi sırasında bir hata oluştu!',
                icon: 'error'
            });
        }
    };

    const columns = [
        { field: 'id', headerName: 'ID', width: 90 },
        { field: 'kitap_adi', headerName: 'Kitap Adı', width: 200, flex: 1 },
        { field: 'yazar_adi', headerName: 'Yazar Adı', width: 150, flex: 1 },
        { field: 'yazar_soyadi', headerName: 'Yazar Soyadı', width: 150, flex: 1 },
        { field: 'isbn', headerName: 'ISBN', width: 130 },
        {
            field: 'durum',
            headerName: 'Durum',
            width: 120,
            renderCell: (params) => (
                <Checkbox
                    checked={params.value || false}
                    disabled
                />
            )
        },
        { field: 'kitap_tur', headerName: 'Kitap Türü', width: 150, flex: 1 },
        {
            field: 'actions',
            headerName: 'İşlemler',
            width: 200,
            sortable: false,
            renderCell: (params) => (
                <Stack direction="row" spacing={1}>
                    <Button
                        variant="contained"
                        size="small"
                        onClick={() => handleShowModal(params.row)}
                        startIcon={<EditIcon />}
                    >
                        Detay
                    </Button>
                    <Button
                        variant="contained"
                        color="error"
                        size="small"
                        onClick={() => handleDelete(params.row.id)}
                        startIcon={<DeleteIcon />}
                    >
                        Sil
                    </Button>
                </Stack>
            )
        }
    ];

    return (
        <Container maxWidth="xl">
            <Box sx={{ width: '100%', mb: 4, textAlign: 'center' }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Kitap Listesi
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                    Kütüphanedeki tüm kitapları buradan yönetebilirsiniz.
                </Typography>
            </Box>

            <Paper elevation={3} sx={{ width: '100%', mb: 4, p: 2 }}>
                <Box sx={{ height: 600, width: '100%' }}>
                    <DataGrid
                        rows={data}
                        columns={columns}
                        pageSize={10}
                        rowsPerPageOptions={[10, 25, 50]}
                        disableSelectionOnClick
                        disableColumnSorting
                        loading={loading}
                        components={{
                            Toolbar: GridToolbar
                        }}
                        sx={{
                            boxShadow: 2,
                            border: 2,
                            borderColor: 'primary.light',
                            '& .MuiDataGrid-cell:hover': {
                                color: 'primary.main',
                            },
                        }}
                    />
                </Box>
            </Paper>

            <Dialog
                open={showModal}
                onClose={handleCloseModal}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>Kitap Detayları</DialogTitle>
                <DialogContent>
                    {editedBook ? (
                        <Box component="form" sx={{ mt: 2 }}>
                            <Stack spacing={3}>
                                <TextField
                                    fullWidth
                                    label="Kitap Adı"
                                    name="kitap_adi"
                                    value={editedBook.kitap_adi || ''}
                                    onChange={handleInputChange}
                                    variant="outlined"
                                />

                                <TextField
                                    fullWidth
                                    label="Yazar Adı"
                                    name="yazar_adi"
                                    value={editedBook.yazar_adi || ''}
                                    onChange={handleInputChange}
                                    variant="outlined"
                                />

                                <TextField
                                    fullWidth
                                    label="Yazar Soyadı"
                                    name="yazar_soyadi"
                                    value={editedBook.yazar_soyadi || ''}
                                    onChange={handleInputChange}
                                    variant="outlined"
                                />

                                <TextField
                                    fullWidth
                                    label="ISBN"
                                    name="isbn"
                                    value={editedBook.isbn || ''}
                                    onChange={handleInputChange}
                                    variant="outlined"
                                />

                                <TextField
                                    fullWidth
                                    label="Kitap Türü"
                                    name="kitap_tur"
                                    value={editedBook.kitap_tur || ''}
                                    onChange={handleInputChange}
                                    variant="outlined"
                                />

                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            name="durum"
                                            checked={editedBook.durum || false}
                                            onChange={handleInputChange}
                                            disabled={true}
                                        />
                                    }
                                    label="Durum"
                                />
                            </Stack>
                        </Box>
                    ) : (
                        <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                            <Typography>Yükleniyor...</Typography>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseModal} color="inherit">
                        İptal
                    </Button>
                    <Button onClick={handleUpdate} variant="contained">
                        Kaydet
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default Book;