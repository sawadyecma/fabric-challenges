import {
  Button,
  Footer,
  Header,
  Menu,
  Text,
  Anchor,
  Main,
  Heading,
  Paragraph,
} from "grommet";
import * as Icons from "grommet-icons";
import { Slider } from "./Slider";

export const App = () => {
  return (
    <div className="App">
      <Header background="brand">
        <Button icon={<Icons.Home />} hoverIndicator />
        <Menu label="account" items={[{ label: "logout" }]} />
      </Header>
      <Main pad="large">
        <Heading>Something</Heading>
        <Paragraph>Something about something</Paragraph>
        <Slider />
      </Main>
      <Footer background="brand" pad="medium">
        <Text>Copyright</Text>
        <Anchor label="About" />
      </Footer>
    </div>
  );
};
