import { isIos } from '../util/platform'

const projectColor = [
    // { id: 1, color: '#E0282A' },
    // { id: 2, color: '#E26C26' },
    // { id: 3, color: '#F3BE3A' },
    // { id: 4, color: '#49A739' },
    // { id: 5, color: '#139E98' },
    // { id: 6, color: '#3F9AD8' },
    // { id: 7, color: '#262AD2' },
    // { id: 8, color: '#7C19EF' },
    // { id: 9, color: '#A40067' },
    // { id: 10, color: '#8C8E8C' },

    // { id: 1, color: '#FC8785' },
    // { id: 2, color: '#FC7E9A' },
    // { id: 3, color: '#FCBD6C' },
    // { id: 4, color: '#FEE16C' },
    // { id: 5, color: '#8ADE9B' },
    // { id: 6, color: '#9DDDFC' },
    // { id: 7, color: '#6DABFD' },
    // { id: 8, color: '#9B96E5' },
    // { id: 9, color: '#CC92EB' },
    // { id: 10, color: '#B8B8BD' },

    { id: 11, color: '#E02729' },
    { id: 12, color: '#FA0D44' },
    { id: 13, color: '#FD8108' },
    { id: 14, color: '#FDC30B' },
    { id: 15, color: '#30BF47' },
    { id: 16, color: '#4DBAF9' },
    { id: 17, color: '#0B5FFF' },
    { id: 18, color: '#453BCD' },
    { id: 19, color: '#9C33D6' },
    { id: 20, color: '#7B7B80' },



]
const getColor = (id) => {
    const item = projectColor.find((item) => item.id == id)
    return item ? item.color : projectColor[0].color
}

const Color = {
    backGroundColor: '#fdfdfd',
    defaultGreen: '',
    defaultRed: "#E02729",
    defaultYellow: "#fcba03",
    defaultBlue: '',
    defaultOrange: '#ed7d3b',
    // holiday: '#dddddd',
    // holidayText: '#333',
    holiday: '#ffdddd',
    holidayText: '#E02729',

    cell: 'white',
    saveButton: '#4287f5',
    deleteButton: '#E02729',

    borderColor: 'gray'

}

const Size = {
    row__height: '',
    cell: isIos() ? 65 : 50,
    cell_border: 0.5,
    cell_margin: 5,
    row_height: 44,
    cell_icon_width: 30,
    cell_padding_left: 20,
    button_with: 200,
    button_height: 40,

}

const Font = {
    default: 16,
    labelSize: 20,
    homeHeaderSize: isIos() ? 32 : 24,
    dateHeaderText: isIos() ? 20 : 14,
    dateHeaderSubText: isIos() ? 14 : 10,
}

export { Color, Font, Size, projectColor, getColor }

  // #49A83A
  // #F4BD3A
  // #49A839
  // #159E98
  // #3E98D8
  // #252BD3
  // #7C1BEF
