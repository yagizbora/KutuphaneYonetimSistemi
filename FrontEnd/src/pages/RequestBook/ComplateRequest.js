import React, { useState, useEffect } from 'react';
import {
    Typography,
    Box,
    Grid,
    TextField,
    Checkbox,
    FormControlLabel,
    Button,
    Container
} from '@mui/material';
import { useParams, useNavigate } from "react-router-dom";
import dayjs from 'dayjs';
import Swal from 'sweetalert2';
import RequestService from '../../services/RequestService';

const requestservice = new RequestService();

const ComplateRequest = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [request, setRequest] = useState(null);
    const [loading, setLoading] = useState(true);

    const getdata = async () => {
        try {
            const response = await requestservice.getbookrequestbyid(id);
            if (response) {
                setRequest({
                    ...response,
                    request_start_time: dayjs(response.request_start_time).format('YYYY-MM-DD'),
                    request_deadline: dayjs(response.request_deadline).format('YYYY-MM-DD'),
                });
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            const response = await requestservice.complatedbookrequest({
                id: request.id,
                book_name: request.book_name,
                comment: request.comment,
                is_complated: request.is_complated,
                closed_subject_details: request.closed_subject_details,
                request_start_time: request.request_start_time,
                request_deadline: request.request_deadline
            });

            if (response) {
                Swal.fire('Başarılı', response.data.message || 'Güncellendi.', 'success').then(() => {
                    navigate(-1);
                });
            }
        } catch (err) {
            console.error(err);
            Swal.fire('Hata', 'Güncelleme sırasında bir sorun oluştu.', 'error');
        }
    };

    useEffect(() => {
        getdata();
    }, []);

    if (loading || !request) return <Typography align="center">Yükleniyor...</Typography>;

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Box>
                <Typography variant="h4" gutterBottom>
                    Kitap İsteğini Güncelle
                </Typography>

                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Kitap Adı"
                            value={request.book_name}
                            onChange={(e) =>
                                setRequest(prev => ({ ...prev, book_name: e.target.value }))
                            }
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Yorum"
                            value={request.comment}
                            onChange={(e) =>
                                setRequest(prev => ({ ...prev, comment: e.target.value }))
                            }
                        />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <TextField
                            fullWidth
                            label="Başlangıç Tarihi"
                            type="date"
                            value={request.request_start_time}
                            onChange={(e) =>
                                setRequest(prev => ({ ...prev, request_start_time: e.target.value }))
                            }
                            InputLabelProps={{ shrink: true }}
                        />
                    </Grid>

                    <Grid item xs={12} sm={3}>
                        <TextField
                            fullWidth
                            label="Bitiş Tarihi"
                            type="date"
                            value={request.request_deadline}
                            onChange={(e) =>
                                setRequest(prev => ({ ...prev, request_deadline: e.target.value }))
                            }
                            InputLabelProps={{ shrink: true }}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={request.is_complated}
                                    onChange={(e) =>
                                        setRequest(prev => ({ ...prev, is_complated: e.target.checked }))
                                    }
                                />
                            }
                            label="Tamamlandı mı?"
                        />
                    </Grid>

                    <Grid item xs={12} width="100%">
                        <TextField
                            label="Kapanış Notu"
                            fullWidth
                            multiline
                            rows={6}
                            sx={{ minHeight: '150px' }}
                            value={request.closed_subject_details || ''}
                            onChange={(e) =>
                                setRequest(prev => ({ ...prev, closed_subject_details: e.target.value }))
                            }
                        />
                    </Grid>
                </Grid>
                <Box mt={3}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSave}
                    >
                        Kaydet
                    </Button>
                </Box>


            </Box>
        </Container>
    );
};

export default ComplateRequest;
