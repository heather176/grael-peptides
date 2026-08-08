/** Physical appearance options for product photography / label studio */

export type VialAppearance = {
  id: string;
  label: string;
  /** Short form line on the label */
  formLine: string;
  /** Powder / fill color for vial mockups */
  fill: {
    top: string;
    mid: string;
    bottom: string;
  };
  /** liquid vs cake */
  kind: "powder" | "liquid";
  mapsToProductForm: string[];
};

export const VIAL_APPEARANCES: VialAppearance[] = [
  {
    id: "white",
    label: "White powder (default)",
    formLine: "Lyophilized · RUO",
    kind: "powder",
    fill: { top: "#f7f7f5", mid: "#eceae6", bottom: "#ddd9d2" },
    mapsToProductForm: ["lyophilized-white"],
  },
  {
    id: "cream",
    label: "Cream / off-white powder",
    formLine: "Lyophilized · RUO",
    kind: "powder",
    fill: { top: "#f5f0e4", mid: "#e8dfc8", bottom: "#d4c7a8" },
    mapsToProductForm: ["lyophilized-cream"],
  },
  {
    id: "yellow",
    label: "Pale yellow powder",
    formLine: "Lyophilized · RUO",
    kind: "powder",
    fill: { top: "#f7f1c8", mid: "#ead98a", bottom: "#d4bc4e" },
    mapsToProductForm: ["lyophilized-amber"],
  },
  {
    id: "blue",
    label: "Blue powder (e.g. GHK-Cu)",
    formLine: "Lyophilized · RUO",
    kind: "powder",
    fill: { top: "#d4e4f2", mid: "#7eb0d4", bottom: "#3d7aaa" },
    mapsToProductForm: ["lyophilized-blue"],
  },
  {
    id: "solution",
    label: "Clear solution / liquid",
    formLine: "Solution · RUO",
    kind: "liquid",
    fill: { top: "#eef6fb", mid: "#c5dff0", bottom: "#8ebcd9" },
    mapsToProductForm: ["liquid-clear"],
  },
];

export function appearanceForProductForm(form: string): VialAppearance {
  return (
    VIAL_APPEARANCES.find((a) => a.mapsToProductForm.includes(form)) ?? VIAL_APPEARANCES[0]!
  );
}

export function getAppearance(id: string): VialAppearance {
  return VIAL_APPEARANCES.find((a) => a.id === id) ?? VIAL_APPEARANCES[0]!;
}
