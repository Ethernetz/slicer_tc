import {BoundingBox, Handle} from "./interfaces"
import {roundPathCorners} from "./shape-rounding"
import {round} from './functions'
export class Shape{
    xPos: number
    yPos: number
    width: number
    height: number
    radius: number
    alterVPadding: number = 0
    // alterHPadding: number = 0
    static handleFocused: boolean = false
    constructor(xPos: number, yPos: number, width: number, height: number, radius?: number){
        this.xPos = xPos
        this.yPos = yPos
        this.width = width
        this.height = height
        this.radius = radius
    }

    get strokePath(): string{
        return this.shapePath
    }

    get handles(): any[]{
        return []
    }
}

export interface Shape{
    xPos: number,
    yPosd: number,
    width: number,
    height: number,
    shapePath: string,
    strokePath: string,
    contentBoundingBox: BoundingBox,
    handles: any[]
}


export class Rectangle extends Shape implements Shape{
    constructor(xPos: number, yPos: number, width: number, height: number, radius: number){
        super(xPos, yPos, width, height, radius)
    }

    get shapePath(): string{
        let path = new Path()
        path.MoveTo(this.xPos, this.yPos)
        path.DrawTo(this.xPos + this.width, this.yPos)
        path.DrawTo(this.xPos + this.width, this.yPos + this.height)
        path.DrawTo(this.xPos, this.yPos + this.height)
        path.close()
        path.roundCorners(this.radius)
        return path.toString()
    }

    get contentBoundingBox(): BoundingBox{
        return {
            x: this.xPos,
            y: this.yPos,
            width: this.width,
            height: this.height
        }
    }
}

export class Parallelogram extends Shape implements Shape{
    static _z: number;
    angle: number
    constructor(xPos: number, yPos: number, width: number, height: number, angle: number, radius: number){
        super(xPos, yPos, width, height, radius)
        this.angle = angle
        if(!Shape.handleFocused)
            Parallelogram._z = this.height/Math.tan(angle*(Math.PI/180))
    }

    get shapePath(): string{
        let path = new Path()
        path.MoveTo(this.xPos + Parallelogram._z, this.yPos)
        path.DrawTo(this.xPos + this.width, this.yPos)
        path.DrawTo(this.xPos + this.width - Parallelogram._z, this.yPos + this.height)
        path.DrawTo(this.xPos, this.yPos + this.height)
        path.close()
        path.roundCorners(this.radius)
        return path.toString()
    }

    get contentBoundingBox(): BoundingBox{
        return {
            x: this.xPos + Parallelogram._z,
            y: this.yPos,
            width: this.width - 2*Parallelogram._z,
            height: this.height
        }
    }

    get handles(): Handle[]{
        let handles: Handle[] = [
            {
                buttonXPos: this.xPos,
                buttonYPos: this.yPos,
                buttonWidth: this.width,
                buttonHeight: this.height,
                get xPos(): number {
                    return this.buttonXPos + this.z
                }, 
                get yPos(): number {
                    return this.buttonYPos
                },
                axis: 'x',
                propName: 'parallelogramAngle',
                get z(): number {
                    return Parallelogram._z
                },
                set z(x: number){
                    Parallelogram._z = x
                },
                get disp(): number {
                    return round(Math.atan(this.buttonHeight/this.z) * (180 / Math.PI))
                },
                get handleFocused(): boolean{
                    return Shape.handleFocused
                },
                set handleFocused(b: boolean){
                    Shape.handleFocused = b
                }
            }
        ]
        return handles
    }
    static getAlterHPadding(height: number, angle: number): number{
        if(this.handleFocused)
            return -1 * Parallelogram._z
        return -1* height / Math.tan(angle * (Math.PI / 180))
    }
}

export class ParallelogramVertical extends Shape implements Shape{
    static _z: number;
    angle: number;
    constructor(xPos: number, yPos: number, width: number, height: number, angle: number, radius: number){
        super(xPos, yPos, width, height, radius)
        this.angle = angle
        if(!Shape.handleFocused)
            ParallelogramVertical._z = this.width/Math.tan(angle*(Math.PI/180))
    }

    get shapePath(): string{
        let path = new Path()
        path.MoveTo(this.xPos, this.yPos)
        path.DrawTo(this.xPos + this.width, this.yPos + ParallelogramVertical._z )
        path.DrawTo(this.xPos + this.width , this.yPos + this.height)
        path.DrawTo(this.xPos, this.yPos + this.height -  ParallelogramVertical._z )
        path.close()
        path.roundCorners(this.radius)
        return path.toString()
    }

    get contentBoundingBox(): BoundingBox{
        return {
            x: this.xPos,
            y: this.yPos + ParallelogramVertical._z,
            width: this.width,
            height: this.height - 2*ParallelogramVertical._z
        }
    }
    get handles(): Handle[]{
        let handles: Handle[] = [
            {
                buttonXPos: this.xPos,
                buttonYPos: this.yPos,
                buttonWidth: this.width,
                buttonHeight: this.height,
                get xPos(): number {
                    return this.buttonXPos + this.buttonWidth
                }, 
                get yPos(): number {
                    return this.buttonYPos + this.z
                },
                axis: 'y',
                propName: 'parallelogramAngle',
                get z(): number {
                    return ParallelogramVertical._z
                },
                set z(x: number){
                    ParallelogramVertical._z = x
                },
                get disp(): number {
                    return round(Math.atan(this.buttonWidth/this.z) * (180 / Math.PI))
                },
                get handleFocused(): boolean{
                    return Shape.handleFocused
                },
                set handleFocused(b: boolean){
                    Shape.handleFocused = b
                }
            }
        ]
        return handles
    }

    static getAlterVPadding(width: number, angle: number): number{
        if(this.handleFocused)
            return -1 * ParallelogramVertical._z
        return -1* width/Math.tan(angle*(Math.PI/180))
    }
}

export class Chevron extends Shape implements Shape{
    static _z: number;
    angle: number
    constructor(xPos: number, yPos: number, width: number, height: number, angle: number, radius: number){
        super(xPos, yPos, width, height, radius)
        this.angle = angle
        if(!Shape.handleFocused)
            Chevron._z = (0.5*this.height)/Math.tan(angle*(Math.PI/180))
    }

    get shapePath(): string{
        let path = new Path()
        path.MoveTo(this.xPos, this.yPos)
        path.DrawTo(this.xPos + this.width - Chevron._z, this.yPos)
        path.DrawTo(this.xPos + this.width, this.yPos + 0.5*this.height)
        path.DrawTo(this.xPos + this.width - Chevron._z , this.yPos + this.height)
        path.DrawTo(this.xPos, this.yPos + this.height)
        path.DrawTo(this.xPos + Chevron._z , this.yPos + 0.5*this.height)
        path.close()
        path.roundCorners(this.radius)
        return path.toString()
    }

    get contentBoundingBox(): BoundingBox{
        return {
            x: this.xPos + Chevron._z,
            y: this.yPos,
            width: this.width - 2*Chevron._z,
            height: this.height
        }
    }
    get handles(): Handle[]{
        let handles: Handle[] = [
            {
                buttonXPos: this.xPos,
                buttonYPos: this.yPos,
                buttonWidth: this.width,
                buttonHeight: this.height,
                get xPos(): number {
                    return this.buttonXPos + this.buttonWidth - this.z
                }, 
                get yPos(): number {
                    return this.buttonYPos
                },
                axis: 'x',
                propName: 'chevronAngle',
                get z(): number {
                    return Chevron._z
                },
                set z(x: number){
                    Chevron._z = this.buttonWidth - x
                },
                get disp(): number {
                    return round(Math.atan(this.buttonHeight/(2*this.z)) * (180 / Math.PI))
                },
                get handleFocused(): boolean{
                    return Shape.handleFocused
                },
                set handleFocused(b: boolean){
                    Shape.handleFocused = b
                }
            }
        ]
        return handles
    }
    static getAlterHPadding(height: number, angle: number): number{
        if(this.handleFocused)
            return -1*Chevron._z
        return -1 *(0.5 * height) / Math.tan(angle * (Math.PI / 180))
    }
}

export class ChevronVertical extends Shape implements Shape{
    static _z: number;
    angle: number
    constructor(xPos: number, yPos: number, width: number, height: number, angle: number, radius: number){
        super(xPos, yPos, width, height, radius)
        this.angle = angle
        if(!Shape.handleFocused)
            ChevronVertical._z = (0.5*this.width)/Math.tan(angle*(Math.PI/180))
    }

    get shapePath(): string{
        let path = new Path()
        path.MoveTo(this.xPos, this.yPos)
        path.DrawTo(this.xPos + 0.5*this.width, this.yPos + ChevronVertical._z)
        path.DrawTo(this.xPos + this.width, this.yPos)
        path.DrawTo(this.xPos + this.width, this.yPos + this.height - ChevronVertical._z)
        path.DrawTo(this.xPos + 0.5*this.width, this.yPos + this.height)
        path.DrawTo(this.xPos, this.yPos + this.height - ChevronVertical._z)
        path.close()
        path.roundCorners(this.radius)
        return path.toString()
    }

    get contentBoundingBox(): BoundingBox{
        return {
            x: this.xPos,
            y: this.yPos + ChevronVertical._z,
            width: this.width,
            height: this.height - 2*ChevronVertical._z
        }
    }
    get handles(): Handle[]{
        let handles: Handle[] = [
            {
                buttonXPos: this.xPos,
                buttonYPos: this.yPos,
                buttonWidth: this.width,
                buttonHeight: this.height,
                get xPos(): number {
                    return this.buttonXPos + this.buttonWidth
                }, 
                get yPos(): number {
                    return this.buttonYPos + this.buttonHeight - this.z
                },
                axis: 'y',
                propName: 'chevronAngle',
                get z(): number {
                    return ChevronVertical._z
                },
                set z(x: number){
                    ChevronVertical._z = this.buttonHeight - x
                },
                get disp(): number {
                    return round(Math.atan(this.buttonWidth/(2*this.z)) * (180 / Math.PI))
                },
                get handleFocused(): boolean{
                    return Shape.handleFocused
                },
                set handleFocused(b: boolean){
                    Shape.handleFocused = b
                }
            }
        ]
        return handles
    }
    static getAlterVPadding(width: number, angle: number): number{
        if(this.handleFocused)
            return -1 * ChevronVertical._z
        return -1* (0.5 * width) / Math.tan(angle * (Math.PI / 180))
    }
}

export class Pentagon extends Shape implements Shape{
    static _z: number;
    constructor(xPos: number, yPos: number, width: number, height: number, angle: number, radius: number){
        super(xPos, yPos, width, height, radius)
        if(!Shape.handleFocused)
            Pentagon._z = 0.5*this.height/Math.tan(angle*(Math.PI/180))
    }

    get shapePath(): string{
        let path = new Path()
        path.MoveTo(this.xPos, this.yPos)
        path.DrawTo(this.xPos + this.width - Pentagon._z, this.yPos)
        path.DrawTo(this.xPos + this.width, this.yPos + 0.5*this.height)
        path.DrawTo(this.xPos + this.width - Pentagon._z, this.yPos + this.height)
        path.DrawTo(this.xPos, this.yPos + this.height)
        path.close()
        path.roundCorners(this.radius)
        return path.toString()
    }

    get contentBoundingBox(): BoundingBox{
        return {
            x: this.xPos,
            y: this.yPos,
            width: this.width - Pentagon._z,
            height: this.height
        }
    }

    get handles(): Handle[]{
        let handles: Handle[] = [
            {
                buttonXPos: this.xPos,
                buttonYPos: this.yPos,
                buttonWidth: this.width,
                buttonHeight: this.height,
                get xPos(): number {
                    return this.buttonXPos + this.buttonWidth - this.z
                }, 
                get yPos(): number {
                    return this.buttonYPos
                },
                axis: 'x',
                propName: 'pentagonAngle',
                get z(): number {
                    return Pentagon._z
                },
                set z(x: number){
                    Pentagon._z = this.buttonWidth - x
                },
                get disp(): number {
                    return round(Math.atan(this.buttonHeight/(2*this.z)) * (180 / Math.PI))
                },
                get handleFocused(): boolean{
                    return Shape.handleFocused
                },
                set handleFocused(b: boolean){
                    Shape.handleFocused = b
                }
            }
        ]
        return handles
    }
}

export class Hexagon extends Shape implements Shape{
    static _z: number;
    constructor(xPos: number, yPos: number, width: number, height: number, angle: number, radius: number){
        super(xPos, yPos, width, height, radius)
        if(!Shape.handleFocused)
            Hexagon._z = 0.5*this.height/Math.tan(angle*(Math.PI/180))
    }

    get shapePath(): string{
        let path = new Path()
        path.MoveTo(this.xPos + Hexagon._z, this.yPos)
        path.DrawTo(this.xPos + this.width - Hexagon._z, this.yPos)
        path.DrawTo(this.xPos + this.width, this.yPos + 0.5*this.height)
        path.DrawTo(this.xPos + this.width - Hexagon._z, this.yPos + this.height)
        path.DrawTo(this.xPos + Hexagon._z, this.yPos + this.height)
        path.DrawTo(this.xPos, this.yPos + 0.5*this.height)
        path.close()
        path.roundCorners(this.radius)
        return path.toString()
    }

    get contentBoundingBox(): BoundingBox{
        return {
            x: this.xPos + Hexagon._z,
            y: this.yPos,
            width: this.width - 2*Hexagon._z,
            height: this.height
        }
    }

    get handles(): Handle[]{
        let handles: Handle[] = [
            {
                buttonXPos: this.xPos,
                buttonYPos: this.yPos,
                buttonWidth: this.width,
                buttonHeight: this.height,
                get xPos(): number {
                    return this.buttonXPos + this.buttonWidth - this.z
                }, 
                get yPos(): number {
                    return this.buttonYPos
                },
                axis: 'x',
                propName: 'hexagonAngle',
                get z(): number {
                    return Hexagon._z
                },
                set z(x: number){
                    Hexagon._z = this.buttonWidth - x
                },
                get disp(): number {
                    return round(Math.atan(this.buttonHeight/(2*this.z)) * (180 / Math.PI))
                },
                get handleFocused(): boolean{
                    return Shape.handleFocused
                },
                set handleFocused(b: boolean){
                    Shape.handleFocused = b
                }
            }
        ]
        return handles
    }
}

export class Ellipse extends Shape implements Shape{
    constructor(xPos: number, yPos: number, width: number, height: number){
        super(xPos, yPos, width, height)
    }

    get shapePath(): string{
        let rx =  0.5*this.width
        let ry = 0.5*this.height
        let cx = this.xPos + rx
        let cy = this.yPos + ry
        let path = new Path()
        path.MoveTo(cx-rx, cy)
        path.arc(rx, ry, 0, 1, 0, 2*rx, 0)
        path.arc(rx, ry, 0, 1, 0, -2*rx, 0)
        path.close()
        return path.toString()
    }

    get contentBoundingBox(): BoundingBox{
        return {
            x: this.xPos,
            y: this.yPos,
            width: this.width,
            height: this.height
        }
    }
}

export class Tab_RoundedCorners extends Shape implements Shape{
    constructor(xPos: number, yPos: number, width: number, height: number){
        super(xPos, yPos, width, height)
    }

    get shapePath(): string{
        let path = new Path()
        path.MoveTo(this.xPos, this.yPos + this.height)
        path.DrawTo(this.xPos, this.yPos)
        path.DrawTo(this.xPos + this.width, this.yPos)
        path.DrawTo(this.xPos + this.width, this.yPos + this.height)
        path.roundCorners(20)
        path.close()
        return path.toString()
    }

    get contentBoundingBox(): BoundingBox{
        return {
            x: this.xPos,
            y: this.yPos,
            width: this.width,
            height: this.height
        }
    }
    get strokePath(): string {
        let strokePath: Path = new Path(this.shapePath)
        strokePath.removeClose()
        return strokePath.toString()
    }
}
export class Tab_CutCorners extends Shape implements Shape{
    static _z: number;
    constructor(xPos: number, yPos: number, width: number, height: number, length: number){
        super(xPos, yPos, width, height)
        if(!Shape.handleFocused)
            Tab_CutCorners._z = length
    }

    get shapePath(): string{
        let path = new Path()
        path.MoveTo(this.xPos, this.yPos + this.height)
        path.DrawTo(this.xPos, this.yPos + Tab_CutCorners._z)
        path.DrawTo(this.xPos + Tab_CutCorners._z, this.yPos)
        path.DrawTo(this.xPos + this.width - Tab_CutCorners._z, this.yPos)
        path.DrawTo(this.xPos + this.width, this.yPos + Tab_CutCorners._z)
        path.DrawTo(this.xPos + this.width, this.yPos + this.height)
        path.close()
        return path.toString()
    }

    get contentBoundingBox(): BoundingBox{
        return {
            x: this.xPos,
            y: this.yPos,
            width: this.width,
            height: this.height
        }
    }
    get strokePath(): string {
        let strokePath: Path = new Path(this.shapePath)
        strokePath.removeClose()
        return strokePath.toString()
    }
    get handles(): Handle[]{
        let handles: Handle[] = [
            {
                buttonXPos: this.xPos,
                buttonYPos: this.yPos,
                buttonWidth: this.width,
                buttonHeight: this.height,
                get xPos(): number {
                    return this.buttonXPos + this.buttonWidth - this.z
                }, 
                get yPos(): number {
                    return this.buttonYPos
                },
                axis: 'x',
                propName: 'tab_cutCornersLength',
                get z(): number {
                    return Tab_CutCorners._z
                },
                set z(x: number){
                    Tab_CutCorners._z = this.buttonWidth - x
                },
                get disp(): number {
                    return round(this.z)
                },
                get handleFocused(): boolean{
                    return Shape.handleFocused
                },
                set handleFocused(b: boolean){
                    Shape.handleFocused = b
                }
            }
        ]
        return handles
    }
}
export class Tab_CutCorner extends Shape implements Shape{
    static _z: number;
    constructor(xPos: number, yPos: number, width: number, height: number, length: number){
        super(xPos, yPos, width, height)
        if(!Shape.handleFocused)
            Tab_CutCorner._z = length
    }

    get shapePath(): string{
        let path = new Path()
        path.MoveTo(this.xPos, this.yPos + this.height)
        path.DrawTo(this.xPos, this.yPos)
        path.DrawTo(this.xPos + this.width - Tab_CutCorner._z, this.yPos)
        path.DrawTo(this.xPos + this.width, this.yPos + Tab_CutCorner._z)
        path.DrawTo(this.xPos + this.width, this.yPos + this.height)
        path.close()
        return path.toString()
    }

    get contentBoundingBox(): BoundingBox{
        return {
            x: this.xPos,
            y: this.yPos,
            width: this.width,
            height: this.height
        }
    }
    get strokePath(): string {
        let strokePath: Path = new Path(this.shapePath)
        strokePath.removeClose()
        return strokePath.toString()
    }

    get handles(): Handle[]{
        let handles: Handle[] = [
            {
                buttonXPos: this.xPos,
                buttonYPos: this.yPos,
                buttonWidth: this.width,
                buttonHeight: this.height,
                get xPos(): number {
                    return this.buttonXPos + this.buttonWidth - this.z
                }, 
                get yPos(): number {
                    return this.buttonYPos
                },
                axis: 'x',
                propName: 'tab_cutCornerLength',
                get z(): number {
                    return Tab_CutCorner._z
                },
                set z(x: number){
                    Tab_CutCorner._z = this.buttonWidth - x
                },
                get disp(): number {
                    return round(this.z)
                },
                get handleFocused(): boolean{
                    return Shape.handleFocused
                },
                set handleFocused(b: boolean){
                    Shape.handleFocused = b
                }
            }
        ]
        return handles
    }
}

class Path{
    path: string;
    constructor(path?: string){
        this.path = path || ""
    }
    public MoveTo(x, y): void{
        this.path+= ["M",x,y].join(" ") + " "
    }
    public moveTo(x, y): void{
        this.path+= ["m",x,y].join(" ")+ " "
    }
    public DrawTo(x, y): void{
        this.path+= ["L",x,y].join(" ")+ " "
    }
    public drawTo(x, y): void{
        this.path+= ["l",x,y].join(" ")+ " "
    }
    public arc(rx: number, ry:number, rotation: number, arc:number, sweep: number, eX: number, eY: number){
        this.path+= ["a",rx,ry,rotation,arc,sweep,eX,eY].join(" ")+ " "
    }
    
    public roundCorners(radius): void{
        this.path = roundPathCorners(this.path, radius, false)
    }
    public close(): void{
        this.path += 'Z'
    }
    public removeClose(): void{
        if(this.path.endsWith('Z'))
            this.path = this.path.substring(0,  this.path.length-1)
    }
    public toString(): string{
        return this.path
    }
}