// @ts-ignore
import {rn_domain_body, rn_domain_close, rn_domain_open, rn_embedmentBody, rn_embedmentNode_open, rn_essence_close, rn_essence_open, rn_location_open, rn_operator, rn_stringNode_open, tok_anchorNode, tok_blockDelimiter, tok_channel, tok_commonDelimiter, tok_concept, tok_direction, tok_domain, tok_domainContainer, tok_embedmentQuote, tok_essence, tok_essentialContainer, tok_evaluation, tok_invocation, tok_location, tok_locationalContainer, tok_operatorDelimiter, tok_performance, tok_perspective, tok_reference, tok_stringQuote, tok_transformation} from '@spwashi/spw/monaco';

const c_white             = '#ffffff';
// constructs / construct components
const c__bracket_fg       = '#7f7f40';
const c_anchor_fg         = '#aaa2a2';
const c_arrow_fg          = '#d29ed1';
const c_channel_fg        = '#47ae76';
const c_delimiter_fg      = '#8d7d7d';
const c_domain_fg         = '#6f91aa';
const c_evaluation_fg     = '#8280bd';
const c_invocation_fg     = '#0fb9b0';
const c_performance_fg    = '#a87a0b';
const c_perspective_fg    = '#d8e280';
const c_stringBody_fg     = '#a7504a';
const c_stringQuote_fg    = '#c08784';
const c_embedmentBody_fg  = '#a7504a';
const c_embedmentQuote_fg = '#c08784';

export const colors = {
    'editor.background': '#1c2024',
};
export const rules  =
                 [
                     // container nodes
                     {token: tok_domain, foreground: c_domain_fg},
                     {token: tok_essence, foreground: c__bracket_fg},
                     {token: tok_concept, foreground: c__bracket_fg},
                     {token: tok_location, foreground: c__bracket_fg},

                     // string
                     {token: rn_stringNode_open, foreground: c_stringBody_fg},
                     {token: tok_stringQuote, foreground: c_stringQuote_fg},

                     {token: rn_embedmentNode_open, foreground: c_embedmentBody_fg},
                     {token: tok_embedmentQuote, foreground: c_embedmentQuote_fg},

                     {token: rn_operator, foreground: c_anchor_fg},

                     // arrows
                     {token: tok_direction, foreground: c_arrow_fg},
                     {token: tok_transformation, foreground: c_arrow_fg},

                     {token: tok_anchorNode, foreground: c_anchor_fg},
                     {token: tok_reference, foreground: c_anchor_fg},
                     {token: tok_perspective, foreground: c_perspective_fg},
                     {token: tok_performance, foreground: c_performance_fg},
                     {token: tok_channel, foreground: c_channel_fg},
                     {token: tok_evaluation, foreground: c_evaluation_fg},
                     {token: tok_invocation, foreground: c_invocation_fg},
                     {token: tok_commonDelimiter, foreground: c_delimiter_fg},
                     {token: tok_blockDelimiter, foreground: c_white},
                 ].map(rule => {
                     return ({...rule, token: rule.token.replace('_', '-')});
                 });