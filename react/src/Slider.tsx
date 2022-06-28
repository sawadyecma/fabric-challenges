import * as Icons from "grommet-icons";
import { Box, Button, RangeInput } from "grommet";

interface Props {
  min?: number;
  max?: number;
  onChange: (value: number) => void;
  value: number;
}

export const Slider = ({ min = 5, max = 25, value, onChange }: Props) => {
  return (
    <Box direction="row" align="center" gap="small">
      <Button
        plain={false}
        disabled={value <= min}
        icon={<Icons.Subtract color="neutral-2" />}
        onClick={() => {
          onChange(value - 1);
        }}
      />
      <Box align="center" width="small">
        <RangeInput
          min={min}
          max={max}
          step={1}
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value))}
        />
      </Box>
      <Button
        plain={false}
        disabled={value >= max}
        icon={<Icons.Add color="neutral-2" />}
        onClick={() => {
          onChange(value + 1);
        }}
      />
    </Box>
  );
};
