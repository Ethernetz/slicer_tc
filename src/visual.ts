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
import VisualObjectInstanceEnumerationObject = powerbi.VisualObjectInstanceEnumerationObject


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

import { SlicerCollection } from './SlicerCollection'
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

    constructor(options: VisualConstructorOptions) {
        this.selectionIdBuilder = options.host.createSelectionIdBuilder();
        this.selectionManager = options.host.createSelectionManager();
        this.host = options.host;
        options.element.style.overflow = 'auto';
        options.element.style.fontSize = "0px"
        this.svg = d3.select(options.element)
            .append('svg')
            .classed('navigator', true);

        this.container = this.svg.append("g")
            .classed('container', true);
    }

    public enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstanceEnumeration {
        const settings: VisualSettings = this.visualSettings || <VisualSettings>VisualSettings.getDefault();
        let settingsKeys = Object.keys(settings)
        for (let i = 0; i < settingsKeys.length; i++) {
            let settingKey: string = settingsKeys[i]
            let groupedKeyNamesArr: PropertyGroupKeys[] = getPropertyStateNameArr(Object.keys(settings[settingKey]))
            for (let j = 0; j < groupedKeyNamesArr.length; j++) {
                let groupedKeyNames: PropertyGroupKeys = groupedKeyNamesArr[j]
                switch (settings[settingKey].state) {
                    case State.all:
                        delete settings[settingKey][groupedKeyNames.selected]
                        delete settings[settingKey][groupedKeyNames.unselected]
                        delete settings[settingKey][groupedKeyNames.hover]
                        delete settings[settingKey][groupedKeyNames.disabled]
                        break
                    case State.selected:
                        delete settings[settingKey][groupedKeyNames.all]
                        delete settings[settingKey][groupedKeyNames.unselected]
                        delete settings[settingKey][groupedKeyNames.hover]
                        delete settings[settingKey][groupedKeyNames.disabled]
                        break
                    case State.unselected:
                        delete settings[settingKey][groupedKeyNames.all]
                        delete settings[settingKey][groupedKeyNames.selected]
                        delete settings[settingKey][groupedKeyNames.hover]
                        delete settings[settingKey][groupedKeyNames.disabled]
                        break
                    case State.hovered:
                        delete settings[settingKey][groupedKeyNames.all]
                        delete settings[settingKey][groupedKeyNames.selected]
                        delete settings[settingKey][groupedKeyNames.unselected]
                        delete settings[settingKey][groupedKeyNames.disabled]
                        break
                    case State.disabled:
                        delete settings[settingKey][groupedKeyNames.all]
                        delete settings[settingKey][groupedKeyNames.selected]
                        delete settings[settingKey][groupedKeyNames.unselected]
                        delete settings[settingKey][groupedKeyNames.hover]
                        break
                }
            }
        }
        let iconSettingsKeys: string[] = Object.keys(settings.icon)
        if (!settings.icon.icons)
            for (let i = 0; i < iconSettingsKeys.length; i++)
                if (iconSettingsKeys[i] != 'icons')
                    delete settings.icon[iconSettingsKeys[i]]
        let effectSettingsKeys: string[] = Object.keys(settings.effects)
        if (!settings.effects.shadow)
            for (let i = 0; i < effectSettingsKeys.length; i++)
                if (effectSettingsKeys[i].startsWith("shadow") && effectSettingsKeys[i] != "shadow")
                    delete settings.effects[effectSettingsKeys[i]]
        if (!settings.effects.glow)
            for (let i = 0; i < effectSettingsKeys.length; i++)
                if (effectSettingsKeys[i].startsWith("glow") && effectSettingsKeys[i] != "glow")
                    delete settings.effects[effectSettingsKeys[i]]



        let iconPlacement = settings.icon[getCorrectPropertyStateName(settings.icon.state, 'placement')] as IconPlacement
        if (iconPlacement == IconPlacement.left) {
            delete settings.icon[getCorrectPropertyStateName(settings.icon.state, "topMargin")]
            delete settings.icon[getCorrectPropertyStateName(settings.icon.state, "bottomMargin")]
        }
        if (!(settings.icon.icons && iconPlacement == IconPlacement.above))
            delete settings.text[getCorrectPropertyStateName(settings.text.state, "bmargin")]

        if (settings.layout.sizingMethod != TileSizingType.fixed) {
            delete settings.layout.tileWidth;
            delete settings.layout.tileHeight;
            delete settings.layout.tileAlignment;
        }
        if (settings.layout.tileLayout != TileLayoutType.grid) {
            delete settings.layout.rowLength
        }

        if (settings.layout.tileShape != TileShape.parallelogram) {
            delete settings.layout.parallelogramAngle
        }
        if (settings.layout.tileShape != TileShape.chevron) {
            delete settings.layout.chevronAngle
        }
        if (settings.layout.tileShape != TileShape.pentagon) {
            delete settings.layout.pentagonAngle
        }
        if (settings.layout.tileShape != TileShape.hexagon) {
            delete settings.layout.hexagonAngle
        }
        if (settings.layout.tileShape != TileShape.tab_cutCorners) {
            delete settings.layout.tab_cutCornersLength
        }
        if (settings.layout.tileShape != TileShape.tab_cutCorner) {
            delete settings.layout.tab_cutCornerLength
        }

        return VisualSettings.enumerateObjectInstances(settings, options);
    }

    public update(options: VisualUpdateOptions) {
        if (!(options
            && options.dataViews
            && options.dataViews[0]
            && options.dataViews[0].categorical
            && options.dataViews[0].categorical.categories
        ))
            return
        this.visualSettings = VisualSettings.parse(options.dataViews[0]) as VisualSettings

        let objects: powerbi.VisualObjectInstancesToPersist = getObjectsToPersist(this.visualSettings,
            this.visualSettings.presetStyle.preset,
            this.visualSettings.presetStyle.preset != this.currentPresetStyle || this.visualSettings.presetStyle.color != this.currentPresetBaseColor)
        this.currentPresetStyle = this.visualSettings.presetStyle.preset
        this.currentPresetBaseColor = this.visualSettings.presetStyle.color
        if (objects.merge.length != 0)
            this.host.persistProperties(objects);

        let slicersCollection = new SlicerCollection()

        slicersCollection.formatSettings.tile = this.visualSettings.tile
        slicersCollection.formatSettings.text = this.visualSettings.text
        slicersCollection.formatSettings.icon = this.visualSettings.icon
        slicersCollection.formatSettings.layout = this.visualSettings.layout
        slicersCollection.formatSettings.effect = this.visualSettings.effects

        slicersCollection.svg = this.svg
        slicersCollection.container = this.container
        slicersCollection.viewport = {
            height: options.viewport.height,
            width: options.viewport.width,
        }
        slicersCollection.visual = this
        slicersCollection.options = options


        let dataView = options.dataViews[0]
        let allCategories: powerbi.DataViewCategoryColumn[] = dataView.categorical.categories;
        let categories = allCategories[0]
        let values: powerbi.DataViewValueColumn = dataView.categorical.values && dataView.categorical.values[0]
        let highlights: powerbi.PrimitiveValue[] = values && values.highlights
        let selectionIdKeys: string[] = (this.selectionManager.getSelectionIds() as powerbi.visuals.ISelectionId[]).map(x => x.getKey()) as string[]

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


        indexesToRender.forEach(i=>{
            let categoryInstance: string = categories.values[i].toString();
            let instanceValue = values && values.values && values.values[i] as number
            let instanceHighlight = highlights && (highlights[i] || 0) as number

            let iconURL: string = allCategories[1] ? allCategories[1].values[i].toString() : "";
            let bgImgURL: string = allCategories[2] ? allCategories[2].values[i].toString() : "";
            let tileSelectionId = this.host.createSelectionIdBuilder()
                .withCategory(categories, i)
                .createSelectionId();
            slicersCollection.tilesData.push({
                text: categoryInstance + (values ? ", " + (highlights ? instanceHighlight : instanceValue) : ""),
                iconURL: this.visualSettings.icon.icons ? iconURL : "",
                bgimgURL: this.visualSettings.bgimg.bgimgs ? bgImgURL : "",
                contentFormatType: this.visualSettings.icon.icons ? ContentFormatType.text_icon : ContentFormatType.text,
                selectionId: tileSelectionId,
                isHovered: this.hoveredIndex == i,
                isDisabled: (highlights ? instanceHighlight : instanceValue) == 0,
                get isSelected(): boolean {
                    return this.selectionId &&
                        selectionIdKeys &&
                        selectionIdKeys.indexOf(this.selectionId.getKey() as string) > -1
                }
            });
        })
        slicersCollection.render()
    }



    private static parseSettings(dataView: DataView): VisualSettings {
        return <VisualSettings>VisualSettings.parse(dataView);
    }
}