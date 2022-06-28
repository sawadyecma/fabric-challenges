import * as Icons from "grommet-icons";
import { Box, Button, RangeInput } from "grommet";
import { ChangeEvent, useState } from "react";

const min = 5;
const max = 25;

export const Slider = () => {
  const [value, setValue] = useState(10);

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(event.target.value);
    setValue(newValue);
  };

  return (
    <Box direction="row" align="center" gap="small">
      <Button
        plain={false}
        disabled={value <= min}
        icon={<Icons.Subtract color="neutral-2" />}
        onClick={() => {
          setValue((value) => value - 1);
        }}
      />
      <Box align="center" width="small">
        <RangeInput
          min={min}
          max={max}
          step={1}
          value={value}
          onChange={onChange}
        />
      </Box>
      <Button
        plain={false}
        disabled={value >= max}
        icon={<Icons.Add color="neutral-2" />}
        onClick={() => {
          setValue((value) => value + 1);
        }}
      />
    </Box>
  );
};
