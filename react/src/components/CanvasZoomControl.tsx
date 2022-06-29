import { RefObject, useState } from "react";
import { Slider } from "../Slider";

interface Props {
  zoomCanvasRef: RefObject<{ zoom: (rate: number) => void } | undefined>;
}

export const CanvasZoomControl = ({ zoomCanvasRef }: Props) => {
  const [zoomRate, setZoomRate] = useState(0.8);
  const onZoomChange = (value: number) => {
    const rate = value / 10;
    setZoomRate(rate);
    console.log(rate);
    zoomCanvasRef.current?.zoom(rate);
  };

  return <Slider value={zoomRate * 10} onChange={onZoomChange} />;
};
