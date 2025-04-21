import { useState } from 'react';
import {
  TextField,
  Button,
  Box,
  Typography,
  Alert,
  CircularProgress,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from 'dayjs';
import { Report } from '../types';

const ReportForm = () => {
  const [formData, setFormData] = useState<Report>({
    ngo_id: '',
    month: '',
    people_helped: 0,
    events_conducted: 0,
    funds_utilized: 0,
  });
  const [monthDate, setMonthDate] = useState<Dayjs | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'ngo_id' ? value : Number(value),
    }));
    setError(null);
  };

  const handleMonthChange = (date: Dayjs | null) => {
    setMonthDate(date);
    if (date) {
      const formattedMonth = date.format('YYYY-MM');
      setFormData((prev) => ({ ...prev, month: formattedMonth }));
    } else {
      setFormData((prev) => ({ ...prev, month: '' }));
    }
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    // Validation
    if (!formData.ngo_id) {
      setError('NGO ID is required');
      setLoading(false);
      return;
    }
    if (!formData.month || !/^\d{4}-\d{2}$/.test(formData.month)) {
      setError('Month is required in YYYY-MM format');
      setLoading(false);
      return;
    }
    if (formData.people_helped < 0) {
      setError('People helped cannot be negative');
      setLoading(false);
      return;
    }
    if (formData.events_conducted < 0) {
      setError('Events conducted cannot be negative');
      setLoading(false);
      return;
    }
    if (formData.funds_utilized < 0) {
      setError('Funds utilized cannot be negative');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/report`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit report');
      }

      setSuccess(data.message);
      setFormData({
        ngo_id: '',
        month: '',
        people_helped: 0,
        events_conducted: 0,
        funds_utilized: 0,
      });
      setMonthDate(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 500,
        mx: 'auto',
        mt: 4,
        p: 4,
        bgcolor: 'white',
        borderRadius: 3,
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
        transition: 'all 0.3s',
      }}
    >
      <Typography variant="h5" gutterBottom sx={{ color: 'primary.main' }}>
        Submit Monthly Report
      </Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
      <form onSubmit={handleSubmit}>
        <TextField
          label="NGO ID"
          name="ngo_id"
          value={formData.ngo_id}
          onChange={handleChange}
          fullWidth
          required
          margin="normal"
          variant="outlined"
        />
        <DatePicker
          label="Select Month"
          views={['year', 'month']}
          value={monthDate}
          onChange={handleMonthChange}
          slotProps={{ textField: { fullWidth: true, margin: 'normal' } }}
        />
        <TextField
          label="People Helped"
          name="people_helped"
          type="number"
          value={formData.people_helped}
          onChange={handleChange}
          fullWidth
          required
          inputProps={{ min: 0 }}
          margin="normal"
          variant="outlined"
        />
        <TextField
          label="Events Conducted"
          name="events_conducted"
          type="number"
          value={formData.events_conducted}
          onChange={handleChange}
          fullWidth
          required
          inputProps={{ min: 0 }}
          margin="normal"
          variant="outlined"
        />
        <TextField
          label="Funds Utilized ($)"
          name="funds_utilized"
          type="number"
          value={formData.funds_utilized}
          onChange={handleChange}
          fullWidth
          required
          inputProps={{ min: 0, step: 0.01 }}
          margin="normal"
          variant="outlined"
        />
        <Button
          type="submit"
          variant="contained"
          fullWidth
          disabled={loading}
          sx={{ mt: 3, py: 1.5, fontSize: '1.1rem' }}
        >
          {loading ? <CircularProgress size={24} /> : 'Submit Report'}
        </Button>
      </form>
    </Box>
  );
};

export default ReportForm;