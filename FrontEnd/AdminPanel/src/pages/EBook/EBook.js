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
    Select,
    MenuItem,
    ListSubheader,
    Stack,
    Chip,
    IconButton,
    Alert
} from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DownloadIcon from '@mui/icons-material/Download';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import Swal from 'sweetalert2';
import EBookService from '../../services/EBookService';
import BookTypeService from '../../services/BookTypeService';
import AuthorService from '../../services/AuthorService';
import LibraryService from '../../services/LibraryService';

const ebookService = new EBookService();
const bookTypeService = new BookTypeService();
const authorService = new AuthorService();
const libraryService = new LibraryService();

const initialFormState = {
    kitap_adi: '',
    author_id: '',
    isbn: '',
    sayfa_sayisi: '',
    kitap_tur_kodu: '',
    library_id: '',
    aciklama: '',
    external_url: '',
    requires_approval: false,
    durum: true,
    file: null,
    remove_existing_file: false
};

const EBook = () => {
    const { t } = useTranslation();
    const [ebooks, setEBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [authors, setAuthors] = useState([]);
    const [libraries, setLibraries] = useState([]);
    const [bookTypes, setBookTypes] = useState([]);
    const [filter, setFilter] = useState({});

    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [previewModalOpen, setPreviewModalOpen] = useState(false);
    const [previewBook, setPreviewBook] = useState(null);

    const [createForm, setCreateForm] = useState(initialFormState);
    const [editForm, setEditForm] = useState(null);

    useEffect(() => {
        loadAll();
    }, []);

    const loadAll = async () => {
        await Promise.all([
            fetchEBooks({}),
            fetchBookTypes(),
            fetchAuthors(),
            fetchLibraries()
        ]);
    };

    const fetchBookTypes = async () => {
        try {
            const response = await bookTypeService.getbooktypes();
            if (response?.data?.data) {
                setBookTypes(response.data.data);
            }
        } catch (error) {
            console.error(t('error_loading_book_types'), error);
        }
    };

    const fetchAuthors = async () => {
        try {
            const response = await authorService.getAllAuthors();
            if (response?.data) {
                setAuthors(response.data);
            }
        } catch (error) {
            console.error(t('error_fetching_authors'), error);
        }
    };

    const fetchLibraries = async () => {
        try {
            const response = await libraryService.GetLibraries();
            if (response?.data?.data) {
                setLibraries(response.data.data);
            }
        } catch (error) {
            console.error(t('error_loading_libraries'), error);
        }
    };

    const fetchEBooks = async (activeFilter = filter) => {
        try {
            setLoading(true);
            const payload = { ...activeFilter };
            if (payload.access_filter === 'open') {
                payload.requires_approval = false;
            } else if (payload.access_filter === 'approval') {
                payload.requires_approval = true;
            }
            delete payload.access_filter;

            const response = await ebookService.getEBooks(payload);
            if (Array.isArray(response?.data)) {
                setEBooks(response.data);
            } else if (Array.isArray(response)) {
                setEBooks(response);
            } else {
                setEBooks([]);
            }
        } catch (error) {
            setEBooks([]);
        } finally {
            setLoading(false);
        }
    };

    const handleClearFilter = async () => {
        setFilter({});
        await fetchEBooks({});
    };

    const handleExportExcel = async () => {
        try {
            await ebookService.getEBooksExcel(filter);
            Swal.fire({
                title: t('success'),
                text: t('excel_downloaded'),
                icon: 'success'
            });
        } catch (error) {
            Swal.fire({
                title: t('error'),
                text: error?.response?.data?.message || t('error_downloading_excel'),
                icon: 'error'
            });
        }
    };

    const buildFormData = (form, includeId = false) => {
        const fd = new FormData();
        if (includeId && form.id) {
            fd.append('id', form.id);
        }
        fd.append('kitap_adi', form.kitap_adi || '');
        if (form.author_id) fd.append('author_id', form.author_id);
        if (form.isbn) fd.append('isbn', form.isbn);
        if (form.sayfa_sayisi) fd.append('sayfa_sayisi', form.sayfa_sayisi);
        if (form.kitap_tur_kodu) fd.append('kitap_tur_kodu', form.kitap_tur_kodu);
        if (form.library_id) fd.append('library_id', form.library_id);
        if (form.aciklama) fd.append('aciklama', form.aciklama);
        if (form.external_url) fd.append('external_url', form.external_url);
        fd.append('requires_approval', Boolean(form.requires_approval));
        fd.append('durum', Boolean(form.durum));
        if (includeId) {
            fd.append('remove_existing_file', Boolean(form.remove_existing_file));
        }
        if (form.file) {
            fd.append('file', form.file);
        }
        return fd;
    };

    const handleCreateSubmit = async () => {
        if (!createForm.kitap_adi?.trim()) {
            Swal.fire(t('warning'), t('ebook_name_required'), 'warning');
            return;
        }
        if (!createForm.file && !createForm.external_url?.trim()) {
            Swal.fire(t('warning'), t('ebook_file_or_url_required'), 'warning');
            return;
        }

        try {
            const fd = buildFormData(createForm, false);
            const response = await ebookService.createEBook(fd);
            Swal.fire({
                title: t('success'),
                text: response?.message || t('ebook_added_successfully'),
                icon: 'success'
            });
            setCreateModalOpen(false);
            setCreateForm(initialFormState);
            await fetchEBooks();
        } catch (error) {
            console.error('Error creating e-book:', error);
        }
    };

    const handleOpenEdit = async (row) => {
        try {
            const response = await ebookService.getEBookById(row.id);
            const item = response?.data || row;
            setEditForm({
                id: item.id,
                kitap_adi: item.kitap_adi || '',
                author_id: item.author_id ?? '',
                isbn: item.isbn || '',
                sayfa_sayisi: item.sayfa_sayisi ?? '',
                kitap_tur_kodu: item.kitap_tur_kodu ?? '',
                library_id: item.library_id ?? '',
                aciklama: item.aciklama || '',
                external_url: item.external_url || '',
                file_path: item.file_path || '',
                requires_approval: Boolean(item.requires_approval),
                durum: Boolean(item.durum),
                file: null,
                remove_existing_file: false
            });
            setEditModalOpen(true);
        } catch (error) {
            console.error('Error loading e-book:', error);
        }
    };

    const handleUpdateSubmit = async () => {
        if (!editForm?.kitap_adi?.trim()) {
            Swal.fire(t('warning'), t('ebook_name_required'), 'warning');
            return;
        }

        const hasExistingFile = Boolean(editForm.file_path) && !editForm.remove_existing_file;
        if (!hasExistingFile && !editForm.file && !editForm.external_url?.trim()) {
            Swal.fire(t('warning'), t('ebook_file_or_url_required'), 'warning');
            return;
        }

        try {
            const fd = buildFormData(editForm, true);
            const response = await ebookService.updateEBook(fd);
            Swal.fire({
                title: t('success'),
                text: response?.message || t('ebook_updated_successfully'),
                icon: 'success'
            });
            setEditModalOpen(false);
            setEditForm(null);
            await fetchEBooks();
        } catch (error) {
            console.error('Error updating e-book:', error);
        }
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: t('are_you_sure'),
            text: t('are_you_sure_delete_ebook'),
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: t('yes_delete'),
            cancelButtonText: t('cancel')
        });

        if (result.isConfirmed) {
            try {
                const response = await ebookService.deleteEBook(id);
                await fetchEBooks();
                Swal.fire({
                    title: t('success'),
                    text: response?.message || t('ebook_deleted_successfully'),
                    icon: 'success'
                });
            } catch (error) {
                console.error('Error deleting e-book:', error);
            }
        }
    };

    const handleOpenPreview = (row) => {
        setPreviewBook(row);
        setPreviewModalOpen(true);
    };

    const getReadableUrl = (book) => {
        if (!book) return null;
        if (book.file_path) {
            return ebookService.getStaticFileUrl(book.file_path);
        }
        return book.external_url || null;
    };

    const isPdfPreviewable = (book) => {
        if (!book) return false;
        if (book.file_format === 'PDF') return true;
        const url = getReadableUrl(book) || '';
        return url.toLowerCase().split('?')[0].endsWith('.pdf');
    };

    const columns = [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'kitap_adi', headerName: t('book_name'), minWidth: 190, flex: 1 },
        { field: 'author_name', headerName: t('author_name_surname'), minWidth: 150, flex: 1 },
        { field: 'isbn', headerName: 'ISBN', width: 120 },
        { field: 'kitap_tur', headerName: t('book_type'), width: 140 },
        { field: 'library_name', headerName: t('library_name'), width: 140 },
        {
            field: 'file_format',
            headerName: t('format'),
            width: 100,
            renderCell: (params) => (
                <Chip
                    label={params.value || 'PDF'}
                    size="small"
                    color={params.value === 'PDF' ? 'primary' : params.value === 'EPUB' ? 'secondary' : 'default'}
                    variant="outlined"
                />
            )
        },
        {
            field: 'requires_approval',
            headerName: t('access_type'),
            width: 150,
            renderCell: (params) => (
                <Chip
                    label={params.value ? t('approval_required') : t('open_access')}
                    size="small"
                    color={params.value ? 'warning' : 'success'}
                />
            )
        },
        {
            field: 'durum',
            headerName: t('status'),
            width: 100,
            renderCell: (params) => (
                <Checkbox checked={Boolean(params.value)} disabled />
            )
        },
        {
            field: 'actions',
            headerName: t('operations'),
            width: 280,
            sortable: false,
            renderCell: (params) => (
                <Stack direction="row" spacing={1} alignItems="center" sx={{ height: '100%' }}>
                    <Button
                        variant="outlined"
                        size="small"
                        onClick={() => handleOpenPreview(params.row)}
                        startIcon={<VisibilityIcon />}
                    >
                        {t('read_preview')}
                    </Button>
                    <Button
                        variant="contained"
                        size="small"
                        onClick={() => handleOpenEdit(params.row)}
                        startIcon={<EditIcon />}
                    >
                        {t('details')}
                    </Button>
                    <IconButton
                        color="error"
                        size="small"
                        onClick={() => handleDelete(params.row.id)}
                    >
                        <DeleteIcon />
                    </IconButton>
                </Stack>
            )
        }
    ];

    const renderFormFields = (formState, setFormState, isEdit = false) => (
        <Box component="form" sx={{ mt: 2 }}>
            <Stack spacing={2.5}>
                <TextField
                    fullWidth
                    label={t('book_name')}
                    value={formState.kitap_adi || ''}
                    onChange={(e) => setFormState((prev) => ({ ...prev, kitap_adi: e.target.value }))}
                />

                <FormControl fullWidth>
                    <InputLabel>{t('authors')}</InputLabel>
                    <Select
                        label={t('authors')}
                        value={formState.author_id ?? ''}
                        onChange={(e) => setFormState((prev) => ({ ...prev, author_id: e.target.value }))}
                    >
                        <MenuItem value="">{t('none')}</MenuItem>
                        {Array.isArray(authors) && authors.map((author) => (
                            <MenuItem key={author.id} value={author.id}>
                                {author.name_surname}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                    <TextField
                        fullWidth
                        label="ISBN"
                        value={formState.isbn || ''}
                        onChange={(e) => setFormState((prev) => ({ ...prev, isbn: e.target.value }))}
                    />
                    <TextField
                        fullWidth
                        type="number"
                        label={t('page_count')}
                        value={formState.sayfa_sayisi ?? ''}
                        onChange={(e) => setFormState((prev) => ({ ...prev, sayfa_sayisi: e.target.value }))}
                    />
                </Stack>

                <FormControl fullWidth>
                    <InputLabel>{t('book_type')}</InputLabel>
                    <Select
                        label={t('book_type')}
                        value={formState.kitap_tur_kodu ?? ''}
                        onChange={(e) => setFormState((prev) => ({ ...prev, kitap_tur_kodu: e.target.value }))}
                    >
                        <MenuItem value="">{t('none')}</MenuItem>
                        {Array.isArray(bookTypes) && bookTypes.map((group) => [
                            <ListSubheader key={`header-${group.book_group_id}`}>
                                {group.book_types_group}
                            </ListSubheader>,
                            ...(group.bookTypes || []).map((type) => (
                                <MenuItem key={type.kitap_tur_kodu} value={type.kitap_tur_kodu}>
                                    {type.aciklama}
                                </MenuItem>
                            ))
                        ])}
                    </Select>
                </FormControl>

                <FormControl fullWidth>
                    <InputLabel>{t('library')}</InputLabel>
                    <Select
                        label={t('library')}
                        value={formState.library_id ?? ''}
                        onChange={(e) => setFormState((prev) => ({ ...prev, library_id: e.target.value }))}
                    >
                        <MenuItem value="">{t('none')}</MenuItem>
                        {Array.isArray(libraries) && libraries.map((lib) => (
                            <MenuItem key={lib.id} value={lib.id}>
                                {lib.library_name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <TextField
                    fullWidth
                    multiline
                    rows={3}
                    label={t('description')}
                    value={formState.aciklama || ''}
                    onChange={(e) => setFormState((prev) => ({ ...prev, aciklama: e.target.value }))}
                />

                <Paper variant="outlined" sx={{ p: 2, bgcolor: '#f8fafc' }}>
                    <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                        {t('upload_pdf_or_epub')}
                    </Typography>

                    {isEdit && formState.file_path && !formState.remove_existing_file && (
                        <Alert
                            severity="info"
                            sx={{ mb: 1.5 }}
                            action={
                                <Button
                                    color="error"
                                    size="small"
                                    onClick={() => setFormState((prev) => ({ ...prev, remove_existing_file: true }))}
                                >
                                    {t('delete')}
                                </Button>
                            }
                        >
                            {t('current_uploaded_file')}: {formState.file_path.split('/').pop()}
                        </Alert>
                    )}

                    <Button
                        variant="outlined"
                        component="label"
                        startIcon={<UploadFileIcon />}
                    >
                        {formState.file ? formState.file.name : t('choose_ebook_file')}
                        <input
                            type="file"
                            hidden
                            accept=".pdf,.epub,application/pdf,application/epub+zip"
                            onChange={(e) => {
                                const file = e.target.files?.[0] || null;
                                setFormState((prev) => ({ ...prev, file }));
                            }}
                        />
                    </Button>
                </Paper>

                <TextField
                    fullWidth
                    label={t('external_ebook_url')}
                    placeholder="https://example.com/ebook.pdf"
                    value={formState.external_url || ''}
                    onChange={(e) => setFormState((prev) => ({ ...prev, external_url: e.target.value }))}
                />

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={Boolean(formState.requires_approval)}
                                onChange={(e) =>
                                    setFormState((prev) => ({ ...prev, requires_approval: e.target.checked }))
                                }
                            />
                        }
                        label={t('requires_admin_approval')}
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={Boolean(formState.durum)}
                                onChange={(e) =>
                                    setFormState((prev) => ({ ...prev, durum: e.target.checked }))
                                }
                            />
                        }
                        label={t('active_status')}
                    />
                </Stack>
            </Stack>
        </Box>
    );

    return (
        <Container maxWidth="xl">
            <Box sx={{ width: '100%', mb: 4, textAlign: 'center' }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    {t('ebook_list')}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                    {t('manage_all_ebooks')}
                </Typography>
            </Box>

            <Box
                sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    mb: 2,
                    gap: 1.5,
                    bgcolor: '#cfe8fc',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    p: 2,
                    borderRadius: 1
                }}
            >
                <Button
                    variant="contained"
                    color="primary"
                    sx={{ flex: { xs: '1 1 100%', sm: '0 0 auto' } }}
                    onClick={() => {
                        setCreateForm(initialFormState);
                        setCreateModalOpen(true);
                    }}
                >
                    {t('add_new_ebook')}
                </Button>
                <Button
                    variant="contained"
                    color="secondary"
                    sx={{ flex: { xs: '1 1 100%', sm: '0 0 auto' } }}
                    onClick={handleExportExcel}
                >
                    {t('download_excel')}
                </Button>
            </Box>

            <Typography variant="h6" gutterBottom>
                {t('filter')}
            </Typography>
            <Paper elevation={3} sx={{ width: '100%', mb: 4, p: 2 }}>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
                    <TextField
                        label={t('book_name')}
                        value={filter.kitap_adi || ''}
                        onChange={(e) => setFilter((prev) => ({ ...prev, kitap_adi: e.target.value }))}
                        sx={{ flex: { xs: '1 1 100%', sm: '1 1 180px' } }}
                    />

                    <FormControl sx={{ minWidth: { xs: '100%', sm: 180 }, flex: { xs: '1 1 100%', sm: '1 1 180px' } }}>
                        <InputLabel>{t('authors')}</InputLabel>
                        <Select
                            label={t('authors')}
                            value={filter.author_id ?? ''}
                            onChange={(e) => setFilter((prev) => ({ ...prev, author_id: e.target.value }))}
                        >
                            <MenuItem value="">{t('none')}</MenuItem>
                            {Array.isArray(authors) && authors.map((a) => (
                                <MenuItem key={a.id} value={a.id}>
                                    {a.name_surname}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <TextField
                        label="ISBN"
                        value={filter.isbn || ''}
                        onChange={(e) => setFilter((prev) => ({ ...prev, isbn: e.target.value }))}
                        sx={{ flex: { xs: '1 1 100%', sm: '1 1 160px' } }}
                    />

                    <FormControl sx={{ minWidth: { xs: '100%', sm: 180 }, flex: { xs: '1 1 100%', sm: '1 1 180px' } }}>
                        <InputLabel>{t('book_type')}</InputLabel>
                        <Select
                            label={t('book_type')}
                            value={filter.kitap_tur_kodu ?? ''}
                            onChange={(e) => setFilter((prev) => ({ ...prev, kitap_tur_kodu: e.target.value }))}
                        >
                            <MenuItem value="">{t('none')}</MenuItem>
                            {Array.isArray(bookTypes) && bookTypes.map((group) => [
                                <ListSubheader key={`fheader-${group.book_group_id}`}>
                                    {group.book_types_group}
                                </ListSubheader>,
                                ...(group.bookTypes || []).map((type) => (
                                    <MenuItem key={type.kitap_tur_kodu} value={type.kitap_tur_kodu}>
                                        {type.aciklama}
                                    </MenuItem>
                                ))
                            ])}
                        </Select>
                    </FormControl>

                    <FormControl sx={{ minWidth: { xs: '100%', sm: 160 }, flex: { xs: '1 1 100%', sm: '1 1 160px' } }}>
                        <InputLabel>{t('format')}</InputLabel>
                        <Select
                            label={t('format')}
                            value={filter.file_format ?? ''}
                            onChange={(e) => setFilter((prev) => ({ ...prev, file_format: e.target.value }))}
                        >
                            <MenuItem value="">{t('none')}</MenuItem>
                            <MenuItem value="PDF">PDF</MenuItem>
                            <MenuItem value="EPUB">EPUB</MenuItem>
                            <MenuItem value="URL">URL</MenuItem>
                        </Select>
                    </FormControl>

                    <FormControl sx={{ minWidth: { xs: '100%', sm: 180 }, flex: { xs: '1 1 100%', sm: '1 1 180px' } }}>
                        <InputLabel>{t('access_type')}</InputLabel>
                        <Select
                            label={t('access_type')}
                            value={filter.access_filter ?? ''}
                            onChange={(e) => setFilter((prev) => ({ ...prev, access_filter: e.target.value }))}
                        >
                            <MenuItem value="">{t('none')}</MenuItem>
                            <MenuItem value="open">{t('open_access')}</MenuItem>
                            <MenuItem value="approval">{t('approval_required')}</MenuItem>
                        </Select>
                    </FormControl>

                    <IconButton aria-label="search" size="large" onClick={() => fetchEBooks(filter)}>
                        <SearchIcon />
                    </IconButton>

                    <IconButton aria-label="clear" size="large" onClick={handleClearFilter}>
                        <DeleteIcon />
                    </IconButton>
                </Box>
            </Paper>

            <Paper elevation={3} sx={{ width: '100%', minWidth: 0, mb: 4, p: { xs: 1, sm: 2 } }}>
                <Box sx={{ height: { xs: 480, md: 600 }, width: '100%', minWidth: 0 }}>
                    <DataGrid
                        rows={ebooks}
                        columns={columns}
                        pageSize={10}
                        rowsPerPageOptions={[10, 25, 50]}
                        disableSelectionOnClick
                        loading={loading}
                        components={{ Toolbar: GridToolbar }}
                        sx={{
                            boxShadow: 2,
                            border: 2,
                            borderColor: 'primary.light',
                            '& .MuiDataGrid-cell:hover': {
                                color: 'primary.main'
                            }
                        }}
                    />
                </Box>
            </Paper>

            {/* Create E-Book Dialog */}
            <Dialog open={createModalOpen} onClose={() => setCreateModalOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>{t('add_new_ebook')}</DialogTitle>
                <DialogContent>
                    {renderFormFields(createForm, setCreateForm, false)}
                </DialogContent>
                <DialogActions sx={{ pr: 3, pb: 2 }}>
                    <Button onClick={() => setCreateModalOpen(false)}>{t('cancel')}</Button>
                    <Button onClick={handleCreateSubmit} variant="contained" color="primary">
                        {t('save')}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Edit E-Book Dialog */}
            <Dialog open={editModalOpen} onClose={() => setEditModalOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>{t('ebook_details')}</DialogTitle>
                <DialogContent>
                    {editForm && renderFormFields(editForm, setEditForm, true)}
                </DialogContent>
                <DialogActions sx={{ pr: 3, pb: 2 }}>
                    <Button onClick={() => setEditModalOpen(false)}>{t('cancel')}</Button>
                    <Button onClick={handleUpdateSubmit} variant="contained" color="primary">
                        {t('save')}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Preview / Reader Dialog */}
            <Dialog open={previewModalOpen} onClose={() => setPreviewModalOpen(false)} maxWidth="lg" fullWidth>
                <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
                    <span style={{ wordBreak: 'break-word' }}>{previewBook?.kitap_adi}</span>
                    <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                        {previewBook?.file_path && (
                            <Button
                                size="small"
                                variant="outlined"
                                startIcon={<DownloadIcon />}
                                onClick={() => ebookService.downloadEBookFile(previewBook.id, `${previewBook.kitap_adi}.pdf`)}
                            >
                                {t('download')}
                            </Button>
                        )}
                        {getReadableUrl(previewBook) && (
                            <Button
                                size="small"
                                variant="contained"
                                startIcon={<OpenInNewIcon />}
                                component="a"
                                href={getReadableUrl(previewBook)}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {t('open_in_new_tab')}
                            </Button>
                        )}
                    </Stack>
                </DialogTitle>
                <DialogContent dividers>
                    {previewBook?.aciklama && (
                        <Alert severity="info" sx={{ mb: 2 }}>
                            {previewBook.aciklama}
                        </Alert>
                    )}
                    {isPdfPreviewable(previewBook) && getReadableUrl(previewBook) ? (
                        <iframe
                            src={getReadableUrl(previewBook)}
                            title={previewBook?.kitap_adi}
                            style={{ width: '100%', height: '72vh', border: '1px solid #e2e8f0', borderRadius: 8 }}
                        />
                    ) : (
                        <Box sx={{ py: 6, textAlign: 'center' }}>
                            <Typography variant="body1" sx={{ mb: 2 }}>
                                {t('non_pdf_preview_notice')}
                            </Typography>
                            {getReadableUrl(previewBook) && (
                                <Button
                                    variant="contained"
                                    startIcon={<OpenInNewIcon />}
                                    component="a"
                                    href={getReadableUrl(previewBook)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {t('open_in_new_tab')}
                                </Button>
                            )}
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setPreviewModalOpen(false)}>{t('close')}</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default EBook;
