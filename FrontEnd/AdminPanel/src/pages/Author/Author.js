import React, { useEffect, useState } from 'react';
import {
    Container,
    Stack,
    Typography,
    Paper,
    Box,
    Button,
    Modal,
    IconButton

} from '@mui/material';
import Swal from 'sweetalert2';
import { DataGrid } from '@mui/x-data-grid';
import AuthorService from "../../services/AuthorService.js";
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';

const authorService = new AuthorService();

const Author = () => {
    const { t } = useTranslation();
    const [authors, setAuthors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openModal, setOpenModal] = useState(false);
    const [selectedAuthor, setSelectedAuthor] = useState({ name_surname: '', biography: '' });

    const navigate = useNavigate();

    useEffect(() => {
        fetchAuthors();
    }, []);

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

    const deleteAuthor = async (data) => {
        try {
            const result = await Swal.fire({
                title: t('are_you_sure'),
                text: t('revert_warning'),
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: t('yes_delete'),
                cancelButtonText: t('cancel')
            })
            if (result.isConfirmed) {
                const response = await authorService.DeleteAuthor(data);
                if (response) {
                    Swal.fire(t('deleted'), response.data.message || t('author_deleted_successfully'), 'success');
                    fetchAuthors();
                }
            }

        }
        catch (error) {
            Swal.fire(t('error'), error.response?.data?.message || t('error_deleting_author'), 'error');
        }
    }

    const columns = [
        { field: 'id', headerName: t('id'), width: 70 },
        { field: 'name_surname', headerName: t('name_surname'), width: 200 },
        {
            field: 'birthday_date',
            headerName: t('birthday'),
            width: 150,
            valueFormatter: (params) => {
                const value = params;
                return value ? value.split('T')[0] : 'N/A';
            }
        },
        {
            field: 'biography',
            headerName: t('biography'),
            width: 150,
            sortable: false,
            renderCell: (params) => (
                <Button
                    variant="outlined"
                    size="small"
                    onClick={() => {
                        setSelectedAuthor({
                            name_surname: params.row.name_surname,
                            biography: params.value
                        });
                        setOpenModal(true);
                    }}
                >
                    {t('details')}
                </Button>
            )
        },
        {
            field: 'actions',
            headerName: t('actions'),
            width: 160,
            renderCell: (params) => (
                <Stack direction="row" spacing={4}>
                    <Button
                        variant="contained"
                        size="small"
                        onClick={() => navigate(`/author/edit/${params.row.id}`)}
                    >
                        {t('edit')}
                    </Button>
                    <IconButton
                        variant="contained"

                        color="error"
                        onClick={() => deleteAuthor(params)}
                    >
                        <DeleteIcon />
                    </IconButton>
                </Stack>

            ),
        }

    ];

    return (
        <Container sx={{ mt: 4 }}>
            <Typography variant="h5" gutterBottom>
                {t('author_list')}
            </Typography>
            <Paper sx={{ p: 2 }}>
                <Box sx={{ height: 600, width: '100%' }}>
                    <DataGrid
                        rows={authors}
                        columns={columns}
                        pageSize={5}
                        rowsPerPageOptions={[5, 10, 20]}
                        loading={loading}
                        disableSelectionOnClick
                    />
                </Box>
            </Paper>

            {/* FULLSCREEN MODAL */}
            <Modal
                open={openModal}
                onClose={() => setOpenModal(false)}
                aria-labelledby="author-biography-title"
                aria-describedby="author-biography-description"
            >
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: { xs: '90%', sm: 600, md: 700 },
                        maxHeight: '80vh',
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        p: 4,
                        overflowY: 'auto',
                        borderRadius: 2,
                    }}
                >
                    <Typography id="author-biography-title" variant="h4" gutterBottom>
                        {selectedAuthor.name_surname} - {t('biography')}
                    </Typography>
                    <Typography
                        id="author-biography-description"
                        variant="body1"
                        sx={{ whiteSpace: 'pre-line', fontSize: '1.1rem' }}
                    >
                        {selectedAuthor.biography}
                    </Typography>
                    <Box sx={{ mt: 4, textAlign: 'right' }}>
                        <Button variant="contained" color="primary" onClick={() => setOpenModal(false)}>
                            {t('close')}
                        </Button>
                    </Box>
                </Box>
            </Modal>

        </Container>
    );
};

export default Author;
