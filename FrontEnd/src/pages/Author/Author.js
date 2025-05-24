import React, { useEffect, useState } from 'react';
import {
    Container,
    Typography,
    Paper,
    Box,
    Button,
    Modal
} from '@mui/material';
import Swal from 'sweetalert2';
import { DataGrid } from '@mui/x-data-grid';
import AuthorService from "../../services/AuthorService.js";
import { useNavigate } from 'react-router-dom';


const authorService = new AuthorService();

const Author = () => {
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
            Swal.fire('Error', 'Failed to fetch authors', 'error');
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'name_surname', headerName: 'Name Surname', width: 200 },
        {
            field: 'birthday_date',
            headerName: 'Birthday',
            width: 150,
            valueFormatter: (params) => {
                const value = params;
                return value ? value.split('T')[0] : 'N/A';
            }
        },
        {
            field: 'biography',
            headerName: 'Biography',
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
                    Detay
                </Button>
            )
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 120,
            renderCell: (params) => (
                <Button
                    variant="contained"
                    size="small"
                    onClick={() => navigate(`/author/edit/${params.row.id}`)}
                >
                    Düzenle
                </Button>
            ),
        }

    ];

    return (
        <Container sx={{ mt: 4 }}>
            <Typography variant="h5" gutterBottom>
                Author List
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
                        {selectedAuthor.name_surname} - Biography
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
                            Kapat
                        </Button>
                    </Box>
                </Box>
            </Modal>

        </Container>
    );
};

export default Author;
