/**
 * ---------------------------------------------------------------------------------
 * This file has been generated by Sanity TypeGen.
 * Command: `sanity typegen generate`
 *
 * Any modifications made directly to this file will be overwritten the next time
 * the TypeScript definitions are generated. Please make changes to the Sanity
 * schema definitions and/or GROQ queries if you need to update these types.
 *
 * For more information on how to use Sanity TypeGen, visit the official documentation:
 * https://www.sanity.io/docs/sanity-typegen
 * ---------------------------------------------------------------------------------
 */

// Source: schema.json
export type SanityImagePaletteSwatch = {
  _type: "sanity.imagePaletteSwatch";
  background?: string;
  foreground?: string;
  population?: number;
  title?: string;
};

export type SanityImagePalette = {
  _type: "sanity.imagePalette";
  darkMuted?: SanityImagePaletteSwatch;
  lightVibrant?: SanityImagePaletteSwatch;
  darkVibrant?: SanityImagePaletteSwatch;
  vibrant?: SanityImagePaletteSwatch;
  dominant?: SanityImagePaletteSwatch;
  lightMuted?: SanityImagePaletteSwatch;
  muted?: SanityImagePaletteSwatch;
};

export type SanityImageDimensions = {
  _type: "sanity.imageDimensions";
  height?: number;
  width?: number;
  aspectRatio?: number;
};

export type SanityFileAsset = {
  _id: string;
  _type: "sanity.fileAsset";
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
  originalFilename?: string;
  label?: string;
  title?: string;
  description?: string;
  altText?: string;
  sha1hash?: string;
  extension?: string;
  mimeType?: string;
  size?: number;
  assetId?: string;
  uploadId?: string;
  path?: string;
  url?: string;
  source?: SanityAssetSourceData;
};

export type Geopoint = {
  _type: "geopoint";
  lat?: number;
  lng?: number;
  alt?: number;
};

export type Club = {
  _id: string;
  _type: "club";
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
  name?: string;
  images?: Array<{
    asset?: {
      _ref: string;
      _type: "reference";
      _weak?: boolean;
      [internalGroqTypeReferenceTo]?: "sanity.imageAsset";
    };
    hotspot?: SanityImageHotspot;
    crop?: SanityImageCrop;
    _type: "image";
    _key: string;
  }>;
  managers?: Array<{
    person?: {
      _ref: string;
      _type: "reference";
      _weak?: boolean;
      [internalGroqTypeReferenceTo]?: "person";
    };
    role?: string;
    _key: string;
  }>;
  body?: Array<{
    children?: Array<{
      marks?: Array<string>;
      text?: string;
      _type: "span";
      _key: string;
    }>;
    style?: "normal" | "h2";
    listItem?: "bullet" | "number";
    markDefs?: Array<{
      href?: string;
      _type: "link";
      _key: string;
    }>;
    level?: number;
    _type: "block";
    _key: string;
  }>;
  slug?: Slug;
};

export type InfoPage = {
  _id: string;
  _type: "infoPage";
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
  title?: string;
  body?: Array<{
    children?: Array<{
      marks?: Array<string>;
      text?: string;
      _type: "span";
      _key: string;
    }>;
    style?: "normal" | "h2";
    listItem?: "bullet" | "number";
    markDefs?: Array<{
      href?: string;
      _type: "link";
      _key: string;
    }>;
    level?: number;
    _type: "block";
    _key: string;
  }>;
  slug?: Slug;
};

export type Person = {
  _id: string;
  _type: "person";
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
  name?: string;
  email?: string;
  phone?: string;
  image?: {
    asset?: {
      _ref: string;
      _type: "reference";
      _weak?: boolean;
      [internalGroqTypeReferenceTo]?: "sanity.imageAsset";
    };
    hotspot?: SanityImageHotspot;
    crop?: SanityImageCrop;
    _type: "image";
  };
};

export type SessionSeries = {
  _id: string;
  _type: "sessionSeries";
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
  title?: string;
  sessions?: Array<
    {
      _key: string;
    } & Session
  >;
  body?: Array<{
    children?: Array<{
      marks?: Array<string>;
      text?: string;
      _type: "span";
      _key: string;
    }>;
    style?: "normal" | "h2";
    listItem?: "bullet" | "number";
    markDefs?: Array<{
      href?: string;
      _type: "link";
      _key: string;
    }>;
    level?: number;
    _type: "block";
    _key: string;
  }>;
  organizers?: Array<
    | {
        _ref: string;
        _type: "reference";
        _weak?: boolean;
        [internalGroqTypeReferenceTo]?: "person";
      }
    | {
        _ref: string;
        _type: "reference";
        _weak?: boolean;
        [internalGroqTypeReferenceTo]?: "club";
      }
  >;
  location?: {
    _ref: string;
    _type: "reference";
    _weak?: boolean;
    [internalGroqTypeReferenceTo]?: "location";
  };
  paymentInfo?: PaymentInfo;
  images?: Array<{
    asset?: {
      _ref: string;
      _type: "reference";
      _weak?: boolean;
      [internalGroqTypeReferenceTo]?: "sanity.imageAsset";
    };
    hotspot?: SanityImageHotspot;
    crop?: SanityImageCrop;
    _type: "image";
    _key: string;
  }>;
  slug?: Slug;
};

export type Session = {
  _type: "session";
  startsAt?: string;
  duration?: {
    hours?: number;
    minutes?: number;
  };
};

export type Event = {
  _id: string;
  _type: "event";
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
  title?: string;
  body?: Array<{
    children?: Array<{
      marks?: Array<string>;
      text?: string;
      _type: "span";
      _key: string;
    }>;
    style?: "normal" | "h2";
    listItem?: "bullet" | "number";
    markDefs?: Array<{
      href?: string;
      _type: "link";
      _key: string;
    }>;
    level?: number;
    _type: "block";
    _key: string;
  }>;
  startsAt?: string;
  endsAt?: string;
  location?: {
    _ref: string;
    _type: "reference";
    _weak?: boolean;
    [internalGroqTypeReferenceTo]?: "location";
  };
  organizers?: Array<
    | {
        _ref: string;
        _type: "reference";
        _weak?: boolean;
        [internalGroqTypeReferenceTo]?: "person";
      }
    | {
        _ref: string;
        _type: "reference";
        _weak?: boolean;
        [internalGroqTypeReferenceTo]?: "club";
      }
  >;
  paymentInfo?: PaymentInfo;
  images?: Array<{
    asset?: {
      _ref: string;
      _type: "reference";
      _weak?: boolean;
      [internalGroqTypeReferenceTo]?: "sanity.imageAsset";
    };
    hotspot?: SanityImageHotspot;
    crop?: SanityImageCrop;
    _type: "image";
    _key: string;
  }>;
};

export type PaymentInfo = {
  _type: "paymentInfo";
  body?: Array<{
    children?: Array<{
      marks?: Array<string>;
      text?: string;
      _type: "span";
      _key: string;
    }>;
    style?: "normal";
    listItem?: "bullet" | "number";
    markDefs?: Array<{
      href?: string;
      _type: "link";
      _key: string;
    }>;
    level?: number;
    _type: "block";
    _key: string;
  }>;
  vippsNumber?: string;
  url?: string;
};

export type Location = {
  _id: string;
  _type: "location";
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
  name?: string;
  images?: Array<{
    asset?: {
      _ref: string;
      _type: "reference";
      _weak?: boolean;
      [internalGroqTypeReferenceTo]?: "sanity.imageAsset";
    };
    hotspot?: SanityImageHotspot;
    crop?: SanityImageCrop;
    _type: "image";
    _key: string;
  }>;
  parent?: {
    _ref: string;
    _type: "reference";
    _weak?: boolean;
    [internalGroqTypeReferenceTo]?: "location";
  };
  address?: string;
  zip?: string;
  city?: string;
  body?: Array<{
    children?: Array<{
      marks?: Array<string>;
      text?: string;
      _type: "span";
      _key: string;
    }>;
    style?: "normal" | "h2";
    listItem?: "bullet" | "number";
    markDefs?: Array<{
      href?: string;
      _type: "link";
      _key: string;
    }>;
    level?: number;
    _type: "block";
    _key: string;
  }>;
  slug?: Slug;
};

export type Slug = {
  _type: "slug";
  current?: string;
  source?: string;
};

export type SiteSettings = {
  _id: string;
  _type: "siteSettings";
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
  logo?: {
    asset?: {
      _ref: string;
      _type: "reference";
      _weak?: boolean;
      [internalGroqTypeReferenceTo]?: "sanity.imageAsset";
    };
    hotspot?: SanityImageHotspot;
    crop?: SanityImageCrop;
    _type: "image";
  };
  intro?: Array<{
    children?: Array<{
      marks?: Array<string>;
      text?: string;
      _type: "span";
      _key: string;
    }>;
    style?: "normal" | "h2";
    listItem?: "bullet" | "number";
    markDefs?: Array<{
      href?: string;
      _type: "link";
      _key: string;
    }>;
    level?: number;
    _type: "block";
    _key: string;
  }>;
};

export type SanityImageCrop = {
  _type: "sanity.imageCrop";
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
};

export type SanityImageHotspot = {
  _type: "sanity.imageHotspot";
  x?: number;
  y?: number;
  height?: number;
  width?: number;
};

export type SanityImageAsset = {
  _id: string;
  _type: "sanity.imageAsset";
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
  originalFilename?: string;
  label?: string;
  title?: string;
  description?: string;
  altText?: string;
  sha1hash?: string;
  extension?: string;
  mimeType?: string;
  size?: number;
  assetId?: string;
  uploadId?: string;
  path?: string;
  url?: string;
  metadata?: SanityImageMetadata;
  source?: SanityAssetSourceData;
};

export type SanityAssetSourceData = {
  _type: "sanity.assetSourceData";
  name?: string;
  id?: string;
  url?: string;
};

export type SanityImageMetadata = {
  _type: "sanity.imageMetadata";
  location?: Geopoint;
  dimensions?: SanityImageDimensions;
  palette?: SanityImagePalette;
  lqip?: string;
  blurHash?: string;
  hasAlpha?: boolean;
  isOpaque?: boolean;
};

export type AllSanitySchemaTypes =
  | SanityImagePaletteSwatch
  | SanityImagePalette
  | SanityImageDimensions
  | SanityFileAsset
  | Geopoint
  | Club
  | InfoPage
  | Person
  | SessionSeries
  | Session
  | Event
  | PaymentInfo
  | Location
  | Slug
  | SiteSettings
  | SanityImageCrop
  | SanityImageHotspot
  | SanityImageAsset
  | SanityAssetSourceData
  | SanityImageMetadata;
export declare const internalGroqTypeReferenceTo: unique symbol;
// Source: ./src/app/(frontend)/aktiviteter/[slug]/page.tsx
// Variable: aktivitetQuery
// Query: *[_type in ["sessionSeries", "event"] && (slug.current == $slug || _id == $slug)][0]{  ...,  location->,  organizers[]->,}
export type AktivitetQueryResult =
  | {
      _id: string;
      _type: "event";
      _createdAt: string;
      _updatedAt: string;
      _rev: string;
      title?: string;
      body?: Array<{
        children?: Array<{
          marks?: Array<string>;
          text?: string;
          _type: "span";
          _key: string;
        }>;
        style?: "h2" | "normal";
        listItem?: "bullet" | "number";
        markDefs?: Array<{
          href?: string;
          _type: "link";
          _key: string;
        }>;
        level?: number;
        _type: "block";
        _key: string;
      }>;
      startsAt?: string;
      endsAt?: string;
      location: {
        _id: string;
        _type: "location";
        _createdAt: string;
        _updatedAt: string;
        _rev: string;
        name?: string;
        images?: Array<{
          asset?: {
            _ref: string;
            _type: "reference";
            _weak?: boolean;
            [internalGroqTypeReferenceTo]?: "sanity.imageAsset";
          };
          hotspot?: SanityImageHotspot;
          crop?: SanityImageCrop;
          _type: "image";
          _key: string;
        }>;
        parent?: {
          _ref: string;
          _type: "reference";
          _weak?: boolean;
          [internalGroqTypeReferenceTo]?: "location";
        };
        address?: string;
        zip?: string;
        city?: string;
        body?: Array<{
          children?: Array<{
            marks?: Array<string>;
            text?: string;
            _type: "span";
            _key: string;
          }>;
          style?: "h2" | "normal";
          listItem?: "bullet" | "number";
          markDefs?: Array<{
            href?: string;
            _type: "link";
            _key: string;
          }>;
          level?: number;
          _type: "block";
          _key: string;
        }>;
        slug?: Slug;
      } | null;
      organizers: Array<
        | {
            _id: string;
            _type: "club";
            _createdAt: string;
            _updatedAt: string;
            _rev: string;
            name?: string;
            images?: Array<{
              asset?: {
                _ref: string;
                _type: "reference";
                _weak?: boolean;
                [internalGroqTypeReferenceTo]?: "sanity.imageAsset";
              };
              hotspot?: SanityImageHotspot;
              crop?: SanityImageCrop;
              _type: "image";
              _key: string;
            }>;
            managers?: Array<{
              person?: {
                _ref: string;
                _type: "reference";
                _weak?: boolean;
                [internalGroqTypeReferenceTo]?: "person";
              };
              role?: string;
              _key: string;
            }>;
            body?: Array<{
              children?: Array<{
                marks?: Array<string>;
                text?: string;
                _type: "span";
                _key: string;
              }>;
              style?: "h2" | "normal";
              listItem?: "bullet" | "number";
              markDefs?: Array<{
                href?: string;
                _type: "link";
                _key: string;
              }>;
              level?: number;
              _type: "block";
              _key: string;
            }>;
            slug?: Slug;
          }
        | {
            _id: string;
            _type: "person";
            _createdAt: string;
            _updatedAt: string;
            _rev: string;
            name?: string;
            email?: string;
            phone?: string;
            image?: {
              asset?: {
                _ref: string;
                _type: "reference";
                _weak?: boolean;
                [internalGroqTypeReferenceTo]?: "sanity.imageAsset";
              };
              hotspot?: SanityImageHotspot;
              crop?: SanityImageCrop;
              _type: "image";
            };
          }
      > | null;
      paymentInfo?: PaymentInfo;
      images?: Array<{
        asset?: {
          _ref: string;
          _type: "reference";
          _weak?: boolean;
          [internalGroqTypeReferenceTo]?: "sanity.imageAsset";
        };
        hotspot?: SanityImageHotspot;
        crop?: SanityImageCrop;
        _type: "image";
        _key: string;
      }>;
    }
  | {
      _id: string;
      _type: "sessionSeries";
      _createdAt: string;
      _updatedAt: string;
      _rev: string;
      title?: string;
      sessions?: Array<
        {
          _key: string;
        } & Session
      >;
      body?: Array<{
        children?: Array<{
          marks?: Array<string>;
          text?: string;
          _type: "span";
          _key: string;
        }>;
        style?: "h2" | "normal";
        listItem?: "bullet" | "number";
        markDefs?: Array<{
          href?: string;
          _type: "link";
          _key: string;
        }>;
        level?: number;
        _type: "block";
        _key: string;
      }>;
      organizers: Array<
        | {
            _id: string;
            _type: "club";
            _createdAt: string;
            _updatedAt: string;
            _rev: string;
            name?: string;
            images?: Array<{
              asset?: {
                _ref: string;
                _type: "reference";
                _weak?: boolean;
                [internalGroqTypeReferenceTo]?: "sanity.imageAsset";
              };
              hotspot?: SanityImageHotspot;
              crop?: SanityImageCrop;
              _type: "image";
              _key: string;
            }>;
            managers?: Array<{
              person?: {
                _ref: string;
                _type: "reference";
                _weak?: boolean;
                [internalGroqTypeReferenceTo]?: "person";
              };
              role?: string;
              _key: string;
            }>;
            body?: Array<{
              children?: Array<{
                marks?: Array<string>;
                text?: string;
                _type: "span";
                _key: string;
              }>;
              style?: "h2" | "normal";
              listItem?: "bullet" | "number";
              markDefs?: Array<{
                href?: string;
                _type: "link";
                _key: string;
              }>;
              level?: number;
              _type: "block";
              _key: string;
            }>;
            slug?: Slug;
          }
        | {
            _id: string;
            _type: "person";
            _createdAt: string;
            _updatedAt: string;
            _rev: string;
            name?: string;
            email?: string;
            phone?: string;
            image?: {
              asset?: {
                _ref: string;
                _type: "reference";
                _weak?: boolean;
                [internalGroqTypeReferenceTo]?: "sanity.imageAsset";
              };
              hotspot?: SanityImageHotspot;
              crop?: SanityImageCrop;
              _type: "image";
            };
          }
      > | null;
      location: {
        _id: string;
        _type: "location";
        _createdAt: string;
        _updatedAt: string;
        _rev: string;
        name?: string;
        images?: Array<{
          asset?: {
            _ref: string;
            _type: "reference";
            _weak?: boolean;
            [internalGroqTypeReferenceTo]?: "sanity.imageAsset";
          };
          hotspot?: SanityImageHotspot;
          crop?: SanityImageCrop;
          _type: "image";
          _key: string;
        }>;
        parent?: {
          _ref: string;
          _type: "reference";
          _weak?: boolean;
          [internalGroqTypeReferenceTo]?: "location";
        };
        address?: string;
        zip?: string;
        city?: string;
        body?: Array<{
          children?: Array<{
            marks?: Array<string>;
            text?: string;
            _type: "span";
            _key: string;
          }>;
          style?: "h2" | "normal";
          listItem?: "bullet" | "number";
          markDefs?: Array<{
            href?: string;
            _type: "link";
            _key: string;
          }>;
          level?: number;
          _type: "block";
          _key: string;
        }>;
        slug?: Slug;
      } | null;
      paymentInfo?: PaymentInfo;
      images?: Array<{
        asset?: {
          _ref: string;
          _type: "reference";
          _weak?: boolean;
          [internalGroqTypeReferenceTo]?: "sanity.imageAsset";
        };
        hotspot?: SanityImageHotspot;
        crop?: SanityImageCrop;
        _type: "image";
        _key: string;
      }>;
      slug?: Slug;
    }
  | null;

// Source: ./src/app/(frontend)/components/activities.tsx
// Variable: activitiesQuery
// Query: {  "eventsAndSessionSeries": *[    _type in ["sessionSeries", "event"] &&     (!defined($seriesId) || _id == $seriesId) &&     (!defined($locationId) || location._ref == $locationId) &&    (!defined($clubId) || references($clubId))  ]  {    ...,    location->,    organizers[]->,  },}
export type ActivitiesQueryResult = {
  eventsAndSessionSeries: Array<
    | {
        _id: string;
        _type: "event";
        _createdAt: string;
        _updatedAt: string;
        _rev: string;
        title?: string;
        body?: Array<{
          children?: Array<{
            marks?: Array<string>;
            text?: string;
            _type: "span";
            _key: string;
          }>;
          style?: "h2" | "normal";
          listItem?: "bullet" | "number";
          markDefs?: Array<{
            href?: string;
            _type: "link";
            _key: string;
          }>;
          level?: number;
          _type: "block";
          _key: string;
        }>;
        startsAt?: string;
        endsAt?: string;
        location: {
          _id: string;
          _type: "location";
          _createdAt: string;
          _updatedAt: string;
          _rev: string;
          name?: string;
          images?: Array<{
            asset?: {
              _ref: string;
              _type: "reference";
              _weak?: boolean;
              [internalGroqTypeReferenceTo]?: "sanity.imageAsset";
            };
            hotspot?: SanityImageHotspot;
            crop?: SanityImageCrop;
            _type: "image";
            _key: string;
          }>;
          parent?: {
            _ref: string;
            _type: "reference";
            _weak?: boolean;
            [internalGroqTypeReferenceTo]?: "location";
          };
          address?: string;
          zip?: string;
          city?: string;
          body?: Array<{
            children?: Array<{
              marks?: Array<string>;
              text?: string;
              _type: "span";
              _key: string;
            }>;
            style?: "h2" | "normal";
            listItem?: "bullet" | "number";
            markDefs?: Array<{
              href?: string;
              _type: "link";
              _key: string;
            }>;
            level?: number;
            _type: "block";
            _key: string;
          }>;
          slug?: Slug;
        } | null;
        organizers: Array<
          | {
              _id: string;
              _type: "club";
              _createdAt: string;
              _updatedAt: string;
              _rev: string;
              name?: string;
              images?: Array<{
                asset?: {
                  _ref: string;
                  _type: "reference";
                  _weak?: boolean;
                  [internalGroqTypeReferenceTo]?: "sanity.imageAsset";
                };
                hotspot?: SanityImageHotspot;
                crop?: SanityImageCrop;
                _type: "image";
                _key: string;
              }>;
              managers?: Array<{
                person?: {
                  _ref: string;
                  _type: "reference";
                  _weak?: boolean;
                  [internalGroqTypeReferenceTo]?: "person";
                };
                role?: string;
                _key: string;
              }>;
              body?: Array<{
                children?: Array<{
                  marks?: Array<string>;
                  text?: string;
                  _type: "span";
                  _key: string;
                }>;
                style?: "h2" | "normal";
                listItem?: "bullet" | "number";
                markDefs?: Array<{
                  href?: string;
                  _type: "link";
                  _key: string;
                }>;
                level?: number;
                _type: "block";
                _key: string;
              }>;
              slug?: Slug;
            }
          | {
              _id: string;
              _type: "person";
              _createdAt: string;
              _updatedAt: string;
              _rev: string;
              name?: string;
              email?: string;
              phone?: string;
              image?: {
                asset?: {
                  _ref: string;
                  _type: "reference";
                  _weak?: boolean;
                  [internalGroqTypeReferenceTo]?: "sanity.imageAsset";
                };
                hotspot?: SanityImageHotspot;
                crop?: SanityImageCrop;
                _type: "image";
              };
            }
        > | null;
        paymentInfo?: PaymentInfo;
        images?: Array<{
          asset?: {
            _ref: string;
            _type: "reference";
            _weak?: boolean;
            [internalGroqTypeReferenceTo]?: "sanity.imageAsset";
          };
          hotspot?: SanityImageHotspot;
          crop?: SanityImageCrop;
          _type: "image";
          _key: string;
        }>;
      }
    | {
        _id: string;
        _type: "sessionSeries";
        _createdAt: string;
        _updatedAt: string;
        _rev: string;
        title?: string;
        sessions?: Array<
          {
            _key: string;
          } & Session
        >;
        body?: Array<{
          children?: Array<{
            marks?: Array<string>;
            text?: string;
            _type: "span";
            _key: string;
          }>;
          style?: "h2" | "normal";
          listItem?: "bullet" | "number";
          markDefs?: Array<{
            href?: string;
            _type: "link";
            _key: string;
          }>;
          level?: number;
          _type: "block";
          _key: string;
        }>;
        organizers: Array<
          | {
              _id: string;
              _type: "club";
              _createdAt: string;
              _updatedAt: string;
              _rev: string;
              name?: string;
              images?: Array<{
                asset?: {
                  _ref: string;
                  _type: "reference";
                  _weak?: boolean;
                  [internalGroqTypeReferenceTo]?: "sanity.imageAsset";
                };
                hotspot?: SanityImageHotspot;
                crop?: SanityImageCrop;
                _type: "image";
                _key: string;
              }>;
              managers?: Array<{
                person?: {
                  _ref: string;
                  _type: "reference";
                  _weak?: boolean;
                  [internalGroqTypeReferenceTo]?: "person";
                };
                role?: string;
                _key: string;
              }>;
              body?: Array<{
                children?: Array<{
                  marks?: Array<string>;
                  text?: string;
                  _type: "span";
                  _key: string;
                }>;
                style?: "h2" | "normal";
                listItem?: "bullet" | "number";
                markDefs?: Array<{
                  href?: string;
                  _type: "link";
                  _key: string;
                }>;
                level?: number;
                _type: "block";
                _key: string;
              }>;
              slug?: Slug;
            }
          | {
              _id: string;
              _type: "person";
              _createdAt: string;
              _updatedAt: string;
              _rev: string;
              name?: string;
              email?: string;
              phone?: string;
              image?: {
                asset?: {
                  _ref: string;
                  _type: "reference";
                  _weak?: boolean;
                  [internalGroqTypeReferenceTo]?: "sanity.imageAsset";
                };
                hotspot?: SanityImageHotspot;
                crop?: SanityImageCrop;
                _type: "image";
              };
            }
        > | null;
        location: {
          _id: string;
          _type: "location";
          _createdAt: string;
          _updatedAt: string;
          _rev: string;
          name?: string;
          images?: Array<{
            asset?: {
              _ref: string;
              _type: "reference";
              _weak?: boolean;
              [internalGroqTypeReferenceTo]?: "sanity.imageAsset";
            };
            hotspot?: SanityImageHotspot;
            crop?: SanityImageCrop;
            _type: "image";
            _key: string;
          }>;
          parent?: {
            _ref: string;
            _type: "reference";
            _weak?: boolean;
            [internalGroqTypeReferenceTo]?: "location";
          };
          address?: string;
          zip?: string;
          city?: string;
          body?: Array<{
            children?: Array<{
              marks?: Array<string>;
              text?: string;
              _type: "span";
              _key: string;
            }>;
            style?: "h2" | "normal";
            listItem?: "bullet" | "number";
            markDefs?: Array<{
              href?: string;
              _type: "link";
              _key: string;
            }>;
            level?: number;
            _type: "block";
            _key: string;
          }>;
          slug?: Slug;
        } | null;
        paymentInfo?: PaymentInfo;
        images?: Array<{
          asset?: {
            _ref: string;
            _type: "reference";
            _weak?: boolean;
            [internalGroqTypeReferenceTo]?: "sanity.imageAsset";
          };
          hotspot?: SanityImageHotspot;
          crop?: SanityImageCrop;
          _type: "image";
          _key: string;
        }>;
        slug?: Slug;
      }
  >;
};

// Source: ./src/app/(frontend)/info/[slug]/page.tsx
// Variable: infoPageQuery
// Query: *[_type == "infoPage" && slug.current == $slug][0]
export type InfoPageQueryResult = {
  _id: string;
  _type: "infoPage";
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
  title?: string;
  body?: Array<{
    children?: Array<{
      marks?: Array<string>;
      text?: string;
      _type: "span";
      _key: string;
    }>;
    style?: "h2" | "normal";
    listItem?: "bullet" | "number";
    markDefs?: Array<{
      href?: string;
      _type: "link";
      _key: string;
    }>;
    level?: number;
    _type: "block";
    _key: string;
  }>;
  slug?: Slug;
} | null;

// Source: ./src/app/(frontend)/klubber/[slug]/page.tsx
// Variable: clubPageQuery
// Query: *[_type == "club" && slug.current == $slug][0] {    ...,    managers[] {      ...,      person->    }  }
export type ClubPageQueryResult = {
  _id: string;
  _type: "club";
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
  name?: string;
  images?: Array<{
    asset?: {
      _ref: string;
      _type: "reference";
      _weak?: boolean;
      [internalGroqTypeReferenceTo]?: "sanity.imageAsset";
    };
    hotspot?: SanityImageHotspot;
    crop?: SanityImageCrop;
    _type: "image";
    _key: string;
  }>;
  managers: Array<{
    person: {
      _id: string;
      _type: "person";
      _createdAt: string;
      _updatedAt: string;
      _rev: string;
      name?: string;
      email?: string;
      phone?: string;
      image?: {
        asset?: {
          _ref: string;
          _type: "reference";
          _weak?: boolean;
          [internalGroqTypeReferenceTo]?: "sanity.imageAsset";
        };
        hotspot?: SanityImageHotspot;
        crop?: SanityImageCrop;
        _type: "image";
      };
    } | null;
    role?: string;
    _key: string;
  }> | null;
  body?: Array<{
    children?: Array<{
      marks?: Array<string>;
      text?: string;
      _type: "span";
      _key: string;
    }>;
    style?: "h2" | "normal";
    listItem?: "bullet" | "number";
    markDefs?: Array<{
      href?: string;
      _type: "link";
      _key: string;
    }>;
    level?: number;
    _type: "block";
    _key: string;
  }>;
  slug?: Slug;
} | null;

// Source: ./src/app/(frontend)/layout/Header.tsx
// Variable: headerQuery
// Query: {  "siteSettings": *[_type == "siteSettings"][0],  "infoPages": *[_type == "infoPage"],  "clubs": *[_type == "club"]}
export type HeaderQueryResult = {
  siteSettings: {
    _id: string;
    _type: "siteSettings";
    _createdAt: string;
    _updatedAt: string;
    _rev: string;
    logo?: {
      asset?: {
        _ref: string;
        _type: "reference";
        _weak?: boolean;
        [internalGroqTypeReferenceTo]?: "sanity.imageAsset";
      };
      hotspot?: SanityImageHotspot;
      crop?: SanityImageCrop;
      _type: "image";
    };
    intro?: Array<{
      children?: Array<{
        marks?: Array<string>;
        text?: string;
        _type: "span";
        _key: string;
      }>;
      style?: "h2" | "normal";
      listItem?: "bullet" | "number";
      markDefs?: Array<{
        href?: string;
        _type: "link";
        _key: string;
      }>;
      level?: number;
      _type: "block";
      _key: string;
    }>;
  } | null;
  infoPages: Array<{
    _id: string;
    _type: "infoPage";
    _createdAt: string;
    _updatedAt: string;
    _rev: string;
    title?: string;
    body?: Array<{
      children?: Array<{
        marks?: Array<string>;
        text?: string;
        _type: "span";
        _key: string;
      }>;
      style?: "h2" | "normal";
      listItem?: "bullet" | "number";
      markDefs?: Array<{
        href?: string;
        _type: "link";
        _key: string;
      }>;
      level?: number;
      _type: "block";
      _key: string;
    }>;
    slug?: Slug;
  }>;
  clubs: Array<{
    _id: string;
    _type: "club";
    _createdAt: string;
    _updatedAt: string;
    _rev: string;
    name?: string;
    images?: Array<{
      asset?: {
        _ref: string;
        _type: "reference";
        _weak?: boolean;
        [internalGroqTypeReferenceTo]?: "sanity.imageAsset";
      };
      hotspot?: SanityImageHotspot;
      crop?: SanityImageCrop;
      _type: "image";
      _key: string;
    }>;
    managers?: Array<{
      person?: {
        _ref: string;
        _type: "reference";
        _weak?: boolean;
        [internalGroqTypeReferenceTo]?: "person";
      };
      role?: string;
      _key: string;
    }>;
    body?: Array<{
      children?: Array<{
        marks?: Array<string>;
        text?: string;
        _type: "span";
        _key: string;
      }>;
      style?: "h2" | "normal";
      listItem?: "bullet" | "number";
      markDefs?: Array<{
        href?: string;
        _type: "link";
        _key: string;
      }>;
      level?: number;
      _type: "block";
      _key: string;
    }>;
    slug?: Slug;
  }>;
};

// Source: ./src/app/(frontend)/lokaler/[slug]/page.tsx
// Variable: lokasjonQuery
// Query: *[_type == "location" && slug.current == $slug][0]{  ...,}
export type LokasjonQueryResult = {
  _id: string;
  _type: "location";
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
  name?: string;
  images?: Array<{
    asset?: {
      _ref: string;
      _type: "reference";
      _weak?: boolean;
      [internalGroqTypeReferenceTo]?: "sanity.imageAsset";
    };
    hotspot?: SanityImageHotspot;
    crop?: SanityImageCrop;
    _type: "image";
    _key: string;
  }>;
  parent?: {
    _ref: string;
    _type: "reference";
    _weak?: boolean;
    [internalGroqTypeReferenceTo]?: "location";
  };
  address?: string;
  zip?: string;
  city?: string;
  body?: Array<{
    children?: Array<{
      marks?: Array<string>;
      text?: string;
      _type: "span";
      _key: string;
    }>;
    style?: "h2" | "normal";
    listItem?: "bullet" | "number";
    markDefs?: Array<{
      href?: string;
      _type: "link";
      _key: string;
    }>;
    level?: number;
    _type: "block";
    _key: string;
  }>;
  slug?: Slug;
} | null;

// Source: ./src/app/(frontend)/lokaler/page.tsx
// Variable: locationsQuery
// Query: *[_type == "location"]
export type LocationsQueryResult = Array<{
  _id: string;
  _type: "location";
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
  name?: string;
  images?: Array<{
    asset?: {
      _ref: string;
      _type: "reference";
      _weak?: boolean;
      [internalGroqTypeReferenceTo]?: "sanity.imageAsset";
    };
    hotspot?: SanityImageHotspot;
    crop?: SanityImageCrop;
    _type: "image";
    _key: string;
  }>;
  parent?: {
    _ref: string;
    _type: "reference";
    _weak?: boolean;
    [internalGroqTypeReferenceTo]?: "location";
  };
  address?: string;
  zip?: string;
  city?: string;
  body?: Array<{
    children?: Array<{
      marks?: Array<string>;
      text?: string;
      _type: "span";
      _key: string;
    }>;
    style?: "h2" | "normal";
    listItem?: "bullet" | "number";
    markDefs?: Array<{
      href?: string;
      _type: "link";
      _key: string;
    }>;
    level?: number;
    _type: "block";
    _key: string;
  }>;
  slug?: Slug;
}>;

// Source: ./src/app/(frontend)/page.tsx
// Variable: frontPageQuery
// Query: {  "intro": *[_type == "siteSettings"][0].intro}
export type FrontPageQueryResult = {
  intro: Array<{
    children?: Array<{
      marks?: Array<string>;
      text?: string;
      _type: "span";
      _key: string;
    }>;
    style?: "h2" | "normal";
    listItem?: "bullet" | "number";
    markDefs?: Array<{
      href?: string;
      _type: "link";
      _key: string;
    }>;
    level?: number;
    _type: "block";
    _key: string;
  }> | null;
};

// Query TypeMap
import "@sanity/client";
declare module "@sanity/client" {
  interface SanityQueries {
    '*[_type in ["sessionSeries", "event"] && (slug.current == $slug || _id == $slug)][0]{\n  ...,\n  location->,\n  organizers[]->,\n}': AktivitetQueryResult;
    '{\n  "eventsAndSessionSeries": *[\n    _type in ["sessionSeries", "event"] && \n    (!defined($seriesId) || _id == $seriesId) && \n    (!defined($locationId) || location._ref == $locationId) &&\n    (!defined($clubId) || references($clubId))\n  ]\n  {\n    ...,\n    location->,\n    organizers[]->,\n  },\n}': ActivitiesQueryResult;
    '*[_type == "infoPage" && slug.current == $slug][0]': InfoPageQueryResult;
    '\n  *[_type == "club" && slug.current == $slug][0] {\n    ...,\n    managers[] {\n      ...,\n      person->\n    }\n  }\n': ClubPageQueryResult;
    '{\n  "siteSettings": *[_type == "siteSettings"][0],\n  "infoPages": *[_type == "infoPage"],\n  "clubs": *[_type == "club"]\n}': HeaderQueryResult;
    '*[_type == "location" && slug.current == $slug][0]{\n  ...,\n}': LokasjonQueryResult;
    '*[_type == "location"]': LocationsQueryResult;
    '{\n  "intro": *[_type == "siteSettings"][0].intro\n}': FrontPageQueryResult;
  }
}
