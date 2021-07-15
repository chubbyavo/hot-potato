import React from "react";

export type RefreshContextData = {
  refresh: boolean;
  triggerRefresh: () => void;
};

export const RefreshContext = React.createContext<RefreshContextData>({
  refresh: false,
  triggerRefresh: () => {
    return;
  },
});
