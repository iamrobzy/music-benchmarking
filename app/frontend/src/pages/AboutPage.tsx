import React from "react";
import { Box, Heading, Text } from "@chakra-ui/react";
import bgUrl from "../images/spectrogram.jpg"

const AboutPage: React.FC = () => {
    return (
    <Box height="100%" width="100%" alignContent="center" bgAttachment="fixed" bgColor="rgba(255,255,255,0.2)" bgBlendMode="lighten" bgImage={`url("${bgUrl}")`}>
        <Box width="60%" padding="80px" marginTop="-50px" justifySelf="center" bgColor="rgba(255,255,255,0.7)">
            <Heading size="4xl" marginBottom={8} textAlign="center">Welcome to Music Tagging Benchmarker!</Heading>
            <Text fontSize="md" marginBottom={5} justifySelf="center">This project was created to address the gap in model benchmarking for music analysis. Here, you'll find fine-tuned, state-of-the-art models benchmarked across a variety of metrics through dynamic data visualizations. Dive into our output comparison feature to upload audio, compare model responses, and explore the logits and predictions each model generates—offering an in-depth look at model performance and insights for music data enthusiasts and researchers alike!</Text>
            <Text fontSize="md">-- by Adrian, Robert, Michalina, and Jerome</Text>
        </Box>
    </Box>
    )
};

export default AboutPage;