import React, { Component, PureComponent } from "react";

import { Flex, Text } from "@chakra-ui/react";

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

const initialData = [
  {
    name: "Jan",
    balance: 0,
  },
  {
    name: "Feb",
    balance: 0,
  },
  {
    name: "March",
    balance: 0,
  },
  {
    name: "April",
    balance: 0,
  },
  {
    name: "May",
    balance: 0,
  },
  {
    name: "June",
    balance: 0,
  },
  {
    name: "July",
    balance: 0,
  },
];

export default class AssetsByTimeChart extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      data: initialData,
    };
  }

  render() {
    const { data } = this.state;

    return (
      <ResponsiveContainer width="100%" height={300}>
        <LineChart width={"100%"} height={300} data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="balance"
            stroke={theme.colors.black}
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    );
  }
}
