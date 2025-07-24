import React, { useEffect, useState } from 'react';
import {
    Container,
    Typography,
    Paper,
    TextField,
    Button,
    Box,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import AuthorService from '../../services/AuthorService.js';

const authorService = new AuthorService();

const AuthorEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [author, setAuthor] = useState([]);

    useEffect(() => {
        if (id) {
            fetchAuthor();
        }
    }, [id]);

    const fetchAuthor = async () => {
        try {
            const response = await authorService.getAllAuthorsbyid(id);
            const data = response.data[0];
            setAuthor({
                id: data.id || '',
                name_surname: data.name_surname || '',
                birthday_date: data.birthday_date?.split('T')[0] || '',
                biography: data.biography || '',
            });
        } catch (err) {
            console.log(err)
            Swal.fire('Error', err?.response?.data?.message || 'Author could not be loaded.', 'error');
        }
    };

    const handleChange = (e) => {
        setAuthor({ ...author, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await authorService.EditAuthor(author);
            Swal.fire('Updated!', 'Author has been updated.', 'success');
            navigate('/author');
        } catch (err) {
            Swal.fire('Error', 'Failed to update author.', 'error');
        }
    };

    return (
        <Container sx={{ mt: 4 }}>
            <Typography variant="h5" align="left" gutterBottom>
                Edit Author
            </Typography>
            <Paper sx={{ p: 3 }}>
                <Box component="form" noValidate onSubmit={handleSubmit}>
                    <TextField
                        label="Name Surname"
                        name="name_surname"
                        value={author.name_surname || ''}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        required
                    />

                    <TextField
                        label="Birthday Date"
                        name="birthday_date"
                        type="date"
                        value={author.birthday_date || ''}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        InputLabelProps={{ shrink: true }}
                        required
                    />
                    <TextField
                        label="Biography"
                        name="biography"
                        value={author.biography || ''}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        multiline
                        rows={8}
                    />

                    <Box mt={2} textAlign="right">
                        <Button type="submit" variant="contained" color="primary">
                            Save
                        </Button>
                    </Box>
                </Box>
            </Paper>
        </Container>
    );
};

export default AuthorEdit;
