import { StudioComponentsPluginOptions } from "sanity";

export const StudioLayout: StudioComponentsPluginOptions["layout"] = (
  props,
) => {
  return (
    <>
      {/* <StudioCSSOverrides /> */}
      {props.renderDefault(props)}
    </>
  );
};
