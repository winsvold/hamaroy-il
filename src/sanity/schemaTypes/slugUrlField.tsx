import { Stack, Text } from "@sanity/ui";
import { ObjectFieldProps, SlugValue } from "sanity";

/** Viser adressen url-segmentet gir, under selve feltet */
export const slugUrlField = (path: string) => {
  const SlugUrlField = (props: ObjectFieldProps<SlugValue>) => (
    <Stack space={3}>
      {props.renderDefault(props)}
      <Text size={1} muted>
        {`URL: https://hamaroyil.no/${path}/${props.value?.current ?? "din-verdi-her"}`}
      </Text>
    </Stack>
  );
  return SlugUrlField;
};
