import { Visual } from "./visual";
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import ISelectionId = powerbi.extensibility.ISelectionId;


import { TilesCollection } from "./TilesCollection/TilesCollection";
import { Tile } from "./TilesCollection/Tile";
import powerbi from "powerbi-visuals-api";
import { TileData } from "./TilesCollection/TileData";
import * as d3 from "d3";

// import { sizeTextContainer, styleText, makeTextTransparent } from './d3calls'

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
        this.visual.update(this.collection.options)
    }

    onTileMouseover() {
        this.visual.hoveredIndex = this.i
        let vs = this.collection.visual.visualSettings
        if(vs.tile.hoverStyling || vs.text.hoverStyling || vs.icon.hoverStyling || vs.effects.hoverStyling)
            this.visual.update(this.collection.options)
    }
    onTileMouseout() {
        this.visual.hoveredIndex = null
        let vs = this.collection.visual.visualSettings
        if(vs.tile.hoverStyling || vs.text.hoverStyling || vs.icon.hoverStyling || vs.effects.hoverStyling)
            this.visual.update(this.collection.options)
    }
}

export class SlicerData extends TileData {
    selectionId?: ISelectionId
}

