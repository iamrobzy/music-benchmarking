import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import Color from "colorjs.io";
import { Box, CheckboxGroup, Flex, Heading, SimpleGrid } from "@chakra-ui/react";
import { Checkbox } from "../components/ui/checkbox";
import { NativeSelectField, NativeSelectRoot } from "../components/ui/native-select";
// import { Checkbox } from "./components/ui/checkbox";

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
    const svgRef = useRef<SVGSVGElement | null>(null);
    // API call to backend
    // Should retrieve a dictionary of model name to all metrics and a list of metric names
    const payload = {
        data: {
            "CNN": [.99, .89, .9],
            "CNN-2": [.97, .79, .85],
            "AudioMamba": [.94, .3, .65],
            "AST": [.95, .92, .92],
            "UserModel": [.6, .3, .45],
        },
        metrics: ["Accuracy", "Precision", "AOC"]
    }

    // normalize values?
    const data = Object.values(payload["data"]);
    const models = Object.keys(payload["data"]);
    const metrics: string[] = payload["metrics"];
    const colors = ["#4394E5", "#87BB62", "#CA6469", "#876FD4", "#F5921B", "#E0E0E0"];
    const hoverColors = colors.map(c => darken(c));
    const metricToColorIndex = new Map<string, number>();
    for (let i = 0; i < metrics.length; i++) {
        metricToColorIndex.set(metrics[i], i);
    }

    const width = 800;
    const height = 500;
    const padding = 20;

    const [checkedMetrics, setCheckedMetrics] = useState<string[]>(range(metrics.length));
    const handleMetricsChange = (values: string[]) => {
        setCheckedMetrics(values);
    }

    const [checkedModels, setCheckedModels] = useState<string[]>(range(models.length));
    const handleModelsChange = (values: string[]) => {
        setCheckedModels(values);
    }

    const [sortSelection, setSortSelection] = useState<string>();
    const handleSortChange = (event: ChangeEvent<HTMLSelectElement>) => {
        setSortSelection(event.target.value);
    }

    useEffect(() => {
        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove(); // Clear previous chart elements if re-rendered
    
        // Get selected labels (models)
        const modelIndices = checkedModels.sort((m1, m2) => {
            return data[Number(m2)][Number(sortSelection)] - data[Number(m1)][Number(sortSelection)];
        });

        const labels = modelIndices.map((i) => models[Number(i)]);

        // Get selected sublabels (metrics as indices)
        const metricIndices = checkedMetrics.sort(); //TODO
        const sublabels = metricIndices.map((i) => metrics[Number(i)]);
        
        // Filter data 
        const filteredData = modelIndices.map((i) => metricIndices.map((j) => data[Number(i)][Number(j)]));

        // Set up scales and axes
        const xScale = d3
            .scaleBand()
            .domain(labels)
            .range([0, width])
            .padding(0.2);

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
    
        const yAxis = d3.axisLeft(yScale);

        svg.attr("height", height + 2 * padding);
        d3.select('body').append('div')   
            .attr('class', 'tooltip') 
            .style('position', 'absolute')
            .style('display', 'none')
            .style('background-color', "white")
            .style('padding', "5px")
            .style('border', "1px solid black")


        // Create bars
        svg
            .selectAll(".bar")
            .data(filteredData)
            .enter()
            .append("g")
            .attr("transform", (_, i) => `translate(${xScale(labels[i])})`)
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
                .style('top', (event.pageY - 25) + 'px');

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
                .attr("y", (d) => height - yScale(d))
                .attr("width", xSubscale.bandwidth())
                .attr("height", (d) => yScale(d))
                .attr("fill", (_, i) => colors[metricToColorIndex.get(sublabels[i]) || 0]);
               
        // Add axes
        svg
          .append("g")
          .attr("transform", `translate(0, ${height})`)
          .call(xAxis);
    
        svg.append("g").call(yAxis);

      }, [checkedMetrics, checkedModels, sortSelection]);


    return (
    <Box height="100%" width="100%" justifyContent="center" alignContent="center">
        {/* <Heading size="xl" marginBottom={10}>Benchmarked Models</Heading> */}
        <Flex padding={30}>
            <svg ref={svgRef} width={width} height={height}></svg>
            <Box padding={10}>
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
    )
};

export default BenchmarkPage;