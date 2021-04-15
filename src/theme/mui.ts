import {createMuiTheme} from '@material-ui/core';

export const muiTheme = createMuiTheme({
                                           overrides: {
                                               MuiButton: {
                                                   text: {
                                                       border:     'none',
                                                       fontFamily: 'JetBrains Mono',
                                                   },
                                               },
                                               MuiInput:  {
                                                   root:  {
                                                       fontSize:    'inherit',
                                                       background:  'rgba(245,245,245, .2)',
                                                       '&$focused': {background: 'rgba(245,245,245, .9)'},
                                                   },
                                                   input: {
                                                       fontFamily:   'JetBrains Mono',
                                                       color:        'whitesmoke',
                                                       border:       'none',
                                                       padding:      '5px',
                                                       '&$active':   {background: 'rgba(245,245,245, .9)'},
                                                       '&$disabled': {
                                                           border:     'none',
                                                           background: 'transparent',
                                                       },
                                                   },
                                               },
                                           },
                                       });