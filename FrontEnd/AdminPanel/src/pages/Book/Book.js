import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
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
    ListSubheader,
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
import { formatCurrency } from '../../utils/helper.js';

const Book = () => {
    const { t } = useTranslation();
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
            if (response && response.data && response.data.data) {
                setTypeofFilterbook(response.data.data);
                console.log(response.data.data);
            }
        } catch (error) {
            console.error(t('error_loading_book_types'), error);
        }
    }
    const getlibraries = async () => {
        try {
            const response = await libraryService.GetLibraries();
            if (response) {
                setLibraries(response.data.data);
            }
        } catch (error) {
            console.error(t('error_loading_libraries'), error);
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
                setError(t('api_response_not_expected_format'));
                setBooks([]);
            }
        } catch (error) {
            setError(error?.response?.data?.message || t('error_loading_books'));
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
                    title: t('success'),
                    text: t('excel_downloaded'),
                    icon: 'success'
                });
            }
        } catch (error) {
            Swal.fire({
                title: t('error'),
                text: error.response?.data?.message || t('error_downloading_excel'),
                icon: 'error'
            });
        }
    }



    const fetchAuthors = async () => {
        try {
            const response = await authorService.getAllAuthors();
            setAuthors(response.data);
        } catch (error) {
            Swal.fire(t('error'), t('error_fetching_authors'), 'error');
        } finally {
            setLoading(false);
        }
    };

    const searchbooks = async () => {
        try {
            const response = await bookService.getBooks(filterbooks);
            if (response) {
                setBooks(response.data);
            }
        }
        catch (error) {
            Swal.fire({
                title: t('error'),
                text: error?.response?.data?.message,
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
            if (response && response.data && response.data.data) {
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
                title: t('error'),
                text: error?.response?.message,
                icon: 'error'
            });
        }
    };

    const createbookmodalopen = async () => {
        const response = await bookTypeService.getbooktypes();
        if (response && response.data && response.data.data) {
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
            library_id: createofbook.library_id || 0,
            daily_lending_fee: createofbook.daily_lending_fee
        };
        const response = await bookService.createbook(payload);

        if (response) {
            Swal.fire({
                title: t('success'),
                text: response?.message || t('book_added_successfully'),
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
                    title: t('success'),
                    text: response?.message || t('book_updated_successfully'),
                    icon: 'success'
                });
                await getBooks();
                handleCloseModal();
            }
        } catch (error) {
            Swal.fire({
                title: t('error'),
                text: error?.response?.data?.message || t('error_during_update'),
                icon: 'error'
            });
        }
    };

    const handleDelete = async (id) => {
        try {
            const result = await Swal.fire({
                title: t('are_you_sure'),
                text: t('are_you_sure_delete_book'),
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: t('yes_delete'),
                cancelButtonText: t('cancel')
            });

            if (result.isConfirmed) {
                const response = await bookService.deleteBook(id);
                await getBooks();

                Swal.fire({
                    title: t('success') + '!',
                    text: response?.message || t('book_deleted_successfully'),
                    icon: 'success'
                });
            }
        } catch (error) {
            Swal.fire({
                title: t('error') + '!',
                text: error?.response?.data?.message || t('error_during_deletion'),
                icon: 'error'
            });
        }
    };

    const columns = [
        { field: 'id', headerName: 'ID', width: 90 },
        { field: 'kitap_adi', headerName: t('book_name'), width: 200, flex: 1 },
        { field: 'author_name', headerName: t('author_name_surname'), width: 150, flex: 1 },
        { field: 'isbn', headerName: 'ISBN', width: 130 },
        {
            field: 'daily_lending_fee',
            headerName: t('daily_lending_fee'),
            width: 150,
            renderCell: (params) => {
                return formatCurrency(params.value);
            }

        },
        {
            field: 'durum',
            headerName: t('status'),
            width: 120,
            renderCell: (params) => (
                <Checkbox
                    checked={params.value || false}
                    disabled
                />
            )
        },
        {
            field: 'library_name', headerName: t('library_name'), width: 150, flex: 1,
            renderCell: (params) => {
                if (params?.row?.location_google_map_adress) {
                    return (
                        <a href={params.row.location_google_map_adress} target="_blank" rel="noopener noreferrer">
                            {params.value}
                        </a>
                    );
                }
                else {
                    return params.value ? params.value : t('library_not_assigned');
                }
            }
        },
        { field: 'kitap_tur', headerName: t('book_type'), width: 150, flex: 1 },
        {
            field: 'actions',
            headerName: t('operations'),
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
                        {t('details')}
                    </Button>
                    <Button
                        variant="contained"
                        color="error"
                        size="small"
                        onClick={() => handleDelete(params.row.id)}
                        startIcon={<DeleteIcon />}
                    >
                        {t('delete')}
                    </Button>
                </Stack>
            )
        }
    ];

    return (
        <Container maxWidth="xl">
            <Box sx={{ width: '100%', mb: 4, textAlign: 'center' }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    {t('book_list')}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                    {t('manage_all_books')}
                </Typography>
            </Box>
            <div>
                <Box sx={{ display: 'flex', mb: 2, gap: 2, bgcolor: '#cfe8fc', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', p: 2 }}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => createbookmodalopen(true)}
                    >
                        {t('add_new_book')}
                    </Button>
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => getbookexcel()}
                    >
                        {t('download_excel')}
                    </Button>
                </Box>
            </div>
            <Typography variant="h6" gutterBottom>
                {t('filter')}
            </Typography>
            <Paper elevation={3} sx={{ width: '100%', mb: 4, p: 2 }}>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
                    <TextField
                        label={t('book_name')}
                        value={filterbooks.kitap_adi || ""}
                        onChange={(e) => setFilterBooks(prev => ({ ...prev, kitap_adi: e.target.value }))}
                    />

                    <FormControl variant="outlined" sx={{ minWidth: 200 }}>
                        <InputLabel id="demo-multiple-name-label">{t('authors')}</InputLabel>
                        <Select
                            labelId="demo-multiple-name-label"
                            id="demo-multiple-name"
                            label={t('authors')}
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
                        label={t('status')}
                        sx={{ alignItems: 'center', display: 'flex' }}
                    />

                    <FormControl variant="outlined" sx={{ minWidth: 200 }}>
                        <InputLabel id="demo-multiple-name-label">{t('book_type')}</InputLabel>
                        <Select
                            labelId="demo-multiple-name-label"
                            id="demo-multiple-name"
                            label={t('book_type')}
                            value={filterbooks.kitap_tur_kodu ?? ""}
                            onChange={(e) =>
                                setFilterBooks((prev) => ({
                                    ...prev,
                                    kitap_tur_kodu: e.target.value,
                                }))
                            }
                        >
                            {Array.isArray(typeofFilterbook) && typeofFilterbook.map((group) => [
                                <ListSubheader key={`header-${group.book_group_id}`}>{group.book_types_group}</ListSubheader>,
                                ...(group.bookTypes || []).map((type) => (
                                    <MenuItem key={type.kitap_tur_kodu} value={type.kitap_tur_kodu}>
                                        {type.aciklama}
                                    </MenuItem>
                                ))
                            ])}
                        </Select>
                    </FormControl>
                    <FormControl variant="outlined" sx={{ minWidth: 200 }}>
                        <InputLabel id="library-select-label">{t('library')}</InputLabel>
                        <Select
                            labelId="library-select-label"
                            id="library-select"
                            label={t('library')}
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
                    <FormControl variant="outlined" sx={{ minWidth: 200 }}>

                        <TextField
                            label={t('library_location')}
                            value={filterbooks.library_location ?? ""}
                            onChange={(e) =>
                                setFilterBooks((prev) => ({
                                    ...prev,
                                    library_location: e.target.value,
                                }))
                            }
                        >
                        </TextField>

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
                <DialogTitle>{t('add_new_book')}</DialogTitle>
                <DialogContent>
                    <Box component="form" sx={{ mt: 2 }}>
                        <Stack spacing={3}>

                            {/* Kitap Adı */}
                            <TextField
                                fullWidth
                                label={t('book_name')}
                                name="kitap_adi"
                                value={createofbook.kitap_adi || ''}
                                onChange={(e) =>
                                    setCreateofbook(prev => ({ ...prev, kitap_adi: e.target.value }))
                                }
                                variant="outlined"
                            />

                            {/* Yazarlar Select */}
                            <FormControl fullWidth variant="outlined">
                                <InputLabel id="author-select-label">{t('authors')}</InputLabel>
                                <Select
                                    labelId="demo-multiple-name-label"
                                    id="demo-multiple-name"
                                    label={t('authors')}
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
                            {/* Günlük kitap kiralama */}
                            <TextField
                                fullWidth
                                label={t('daily_book_rental_fee')}
                                name="Günlük kitap kiralama ücreti"
                                type="number"
                                value={createofbook.daily_lending_fee || ''}
                                onChange={(e) =>
                                    setCreateofbook(prev => ({ ...prev, daily_lending_fee: e.target.value }))
                                }
                                variant="outlined"
                            />

                            {/* Kitap Türü Select */}
                            <FormControl fullWidth variant="outlined">
                                <InputLabel id="kitap-tur-select-label">{t('book_type')}</InputLabel>
                                <Select
                                    labelId="kitap-tur-select-label"
                                    id="kitap-tur-select"
                                    value={createofbook.kitap_tur_kodu || ""}
                                    label={t('book_type')}
                                    onChange={(e) =>
                                        setCreateofbook(prev => ({
                                            ...prev,
                                            kitap_tur_kodu: e.target.value,
                                        }))
                                    }
                                >
                                    {Array.isArray(bookTypes) && bookTypes.map(group => [
                                        <ListSubheader key={`header-${group.book_group_id}`}>{group.book_types_group}</ListSubheader>,
                                        ...(group.bookTypes || []).map(type => (
                                            <MenuItem key={type.kitap_tur_kodu} value={type.kitap_tur_kodu}>
                                                {type.aciklama}
                                            </MenuItem>
                                        ))
                                    ])}
                                </Select>
                            </FormControl>
                            <FormControl fullWidth variant="outlined">
                                <InputLabel id="library-select-label">{t('libraries')}</InputLabel>
                                <Select
                                    labelId="library-select-label"
                                    id="library-select"
                                    value={createofbook.library_id || ""}
                                    label={t('libraries')}
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
                        {t('create_book')}
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={showModal}
                onClose={handleCloseModal}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>{t('book_details')}</DialogTitle>
                <DialogContent>
                    {editedBook ? (
                        <Box component="form" sx={{ mt: 2 }}>
                            <Stack spacing={3}>
                                <TextField
                                    fullWidth
                                    label={t('book_name')}
                                    name="kitap_adi"
                                    value={editedBook.kitap_adi || ''}
                                    onChange={handleInputChange}
                                    variant="outlined"
                                />

                                <FormControl variant="outlined" sx={{ minWidth: 200 }}>
                                    <InputLabel id="demo-multiple-name-label">{t('authors')}</InputLabel>
                                    <Select
                                        labelId="demo-multiple-name-label"
                                        id="demo-multiple-name"
                                        label={t('authors')}
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
                                <TextField
                                    fullWidth
                                    label={t('daily_book_rental_fee')}
                                    name="Günlük kitap kiralama ücreti"
                                    type="number"
                                    value={editedBook.daily_lending_fee || ''}
                                    onChange={(e) =>
                                        setEditedBook((prev) => ({
                                            ...prev,
                                            daily_lending_fee: e.target.value,
                                        }))
                                    }
                                    variant="outlined"
                                />
                                <Select
                                    fullWidth
                                    label={t('book_type')}
                                    name="kitap_tur_kodu"
                                    value={editedBook.kitap_tur_kodu || ''}
                                    onChange={handleInputChange}
                                    variant="outlined"
                                >
                                    {Array.isArray(bookTypes) && bookTypes.map((group) => [
                                        <ListSubheader key={`header-${group.book_group_id}`}>{group.book_types_group}</ListSubheader>,
                                        ...(group.bookTypes || []).map((type) => (
                                            <MenuItem key={type.kitap_tur_kodu} value={type.kitap_tur_kodu}>
                                                {type.aciklama}
                                            </MenuItem>
                                        ))
                                    ])}
                                </Select>
                                <FormControl variant="outlined" sx={{ minWidth: 200 }}>
                                    <InputLabel id="library-select-label">{t('library')}</InputLabel>
                                    <Select
                                        labelId="library-select-label"
                                        id="library-select"
                                        label={t('library')}
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
                                    label={t('status')} />
                            </Stack>
                        </Box>
                    ) : (
                        <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                            <Typography>{t('loading')}</Typography>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseModal} color="inherit">
                        {t('cancel')}
                    </Button>
                    <Button onClick={handleUpdate} variant="contained">
                        {t('save')}
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default Book;