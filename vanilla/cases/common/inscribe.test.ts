import { calcInscribeRatio } from "./inscribe";

describe("calcInscribe", () => {
  it("case1", () => {
    expect(
      calcInscribeRatio(
        { width: 100, height: 200 },
        { width: 100, height: 200 }
      )
    ).toBe(1);
    expect(
      calcInscribeRatio(
        { width: 100, height: 200 },
        { width: 200, height: 400 }
      )
    ).toBe(0.5);
    expect(
      calcInscribeRatio(
        { width: 200, height: 100 },
        { width: 100, height: 200 }
      )
    ).toBe(0.5);
    expect(
      calcInscribeRatio(
        { width: 200, height: 200 },
        { width: 300, height: 300 }
      )
    ).toBe(2 / 3);
    expect(
      calcInscribeRatio(
        { width: 100, height: 200 },
        { width: 100, height: 200 }
      )
    ).toBe(1);
  });
});
