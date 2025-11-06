# Design Guidelines: Curaçao Video Review Platform

## Design Approach
**Reference-Based Strategy**: Drawing inspiration from Airbnb's card-based discovery interface, YouTube's video presentation patterns, and Netflix's content browsing experience. This creates a familiar yet distinctive platform optimized for video content discovery and tropical destination appeal.

## Typography System

**Font Families** (Google Fonts via CDN):
- Primary: Poppins (headings, UI elements) - weights: 400, 500, 600, 700
- Secondary: Inter (body text, descriptions) - weights: 400, 500

**Hierarchy**:
- Hero/Page Titles: text-4xl md:text-5xl lg:text-6xl, font-bold
- Section Headers: text-2xl md:text-3xl, font-semibold
- Card Titles: text-lg md:text-xl, font-medium
- Body Text: text-base, font-normal
- Tags/Labels: text-sm, font-medium, uppercase tracking-wide
- Metadata: text-sm, font-normal

## Layout System

**Spacing Primitives**: Use Tailwind units of 2, 4, 6, 8, 12, 16, 20, 24
- Component internal spacing: p-4, p-6
- Card spacing: p-6 md:p-8
- Section spacing: py-12 md:py-20, px-4 md:px-8
- Grid gaps: gap-6 md:gap-8

**Container Strategy**:
- Max width: max-w-7xl mx-auto
- Responsive padding: px-4 md:px-6 lg:px-8

## Component Architecture

### Navigation Bar
- Fixed top position with backdrop blur effect
- Height: h-16 md:h-20
- Contains: Logo (left), Language selector (icon + dropdown), Theme switcher (icon), Admin login (right)
- Spacing: px-4 md:px-8, items centered vertically
- Icons: Heroicons via CDN

### Hero Section (Homepage)
**Layout**: Full-width background with overlay content
- Height: min-h-[60vh] md:min-h-[70vh]
- Hero image: Curaçao landmark/beach scene (Punda buildings or turquoise waters)
- Overlay gradient for text readability
- Content container: max-w-4xl mx-auto, centered vertically and horizontally
- Hero title: text-5xl md:text-6xl lg:text-7xl, font-bold, mb-6
- Subtitle: text-xl md:text-2xl, font-normal, mb-12
- Search bar component (detailed below) centered
- Buttons with blurred backgrounds: backdrop-blur-md with semi-transparent base

### Video Card Grid
**Grid Layout**:
- Mobile: grid-cols-1
- Tablet: grid-cols-2
- Desktop: grid-cols-3 xl:grid-cols-4
- Gap: gap-6 md:gap-8
- Container: py-12 md:py-20

**Individual Card Structure**:
- Aspect ratio: aspect-video for thumbnail
- Border radius: rounded-xl
- Shadow: shadow-lg with hover:shadow-2xl transition
- Padding: p-0 (image full-bleed at top)
- Content padding below thumbnail: p-6

**Card Content Order**:
1. YouTube thumbnail with sponsored ribbon (if applicable)
2. Pin indicator (icon, top-right corner, absolute positioning)
3. Title: text-lg md:text-xl, font-semibold, mb-2, line-clamp-2
4. Rating stars: flex row, gap-1, mb-3
5. Tags row: flex flex-wrap, gap-2, mb-3
6. Main tag badge (Tourist/Resident): rounded-full px-3 py-1
7. Sub-tags: rounded-full px-2 py-1, text-xs

**Sponsored Ribbon**:
- Position: absolute top-4 right-0
- Diagonal ribbon effect (transform: rotate(45deg))
- Text: uppercase, text-xs, font-bold, tracking-wider
- Padding: px-8 py-1

### Search & Filter Section
**Layout**: Sticky bar below navbar or integrated hero search
- Container: bg with backdrop-blur, shadow-md
- Padding: p-4 md:p-6
- Flex layout: flex flex-col md:flex-row gap-4 md:gap-6

**Components**:
1. Search input: flex-1, h-12, rounded-lg, px-4
2. Tag filter dropdown: min-w-[200px], h-12
3. Sub-tag filter dropdown: min-w-[200px], h-12
4. Rating filter: min-w-[160px], h-12
5. Sort dropdown: min-w-[180px], h-12
6. Clear filters button: h-12, px-6

### Admin Panel
**Layout**: Full-page modal or dedicated route
- Container: max-w-4xl mx-auto, py-12 md:py-20
- Card container: rounded-2xl, shadow-2xl, p-8 md:p-12

**Form Structure**:
- Section spacing: space-y-6
- Label: text-sm, font-medium, mb-2
- Input fields: h-12, rounded-lg, px-4, w-full
- Textareas: h-24, rounded-lg, px-4 py-3
- Toggle switches: Modern switch UI for sponsored/pin status
- Tag management: Chip-based UI with add/remove buttons
- Submit button: w-full md:w-auto, h-12, px-8, rounded-lg

### Language Selector
**Dropdown Component**:
- Trigger: Flag icon + current language code, h-10
- Dropdown: absolute, top-full, mt-2, min-w-[180px]
- Items: flex items-center, gap-3, p-3, hover state
- Each item: Flag icon + language name

### Theme Switcher
**UI Pattern**:
- Icon button in navbar: h-10 w-10, rounded-full
- Dropdown with theme previews: grid grid-cols-3 gap-2, p-4
- Theme cards: aspect-square, rounded-lg, border-2, cursor-pointer

## Responsive Behavior

**Breakpoints**:
- Mobile: < 768px - Single column, stacked navigation
- Tablet: 768px - 1024px - Two columns, compact filters
- Desktop: > 1024px - Full multi-column grid, expanded filters

**Mobile Optimizations**:
- Hamburger menu for filters (slide-out drawer)
- Bottom navigation for key actions
- Larger touch targets: min-h-12 for all interactive elements
- Simplified card layouts with essential info only

## Interaction Patterns

**Hover States** (desktop only):
- Cards: scale-105 transition, shadow enhancement
- Buttons: brightness/opacity changes
- Links: underline decoration

**Loading States**:
- Skeleton screens for video cards: animate-pulse
- Lazy loading for images with blur-up placeholder

**Empty States**:
- Centered icon + message: max-w-md mx-auto, text-center
- CTA button below message

## Animations
**Minimal, purposeful animations**:
- Page transitions: fade-in only
- Card hover: transform scale
- Modal/dropdown entry: slide-in from top/bottom
- No scroll-triggered animations
- No complex keyframe animations

## Images

**Required Images**:
1. **Hero Background**: Curaçao scenic view - Punda colorful buildings with harbor OR pristine turquoise beach with divi-divi trees. Full-bleed, min-h-[70vh]
2. **Empty State Illustration**: Simple icon or illustration for "no videos found"
3. **YouTube Thumbnails**: Auto-fetched from YouTube API

**Image Treatment**:
- Hero: Gradient overlay for text contrast
- All images: rounded-xl corners
- Lazy loading with low-quality placeholders

## Accessibility
- ARIA labels for all interactive elements
- Keyboard navigation support throughout
- Focus indicators: ring-2 ring-offset-2
- Semantic HTML structure
- Alt text for all images
- Screen reader announcements for filter changes
- Minimum contrast ratios maintained across all themes