export interface SelectType {
    value: string;
    viewValue: string;
}

export const AVAILABLE_MODIF_TYPES: SelectType[] = [
    {
      viewValue: "Sphère", value: "sphere-0",
    },
    {
      viewValue: "Cube", value: "cube-1",
    },
    {
      viewValue: "Cône", value: "cone-2",
    },
    {
        viewValue: "Cylindre", value: "cylinder-3",
    },
    {
        viewValue: "Pyramide b. triangulaire", value: "pyr-tri-4",
    },
];
