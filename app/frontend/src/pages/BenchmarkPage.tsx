import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import Color from "colorjs.io";
import { Box, CheckboxGroup, Flex, Heading, SimpleGrid } from "@chakra-ui/react";
import { Checkbox } from "../components/ui/checkbox";
import { NativeSelectField, NativeSelectRoot } from "../components/ui/native-select";
import { ProgressCircleRing, ProgressCircleRoot } from "../components/ui/progress-circle";

type BenchmarkingData = {
    data: number[][];
    models: string[];
    metrics: string[];
}

function range(size: number) {
    const result = []
    for (let i = 0; i < size; i++) {
        result.push(i.toString());
    }
    return result;
}

function darken(color: string) {
    if (color.length != 7 || color[0] != "#") {
        return "#FFFFFF";
    }

    const newColor = new Color(color);
    newColor.hsl.l = 45;

    return newColor.toString({format: "hex"});
}

const BenchmarkPage: React.FC = () => {
    const LG_WIDTH = 700;
    const SM_WIDTH = 500;
    const LG_HEIGHT = 450;
    const SM_HEIGHT = 350;
    const LG_FONTSIZE = "16px";
    const SM_FONTSIZE = "12px";
    const PADDING = 25;
    const MD_THRESHOLD = 1150;
    const SM_THRESHOLD = 900;

    const [ windowWidth, setWindowWidth ] = useState<number>(window.innerWidth);
    const [ isLoading, setLoading ] = useState<boolean>(true);
    const updateSize = () => {
        setTimeout(() => { setWindowWidth(window.innerWidth); }, 200);
    };

    window.addEventListener('resize', updateSize);


    const colors = ["#4394E5", "#87BB62", "#CA6469", "#876FD4", "#F5921B", "#E0E0E0"];
    const hoverColors = colors.map(c => darken(c));
    const [ payload, setPayload ] = useState<BenchmarkingData>();
    const [ data, setData ] = useState<number[][]>();
    const [ models, setModels ] = useState<string[]>([]);
    const [ metrics, setMetrics ] = useState<string[]>([]);
    const [ metricToColorIndex, setMetricToColorIndex] = useState<Map<string, number>>(new Map());
    useEffect(() => {
        async function getPayload() {
            const response = await fetch("http://127.0.0.1:8080/api/benchmarking");
            if (!response.ok) {
                throw new Error(`Response status: ${response.status}`);
              }
          
            const payload = await response.json();
            setPayload(payload);
        }

        getPayload();
    }, []);

    useEffect(() => {
        if (payload) {
            setData(payload["data"]);
            setModels(Object.values(payload["models"]));
            setMetrics(Object.values(payload["metrics"]));
        }
    }, [payload]);

    useEffect(() => {
        setCheckedMetrics(range(metrics.length));
        const map = new Map<string, number>();

        for (let i = 0; i < metrics.length; i++) {
            map.set(metrics[i], i);
        }

        setMetricToColorIndex(map);
    }, [metrics])

    useEffect(() => {
        setCheckedModels(range(models.length));
    }, [models])
    
    const svgRef = useRef<SVGSVGElement | null>(null);
    
    const [checkedMetrics, setCheckedMetrics] = useState<string[]>([]);
    const handleMetricsChange = (values: string[]) => {
        setCheckedMetrics(values);
        if (values.length > 0) {
            setSortSelection(values[0]);
        }
    }

    const [checkedModels, setCheckedModels] = useState<string[]>([]);
    const handleModelsChange = (values: string[]) => {
        setCheckedModels(values);
    }

    const [sortSelection, setSortSelection] = useState<string>();
    const handleSortChange = (event: ChangeEvent<HTMLSelectElement>) => {
        setSortSelection(event.target.value);
    }

    useEffect(() => {
        if (!data) {
            return;
        };
        
        const width = (windowWidth <= MD_THRESHOLD) ? SM_WIDTH : LG_WIDTH;
        const height = (windowWidth <= MD_THRESHOLD) ? SM_HEIGHT : LG_HEIGHT;
        const fontSize = (windowWidth <= MD_THRESHOLD) ? SM_FONTSIZE : LG_FONTSIZE;
        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove(); // Clear previous chart elements if re-rendered
    
        // Get selected labels (models)
        const modelIndices = checkedModels.sort((m1, m2) => {
            return data[Number(m2)][Number(sortSelection)] - data[Number(m1)][Number(sortSelection)];
        });

        const labels = modelIndices.map((i) => models[Number(i)]);

        // Get selected sublabels (metrics as indices)
        const metricIndices = checkedMetrics.sort();
        const sublabels = metricIndices.map((i) => metrics[Number(i)]);
        
        // Filter data 
        const filteredData = modelIndices.map((i) => metricIndices.map((j) => data[Number(i)][Number(j)]));

        // Set up scales and axes
        const xScale = d3
            .scaleBand()
            .domain(labels)
            .range([0, width])
            .padding(0.25);

        const xAxis = d3
            .axisBottom(xScale);

        const xSubscale = d3
            .scaleBand()
            .domain(sublabels)
            .range([0, xScale.bandwidth()])
            .padding(0.05)
        
        
        const yScale = d3
            .scaleLinear()
            .domain([0, d3.max(data[0]) || 0])
            .range([0, height]);
    
        const yAxis = d3.axisLeft(yScale).tickValues([]);;

        svg
            .attr("height", height + 2 * PADDING)
            .attr("width", width + 2 * PADDING);
        
        d3.select('body').append('div')   
            .attr('class', 'tooltip') 
            .style('position', 'absolute')
            .style('display', 'none')
            .style('background-color', "white")
            .style('padding', "5px")
            .style('border', "1px solid black");            

        // Create bars
        svg
            .selectAll(".bar")
            .data(filteredData)
            .enter()
            .append("g")
            .attr("transform", (_, i) => `translate(${(xScale(labels[i]) || 0) + PADDING})`)
            .on("mouseover", function(event, d) {
                d3.select(".tooltip")
                .html(() => {
                    let result = "";
                    for (let i = 0; i < d.length; i++) {
                        result += `<h1>${sublabels[i]}: ${d[i]}</h1>`
                    }
                    return result;
                })
                .style('display', 'block')
                .style('left', (event.pageX + 25) + 'px')     
                .style('top', (event.pageY - 25) + 'px')
                .style('font-size', fontSize);

                d3.select(this).selectAll("rect")
                    .attr("fill", (_, i) => hoverColors[metricToColorIndex.get(sublabels[i]) || 0]);
            })
            .on("mouseleave", function(_) {
                d3.select(this).selectAll("rect")
                    .attr("fill", (_, i) => colors[metricToColorIndex.get(sublabels[i]) || 0])
                d3.select(".tooltip")
                    .style('display', 'none')
            })
            .selectAll("rect")
            .data(d => d)
            .enter()
            .append("rect")
                .attr("class", "bar")
                .attr("x", (_, i) => xSubscale(sublabels[i]) || 0)
                .attr("y", (d) => height - yScale(d) + PADDING)
                .attr("width", xSubscale.bandwidth())
                .attr("height", (d) => yScale(d))
                .attr("fill", (_, i) => colors[metricToColorIndex.get(sublabels[i]) || 0]);
               
        // Add axes
        svg
          .append("g")
          .attr("transform", `translate(${PADDING}, ${height + PADDING})`)
          .call(xAxis)
          .style("font-size", fontSize);
    
        svg
            .append("g")
            .attr("transform", `translate(${PADDING}, ${PADDING})`)
            .call(yAxis);

        setLoading(false);
      }, [checkedMetrics, checkedModels, sortSelection, windowWidth]);

    return (
        <>
            <Box display={isLoading ? "none" : "block"} height="100%" width="100%" justifyContent="center" alignContent="center">
                <Flex direction={(windowWidth < SM_THRESHOLD) ? "column" : "row"} padding="50px">
                    <Box padding="10px 0" alignSelf="center">
                        <svg ref={svgRef}></svg>
                    </Box>
                    <Box padding="20px" margin="0 auto">
                        <Box marginBottom={10}>
                            <Heading size="md" marginBottom={3}>Metrics</Heading>
                            <CheckboxGroup value={checkedMetrics} onValueChange={handleMetricsChange}>
                                <SimpleGrid columns={2} gap={5}>
                                    {metrics.map((m, i) => <Checkbox value={i.toString()}>{m}</Checkbox>)}
                                </SimpleGrid>
                            </CheckboxGroup>
                        </Box>
                        <Box marginBottom={10}>
                            <Heading size="md" marginBottom={3}>Models</Heading>
                            <CheckboxGroup value={checkedModels} onValueChange={handleModelsChange}>
                                <SimpleGrid columns={2} gap={5}>
                                    {models.map((m, i) => <Checkbox value={i.toString()}>{m}</Checkbox>)}
                                </SimpleGrid>
                            </CheckboxGroup>
                        </Box>
                        <Box>
                            <Heading size="md" marginBottom={3}>Sort by</Heading>
                            <NativeSelectRoot>
                                <NativeSelectField value={sortSelection} onChange={handleSortChange}>
                                    {checkedMetrics.map((m) => <option value={m}>{metrics[Number(m)]}</option>)}
                                </NativeSelectField>
                            </NativeSelectRoot>
                        </Box>
                    </Box>
                </Flex>
            </Box>
            <Box display={isLoading ? "block" : "none"}borderWidth="5px" width="100%" height="100%" justifyItems="center" alignContent="center">
                <Box>
                    <ProgressCircleRoot value={null} size="lg" >
                        <ProgressCircleRing cap="round" />
                    </ProgressCircleRoot>
                </Box>
            </Box>
        </>
    )
};

export default BenchmarkPage;