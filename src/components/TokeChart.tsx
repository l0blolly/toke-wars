import {
  AreaChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
} from "recharts";
import { sortBy } from "lodash";
import { T_TOKE_CONTRACT, TOKE_CONTRACT } from "../constants";
import { useAmounts } from "../api/Erc20";
import { useNewStaking } from "../api/TokeStaking";
import { addMonths, differenceInMonths, isEqual, parseISO } from "date-fns";
import { formatNumber } from "../util/maths";
import { formatEther } from "ethers/lib/utils";

export function TokeChart({ addresses }: { addresses: string[] }) {
  const { data: tokeEvents } = useAmounts(TOKE_CONTRACT, addresses);
  const { data: tTokeEvents } = useAmounts(T_TOKE_CONTRACT, addresses);
  const { data: newStaking } = useNewStaking(addresses);

  if (!tokeEvents || !tTokeEvents || !newStaking) {
    return <div>loading</div>;
  }

  const staking = [...tTokeEvents, ...newStaking];

  let data = [
    ...staking.map(({ time, total }) => ({
      time,
      tToke: formatEther(total),
    })),
    ...tokeEvents.map(({ time, total }) => ({
      time,
      toke: formatEther(total),
    })),
  ];
  data = sortBy(data, "time");

  if (data.length < 1) {
    return <div>No data</div>;
  }

  let lastDatum = { time: new Date(0), tToke: "0", toke: "0" };
  let joinedData = data
    .map((datum) => {
      lastDatum = { ...lastDatum, ...datum };
      return lastDatum;
    })
    .filter(({ time }, i, array) => !isEqual(time, array[i + 1]?.time));

  joinedData.push({ ...joinedData[joinedData.length - 1], time: new Date() });

  const dateFormatter = (date: Date) => date.toLocaleDateString("en-US");

  const startDate = parseISO("2021-10-01");

  const ticks = Array.from(
    Array(differenceInMonths(new Date(), startDate) + 1)
  ).map((_, i) => addMonths(startDate, i));

  return (
    <div style={{ width: "100%", height: "400px" }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={joinedData}
          margin={{
            top: 0,
            right: 75,
            left: 75,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="time"
            scale="time"
            type="number"
            tickFormatter={dateFormatter}
            domain={[() => startDate, () => new Date()]}
            // @ts-ignore
            ticks={ticks}
          />
          <YAxis tickFormatter={formatNumber} />
          <Tooltip
            labelFormatter={dateFormatter}
            labelStyle={{ color: "black" }}
            formatter={(value) => {
              return formatNumber(Number(value));
            }}
          />
          <Legend />
          <Area
            connectNulls={true}
            type="stepAfter"
            dataKey="tToke"
            name="tTOKE"
            stroke="#8884d8"
            fill="#8884d8"
            stackId="1"
          />
          <Area
            connectNulls={true}
            type="stepAfter"
            dataKey="toke"
            name="TOKE"
            stroke="#82ca9d"
            fill="#82ca9d"
            stackId="1"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
