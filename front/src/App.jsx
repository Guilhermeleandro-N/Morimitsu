import AppRoutes from './routes/AppRoutes'
import SessionExpiredOverlay from './components/SessionExpiredOverlay/SessionExpiredOverlay'

function App() {
  return (
    <>
      <AppRoutes />
      <SessionExpiredOverlay />
    </>
  )
}

export default App
