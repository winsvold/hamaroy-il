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
    <Drawer.Root open={isOpen} onOpenChange={() => setIsOpen(!isOpen)}>
      <Drawer.Trigger>
        <IconButton variant="ghost" about="menu">
          <Menu />
        </IconButton>
      </Drawer.Trigger>
      <Drawer.Backdrop />
      <Drawer.Positioner>
        <Drawer.Content>
          <Drawer.CloseTrigger />
          <Drawer.Header>
            <Drawer.Title>
              <Flex justify="space-between" align="center">
                {props.logo}
                <IconButton
                  variant="ghost"
                  aria-label="Close menu"
                  onClick={() => setIsOpen(false)}
                >
                  <X />
                </IconButton>
              </Flex>
            </Drawer.Title>
          </Drawer.Header>
          <Drawer.Body>{props.children}</Drawer.Body>
        </Drawer.Content>
      </Drawer.Positioner>
    </Drawer.Root>
  );
};
