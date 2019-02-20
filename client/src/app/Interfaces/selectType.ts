import { ModificationType, ObjectGeometry } from "../FreeGameCreatorInterface/free-game-enum";

export interface SelectType<Enum> {
    value: Enum;
    viewValue: string;
}

export const AVAILABLE_OBJECT_TYPES: SelectType<ObjectGeometry>[] = [
    {
      viewValue: "Sphère", value: ObjectGeometry.sphere,
    },
    {
      viewValue: "Cube", value: ObjectGeometry.cube,
    },
    {
      viewValue: "Cône", value: ObjectGeometry.cone,
    },
    {
        viewValue: "Cylindre", value: ObjectGeometry.cylinder,
    },
    {
        viewValue: "Pyramide b. triangulaire", value: ObjectGeometry.pyramid,
    },
];

export const AVAILABLE_MODIF_TYPES: SelectType<ModificationType>[] = [
  {
    viewValue: "Ajout", value: ModificationType.add,
  },
  {
    viewValue: "Suppression", value: ModificationType.remove,
  },
  {
    viewValue: "Changement de couleur", value: ModificationType.changeColor,
  },
];
