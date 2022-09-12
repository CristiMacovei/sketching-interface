export namespace custom {
  export type SavedPoint = {
    x: number; // in world units
    y: number; // in world units
    name: string; // name of the point
  };

  export type SavedLine = {
    first: SavedPoint;
    second: SavedPoint;
  };

  export type Area = {
    points: SavedPoint[];
  };

  export type Text = {
    value: string; // actual text
    name: string; // identifier
    xTop: number; // world coordinates
    yTop: number; // world coordinates
  };

  export type PixelSpacePoint = {
    x: number; // in pixels
    y: number; // in pixels
  };

  export type WorldSpacePoint = {
    x: number; // in world units
    y: number; // in world units
  };

  export type CachedPoint = {
    x: number; // in world units
    y: number; // in world units
    name: string; // name of the point
    snappedPoint: SavedPoint | null; // point it's snapped to or null if none
  };

  export type CachedPointStorage = {
    tools: {
      line: CachedPoint[];
      area: CachedPoint[];
    };
  };

  export type CachedLine = {
    first: CachedPoint;
    second: CachedPoint;
  };

  export type Unit = {
    name: 'm' | 'ft';
    longName: 'Meters' | 'Feet';
  };

  export type CanvasParams = {
    readonly width: number;
    readonly height: number;
    setWidth: (value: number) => void;
    setHeight: (value: number) => void;

    readonly screenTopLeftX: number;
    readonly screenTopLeftY: number;
    setScreenTopLeftX: (value: number) => void;
    setScreenTopLeftY: (value: number) => void;

    readonly worldCenterX: number;
    readonly worldCenterY: number;
    setWorldCenterX: (value: number) => void;
    setWorldCenterY: (value: number) => void;

    readonly gridUnit: Unit;
    readonly gridNumCellsPerRow: number;
    readonly worldUnitsPerCell: number;
    setGridUnit: (value: Unit) => void;
    setGridNumCellsPerRow: (value: number) => void;
    setWorldUnitsPerCell: (value: number) => void;
  };

  export type SelectionMode = string | null;

  export enum MouseButtonBits {
    LEFT_CLICK = 0b1,
    RIGHT_CLICK = 0b10,
    SCROLL_CLICK = 0b100
  }

  export type Sketch = {}; // todo

  export type User = {}; // todo
}
