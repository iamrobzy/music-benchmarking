import React, { useRef, useState } from "react";
import { Box, FileUploadFileAcceptDetails, Flex, Heading, Text } from "@chakra-ui/react";
import { FileUploadDropzone, FileUploadList, FileUploadRoot } from "../components/ui/file-button";
import { Button } from "../components/ui/button";
import { ProgressCircleRing, ProgressCircleRoot } from "../components/ui/progress-circle";
import * as d3 from "d3";

const AboutPage: React.FC = () => {
    enum PageState {
        Input = 0,
        Loading,
        Output,
    }

    const [ data, setData ] = useState<number[][]>([]);
    const [ pageState, setPageState ] = useState<PageState>(PageState.Input);
    const [ file, setFile ] = useState<File>();
    const [ isSubmitError, setSubmitError ] = useState<boolean>(false);


    const handleFileAccept = (fileDetails: FileUploadFileAcceptDetails) => {
        setFile(fileDetails.files[0]);
        setSubmitError(false);
    };

    const handleSubmit = () => {
        if (file === undefined) {
            setSubmitError(true);
        } else {
            setPageState(PageState.Loading);
            // TODO: replace with API call
            setData([
                [0.3, 0.4, 0.6, 0.1, 0.3, 0.4, 0.6, 0.1],
                [0.1, 0.9, 0.4, 0.05, 0.1, 0.9, 0.4, 0.05],
                [0.1, 0.5, 0.3, 0.01, 0.1, 0.5, 0.3, 0.01],
                [0.4, 0.8, 0.6, 0.2, 0.4, 0.8, 0.6, 0.2],
                [0.06, 0.6, 0.1, 0.07, 0.06, 0.6, 0.1, 0.07]
            ]);
            setTimeout(() => {
                setPageState(PageState.Output);
            }, 1000);
        }
    };

    const handleRetry = () => {
        setPageState(PageState.Input);
    };

    const InputPage = () => {
        return (
        <Box width="100%" height="100%" padding="50px" justifyItems="center" alignContent="center" marginTop="-30px">
            <Heading size="2xl" marginBottom="50px">Audio Upload</Heading>
            <Box marginBottom="20px">
                <FileUploadRoot accept={"audio/mpeg"} onFileAccept={handleFileAccept}>
                    <FileUploadDropzone 
                        label="Drag and drop here to upload"
                        description=".mp3 files only"
                    />
                    <FileUploadList files={file ? [file] : []}/>
                </FileUploadRoot>
            </Box>
            {isSubmitError && <Text color="red" fontSize="sm">Please submit a valid audio file</Text>}
            <Button size="xl" marginTop="20px" onClick={handleSubmit}>Submit</Button>
        </Box>
        );
    };

    const LoadingPage = () => {
        return (
        <Box borderWidth="5px" width="100%" height="100%" justifyItems="center" alignContent="center">
            <Box>
                <ProgressCircleRoot value={null} size="lg" >
                    <ProgressCircleRing cap="round" />
                </ProgressCircleRoot>
            </Box>
        </Box>
        );
    };

    
    
    const labels = ["CNN", "CNN-2", "Audio-Mamba", "AST", "UserModel"]

    const svgRefs = useRef<SVGSVGElement[]>([]);

    svgRefs.current = new Array(data?.length || 0).fill(undefined);

    const renderGraphs = () => {
        const width = 250;
        const height = 130;
        const padding = 10;
        for (let i = 0; i < svgRefs.current.length; i++) {
            const svg = d3.select(svgRefs.current[i]);

            const d = [...Array(data[0].length)].map((_, i) => i.toString());
            const xScale = d3
                .scaleBand()
                .domain(d)
                .range([0, width])
                .padding(0.1)

            const xAxis = d3.axisBottom(xScale).tickValues([]);
            const yScale = d3
                .scaleLinear()
                .domain([0, 1])
                .range([0, height])

            const yAxis = d3.axisLeft(yScale).tickValues([]);

            svg
                .attr("height", height + 2 * padding)
                .attr("width", width + 2 * padding)

            svg
                .selectAll("bar")
                .data(data[i])
                .enter()
                .append("rect")
                .attr("class", "bar")
                .attr("x", (_, i) => (xScale(i.toString()) || 0) + padding)
                .attr("y", (d) => height - yScale(d) + padding)
                .attr("width", xScale.bandwidth())
                .attr("height", (d) => yScale(d))
                .attr("fill", "#4394E5");

            svg
                .append("g")
                .attr("transform", `translate(${padding}, ${height + padding})`)
                .call(xAxis);
          
            svg
                .append("g")
                .attr("transform", `translate(${padding}, ${padding})`)
                .call(yAxis);

        }
    };

    const OutputPage = () => {
        return (
            <Box padding="35px" justifyItems="center">
                <Heading size="2xl" marginBottom="20px">Results</Heading>
                <Flex justifyContent="center" wrap="wrap" marginBottom="10px">
                    {data.map((_, i) => {
                        return (
                            <Box padding="15px" margin="10px" justifyItems="center" border="1px solid grey">
                                <Heading size="md">{labels[i]}</Heading>
                                <svg ref={(r) => { if (r) svgRefs.current[i] = r; renderGraphs()}}></svg>
                            </Box>
                        );
                    })}
                </Flex>
                <Flex alignItems="baseline" marginBottom="20px">
                    <Text fontSize="lg" fontWeight="medium" marginRight="6px">The most popular genre is:</Text>
                    <Text fontSize="xl" fontWeight="bold">Rock</Text>
                </Flex>
                <Button onClick={handleRetry}>Try Another Song</Button>
            </Box>
        )
    }

    if (pageState === PageState.Input) {
        return <InputPage/>;
    } else if (pageState === PageState.Loading) {
        return <LoadingPage/>;
    } else if (pageState === PageState.Output) {
        return <OutputPage/>;
    }

    return <></>
};

export default AboutPage;