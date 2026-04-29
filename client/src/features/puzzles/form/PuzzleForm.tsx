import { zodResolver } from '@hookform/resolvers/zod';
import ExtensionIcon from '@mui/icons-material/Extension';
import {
    Box,
    Button,
    Chip,
    Container,
    Divider,
    FormControl,
    FormControlLabel,
    FormHelperText,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Switch,
    Typography,
} from '@mui/material';
import { useEffect } from 'react';
import { Chessboard } from 'react-chessboard';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router';
import TextInput from '../../../app/shared/components/TextInput';
import { usePuzzles } from '../../../lib/hooks/usePuzzles';
import { PuzzleSchema, puzzleSchema } from '../../../lib/schemas/puzzleSchema';

const PUZZLE_CATEGORIES = [
    'Мат в 1',
    'Мат в 2',
    'Мат в 3',
    'Тактика',
    'Ендшпил',
    'Стратегия',
    'Дебют',
    'Вилка',
    'Щифт',
    'Разкрит шах',
    'Жертва',
    'Друго',
];

export default function PuzzleForm() {
    const { control, reset, handleSubmit, watch, formState: { isValid, isSubmitting } } = useForm<PuzzleSchema>({
        mode: 'onTouched',
        resolver: zodResolver(puzzleSchema),
        defaultValues: {
            number: 0,
            description: '',
            fen: '',
            solution: '',
            difficulty: '',
            points: 10,
            whiteToMove: true,
            category: '',
        },
    });
    const navigate = useNavigate();
    const { id } = useParams();
    const { updatePuzzle, createPuzzle, puzzle } = usePuzzles(id);

    const fenValue = watch('fen');
    const whiteToMoveValue = watch('whiteToMove');

    useEffect(() => {
        if (puzzle) reset({
            number: puzzle.number,
            description: puzzle.description,
            fen: puzzle.fen,
            solution: puzzle.solution,
            difficulty: puzzle.difficulty,
            points: puzzle.points,
            whiteToMove: puzzle.whiteToMove,
            category: puzzle.category,
        });
    }, [puzzle, reset]);

    const onSubmit = async (data: PuzzleSchema) => {
        try {
            if (puzzle) {
                updatePuzzle.mutate(
                    { ...puzzle, ...data },
                    { onSuccess: () => navigate(`/puzzles/${puzzle.id}`) }
                );
            } else {
                createPuzzle.mutate(data, {
                    onSuccess: (id) => navigate(`/puzzles/${id}`),
                });
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <Container maxWidth="md" sx={{ pt: 12, pb: 4, minHeight: '100vh' }}>
            <Paper
                elevation={3}
                sx={{
                    borderRadius: 3,
                    p: 4,
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                }}
            >
                <Box sx={{ textAlign: 'center', mb: 3 }}>
                    <ExtensionIcon sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
                    <Typography variant="h5" fontWeight={700} color="primary.dark">
                        {puzzle ? 'Редактиране на задача' : 'Нова шахматна задача'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        {puzzle
                            ? 'Редактирайте полетата по-долу и натиснете „Потвърди"'
                            : 'Попълнете полетата по-долу, за да публикувате нова задача'}
                    </Typography>
                </Box>

                <Divider sx={{ mb: 3 }} />

                <Box
                    component="form"
                    onSubmit={handleSubmit(onSubmit)}
                    display="flex"
                    flexDirection="column"
                    gap={3}
                >
                    {/* Basic Info */}
                    <TextInput label="Номер на задача" control={control} name="number" />
                    <TextInput
                        label="Описание"
                        control={control}
                        name="description"
                        multiline
                        rows={3}
                    />

                    <Divider>
                        <Chip label="Позиция" size="small" />
                    </Divider>

                    {/* FEN & Board Preview */}
                    <TextInput
                        label="FEN позиция"
                        control={control}
                        name="fen"
                        placeholder="rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
                    />

                    {fenValue && (
                        <Box
                            display="flex"
                            justifyContent="center"
                            sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 2 }}
                        >
                            <Chessboard
                                id={fenValue}
                                position={fenValue}
                                boardWidth={320}
                                arePiecesDraggable={false}
                                boardOrientation={whiteToMoveValue ? 'white' : 'black'}
                                customBoardStyle={{ borderRadius: '8px' }}
                                customDarkSquareStyle={{ backgroundColor: '#779952' }}
                                customLightSquareStyle={{ backgroundColor: '#edeed1' }}
                            />
                        </Box>
                    )}

                    {/* White to Move toggle */}
                    <Controller
                        name="whiteToMove"
                        control={control}
                        render={({ field }) => (
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1,
                                    p: 1.5,
                                    bgcolor: field.value ? 'grey.50' : 'grey.800',
                                    borderRadius: 2,
                                    transition: 'background-color 0.3s',
                                }}
                            >
                                <Box
                                    sx={{
                                        width: 24,
                                        height: 24,
                                        borderRadius: '50%',
                                        bgcolor: field.value ? '#fff' : '#333',
                                        border: '2px solid',
                                        borderColor: field.value ? 'grey.400' : 'grey.600',
                                    }}
                                />
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={field.value}
                                            onChange={field.onChange}
                                            color="default"
                                        />
                                    }
                                    label={
                                        <Typography
                                            fontWeight={600}
                                            color={field.value ? 'text.primary' : 'white'}
                                        >
                                            {field.value ? 'Белите играят' : 'Черните играят'}
                                        </Typography>
                                    }
                                />
                            </Box>
                        )}
                    />

                    <TextInput
                        label="Решение (ходове разделени с интервал, напр. e2e4 e7e5 d1h5)"
                        control={control}
                        name="solution"
                        multiline
                        rows={2}
                    />

                    <Divider>
                        <Chip label="Параметри" size="small" />
                    </Divider>

                    {/* Category */}
                    <Controller
                        name="category"
                        control={control}
                        render={({ field, fieldState }) => (
                            <FormControl fullWidth error={!!fieldState.error}>
                                <InputLabel>Категория</InputLabel>
                                <Select {...field} label="Категория">
                                    {PUZZLE_CATEGORIES.map((cat) => (
                                        <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                                    ))}
                                </Select>
                                {fieldState.error && (
                                    <FormHelperText>{fieldState.error.message}</FormHelperText>
                                )}
                            </FormControl>
                        )}
                    />

                    {/* Difficulty & Points row */}
                    <Box display="flex" gap={2}>
                        <Controller
                            name="difficulty"
                            control={control}
                            render={({ field, fieldState }) => (
                                <FormControl fullWidth error={!!fieldState.error}>
                                    <InputLabel>Трудност</InputLabel>
                                    <Select {...field} label="Трудност">
                                        <MenuItem value="Лесна">🟢 Лесна</MenuItem>
                                        <MenuItem value="Средна">🟡 Средна</MenuItem>
                                        <MenuItem value="Трудна">🔴 Трудна</MenuItem>
                                    </Select>
                                    {fieldState.error && (
                                        <FormHelperText>{fieldState.error.message}</FormHelperText>
                                    )}
                                </FormControl>
                            )}
                        />

                        <TextInput
                            label="Точки"
                            control={control}
                            name="points"
                            type="number"
                        />
                    </Box>

                    <Divider sx={{ mt: 1 }} />

                    <Box display="flex" justifyContent="flex-end" gap={2}>
                        <Button
                            onClick={() => navigate(-1)}
                            color="inherit"
                            variant="outlined"
                            size="large"
                            sx={{ px: 4, py: 1.2, fontWeight: 600 }}
                        >
                            Отказ
                        </Button>
                        <Button
                            type="submit"
                            color="primary"
                            variant="contained"
                            size="large"
                            disabled={!isValid || isSubmitting || updatePuzzle.isPending || createPuzzle.isPending}
                            sx={{ px: 4, py: 1.2, fontWeight: 600 }}
                        >
                            {(updatePuzzle.isPending || createPuzzle.isPending)
                                ? 'Запазване...'
                                : 'Потвърди'}
                        </Button>
                    </Box>
                </Box>
            </Paper>
        </Container>
    );
}