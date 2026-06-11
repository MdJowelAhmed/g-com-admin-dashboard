import { Navigate, Route, Routes } from 'react-router-dom'
import Login from './pages/auth/Login'
import ForgotPassword from './pages/auth/ForgotPassword'
import CheckEmail from './pages/auth/CheckEmail'
import OtpVerification from './pages/auth/OtpVerification'
import SetNewPassword from './pages/auth/SetNewPassword'
import PasswordResetSuccess from './pages/auth/PasswordResetSuccess'
import DashboardLayout from './layouts/DashboardLayout'
import ProtectedRoute from './components/ProtectedRoute'
import DashboardOverview from './pages/dashboard/DashboardOverview'
import Notifications from './pages/dashboard/Notifications'
import HomeControl from './pages/dashboard/HomeControl'
import ShopManagement from './pages/dashboard/ShopManagement'
import UserManagement from './pages/dashboard/UserManagement'
import OrderManagement from './pages/dashboard/OrderManagement'
import EarningsPayouts from './pages/dashboard/EarningsPayouts'
import EventManagement from './pages/dashboard/EventManagement'
import ControllerManagement from './pages/dashboard/ControllerManagement'
import Messages from './pages/dashboard/Messages'
import Settings from './pages/dashboard/Settings'
import Broadcast from './pages/dashboard/Broadcast'
import Category from './pages/dashboard/Category'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      {/* ── Public auth routes ── */}
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/check-email" element={<CheckEmail />} />
      <Route path="/otp" element={<OtpVerification />} />
      <Route path="/reset-password" element={<SetNewPassword />} />
      <Route path="/password-reset-success" element={<PasswordResetSuccess />} />

      {/* ── Protected dashboard routes — requires authentication ── */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardOverview />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="home-control" element={<HomeControl />} />
          <Route path="shops" element={<ShopManagement />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="orders" element={<OrderManagement />} />
          <Route path="earnings" element={<EarningsPayouts />} />
          <Route path="events" element={<EventManagement />} />
          <Route path="controllers" element={<ControllerManagement />} />
          <Route path="messages" element={<Messages />} />
          <Route path="settings" element={<Settings />} />
          <Route path="broadcast" element={<Broadcast />} />
          <Route path="category" element={<Category />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}
