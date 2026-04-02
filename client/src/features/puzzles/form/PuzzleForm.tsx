import { zodResolver } from '@hookform/resolvers/zod';
import ExtensionIcon from '@mui/icons-material/Extension';
import {
    Box,
    Button,
    Container,
    Divider,
    FormControl,
    FormHelperText,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Typography,
} from '@mui/material';
import { useEffect } from 'react';
import { Chessboard } from 'react-chessboard';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router';
import DateTimeInput from '../../../app/shared/components/DateTimeInput';
import TextInput from '../../../app/shared/components/TextInput';
import { usePuzzles } from '../../../lib/hooks/usePuzzles';
import { PuzzleSchema, puzzleSchema } from '../../../lib/schemas/puzzleSchema';

export default function PuzzleForm() {
    const { control, reset, handleSubmit, watch, formState: { isValid, isSubmitting } } = useForm<PuzzleSchema>({
        mode: 'onTouched',
        resolver: zodResolver(puzzleSchema),
    });
    const navigate = useNavigate();
    const { id } = useParams();
    const { updatePuzzle, createPuzzle, puzzle } = usePuzzles(id);

    const fenValue = watch('fen');

    useEffect(() => {
        if (puzzle) reset({
            ...puzzle,
            date: puzzle.date ? new Date(puzzle.date) : undefined,
        });
    }, [puzzle, reset]);

    const onSubmit = async (data: PuzzleSchema) => {
        try {
            if (puzzle) {
                updatePuzzle.mutate(
                    {
                        ...puzzle,
                        ...data,
                        date: data.date ? data.date.toISOString() : puzzle.date,
                    },
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
                    <TextInput label="Заглавие" control={control} name="title" />
                    <TextInput
                        label="Описание"
                        control={control}
                        name="description"
                        multiline
                        rows={3}
                    />
                    <TextInput
                        label="FEN позиция"
                        control={control}
                        name="fen"
                        placeholder="rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
                    />

                    {/* FEN Preview */}
                    {fenValue && (
                        <Box display="flex" justifyContent="center" sx={{
                            p: 2, bgcolor: 'grey.50', borderRadius: 2,
                        }}>
                            <Chessboard
                                id={fenValue}
                                boardWidth={320}
                                arePiecesDraggable={false}
                            />
                        </Box>
                    )}

                    <TextInput
                        label="Решение (ходове разделени с интервал, напр. e2e4 e7e5 d1h5)"
                        control={control}
                        name="solution"
                        multiline
                        rows={2}
                    />

                    <Controller
                        name="difficulty"
                        control={control}
                        render={({ field, fieldState }) => (
                            <FormControl fullWidth error={!!fieldState.error}>
                                <InputLabel>Трудност</InputLabel>
                                <Select {...field} label="Трудност">
                                    <MenuItem value="Лесна">Лесна</MenuItem>
                                    <MenuItem value="Средна">Средна</MenuItem>
                                    <MenuItem value="Трудна">Трудна</MenuItem>
                                </Select>
                                {fieldState.error && (
                                    <FormHelperText>{fieldState.error.message}</FormHelperText>
                                )}
                            </FormControl>
                        )}
                    />

                    <DateTimeInput label="Дата" control={control} name="date" />

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