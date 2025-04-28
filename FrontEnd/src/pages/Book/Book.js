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
    Grid,
    Select,
    MenuItem,
    Stack
} from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import BookService from '../../services/BookService';
import BookTypeService from '../../services/BookTypeService';
import Swal from 'sweetalert2';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const bookService = new BookService();
const bookTypeService = new BookTypeService();

const Book = () => {
    const [data, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [createbookmodal, setCreateBookModal] = useState(false);
    const [selectedBook, setSelectedBook] = useState(null);
    const [editedBook, setEditedBook] = useState(null);
    const [typeofbook, setTypeofbook] = useState({
        kitap_tur_kodu: "",
        aciklama: ""
    });

    const [bookTypes, setBookTypes] = useState([]);
    const [createofbook, setCreateofbook] = useState({
        "kitap_adi": "",
        "yazar_adi": "",
        "yazar_soyadi": "",
        "isbn": 0,
    })

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

    const createbookmodalopen = async () => {
        const response = await bookTypeService.getbooktypes();
        if (response) {
            setBookTypes(response.data.data);
            setCreateBookModal(true);
        }
    }

    const createbook = async () => {
        const response = await bookService.createbook({
            "kitap_adi": createofbook.kitap_adi,
            "yazar_adi": createofbook.yazar_adi,
            "yazar_soyadi": createofbook.yazar_soyadi,
            "isbn": createofbook.isbn,
            "kitap_tur_kodu": typeofbook.kitap_tur_kodu,
        })
        if (response) {
            Swal.fire({
                title: 'Başarılı',
                text: response?.message || 'Kitap başarıyla eklendi!',
                icon: 'success'
            });
            await getBooks();
            setCreateBookModal(false);
            setCreateofbook({
                "kitap_adi": "",
                "yazar_adi": "",
                "yazar_soyadi": "",
                "isbn": 0,
            })
        }
    }

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
            <div>
                <Box sx={{ display: 'flex', mb: 2, bgcolor: '#cfe8fc' }}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => createbookmodalopen(true)}
                    >
                        Yeni Kitap Ekle
                    </Button>
                </Box>
            </div>
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
                open={createbookmodal}
                onClose={() => setCreateBookModal(false)}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>Yeni Kitap Ekle</DialogTitle>
                <DialogContent>
                    <Grid container flex spacing={2}>
                        <Grid container flex spacing={2}>
                            {/* İlk Satır: Kitap Türü, Kitap Adı ve Yazar Adı */}
                            <Grid item xs={12} md={4}>
                                <p>Kitap Türü</p>
                                <Select
                                    value={typeofbook.kitap_tur_kodu}
                                    onChange={(e) => setTypeofbook({ ...typeofbook, kitap_tur_kodu: e.target.value })}>
                                    {bookTypes.map((type) => (
                                        <MenuItem key={type.kitap_tur_kodu} value={type.kitap_tur_kodu}>
                                            {type.aciklama}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <p>Kitap Adı</p>
                                <TextField
                                    fullWidth
                                    label="Kitap Adı"
                                    name="kitap_adi"
                                    value={createofbook.kitap_adi || ''}
                                    onChange={(e) => setCreateofbook({ ...createofbook, kitap_adi: e.target.value })}
                                    variant="outlined"
                                />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <p>Yazar Adı</p>
                                <TextField
                                    fullWidth
                                    label="Yazar Adı"
                                    name="yazar_adi"
                                    value={createofbook.yazar_adi || ''}
                                    onChange={(e) => setCreateofbook({ ...createofbook, yazar_adi: e.target.value })}
                                    variant="outlined"
                                />
                            </Grid>
                        </Grid>

                        <Grid container flex spacing={2}>
                            {/* İkinci Satır: Yazar Soyadı ve ISBN */}
                            <Grid item xs={12} md={4}>
                                <p>Yazar Soyadı</p>
                                <TextField
                                    fullWidth
                                    label="Yazar Soyadı"
                                    name="yazar_soyadi"
                                    value={createofbook.yazar_soyadi || ''}
                                    onChange={(e) => setCreateofbook({ ...createofbook, yazar_soyadi: e.target.value })}
                                    variant="outlined"
                                />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <p>ISBN</p>
                                <TextField
                                    fullWidth
                                    label="ISBN"
                                    name="isbn"
                                    value={createofbook.isbn || ''}
                                    onChange={(e) => setCreateofbook({ ...createofbook, isbn: e.target.value })}
                                    variant="outlined"
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => createbook()}
                        color="inherit"
                        sx={{ margin: 2 }}
                    >
                        Kitap oluştur
                    </Button>
                </DialogActions>
            </Dialog>


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