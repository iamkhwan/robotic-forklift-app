import { useAlert } from '../context/AlertContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    Box,
    Button,
    Typography,
    Paper,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    TablePagination,
    TableSortLabel
} from '@mui/material';
import type { TablePaginationProps } from '@mui/material/TablePagination';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { type Forklift, getForklifts, uploadForklifts } from '../api/forklift';
import { useState, useEffect, type ChangeEvent } from 'react';
import Papa from 'papaparse';

const columns: { key: keyof Forklift; label: string }[] = [
    { key: 'name', label: 'Name' },
    { key: 'modelNumber', label: 'Model Number' },
    { key: 'manufacturingDate', label: 'Manufacturing Date' },
];

type Order = 'asc' | 'desc';

export default function FleetInventory() {
    const { showError, showSuccess } = useAlert();
    const queryClient = useQueryClient();

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [order, setOrder] = useState<Order>('asc');
    const [orderBy, setOrderBy] = useState<keyof Forklift>('name');

    // Fetch forklifts list
    const { data: forklifts, isLoading, isError, error } = useQuery<Forklift[], Error>({
        queryKey: ['forklifts'],
        queryFn: getForklifts,
        retry: 1, // Optional: retry once on failure
        staleTime: 1000 * 60 * 5 // Optional: cache for 5 minutes
    });

    // Mutation to upload forklifts
    const mutation = useMutation({
        mutationFn: uploadForklifts,
        onSuccess: () => {
            showSuccess('Data uploaded successfully!');
            queryClient.invalidateQueries({ queryKey: ['forklifts'] });
        },
        onError: (err: unknown) => {
            if (err instanceof Error) {
                showError(`Failed to upload forklift data: ${err.message}`);
            } else {
                showError('Failed to upload forklift data.');
            }
        }
    });

    useEffect(() => {
        if (isError) {
            if (error instanceof Error) {
                showError(error.message);
            } else {
                showError('Failed to load forklift data.');
            }
        }
    }, [showError, isError, error]);

    const handleChangePage: TablePaginationProps['onPageChange'] = (_event, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleRequestSort = (_event: React.MouseEvent<unknown>, property: keyof Forklift) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const sortedForklifts = forklifts
        ? [...forklifts].sort((a, b) => {
            if (a[orderBy] < b[orderBy]) return order === 'asc' ? -1 : 1;
            if (a[orderBy] > b[orderBy]) return order === 'asc' ? 1 : -1;
            return 0;
        })
        : [];

    const paginatedForklifts = sortedForklifts?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    // Validate & normalize data before upload
    const validateForkliftData = (data: unknown): Forklift[] => {
        if (!Array.isArray(data)) {
            throw new Error('Invalid data format. Expected an array.');
        }

        return data.map((item, index) => {
            if (typeof item !== 'object' || item === null) {
                throw new Error(`Item at index ${index + 1} is not an object.`);
            }

            const obj = item as Record<string, unknown>;

            const name = (obj.name ?? obj.Name) as string | undefined;
            const modelNumber = (obj.modelNumber ?? obj.model_number) as string | undefined;
            const manufacturingDate = (obj.manufacturingDate ?? obj.manufacturing_date) as string | undefined;

            if (
                !name || typeof name !== 'string' ||
                !modelNumber || typeof modelNumber !== 'string' ||
                !manufacturingDate || typeof manufacturingDate !== 'string'
            ) {
                throw new Error(`Item at index ${index + 1} must have name, modelNumber, and manufacturingDate as non-empty strings.`);
            }

            return { name, modelNumber, manufacturingDate };
        });
    };

    // Handle file upload
    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        const maxFileSize = 5 * 1024 * 1024; // 5 MB in bytes

        if (!file) return;

        if (file && file.size > maxFileSize) {
            showError('File size exceeds 5MB. Please upload a smaller file.');
            event.target.value = '';
            return;
        }

        const fileExtension = file.name.split('.').pop()?.toLowerCase();

        if (fileExtension !== 'json' && fileExtension !== 'csv') {
            showError('Please upload a valid JSON or CSV file.');
            return;
        }

        try {
            const text = await file.text();
            let data: unknown;

            if (fileExtension === 'json') {
                data = JSON.parse(text);
            }
            else if (fileExtension === 'csv') {
                const parsed = Papa.parse(text, { header: true, skipEmptyLines: true });
                if (parsed.errors.length) {
                    throw new Error('Error parsing CSV file.');
                }
                data = parsed.data;
            }
            else {
                throw new Error('Unsupported file format.');
            }

            const validData = validateForkliftData(data);
            showSuccess('Uploading to server...');
            mutation.mutate(validData);
        }
        catch (err: unknown) {
            if (err instanceof Error) {
                showError(err.message);
            }
            else {
                showError('An error occurred while processing the file.');
            }
        }
        finally {
            event.target.value = '';
        }
    };

    return (
        <Box display="flex" flexDirection="column" gap={3}>
            <Paper>
                <Typography variant="h6" gutterBottom fontWeight={700}>
                    Upload Forklift Data
                </Typography>
                <Box display="flex" gap={2} alignItems="center">
                    <input
                        type="file"
                        accept=".json,.csv"
                        style={{ display: 'none' }}
                        id="file-upload"
                        onChange={handleFileUpload}
                    />
                    <label htmlFor="file-upload">
                        <Button variant="contained" startIcon={<CloudUploadIcon />} component="span">
                            Upload Forklift JSON/CSV File
                        </Button>
                    </label>
                </Box>
            </Paper>
            <Paper>
                <Typography variant="h6" gutterBottom fontWeight={700}>
                    Fleet List
                </Typography>
                {isLoading && <Typography>Loading forklifts...</Typography>}
                {isError && <Typography color="error">Error loading forklifts.</Typography>}
                {!isLoading && !isError && (
                    <>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    {columns.map(({ key, label }) => (
                                        <TableCell
                                            key={key}
                                            sx={{ fontWeight: 'bold' }}
                                            sortDirection={orderBy === key ? order : false}
                                        >
                                            <TableSortLabel
                                                active={orderBy === key}
                                                direction={orderBy === key ? order : 'asc'}
                                                onClick={(event) => handleRequestSort(event, key)}
                                            >
                                                {label}
                                            </TableSortLabel>
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {paginatedForklifts?.map((f, idx) => (
                                    <TableRow key={idx}>
                                        <TableCell>{f.name}</TableCell>
                                        <TableCell>{f.modelNumber}</TableCell>
                                        <TableCell>{f.manufacturingDate}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>

                        {/* Pagination controls */}
                        <TablePagination
                            component="div"
                            count={forklifts?.length || 0}
                            page={page}
                            onPageChange={handleChangePage}
                            rowsPerPage={rowsPerPage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                            rowsPerPageOptions={[5, 10, 25]}
                        />
                    </>
                )}
            </Paper>
        </Box>
    );
}