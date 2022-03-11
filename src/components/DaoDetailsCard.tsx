import { ExternalLinkIcon } from "@chakra-ui/icons";
import {
  Box,
  chakra,
  Flex,
  Link,
  SimpleGrid,
  Stat,
  StatArrow,
  StatGroup,
  StatHelpText,
  StatLabel,
  StatNumber,
  useColorModeValue,
} from "@chakra-ui/react";
import { ReactNode } from "react";
import { DaoInformation } from "../constants";
import { stageMap } from "./LiquidityStages";

type BaseCardProps = {
  title: string;
  children: ReactNode;
};

export function BaseCard({ title, children }: BaseCardProps) {
  return (
    <Stat
      px={{ base: 2, md: 4 }}
      py="5"
      shadow="xl"
      border="1px solid"
      borderColor={useColorModeValue("gray.800", "gray.500")}
      rounded="lg"
    >
      <Flex justifyContent="space-between">
        <Box pl={{ base: 2, md: 4 }}>
          <StatLabel fontWeight="medium" isTruncated>
            {title}
          </StatLabel>
          <StatGroup>{children}</StatGroup>
        </Box>
        <Box
          my="auto"
          color={useColorModeValue("gray.800", "gray.200")}
          alignContent="center"
        >
          {/* {icon} */}
        </Box>
      </Flex>
    </Stat>
  );
}

interface StatsCardProps {
  title: string;
  total: number;
  changePercent: number;
  /* icon: ReactNode; */
}
function StatsCard({ title, total, changePercent }: StatsCardProps) {
  return (
    <BaseCard title={title}>
      <Stat>
        <StatNumber>{total}</StatNumber>
        <StatHelpText>
          <StatArrow type="increase" />
          {/* 
                get percent increase
                if newStaking contains sum totals,
                can compare latest to previous
                */}
          {changePercent.toFixed(2)}% over 30 days
        </StatHelpText>
      </Stat>
    </BaseCard>
  );
}

interface StageCardProps {
  title: string;
  stage: number;
  /* icon: ReactNode; */
}
function StageCard({ title, stage }: StageCardProps) {
  const stageText = stageMap[stage].title || "";

  return (
    <BaseCard title={title}>
      <Stat>
        <StatNumber>{stage}</StatNumber>
        <StatHelpText>{stageText}</StatHelpText>
      </Stat>
    </BaseCard>
  );
}

function shortenAddress(address: string, showCharacters = 5) {
  return (
    address.substring(0, showCharacters) +
    `...` +
    address.substring(address.length - showCharacters, address.length)
  );
}

interface StatsLinkCardProps {
  title: string;
  addresses: string[];
  /* icon: ReactNode; */
}
function StatsLinkCard({ title, addresses }: StatsLinkCardProps) {
  return (
    <BaseCard title={title}>
      <Stat>
        <StatNumber>
          <Link href={"http://zapper.fi/account/" + addresses[0]} isExternal>
            Current Treasury <ExternalLinkIcon mx="2px" />
          </Link>
        </StatNumber>
        <StatHelpText>{shortenAddress(addresses[0])}</StatHelpText>
      </Stat>
    </BaseCard>
  );
}

type Props = {
  dao: DaoInformation;
  total: number;
  changePercent: number;
};

export function DaoDetailsCard({ dao, total, changePercent }: Props) {
  const { name, addresses, stage } = dao;
  return (
    <Box maxW="7xl" mx="auto" pt={5} px={{ base: 2, sm: 12, md: 17 }}>
      <chakra.h1 textAlign="center" fontSize="4xl" pb={10} fontWeight="bold">
        {name}
      </chakra.h1>
      {/*         <Heading as='h4' style={{ display: "flex", gap: "5px" }}>
          {addresses.map((address) => (
            <Badge key={address}>
              {address}
            </Badge>
          ))}
        </Heading> */}
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={{ base: 5, lg: 8 }}>
        <StatsCard
          title="Total TOKE Owned"
          total={total}
          changePercent={changePercent}
          /* icon="┻┳" */
        />
        <StageCard
          title="DAO Stage"
          stage={stage}
          /* icon={<FiServer size={'3em'} />} */
        />
        <StatsLinkCard
          title="Zapper"
          addresses={addresses}
          /* icon={<GoLocation size={'3em'} />} */
        />
      </SimpleGrid>
    </Box>
  );
}