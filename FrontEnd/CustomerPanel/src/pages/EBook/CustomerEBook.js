import React, { useEffect, useState, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
    Container,
    Box,
    Paper,
    Typography,
    Tabs,
    Tab,
    Button,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Stack,
    Chip,
    IconButton,
    Tooltip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Alert,
    useMediaQuery
} from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import DownloadIcon from '@mui/icons-material/Download';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import Swal from 'sweetalert2';
import dayjs from 'dayjs';
import CustomerEBookService from '../../services/CustomerEBookService';

const ebookService = new CustomerEBookService();

const CustomerEBook = () => {
    const { t } = useTranslation();
    const location = useLocation();
    const isMobileScreen = useMediaQuery('(max-width:599.98px)');

    const [activeTab, setActiveTab] = useState(
        location.pathname === '/e-kitap/kitapligim' ? 1 : 0
    );
    const [catalog, setCatalog] = useState([]);
    const [myLibrary, setMyLibrary] = useState([]);
    const [myRequests, setMyRequests] = useState([]);
    const [loading, setLoading] = useState(false);

    const [searchText, setSearchText] = useState('');
    const [formatFilter, setFormatFilter] = useState('');

    const [readerOpen, setReaderOpen] = useState(false);
    const [readerFullScreen, setReaderFullScreen] = useState(false);
    const [selectedBook, setSelectedBook] = useState(null);

    useEffect(() => {
        if (location.pathname === '/e-kitap/kitapligim') {
            setActiveTab(1);
        } else if (location.pathname === '/e-kitap') {
            setActiveTab(0);
        }
    }, [location.pathname]);

    useEffect(() => {
        loadAllData();
    }, []);

    const loadAllData = async () => {
        try {
            setLoading(true);
            const [catRes, libRes, reqRes] = await Promise.all([
                ebookService.getCatalog(),
                ebookService.getMyLibrary(),
                ebookService.getMyRequests()
            ]);
            setCatalog(Array.isArray(catRes?.data) ? catRes.data : []);
            setMyLibrary(Array.isArray(libRes?.data) ? libRes.data : []);
            setMyRequests(Array.isArray(reqRes?.data) ? reqRes.data : []);
        } catch (error) {
            console.error('Error loading e-books:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleFavorite = async (ebookId) => {
        try {
            const res = await ebookService.toggleFavorite(ebookId);
            Swal.fire({
                title: t('success'),
                text: res?.data?.added ? t('added_to_my_ebooks') : t('removed_from_my_ebooks'),
                icon: 'success',
                timer: 1400,
                showConfirmButton: false
            });
            await loadAllData();
        } catch (error) {
            console.error('Error toggling favorite:', error);
        }
    };

    const handleRequestAccess = async (ebookId) => {
        try {
            const res = await ebookService.requestAccess(ebookId);
            Swal.fire({
                title: t('success'),
                text: res?.message || t('ebook_requested'),
                icon: 'success'
            });
            await loadAllData();
        } catch (error) {
            console.error('Error requesting e-book:', error);
        }
    };

    const handleCancelOrReturnRequest = async (requestId, isReturn = false) => {
        const confirm = await Swal.fire({
            title: t('are_you_sure'),
            text: isReturn ? t('confirm_return_ebook') : t('confirm_cancel_ebook_request'),
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: t('yes'),
            cancelButtonText: t('cancel')
        });

        if (!confirm.isConfirmed) return;

        try {
            await ebookService.cancelRequest(requestId);
            Swal.fire({
                title: t('success'),
                text: t('operation_completed'),
                icon: 'success'
            });
            await loadAllData();
        } catch (error) {
            console.error('Error cancelling request:', error);
        }
    };

    const handleDownload = async (book) => {
        if (book.file_path) {
            const ext = book.file_format === 'EPUB' ? 'epub' : 'pdf';
            await ebookService.downloadEBook(book.id || book.ebook_id, `${book.kitap_adi || 'ekitap'}.${ext}`);
        } else if (book.external_url) {
            window.open(book.external_url, '_blank', 'noopener,noreferrer');
        }
    };

    const handleOpenReader = (book) => {
        setSelectedBook(book);
        setReaderOpen(true);
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

    const filterRows = (rows) => {
        return rows.filter((item) => {
            const matchesFormat = !formatFilter || item.file_format === formatFilter;
            if (!searchText.trim()) return matchesFormat;
            const q = searchText.toLowerCase();
            const matchesSearch =
                (item.kitap_adi || '').toLowerCase().includes(q) ||
                (item.author_name || '').toLowerCase().includes(q) ||
                (item.kitap_tur || '').toLowerCase().includes(q) ||
                (item.library_name || '').toLowerCase().includes(q);
            return matchesFormat && matchesSearch;
        });
    };

    const filteredCatalog = useMemo(() => filterRows(catalog), [catalog, searchText, formatFilter]);
    const filteredLibrary = useMemo(() => filterRows(myLibrary), [myLibrary, searchText, formatFilter]);

    const renderAccessStatusChip = (status) => {
        switch (status) {
            case 'open':
                return <Chip label={t('open_access')} color="success" size="small" />;
            case 'approved':
                return <Chip label={t('approved')} color="success" size="small" />;
            case 'pending':
                return <Chip label={t('pending_approval')} color="warning" size="small" />;
            case 'rejected':
                return <Chip label={t('rejected')} color="error" size="small" />;
            default:
                return <Chip label={t('approval_required')} color="default" size="small" />;
        }
    };

    const bookColumns = [
        { field: 'id', headerName: t('id'), width: 65 },
        { field: 'kitap_adi', headerName: t('book_name'), minWidth: 190, flex: 1 },
        { field: 'author_name', headerName: t('author'), minWidth: 150, flex: 1 },
        { field: 'kitap_tur', headerName: t('category'), width: 130 },
        { field: 'library_name', headerName: t('library'), width: 140 },
        {
            field: 'file_format',
            headerName: t('format'),
            width: 95,
            renderCell: (params) => (
                <Chip
                    label={params.value || 'PDF'}
                    size="small"
                    variant="outlined"
                    color={params.value === 'PDF' ? 'primary' : 'secondary'}
                />
            )
        },
        {
            field: 'access_status',
            headerName: t('status'),
            width: 140,
            renderCell: (params) => renderAccessStatusChip(params.value)
        },
        {
            field: 'actions',
            headerName: t('actions'),
            width: 280,
            sortable: false,
            renderCell: (params) => {
                const row = params.row;
                return (
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ height: '100%' }}>
                        <Tooltip title={row.is_favorite ? t('remove_from_my_ebooks') : t('add_to_my_ebooks')}>
                            <IconButton
                                color={row.is_favorite ? 'primary' : 'default'}
                                size="small"
                                onClick={() => handleToggleFavorite(row.id)}
                            >
                                {row.is_favorite ? <BookmarkIcon /> : <BookmarkBorderIcon />}
                            </IconButton>
                        </Tooltip>

                        {row.can_read ? (
                            <>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    size="small"
                                    startIcon={<MenuBookIcon />}
                                    onClick={() => handleOpenReader(row)}
                                >
                                    {t('read')}
                                </Button>
                                <Tooltip title={t('download')}>
                                    <IconButton
                                        color="secondary"
                                        size="small"
                                        onClick={() => handleDownload(row)}
                                    >
                                        <DownloadIcon />
                                    </IconButton>
                                </Tooltip>
                                {row.access_status === 'approved' && row.active_request_id && activeTab === 1 && (
                                    <Button
                                        variant="outlined"
                                        color="warning"
                                        size="small"
                                        onClick={() => handleCancelOrReturnRequest(row.active_request_id, true)}
                                    >
                                        {t('return_ebook')}
                                    </Button>
                                )}
                            </>
                        ) : row.access_status === 'pending' ? (
                            <Button
                                variant="outlined"
                                color="warning"
                                size="small"
                                onClick={() => handleCancelOrReturnRequest(row.active_request_id, false)}
                            >
                                {t('cancel_request')}
                            </Button>
                        ) : (
                            <Button
                                variant="contained"
                                color="primary"
                                size="small"
                                onClick={() => handleRequestAccess(row.id)}
                            >
                                {t('request')}
                            </Button>
                        )}
                    </Stack>
                );
            }
        }
    ];

    const requestColumns = [
        { field: 'id', headerName: t('id'), width: 70 },
        { field: 'kitap_adi', headerName: t('book_name'), minWidth: 200, flex: 1 },
        { field: 'author_name', headerName: t('author'), minWidth: 150, flex: 1 },
        { field: 'library_name', headerName: t('library'), width: 150 },
        {
            field: 'request_date',
            headerName: t('request_date'),
            width: 155,
            valueFormatter: (params) => (params ? dayjs(params).format('DD/MM/YYYY HH:mm') : '-')
        },
        {
            field: 'status_display',
            headerName: t('status'),
            width: 150,
            renderCell: (params) => {
                const row = params.row;
                if (row.request_status) {
                    return <Chip label={t('pending_approval')} color="warning" size="small" />;
                }
                return row.is_approved ? (
                    <Chip label={t('approved')} color="success" size="small" />
                ) : (
                    <Chip label={t('rejected')} color="error" size="small" />
                );
            }
        },
        {
            field: 'actions',
            headerName: t('actions'),
            width: 240,
            sortable: false,
            renderCell: (params) => {
                const row = params.row;
                if (row.request_status) {
                    return (
                        <Button
                            variant="outlined"
                            color="error"
                            size="small"
                            onClick={() => handleCancelOrReturnRequest(row.id, false)}
                        >
                            {t('cancel_request')}
                        </Button>
                    );
                }
                if (row.is_approved) {
                    return (
                        <Stack direction="row" spacing={1} alignItems="center" sx={{ height: '100%' }}>
                            <Button
                                variant="contained"
                                size="small"
                                startIcon={<MenuBookIcon />}
                                onClick={() => handleOpenReader({ ...row, id: row.ebook_id })}
                            >
                                {t('read')}
                            </Button>
                            <Button
                                variant="outlined"
                                color="warning"
                                size="small"
                                onClick={() => handleCancelOrReturnRequest(row.id, true)}
                            >
                                {t('return_ebook')}
                            </Button>
                        </Stack>
                    );
                }
                return null;
            }
        }
    ];

    return (
        <Container maxWidth="lg" sx={{ mt: { xs: 1, sm: 4 }, mb: { xs: 2, sm: 4 } }}>
            <Box sx={{ mb: { xs: 2, sm: 3 } }}>
                <Typography variant="h5" sx={{ fontWeight: 600, color: '#1E3A8A' }} gutterBottom>
                    {t('ekitap')}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {t('ebook_customer_subtitle')}
                </Typography>
            </Box>

            <Paper sx={{ mb: 3 }}>
                <Tabs
                    value={activeTab}
                    onChange={(_, val) => setActiveTab(val)}
                    indicatorColor="primary"
                    textColor="primary"
                    variant="scrollable"
                    scrollButtons="auto"
                    allowScrollButtonsMobile
                >
                    <Tab label={`${t('ebook_catalog')} (${catalog.length})`} />
                    <Tab label={`${t('my_ebooks')} (${myLibrary.length})`} />
                    <Tab label={`${t('my_ebook_requests')} (${myRequests.length})`} />
                </Tabs>
            </Paper>

            {activeTab !== 2 && (
                <Paper sx={{ p: 2, mb: 3 }}>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                        <TextField
                            fullWidth
                            size="small"
                            label={t('search_ebook_placeholder')}
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                        />
                        <FormControl size="small" sx={{ minWidth: { xs: '100%', sm: 160 } }}>
                            <InputLabel>{t('format')}</InputLabel>
                            <Select
                                label={t('format')}
                                value={formatFilter}
                                onChange={(e) => setFormatFilter(e.target.value)}
                            >
                                <MenuItem value="">{t('all')}</MenuItem>
                                <MenuItem value="PDF">PDF</MenuItem>
                                <MenuItem value="EPUB">EPUB</MenuItem>
                                <MenuItem value="URL">URL</MenuItem>
                            </Select>
                        </FormControl>
                    </Stack>
                </Paper>
            )}

            <Paper sx={{ p: { xs: 1, sm: 2 }, width: '100%', minWidth: 0 }}>
                <Box sx={{ minHeight: 350, width: '100%', minWidth: 0 }}>
                    {activeTab === 0 && (
                        <DataGrid
                            rows={filteredCatalog}
                            columns={bookColumns}
                            loading={loading}
                            autoHeight
                            pageSize={10}
                            rowsPerPageOptions={[10, 25]}
                            disableSelectionOnClick
                            components={{ Toolbar: GridToolbar }}
                        />
                    )}

                    {activeTab === 1 && (
                        <DataGrid
                            rows={filteredLibrary}
                            columns={bookColumns}
                            loading={loading}
                            autoHeight
                            pageSize={10}
                            rowsPerPageOptions={[10, 25]}
                            disableSelectionOnClick
                            components={{ Toolbar: GridToolbar }}
                        />
                    )}

                    {activeTab === 2 && (
                        <DataGrid
                            rows={myRequests}
                            columns={requestColumns}
                            loading={loading}
                            autoHeight
                            pageSize={10}
                            rowsPerPageOptions={[10, 25]}
                            disableSelectionOnClick
                            components={{ Toolbar: GridToolbar }}
                        />
                    )}
                </Box>
            </Paper>

            {/* In-Browser E-Book Reader Dialog */}
            <Dialog
                open={readerOpen}
                onClose={() => setReaderOpen(false)}
                maxWidth="lg"
                fullWidth
                fullScreen={readerFullScreen || isMobileScreen}
            >
                <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
                    <Box sx={{ minWidth: 0 }}>
                        <Typography variant="h6" component="span" sx={{ wordBreak: 'break-word' }}>
                            {selectedBook?.kitap_adi}
                        </Typography>
                        {selectedBook?.author_name && (
                            <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }} component="span">
                                — {selectedBook.author_name}
                            </Typography>
                        )}
                    </Box>

                    <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                        <Button
                            size="small"
                            variant="outlined"
                            startIcon={<DownloadIcon />}
                            onClick={() => handleDownload(selectedBook)}
                        >
                            {t('download')}
                        </Button>
                        {getReadableUrl(selectedBook) && (
                            <Button
                                size="small"
                                variant="outlined"
                                startIcon={<OpenInNewIcon />}
                                component="a"
                                href={getReadableUrl(selectedBook)}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {t('open_in_new_tab')}
                            </Button>
                        )}
                        <IconButton size="small" onClick={() => setReaderFullScreen((prev) => !prev)}>
                            {readerFullScreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
                        </IconButton>
                    </Stack>
                </DialogTitle>

                <DialogContent dividers sx={{ p: readerFullScreen ? 1 : 2 }}>
                    {selectedBook?.aciklama && !readerFullScreen && (
                        <Alert severity="info" sx={{ mb: 2 }}>
                            {selectedBook.aciklama}
                        </Alert>
                    )}

                    {isPdfPreviewable(selectedBook) && getReadableUrl(selectedBook) ? (
                        <iframe
                            src={getReadableUrl(selectedBook)}
                            title={selectedBook?.kitap_adi}
                            style={{
                                width: '100%',
                                height: readerFullScreen ? 'calc(100vh - 130px)' : '72vh',
                                border: '1px solid #e2e8f0',
                                borderRadius: 8
                            }}
                        />
                    ) : (
                        <Box sx={{ py: 8, textAlign: 'center' }}>
                            <Typography variant="body1" sx={{ mb: 2 }}>
                                {t('non_pdf_reader_notice')}
                            </Typography>
                            <Stack direction="row" spacing={2} justifyContent="center">
                                <Button
                                    variant="contained"
                                    startIcon={<DownloadIcon />}
                                    onClick={() => handleDownload(selectedBook)}
                                >
                                    {t('download')}
                                </Button>
                                {getReadableUrl(selectedBook) && (
                                    <Button
                                        variant="outlined"
                                        startIcon={<OpenInNewIcon />}
                                        component="a"
                                        href={getReadableUrl(selectedBook)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {t('open_in_new_tab')}
                                    </Button>
                                )}
                            </Stack>
                        </Box>
                    )}
                </DialogContent>

                <DialogActions>
                    <Button onClick={() => setReaderOpen(false)}>{t('close')}</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default CustomerEBook;
