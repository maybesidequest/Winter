---
name: InterChat
description: A connected-atlas design system for Discord community operations and discovery.
colors:
  midnight-ink: "#0b0c14"
  surface-night: "#13141f"
  night-plum: "#19172b"
  elevated-plum: "#181726"
  selected-plum: "#211f35"
  night-elevated: "#222038"
  night-surface: "#242238"
  atlas-ink: "#11121b"
  atlas-paper: "#f4f0e8"
  inner-paper: "#fffdf8"
  deep-violet: "#5b4ccb"
  signal-violet: "#8175ee"
  violet-hover: "#6959dc"
  command-lavender: "#c4b5fd"
  command-lavender-face: "#cdc2f8"
  route-sky: "#8fd3ff"
  atlas-sky-dark: "#2a7198"
  safety-sage: "#cfe8d4"
  safety-sage-dark: "#477353"
  status-live: "#7ed493"
  alert-coral: "#ff8c73"
  coral-light: "#ffac99"
  atlas-coral-dark: "#b44c3d"
  danger-red: "#ef4444"
  text-warm: "#f7f5ef"
  text-muted: "#9697a3"
  paper-text-secondary: "#4b4952"
  paper-text-tertiary: "#56545d"
  paper-text-muted: "#65636b"
  paper-line: "#e5dfd5"
  border-subtle: "rgba(255, 255, 255, 0.08)"
typography:
  scale:
    xs: "12px"
    sm: "14px"
    base: "16px"
    md: "17px"
    lg: "18px"
    xl: "20px"
    "2xl": "24px"
    "3xl": "30px"
    "4xl": "36px"
  display:
    fontFamily: "Sora, Inter, sans-serif"
    fontSize: "clamp(4.1rem, 5.25vw, 5.5rem)"
    fontWeight: 600
    lineHeight: 0.98
    letterSpacing: "-0.065em"
  headline:
    fontFamily: "Sora, Inter, sans-serif"
    fontSize: "clamp(2.25rem, 5vw, 5rem)"
    fontWeight: 600
    lineHeight: 1.02
    letterSpacing: "-0.055em"
  title:
    fontFamily: "Sora, Inter, sans-serif"
    fontSize: "30px"
    fontWeight: 800
    lineHeight: 1.2
    letterSpacing: "-0.025em"
  body:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "normal"
  body-editorial:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "normal"
  label:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "12px"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "0.08em"
rounded:
  sm: "4px"
  compact: "8px"
  control: "10px"
  inner: "12px"
  popup: "14px"
  card: "16px"
  editorial-card: "18px"
  capsule: "9999px"
spacing:
  "1": "4px"
  "2": "8px"
  "3": "12px"
  "4": "16px"
  "6": "24px"
  "8": "32px"
  "10": "40px"
components:
  button-primary:
    backgroundColor: "{colors.command-lavender-face}"
    textColor: "{colors.atlas-ink}"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    padding: "6px 14px"
  button-secondary:
    backgroundColor: "{colors.elevated-plum}"
    textColor: "#ffffff"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    padding: "6px 14px"
  button-danger:
    backgroundColor: "#dc2626"
    textColor: "#ffffff"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    padding: "6px 14px"
  text-field:
    backgroundColor: "rgba(19, 20, 31, 0.75)"
    textColor: "#ffffff"
    typography: "{typography.body}"
    rounded: "{rounded.control}"
    padding: "9px 12px"
    height: "42px"
  select-trigger:
    backgroundColor: "rgba(19, 20, 31, 0.75)"
    textColor: "#ffffff"
    typography: "{typography.body}"
    rounded: "{rounded.inner}"
    padding: "4px 10px"
    height: "44px"
  filter-pill:
    backgroundColor: "rgba(255, 255, 255, 0.04)"
    textColor: "rgba(255, 255, 255, 0.70)"
    typography: "{typography.label}"
    rounded: "{rounded.capsule}"
    padding: "6px 14px"
  section-card:
    backgroundColor: "{colors.surface-night}"
    textColor: "{colors.text-warm}"
    rounded: "{rounded.card}"
    padding: "24px"
  depth-toggle:
    backgroundColor: "{colors.command-lavender}"
    rounded: "{rounded.capsule}"
    width: "44px"
    height: "24px"
  sidebar-link:
    backgroundColor: "transparent"
    textColor: "rgba(255, 255, 255, 0.80)"
    typography: "{typography.body}"
    rounded: "{rounded.inner}"
    padding: "8px 14px"
  atlas-cta:
    backgroundColor: "{colors.deep-violet}"
    textColor: "#ffffff"
    typography: "{typography.label}"
    rounded: "{rounded.capsule}"
    padding: "11px 18px 11px 24px"
    height: "48px"
---

# Design System: InterChat

## Overview

**Creative North Star: "The Connected Atlas"**

InterChat should feel like a precise, nocturnal operations map: communities are distinct places, connections are deliberate routes, and every control helps an operator understand or change the network. The product interface is compact and composed, with near-black layered surfaces, crisp edge definition, restrained signal color, and tactile state changes that make configuration work feel dependable.

The public experience expresses the same idea more editorially. Warm paper fields, contour lines, pins, route diagrams, annotations, and offset print-like shadows turn technical relationships into a welcoming community atlas. This is a surface-specific expression, not permission to make operational screens ornamental.

Despite legacy names in the implementation, heavy glassmorphism is not the current identity. Core product surfaces are opaque and layered. Blur is reserved for navigation chrome, dropdowns, tooltips, and modal overlays where separation from moving content is useful.

**Key Characteristics:**

- Nocturnal, resource-dense operational surfaces
- Tactile bottom edges with restrained ambient depth
- Violet action signals supported by sky, sage, and coral status cues
- Topographic contours and route geometry as the signature motif
- Warm, editorial Atlas compositions on public and reading surfaces
- Compact controls, explicit hierarchy, and permission-aware navigation

## Colors

The palette moves between a near-black operations environment and a warm paper Atlas environment while preserving the same violet, sky, sage, and coral signals.

### Primary

- **Signal Violet** (#8175ee): The active-selection and focus color for navigation, filters, routes, and selected resource states.
- **Command Lavender** (#c4b5fd): The enabled-toggle track and brightest shared primary signal; pair it with dark ink text.
- **Command Lavender Face** (#cdc2f8): The slightly quieter primary dashboard button face.
- **Deep Violet** (#5b4ccb): The denser violet reserved for public calls to action, route anchors, and the lower edge of active pills.

### Secondary

- **Route Sky** (#8fd3ff): A high-contrast focus ring and connection marker. Use it for navigation focus and route meaning, not as a second general-purpose action color.
- **Safety Sage** (#cfe8d4): A calm safety and positive-state accent used in Atlas sections, status motifs, and moderation-positive contexts.

### Tertiary

- **Alert Coral** (#ff8c73): A warm warning and attention accent for exceptional states, annotations, and route markers.
- **Danger Red** (#ef4444): Reserved for destructive actions and invalid states. It must not substitute for ordinary warnings.

### Neutral

- **Midnight Ink** (#0b0c14): The global application canvas.
- **Surface Night** (#13141f): The standard product card and contextual-sidebar surface.
- **Night Plum** (#19172b): The dark public Atlas field.
- **Elevated Plum** (#181726): Popovers, dropdowns, and visually raised dark layers.
- **Selected Plum** (#211f35): Quiet selected navigation and recessed control surfaces.
- **Atlas Ink** (#11121b): Text, outlines, and hard shadows on public paper surfaces.
- **Atlas Paper** (#f4f0e8): The warm public-page field and inverse text color on night sections.
- **Inner Paper** (#fffdf8): The slightly brighter face used for editorial cards and message fragments.
- **Text Warm** (#f7f5ef): The default high-emphasis dashboard text.
- **Text Muted** (#9697a3): Secondary product copy and metadata.
- **Border Subtle** (rgba(255, 255, 255, 0.08)): The standard dark-surface edge; use tonal separation before increasing its opacity.

### Named Rules

**The Controlled Signal Rule.** Violet marks action, selection, or connection; it does not flood whole operational screens.

**The Two Environments Rule.** Dark is operational and paper is editorial. Do not introduce a light dashboard by reusing Atlas Paper.

**The Semantic Accent Rule.** Sky means route or focus, sage means safety or positive state, coral means attention, and red means destructive or invalid.

## Typography

**Display Font:** Sora (with Inter and sans-serif fallback)
**Body Font:** Inter (with system sans-serif fallback)
**Label Font:** Inter (with system sans-serif fallback)

**Character:** Sora gives map titles and resource headings a compact geometric authority. Inter carries dense configuration, metadata, and explanations without drawing attention away from the task.

### Hierarchy

- **Display** (Sora 600, 4.1rem–5.5rem, line-height 0.98, letter-spacing -0.065em): Exclusive to public hero statements; the tight rhythm creates the Atlas masthead effect.
- **Headline** (Sora 600, 2.25rem–5rem, line-height 1.02, letter-spacing -0.055em): Large public and reading-surface section statements with deliberately short line lengths.
- **Title** (Sora 800, 30px–36px, line-height 1.2): Dashboard page and resource titles with unmistakable operational hierarchy.
- **Body** (Inter 400, 14px–16px, line-height 1.5): Product copy, controls, rows, and descriptions; 14px is the strict floor for body and card copy.
- **Body Editorial** (Inter 400, 17px, line-height 1.6): Public and long-form copy constrained to roughly 65–75 characters per line.
- **Label** (Inter 700, 12px, letter-spacing 0.08em): Compact controls, navigation metadata, eyebrows, timestamps, and statuses; 12px is the strict typographic floor for badges and labels.

### Named Rules

**The Typographic Floor Rule.** Micro-labels, badges, stamps, and metadata stop at a strict floor of 12px (0.75rem). Card descriptions, body copy, and interactive content stop at a floor of 14px (0.875rem). Subatomic fractional font sizes below 12px are prohibited.

**The Two-Voice Rule.** Sora names places and decisions; Inter explains, labels, and operates them.

**The Shipped-Weight Rule.** New work uses the loaded Sora weights from 400 through 800. Do not request synthetic 850 or 900 weights unless font delivery is changed deliberately.

## Layout

The current dashboard uses a three-zone desktop shell: a 72px instance rail, a 288px contextual resource sidebar, and routed content offset by their combined 360px width. Main content is centered at a 1152px maximum for most resource workspaces, with 16px, 24px, and 40px outer padding as space increases. The dashboard home may expand to 1280px for overview density.

Use a 4px spacing base. The dominant rhythm is 8px, 12px, 16px, 24px, 32px, and 40px: compact gaps inside controls, 16–24px card padding, 24px section rhythm, and larger outer-page breathing room. Resource lists favor one strong container with divided rows; analytics and discovery views may use responsive card grids.

At 768px and above, show the desktop rail and contextual sidebar. Below 768px, replace them with a 56px mobile header and a maximum-320px navigation drawer. Product grids usually shift at 640px and 768px; discovery can expand to three columns at 1024px. Stack headers and actions on small screens, hide nonessential row metadata, and keep primary tasks reachable without horizontal page scrolling.

The Atlas site uses a 1240px container with 24px desktop gutters and 16px mobile gutters. Its asymmetric map compositions collapse to one column at 860px, route diagrams become vertical, and decorative detail simplifies below 560px. Reading surfaces may retain a sticky contents rail until 900px.

**The Shell Truth Rule.** Extend the active instance-rail and contextual-sidebar shell. Do not revive the unused 256px sidebar, 64px top bar, 12-column shell, or mobile bottom-navigation implementation.

## Elevation & Depth

InterChat uses a hybrid of tonal layering, crisp lower edges, and restrained ambient shadows. Product cards are opaque at rest; their subtle border and short lower edge establish structure, while interactive surfaces lift by only one pixel. Public Atlas cards use harder offset shadows that evoke printed labels pinned to a map.

Blur is functional rather than atmospheric. Apply it to sticky navigation, dropdown panels, tooltips, drawers, and modal layers that sit above changing content. Do not apply translucent blur across ordinary cards or page backgrounds.

### Shadow Vocabulary

- **Product Card** (`box-shadow: 0 3px 0 0 rgba(255,255,255,0.08), 0 8px 24px -4px rgba(0,0,0,0.55)`): Standard opaque section-card structure.
- **Product Panel** (`box-shadow: 0 4px 0 0 rgba(10,8,23,0.75)`): Firmer structural edge for metric and workspace panels.
- **Popup** (`box-shadow: 0 4px 0 0 rgba(10,8,23,0.85), 0 16px 36px rgba(0,0,0,0.60)`): Transient dropdown and overlay separation.
- **Control Edge** (`box-shadow: 0 2px 0 0 currentColor`): Tactile dashboard controls; grow the edge on hover and compress it on press.
- **Atlas Card** (`box-shadow: 10px 12px 0 rgba(17,18,27,0.10)`): Paper cards and editorial fragments.
- **Atlas Dark Fragment** (`box-shadow: 8px 10px 0 rgba(0,0,0,0.18)`): Message cards placed on the night map.

### Named Rules

**The Opaque-by-Default Rule.** Core application surfaces are opaque; a legacy “glass” identifier is not evidence that a component should look transparent.

**The One-Pixel Response Rule.** Product controls communicate hover and press through small vertical movement and changing edge depth, never dramatic floating animation.

## Shapes

The product uses compact, gently squared geometry. Controls use the control radius, nested content uses the inner radius, popups use the popup radius, and primary cards use the card radius. Full capsules are reserved for toggles, compact filters, badges, and public calls to action—not general containers.

Atlas surfaces may use the editorial-card radius, rotated paper labels, circular map nodes, pin silhouettes, and rare irregular map boundaries. These expressive shapes belong to diagrams and public storytelling; resource-management layouts remain aligned and stable.

Borders are usually one pixel and low contrast. Use borders to clarify a boundary, selected state, or semantic alert. Avoid stacking a strong border, glow, and deep shadow on the same resting component.

**The Nested Radius Rule.** Inner elements are never rounder than the container that holds them unless they are intentionally capsule-shaped controls or circular identities.

## Components

Dashboard components should feel compact, tactile, and operational. State changes must remain visible in color, edge depth, and focus treatment without shifting surrounding layout.

### Buttons

- **Shape:** Gently squared control corners with compact vertical padding.
- **Primary:** Command Lavender face, dark ink text, lavender edge, and bold label weight. The common compact treatment is 6px by 14px, while larger actions may add height without changing the depth grammar.
- **Hover / Focus:** Lift by 1px, brighten the face, and deepen the lower edge. Focus uses a 3px Route Sky outline with a 2px offset. Press by 1px and compress the edge.
- **Secondary:** Elevated Plum face, white text, and a quiet white edge; it uses the same motion as primary.
- **Danger:** Solid red is for consequential destructive actions. Use the translucent compact variant for lower-emphasis removal controls.
- **Disabled:** Remove movement and shadow, mute both face and text, and retain the native disabled state.

### Chips

- **Style:** Filter pills use a quiet translucent fill, subtle edge, compact label type, and full capsule geometry.
- **State:** Active filters use a solid Signal Violet face with a Deep Violet lower edge. Selected-but-not-primary filters use a translucent violet face and Command Lavender text.
- **Semantics:** Selection controls must expose their state with `aria-pressed`, `aria-selected`, or the appropriate native pattern rather than color alone.

### Cards / Containers

- **Corner Style:** Primary product cards use the card radius; nested panels step down to the inner radius.
- **Background:** Product cards use opaque Surface Night. Atlas cards use Inner Paper or a dark fragment surface appropriate to their section.
- **Shadow Strategy:** Product cards use a crisp lower edge plus restrained ambient depth. Atlas cards use hard offset shadows and may rotate slightly when the composition calls for a pinned-paper effect.
- **Border:** Use Border Subtle on dark surfaces and a low-opacity Atlas Ink border on paper.
- **Internal Padding:** Use 16px for compact lists and 20–24px for section cards and metrics.
- **Signature Motif:** Contour-line overlays may tint violet, sky, coral, or sage. They are decorative, low-opacity, clipped to the card, pointer-inert, and hidden from assistive technology.

### Inputs / Fields

- **Style:** Inputs use a dark recessed face, subtle one-pixel edge, control radius, and a minimum 42px target. Textareas retain the same language, start at 96px high, and resize vertically.
- **Focus:** Shift the edge to Signal Violet and add a two-pixel translucent violet halo while preserving the global Route Sky keyboard outline where applicable.
- **Error / Disabled:** Invalid fields use Danger Red at the edge and halo. Disabled fields lose depth, mute their content, and use the not-allowed cursor.
- **Selection:** Prominent selects use the themed custom control and popup; do not expose a visually unstyled native select.

### Navigation

- **Instance Rail:** The 48px resource icon is a generous squircle at rest and tightens on hover or selection. Active instances add a four-pixel violet indicator at the rail edge.
- **Contextual Sidebar:** Links use 14px semibold type, compact icons, 12px corners, and a quiet hover wash. Active links use Selected Plum, white text, a subtle border, and short shadow.
- **Mobile:** Replace both desktop navigation zones with the compact header and slide-over drawer. Route-specific tabs may become horizontally scrollable pills when the workspace requires them.

### Depth Toggle

The standard toggle is 44px by 24px with an 18px flat disc; the compact variant is 36px by 20px with a 14px disc. Off state uses charcoal and slate. On state uses Command Lavender with a white knob and lavender lower edge. The knob widens subtly while pressed, travels with the spring-like toggle easing, supports Space and Enter, and exposes `role="switch"` with `aria-checked`.

### Dropdowns and Popups

Transient panels use Elevated Plum, a subtle white border, the popup radius, 20–24px backdrop blur, and the Popup shadow. Options use compact 13px text, soft hover fill, and a translucent Signal Violet selected state. Search, clear, disabled, keyboard, and empty states must remain available.

### Atlas CTA

The public call to action is a full capsule with a Deep Violet face and a diagonal print-like shadow. Hover moves it two pixels down and right while shortening the shadow, creating a pressed-poster effect distinct from the dashboard's vertical control movement.

## Do's and Don'ts

### Do:

- **Do** model dense operational screens with opaque Midnight Ink and Surface Night layers.
- **Do** reserve blur for navigation chrome and transient overlays where content separation matters.
- **Do** reuse the violet, sky, sage, and coral semantics consistently across both environments.
- **Do** preserve the active three-zone dashboard shell and its compact responsive drawer behavior.
- **Do** use contour lines, route geometry, pins, and atlas annotations as the recognizable InterChat signature.
- **Do** provide visible hover, active, focus, disabled, empty, loading, and invalid states for controls.
- **Do** honor reduced-motion preferences for reveal, route, and control animation.

### Don't:

- **Don't** revive translucent glass cards as the default product surface because a legacy component or identifier contains the word “glass.”
- **Don't** treat the warm Atlas Paper environment as a supported light dashboard theme.
- **Don't** use the disabled production-only staff interface or stock Ant Design styling as brand evidence.
- **Don't** revive the unused legacy dashboard sidebar, top bar, grid shell, or bottom navigation.
- **Don't** use violet decoratively when it does not communicate action, selection, focus, or connection.
- **Don't** introduce unstyled native selects for prominent controls or inaccessible clickable containers for resource cards.
- **Don't** request unavailable Sora weights or depend on color alone to communicate component state.
