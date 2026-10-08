export type MotionLibraryClip = {
  id: string;
  src: string;
  label: string;
};

export const motionLibraryClips: MotionLibraryClip[] = [
  {
    id: "flip",
    src: "/images/studio/lib-flip.jpg",
    label: "Flip",
  },
  {
    id: "cast",
    src: "/images/studio/lib-cast.jpg",
    label: "Recast",
  },
  {
    id: "world",
    src: "/images/studio/lib-world.jpg",
    label: "New world",
  },
];
