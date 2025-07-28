import { Container, Box, Typography, TextField, Button, Link } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';

export default function Login({ setIsAuthenticated, setUserEmail }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Authentication logic here
    setUserEmail(email);
    setIsAuthenticated(true);
    // In real app, you would verify credentials first
  };

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Button startIcon={<ArrowBack />} href="/" sx={{ mb: 3 }}>
        Back to Home
      </Button>
      
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, mb: 1 }}>
        Welcome Back
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 4 }}>
        Login with your student email
      </Typography>
      
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
        <TextField
          label="Student Email"
          type="email"
          fullWidth
          required
          margin="normal"
          placeholder="yourID@student.uitm.edu.my"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          label="Password"
          type="password"
          fullWidth
          required
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        
        <Button
          type="submit"
          variant="contained"
          fullWidth
          size="large"
          sx={{ mt: 3, py: 1.5 }}
          href="/home"
        >
          Login
        </Button>
        
        <Typography align="center" sx={{ mt: 3 }}>
          Don't have an account? <Link href="/register" underline="hover">Register</Link>
        </Typography>
      </Box>
    </Container>
  );
}