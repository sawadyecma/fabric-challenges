import { Button, Footer, Header, Menu, Text, Anchor, Main, Box } from "grommet";
import * as Icons from "grommet-icons";
import { GuiEditor } from "./GuiEditor";
import { Slider } from "./Slider";

export const App = () => {
  return (
    <div className="App">
      <Header background="brand">
        <Button icon={<Icons.Home />} hoverIndicator />
        <Menu label="account" items={[{ label: "logout" }]} />
      </Header>
      <Main pad="small">
        <Slider />
        <Box height="600px" width="600px">
          <GuiEditor />
        </Box>
      </Main>
      <Footer background="brand" pad="medium">
        <Text>Copyright</Text>
        <Anchor label="About" />
      </Footer>
    </div>
  );
};
