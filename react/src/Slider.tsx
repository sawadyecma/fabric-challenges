import { RangeInput } from "grommet";
import { useState } from "react";

export const Slider = () => {
  const [value, setValue] = useState(10);
  return (
    <RangeInput
      value={value}
      onChange={(event) => setValue(parseInt(event.target.value))}
    />
  );
};
