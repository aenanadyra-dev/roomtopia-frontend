import { useEffect, useState } from 'react';
import { Card, CardHeader, TextField, Box } from '@mui/material';
import { Doughnut } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
Chart.register(ArcElement, Tooltip, Legend);

const fields = [
  { key: 'rent',      label: 'Rent (RM)'      },
  { key: 'utilities', label: 'Utilities (RM)' },
  { key: 'food',      label: 'Food (RM)'      },
];

export default function BudgetSplitCard() {
  // preload last values from sessionStorage
  const [cost, setCost] = useState(() =>
    JSON.parse(sessionStorage.getItem('budgetSplit') || '{}'));

  useEffect(() => {
    sessionStorage.setItem('budgetSplit', JSON.stringify(cost));
  }, [cost]);

  const total = Object.values(cost).reduce((s, v) => s + Number(v || 0), 0);

  const chart = {
    labels  : fields.map(f => f.label),
    datasets: [{
      data: fields.map(f => Number(cost[f.key] || 0)),
      backgroundColor: ['#42a5f5', '#66bb6a', '#ffa726'],
    }],
  };

  const handle = e => setCost({ ...cost, [e.target.name]: e.target.value });

  return (
    <Card sx={{ p: 2 }}>
      <CardHeader avatar="💸" title="Monthly Budget Split" />
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Box sx={{ flex: 1 }}>
          {fields.map(f => (
            <TextField
              key={f.key}
              name={f.key}
              label={f.label}
              type="number"
              size="small"
              fullWidth
              sx={{ mb: 1 }}
              value={cost[f.key] ||''}
              onChange={handle}
            />
          ))}
          <strong>Total: RM {total}</strong>
        </Box>
        <Box sx={{ width: 180 }}>
          <Doughnut data={chart} />
        </Box>
      </Box>
    </Card>
  );
}