import React, { Component, PureComponent } from 'react';

import { Flex, Text, Box } from '@chakra-ui/react';

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
} from 'recharts';

import theme from '../theme';

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

export default class BasicLineChart extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      data: this.props.data,
    };
  }

  render() {
    const { data } = this.state;
    const {
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
    } = this.props;

    return (
      <Box my={5} height="auto" width={'100%'} display={['none', 'none', 'block', 'block']}>
        <Box px={19} py={2}>
          <Text as="h1" fontWeight="extrabold" px={19} py={3}>
            {title}
          </Text>
          <Flex
            px={19}
            flexDirection={'row'}
            alignItems={'center'}
            justifyContent={'space-between'}
          >
            <Text fontWeight="bold">{subtitle}</Text>

            <ActionComponent />
          </Flex>
        </Box>

        <ResponsiveContainer width={responsiveContainerWidth} height={responsiveContainerHeight}>
          <LineChart width={chartWidth} height={chartHeight} data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <Line
              type="monotoneX"
              dataKey="balance"
              dot={{ stroke: 'black', strokeWidth: 4 }}
              strokeWidth={2}
              stroke={theme.colors.black}
            />
            <XAxis dataKey={xAxisDataKey} />
            <YAxis dataKey={yAxisDataKey} />
            <Tooltip />
          </LineChart>
        </ResponsiveContainer>
      </Box>
    );
  }
}
