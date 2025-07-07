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
    FormControl,
    InputLabel,
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
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import AuthorService from "../../services/AuthorService.js";
import LibraryService from '../../services/LibraryService.js';
const libraryService = new LibraryService();
const authorService = new AuthorService();
const bookService = new BookService();
const bookTypeService = new BookTypeService();

const Book = () => {
    const [data, setBooks] = useState([]);

    const [loading, setLoading] = useState(true);
    const [authors, setAuthors] = useState([]);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [createbookmodal, setCreateBookModal] = useState(false);
    const [selectedBook, setSelectedBook] = useState(null);
    const [editedBook, setEditedBook] = useState(null);
    const [typeofbook, setTypeofbook] = useState({
        kitap_tur_kodu: "",
        aciklama: ""
    });
    const [filterbooks, setFilterBooks] = useState({});
    const [typeofFilterbook, setTypeofFilterbook] = useState({
        kitap_tur_kodu: "",
        aciklama: ""
    });
    const [libraries, setLibraries] = useState([]);
    const [bookTypes, setBookTypes] = useState([]);
    const [createofbook, setCreateofbook] = useState({
        "kitap_adi": "",
        "yazar_adi": "",
        "yazar_soyadi": "",
        "isbn": 0,
        "library_id": 0,
    })

    useEffect(() => {
        getBooks();
        getbooktypesfilter();
        fetchAuthors();
        getlibraries();
    }, []);

    const getbooktypesfilter = async () => {
        try {
            const response = await bookTypeService.getbooktypes();
            if (response) {
                setTypeofFilterbook(response.data.data);
            }
        } catch (error) {
            console.error("Kitap türleri yüklenirken bir hata oluştu:", error);
        }
    }
    const getlibraries = async () => {
        try {
            const response = await libraryService.GetLibraries();
            if (response) {
                setLibraries(response.data.data);
            }
        } catch (error) {
            console.error("Kütüphaneler yüklenirken bir hata oluştu:", error);
        }
    }

    const clearfilter = async () => {
        setFilterBooks({});

        await getBooks();
    };

    const getBooks = async () => {
        try {
            setLoading(true);
            const response = await bookService.getBooks({});
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


    const getbookexcel = async () => {
        try {
            const response = await bookService.getbookexcel(filterbooks);
            if (response) {
                Swal.fire({
                    title: 'Başarılı',
                    text: 'Excel dosyası indirildi.',
                    icon: 'success'
                });
            }
        } catch (error) {
            Swal.fire({
                title: 'Hata',
                text: error.response?.data?.message || 'Excel dosyası indirilirken bir hata oluştu.',
                icon: 'error'
            });
        }
    }



    const fetchAuthors = async () => {
        try {
            const response = await authorService.getAllAuthors();
            setAuthors(response.data);
        } catch (error) {
            Swal.fire('Error', 'Failed to fetch authors', 'error');
        } finally {
            setLoading(false);
        }
    };

    const searchbooks = async () => {
        try {
            const response = await bookService.getBooks(filterbooks);
            if (response) {
                console.log(response);
                setBooks(response.data);
            }
        }
        catch (error) {
            Swal.fire({
                title: 'Hata',
                text: error?.response?.message,
                icon: 'error'
            })
        }
    }

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedBook(null);
        setEditedBook(null);
    };

    const handleShowModal = async (bookData) => {
        try {
            const response = await bookTypeService.getbooktypes();
            if (response) {
                setBookTypes(response.data.data);
            }
            const bookDetails = await bookService.getbooksbyid(bookData.id);
            await fetchAuthors();
            await getlibraries();
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
            await fetchAuthors();
            await getlibraries();
            setCreateBookModal(true);
        }
    }

    const createbook = async () => {
        const payload = {
            kitap_adi: createofbook.kitap_adi || "",
            author_id: createofbook.author_id ?? 0,
            isbn: createofbook.isbn || "",
            kitap_tur_kodu: Number(createofbook.kitap_tur_kodu) || 0,
            library_id: createofbook.library_id || 0
        };

        const response = await bookService.createbook(payload);

        if (response) {
            Swal.fire({
                title: "Başarılı",
                text: response?.message || "Kitap başarıyla eklendi!",
                icon: "success",
            });
            await getBooks();
            setCreateBookModal(false);
            setCreateofbook({
                kitap_adi: "",
                author_id: null,
                isbn: "",
                kitap_tur_kodu: null,
            });
        }
    };


    const handleInputChange = (e) => {
        const { name, value } = e.target;


        setEditedBook((prevData) => ({
            ...prevData,
            [name]: value,
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
        { field: 'author_name', headerName: 'Yazar Adı ve soyadı', width: 150, flex: 1 },
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
        {
            field: 'library_name', headerName: 'Kütüphane Adı', width: 150, flex: 1,
            renderCell: (params) => {
                return params.value ? params.value : "Kütüphane Atanmamış";
            }
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
                <Box sx={{ display: 'flex', mb: 2, gap: 2, bgcolor: '#cfe8fc', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', p: 2 }}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => createbookmodalopen(true)}
                    >
                        Yeni Kitap Ekle
                    </Button>
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => getbookexcel()}
                    >
                        Excel İndir
                    </Button>
                </Box>
            </div>
            <Typography variant="h6" gutterBottom>
                Filtre
            </Typography>
            <Paper elevation={3} sx={{ width: '100%', mb: 4, p: 2 }}>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
                    <TextField
                        label="Kitap Adı"
                        value={filterbooks.kitap_adi || ""}
                        onChange={(e) => setFilterBooks(prev => ({ ...prev, kitap_adi: e.target.value }))}
                    />

                    <FormControl variant="outlined" sx={{ minWidth: 200 }}>
                        <InputLabel id="demo-multiple-name-label">Yazarlar</InputLabel>
                        <Select
                            labelId="demo-multiple-name-label"
                            id="demo-multiple-name"
                            label="Yazarlar"
                            value={filterbooks.author_id ?? ""}
                            onChange={(e) =>
                                setFilterBooks((prev) => ({
                                    ...prev,
                                    author_id: e.target.value,
                                }))
                            }
                        >
                            {Array.isArray(authors) && authors.map((author) => (
                                <MenuItem key={author.id} value={author.id}>
                                    {author.name_surname}
                                </MenuItem>
                            ))}

                        </Select>
                    </FormControl>

                    <TextField
                        label="ISBN"
                        value={filterbooks.isbn || ""}
                        onChange={(e) => setFilterBooks(prev => ({ ...prev, isbn: e.target.value }))}
                    />

                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={filterbooks.durum || false}
                                onChange={(e) => setFilterBooks(prev => ({ ...prev, durum: e.target.checked }))}
                            />
                        }
                        label="Durum"
                        sx={{ alignItems: 'center', display: 'flex' }}
                    />

                    <FormControl variant="outlined" sx={{ minWidth: 200 }}>
                        <InputLabel id="demo-multiple-name-label">Kitap Türü</InputLabel>
                        <Select
                            labelId="demo-multiple-name-label"
                            id="demo-multiple-name"
                            label="Kitap Türü"
                            value={filterbooks.kitap_tur_kodu ?? ""}
                            onChange={(e) =>
                                setFilterBooks((prev) => ({
                                    ...prev,
                                    kitap_tur_kodu: e.target.value,
                                }))
                            }
                        >
                            {Array.isArray(typeofFilterbook) && typeofFilterbook.map((type) => (
                                <MenuItem key={type.kitap_tur_kodu} value={type.kitap_tur_kodu}>
                                    {type.aciklama}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl variant="outlined" sx={{ minWidth: 200 }}>
                        <InputLabel id="library-select-label">Kütüphane</InputLabel>
                        <Select
                            labelId="library-select-label"
                            id="library-select"
                            label="Kütüphane"
                            value={filterbooks.library_id ?? ""}
                            onChange={(e) =>
                                setFilterBooks((prev) => ({
                                    ...prev,
                                    library_id: e.target.value,
                                }))
                            }
                        >
                            {Array.isArray(libraries) && libraries.map((library) => (
                                <MenuItem key={library.id} value={library.id}>
                                    {library.library_name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <IconButton aria-label="search" size="large" onClick={() => { searchbooks() }}>
                        <SearchIcon />
                    </IconButton>

                    <IconButton onClick={() => { clearfilter() }} aria-label="delete" size="large">
                        <DeleteIcon />
                    </IconButton>

                </Box>
            </Paper>


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
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>Yeni Kitap Ekle</DialogTitle>
                <DialogContent>
                    <Box component="form" sx={{ mt: 2 }}>
                        <Stack spacing={3}>

                            {/* Kitap Adı */}
                            <TextField
                                fullWidth
                                label="Kitap Adı"
                                name="kitap_adi"
                                value={createofbook.kitap_adi || ''}
                                onChange={(e) =>
                                    setCreateofbook(prev => ({ ...prev, kitap_adi: e.target.value }))
                                }
                                variant="outlined"
                            />

                            {/* Yazarlar Select */}
                            <FormControl fullWidth variant="outlined">
                                <InputLabel id="author-select-label">Yazarlar</InputLabel>
                                <Select
                                    labelId="demo-multiple-name-label"
                                    id="demo-multiple-name"
                                    label="Yazarlar"
                                    value={createofbook.author_id ?? ""}
                                    onChange={(e) => {
                                        setCreateofbook((prev) => ({
                                            ...prev,
                                            author_id: Number(e.target.value),
                                        }));
                                    }}
                                >
                                    {Array.isArray(authors) &&
                                        authors.map((author) => (
                                            <MenuItem key={author.id} value={author.id}>
                                                {author.name_surname}
                                            </MenuItem>
                                        ))}
                                </Select>
                            </FormControl>

                            {/* ISBN */}
                            <TextField
                                fullWidth
                                label="ISBN"
                                name="isbn"
                                value={createofbook.isbn || ''}
                                onChange={(e) =>
                                    setCreateofbook(prev => ({ ...prev, isbn: e.target.value }))
                                }
                                variant="outlined"
                            />

                            {/* Kitap Türü Select */}
                            <FormControl fullWidth variant="outlined">
                                <InputLabel id="kitap-tur-select-label">Kitap Türü</InputLabel>
                                <Select
                                    labelId="kitap-tur-select-label"
                                    id="kitap-tur-select"
                                    value={createofbook.kitap_tur_kodu || ""}
                                    label="Kitap Türü"
                                    onChange={(e) =>
                                        setCreateofbook(prev => ({
                                            ...prev,
                                            kitap_tur_kodu: e.target.value,
                                        }))
                                    }
                                >
                                    {bookTypes.map(type => (
                                        <MenuItem key={type.kitap_tur_kodu} value={type.kitap_tur_kodu}>
                                            {type.aciklama}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <FormControl fullWidth variant="outlined">
                                <InputLabel id="library-select-label">Kütüphaneler</InputLabel>
                                <Select
                                    labelId="library-select-label"
                                    id="library-select"
                                    value={createofbook.library_id || ""}
                                    label="Kitap Türü"
                                    onChange={(e) =>
                                        setCreateofbook(prev => ({
                                            ...prev,
                                            library_id: e.target.value,
                                        }))
                                    }
                                >
                                    {libraries.map(item => (
                                        <MenuItem key={item.id} value={item.id}>
                                            {item.library_name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                        </Stack>
                    </Box>
                </DialogContent>
                <DialogActions sx={{ pr: 3, pb: 2 }}>
                    <Button onClick={createbook} variant="contained" color="primary">
                        Kitap Oluştur
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

                                <FormControl variant="outlined" sx={{ minWidth: 200 }}>
                                    <InputLabel id="demo-multiple-name-label">Yazarlar</InputLabel>
                                    <Select
                                        labelId="demo-multiple-name-label"
                                        id="demo-multiple-name"
                                        label="Yazarlar"
                                        value={editedBook.author_id ?? ""}
                                        onChange={(e) => {
                                            const selectedAuthorId = parseInt(e.target.value);
                                            setEditedBook((prev) => ({
                                                ...prev,
                                                author_id: selectedAuthorId,
                                            }));
                                        }}
                                    >
                                        {Array.isArray(authors) && authors.map((author) => (
                                            <MenuItem key={author.id} value={author.id}>
                                                {author.name_surname}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>

                                <TextField
                                    fullWidth
                                    label="ISBN"
                                    name="isbn"
                                    value={editedBook.isbn || ''}
                                    onChange={handleInputChange}
                                    variant="outlined"
                                />
                                <Select
                                    fullWidth
                                    label="Kitap Türü"
                                    name="kitap_tur_kodu"
                                    value={editedBook.kitap_tur_kodu || ''}
                                    onChange={handleInputChange}
                                    variant="outlined"
                                >
                                    {bookTypes.map((type) => (
                                        <MenuItem key={type.kitap_tur_kodu} value={type.kitap_tur_kodu}>
                                            {type.aciklama}
                                        </MenuItem>
                                    ))}
                                </Select>
                                <FormControl variant="outlined" sx={{ minWidth: 200 }}>
                                    <InputLabel id="library-select-label">Kütüphane</InputLabel>
                                    <Select
                                        labelId="library-select-label"
                                        id="library-select"
                                        label="Kütüphane"
                                        value={editedBook.library_id || ''}
                                        onChange={(e) =>
                                            setEditedBook((prev) => ({
                                                ...prev,
                                                library_id: e.target.value,
                                            }))
                                        }
                                    >
                                        {Array.isArray(libraries) && libraries.map((library) => (
                                            <MenuItem key={library.id} value={library.id}>
                                                {library.library_name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            name="durum"
                                            checked={editedBook.durum || false}
                                            onChange={handleInputChange}
                                            disabled={true}
                                        />
                                    }
                                    label="Durum" />
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