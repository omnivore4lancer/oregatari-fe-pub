import { Link, Navigate, Route, Routes } from 'react-router-dom'

import { ProtectedRoute } from './components/ProtectedRoute'
import { ApiErrorProvider } from './contexts/ApiErrorContext'
import { AuthProvider } from './contexts/AuthContext'
import { ToastProvider } from './contexts/ToastContext'
import DashboardLayout from './layouts/DashboardLayout'
import StoryEditLayout from './layouts/StoryEditLayout'
import LoginPage from './pages/auth/login-page'
import CharacterCreatePage from './pages/character/character-create-page'
import CharacterEditPage from './pages/character/character-edit-page'
import CharacterListPage from './pages/character/character-list-page'
import DashboardPage from './pages/dashboard/dashboard-page'
import EpisodeCreatePage from './pages/episode/episode-create-page'
import EpisodeEditPage from './pages/episode/episode-edit-page'
import EpisodeListPage from './pages/episode/episode-list-page'
import PanelEditorPage from './pages/episode/panel-editor-page'
import SceneManagementPage from './pages/episode/scene-management-page'
import MaterialCreatePage from './pages/materials/material-create-page'
import MaterialsPage from './pages/materials/materials-page'
import PublishSettingsPage from './pages/publish/publish-settings-page'
import StoryCreatePage from './pages/story/story-create-page'
import StoryCastPage from './pages/story/story-cast-page'
import StoryStoryPage from './pages/story/story-story-page'
import JobsPage from './pages/jobs/jobs-page'

function About() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <h1 className="text-4xl font-bold">About</h1>
      <Link to="/" className="text-blue-500 hover:underline">
        Home
      </Link>
    </div>
  )
}

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <h1 className="text-4xl font-bold">404</h1>
      <Link to="/" className="text-blue-500 hover:underline">
        Home
      </Link>
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
    <ToastProvider>
    <ApiErrorProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/about" element={<About />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/stories/new" element={<StoryCreatePage />} />
            <Route path="/jobs" element={<JobsPage />} />
          </Route>
          <Route element={<StoryEditLayout />}>
            <Route path="/stories/:id" element={<Navigate to="story" replace />} />
            <Route path="/stories/:id/story" element={<StoryStoryPage />} />
            <Route path="/stories/:id/cast" element={<StoryCastPage />} />
            <Route path="/stories/:id/characters" element={<CharacterListPage />} />
            <Route path="/stories/:id/characters/new" element={<CharacterCreatePage />} />
            <Route path="/stories/:id/characters/:charId/edit" element={<CharacterCreatePage />} />
            <Route path="/stories/:id/characters/:charId" element={<CharacterEditPage />} />

            <Route path="/stories/:id/episodes" element={<EpisodeListPage />} />
            <Route path="/stories/:id/episodes/new" element={<EpisodeCreatePage />} />
            <Route path="/stories/:id/episodes/:episodeId/edit" element={<EpisodeEditPage />} />
            <Route path="/stories/:id/publish" element={<PublishSettingsPage />} />
            <Route path="/stories/:id/materials" element={<MaterialsPage />} />
            <Route path="/stories/:id/materials/new" element={<MaterialCreatePage />} />
            <Route path="/stories/:id/panels" element={<PanelEditorPage />} />
            <Route path="/stories/:id/episodes/:episodeId/scenes" element={<SceneManagementPage />} />
          </Route>
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </ApiErrorProvider>
    </ToastProvider>
    </AuthProvider>
  )
}
