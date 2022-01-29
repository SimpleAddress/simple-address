import React, { useState, omponent, PureComponent, useEffect } from "react";

import { Flex, Text, Box } from "@chakra-ui/react";

import {
  Label,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Legend,
  Tooltip,
  ReferenceArea,
  ResponsiveContainer,
} from "recharts";

import theme from "../theme";

/**
 * Props
 * data: Array<object>,
 * title
 * subtitle
 * ActionComponent
 * handleAction: Function
 * width
 * height
 * xAxisDataKey
 * yAxisDataKey
 * responsiveContainerWidth
 * responsiveContainerHeight
 */


export default function BasicLineChart(props) {

  const {
    data,
    title,
    subtitle,
    ActionComponent,
    handleAction,
    chartWidth,
    chartHeight,
    xAxisDataKey,
    yAxisDataKey,
    responsiveContainerWidth,
    responsiveContainerHeight,
  } = props;

  const [graphData, setGraphData] = useState([])

  useEffect(() => {
    setGraphData(data)
  }, [data])

  return (
    <Box
      border="1px solid #eee"
      px={4}
      borderRadius={8}
      height="auto"
      width={"100%"}
    >
      <Box py={2}>
        <Text as="h1" fontWeight="extrabold" py={3}>
          {title}
        </Text>
        <Flex
          flexDirection={"row"}
          alignItems={"center"}
          justifyContent={"space-between"}
        >
          <Text fontWeight="bold">{subtitle}</Text>

          <ActionComponent />
        </Flex>
      </Box>

      <ResponsiveContainer
        width={responsiveContainerWidth}
        height={responsiveContainerHeight}
      >
        <LineChart width={chartWidth} height={chartHeight} data={data}>
          <CartesianGrid strokeDasharray="1 1" />
          <Line
            type="monotoneX"
            dataKey="balance"
            dot={{ stroke: "#212121", strokeWidth: 4 }}
            strokeWidth={4}
            stroke='#2196F3'
          />
          <XAxis dataKey={xAxisDataKey} />
          <Tooltip />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
}
