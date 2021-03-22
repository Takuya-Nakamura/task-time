const projectColor = [
    { id: 1, color: '#E0282A' },
    { id: 2, color: '#E26C26' },
    { id: 3, color: '#F3BE3A' },
    { id: 4, color: '#49A739' },
    { id: 5, color: '#139E98' },
    { id: 6, color: '#3F9AD8' },
    { id: 7, color: '#262AD2' },
    { id: 8, color: '#7C19EF' },
    { id: 9, color: '#A40067' },
    { id: 10, color: '#8C8E8C' },
]
const getColor = (id) => {
    const item = projectColor.find((item) => item.id == id)
    return item ? item.color : null
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
    cell: 66,
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


}

export { Color, Font, Size, projectColor, getColor }

  // #49A83A
  // #F4BD3A
  // #49A839
  // #159E98
  // #3E98D8
  // #252BD3
  // #7C1BEF
