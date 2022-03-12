import { TokeChart } from "./TokeChart";
import { DaoInformation, T_TOKE_CONTRACT, TOKE_CONTRACT } from "../constants";
import { useAmounts } from "../api/Erc20";
import { useNewStaking } from "../api/TokeStaking";
import { Divider } from "@chakra-ui/react";
import { DaoDetailsCard } from "./DaoDetailsCard";
import { DaoResourcesCard } from "./DaoResourcesCard";
import BigNumber from "bignumber.js";
import { addDays } from "date-fns";
import { Page } from "./Page";

function getAmount(array: { total: string; time: Date }[][]) {
  return (
    array
      .filter((obj) => obj.length > 0)
      // get the last record
      .map((obj) => obj[obj.length - 1])
      //add them up
      .reduce(
        (obj, acc) => obj.plus(new BigNumber(acc.total)),
        new BigNumber(0)
      )
      .decimalPlaces(2)
      .toNumber()
  );
}

type Props = {
  dao: DaoInformation;
};

export function Dao({ dao }: Props) {
  const { addresses } = dao;
  const { data: tokeEvents } = useAmounts(TOKE_CONTRACT, addresses);
  const { data: tTokeEvents } = useAmounts(T_TOKE_CONTRACT, addresses);
  const { data: newStaking } = useNewStaking(addresses);

  let total = 0;
  let pastTotal = 0;
  let changePercent = 0;

  if (tokeEvents && tTokeEvents && newStaking) {
    const array = [tokeEvents, tTokeEvents, newStaking];
    total = getAmount(array);

    const daysAgo = addDays(new Date(), -30);

    pastTotal = getAmount(
      array.map((events) => {
        const item = [...events]
          .reverse()
          .find((event) => event.time < daysAgo);
        return item ? [item] : [];
      })
    );

    changePercent = (total / pastTotal - 1) * 100;
  }

  return (
    <Page header={dao.name}>
      <DaoDetailsCard dao={dao} total={total} changePercent={changePercent} />
      <TokeChart addresses={addresses} />
      <Divider />
      <DaoResourcesCard dao={dao} />
    </Page>
  );
}
