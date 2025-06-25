import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import Home from "./components/home/Home"
import Login from "./components/auth/Login"
import SignUp from "./components/auth/SignUp"
import PrivateRoute from "./components/auth/PrivateRoute"
import Dashboard from "./components/dashboard/Dashboard"
import { Toaster } from "react-hot-toast"
import Structure from "./components/dashboard/Structure"
import Users from "./components/dashboard/Users"
import Apps from "./components/dashboard/Apps"
import GettingStarted from "./components/dashboard/GettingStarted"
import Profile from "./components/dashboard/Profile"
import Settings from "./components/dashboard/Settings"
import Organization from "./components/dashboard/Organization"
import Verify from "./components/auth/Verify"
import ForgetPassword from "./components/auth/ForgetPassword"
import { UserAuthContextProvider } from "./components/context/UserAuthContext"
import LoginHistory from "./components/dashboard/profile_components/LoginHistory"
import PersonalInfo from "./components/dashboard/profile_components/PersonalInfo"
import Security from "./components/dashboard/profile_components/Security"
import ConnectedApps from "./components/dashboard/profile_components/ConnectedApps"
import ActiveSessions from "./components/dashboard/profile_components/ActiveSessions"
import AllNotification from "./components/dashboard/notification_components/AllNotification"


function App() {

  return (
    <>
      <BrowserRouter>
        <UserAuthContextProvider>
          <Routes>
            <Route
              path="/"
              element={
                <Home />
              }
            />
            <Route
              path="login"
              element={
                <Login />
              }
            />
            <Route
              path="signup"
              element={
                <SignUp />
              }
            />
            <Route
              path="forget-password"
              element={
                <ForgetPassword />
              }
            />
            <Route
              path="verify/:email"
              element={
                <Verify />
              }
            />
            <Route
              path="dashboard"
              element={
                <PrivateRoute>
                  <Structure />
                </PrivateRoute>
              }
            >
              <Route
                path="home"
                element={
                  <PrivateRoute>
                    <GettingStarted />
                  </PrivateRoute>
                }
              />

              <Route
                path="settings/profile"
                element={
                  <PrivateRoute>
                    <Profile />
                  </PrivateRoute>
                }
              >
                <Route path="" element={<Navigate to='info' />} />
                <Route path="info" element={<PersonalInfo />} />
                <Route path="login-history" element={<LoginHistory />} />
                <Route path="active-sessions" element={<ActiveSessions />} />
                <Route path="connected-apps" element={<ConnectedApps />} />
                <Route path="security" element={<Security />} />
              </Route>

              <Route path="notifications" element={<AllNotification />} />
              
              <Route
                path="insights"
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                }
              />
              {/* <Route
                path="organization"
                element={
                  <PrivateRoute>
                    <Organization />
                  </PrivateRoute>
                }
              /> */}

              <Route
                path="users"
                element={
                  <PrivateRoute>
                    <Users />
                  </PrivateRoute>
                }
              />

              <Route
                path="apps"
                element={
                  <PrivateRoute>
                    <Apps />
                  </PrivateRoute>
                }
              />
              <Route
                path="settings"
                element={
                  <PrivateRoute>
                    <Settings />
                  </PrivateRoute>
                }
              />
              <Route
                path="settings/organization"
                element={
                  <PrivateRoute>
                    <Settings />
                  </PrivateRoute>
                }
              />
              <Route
                path="*"
                element={
                  <PrivateRoute>
                    <Navigate to="/dashboard/home" />
                  </PrivateRoute>
                }
              />
            </Route>
          </Routes>
        </UserAuthContextProvider>
      </BrowserRouter>
      <Toaster
        position="top-right"
        containerClassName=""
      />
    </>
  )
}

export default App