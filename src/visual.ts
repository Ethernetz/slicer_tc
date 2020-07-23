/*
*  Power BI Visual CLI
*
*  Copyright (c) Microsoft Corporation
*  All rights reserved.
*  MIT License
*
*  Permission is hereby granted, free of charge, to any person obtaining a copy
*  of this software and associated documentation files (the ""Software""), to deal
*  in the Software without restriction, including without limitation the rights
*  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
*  copies of the Software, and to permit persons to whom the Software is
*  furnished to do so, subject to the following conditions:
*
*  The above copyright notice and this permission notice shall be included in
*  all copies or substantial portions of the Software.
*
*  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
*  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
*  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
*  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
*  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
*  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
*  THE SOFTWARE.
*/
"use strict";

import "core-js/stable";
import "./../style/visual.less";
import powerbi from "powerbi-visuals-api";
import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import IVisual = powerbi.extensibility.visual.IVisual;
import IVisualHost = powerbi.extensibility.visual.IVisualHost;
import ISelectionManager = powerbi.extensibility.ISelectionManager;
import ISelectionIdBuilder = powerbi.extensibility.ISelectionIdBuilder;
import DataView = powerbi.DataView;
import VisualObjectInstancesToPersist = powerbi.VisualObjectInstancesToPersist
import VisualObjectInstance = powerbi.VisualObjectInstance
import DataViewPropertyValue = powerbi.DataViewPropertyValue
import VisualObjectInstanceEnumerationObject = powerbi.VisualObjectInstanceEnumerationObject
import VisualUpdateType = powerbi.VisualUpdateType


import { VisualSettings } from "./settings";
import VisualObjectInstanceEnumeration = powerbi.VisualObjectInstanceEnumeration;
import EnumerateVisualObjectInstancesOptions = powerbi.EnumerateVisualObjectInstancesOptions;

import { valueFormatter } from "powerbi-visuals-utils-formattingutils"

import * as d3 from "d3";
import { PropertyGroupKeys } from './TilesCollection/interfaces'
import { getPropertyStateNameArr, getObjectsToPersist } from './TilesCollectionUtlities/functions'
import { getCorrectPropertyStateName } from './TilesCollection/functions'


type Selection<T extends d3.BaseType> = d3.Selection<T, any, any, any>;

import { TileSizingType, TileLayoutType, TileShape, IconPlacement, State, PresetStyle } from './TilesCollection/enums'

import { SlicerCollection, SlicerData } from './SlicerCollection'
import { ContentFormatType } from "./TilesCollection/enums";
import { DisabledMode } from "./enums";

export class Visual implements IVisual {
    public host: IVisualHost;
    public visualSettings: VisualSettings;

    private selectionIdBuilder: ISelectionIdBuilder;
    public selectionManager: ISelectionManager;

    private svg: Selection<SVGElement>;
    private container: Selection<SVGElement>;
    public hoveredIndex: number
    public shiftFired: boolean = false;
    public currentPresetStyle: PresetStyle = PresetStyle.none;
    public currentPresetBaseColor: string = "";

    public visualElement: HTMLElement;

    public selectionIdKeys: string [] = []

    public slicerCollection: SlicerCollection

    constructor(options: VisualConstructorOptions) {
        this.selectionIdBuilder = options.host.createSelectionIdBuilder();
        this.selectionManager = options.host.createSelectionManager();
        this.host = options.host;
        this.svg = d3.select(options.element)
            .append('svg')
            .classed('slicer', true);

        this.container = this.svg.append("g")
            .classed('container', true);

        this.slicerCollection = new SlicerCollection()
        this.slicerCollection.svg = this.svg
        this.slicerCollection.container = this.container
        this.slicerCollection.visual = this
        this.slicerCollection.visualElement = options.element
    }

    public getEnumeratedStateProperties(propertyGroup: any, prefix?: string): { [propertyName: string]: DataViewPropertyValue } {
        let properties: { [propertyName: string]: DataViewPropertyValue } = {}
        let groupedKeyNamesArr: PropertyGroupKeys[] = getPropertyStateNameArr(Object.keys(propertyGroup))
        if (groupedKeyNamesArr.length > 0 && propertyGroup["state"]) {
            let state: State = propertyGroup["state"]
            for (let i = 0; i < groupedKeyNamesArr.length; i++) {
                let groupedKeyNames = groupedKeyNamesArr[i]
                if (prefix && !groupedKeyNames.default.startsWith(prefix))
                    continue
                switch (state) {
                    case State.all:
                        properties[groupedKeyNames.all] = propertyGroup[groupedKeyNames.all]
                        break
                    case State.selected:
                        properties[groupedKeyNames.selected] = propertyGroup[groupedKeyNames.selected]
                        break
                    case State.unselected:
                        properties[groupedKeyNames.unselected] = propertyGroup[groupedKeyNames.unselected]
                        break
                    case State.hovered:
                        properties[groupedKeyNames.hover] = propertyGroup[groupedKeyNames.hover]
                        break
                    case State.disabled:
                        properties[groupedKeyNames.disabled] = propertyGroup[groupedKeyNames.disabled]
                        break
                }
            }
        }

        return properties
    }

    public enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstanceEnumeration {
        let objectName = options.objectName;
        let objectEnumeration: VisualObjectInstance[] = [];

        let properties: { [propertyName: string]: DataViewPropertyValue } = {}


        const settings: VisualSettings = this.visualSettings || <VisualSettings>VisualSettings.getDefault();
        switch (objectName) {
            case "tile":
                properties.state = settings.tile.state
                properties.hoverStyling = settings.tile.hoverStyling
                properties = {...properties, ...this.getEnumeratedStateProperties(settings.tile) }
                break
            case "text": {
                properties.show = settings.text.show
                properties.state = settings.text.state
                properties.hoverStyling = settings.text.hoverStyling
                let filtered = Object.keys(settings.text)
                    .reduce((obj, key) => {
                        obj[key] = settings.text[key]
                        return obj;
                    }, {})

                properties = {...properties, ...this.getEnumeratedStateProperties(filtered) }
                break
            }
            case "icon":{
                properties.show = settings.icon.show
                properties.state = settings.icon.state
                properties.hoverStyling = settings.icon.hoverStyling
                let filtered = Object.keys(settings.icon)
                    .reduce((obj, key) => {
                        obj[key] = settings.icon[key]
                        return obj;
                    }, {})


                properties = { ...properties, ...this.getEnumeratedStateProperties(filtered) }
                break
            }
            case "layout": {
                let excludeWhenNotFixed = ["tileWidth", "tileHeight", "tileAlignment"]

                let filtered = Object.keys(settings.layout)
                    .filter(key => !(key.endsWith("Angle") || key.endsWith("Length"))
                        || key == settings.layout.tileShape + "Angle"
                        || key == settings.layout.tileShape + "Length")
                    .filter(key => !(settings.layout.sizingMethod != TileSizingType.fixed && excludeWhenNotFixed.indexOf(key) > -1))
                    .filter(key => !(settings.layout.tileLayout != TileLayoutType.grid && key == "tilesPerRow"))
                    .reduce((obj, key) => {
                        obj[key] = settings.layout[key]
                        return obj;
                    }, {})

                properties = { ...properties, ...filtered }
                break
            }
            case "contentAlignment": {
                properties.state = settings.contentAlignment.state
                properties.hoverStyling = settings.contentAlignment.hoverStyling
                let filtered = Object.keys(settings.contentAlignment)
                    .reduce((obj, key) => {
                        obj[key] = settings.contentAlignment[key]
                        return obj;
                    }, {})
                properties = { ...properties, ...this.getEnumeratedStateProperties(filtered) }
                break
            }
            case "effect":
                properties.shapeRoundedCornerRadius = settings.effect.shapeRoundedCornerRadius
                properties.state = settings.effect.state
                properties.hoverStyling = settings.effect.hoverStyling
                properties.shadow = settings.effect.shadow
                if (settings.effect.shadow)
                    properties = { ...properties, ...this.getEnumeratedStateProperties(settings.effect, "shadow") }
                properties.glow = settings.effect.glow
                if (settings.effect.glow)
                    properties = { ...properties, ...this.getEnumeratedStateProperties(settings.effect, "glow") }
                break
            case "content":
                properties = { ...properties, ...settings.content }
                break
            case "bgimg":
                properties.bgimgs = settings.bgimg.bgimgs
                if (settings.bgimg.bgimgs)
                    properties = { ...properties, ...this.getEnumeratedStateProperties(settings.bgimg) }
                break
            case "presetStyle":
                properties = { ...properties, ...settings.presetStyle }
                break
        }

        objectEnumeration.push({
            objectName: objectName,
            properties: properties,
            selector: null
        })

        return objectEnumeration
    }

    public options: VisualUpdateOptions;

    public update(options: VisualUpdateOptions) {
        if (!(options
            && options.dataViews
            && options.dataViews[0]
            && options.dataViews[0].categorical
            && options.dataViews[0].categorical.categories
        ))
            return
        this.options = options
        this.visualSettings = VisualSettings.parse(options.dataViews[0]) as VisualSettings

        let objects: powerbi.VisualObjectInstancesToPersist = getObjectsToPersist(this.visualSettings,
            this.visualSettings.presetStyle.preset,
            this.visualSettings.presetStyle.preset != this.currentPresetStyle || this.visualSettings.presetStyle.color != this.currentPresetBaseColor)
        this.currentPresetStyle = this.visualSettings.presetStyle.preset
        this.currentPresetBaseColor = this.visualSettings.presetStyle.color
        if (objects.merge.length != 0)
            this.host.persistProperties(objects);

        this.slicerCollection.formatSettings.tile = this.visualSettings.tile
        this.slicerCollection.formatSettings.text = this.visualSettings.text
        this.slicerCollection.formatSettings.icon = this.visualSettings.icon
        this.slicerCollection.formatSettings.layout = this.visualSettings.layout
        this.slicerCollection.formatSettings.contentAlignment = this.visualSettings.contentAlignment
        this.slicerCollection.formatSettings.effect = this.visualSettings.effect

        this.slicerCollection.viewport = {
            height: options.viewport.height,
            width: options.viewport.width,
        }


        if (options.type == VisualUpdateType.Resize || options.type == VisualUpdateType.ResizeEnd) {
            this.slicerCollection.onResize()
        } else {
            console.log("objects length", objects.merge.length, objects.merge)
            if (objects.merge.length == 0)
                this.slicerCollection.onDataChange(this.createSlicerData())
        }
    }

    public createSlicerData(): SlicerData[] {
        let slicerData: SlicerData[] = []

        let contentFormatType = ContentFormatType.empty
        if (this.visualSettings.text.show && !this.visualSettings.icon.show)
            contentFormatType = ContentFormatType.text
        if (!this.visualSettings.text.show && this.visualSettings.icon.show)
            contentFormatType = ContentFormatType.icon
        if (this.visualSettings.text.show && this.visualSettings.icon.show)
            contentFormatType = ContentFormatType.text_icon


        let dataView = this.options.dataViews[0]
        let allCategories: powerbi.DataViewCategoryColumn[] = dataView.categorical.categories;
        let categories = allCategories[0]
        let values: powerbi.DataViewValueColumn = dataView.categorical.values && dataView.categorical.values[0]
        let highlights: powerbi.PrimitiveValue[] = values && values.highlights

        let selectionIdKeys: string[] = (this.selectionManager.getSelectionIds() as powerbi.visuals.ISelectionId[]).map(x => x.getKey()) as string[]
        if(selectionIdKeys.indexOf(undefined) == -1)
            this.selectionIdKeys = selectionIdKeys

        let indexesToRender: number[] = []
        if (highlights) {
            switch (this.visualSettings.content.disabledMode) {
                case DisabledMode.hide:
                    for (let i = 0; i < highlights.length; i++) {
                        if (highlights[i])
                            indexesToRender.push(i)
                    }
                    break
                case DisabledMode.bottom:
                    let highlighted = []
                    let nonhighlighted = []
                    for (let i = 0; i < highlights.length; i++) {
                        if (highlights[i])
                            highlighted.push(i)
                        else
                            nonhighlighted.push(i)
                    }
                    indexesToRender = highlighted.concat(nonhighlighted)
                    break
                case DisabledMode.inplace:
                    indexesToRender = [...Array(highlights.length).keys()]
            }
        } else {
            indexesToRender = [...Array(categories.values.length).keys()]
        }

        indexesToRender.forEach((i, index) => {
            let categoryInstance: string = categories.values[i].toString();
            let instanceValue = values && values.values && values.values[i] as number
            let instanceHighlight = highlights && (highlights[i] || 0) as number

            let iconURL: string = allCategories[1] ? allCategories[1].values[i].toString() : "";
            let bgImgURL: string = allCategories[2] ? allCategories[2].values[i].toString() : "";
            let tileSelectionId = this.host.createSelectionIdBuilder()
                .withCategory(categories, i)
                .createSelectionId();

            slicerData.push({
                text: categoryInstance + (values ? ", " + (highlights ? instanceHighlight : instanceValue) : ""),
                iconURL: this.visualSettings.icon.show ? iconURL : "",
                bgimgURL: this.visualSettings.bgimg.bgimgs ? bgImgURL : "",
                contentFormatType: contentFormatType,
                selectionId: tileSelectionId,
                isHovered: this.hoveredIndex == index,
                isDisabled: (highlights ? instanceHighlight : instanceValue) == 0,
                isSelected: this.selectionIdKeys.indexOf(tileSelectionId.getKey() as string) > -1
            });
        })
        return slicerData
    }



    private static parseSettings(dataView: DataView): VisualSettings {
        return <VisualSettings>VisualSettings.parse(dataView);
    }
}