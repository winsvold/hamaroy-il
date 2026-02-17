"use client";
import { urlFor } from "@/sanity/lib/image";
import {
  Box,
  Dialog,
  Flex,
  Grid,
  IconButton,
  Image,
  RadioCard,
  Stack,
  VisuallyHidden,
  type FlexProps,
  type IconButtonProps,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Maximize,
  Minimize,
  X,
} from "react-feather";
import type { SessionSeries } from "../../sanity.types";

type Images = NonNullable<SessionSeries["images"]>;

export const ImageGallery = (props: {
  images?: Images;
  aspectRatio: number;
}) => {
  const [fullScreen, setFullScreen] = useState(false); // Store state in parent component to avoid flickering in fullscreen mode
  const [selectedImageIndex, setSelectedImageIndex] = useState(0); // Only store index so preview is responsive to changes in caption etc.
  const finalFocusRef = useRef<HTMLButtonElement>(null);
  const images = props.images?.filter((image) => !!image.asset); // Filter out images without asset to avoid errors

  if (!images?.length) return null;

  return (
    <>
      <Gallery
        images={images}
        fullScreen={false}
        toggleFullScreen={() => setFullScreen((s) => !s)}
        selectedImageIndex={selectedImageIndex}
        setSelectedImageIndex={setSelectedImageIndex}
        finalFocusRef={finalFocusRef}
        aspectRatio={props.aspectRatio}
      />
      {/* Prøvde å gjennbruke DialogLC, men ble mye stylingkrøll for å få til tiltenkt design da DialogLC har en del innebygde antagelser */}
      <Dialog.Root
        finalFocusEl={() => finalFocusRef.current}
        size="full"
        open={fullScreen}
        onOpenChange={() => setFullScreen((s) => !s)}
      >
        <Dialog.Positioner>
          <Dialog.Content background="blackAlpha.900" color="white">
            <Dialog.CloseTrigger asChild>
              <IconButton aria-label={"Lukk fullskjerm"}>
                <X />
              </IconButton>
            </Dialog.CloseTrigger>
            <Dialog.Body
              padding="3.5rem 0 5rem" // Allow space for close button
            >
              <Gallery
                images={images}
                fullScreen={true}
                toggleFullScreen={() => setFullScreen((s) => !s)}
                selectedImageIndex={selectedImageIndex}
                setSelectedImageIndex={setSelectedImageIndex}
                aspectRatio={props.aspectRatio}
              />
            </Dialog.Body>
          </Dialog.Content>
        </Dialog.Positioner>
      </Dialog.Root>
    </>
  );
};

const DefaultImageView = (props: {
  image: Images[number];
  hideCaption?: boolean;
  aspectRatio: number;
}) => {
  const resolution = 800;
  const width = resolution;
  const height = Math.round(resolution / props.aspectRatio);
  return (
    <Image
      width="100%"
      borderRadius="sm"
      alt=""
      src={urlFor(props.image).width(width).height(height).url()}
    />
  );
};

const FullScreenImageView = (props: { image: Images[number] }) => {
  const resolution = 800;
  return (
    <Grid
      height="75vmin"
      width="100vw"
      background="gray.800"
      placeItems="center"
      css={{
        "& img": {
          maxHeight: "75vmin",
          maxWidth: "100vw",
        },
      }}
    >
      <Image
        borderRadius="sm"
        alt=""
        src={urlFor(props.image).width(resolution).url()}
      />
    </Grid>
  );
};

const Gallery = (props: {
  images: Images;
  fullScreen: boolean;
  toggleFullScreen: () => void;
  selectedImageIndex: number;
  setSelectedImageIndex: (index: number) => void;
  finalFocusRef?: React.RefObject<HTMLButtonElement | null>;
  aspectRatio: number;
}) => {
  const severalImages = props.images.length > 1;
  const selectedImage = props.images.find(
    (_, i) => i === props.selectedImageIndex,
  );

  if (!selectedImage) return null;

  const firstImageIsSelected = props.selectedImageIndex <= 0;
  const lastImageIsSelected =
    props.selectedImageIndex >= props.images.length - 1;

  return (
    <Stack
      role="section"
      aria-label={`Bildegalleri, ${props.images.length} bilder`}
      alignItems={props.fullScreen ? "center" : undefined}
    >
      <VisuallyHidden>
        <Box aria-live="polite" aria-atomic="true">
          Viser bilde {props.selectedImageIndex + 1}
        </Box>
      </VisuallyHidden>
      <Box position="relative">
        {props.fullScreen ? (
          <FullScreenImageView image={selectedImage} />
        ) : (
          <DefaultImageView
            image={selectedImage}
            hideCaption
            aspectRatio={props.aspectRatio}
          />
        )}
        {severalImages && (
          <ChevronButton
            direction="left"
            onClick={() =>
              props.setSelectedImageIndex(
                firstImageIsSelected
                  ? props.images.length - 1
                  : props.selectedImageIndex - 1,
              )
            }
          />
        )}
        {severalImages && (
          <ChevronButton
            direction="right"
            onClick={() =>
              props.setSelectedImageIndex(
                lastImageIsSelected ? 0 : props.selectedImageIndex + 1,
              )
            }
          />
        )}
        <StyledIconButton
          ref={props.finalFocusRef}
          onClick={props.toggleFullScreen}
          aria-label={props.fullScreen ? "Lukk fullskjerm" : "Vis i fullskjerm"}
          bottom={{ base: ".25rem", sm: ".5rem" }}
          right={{ base: ".25rem", sm: ".5rem" }}
        >
          {props.fullScreen ? (
            <Minimize strokeWidth="2.4" />
          ) : (
            <Maximize strokeWidth="2.4" />
          )}
        </StyledIconButton>
      </Box>
      {severalImages && (
        <SelectImage
          images={props.images}
          selectedImageIndex={props.selectedImageIndex}
          setSelectedImageIndex={props.setSelectedImageIndex}
        />
      )}
    </Stack>
  );
};

type SelectImageProps = {
  images: Images;
  selectedImageIndex: number;
  setSelectedImageIndex: (index: number) => void;
} & FlexProps;

// Coding selector as radio's to allow for better accessibility (e.g. keyboard navigation and screen readers)
const SelectImage = ({
  images,
  selectedImageIndex,
  setSelectedImageIndex,
  ...flexProps
}: SelectImageProps) => {
  return (
    <RadioCard.Root
      value={selectedImageIndex.toString()}
      onValueChange={(event) => setSelectedImageIndex(Number(event.value))}
    >
      <VisuallyHidden>
        <RadioCard.Label>{"Velg bilde"}</RadioCard.Label>
      </VisuallyHidden>
      <Flex
        gap=".25rem"
        overflowX="auto"
        width="100%"
        padding=".1rem" // Allow space for checked-border (else it fill be hidden by overflow=auto)
        {...flexProps}
      >
        {images.map((image, index) => (
          <RadioCard.Item
            key={image._key}
            value={index.toString()}
            flexShrink="0"
            borderRadius="sm"
            overflow="hidden"
            cursor="pointer"
            filter="brightness(65%)"
            _checked={{ filter: "brightness(100%)" }}
            // _focus={{ border: `.2rem solid` }}
            minWidth={{ base: "4rem", sm: "5rem" }}
            maxWidth={{ base: "4rem", sm: "5rem" }}
            height={{ base: "4rem", sm: "5rem" }}
          >
            <RadioCard.ItemHiddenInput />
            <VisuallyHidden>
              <RadioCard.Label>Bilde {index + 1}</RadioCard.Label>
            </VisuallyHidden>
            <RadioCard.ItemControl padding={0}>
              <Image
                borderRadius="0"
                alt=""
                src={urlFor(image).width(200).height(200).url()}
              />
            </RadioCard.ItemControl>
          </RadioCard.Item>
        ))}
      </Flex>
    </RadioCard.Root>
  );
};

const ChevronButton = ({
  onClick,
  direction,
  ...iconButtonProps
}: { onClick: () => void; direction: "left" | "right" } & IconButtonProps) => {
  return (
    <StyledIconButton
      onClick={onClick}
      aria-label={direction === "right" ? "Neste" : "Forrige"}
      top="50%"
      transform="translateY(-50%)"
      {...{ [direction]: { base: ".25rem", sm: ".5rem" } }}
      {...iconButtonProps}
    >
      {direction === "right" ? (
        <ChevronRight strokeWidth="2.4" />
      ) : (
        <ChevronLeft strokeWidth="2.4" />
      )}
    </StyledIconButton>
  );
};

const StyledIconButton = (
  props: IconButtonProps & { ref?: React.Ref<HTMLButtonElement> },
) => (
  <IconButton
    size={{ base: "xs", sm: "sm" }}
    background="blackAlpha.600"
    _hover={{ background: "blackAlpha.800" }}
    color="white"
    position="absolute"
    {...props}
  />
);
