import { FC, Suspense, lazy } from "react";
import { Toaster } from "react-hot-toast";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import ErrorBoundary from "./components/ErrorBoundary";
import MetaData from "./components/MetaData";
import PageTransition from "./components/PageTransition";
import MainLayout from "./layouts/MainLayout";
import Conciliations from "./pages/Conciliations";

// Lazy loading des pages
const CrmRetailers = lazy(() => import("./pages/CrmRetailers"));
const CrmSuppliers = lazy(() => import("./pages/CrmSuppliers"));
const Disbursements = lazy(() => import("./pages/Disbursements"));
const Performances = lazy(() => import("./pages/Performances"));

const IndexPage = lazy(() => import('./pages/IndexPage'));


const Login = lazy(() => import("./pages/auth/Login"));
const Register = lazy(() => import("./pages/auth/Register"));
const ForgotPassword = lazy(() => import("./pages/auth/ForgotPassword"));
const CooperativeDashboard = lazy(() => import("./pages/cooperative/Dashboard"));
const CooperativeLoan = lazy(() => import("./pages/cooperative/Loan"));
const CooperativeMembershipRequest = lazy(() => import("./pages/cooperative/MembershipRequest"));
const CooperativeMembers = lazy(() => import("./pages/cooperative/Members"));
const CooperativeProfile = lazy(() => import("./pages/cooperative/Profile"));
const CooperativeSettings = lazy(() => import("./pages/cooperative/Settings"));

const AdminDashboard = lazy(() => import('./pages/admin/Dashboard'));
const ControlPanel = lazy(() => import('./pages/admin/ControlPanel/ControlPanel'));
const AdminLoan = lazy(() => import('./pages/admin/Loan'));

const Transactions = lazy(() => import("./pages/Transactions"));
const Communications = lazy(() => import("./pages/Communications"));

const App: FC = () => {
  return (
    <div className="font-[Montserrat] bg-slate-100 !text-[#064C72] text-sm">
      <ErrorBoundary>
        <Toaster
          position="top-center"
          reverseOrder={false}
          gutter={8}
          toastOptions={{
            duration: 3000,
          }}
        />
        <Router>
          <MetaData />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<div>Reset password</div>} />
            <Route path="/404" element={<div>404</div>} />
            <Route path="/500" element={<div>500</div>} />
            <Route path="/" element={<IndexPage />} />

            <Route path="/" element={<MainLayout />}>
              {/* Cooperative home */}
              <Route
                  path="/cooperative/dashboard"
                  element={
                    <Suspense fallback={<PageTransition />}>
                      <CooperativeDashboard />
                    </Suspense>
                  }
              />
              {/* Cooperative loans */}
              <Route
                  path="/cooperative/loans"
                  element={
                    <Suspense fallback={<PageTransition />}>
                      <CooperativeLoan />
                    </Suspense>
                  }
              />
              {/* Cooperative membership request */}
              <Route
                  path="/cooperative/membership-request"
                  element={
                    <Suspense fallback={<PageTransition />}>
                      <CooperativeMembershipRequest />
                    </Suspense>
                  }
              />
              {/* Cooperative members */}
              <Route
                  path="/cooperative/members"
                  element={
                    <Suspense fallback={<PageTransition />}>
                      <CooperativeMembers />
                    </Suspense>
                  }
              />
              {/* Cooperative profile */}
              <Route
                  path="/cooperative/profile"
                  element={
                    <Suspense fallback={<PageTransition />}>
                      <CooperativeProfile />
                    </Suspense>
                  }
              />
              {/* Cooperative settings */}
              <Route
                  path="/cooperative/settings"
                  element={
                    <Suspense fallback={<PageTransition />}>
                      <CooperativeSettings />
                    </Suspense>
                  }
              />

              {/* Admin dashboard */}
              <Route
                  path="/admin/dashboard"
                  element={
                    <Suspense fallback={<PageTransition />}>
                      <AdminDashboard />
                    </Suspense>
                  }
              />
              {/* Admin Repossitory */}
              <Route
                  path="/admin/repository"
                  element={
                    <Suspense fallback={<PageTransition />}>
                      <ControlPanel />
                    </Suspense>
                  }
              />
              {/* Admin Loans */}
              <Route
                  path="/admin/loans"
                  element={
                    <Suspense fallback={<PageTransition />}>
                      <AdminLoan />
                    </Suspense>
                  }
              />

              {/* <Route
                path="/"
                element={
                  <Suspense fallback={<PageTransition />}>
                    <CrmSuppliers />
                  </Suspense>
                }
              /> */}
              {/* <Route
                path="/retailers"
                element={
                  <Suspense fallback={<PageTransition />}>
                    <CrmRetailers />
                  </Suspense>
                }
              />
              <Route
                path="/conciliations"
                element={
                  <Suspense fallback={<PageTransition />}>
                    <Conciliations />
                  </Suspense>
                }
              />
              <Route
                path="/transactions"
                element={
                  <Suspense fallback={<PageTransition />}>
                    <Transactions />
                  </Suspense>
                }
              />
              <Route
                path="/communications"
                element={
                  <Suspense fallback={<PageTransition />}>
                    <Communications />
                  </Suspense>
                }
              />
              <Route
                path="/disbursements"
                element={
                  <Suspense fallback={<PageTransition />}>
                    <Disbursements />
                  </Suspense>
                }
              />
              <Route
                path="/performances"
                element={
                  <Suspense fallback={<PageTransition />}>
                    <Performances />
                  </Suspense>
                }
              /> */}
            </Route>
          </Routes>
        </Router>
      </ErrorBoundary>
    </div>
  );
};

export default App;
