import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Grid,
  Card,
  CardContent,
  Alert,
  CircularProgress,
  Button,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from 'dayjs';
import { DashboardData } from '../types';

const Dashboard = () => {
  const [month, setMonth] = useState<string>(
    new Date().toISOString().slice(0, 7),
  );
  const [monthDate, setMonthDate] = useState<Dayjs | null>(dayjs());
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPicker, setShowPicker] = useState(false);

  const fetchDashboardData = async (selectedMonth: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/dashboard?month=${selectedMonth}`,
      );
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch dashboard data');
      }
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData(month);
  }, [month]);

  const handleMonthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMonth(e.target.value);
    setMonthDate(dayjs(e.target.value));
  };

  const handleMonthDateChange = (date: Dayjs | null) => {
    setMonthDate(date);
    if (date) {
      const formattedMonth = date.format('YYYY-MM');
      setMonth(formattedMonth);
    } else {
      setMonth('');
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 1000,
        mx: 'auto',
        mt: 4,
        p: 4,
        bgcolor: 'white',
        borderRadius: 3,
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
      }}
    >
      <Typography variant="h5" gutterBottom sx={{ color: 'primary.main' }}>
        Admin Dashboard
      </Typography>
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
        {!showPicker ? (
          <TextField
            label="Select Month (YYYY-MM)"
            value={month}
            onChange={handleMonthChange}
            fullWidth
            sx={{ maxWidth: 300 }}
          />
        ) : (
          <DatePicker
            label="Select Month"
            views={['year', 'month']}
            value={monthDate}
            onChange={handleMonthDateChange}
            slotProps={{ textField: { fullWidth: true, sx: { maxWidth: 300 } } }}
          />
        )}
        <Button
          variant="outlined"
          onClick={() => setShowPicker(!showPicker)}
          sx={{ height: 'fit-content' }}
        >
          {showPicker ? 'Use Text Input' : 'Use Date Picker'}
        </Button>
      </Box>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {loading && <CircularProgress sx={{ display: 'block', mx: 'auto' }} />}
      {!loading && !error && !data && (
        <Typography color="textSecondary" sx={{ textAlign: 'center' }}>
          No data available for this month.
        </Typography>
      )}
      {!loading && !error && data && (
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h6" color="textSecondary">
                  Total NGOs Reporting
                </Typography>
                <Typography variant="h4" sx={{ color: 'primary.main' }}>
                  {data.total_ngos}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h6" color="textSecondary">
                  Total People Helped
                </Typography>
                <Typography variant="h4" sx={{ color: 'primary.main' }}>
                  {data.total_people}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h6" color="textSecondary">
                  Total Events Conducted
                </Typography>
                <Typography variant="h4" sx={{ color: 'primary.main' }}>
                  {data.total_events}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h6" color="textSecondary">
                  Total Funds Utilized
                </Typography>
                <Typography variant="h4" sx={{ color: 'primary.main' }}>
                  ${data.total_funds.toFixed(2)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default Dashboard;
