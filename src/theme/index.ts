import { extendTheme, theme as base, withDefaultColorScheme, withDefaultVariant } from '@chakra-ui/react';
import {StylesConfig, GroupBase} from 'react-select';

const inputSelectStyles = {
  variants: {
    filled: {
      field: {
        _focus: {
          borderColor: 'brand.500',
        }
      }
    }
  },
  sizes: {
    md: {
      field: {
        borderRadius: 'none',
      }
    }
  }
};
    
const theme = extendTheme({
  colors: {
    brand: {
      50: '#ffe4e4',
      100: '#fcb9b9',
      200: '#f48d8c',
      300: '#ed605e',
      400: '#e73432',
      500: '#cd1b18',
      600: '#a11312',
      700: '#730c0b',
      800: '#470505',
      900: '#1f0000',
    }
  },
  fonts: {
    heading: `Monserrat, ${base.fonts?.heading}`,
    body: `Inter, ${base.fonts?.body}`,
  },
  components: {
    Input: { ...inputSelectStyles },
    Select: { ...inputSelectStyles },
    Checkbox: {
      baseStyle: {
        control: {
          borderRadius: 'none',
          _focus: {
            ring: 2,
            ringColor: 'brand.500',
          }
        }
      }
    }
  }    
},
  withDefaultColorScheme({
    colorScheme: 'brand',
    components: ['Checkbox', 'Input', 'Select', 'Button', 'IconButton', 'Tabs']
  }),
  withDefaultVariant({
    variant: 'outline',
    components: ['Input', 'Select']
  }),
);

export default theme;

// For React-Select components
const brandColorVar = 'var(--chakra-colors-brand-500)';

export const selectAppStyles: StylesConfig<{
  value: string;
  label: string;
}, false, GroupBase<{
  value: string;
  label: string;
}>> = {
  option: (base, state) => {
    let backgroundColor = base.backgroundColor;
    if(state.isSelected) {
      backgroundColor = 'var(--chakra-colors-gray-100)';
    } else if(state.isFocused) {
      backgroundColor = 'var(--chakra-colors-gray-50)';
    }

    return {
      ...base,
      backgroundColor: backgroundColor,
      fontWeight: state.isSelected ? 'bold' : base.fontWeight,
    };
  },
  control: (base, state) => ({
    ...base,
    color: state.isFocused ? brandColorVar: base.color,
    borderColor: state.isFocused ? brandColorVar : base.borderColor,
    ":hover": {
      borderColor: brandColorVar,
    },
    boxShadow: state.isFocused ? '0 0 0 1 ' + brandColorVar : base.boxShadow,
  }),
  container: (base, state) => {
    return {
      ...base,
      flex: 1,
    }
  },
  placeholder: (base, state) => {
    return {
      ...base,
    };
  },
  dropdownIndicator: (base, state) => {
    return {
      ...base,
      color: brandColorVar,
    };
  },
  clearIndicator: (base, state) => {
    return {
      ...base,
      color: brandColorVar,
      borderColor: brandColorVar
    };
  },
  loadingIndicator: (base, state) => {
    return {
      ...base,
      color: brandColorVar,
    }
  }
};

export const asyncSelectAppStyles = selectAppStyles as StylesConfig<any, boolean, GroupBase<any>>;