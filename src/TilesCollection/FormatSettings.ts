import {Viewport, StatesUsed} from './interfaces'
import {AlignmentType, TileSizingType, TileLayoutType, TileShape, Direction, IconPlacement, State} from './enums'

export class FormatSettings{
  public tile: TileSettings = new TileSettings();
  public text: TextSettings = new TextSettings();
  public layout: LayoutSettings = new LayoutSettings();
  public effect: EffectSettings = new EffectSettings();
  public icon: IconSettings = new IconSettings();
  viewport: Viewport
}

export interface TileCollectionStatedFormatObject{
  state: State,
  statesUsed: StatesUsed
}


export class TileSettings implements TileCollectionStatedFormatObject{
    public state: State = State.all
    public statesUsed: StatesUsed = {
      selected: true,
      unselected: true,
      hover: true,
      disabled: false
    }
    public hoverStyling: boolean = false

    public colorD: string = "#262222" 
    public colorA: string = "";
    public colorS: string = null;
    public colorU: string = null;
    public colorH: string = null;
    public colorN: string = null;
  
    public strokeD: string = "#000";
    public strokeA: string = "";
    public strokeS: string = null;
    public strokeU: string = null;
    public strokeH: string = null;
    public strokeN: string = null;
  
    public strokeWidthD: number = 0;
    public strokeWidthA: number = null;
    public strokeWidthS: number = null;
    public strokeWidthU: number = null;
    public strokeWidthH: number = null;
    public strokeWidthN: number = null;
  
    public transparencyD: number = 0;
    public transparencyA: number = null;
    public transparencyS: number = null;
    public transparencyU: number = null;
    public transparencyH: number = null; 
    public transparencyN: number = null; 
  }

  export class TextSettings implements TileCollectionStatedFormatObject{
    public state: State = State.all
    public statesUsed: StatesUsed = {
      selected: true,
      unselected: true,
      hover: true,
      disabled: false
    }
    public hoverStyling: boolean = false

    public colorD: string = "#fff";
    public colorA: string = "";
    public colorS: string = null;
    public colorU: string = null;
    public colorH: string = null;
    public colorN: string = null;
  
    public alignmentD: AlignmentType = AlignmentType.center;
    public alignmentA: AlignmentType = null;
    public alignmentS: AlignmentType = null;
    public alignmentU: AlignmentType = null;
    public alignmentH: AlignmentType = null;
    public alignmentN: AlignmentType = null;
  
    public fontSizeD: number = 14;
    public fontSizeA: number = null;
    public fontSizeS: number = null;
    public fontSizeU: number = null;
    public fontSizeH: number = null;
    public fontSizeN: number = null;

    public fontFamilyD: string = "wf_standard-font, helvetica, arial, sans-serif";
    public fontFamilyA: string = "";
    public fontFamilyS: string = null;
    public fontFamilyU: string = null;
    public fontFamilyH: string = null;
    public fontFamilyN: string = null;

    public marginLeftD: number = 0
    public marginLeftA: number = null
    public marginLeftS: number = null
    public marginLeftU: number = null
    public marginLeftH: number = null
    public marginLeftN: number = null

    public marginRightD: number = 0
    public marginRightA: number = null
    public marginRightS: number = null
    public marginRightU: number = null
    public marginRightH: number = null
    public marginRightN: number = null

    public bmarginD: number = 0
    public bmarginA: number = null
    public bmarginS: number = null;
    public bmarginU: number = null;
    public bmarginH: number = null;
    public bmarginN: number = null;
    
    public transparencyD: number = 0;
    public transparencyA: number = null;
    public transparencyS: number = null;
    public transparencyU: number = null;
    public transparencyH: number = null;
    public transparencyN: number = null;
   
  }

  export class LayoutSettings{
    public tileShape: TileShape = TileShape.rectangle
    
    public parallelogramAngle: number = 80
    public chevronAngle: number = 60
    public pentagonAngle: number = 60
    public hexagonAngle: number = 60
    public tab_cutCornersLength: number = 20
    public tab_cutCornerLength: number = 20
  
    public sizingMethod: TileSizingType = TileSizingType.uniform;
    public tileWidth: number = 150;
    public tileHeight: number = 75;
    public autoHeight: boolean = false;
    public tileAlignment: AlignmentType = AlignmentType.left
    public tileLayout: TileLayoutType = TileLayoutType.horizontal;
    public rowLength: number = 2;
    public padding: number = 10;
  }

  export class EffectSettings implements TileCollectionStatedFormatObject{
    public state: State = State.all
    public statesUsed: StatesUsed = {
      selected: true,
      unselected: true,
      hover: true,
      disabled: false
    }
    public shapeRoundedCornerRadius: number = 0 
    public hoverStyling: boolean = false
  

    public shadow: boolean = false;
  
    public shadowColorD: string = "#000"
    public shadowColorA: string = "";
    public shadowColorS: string = null;
    public shadowColorU: string = null;
    public shadowColorH: string = null;
    public shadowColorN: string = null;
    
    public shadowTransparencyD: number = 70
    public shadowTransparencyA: number = null;
    public shadowTransparencyS: number = null;
    public shadowTransparencyU: number = null;
    public shadowTransparencyH: number = null;
    public shadowTransparencyN: number = null;
  
    public shadowDirectionD: Direction = Direction.bottom_right
    public shadowDirectionA: Direction = null;
    public shadowDirectionS: Direction = null;
    public shadowDirectionU: Direction = null;
    public shadowDirectionH: Direction = null;
    public shadowDirectionN: Direction = null;

    public shadowDistanceD: number = 2
    public shadowDistanceA: number = null;
    public shadowDistanceS: number = null;
    public shadowDistanceU: number = null;
    public shadowDistanceH: number = null;
    public shadowDistanceN: number = null;
  
    public shadowStrengthD: number = 4
    public shadowStrengthA: number = null;
    public shadowStrengthS: number = null;
    public shadowStrengthU: number = null;
    public shadowStrengthH: number = null;
    public shadowStrengthN: number = null;
  
    public glow: boolean = false;
  
    public glowColorD: string = "#41A4FF"
    public glowColorA: string = "";
    public glowColorS: string = null;
    public glowColorU: string = null;
    public glowColorH: string = null;
    public glowColorN: string = null;
  
    public glowTransparencyD: number = 0
    public glowTransparencyA: number = null
    public glowTransparencyS: number = null 
    public glowTransparencyU: number = null
    public glowTransparencyH: number = null
    public glowTransparencyN: number = null
    
    public glowStrengthD: number = 2
    public glowStrengthA: number = null
    public glowStrengthS: number = null
    public glowStrengthU: number = null
    public glowStrengthH: number = null
    public glowStrengthN: number = null
  }

  export class IconSettings implements TileCollectionStatedFormatObject{
    public icons: boolean = false;
    public state: State = State.all
    public statesUsed: StatesUsed = {
      selected: true,
      unselected: true,
      hover: true,
      disabled: false
    }
    public hoverStyling: boolean = false
  
    public placementD: IconPlacement = IconPlacement.left;
    public placementA: IconPlacement = null;
    public placementS: IconPlacement = null;
    public placementU: IconPlacement = null;
    public placementH: IconPlacement = null;
    public placementN: IconPlacement = null;
  
    public widthD: number = 40;
    public widthA: number = null;
    public widthS: number = null;
    public widthU: number = null;
    public widthH: number = null;
    public widthN: number = null;
  
    public hmarginD: number = 10;
    public hmarginA: number = null;
    public hmarginS: number = null;
    public hmarginU: number = null;
    public hmarginH: number = null;
    public hmarginN: number = null;
  
    public topMarginD: number = 10;
    public topMarginA: number = null;
    public topMarginS: number = null;
    public topMarginU: number = null;
    public topMarginH: number = null;
    public topMarginN: number = null;
  
    public bottomMarginD: number = 10;
    public bottomMarginA: number = null;
    public bottomMarginS: number = null;
    public bottomMarginU: number = null;
    public bottomMarginH: number = null;
    public bottomMarginN: number = null;
  
    public transparencyD: number = 0;
    public transparencyA: number = null;
    public transparencyS: number = null;
    public transparencyU: number = null;
    public transparencyH: number = null;
    public transparencyN: number = null;
  }