import { useState, type JSX } from 'react';
import { useAlert } from '../context/AlertContext';
import { useQuery } from '@tanstack/react-query';
import {
    Box,
    Button,
    TextField,
    Typography,
    Paper,
    List,
    Select,
    FormControl,
    MenuItem,
    InputLabel,
    ListItem,
    ListItemIcon,
    ListItemText
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { type Forklift, getForklifts } from '../api/forklift';

type SimulationHistory = {
    timestamp: Date;
    forklift: Forklift | null;
    command: string;
    actions: ActionItem[];
};

type ActionItem = {
    icon: JSX.Element;
    description: string;
};

export default function CommandSimulation() {
    const [selectedForkliftModel, setSelectedForkliftModel] = useState<string>('');
    const [command, setCommand] = useState<string>("");
    const [actionsHistory, setActionsHistory] = useState<SimulationHistory[]>([]);
    const { showError, showSuccess } = useAlert();

    // Fetch forklifts list
    const { data: forklifts, isLoading } = useQuery<Forklift[], Error>({
        queryKey: ['forklifts'],
        queryFn: getForklifts,
        retry: 1, // Optional: retry once on failure
        staleTime: 1000 * 60 * 5 // Optional: cache for 5 minutes
    });

    const parseCommand = (cmd: string): ActionItem[] => {
        const regex = /([FBLR])(\d+)/gi;
        let match;
        const result: ActionItem[] = [];
        let isMeterCommandValid = true;
        let isDegreeCommandValid = true;

        while ((match = regex.exec(cmd)) !== null) {
            const [, direction, valueStr] = match;
            const value = parseInt(valueStr, 10);

            switch (direction.toUpperCase()) {
                case 'F':
                    if (value >= 0) {
                        result.push({
                            description: `Move Forward by ${value} metres`,
                            icon: <ArrowUpwardIcon color="primary" />
                        });
                    }
                    else {
                        isMeterCommandValid = false;
                        console.error(`Invalid meter command: ${direction}${valueStr}. Should be over than 0.`);
                    }
                    break;
                case 'B':
                    if (value >= 0) {
                        result.push({
                            description: `Move Backward by ${value} metres`,
                            icon: <ArrowDownwardIcon color="primary" />
                        });
                    }
                    else {
                        isMeterCommandValid = false;
                        console.error(`Invalid meter command: ${direction}${valueStr}. Should be over than 0.`);
                    }
                    break;
                case 'L':
                case 'R':
                    // Check if the value is a multiple of 90 and between 0 and 360
                    if (value >= 0 && value <= 360 && value % 90 === 0) {
                        const directionText = direction.toUpperCase() === 'L' ? 'Left' : 'Right';
                        const icon = direction.toUpperCase() === 'L' ? <ArrowBackIcon color="primary" /> : <ArrowForwardIcon color="primary" />;

                        result.push({
                            description: `Turn ${directionText} by ${value} degrees`,
                            icon: icon
                        });
                    } else {
                        // Handle invalid degree values by skipping the command or throwing an error
                        // For this case, we'll simply skip the invalid command
                        isDegreeCommandValid = false;

                        console.error(`Invalid turn command: ${direction}${valueStr}. Degrees must be a multiple of 90, between 0 and 360.`);
                    }
                    break;
            }
        }

        if (!isMeterCommandValid) {
            showError(`Invalid meter commandL Meter must be over than 0.`);
            return [];
        }

        if (!isDegreeCommandValid) {
            showError(`Invalid turn command: Degrees must be a multiple of 90, between 0 and 360.`);
            return [];
        }

        return result;
    };

    const handleSimulate = () => {
        if (!selectedForkliftModel) {
            showError('Please select a forklift before simulating.');
            return;
        }

        if (!/^[FBLR]\d+([FBLR]\d+)*$/.test(command)) {
            showError('Invalid command format. Use like: F10R90L90B5');
            return;
        }

        // Find forklift object based on selected model
        const forklift = forklifts?.find(f => f.modelNumber === selectedForkliftModel) || null;
        const newActions = parseCommand(command);

        if (newActions && newActions.length > 0) {
            const newEntry: SimulationHistory = {
                timestamp: new Date(),
                forklift: forklift,
                command,
                actions: newActions
            };

            setActionsHistory(prevHistory => [newEntry, ...prevHistory]);
            showSuccess('Send operate commands to Forklift.');
        }
    };

    return (
        <Box display="flex" flexDirection="column" gap={3}>
            <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom fontWeight={700}>
                    Enter Forklift Movement Command
                </Typography>

                <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} gap={2} mb={2}>
                    <FormControl fullWidth>
                        <InputLabel id="forklift-select-label">Forklift</InputLabel>
                        <Select
                            labelId="forklift-select-label"
                            id="forklift-select"
                            value={selectedForkliftModel}
                            onChange={(e) => setSelectedForkliftModel(e.target.value as string)}
                            label="Forklift"
                            displayEmpty
                            disabled={isLoading}
                            renderValue={(selected) => {
                                if (selected === '') {
                                    return (
                                        <Typography color="text.secondary">
                                            {isLoading ? 'Loading...' : ''}
                                        </Typography>
                                    );
                                }
                                const forklift = forklifts?.find(f => f.modelNumber === selected);
                                return `${forklift?.name} (${forklift?.modelNumber})`;
                            }}
                        >
                            {/* Loading state can be handled within the select itself */}
                            {!isLoading && forklifts?.map((forklift) => (
                                <MenuItem key={forklift.modelNumber} value={forklift.modelNumber}>
                                    {forklift.name} ({forklift.modelNumber})
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <TextField
                        label="Movement Command"
                        value={command}
                        onChange={(e) => setCommand(e.target.value)}
                        fullWidth
                        placeholder="For example: F10R90L90B5"
                    />

                    <Button
                        variant="contained"
                        startIcon={<PlayArrowIcon />}
                        onClick={handleSimulate}
                        disabled={!selectedForkliftModel || !command}
                        sx={{ alignSelf: 'center', width: 200 }}
                    >
                        Simulate
                    </Button>
                </Box>
            </Paper>
            {actionsHistory.length > 0 && (
                <Paper sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom fontWeight={700}>
                        Simulation History
                    </Typography>
                    {actionsHistory.map((entry, historyIndex) => (
                        <Box key={historyIndex} mb={3}>
                            <Typography variant="subtitle1" fontWeight={600}>
                                {`Forklift: ${entry.forklift?.name} (${entry.forklift?.modelNumber})`}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {`Command: "${entry.command}" - ${entry.timestamp.toLocaleString()}`}
                            </Typography>
                            <List dense>
                                {entry.actions.map((action, actionIndex) => (
                                    <ListItem key={actionIndex} disableGutters>
                                        <ListItemIcon>
                                            {action.icon}
                                        </ListItemIcon>
                                        <ListItemText primary={action.description} />
                                    </ListItem>
                                ))}
                            </List>
                        </Box>
                    ))}
                </Paper>
            )}
        </Box>
    );
}
