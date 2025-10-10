import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from '@/components/Layout';
import HomePage from '@/pages/HomePage';
import ProductDetailPage from '@/pages/ProductDetailPage';
import SuccessPage from '@/pages/SuccessPage';
import AdminDashboardPage from '@/pages/Admin/DashboardPage';
import AdminUploadPage from '@/pages/Admin/UploadPage';
import DownloadPage from '@/pages/DownloadPage';
import NotFoundPage from '@/pages/NotFoundPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="product/:id" element={<ProductDetailPage />} />
          <Route path="success/:reference" element={<SuccessPage />} />
          <Route path="download/:token" element={<DownloadPage />} />
          <Route path="admin" element={<AdminDashboardPage />} />
          <Route path="admin/upload" element={<AdminUploadPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
