import { createGlobalStyle, css } from "styled-components";

// TODO: This can probably be removed or simplified once hiding the history inspector is fixed:
// https://biblioteksentralen.slack.com/archives/C03E7JT7UF3/p1695891656091519?thread_ts=1689152481.133889&cid=C03E7JT7UF3
const hideReviewOptions = css`
  #sanity {
    /* Button next to input field */
    button[data-testid="change-bar__button"] {
      display: none;
    }

    // Kebab menus in document list and document editor
    button[data-testid="pane-context-menu-button"][data-ui="MenuButton"]:has(
        svg[data-sanity-icon="ellipsis-horizontal"]
      ) {
      display: none;
    }
  }
`;

const hideReferenceInputLinks = css`
  #sanity {
    /* Make sure list items are non-clickable to avoid opening several editor tabs TODO: Is this selector too broad? */
    a[data-ui="ReferenceLinkCard"] {
      pointer-events: none;
    }

    /* Avoid option to edit in another tab in reference preview kebab menu */
    div
      [data-testid="document-panel-portal"]
      a[role="menuitem"][href^="/cms/intent/edit"] {
      display: none;
    }
  }
`;

// As of yet it's not possible to remove the default badges in a more canonical way:
// https://biblioteksentralen.slack.com/archives/C03E7JT7UF3/p1689152481133889
const hideDefaultBadges = css`
  /* Both published and draft badges */
  div[data-testid="pane-footer"]
    div[data-ui="Flex"]:has(+ div[data-ui="Inline"]) {
    display: none;
  }
`;

/* Both published and draft badges */
const hideFieldActions = css`
  div[data-testid^="field-actions-menu"] {
    display: none !important;
  }
`;

const buttonStyles = css`
  button {
    cursor: pointer;
  }
`;

// Accordion buttons in schemas are a bit small and hard to spot, so we enhance them here
const schemaAcordionButton = css`
  /* selects buttons inside fieldsets with an svg where the "data-sanity-icon"-attribute starts with "toggle-arrow-" */
  fieldset {
    button:has(svg[data-sanity-icon^="toggle-arrow-"]) {
      padding: 0.5em;
      border-radius: 0.25em;
      border: 0.1rem solid rgba(0, 0, 0, 0.05);
      background-color: rgba(0, 0, 0, 0.04);
      &:hover {
        background-color: rgba(0, 0, 0, 0.075);
      }
    }
  }
`;

// Hide "Published" and "Draft" badges
const hidePublishedDraftBadgesAndRepositionHeaderPane = css`
  div[data-testid="document-pane"] > div[data-ui="Flex"] > div[data-ui="Card"] {
    display: none;
  }
`;

export const schemaBackground = "#f9f9f9";

const grayBackgroundSchema = css`
  div[data-testid="document-pane"] div[data-testid="pane-content"] {
    background-color: ${schemaBackground};
  }
`;

export const StudioCSSOverrides = createGlobalStyle`
  ${hideDefaultBadges};
  ${hideReviewOptions};
  ${hideReferenceInputLinks};
  ${hideFieldActions};
  ${buttonStyles};
  ${schemaAcordionButton};
  ${hidePublishedDraftBadgesAndRepositionHeaderPane};
  ${grayBackgroundSchema};
`;
