export interface SelectType {
    value: string;
    viewValue: string;
}

export const AVAILABLE_OBJECT_TYPES: SelectType[] = [
    {
      viewValue: "Sphère", value: "sphere",
    },
    {
      viewValue: "Cube", value: "cube",
    },
    {
      viewValue: "Cône", value: "cone",
    },
    {
        viewValue: "Cylindre", value: "cylinder",
    },
    {
        viewValue: "Pyramide b. triangulaire", value: "pyr-tri",
    },
];

export const AVAILABLE_MODIF_TYPES: SelectType[] = [
  {
    viewValue: "Ajout", value: "add",
  },
  {
    viewValue: "Suppression", value: "remove",
  },
  {
    viewValue: "Changement de couleur", value: "change-color",
  },
];
