import React, { useState } from 'react';
import {
    Container,
    Typography,
    Paper,
    TextField,
    Button,
    Box,
    IconButton
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import Swal from 'sweetalert2';
import AuthorService from "../../services/AuthorService.js";

const authorService = new AuthorService();

const AuthorCreate = () => {
    const [author, setAuthor] = useState({
        name_surname: "",
        birthday_date: "",
        biography: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setAuthor((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!author.name_surname || !author.birthday_date || !author.biography) {
            Swal.fire('Error', 'All fields are required!', 'error');
            return;
        }

        try {
            const response = await authorService.createauthor(author);
            if (response) {
                Swal.fire('Success', response.data.message || 'Author created successfully!', 'success');
                setAuthor({
                    name_surname: "",
                    birthday_date: "",
                    biography: ""
                });
            }

        } catch (error) {
            Swal.fire('Error', error.response.data.message || 'Something went wrong!', 'error');
            console.log(error.response.data.message);
        }
    };

    const handleReset = () => {
        setAuthor({
            name_surname: "",
            birthday_date: "",
            biography: ""
        });
    };

    return (
        <Container sx={{ mt: 4 }}>
            <Typography variant="h5" align="left" gutterBottom>
                Create Author
            </Typography>
            <Paper sx={{ p: 3 }}>
                <Box component="form" noValidate autoComplete="off" onSubmit={handleSubmit}>
                    <TextField
                        label="Name Surname"
                        name="name_surname"
                        value={author.name_surname}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        required
                    />
                    <TextField
                        label="Birthday"
                        name="birthday_date"
                        type="date"
                        value={author.birthday_date}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        required
                    />
                    <TextField
                        label="Biography"
                        name="biography"
                        value={author.biography}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        multiline
                        rows={4}
                        required
                    />
                    <Box mt={2} display="flex" justifyContent="space-between">
                        <Button variant="contained" color="primary" type="submit">
                            Save
                        </Button>
                        <IconButton onClick={handleReset} color="error">
                            <DeleteIcon />
                        </IconButton>
                    </Box>
                </Box>
            </Paper>
        </Container>
    );
};

export default AuthorCreate;
