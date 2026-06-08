# Sheikh Hasan Family Tree

A static React, TypeScript, and Tailwind CSS web app for displaying the Sheikh Hasan family tree and its village branches.

## Run Locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Data

The first version is static only. All current family-tree data lives in [`src/data/familyTrees.ts`](src/data/familyTrees.ts).

The app keeps English names for display and Urdu names for source verification. It currently includes:

- Sheikh Hasan as the known common ancestor, displayed as context rather than as a direct father of every village branch.
- Village branch records for routing and metadata. These labels are not shown as nodes in the diagram.
- Male-line names only. The app stores sons for each family tree and does not store mothers or daughters.
- No invented descendant names.

## Adding People Manually

Add a new person to the exported `people` array in `src/data/familyTrees.ts`.

```ts
{
  id: "unique-person-id",
  name: "English Name",
  urduName: "اردو نام",
  fatherId: null,
  villageId: "semariyawan",
  generation: 1,
  notes: "Short source or verification note.",
  source: {
    pdfPages: [12],
    confidence: "medium"
  }
}
```

Use the selected village slug as `villageId` for descendants. The first actual male-line person entered for a separate family in a village should have `fatherId: null` and `generation: 1`; his sons are generation 2, and so on. Only sons inside that family should point `fatherId` to an existing person in the same branch.

Use `isPlaceholder: true` only for village branch metadata or intentionally incomplete records. Keep `source.confidence` as `"high"`, `"medium"`, or `"low"` so the UI can show verification badges.

## Future Work

The data model is intentionally shaped for later volunteer submissions, owner approval, village admins, and audit history. Authentication, admin tools, database writes, and submission workflows are not implemented in this static version.
