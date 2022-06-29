import { Button, Footer, Header, Menu, Text, Anchor, Main, Box } from "grommet";
import * as Icons from "grommet-icons";
import { GuiEditor } from "./components/Editor/GuiEditor";

export const App = () => {
  return (
    <div className="App">
      <Header background="brand">
        <Button icon={<Icons.Home />} hoverIndicator />
        <Menu label="account" items={[{ label: "logout" }]} />
      </Header>
      <Main pad="small">
        <Box height="700px" width="600px">
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
