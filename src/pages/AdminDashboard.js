import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Grid, Card, CardContent, TextField,
  Button, Chip, CircularProgress, Alert, Avatar,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, IconButton, Dialog, DialogTitle, DialogContent, DialogActions,
  Snackbar, Skeleton, Divider, Badge, Tooltip, Container,
  FormControl, Select, MenuItem, InputLabel
} from '@mui/material';
import {
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Person as PersonIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  AdminPanelSettings as AdminIcon,
  School as StudentIcon,
  People as PeopleIcon,
  CheckCircle as ActiveIcon,
  Close as CloseIcon,
  Logout as LogoutIcon,
  Phone as PhoneIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

// Styled Components
const PageContainer = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  background: `
    linear-gradient(135deg,
      rgba(110, 142, 251, 0.1) 0%,
      rgba(167, 119, 227, 0.1) 25%,
      rgba(58, 134, 255, 0.1) 50%,
      rgba(128, 237, 153, 0.1) 75%,
      rgba(255, 217, 59, 0.1) 100%
    ),
    linear-gradient(45deg, #f8fafc 0%, #f1f5f9 25%, #e2e8f0 50%, #cbd5e1 75%, #94a3b8 100%)
  `,
  padding: theme.spacing(3),
}));

const StatsCard = styled(Card)(({ theme, color }) => ({
  height: '100%',
  borderRadius: '20px',
  background: `linear-gradient(135deg, ${color}15 0%, ${color}25 100%)`,
  border: `2px solid ${color}30`,
  transition: 'all 0.3s ease',
  cursor: 'pointer',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: `0 20px 40px ${color}20`,
  },
}));

const ModernTable = styled(TableContainer)(({ theme }) => ({
  borderRadius: '20px',
  boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
  overflow: 'hidden',
  '& .MuiTableHead-root': {
    background: 'linear-gradient(135deg, #6e8efb 0%, #a777e3 100%)',
  },
  '& .MuiTableHead-root .MuiTableCell-root': {
    color: 'white',
    fontWeight: 700,
    fontSize: '1rem',
    borderBottom: 'none',
  },
  '& .MuiTableBody-root .MuiTableRow-root': {
    transition: 'all 0.2s ease',
    '&:hover': {
      backgroundColor: 'rgba(110, 142, 251, 0.05)',
      transform: 'scale(1.01)',
    },
  },
  '& .MuiTableCell-root': {
    borderBottom: '1px solid rgba(0,0,0,0.05)',
    padding: theme.spacing(2),
  },
}));



const UserManagementAdmin = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', type: 'success' });

  // Filter states
  const [lastLoginFilter, setLastLoginFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');

  // Fetch users from backend
  useEffect(() => {
    fetchUsers();
  }, []);

  // Helper function to categorize users by last login
  const getLastLoginCategory = (lastLogin) => {
    if (!lastLogin) return 'never';

    const now = new Date();
    const loginDate = new Date(lastLogin);
    const diffInMs = now - loginDate;
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInMs < 24 * 60 * 60 * 1000) return 'today'; // Less than 24 hours
    if (diffInDays <= 7) return 'week'; // Within 7 days
    if (diffInDays <= 30) return 'month'; // Within 30 days
    return 'inactive'; // More than 30 days
  };

  // Filter users based on search term and filters
  useEffect(() => {
    let filtered = users;

    // Apply search filter
    if (searchTerm.trim() !== '') {
      filtered = filtered.filter(user =>
        user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.matricNumber?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply last login filter
    if (lastLoginFilter !== 'all') {
      filtered = filtered.filter(user => {
        const category = getLastLoginCategory(user.lastLogin);
        return category === lastLoginFilter;
      });
    }

    // Apply role filter
    if (roleFilter !== 'all') {
      filtered = filtered.filter(user => {
        if (roleFilter === 'student') return user.role !== 'admin';
        if (roleFilter === 'admin') return user.role === 'admin';
        return true;
      });
    }

    setFilteredUsers(filtered);
  }, [searchTerm, users, lastLoginFilter, roleFilter]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3001/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUsers(data.users || []);
        setFilteredUsers(data.users || []);
      } else {
        throw new Error('Failed to fetch users');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setSnackbar({
        open: true,
        message: 'Error loading users. Please try again.',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:3001/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setUsers(users.filter(user => user._id !== userId));
        setSnackbar({
          open: true,
          message: 'User deleted successfully!',
          type: 'success'
        });
      } else {
        throw new Error('Failed to delete user');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      setSnackbar({
        open: true,
        message: 'Error deleting user. Please try again.',
        type: 'error'
      });
    }
  };

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setDialogOpen(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userRole');
    localStorage.removeItem('isAdmin');
    
    setSnackbar({
      open: true,
      message: 'Logged out successfully! Redirecting...',
      type: 'success'
    });
    
    setTimeout(() => {
      window.location.href = '/';
    }, 1500);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatLastLogin = (dateString) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now - date;
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} min ago`;
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: diffInDays > 365 ? 'numeric' : undefined
    });
  };

  const getUserInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getAvatarColor = (name) => {
    if (!name) return '#6e8efb';
    const colors = ['#6e8efb', '#a777e3', '#e91e63', '#ff9800', '#4caf50', '#2196f3', '#9c27b0'];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  // Statistics - FIXED CALCULATION
  const stats = {
    totalUsers: users.length,
    activeUsers: users.filter(u => u.isActive !== false).length,
    adminUsers: users.filter(u => u.role === 'admin').length,
    studentUsers: users.filter(u => u.role !== 'admin').length
  };

  return (
    <PageContainer>
      {/* 🎯 CONSISTENT HEADER - MATCHES USER PAGES */}
      <Box sx={{ textAlign: 'center', mb: 4, position: 'relative' }}>
        {/* Logo and Title */}
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 2 }}>
          <img
            src="/logoo.gif"
            alt="RoomTopia Logo"
            style={{
              height: '120px',
              width: 'auto',
              marginRight: '24px',
              borderRadius: '16px',
              filter: 'drop-shadow(0 6px 12px rgba(0,0,0,0.25))'
            }}
          />
          <Typography variant="h2" sx={{
            fontWeight: 800,
            background: 'linear-gradient(135deg, #6e8efb 0%, #a777e3 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontSize: '3.5rem'
          }}>
            Admin Dashboard
          </Typography>
        </Box>

        <Typography variant="h6" sx={{ color: 'text.secondary', mb: 3 }}>
          Your central hub for overseeing the RoomTopia community
        </Typography>

        {/* Logout Button - Top Right */}
        <Button
          onClick={handleLogout}
          startIcon={<LogoutIcon />}
          variant="contained"
          sx={{
            position: 'absolute',
            top: 0,
            right: 0,
            background: 'linear-gradient(135deg, #e91e63 0%, #f06292 100%)',
            color: 'white',
            borderRadius: '15px',
            px: 3,
            py: 1.5,
            fontWeight: 700,
            fontSize: '0.95rem',
            textTransform: 'none',
            boxShadow: '0 4px 15px rgba(233, 30, 99, 0.3)',
            border: '2px solid rgba(255, 255, 255, 0.2)',
            '&:hover': {
              background: 'linear-gradient(135deg, #c2185b 0%, #e91e63 100%)',
              boxShadow: '0 6px 20px rgba(233, 30, 99, 0.4)',
              transform: 'translateY(-2px)',
            },
            transition: 'all 0.3s ease'
          }}
        >
          Logout
        </Button>
      </Box>
      {/* Statistics Cards */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
        <Container maxWidth="lg">
          <Grid container spacing={3} sx={{ justifyContent: 'center' }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard color="#6e8efb" onClick={() => {}}>
              <CardContent sx={{ textAlign: 'center', p: 3 }}>
                <PeopleIcon sx={{ fontSize: '3rem', color: '#6e8efb', mb: 2 }} />
                <Typography variant="h3" sx={{ fontWeight: 800, color: '#6e8efb', mb: 1 }}>
                  {stats.totalUsers}
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#64748b' }}>
                  Total Users
                </Typography>
              </CardContent>
            </StatsCard>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <StatsCard color="#4caf50" onClick={() => {}}>
              <CardContent sx={{ textAlign: 'center', p: 3 }}>
                <ActiveIcon sx={{ fontSize: '3rem', color: '#4caf50', mb: 2 }} />
                <Typography variant="h3" sx={{ fontWeight: 800, color: '#4caf50', mb: 1 }}>
                  {stats.activeUsers}
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#64748b' }}>
                  Active Users
                </Typography>
              </CardContent>
            </StatsCard>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <StatsCard color="#9c27b0" onClick={() => {}}>
              <CardContent sx={{ textAlign: 'center', p: 3 }}>
                <AdminIcon sx={{ fontSize: '3rem', color: '#9c27b0', mb: 2 }} />
                <Typography variant="h3" sx={{ fontWeight: 800, color: '#9c27b0', mb: 1 }}>
                  {stats.adminUsers}
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#64748b' }}>
                  Admin Users
                </Typography>
              </CardContent>
            </StatsCard>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <StatsCard color="#ff9800" onClick={() => {}}>
              <CardContent sx={{ textAlign: 'center', p: 3 }}>
                <StudentIcon sx={{ fontSize: '3rem', color: '#ff9800', mb: 2 }} />
                <Typography variant="h3" sx={{ fontWeight: 800, color: '#ff9800', mb: 1 }}>
                  {stats.studentUsers}
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#64748b' }}>
                  Students
                </Typography>
              </CardContent>
            </StatsCard>
          </Grid>
          </Grid>
        </Container>
      </Box>
      {/* Search and Controls */}
      <Container maxWidth="xl" sx={{ mb: 4 }}>
        <Card sx={{ borderRadius: '20px', p: 3, boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5" sx={{
              fontWeight: 700,
              background: 'linear-gradient(135deg, #6e8efb 0%, #a777e3 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              User Management ({filteredUsers.length} users)
            </Typography>
            <Button
              onClick={fetchUsers}
              startIcon={loading ? <CircularProgress size={20} /> : <RefreshIcon />}
              variant="outlined"
              disabled={loading}
              sx={{
                borderRadius: '15px',
                borderColor: '#6e8efb',
                color: '#6e8efb',
                '&:hover': {
                  borderColor: '#5c7cfa',
                  backgroundColor: 'rgba(110, 142, 251, 0.1)',
                }
              }}
            >
              Refresh
            </Button>
          </Box>

          <TextField
            fullWidth
            placeholder="Search by name, email, or matric number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon sx={{ color: '#6e8efb', mr: 1 }} />,
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '15px',
                '&:hover fieldset': {
                  borderColor: '#6e8efb',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#6e8efb',
                },
              },
            }}
          />

          {/* Filter Section */}
          <Box sx={{ mt: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <FormControl size="small" sx={{ minWidth: 200 }}>
              <InputLabel sx={{ color: '#6e8efb' }}>Last Login Filter</InputLabel>
              <Select
                value={lastLoginFilter}
                label="Last Login Filter"
                onChange={(e) => setLastLoginFilter(e.target.value)}
                sx={{
                  borderRadius: '15px',
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#6e8efb',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#6e8efb',
                  },
                }}
              >
                <MenuItem value="all">🔍 All Users</MenuItem>
                <MenuItem value="today">🟢 Active Today</MenuItem>
                <MenuItem value="week">🟡 Active This Week</MenuItem>
                <MenuItem value="month">🟠 Active This Month</MenuItem>
                <MenuItem value="inactive">🔴 Inactive (30+ days)</MenuItem>
                <MenuItem value="never">⚫ Never Logged In</MenuItem>
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel sx={{ color: '#6e8efb' }}>Role Filter</InputLabel>
              <Select
                value={roleFilter}
                label="Role Filter"
                onChange={(e) => setRoleFilter(e.target.value)}
                sx={{
                  borderRadius: '15px',
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#6e8efb',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#6e8efb',
                  },
                }}
              >
                <MenuItem value="all">👥 All Roles</MenuItem>
                <MenuItem value="student">👨‍🎓 Students</MenuItem>
                <MenuItem value="admin">👨‍💼 Admins</MenuItem>
              </Select>
            </FormControl>

            {/* Filter Results Summary */}
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              ml: 'auto',
              color: '#6e8efb',
              fontWeight: 600
            }}>
              📊 Showing {filteredUsers.length} of {users.length} users
            </Box>
          </Box>
        </Card>
      </Container>

      {/* Users Table */}
      <Container maxWidth="xl">
        {loading ? (
          <Card sx={{ borderRadius: '20px', p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress size={40} sx={{ color: '#6e8efb' }} />
            </Box>
          </Card>
        ) : (
          <ModernTable component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>User</TableCell>
                  <TableCell>Contact</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Joined</TableCell>
                  <TableCell>Last Login</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user._id}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar
                          sx={{
                            bgcolor: getAvatarColor(user.fullName),
                            mr: 2,
                            width: 45,
                            height: 45,
                            fontWeight: 700,
                          }}
                        >
                          {getUserInitials(user.fullName)}
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                            {user.fullName || 'N/A'}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {user.matricNumber || 'No matric number'}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ mb: 0.5 }}>
                        {user.email}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {user.phoneNumber || 'No phone'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={user.role === 'admin' ? 'Admin' : 'Student'}
                        color={user.role === 'admin' ? 'secondary' : 'primary'}
                        size="small"
                        sx={{ fontWeight: 600 }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {formatDate(user.joinedDate || user.createdAt)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {formatLastLogin(user.lastLogin)}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                        <Tooltip title="View Details">
                          <IconButton
                            onClick={() => handleViewUser(user)}
                            sx={{
                              color: '#6e8efb',
                              '&:hover': { backgroundColor: 'rgba(110, 142, 251, 0.1)' }
                            }}
                          >
                            <VisibilityIcon />
                          </IconButton>
                        </Tooltip>
                        {user.role !== 'admin' && (
                          <Tooltip title="Delete User">
                            <IconButton
                              onClick={() => handleDeleteUser(user._id)}
                              sx={{
                                color: '#e91e63',
                                '&:hover': { backgroundColor: 'rgba(233, 30, 99, 0.1)' }
                              }}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ModernTable>
        )}
      </Container>

      {/* Modern User Detail Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '25px',
            overflow: 'hidden',
          }
        }}
      >
        {selectedUser && (
          <>
            <DialogTitle sx={{
              background: 'linear-gradient(135deg, #6e8efb 0%, #a777e3 100%)',
              color: 'white',
              textAlign: 'center',
              position: 'relative',
              pb: 3
            }}>
              <IconButton
                onClick={() => setDialogOpen(false)}
                sx={{
                  position: 'absolute',
                  right: 8,
                  top: 8,
                  color: 'white',
                }}
              >
                <CloseIcon />
              </IconButton>

              <Avatar
                sx={{
                  bgcolor: 'rgba(255, 255, 255, 0.2)',
                  width: 80,
                  height: 80,
                  mx: 'auto',
                  mb: 2,
                  fontSize: '2rem',
                  fontWeight: 700,
                }}
              >
                {getUserInitials(selectedUser.fullName)}
              </Avatar>

              <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                {selectedUser.fullName}
              </Typography>

              <Chip
                label={selectedUser.role === 'admin' ? 'Admin' : 'Student'}
                sx={{
                  bgcolor: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  fontWeight: 600,
                }}
              />
            </DialogTitle>

            <DialogContent sx={{ p: 4 }}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <PersonIcon sx={{ color: '#6e8efb', mr: 2 }} />
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        Email
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        {selectedUser.email}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <StudentIcon sx={{ color: '#6e8efb', mr: 2 }} />
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        Matric Number
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        {selectedUser.matricNumber || 'Not provided'}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <PhoneIcon sx={{ color: '#6e8efb', mr: 2 }} />
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        Contact Info
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        {selectedUser.phoneNumber || 'Not provided'}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <ActiveIcon sx={{ color: '#4caf50', mr: 2 }} />
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        Account Status
                      </Typography>
                      <Chip
                        label="Active"
                        color="success"
                        size="small"
                        sx={{ fontWeight: 600 }}
                      />
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={6}>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Join Date
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {formatDate(selectedUser.joinedDate || selectedUser.createdAt)}
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12}>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Last Login
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {formatLastLogin(selectedUser.lastLogin)}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </DialogContent>

            <DialogActions sx={{ p: 3, pt: 0 }}>
              <Button
                onClick={() => setDialogOpen(false)}
                variant="outlined"
                sx={{ borderRadius: '15px', mr: 1 }}
              >
                Close
              </Button>
              {selectedUser.role !== 'admin' && (
                <Button
                  onClick={() => {
                    setDialogOpen(false);
                    handleDeleteUser(selectedUser._id);
                  }}
                  variant="contained"
                  color="error"
                  sx={{ borderRadius: '15px' }}
                  startIcon={<DeleteIcon />}
                >
                  Delete User
                </Button>
              )}
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.type}
          sx={{ borderRadius: '15px' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </PageContainer>
  );
};
export default UserManagementAdmin;