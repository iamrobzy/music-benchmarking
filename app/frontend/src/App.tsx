import React, { useState } from 'react';
import {
  Box,
  Flex,
  Heading,
  Button,
  defaultSystem,
  ChakraProvider,
} from '@chakra-ui/react';
import AboutPage from './pages/AboutPage';
import BenchmarkPage from './pages/BenchmarkPage';
import { css } from '@emotion/react'
import OutputCompPage from './pages/OutputCompPage';
import styled from '@emotion/styled';

const StyledButton = styled(Button)< {isSelected: boolean} >`
    border: none;
    border-radius: 9999px;
    margin: 0px 5px;
    &:focus {
      outline: none;
    }
    
    ${({ isSelected }) =>
    isSelected
      ? css`
          color: black;
          background: white;
          &:hover {
            background: white;
          }
        `
      : css`
          color: white;
          background-color: black;
          &:hover {
            background: #333333;
            color: white;
            border: #333333;
          }
        `}
`

const App: React.FC = () => {
  const [selectedPage, setSelectedPage] = useState<string>('about');

  const handleChange = (page: string) => {
    setSelectedPage(page);
  };

  return (
    <ChakraProvider value={defaultSystem}>
        <Box height="100vh" width="100vw" className="dark">
            <Flex height="100%" width="100%">
                <Box position="fixed" width="100%" bg="black" color="white" padding="10px">
                    <Flex align="center" justify="space-between">
                        <Heading marginLeft="10px" size="2xl">Music Tagging Benchmarker</Heading>
                        <Flex>
                            <StyledButton
                                variant='solid'
                                size='lg'
                                isSelected={selectedPage === 'about'}
                                onClick={() => handleChange('about')}
                            >
                            About
                            </StyledButton>
                            <StyledButton
                                size='lg'
                                isSelected={selectedPage === 'benchmarkedModels'}
                                onClick={() => handleChange('benchmarkedModels')}
                            >
                            Benchmarked Models
                            </StyledButton>
                            <StyledButton
                                size='lg'
                                isSelected={selectedPage === 'outputComparison'}
                                onClick={() => handleChange('outputComparison')}
                            >
                            Output Comparison
                            </StyledButton>
                        </Flex>
                    </Flex>
                </Box>
                <Box padding="20px" marginTop="60px" width="100%" height="calc(100% - 60px)">
                    {selectedPage === 'about' && <AboutPage />}
                    {selectedPage === 'benchmarkedModels' && <BenchmarkPage />}
                    {selectedPage === 'outputComparison' && <OutputCompPage />}
                </Box>
            </Flex>
        </Box>
    </ChakraProvider>
  );
};

export default App;