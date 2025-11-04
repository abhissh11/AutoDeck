import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Signin from './pages/Signin.jsx'
import Signup from './pages/Signup.jsx'
import ChatPage from './pages/ChatPage.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import Header from './components/Header.jsx'


export default function App() {

  const isAuthenticated = !!localStorage.getItem("token")

  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated ? <Navigate to="/chat" replace /> : <Navigate to="/signin" replace />
          }
        />
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/chat" element={
          <ProtectedRoute>
            <ChatPage />
          </ProtectedRoute>
        } />
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnHover
        draggable
      />
    </BrowserRouter>
  )
}
