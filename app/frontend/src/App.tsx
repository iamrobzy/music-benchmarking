import React from 'react';
import {
  Box,
  Flex,
  defaultSystem,
  ChakraProvider,
} from '@chakra-ui/react';
import AboutPage from './pages/AboutPage';
import BenchmarkPage from './pages/BenchmarkPage';
import OutputCompPage from './pages/OutputCompPage';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import NavBar from './components/NavBar'


const App: React.FC = () => {
  return (
    <ChakraProvider value={defaultSystem}>
        <BrowserRouter>
            <Box height="100vh" width="100vw">
                <Flex height="100%" width="100%">
                    <NavBar />
                    <Box marginTop="60px" width="100%" height="calc(100% - 60px)">
                        <Routes>
                            <Route
                                path="/"
                                element={<AboutPage />}
                            />
                            <Route
                                path="/benchmarking"
                                element={<BenchmarkPage />}
                            />
                            <Route
                                path="/output-comparison"
                                element={<OutputCompPage />}
                            />
                        </Routes>
                    </Box>
                </Flex>
            </Box>
        </BrowserRouter>
    </ChakraProvider>
  );
};

export default App;