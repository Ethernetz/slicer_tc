import { PropertyGroupKeys } from '../TilesCollection/interfaces'
import { PropertyGroupValuesWithState, PropertyGroupValuesWithDidChange } from './interfaces'
import { State } from '../TilesCollection/enums'
import powerbi from "powerbi-visuals-api";
import { VisualSettings } from '../settings';


export function getPropertyStateNameArr(propKeys: string[]): PropertyGroupKeys[] {
    let propertyGroupKeysArr: PropertyGroupKeys[] = []
    for (let i = 0; i < propKeys.length; i++)
        if (propKeys[i].endsWith('A'))
            propertyGroupKeysArr.push(getPropertyStateNames(propKeys, propKeys[i].slice(0, -1)))
    return propertyGroupKeysArr
}

export function getPropertyStateNames(propKeys: string[], propBase: string): PropertyGroupKeys {
    return {
        get all(): string { return propKeys.indexOf(propBase + "A") > -1 ? propBase + "A" : null },
        get selected(): string { return propKeys.indexOf(propBase + "S") > -1 ? propBase + "S" : null },
        get unselected(): string { return propKeys.indexOf(propBase + "U") > -1 ? propBase + "U" : null },
        get hover(): string { return propKeys.indexOf(propBase + "H") > -1 ? propBase + "H" : null },
        get default(): string { return propKeys.indexOf(propBase + "D") > -1 ? propBase + "D" : null },
    }
}


export function getObjectsToPersist(visualSettings: VisualSettings): powerbi.VisualObjectInstancesToPersist {
    let objKeys = Object.keys(visualSettings)
    let objects: powerbi.VisualObjectInstancesToPersist = {
        merge: []
    }
    for (let i = 0; i < objKeys.length; i++) {
        let objKey: string = objKeys[i]
        let propKeys: string[] = Object.keys(visualSettings[objKey])
        let groupedKeyNamesArr: PropertyGroupKeys[] = getPropertyStateNameArr(propKeys)
        let object: powerbi.VisualObjectInstance = {
            objectName: objKey,
            selector: undefined,
            properties:
                {}
        }

        for (let j = 0; j < groupedKeyNamesArr.length; j++) {
            let propKeys: PropertyGroupKeys = groupedKeyNamesArr[j]
            let propValues: PropertyGroupValuesWithState = {
                all: visualSettings[objKey][propKeys.all],
                selected: visualSettings[objKey][propKeys.selected],
                unselected: visualSettings[objKey][propKeys.unselected],
                hover: visualSettings[objKey][propKeys.hover],
                state: visualSettings[objKey].state,
                default: visualSettings[objKey][propKeys.default]
            }
            let leveledPropertyState = levelProperties(propValues, propKeys)
            if (leveledPropertyState.didChange) {
                object.properties[propKeys.all] = leveledPropertyState.all
                object.properties[propKeys.selected] = leveledPropertyState.selected
                object.properties[propKeys.unselected] = leveledPropertyState.unselected
                object.properties[propKeys.hover] = leveledPropertyState.hover
            }
        }
        if (Object.keys(object.properties).length != 0)
            objects.merge.push(object)
    }
    return objects
}

export function levelProperties(propValues: PropertyGroupValuesWithState, propKeys: PropertyGroupKeys): PropertyGroupValuesWithDidChange {
    let _all = propValues.all
    let _selected = propValues.selected
    let _unselected = propValues.unselected
    let _hover = propValues.hover
    let allExists = false
    let nullValue = null
    if (typeof _all == 'number') {
        allExists = _all >= 0
    } else {
        allExists = _all != null && _all.length > 0
        nullValue = ""
    }

    let overrideWithAll: boolean = propValues.state == State.all && allExists

    if (_selected == null && propKeys.selected)
        _selected = overrideWithAll ? _all : propValues.default
    if (_unselected == null && propKeys.unselected)
        _unselected = overrideWithAll ? _all : propValues.default
    if (_hover == null && propKeys.hover)
        _hover = overrideWithAll ? _all : propValues.default

    if (_selected == _unselected && _selected == _hover)
        _all = _selected

    if (_selected != _unselected || _selected != _hover)
        _all = nullValue

    let didChange: boolean = (propValues.all != _all ||
        propValues.selected != _selected ||
        propValues.unselected != _unselected ||
        propValues.hover != _hover)



    return {
        all: _all,
        selected: _selected,
        unselected: _unselected,
        hover: _hover,
        default: propValues.default,
        didChange: didChange
    }
}


export function getCorrectPropertyStateName(state: State, propBase: string): string {
    switch (state) {
        case State.all:
            return propBase + "A"
        case State.selected:
            return propBase + "S"
        case State.unselected:
            return propBase + "U"
        case State.hovered:
            return propBase + "H"
    }
}