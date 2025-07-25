import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Login from './pages/auth/Login';
import NotFound from './pages/NotFound';
import AccessDenied from './pages/AccessDenied';
import Dashboard from './pages/Dashboard';
import Book from './pages/Book/Book.js';
import LendingBook from './pages/LendingBook/LendingBook.js';
import BookType from './pages/BookType/BookType.js';
import ReturnBook from './pages/ReturnBook/ReturnBook.js';
import User from './pages/User/User.js';
import CreateUser from './pages/User/CreateUser.js';
import Edituser from './pages/User/EditUser.js';
import PaymentLogs from './pages/PaymentLogs/PaymentLogs.js';
import RequestBook from './pages/RequestBook/RequestBook.js';
import ComplateRequest from './pages/RequestBook/ComplateRequest.js';
import UserLoginOperationLogs from './pages/UserLoginOperationLogs/UserLoginOperationLogs.js';
import UserOperationLogs from './pages/UserOperationLogs/UserOperationLogs.js';
import Author from './pages/Author/Author.js';
import AuthorCreate from './pages/Author/AuthorCreate.js';
import AuthorEdit from './pages/Author/AuthorEdit.js';
import Libraries from './pages/Libraries/Libraries.js';
import EditLibraries from './pages/Libraries/EditLibraries/EditLibraries.js';
import CustomerUserCreate from './pages/User/Customeruser/CustomerUserCreate.js';
import CustomerUserList from './pages/User/Customeruser/CustomerUserList.js';
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const user_id = localStorage.getItem('user_id');
  if (!token || !user_id) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

function App() {
  const [isNavbarOpen, setIsNavbarOpen] = useState(true);

  const toggleNavbar = () => {
    setIsNavbarOpen(!isNavbarOpen);
  };

  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={
          localStorage.getItem('token')
            ? <Navigate to="/" replace />
            : <Login />
        } />
        <Route path="/404" element={<NotFound />} />
        <Route path="/access-denied" element={<AccessDenied />} />


        {/* Protected routes */}
        <Route path="/*" element={

          <ProtectedRoute>
            <Layout isNavbarOpen={isNavbarOpen} toggleNavbar={toggleNavbar}>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/book" element={<Book />} />
                <Route path="/lending-book" element={<LendingBook />} />
                <Route path="/book/categories" element={<BookType />} />
                <Route path="/book/return-book" element={<ReturnBook />} />
                <Route path="/user" element={<User />} />
                <Route path="/user/create" element={<CreateUser />} />
                <Route path="/user/edit-user/:id" element={<Edituser />} />
                <Route path="/logs/payment-logs" element={<PaymentLogs />} />
                <Route path="/request/request-book" element={<RequestBook />} />
                <Route path="/request/complate-request/:id" element={<ComplateRequest />} />
                <Route path="/logs/user-login-operation-logs" element={<UserLoginOperationLogs />} />
                <Route path="/logs/user-operation-logs" element={<UserOperationLogs />} />
                <Route path="/author" element={<Author />} />
                <Route path="/author/create" element={<AuthorCreate />} />
                <Route path="/author/edit/:id" element={<AuthorEdit />} />
                <Route path="/libraries" element={<Libraries />} />
                <Route path="/libraries/edit/:id" element={<EditLibraries />} />
                <Route path="/user/customer-user-create" element={<CustomerUserCreate />} />
                <Route path="/user/customer-user-list" element={<CustomerUserList />} />

                {/* Catch-all route for 404 */}

                <Route path="*" element={<NotFound />} />
                {/* Redirect to 404 for any unmatched routes */}
              </Routes>
            </Layout>
          </ProtectedRoute>
        }
        />
      </Routes>
    </Router>
  );
}

export default App; 