"use client";

import { Drawer, Flex, IconButton } from "@chakra-ui/react";
import { usePathname } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import { Menu, X } from "react-feather";

type Props = {
  children: ReactNode;
  logo?: ReactNode;
};

export const MobileMenu = (props: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const pathName = usePathname();

  // Close the menu when the path changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathName]);

  return (
    <Drawer.Root open={isOpen} onOpenChange={(event) => setIsOpen(event.open)}>
      <Drawer.Trigger asChild>
        <IconButton
          variant="ghost"
          aria-label="Meny"
          color="onDark.base"
          hideFrom="lg"
        >
          <Menu />
        </IconButton>
      </Drawer.Trigger>
      <Drawer.Backdrop background="arctic.base/55" />
      <Drawer.Positioner>
        <Drawer.Content
          background="arctic.base"
          color="onDark.base"
          borderRadius="none"
        >
          <Drawer.Header
            borderBottom="1px solid"
            borderColor="onDark.secondary/30"
          >
            <Drawer.Title asChild>
              <Flex justify="space-between" align="center" gap="1rem">
                {props.logo}
                <IconButton
                  variant="ghost"
                  aria-label="Lukk meny"
                  color="onDark.base"
                  onClick={() => setIsOpen(false)}
                >
                  <X />
                </IconButton>
              </Flex>
            </Drawer.Title>
          </Drawer.Header>
          <Drawer.Body paddingY="1.5rem">{props.children}</Drawer.Body>
        </Drawer.Content>
      </Drawer.Positioner>
    </Drawer.Root>
  );
};
