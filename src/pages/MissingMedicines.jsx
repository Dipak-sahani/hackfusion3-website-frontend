import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    Chip,
    CircularProgress,
    Alert,
    Snackbar
} from '@mui/material';
import { medicineAPI } from '../services/api';

const MissingMedicines = () => {
    const [missingItems, setMissingItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    useEffect(() => {
        fetchMissingMedicines();
    }, []);

    const fetchMissingMedicines = async () => {
        setLoading(true);
        try {
            const response = await medicineAPI.getMissing();
            setMissingItems(response.data);
            setError('');
        } catch (err) {
            console.error('Failed to fetch missing medicines:', err);
            setError('Failed to load missing medicines.');
        } finally {
            setLoading(false);
        }
    };

    const handleResolve = async (id, name) => {
        try {
            await medicineAPI.resolveMissing(id);
            setSnackbar({ open: true, message: `${name} marked as resolved.`, severity: 'success' });
            fetchMissingMedicines(); // Refresh the list
        } catch (err) {
            console.error('Failed to resolve missing medicine:', err);
            setSnackbar({ open: true, message: `Failed to resolve ${name}.`, severity: 'error' });
        }
    };

    const handleCloseSnackbar = () => setSnackbar(prev => ({ ...prev, open: false }));

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box p={3}>
            <Typography variant="h4" gutterBottom fontWeight="bold" color="primary">
                Missing Medicines Alerts
            </Typography>
            <Typography variant="body1" color="textSecondary" paragraph>
                These medicines were requested by users (via prescriptions) but are not currently available in the inventory. Please add them to your stock.
            </Typography>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            <TableContainer component={Paper} elevation={3}>
                <Table>
                    <TableHead sx={{ backgroundColor: 'primary.main' }}>
                        <TableRow>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Medicine Name</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="center">Times Requested</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Last Requested</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Status</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {missingItems.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} align="center">
                                    <Typography py={3} color="textSecondary">
                                        No missing medicines currently tracked.
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            missingItems.map((item) => (
                                <TableRow key={item._id} hover>
                                    <TableCell component="th" scope="row">
                                        <Typography fontWeight="500">{item.name}</Typography>
                                    </TableCell>
                                    <TableCell align="center">
                                        <Chip
                                            label={item.requestedCount}
                                            color={item.requestedCount > 3 ? "error" : "default"}
                                            size="small"
                                            variant={item.requestedCount > 3 ? "filled" : "outlined"}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        {new Date(item.lastRequestedAt).toLocaleDateString()} at {new Date(item.lastRequestedAt).toLocaleTimeString()}
                                    </TableCell>
                                    <TableCell>
                                        <Chip label={item.status} color="warning" size="small" />
                                    </TableCell>
                                    <TableCell align="right">
                                        <Button
                                            variant="contained"
                                            color="success"
                                            size="small"
                                            onClick={() => handleResolve(item._id, item.name)}
                                        >
                                            Mark Resolved
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default MissingMedicines;
