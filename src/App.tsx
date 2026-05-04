import { lazy, Suspense } from 'react'
import { Link, Navigate, Route, Routes } from 'react-router-dom'

import { ProtectedRoute } from './components/ProtectedRoute'
import { SpinnerDots } from './components/ui'
import { ApiErrorProvider } from './contexts/ApiErrorContext'
import { AuthProvider } from './contexts/AuthContext'
import { ToastProvider } from './contexts/ToastContext'
import DashboardLayout from './layouts/DashboardLayout'
import StoryEditLayout from './layouts/StoryEditLayout'

const LoginPage = lazy(() => import('./pages/auth/login-page'))
const CharacterCreatePage = lazy(() => import('./pages/character/character-create-page'))
const CharacterEditPage = lazy(() => import('./pages/character/character-edit-page'))
const CharacterListPage = lazy(() => import('./pages/character/character-list-page'))
const DashboardPage = lazy(() => import('./pages/dashboard/dashboard-page'))
const EpisodeCreatePage = lazy(() => import('./pages/episode/episode-create-page'))
const EpisodeEditPage = lazy(() => import('./pages/episode/episode-edit-page'))
const EpisodeListPage = lazy(() => import('./pages/episode/episode-list-page'))
const MangaViewerPage = lazy(() => import('./pages/episode/manga-viewer-page'))
const PanelEditorPage = lazy(() => import('./pages/episode/panel-editor-page'))
const SceneManagementPage = lazy(() => import('./pages/episode/scene-management-page'))
const MaterialCreatePage = lazy(() => import('./pages/materials/material-create-page'))
const MaterialsPage = lazy(() => import('./pages/materials/materials-page'))
const PublishSettingsPage = lazy(() => import('./pages/publish/publish-settings-page'))
const StoryCreatePage = lazy(() => import('./pages/story/story-create-page'))
const StoryCastPage = lazy(() => import('./pages/story/story-cast-page'))
const StoryStoryPage = lazy(() => import('./pages/story/story-story-page'))
const JobsPage = lazy(() => import('./pages/jobs/jobs-page'))
const PublicStoryPage = lazy(() => import('./pages/public/public-story-page'))

function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <SpinnerDots size="md" />
    </div>
  )
}

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
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/works/:storyId" element={<PublicStoryPage />} />
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
              <Route path="/stories/:id/episodes/:episodeId/viewer" element={<MangaViewerPage />} />
            </Route>
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </ApiErrorProvider>
    </ToastProvider>
    </AuthProvider>
  )
}
