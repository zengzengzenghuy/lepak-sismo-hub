import { gql } from "graphql-request";
import { dataProviders } from "@group-generators/helpers/providers";
import { Tags, ValueType, GroupWithData } from "topics/group";
import {
  GenerationContext,
  GenerationFrequency,
  GroupGenerator,
} from "topics/group-generator";

const generator: GroupGenerator = {
  generationFrequency: GenerationFrequency.Weekly,

  generate: async (context: GenerationContext): Promise<GroupWithData[]> => {
    // This group is constituted by all the users who are in lepak lifestyle
    const subgraphHostedServiceProvider =
      new dataProviders.SubgraphHostedServiceProvider({
        url: "https://api.thegraph.com/subgraphs/name/zengzengzenghuy/lepaklifestylemember",
      });

    type members = {member_id: string,memberAddress:string,level:string};

    const lepakmember = await subgraphHostedServiceProvider.query<{
      members: members[];
    }>(
      gql`
    query getAllLepakMember{
        members {
        member_id
        memberAddress
        level
    } 
    }
      `
    );

    const fetchedData: { [address: string]: string } = {};

    for (const data of lepakmember.members) {
      // member Address to level
        fetchedData[data.memberAddress] =data.level ;
    }

    return [
      {
        name: "lepak-lifestyle-member",
        timestamp: context.timestamp,
        data: fetchedData,
        valueType: ValueType.Score,
        tags: [Tags.Lepak,Tags.User],
      },
    ];
  },
};

export default generator;
