// src/components/users/UsersList.tsx
import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { fetchUsers, UsersPaginationDto } from '../../services/usersService'
import { Paper, Typography, List, ListItem, ListItemText } from '@mui/material'

const UsersList: React.FC = () => {
  const { data, isLoading, error } = useQuery<UsersPaginationDto>({
    queryKey: ['users', { page: 1 }],
    queryFn: () => fetchUsers(1, 10, 'asc'),
  })

  if (isLoading) return <Typography>Loading users...</Typography>
  if (error) return <Typography color="error">Error loading users.</Typography>

  return (
    <Paper sx={{ p: 4, mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Users
      </Typography>
      <List>
        {data?.users.map((user) => (
          <ListItem key={user.id} divider>
            <ListItemText primary={user.email} secondary={user.name} />
          </ListItem>
        ))}
      </List>
    </Paper>
  )
}

export default UsersList
