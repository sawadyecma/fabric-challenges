export function calcInscribeRatio(
  frame: { width: number; height: number },
  target: { width: number; height: number }
) {
  const wRatio = frame.width / target.width;
  const hRatio = frame.height / target.height;

  if (wRatio > hRatio) {
    return hRatio;
  }

  return wRatio;
}
