import { render } from "test/tamagui-setup-test";
import Typography from "ui/typography";

describe("Typography", () => {
  it("renders with text correctly", () => {
    const { getByText } = render(<Typography>Hello World</Typography>);
    const typographyElement = getByText("Hello World");
    expect(typographyElement).toBeDefined();
  });
});
