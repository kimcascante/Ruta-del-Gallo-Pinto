import { useAccount } from "@starknet-react/core";

export const useDojo = () => {
  const { account } = useAccount();

  return {
    setup: {
      systemCalls: {
        spawn: () => {},
        move: () => {},
        collect_ingredient: () => {},
      },
      components: {
        Player: {},
        Position: {},
        Inventory: {},
      },
    },
    account: {
      account,
    },
  };
}; 