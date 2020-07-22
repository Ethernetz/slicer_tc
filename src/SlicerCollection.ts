import { Visual } from "./visual";
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import ISelectionId = powerbi.extensibility.ISelectionId;


import { TilesCollection } from "./TilesCollection/TilesCollection";
import { Tile } from "./TilesCollection/Tile";
import powerbi from "powerbi-visuals-api";
import { TileData } from "./TilesCollection/TileData";

export class SlicerCollection extends TilesCollection {
    visual: Visual
    options: VisualUpdateOptions
    tilesData = <SlicerData[]>this.tilesData

    public createTile(i): Tile {
        return new Slicer(this, i, this.tilesData, this.formatSettings)
    }


}

export class Slicer extends Tile {
    collection = <SlicerCollection>this.collection
    tilesData = <SlicerData[]>this.tilesData
    visual: Visual = this.collection.visual


    onTileClick() {
        this.visual.selectionManager.select((<SlicerData>this.tileData).selectionId, this.visual.visualSettings.content.multiselect)
        this.collection.onStateChange(this.visual.createSlicerData()) 
    }

    onTileMouseover() {
        this.visual.hoveredIndex = this.i
        this.collection.onStateChange(this.visual.createSlicerData()) 
    }
    onTileMouseout() {
        this.visual.hoveredIndex = null
        this.collection.onStateChange(this.visual.createSlicerData()) 
    }
}

export class SlicerData extends TileData {
    selectionId?: ISelectionId
}

