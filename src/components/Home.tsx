import { useCurrentBalance, useTotalSupply } from "../api/Erc20";
import { DAOS, TOKE_CONTRACT } from "../constants";
import { BigNumber } from "ethers";
import { formatEther } from "ethers/lib/utils";
import { BaseCard } from "./DaoDetailsCard";
import {
  Box,
  SimpleGrid,
  Stat,
  StatHelpText,
  StatNumber,
} from "@chakra-ui/react";

export function Home() {
  const { data: tokeTreasury } = useCurrentBalance(
    TOKE_CONTRACT,
    "0x8b4334d4812C530574Bd4F2763FcD22dE94A969B"
  );

  //TODO: this doesn't match the amount coingecko says is vesting https://www.coingecko.com/en/coins/tokemak
  const { data: vesting } = useCurrentBalance(
    TOKE_CONTRACT,
    "0x96F98Ed74639689C3A11daf38ef86E59F43417D3"
  );

  const { data: totalSupply } = useTotalSupply(TOKE_CONTRACT);

  let circulating = BigNumber.from(0);

  if (totalSupply && tokeTreasury && vesting) {
    circulating = totalSupply.sub(vesting).sub(tokeTreasury);
  }

  return (
    <Box maxW="7xl" mx="auto" pt={5} px={{ base: 2, sm: 12, md: 17 }}>
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={{ base: 5, lg: 8 }}>
        <BaseCard title="Total Dao owned toke">
          <Stat>
            <StatNumber>lots</StatNumber>
          </Stat>
        </BaseCard>

        <BaseCard title="Circulating Supply">
          <Stat>
            <StatNumber>{formatEther(circulating).split(".")[0]}</StatNumber>
            <StatHelpText>💰</StatHelpText>
          </Stat>
        </BaseCard>

        <BaseCard title="Daos Accumulating">
          <Stat>
            <StatNumber>{DAOS.length}</StatNumber>
          </Stat>
        </BaseCard>
      </SimpleGrid>
    </Box>
  );
}
