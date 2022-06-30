import { createContext, ReactNode, useContext, useReducer } from "react";

type State = {
  menuSelector?: {
    current: {
      placementId: string;
      name: string;
    };
    rect: {
      x: number;
      y: number;
      width: number;
      height: number;
    };
  };
};

const initialState: State = {};

type Action =
  | {
      type: "menuSelectorOpen";
      menuSelector: {
        current: {
          placementId: string;
          name: string;
        };
        rect: {
          x: number;
          y: number;
          width: number;
          height: number;
        };
      };
    }
  | {
      type: "menuSelectorMove";
      menuselector: {
        rect: {
          x: number;
          y: number;
          width: number;
          height: number;
        };
      };
    }
  | {
      type: "menuSelectorClose";
    };

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "menuSelectorOpen":
      return { ...state, menuSelector: action.menuSelector };
    case "menuSelectorMove":
      if (!state.menuSelector) {
        return state;
      }
      return {
        ...state,
        menuSelector: { ...state.menuSelector, rect: action.menuselector.rect },
      };
    case "menuSelectorClose":
      return {
        ...state,
        menuSelector: undefined,
      };
  }
};

const useContextValue = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return { state, dispatch };
};

const context = createContext<ReturnType<typeof useContextValue> | undefined>(
  undefined
);

export const GuiEditorProvider = ({ children }: { children: ReactNode }) => {
  return (
    <context.Provider value={useContextValue()}>{children}</context.Provider>
  );
};

export const useGuiEditor = () => {
  const contextValue = useContext(context);
  if (!contextValue) {
    throw new Error("Cannot use GuiEditor context.");
  }
  return contextValue;
};
