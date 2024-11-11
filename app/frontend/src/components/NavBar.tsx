import { Box, Button, Flex, Heading } from "@chakra-ui/react";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

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

const NavBar: React.FC = () => {
    const location = useLocation();
    const [ windowWidth, setWindowWidth ] = useState<number>(window.innerWidth);
    const updateSize = () => {
        setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', updateSize);

    return (
    <Box position="fixed" width="100%" bg="black" color="white" padding="10px">
        <Flex alignItems="center">
            { (windowWidth > 850) && <Heading marginLeft="10px" size="2xl">Music Tagging Benchmarker</Heading>}
            <Flex marginLeft="auto">
                <Link to="/">
                    <StyledButton
                        variant='solid'
                        size='lg'
                        isSelected={location.pathname === '/'}
                    >
                    About
                    </StyledButton>
                </Link>
                <Link to="/benchmarking">
                    <StyledButton
                        size='lg'
                        isSelected={location.pathname === '/benchmarking'}
                    >
                    Benchmarked Models
                    </StyledButton>
                </Link>
                <Link to="/output-comparison">
                    <StyledButton
                        size='lg'
                        isSelected={location.pathname === '/output-comparison'}
                    >
                    Output Comparison
                    </StyledButton>
                </Link>
            </Flex>
        </Flex>
    </Box>
    );
}

export default NavBar;