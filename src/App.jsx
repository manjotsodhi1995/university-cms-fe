import './App.css'
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import '@mantine/core/styles.css';
import { AppShell, NavLink, MantineProvider, Button, Group, Burger } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import Login from './components/Login';
import UniversitiesTable from './components/UniversityTable'
import AuditTable from './components/AuditTable'
function App() {

  let isAuthenticated = !!localStorage.getItem('user');
  let user = JSON.parse(localStorage.getItem('user'));
  let isUserRoleAdmin = user && user.permission_level === 'ADMIN';

  const [opened, { toggle }] = useDisclosure();
  const navigate = useNavigate();
  function RequireAuth({ children }) {
    return isAuthenticated ? children : <Navigate to="/login" />
  }
  return (
    <MantineProvider>
      <AppShell
        padding="md"
        header={{ height: 60 }}
        navbar={{ width: 300, breakpoint: 'sm', collapsed: { mobile: !opened } }}
      >
        <AppShell.Header>
          <Group h="100%" px="md">
            <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
            <h2>University CMS Application</h2>
          </Group>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            {isAuthenticated && <Button onClick={() => logout()} variant="link">Logout</Button>}
          </div>

        </AppShell.Header>
        {isAuthenticated && <AppShell.Navbar p="md">
          <NavLink label='Universities' onClick={() => navigate('/universities')} />
          {isUserRoleAdmin && <NavLink label='Audit' onClick={() => navigate('/audit')} />}
        </AppShell.Navbar>}
        <AppShell.Main>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/universities" element={<RequireAuth><UniversitiesTable /></RequireAuth>} />
            <Route path="/audit" element={<RequireAuth><AuditTable /></RequireAuth>} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </AppShell.Main>
      </AppShell>
    </MantineProvider >
  )

  function logout() {
    localStorage.removeItem('user')
    window.location.reload()
  }
}

export default App
