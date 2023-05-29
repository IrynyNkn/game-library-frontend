export const selectStyles = (isError: boolean) => ({
  control: (baseStyles: any, state: any) => ({
    ...baseStyles,
    borderColor: isError ? '#c62828' : state.isFocused ? '#49c5b6' : '#dbe0df',
    boxShadow: 'none',
    paddingTop: 4,
    paddingBottom: 4,
    '&:hover': {
      borderColor: '#49c5b6',
    },
  }),
  option: (baseStyles: any, state: any) => ({
    ...baseStyles,
    backgroundColor: state.isSelected ? '#49c5b6' : '',
    '&:hover': {
      backgroundColor: state.isSelected ? '#49c5b6' : 'rgba(73,197,182,0.2)',
    },
  }),
  placeholder: (baseStyles: any) => ({
    ...baseStyles,
    color: isError ? '#c62828' : '#a6abab',
  }),
});
