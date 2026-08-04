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
    IconButton,
    MenuItem
} from '@mui/material';
import Swal from 'sweetalert2';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import DialogContentText from '@mui/material/DialogContentText';
import { useTranslation } from 'react-i18next';
import BookTypeService from '../../services/BookTypeService';
import BookTypeGroupService from '../../services/BookTypeGroupService';

const booktypeservice = new BookTypeService();
const bookTypeGroupService = new BookTypeGroupService();

const BookType = () => {
    const { t } = useTranslation();

    const [data, setData] = useState([]);
    const [groups, setGroups] = useState([]);
    const [createbooktype, setcreatebooktype] = useState({ aciklama: '', book_group_id: '' });
    const [openeditdialog, setOpeneditdialog] = useState(false);
    const [editdata, setEditdata] = useState({
        id: null,
        aciklama: null,
        book_group_id: ''
    });

    useEffect(() => {
        getbooktype();
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
                setGroups(formattedData);
            }
        } catch (error) {
            console.error(t('error_loading_groups'), error);
        }
    };

    const handleDelete = async (id) => {
        try {
            const response = await booktypeservice.deletebooktype(id);
            if (response) {
                Swal.fire({
                    icon: 'success',
                    title: t('success'),
                    text: response?.message || t('book_type_deleted_successfully'),
                })
                getbooktype();
            }
        }
        catch (error) {
            Swal.fire({
                icon: 'error',
                title: t('error'),
                text: error?.response?.data?.message || t('book_type_could_not_be_deleted'),
            })
            console.error(error);
        }
    }

    const handleEditClick = async (row) => {
        try {
            const response = await booktypeservice.getbooktypebyid(row.id);
            if (response) {
                const data = response.data.data[0];
                setEditdata({
                    id: data.kitap_tur_kodu,
                    aciklama: data.aciklama,
                    book_group_id: data.book_group_id || ''
                });
                setOpeneditdialog(true);
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: t('error'),
                text: error?.response?.data?.message || t('error_fetching_book_type_details'),
            });
        }
    };

    const disabledbuttonandinput = () => {
        if (!createbooktype.aciklama || !createbooktype.book_group_id) {
            return true;
        }
        else {
            return false;
        }
    }

    const handleEditSubmit = async () => {
        try {
            const response = await booktypeservice.booktypeupdatebyid(
                {
                    kitap_tur_kodu: editdata.id,
                    aciklama: editdata.aciklama,
                    book_group_id: editdata.book_group_id
                }
            );
            if (response) {
                Swal.fire({
                    icon: 'success',
                    title: t('success'),
                    text: t('book_type_updated_successfully'),
                });
                setOpeneditdialog(false);
                getbooktype();
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: t('error'),
                text: error?.response?.data?.message || t('error_updating_book_type'),
            });
        }
    };

    const createbooktyperequest = async () => {
        if (!createbooktype.aciklama || !createbooktype.book_group_id) {
            Swal.fire({
                icon: 'error',
                title: t('error'),
                text: t('type_group_and_description_cannot_be_empty'),
            });
            return;
        }
        try {
            const response = await booktypeservice.createbooktype({
                aciklama: createbooktype.aciklama,
                book_group_id: createbooktype.book_group_id
            })
            if (response) {
                Swal.fire({
                    icon: 'success',
                    title: t('success'),
                    text: response?.message || t('book_type_added_successfully'),
                });
                setcreatebooktype({
                    aciklama: '',
                    book_group_id: ''
                });
                getbooktype();
            }
        }
        catch (error) {
            Swal.fire({
                icon: 'error',
                title: t('error'),
                text: error?.response?.data?.message || t('error_adding_book_type'),
            });
        }
    }

    const getbooktype = async () => {
        try {
            const response = await booktypeservice.getbooktypes();
            if (response) {
                setData(response.data.data);
            }
        }
        catch (error) {
            Swal.fire({
                icon: 'error',
                title: t('error'),
                text: error?.response?.data?.message || t('error_fetching_book_type_details') || error,
            })
        }
    }

    return (
        <>
            <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
                <Box sx={{ width: '100%', mb: 4, textAlign: 'center' }}>
                    <Typography variant="h4" component="h1" gutterBottom>
                        {t('book_type_list')}
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary">
                        {t('manage_all_book_types')}
                    </Typography>
                </Box>
                <Paper elevation={3} sx={{ width: '60%', mb: 4, p: 2, mx: 'auto' }}>
                    <Stack direction="row" spacing={2} justifyContent="center" alignItems="center" sx={{ mb: 2 }}>
                        <TextField
                            select
                            label={t('type_group')}
                            variant="outlined"
                            value={createbooktype.book_group_id}
                            onChange={(e) => setcreatebooktype({ ...createbooktype, book_group_id: e.target.value })}
                            sx={{ width: '50%' }}
                        >
                            {groups.map((group) => (
                                <MenuItem key={group.id} value={group.id}>
                                    {group.book_types_group}
                                </MenuItem>
                            ))}
                        </TextField>
                        <TextField
                            label={t('description')}
                            variant="outlined"
                            value={createbooktype.aciklama}
                            onChange={(e) => setcreatebooktype({ ...createbooktype, aciklama: e.target.value })}
                            sx={{ width: '50%' }}
                        />
                    </Stack>
                    <Button variant="contained"
                        onClick={createbooktyperequest}
                        disabled={disabledbuttonandinput()}
                    >{t('add_book_type')}</Button>
                </Paper>

                <Box sx={{ width: '60%', mx: 'auto', p: 4, borderRadius: 2, mb: 4 }}>
                    {data.map((group) => (
                        <Box key={group.book_group_id} sx={{ mb: 4 }}>
                            {/* Grup Başlığı */}
                            <Typography 
                                variant="h6" 
                                component="div"
                                sx={{ 
                                    fontWeight: 'bold', 
                                    mb: 2,
                                }}
                            >
                                {group.book_types_group}
                            </Typography>
                            
                            {/* Grup Altındaki Kitap Türleri */}
                            <Box component="ul" sx={{ listStyleType: 'disc', pl: 4, m: 0 }}>
                                {group.bookTypes && group.bookTypes.map((type) => (
                                    <Box component="li" key={type.kitap_tur_kodu} sx={{ mb: 2 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pr: 2 }}>
                                            <Typography component="span" sx={{ fontSize: '1rem', lineHeight: 1.5 }}>
                                                <strong>{type.aciklama}</strong>
                                            </Typography>
                                            
                                            {/* İşlemler */}
                                            <Stack direction="row" spacing={1}>
                                                <IconButton 
                                                    size="small" 
                                                    color="primary"
                                                    onClick={() => handleEditClick({ id: type.kitap_tur_kodu, aciklama: type.aciklama })}
                                                    title={t('edit')}
                                                >
                                                    <EditIcon fontSize="small" />
                                                </IconButton>
                                                <IconButton 
                                                    size="small" 
                                                    color="error"
                                                    onClick={() => handleDelete(type.kitap_tur_kodu)}
                                                    title={t('delete')}
                                                >
                                                    <DeleteIcon fontSize="small" />
                                                </IconButton>
                                            </Stack>
                                        </Box>
                                    </Box>
                                ))}
                            </Box>
                        </Box>
                    ))}
                </Box>
            </Container>

            <Dialog
                open={openeditdialog}
                onClose={() => setOpeneditdialog(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>
                    <DialogContentText>
                        {t('edit_book_type')}
                    </DialogContentText>
                </DialogTitle>
                <DialogContent>
                    <TextField
                        select
                        fullWidth
                        margin="normal"
                        label={t('type_group')}
                        value={editdata.book_group_id}
                        onChange={(e) => setEditdata({ ...editdata, book_group_id: e.target.value })}
                    >
                        {groups.map((group) => (
                            <MenuItem key={group.id} value={group.id}>
                                {group.book_types_group}
                            </MenuItem>
                        ))}
                    </TextField>
                    <TextField
                        fullWidth
                        margin="normal"
                        label={t('description')}
                        value={editdata.aciklama}
                        onChange={(e) => setEditdata({ ...editdata, aciklama: e.target.value })}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpeneditdialog(false)}>{t('cancel')}</Button>
                    <Button onClick={handleEditSubmit} variant="contained" color="primary">
                        {t('save')}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default BookType;