import React, { useState } from 'react';
import {
  ChakraProvider,
  Box,
  Flex,
  Heading,
  Button,
} from '@chakra-ui/react';
import AboutPage from './components/AboutPage';
import BenchmarkPage from './components/BenchmarkPage';

import styled from '@emotion/styled'
import { css } from '@emotion/react'
import OutputCompPage from './components/OutputCompPage';

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
    <ChakraProvider>
      <Flex height="100vh">
        <Box position="fixed" width="100%" bg="black" color="white" padding="10px">
            <Flex align="center" justify="space-between">
            <Heading marginLeft="10px" size="md">Music Tagging Benchmarker</Heading>
            <Flex>
                <StyledButton 
                    variant='solid'
                    isSelected={selectedPage === 'about'}
                    onClick={() => handleChange('about')}
                >
                About
                </StyledButton>
                <StyledButton
                    variant='solid'
                    isSelected={selectedPage === 'benchmarkedModels'}
                    onClick={() => handleChange('benchmarkedModels')}
                >
                Benchmarked Models
                </StyledButton>
                <StyledButton
                    variant='solid'
                    isSelected={selectedPage === 'outputComparison'}
                    onClick={() => handleChange('outputComparison')}
                >
                Output Comparison
                </StyledButton>
            </Flex>
            </Flex>
        </Box>
        <Box padding="20px" marginTop="60px" height="calc(100% - 60px)">
            {selectedPage === 'about' && <AboutPage />}
            {selectedPage === 'benchmarkedModels' && <BenchmarkPage />}
            {selectedPage === 'outputComparison' && <OutputCompPage />}
        </Box>
      </Flex>
    </ChakraProvider>
  );
};

export default App;