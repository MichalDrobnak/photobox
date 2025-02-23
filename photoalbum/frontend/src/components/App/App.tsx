import { AppShell, Box, Stack } from '@mantine/core';
import { Dispatch, FunctionComponent, SetStateAction, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import CreateAlbum from '../../pages/CreateAlbum/CreateAlbum';
import Album from '../../pages/Album/Album';
import Home from '../../pages/Home/Home';
import UploadPhoto from '../../pages/UploadPhoto/UploadPhoto';
import AppFooter from '../AppFooter/AppFooter';
import AppHeader, { HEADER_SIZE } from '../AppHeader/AppHeader';
import AppNavbar from '../AppNavbar/AppNavbar';
import LogIn from '../../pages/LogIn/LogIn';
import Register from '../../pages/Register/Register';
import ProfileSettings from '../../pages/ProfileSettings/ProfileSettings';
import AlbumSettings from '../../pages/AlbumSettings/AlbumSettings';
import { User } from '../../models/user';
import AuthProvider from '../../auth/AuthProvider';
import { RequireAuth } from '../../auth';
import AgeConfirmation from '../AgeConfirmation/AgeConfirmation';
import PhotoSettings from '../PhotoSettings/PhotoSettings';
import ManagePermissions from '../../pages/ManagePermissions/ManagePermissions';

export type UserContextType = {
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;
};

export const App: FunctionComponent<{}> = () => {
  const [opened, setOpened] = useState(false);
  const toggleNavbar = () => setOpened(!opened);

  return (
    <AgeConfirmation>
      <AuthProvider>
        <AppShell
          padding={0}
          navbarOffsetBreakpoint="sm"
          fixed
          header={
            <AppHeader opened={opened} toggleNavbar={toggleNavbar}></AppHeader>
          }
          navbar={<AppNavbar opened={opened}></AppNavbar>}>
          <Stack
            justify={'space-between'}
            sx={{ minHeight: `calc(100vh - ${HEADER_SIZE}px)` }}>
            <Box p={'md'}>
              <Routes>
                <Route
                  path="/"
                  element={
                    <RequireAuth>
                      <Home />
                    </RequireAuth>
                  }
                />
                <Route
                  path="/albums/:id"
                  element={
                    <RequireAuth>
                      <Album />
                    </RequireAuth>
                  }
                />
                <Route
                  path="/albums/:id/settings"
                  element={
                    <RequireAuth>
                      <AlbumSettings />
                    </RequireAuth>
                  }
                />
                <Route
                  path="/albums/create"
                  element={
                    <RequireAuth>
                      <CreateAlbum />
                    </RequireAuth>
                  }
                />
                <Route
                  path="/albums/:id/upload-photo"
                  element={
                    <RequireAuth>
                      <UploadPhoto></UploadPhoto>
                    </RequireAuth>
                  }
                />
                <Route
                  path="/photo/:id/edit"
                  element={
                    <RequireAuth>
                      <PhotoSettings></PhotoSettings>
                    </RequireAuth>
                  }
                />
                <Route
                  path="/albums/:id/permissions"
                  element={
                    <RequireAuth>
                      <ManagePermissions></ManagePermissions>
                    </RequireAuth>
                  }
                />
                <Route path="/login" element={<LogIn />} />
                <Route path="/register" element={<Register />} />
                <Route
                  path="/profile"
                  element={
                    <RequireAuth>
                      <ProfileSettings />
                    </RequireAuth>
                  }
                />
              </Routes>
            </Box>
            <AppFooter></AppFooter>
          </Stack>
        </AppShell>
      </AuthProvider>
    </AgeConfirmation>
  );
};

export default App;
