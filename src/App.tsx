import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import UploadPage from './pages/UploadPage';
import { CollectionProvider } from './context/CollectionContext';

import CoinDetailsPage from './pages/CoinDetailsPage';

function App() {
  return (
    <CollectionProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="add" element={<UploadPage />} />
            <Route path="coins/:id" element={<CoinDetailsPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </CollectionProvider>
  )
}

export default App
