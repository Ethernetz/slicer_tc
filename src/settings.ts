/*
 *  Power BI Visualizations
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

import { dataViewObjectsParser } from "powerbi-visuals-utils-dataviewutils";
import DataViewObjectsParser = dataViewObjectsParser.DataViewObjectsParser;
import * as TileCollectionFormatSettings from "./TilesCollection/FormatSettings"
import { StatesUsed } from "./TilesCollection/interfaces";
import { DisabledMode } from './enums'
import { PresetStyle } from "./TilesCollection/enums";

export class TileFillSettings extends TileCollectionFormatSettings.TileFillSettings {
  public statesUsed: StatesUsed = {
    selected: true,
    unselected: true,
    hover: true,
    disabled: true
  }
}
export class TileStrokeSettings extends TileCollectionFormatSettings.TileStrokeSettings{
  public statesUsed: StatesUsed = {
    selected: true,
    unselected: true,
    hover: true,
    disabled: true
  }
}

export class TextSettings extends TileCollectionFormatSettings.TextSettings {
  public statesUsed: StatesUsed = {
    selected: true,
    unselected: true,
    hover: true,
    disabled: true
  }
}

export class IconSettings extends TileCollectionFormatSettings.IconSettings {
  public statesUsed: StatesUsed = {
    selected: true,
    unselected: true,
    hover: true,
    disabled: true
  }
}

export class ShapeSettings extends TileCollectionFormatSettings.ShapeSettings{
}

export class LayoutSettings extends TileCollectionFormatSettings.LayoutSettings {
  public padding: number = 2;
}

export class ContentAlignmentSettings extends TileCollectionFormatSettings.ContentAlignmentSettings{
  public statesUsed: StatesUsed = {
    selected: true,
    unselected: true,
    hover: true,
    disabled: true
  }
}

export class EffectSettings extends TileCollectionFormatSettings.EffectSettings {
  public statesUsed: StatesUsed = {
    selected: true,
    unselected: true,
    hover: true,
    disabled: true
  }
}

export class ContentSettings {
  public multiselect: boolean = false
  public disabledMode: DisabledMode = DisabledMode.bottom
}

export class PresetStyleSettings{
  public color: string = "#41A4FF"
  public preset: PresetStyle = PresetStyle.none
}

export class VisualSettings extends DataViewObjectsParser {
  public tileFill: TileFillSettings = new TileFillSettings();
  public tileStroke: TileStrokeSettings = new TileStrokeSettings();
  public text: TextSettings = new TextSettings();
  public icon: IconSettings = new IconSettings();
  public shape: ShapeSettings = new ShapeSettings();
  public layout: LayoutSettings = new LayoutSettings();
  public content: ContentSettings = new ContentSettings();
  public contentAlignment: ContentAlignmentSettings = new ContentAlignmentSettings();
  public effect: EffectSettings = new EffectSettings();
  public presetStyle: PresetStyleSettings = new PresetStyleSettings()
}