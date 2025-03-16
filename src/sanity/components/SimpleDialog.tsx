import React, { useId } from "react";
import { Dialog, Box, Button } from "@sanity/ui";

type Props = {
  children: React.ReactNode;
  title: string;
};

export const SimpleDialog = (props: Props) => {
  const [open, setOpen] = React.useState(true);
  const id = useId();

  return (
    <>
      <Button onClick={() => setOpen(true)}>{props.title}</Button>
      {open && (
        <Dialog
          header={props.title}
          id={id}
          onClose={() => setOpen(false)}
          zOffset={1000}
        >
          <Box padding={4}>{props.children}</Box>
        </Dialog>
      )}
    </>
  );
};
